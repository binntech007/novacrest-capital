import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
        { error: "Only customers can request withdrawals." },
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

    const amountString =
      typeof body.amount === "string"
        ? body.amount.trim()
        : String(body.amount ?? "");

    const method =
      typeof body.method === "string"
        ? body.method.trim().toUpperCase()
        : "";

    if (!/^\d{1,16}(\.\d{1,2})?$/.test(amountString)) {
      return NextResponse.json(
        { error: "Enter a valid withdrawal amount." },
        { status: 400 }
      );
    }

    const amount = Number(amountString);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Withdrawal amount must be greater than zero." },
        { status: 400 }
      );
    }

    if (method !== "BANK" && method !== "CRYPTO") {
      return NextResponse.json(
        { error: "Invalid withdrawal method." },
        { status: 400 }
      );
    }

    /*
     * BANK WITHDRAWAL
     */
    if (method === "BANK") {
      const bankName =
        typeof body.bankName === "string"
          ? body.bankName.trim()
          : "";

      const accountName =
        typeof body.accountName === "string"
          ? body.accountName.trim()
          : "";

      const accountNumber =
        typeof body.accountNumber === "string"
          ? body.accountNumber.trim()
          : "";

      const routingNumber =
        typeof body.routingNumber === "string"
          ? body.routingNumber.trim()
          : "";

      const swiftCode =
        typeof body.swiftCode === "string"
          ? body.swiftCode.trim()
          : "";

      const iban =
        typeof body.iban === "string"
          ? body.iban.trim()
          : "";

      if (!bankName) {
        return NextResponse.json(
          { error: "Bank name is required." },
          { status: 400 }
        );
      }

      if (!accountName) {
        return NextResponse.json(
          { error: "Account name is required." },
          { status: 400 }
        );
      }

      if (!accountNumber) {
        return NextResponse.json(
          { error: "Account number is required." },
          { status: 400 }
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: {
            userId: session.user.id,
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

        /*
         * Atomic balance check + deduction.
         * This prevents two simultaneous requests from
         * spending the same balance.
         */
        const updatedWallet = await tx.wallet.updateMany({
          where: {
            id: wallet.id,
            balance: {
              gte: amountString,
            },
          },
          data: {
            balance: {
              decrement: amountString,
            },
          },
        });

        if (updatedWallet.count !== 1) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        const withdrawal = await tx.withdrawal.create({
          data: {
            userId: session.user.id,
            amount: amountString,
            currency: wallet.currency,
            method: "BANK",
            status: "PENDING",

            bankName,
            accountName,
            accountNumber,
            routingNumber: routingNumber || null,
            swiftCode: swiftCode || null,
            iban: iban || null,
          },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: amountString,
            type: "WITHDRAWAL",
            description: `Withdrawal request - Bank`,
            reference: `WD-${withdrawal.id}`,
          },
        });

        return {
          withdrawal,
          balance: Number(wallet.balance) - amount,
        };
      });

      return NextResponse.json({
        success: true,
        message: "Bank withdrawal request submitted successfully.",
        withdrawal: result.withdrawal,
        balance: result.balance,
      });
    }

    /*
     * CRYPTO WITHDRAWAL
     */
    const cryptoNetwork =
      typeof body.cryptoNetwork === "string"
        ? body.cryptoNetwork.trim()
        : "";

    const cryptoAddress =
      typeof body.cryptoAddress === "string"
        ? body.cryptoAddress.trim()
        : "";

    if (!cryptoNetwork) {
      return NextResponse.json(
        { error: "Crypto network is required." },
        { status: 400 }
      );
    }

    if (!cryptoAddress) {
      return NextResponse.json(
        { error: "Crypto wallet address is required." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: {
          userId: session.user.id,
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

      const updatedWallet = await tx.wallet.updateMany({
        where: {
          id: wallet.id,
          balance: {
            gte: amountString,
          },
        },
        data: {
          balance: {
            decrement: amountString,
          },
        },
      });

      if (updatedWallet.count !== 1) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: session.user.id,
          amount: amountString,
          currency: wallet.currency,
          method: "CRYPTO",
          status: "PENDING",

          cryptoNetwork,
          cryptoAddress,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: amountString,
          type: "WITHDRAWAL",
          description: `Withdrawal request - Crypto`,
          reference: `WD-${withdrawal.id}`,
        },
      });

      return {
        withdrawal,
        balance: Number(wallet.balance) - amount,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Crypto withdrawal request submitted successfully.",
      withdrawal: result.withdrawal,
      balance: result.balance,
    });
  } catch (error) {
    console.error("WITHDRAWAL ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "WALLET_NOT_FOUND") {
        return NextResponse.json(
          { error: "Wallet not found." },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json(
          { error: "Insufficient available balance." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to submit withdrawal request." },
      { status: 500 }
    );
  }
}