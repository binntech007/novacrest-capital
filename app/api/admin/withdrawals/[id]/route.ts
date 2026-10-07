import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * POST
 *
 * action:
 * - APPROVE
 * - REJECT
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Withdrawal ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const action =
      typeof body.action === "string"
        ? body.action.trim().toUpperCase()
        : "";

    const rejectionReason =
      typeof body.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : "";

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        {
          error: "Action must be APPROVE or REJECT.",
        },
        { status: 400 }
      );
    }

    if (action === "REJECT" && !rejectionReason) {
      return NextResponse.json(
        {
          error: "A rejection reason is required.",
        },
        { status: 400 }
      );
    }

    if (rejectionReason.length > 500) {
      return NextResponse.json(
        {
          error: "Rejection reason cannot exceed 500 characters.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!withdrawal) {
        throw new Error("WITHDRAWAL_NOT_FOUND");
      }

      /*
       * Only pending withdrawals can be processed.
       *
       * This prevents an already approved/rejected withdrawal
       * from being processed a second time.
       */
      if (withdrawal.status !== "PENDING") {
        throw new Error("WITHDRAWAL_ALREADY_PROCESSED");
      }

      /*
       * APPROVE
       *
       * The customer's balance was already reduced when the
       * withdrawal was submitted.
       *
       * Therefore DO NOT deduct the wallet again.
       */
      if (action === "APPROVE") {
        const updatedWithdrawal = await tx.withdrawal.update({
          where: {
            id,
          },
          data: {
            status: "COMPLETED",
            processedAt: new Date(),
            rejectionReason: null,
          },
        });

        return {
          withdrawal: updatedWithdrawal,
          action: "APPROVED",
        };
      }

      /*
       * REJECT
       *
       * Return the withdrawal amount to the customer's wallet.
       */
      const wallet = await tx.wallet.findUnique({
        where: {
          userId: withdrawal.userId,
        },
        select: {
          id: true,
          balance: true,
          currency: true,
        },
      });

      if (!wallet) {
        throw new Error("WALLET_NOT_FOUND");
      }

      const updatedWallet = await tx.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          balance: {
            increment: withdrawal.amount,
          },
        },
      });

      const updatedWithdrawal = await tx.withdrawal.update({
        where: {
          id,
        },
        data: {
          status: "REJECTED",
          rejectionReason,
          processedAt: new Date(),
        },
      });

      /*
       * Record the refund in the wallet ledger.
       */
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          adminId: session.user.id,
          amount: withdrawal.amount,
          type: "CREDIT",
          description: `Withdrawal rejected - funds returned. Reason: ${rejectionReason}`,
          reference: `WDR-${withdrawal.id}`,
        },
      });

      return {
        withdrawal: updatedWithdrawal,
        action: "REJECTED",
        balance: updatedWallet.balance,
      };
    });

    if (result.action === "APPROVED") {
      return NextResponse.json({
        success: true,
        message: "Withdrawal approved successfully.",
        withdrawal: result.withdrawal,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Withdrawal rejected and funds returned to the customer's wallet.",
      withdrawal: result.withdrawal,
      balance: result.balance,
    });
  } catch (error) {
    console.error("PROCESS WITHDRAWAL ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "WITHDRAWAL_NOT_FOUND") {
        return NextResponse.json(
          {
            error: "Withdrawal request not found.",
          },
          { status: 404 }
        );
      }

      if (error.message === "WITHDRAWAL_ALREADY_PROCESSED") {
        return NextResponse.json(
          {
            error:
              "This withdrawal has already been processed and cannot be changed.",
          },
          { status: 409 }
        );
      }

      if (error.message === "WALLET_NOT_FOUND") {
        return NextResponse.json(
          {
            error: "Customer wallet not found.",
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Unable to process withdrawal.",
      },
      { status: 500 }
    );
  }
}