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
        { error: "Only customers can make transfers." },
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

    const recipientEmail =
      typeof body.recipientEmail === "string"
        ? body.recipientEmail
            .trim()
            .toLowerCase()
        : "";

    const amount = Number(body.amount);

    if (!recipientEmail) {
      return NextResponse.json(
        {
          error:
            "Recipient email is required.",
        },
        { status: 400 }
      );
    }

    if (!recipientEmail.includes("@")) {
      return NextResponse.json(
        {
          error:
            "Enter a valid recipient email.",
        },
        { status: 400 }
      );
    }

    if (!isValidAmount(amount)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid transfer amount.",
        },
        { status: 400 }
      );
    }

    if (amount > 1_000_000_000) {
      return NextResponse.json(
        {
          error:
            "Transfer amount is too large.",
        },
        { status: 400 }
      );
    }

    const senderId = session.user.id;

    const result = await prisma.$transaction(
      async (tx) => {
        /*
         * Find recipient.
         */
        const recipient =
          await tx.user.findUnique({
            where: {
              email: recipientEmail,
            },

            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
            },
          });

        if (!recipient) {
          throw new Error(
            "No customer was found with that email address."
          );
        }

        if (recipient.id === senderId) {
          throw new Error(
            "You cannot transfer money to yourself."
          );
        }

        if (recipient.role !== "CUSTOMER") {
          throw new Error(
            "Money can only be transferred to another customer."
          );
        }

        if (recipient.status !== "ACTIVE") {
          throw new Error(
            "The recipient account is not active."
          );
        }

        /*
         * Find sender wallet.
         */
        const senderWallet =
          await tx.wallet.findUnique({
            where: {
              userId: senderId,
            },
          });

        if (!senderWallet) {
          throw new Error(
            "Your main wallet was not found."
          );
        }

        /*
         * Check balance.
         */
        if (
          Number(senderWallet.balance) <
          amount
        ) {
          throw new Error(
            "Insufficient main account balance."
          );
        }

        /*
         * Prevent transfers between different currencies.
         */
        const recipientWallet =
          await tx.wallet.findUnique({
            where: {
              userId: recipient.id,
            },
          });

        if (
          recipientWallet &&
          recipientWallet.currency !==
            senderWallet.currency
        ) {
          throw new Error(
            "Sender and recipient wallets use different currencies."
          );
        }

        /*
         * Make sure recipient has a wallet.
         */
        const destinationWallet =
          recipientWallet ??
          (await tx.wallet.create({
            data: {
              userId: recipient.id,
              currency:
                senderWallet.currency,
              balance: 0,
            },
          }));

        /*
         * Debit sender.
         *
         * The balance condition makes this safer against
         * two simultaneous transfers spending the same
         * funds.
         */
        const senderUpdate =
          await tx.wallet.updateMany({
            where: {
              id: senderWallet.id,
              balance: {
                gte: amount,
              },
            },

            data: {
              balance: {
                decrement: amount,
              },
            },
          });

        if (senderUpdate.count !== 1) {
          throw new Error(
            "Insufficient balance or wallet was updated. Please try again."
          );
        }

        /*
         * Credit recipient.
         */
        const updatedRecipientWallet =
          await tx.wallet.update({
            where: {
              id: destinationWallet.id,
            },

            data: {
              balance: {
                increment: amount,
              },
            },
          });

        /*
         * Create transfer record.
         */
        const transfer =
          await tx.internalTransfer.create({
            data: {
              senderId,
              recipientId: recipient.id,
              recipientEmail:
                recipient.email,
              type: "CUSTOMER_TO_CUSTOMER",
              amount,
              currency:
                senderWallet.currency,
              description:
                `Transfer to ${recipient.email}`,
              status: "COMPLETED",
            },
          });

        /*
         * Sender transaction.
         */
        await tx.walletTransaction.create({
          data: {
            walletId: senderWallet.id,
            amount,
            type: "WITHDRAWAL",
            description:
              `Transfer to ${recipient.email}`,
            reference: `TR-OUT-${transfer.id}`,
          },
        });

        /*
         * Recipient transaction.
         */
        await tx.walletTransaction.create({
          data: {
            walletId:
              updatedRecipientWallet.id,
            amount,
            type: "CREDIT",
            description:
              `Transfer received from customer`,
            reference: `TR-IN-${transfer.id}`,
          },
        });

        return {
          transfer,
          senderBalance:
            Number(
              senderWallet.balance
            ) - amount,
          recipientName:
            recipient.name ||
            recipient.email,
        };
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Money transferred successfully.",
      transfer: {
        id: result.transfer.id,
        reference:
          result.transfer.reference,
        amount: Number(
          result.transfer.amount
        ),
        recipient:
          result.recipientName,
      },
      balance:
        result.senderBalance,
    });
  } catch (error) {
    console.error(
      "CUSTOMER TRANSFER ERROR:",
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