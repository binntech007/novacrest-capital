import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedDocumentTypes = [
  "PASSPORT",
  "NATIONAL_ID",
  "DRIVERS_LICENSE",
] as const;

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    // ---------------------------------------------------------
    // REQUEST BODY
    // ---------------------------------------------------------

    const body = await request.json();

    const {
      documentType,
      documentNumber,
    } = body;

    // ---------------------------------------------------------
    // VALIDATE DOCUMENT TYPE
    // ---------------------------------------------------------

    if (
      !documentType ||
      !allowedDocumentTypes.includes(documentType)
    ) {
      return NextResponse.json(
        {
          error: "Please select a valid document type.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // VALIDATE DOCUMENT NUMBER
    // ---------------------------------------------------------

    if (
      !documentNumber ||
      typeof documentNumber !== "string" ||
      !documentNumber.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your document number.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // FIND KYC APPLICATION
    // ---------------------------------------------------------

    const existingKyc =
      await prisma.kycApplication.findUnique({
        where: {
          userId: session.user.id,
        },
      });

    if (!existingKyc) {
      return NextResponse.json(
        {
          error:
            "Please complete Step 1 before continuing.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // MAKE SURE STEP 1 IS COMPLETE
    // ---------------------------------------------------------

    if (
      !existingKyc.firstName ||
      !existingKyc.lastName ||
      !existingKyc.dateOfBirth ||
      !existingKyc.country ||
      !existingKyc.state ||
      !existingKyc.city ||
      !existingKyc.address ||
      !existingKyc.phone
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required information in Step 1.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // MAKE SURE FRONT DOCUMENT WAS UPLOADED
    // ---------------------------------------------------------

    if (!existingKyc.documentFrontId) {
      return NextResponse.json(
        {
          error:
            "Please upload the front of your identity document.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // MAKE SURE BACK DOCUMENT WAS UPLOADED
    // ---------------------------------------------------------

    if (!existingKyc.documentBackId) {
      return NextResponse.json(
        {
          error:
            "Please upload the back of your identity document.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // PREVENT RESUBMITTING AN APPROVED APPLICATION
    // ---------------------------------------------------------

    if (existingKyc.status === "APPROVED") {
      return NextResponse.json(
        {
          error:
            "Your KYC application has already been approved.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // PREVENT SUBMITTING AN APPLICATION ALREADY UNDER REVIEW
    // ---------------------------------------------------------

    if (existingKyc.status === "PENDING") {
      return NextResponse.json(
        {
          error:
            "Your KYC application is already under review.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // SUBMIT KYC
    // ---------------------------------------------------------

    const kyc =
      await prisma.kycApplication.update({
        where: {
          userId: session.user.id,
        },

        data: {
          documentType,
          documentNumber: documentNumber.trim(),

          status: "PENDING",
          currentStep: 2,
          submittedAt: new Date(),

          // Clear previous rejection information
          // when the customer submits again.
          rejectionReason: null,
          reviewedAt: null,
          reviewedById: null,
        },
      });

    // ---------------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,
      kycId: kyc.id,
      status: kyc.status,
    });
  } catch (error) {
    console.error("KYC Step 2 error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while submitting your KYC.",
      },
      { status: 500 },
    );
  }
}