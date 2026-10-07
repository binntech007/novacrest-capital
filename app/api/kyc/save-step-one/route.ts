import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
      firstName,
      lastName,
      dateOfBirth,
      country,
      state,
      city,
      address,
      postalCode,
      phone,
    } = body;

    // ---------------------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------------------

    if (
      typeof firstName !== "string" ||
      !firstName.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your first name.",
        },
        { status: 400 },
      );
    }

    if (
      typeof lastName !== "string" ||
      !lastName.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your last name.",
        },
        { status: 400 },
      );
    }

    if (
      typeof dateOfBirth !== "string" ||
      !dateOfBirth.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please provide your date of birth.",
        },
        { status: 400 },
      );
    }

    if (
      typeof country !== "string" ||
      !country.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please select your country.",
        },
        { status: 400 },
      );
    }

    if (
      typeof state !== "string" ||
      !state.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your state or province.",
        },
        { status: 400 },
      );
    }

    if (
      typeof city !== "string" ||
      !city.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your city.",
        },
        { status: 400 },
      );
    }

    if (
      typeof address !== "string" ||
      !address.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your residential address.",
        },
        { status: 400 },
      );
    }

    if (
      typeof phone !== "string" ||
      !phone.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please enter your phone number.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // DATE VALIDATION
    // ---------------------------------------------------------

    const parsedDate = new Date(dateOfBirth);

    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          error: "Please provide a valid date of birth.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // CHECK DATE IS NOT IN THE FUTURE
    // ---------------------------------------------------------

    const now = new Date();

    if (parsedDate > now) {
      return NextResponse.json(
        {
          error:
            "Date of birth cannot be in the future.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // FIND EXISTING KYC APPLICATION
    // ---------------------------------------------------------

    const existingKyc =
      await prisma.kycApplication.findUnique({
        where: {
          userId: session.user.id,
        },
      });

    // ---------------------------------------------------------
    // PREVENT EDITING AN APPROVED APPLICATION
    // ---------------------------------------------------------

    if (existingKyc?.status === "APPROVED") {
      return NextResponse.json(
        {
          error:
            "Your KYC application has already been approved.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // PREVENT EDITING AN APPLICATION UNDER REVIEW
    // ---------------------------------------------------------

    if (existingKyc?.status === "PENDING") {
      return NextResponse.json(
        {
          error:
            "Your KYC application is currently under review.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // CREATE OR UPDATE KYC
    // ---------------------------------------------------------

    const kyc =
      await prisma.kycApplication.upsert({
        where: {
          userId: session.user.id,
        },

        create: {
          userId: session.user.id,

          status: "IN_PROGRESS",
          currentStep: 2,

          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: parsedDate,

          country: country.trim(),
          state: state.trim(),
          city: city.trim(),
          address: address.trim(),

          postalCode:
            typeof postalCode === "string" &&
            postalCode.trim()
              ? postalCode.trim()
              : null,

          phone: phone.trim(),
        },

        update: {
          status: "IN_PROGRESS",
          currentStep: 2,

          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: parsedDate,

          country: country.trim(),
          state: state.trim(),
          city: city.trim(),
          address: address.trim(),

          postalCode:
            typeof postalCode === "string" &&
            postalCode.trim()
              ? postalCode.trim()
              : null,

          phone: phone.trim(),

          // Clear old rejection information when
          // the customer starts a new submission.
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
      currentStep: kyc.currentStep,
    });
  } catch (error) {
    console.error("KYC Step 1 error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while saving your information.",
      },
      { status: 500 },
    );
  }
}