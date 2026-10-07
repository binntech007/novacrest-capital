
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(request: Request) {
  try {
    // 1. Authenticate the current user.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to update your profile." },
        { status: 401 },
      );
    }

    // 2. Confirm the user is an active customer.
    if (
      session.user.role !== "CUSTOMER" ||
      session.user.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { error: "Your account cannot update this profile." },
        { status: 403 },
      );
    }

    // 3. Confirm the account still exists and is active in the database.
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (
      !existingUser ||
      existingUser.role !== "CUSTOMER" ||
      existingUser.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { error: "Your account cannot update this profile." },
        { status: 403 },
      );
    }

    // 4. Read the submitted form.
    const formData = await request.formData();

    const firstName = String(
      formData.get("firstName") ?? "",
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? "",
    ).trim();

    // The form component sends the image under the "image" field.
    const imageFile = formData.get("image");

    // 5. Validate names.
    if (
      firstName.length < 2 ||
      firstName.length > 60 ||
      lastName.length < 2 ||
      lastName.length > 60
    ) {
      return NextResponse.json(
        {
          error:
            "First and last names must be between 2 and 60 characters.",
        },
        { status: 400 },
      );
    }

    // 6. Validate the optional image.
    let imageUrl: string | undefined;

    if (imageFile instanceof File && imageFile.size > 0) {
      if (!ALLOWED_TYPES.has(imageFile.type)) {
        return NextResponse.json(
          { error: "Choose a JPG, PNG, or WebP image." },
          { status: 400 },
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Your profile picture must be 5 MB or smaller." },
          { status: 400 },
        );
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
          {
            error:
              "Profile picture uploads are not configured yet. You can still update your name.",
          },
          { status: 503 },
        );
      }

      // 7. Upload the image to Cloudinary.
      const bytes = await imageFile.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUri = `data:${imageFile.type};base64,${base64}`;

      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "novacrest-capital/profile-pictures",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "limit",
          },
        ],
      });

      imageUrl = uploaded.secure_url;
    } else if (imageFile !== null && !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "The uploaded profile picture is invalid." },
        { status: 400 },
      );
    }

    // 8. Update only fields that exist in your Prisma User model.
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // 9. Return the updated profile to the client component.
    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Customer profile update failed:", error);

    return NextResponse.json(
      { error: "Unable to update your profile right now." },
      { status: 500 },
    );
  }
}
