import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AMOUNT_REGEX = /^\d{1,16}(\.\d{1,2})?$/;
const MAX_REASON_LENGTH = 200;

export async function PATCH(request: Request) {
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
    // READ REQUEST BODY
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

    // =========================================================
    // USER ID
    // =========================================================

    const userId =
      typeof data.userId === "string"
        ? data.userId.trim()
        : "";

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
    // VALUES
    // =========================================================

    const balance =
      typeof data.balance === "string"
        ? data.balance.trim()
        : String(data.balance ?? "").trim();

    const activeInvestmentAmount =
      typeof data.activeInvestmentAmount === "string"
        ? data.activeInvestmentAmount.trim()
        : String(
            data.activeInvestmentAmount ?? "",
          ).trim();

    const tradingBotAmount =
      typeof data.tradingBotAmount === "string"
        ? data.tradingBotAmount.trim()
        : String(
            data.tradingBotAmount ?? "",
          ).trim();

    // =========================================================
    // REASON / REFERENCE
    // =========================================================

    const reason =
      typeof data.reason === "string"
        ? data.reason.trim()
        : "";

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A reason or reference is required for this account update.",
        },
        { status: 400 },
      );
    }

    if (reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The reason must be 200 characters or fewer.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // VALIDATE WALLET BALANCE
    // =========================================================

    if (!AMOUNT_REGEX.test(balance)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Wallet balance must be a valid number with no more than two decimal places.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // VALIDATE INVESTMENT
    // =========================================================

    if (!AMOUNT_REGEX.test(activeInvestmentAmount)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Active investment amount must be a valid number with no more than two decimal places.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // VALIDATE TRADING BOT
    // =========================================================

    if (!AMOUNT_REGEX.test(tradingBotAmount)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trading bot amount must be a valid number with no more than two decimal places.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // CONVERT VALUES
    // =========================================================

    const balanceNumber = Number(balance);
    const investmentNumber = Number(
      activeInvestmentAmount,
    );
    const botNumber = Number(tradingBotAmount);

    // =========================================================
    // CHECK NEGATIVE VALUES
    // =========================================================

    if (
      !Number.isFinite(balanceNumber) ||
      balanceNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet balance cannot be negative.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(investmentNumber) ||
      investmentNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Active investment amount cannot be negative.",
        },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(botNumber) ||
      botNumber < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trading bot amount cannot be negative.",
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
        status: true,

        wallet: {
          select: {
            id: true,
            balance: true,
            currency: true,
          },
        },

        customerAllocation: {
          select: {
            id: true,
            activeInvestmentAmount: true,
            tradingBotAmount: true,
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
            "Only customer accounts can be updated.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // DATABASE TRANSACTION
    // =========================================================

    const result = await prisma.$transaction(
      async (tx) => {
        // -------------------------------------------------------
        // PREVIOUS WALLET BALANCE
        // -------------------------------------------------------

        const previousBalance = customer.wallet
          ? Number(customer.wallet.balance)
          : 0;

        // -------------------------------------------------------
        // CALCULATE BALANCE DIFFERENCE
        // -------------------------------------------------------

        const balanceDifference =
          balanceNumber - previousBalance;

        // -------------------------------------------------------
        // CREATE OR UPDATE WALLET
        // -------------------------------------------------------

        const wallet = customer.wallet
          ? await tx.wallet.update({
              where: {
                id: customer.wallet.id,
              },

              data: {
                balance,
              },

              select: {
                id: true,
                balance: true,
                currency: true,
              },
            })
          : await tx.wallet.create({
              data: {
                userId,
                balance,
                currency: "USD",
              },

              select: {
                id: true,
                balance: true,
                currency: true,
              },
            });

        // -------------------------------------------------------
        // CREATE OR UPDATE CUSTOMER ALLOCATION
        // -------------------------------------------------------

        const allocation =
          await tx.customerAllocation.upsert({
            where: {
              userId,
            },

            create: {
              userId,
              activeInvestmentAmount,
              tradingBotAmount,
            },

            update: {
              activeInvestmentAmount,
              tradingBotAmount,
            },

            select: {
              id: true,
              activeInvestmentAmount: true,
              tradingBotAmount: true,
            },
          });

        // -------------------------------------------------------
        // AUDIT WALLET BALANCE CHANGE
        // -------------------------------------------------------

        if (balanceDifference !== 0) {
          const transactionType =
            balanceDifference > 0
              ? "CREDIT"
              : "WITHDRAWAL";

          const transactionDescription =
            balanceDifference > 0
              ? ` NOTE: ${reason}`
              : ` NOTE: ${reason}`;

          await tx.walletTransaction.create({
            data: {
              walletId: wallet.id,

              adminId: session.user.id,

              amount: Math.abs(
                balanceDifference,
              ).toFixed(2),

              type: transactionType,

              description:
                transactionDescription,
            },
          });
        }

        // -------------------------------------------------------
        // RETURN UPDATED DATA
        // -------------------------------------------------------

        return {
          wallet,
          allocation,
        };
      },
    );

    // =========================================================
    // SUCCESS RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,

      message:
        "Customer account updated successfully.",

      account: {
        userId,

        balance:
          result.wallet.balance.toString(),

        currency:
          result.wallet.currency,

        activeInvestmentAmount:
          result.allocation.activeInvestmentAmount.toString(),

        tradingBotAmount:
          result.allocation.tradingBotAmount.toString(),
      },
    });
  } catch (error) {
    // =========================================================
    // ERROR HANDLING
    // =========================================================

    console.error(
      "ADMIN ACCOUNT UPDATE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update the customer account. Please try again.",
      },
      { status: 500 },
    );
  }
}