import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ReviewAction = "APPROVE" | "REJECT";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
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
    // ADMIN CHECK
    // ---------------------------------------------------------

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 },
      );
    }

    // ---------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "KYC application ID is required." },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // BODY
    // ---------------------------------------------------------

    const body = await request.json();

    const action = body.action as ReviewAction;
    const rejectionReason =
      typeof body.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : "";

    // ---------------------------------------------------------
    // VALIDATE ACTION
    // ---------------------------------------------------------

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid review action.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // REJECTION REASON
    // ---------------------------------------------------------

    if (
      action === "REJECT" &&
      !rejectionReason
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a reason for rejecting this application.",
        },
        { status: 400 },
      );
    }

    if (
      action === "REJECT" &&
      rejectionReason.length > 1000
    ) {
      return NextResponse.json(
        {
          error:
            "The rejection reason must be 1000 characters or less.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // FIND APPLICATION
    // ---------------------------------------------------------

    const application =
      await prisma.kycApplication.findUnique({
        where: {
          id,
        },
      });

    if (!application) {
      return NextResponse.json(
        {
          error:
            "KYC application not found.",
        },
        { status: 404 },
      );
    }

    // ---------------------------------------------------------
    // ONLY PENDING APPLICATIONS CAN BE REVIEWED
    // ---------------------------------------------------------

    if (application.status !== "PENDING") {
      return NextResponse.json(
        {
          error:
            "Only pending KYC applications can be reviewed.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // APPROVE
    // ---------------------------------------------------------

    if (action === "APPROVE") {
      const updated =
        await prisma.kycApplication.update({
          where: {
            id,
          },

          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            reviewedById: session.user.id,
            rejectionReason: null,
          },
        });

      return NextResponse.json({
        success: true,
        status: updated.status,
      });
    }

    // ---------------------------------------------------------
    // REJECT
    // ---------------------------------------------------------

    const updated =
      await prisma.kycApplication.update({
        where: {
          id,
        },

        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewedById: session.user.id,
          rejectionReason,
        },
      });

    return NextResponse.json({
      success: true,
      status: updated.status,
    });
  } catch (error) {
    console.error(
      "Admin KYC review error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while reviewing the KYC application.",
      },
      { status: 500 },
    );
  }
}