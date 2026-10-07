import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function isValidAmount(value: unknown): value is number {
  if (typeof value !== "number") {
    return false;
  }

  return Number.isFinite(value) && value > 0;
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can make this transfer." },
        { status: 403 }
      );
    }

    if (session.user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is not active." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const amount = Number(body.amount);

    if (!isValidAmount(amount)) {
      return NextResponse.json(
        { error: "Enter a valid transfer amount." },
        { status: 400 }
      );
    }

    if (amount > 1_000_000_000) {
      return NextResponse.json(
        { error: "Transfer amount is too large." },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * Lock the allocation logically by updating only when
         * enough investment balance is available.
         */
        const allocation =
          await tx.customerAllocation.findUnique({
            where: {
              userId,
            },
          });

        if (!allocation) {
          throw new Error(
            "Investment account not found."
          );
        }

        const investmentBalance = Number(
          allocation.activeInvestmentAmount
        );

        if (investmentBalance < amount) {
          throw new Error(
            "Insufficient investment account balance."
          );
        }

        /*
         * Get or create the customer's main wallet.
         */
        const wallet =
          await tx.wallet.findUnique({
            where: {
              userId,
            },
          });

        if (!wallet) {
          throw new Error(
            "Main wallet not found."
          );
        }

        /*
         * Reduce investment allocation.
         */
        const updatedAllocation =
          await tx.customerAllocation.update({
            where: {
              userId,
            },

            data: {
              activeInvestmentAmount: {
                decrement: amount,
              },
            },
          });

        /*
         * Add funds to main wallet.
         */
        const updatedWallet =
          await tx.wallet.update({
            where: {
              userId,
            },

            data: {
              balance: {
                increment: amount,
              },
            },
          });

        /*
         * Create audit transfer.
         */
        const transfer =
          await tx.internalTransfer.create({
            data: {
              senderId: userId,
              type: "INVESTMENT_TO_MAIN",
              amount,
              currency:
                wallet.currency || "USD",
              description:
                "Transfer from investment account to main account",
              status: "COMPLETED",
            },
          });

        /*
         * Record the money entering the main wallet.
         */
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: "CREDIT",
            description:
              "Transfer from investment account to main account",
            reference: `TR-${transfer.id}`,
          },
        });

        return {
          transfer,
          balance: Number(
            updatedWallet.balance
          ),
          investmentBalance: Number(
            updatedAllocation.activeInvestmentAmount
          ),
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Funds transferred to your main account successfully.",
      transfer: {
        id: result.transfer.id,
        reference: result.transfer.reference,
        amount: Number(
          result.transfer.amount
        ),
      },
      balance: result.balance,
      investmentBalance:
        result.investmentBalance,
    });
  } catch (error) {
    console.error(
      "INVESTMENT TO MAIN TRANSFER ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete transfer.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      }
    );
  }
}