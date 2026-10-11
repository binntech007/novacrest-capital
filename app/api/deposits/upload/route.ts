
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in before uploading a receipt." },
        { status: 401 }
      );
    }

    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can upload deposit receipts." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select a receipt image." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The receipt must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "novacrest/deposit-receipts",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Receipt upload failed."));
            return;
          }

          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Deposit receipt upload failed:", error);

    return NextResponse.json(
      { error: "Could not upload the receipt. Please try again." },
      { status: 500 }
    );
  }
}
