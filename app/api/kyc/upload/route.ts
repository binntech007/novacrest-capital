import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type DocumentField =
  | "documentFront"
  | "documentBack";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const field = formData.get("field") as DocumentField | null;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a document." },
        { status: 400 },
      );
    }

    if (
      field !== "documentFront" &&
      field !== "documentBack"
    ) {
      return NextResponse.json(
        { error: "Invalid document field." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WebP images are allowed.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "The document must be smaller than 5 MB.",
        },
        { status: 400 },
      );
    }

    const kyc = await prisma.kycApplication.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!kyc) {
      return NextResponse.json(
        {
          error:
            "Please complete Step 1 before uploading documents.",
        },
        { status: 400 },
      );
    }

    if (
      kyc.status === "APPROVED" ||
      kyc.status === "PENDING"
    ) {
      return NextResponse.json(
        {
          error:
            "Your KYC application is already submitted.",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicId = `kyc/${session.user.id}/${field}`;

    const uploadResult = await new Promise<{
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: undefined,

            resource_type: "image",

            // Important:
            // The document is not uploaded as a normal
            // publicly accessible Cloudinary asset.
            type: "authenticated",

            overwrite: true,

            invalidate: true,

            context: {
              userId: session.user.id,
              purpose: "kyc",
            },
          },
          (error, result) => {
            if (error || !result) {
              reject(
                error ||
                  new Error("Cloudinary upload failed."),
              );
              return;
            }

            resolve({
              public_id: result.public_id,
            });
          },
        );

      uploadStream.end(buffer);
    });

    const updateData =
      field === "documentFront"
        ? {
            documentFrontId: uploadResult.public_id,
          }
        : {
            documentBackId: uploadResult.public_id,
          };

    await prisma.kycApplication.update({
      where: {
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      publicId: uploadResult.public_id,
      field,
    });
  } catch (error) {
    console.error("KYC document upload error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to upload the document. Please try again.",
      },
      { status: 500 },
    );
  }
}