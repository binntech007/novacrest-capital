import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { redirect, notFound } from "next/navigation";
import KycReview from "./KycReview";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function createSecureImageUrl(
  publicId: string | null,
) {
  if (!publicId) {
    return null;
  }

  try {
    return cloudinary.url(publicId, {
      secure: true,
      resource_type: "image",
      type: "authenticated",
      sign_url: true,
    });
  } catch (error) {
    console.error(
      "Unable to generate KYC document URL:",
      error,
    );

    return null;
  }
}

export default async function AdminKycDetailsPage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const application =
    await prisma.kycApplication.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            createdAt: true,
          },
        },

        reviewedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

  if (!application) {
    notFound();
  }

  const documentFrontUrl =
    createSecureImageUrl(
      application.documentFrontId,
    );

  const documentBackUrl =
    createSecureImageUrl(
      application.documentBackId,
    );

  return (
    <KycReview
      application={{
        id: application.id,
        status: application.status,
        currentStep: application.currentStep,

        firstName: application.firstName,
        lastName: application.lastName,
        dateOfBirth: application.dateOfBirth,

        country: application.country,
        state: application.state,
        city: application.city,
        address: application.address,
        postalCode: application.postalCode,
        phone: application.phone,

        documentType:
          application.documentType,

        documentNumber:
          application.documentNumber,

        submittedAt:
          application.submittedAt,

        reviewedAt:
          application.reviewedAt,

        rejectionReason:
          application.rejectionReason,

        documentFrontUrl,
        documentBackUrl,

        user: {
          firstName:
            application.user.firstName,

          lastName:
            application.user.lastName,

          email:
            application.user.email,

          status:
            application.user.status,

          createdAt:
            application.user.createdAt,
        },

        reviewedBy:
          application.reviewedBy
            ? {
                firstName:
                  application.reviewedBy
                    .firstName,

                lastName:
                  application.reviewedBy
                    .lastName,

                email:
                  application.reviewedBy.email,
              }
            : null,
      }}
    />
  );
}