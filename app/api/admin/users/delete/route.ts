import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    // =========================================================
    // AUTHENTICATION
    // =========================================================

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please log in again.",
        },
        { status: 401 },
      );
    }

    // =========================================================
    // ADMIN CHECK
    // =========================================================

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are not authorized to perform this action.",
        },
        { status: 403 },
      );
    }

    // =========================================================
    // READ BODY
    // =========================================================

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data.",
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const userId =
      typeof data.userId === "string"
        ? data.userId.trim()
        : "";

    const confirmation =
      typeof data.confirmation === "string"
        ? data.confirmation.trim()
        : "";

    // =========================================================
    // VALIDATE CUSTOMER ID
    // =========================================================

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer ID is required.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // VALIDATE DELETE CONFIRMATION
    // =========================================================

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        {
          success: false,
          error:
            'Type "DELETE" to permanently remove this customer account.',
        },
        { status: 400 },
      );
    }

    // =========================================================
    // PREVENT ADMIN SELF-DELETION
    // =========================================================

    if (userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You cannot delete your own administrator account.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // FIND CUSTOMER
    // =========================================================

    const customer = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,

        wallet: {
          select: {
            id: true,
          },
        },
      },
    });

    // =========================================================
    // CUSTOMER NOT FOUND
    // =========================================================

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        { status: 404 },
      );
    }

    // =========================================================
    // ONLY CUSTOMER ACCOUNTS
    // =========================================================

    if (customer.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Only customer accounts can be deleted from this page.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // DELETE CUSTOMER
    // =========================================================

    await prisma.$transaction(async (tx) => {
      /*
       * IMPORTANT:
       * WalletTransaction uses onDelete: Restrict.
       * Therefore wallet transactions must be deleted
       * before the wallet itself can be deleted.
       */

      if (customer.wallet) {
        await tx.walletTransaction.deleteMany({
          where: {
            walletId: customer.wallet.id,
          },
        });
      }

      // -------------------------------------------------------
      // DELETE CUSTOMER ALLOCATION
      // -------------------------------------------------------

      await tx.customerAllocation.deleteMany({
        where: {
          userId,
        },
      });

      // -------------------------------------------------------
      // DELETE WALLET
      // -------------------------------------------------------

      if (customer.wallet) {
        await tx.wallet.delete({
          where: {
            id: customer.wallet.id,
          },
        });
      }

      // -------------------------------------------------------
      // DELETE KYC APPLICATION
      // -------------------------------------------------------

      await tx.kycApplication.deleteMany({
        where: {
          userId,
        },
      });

      // -------------------------------------------------------
      // DELETE AUTH SESSIONS
      // -------------------------------------------------------

      await tx.session.deleteMany({
        where: {
          userId,
        },
      });

      // -------------------------------------------------------
      // DELETE AUTH ACCOUNTS
      // -------------------------------------------------------

      await tx.account.deleteMany({
        where: {
          userId,
        },
      });

      // -------------------------------------------------------
      // DELETE USER
      // -------------------------------------------------------

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    // =========================================================
    // SUCCESS
    // =========================================================

    const customerName =
      `${customer.firstName} ${customer.lastName}`.trim();

    return NextResponse.json({
      success: true,

      message: `Customer account for ${customerName || customer.email} has been permanently deleted.`,
    });
  } catch (error) {
    console.error(
      "ADMIN DELETE CUSTOMER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete the customer account. The account may have related records that must be handled first.",
      },
      { status: 500 },
    );
  }
}