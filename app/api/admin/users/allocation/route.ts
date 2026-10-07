import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const AMOUNT_REGEX = /^\d{1,16}(\.\d{1,2})?$/;

export async function PATCH(request: Request) {
  try {
    // ---------------------------------------------------------
    // 1. Authenticate the request
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // 2. Make sure the user is an admin
    // ---------------------------------------------------------

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized to perform this action.",
        },
        { status: 403 },
      );
    }

    // ---------------------------------------------------------
    // 3. Read request body
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // 4. Validate customer ID
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // 5. Validate active investment amount
    // ---------------------------------------------------------

    const activeInvestmentAmount =
      typeof data.activeInvestmentAmount === "string"
        ? data.activeInvestmentAmount.trim()
        : String(data.activeInvestmentAmount ?? "").trim();

    if (
      !activeInvestmentAmount ||
      !AMOUNT_REGEX.test(activeInvestmentAmount)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Active investment amount must be a valid number with no more than two decimal places.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // 6. Validate trading bot amount
    // ---------------------------------------------------------

    const tradingBotAmount =
      typeof data.tradingBotAmount === "string"
        ? data.tradingBotAmount.trim()
        : String(data.tradingBotAmount ?? "").trim();

    if (
      !tradingBotAmount ||
      !AMOUNT_REGEX.test(tradingBotAmount)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trading bot amount must be a valid number with no more than two decimal places.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // 7. Convert to numbers for range validation only
    // ---------------------------------------------------------

    const investmentNumber = Number(
      activeInvestmentAmount,
    );

    const tradingBotNumber = Number(tradingBotAmount);

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
      !Number.isFinite(tradingBotNumber) ||
      tradingBotNumber < 0
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

    // ---------------------------------------------------------
    // 8. Make sure the customer exists
    // ---------------------------------------------------------

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
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        { status: 404 },
      );
    }

    // ---------------------------------------------------------
    // 9. Make sure the selected user is a customer
    // ---------------------------------------------------------

    if (customer.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Allocations can only be updated for customer accounts.",
        },
        { status: 400 },
      );
    }

    // ---------------------------------------------------------
    // 10. Update or create the customer's allocation
    // ---------------------------------------------------------

    const allocation =
      await prisma.customerAllocation.upsert({
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
          userId: true,
          activeInvestmentAmount: true,
          tradingBotAmount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    // ---------------------------------------------------------
    // 11. Return the updated values
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Customer investment and trading bot allocations updated successfully.",

      allocation: {
        id: allocation.id,
        userId: allocation.userId,

        activeInvestmentAmount:
          allocation.activeInvestmentAmount.toString(),

        tradingBotAmount:
          allocation.tradingBotAmount.toString(),

        createdAt: allocation.createdAt,
        updatedAt: allocation.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN CUSTOMER ALLOCATION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update customer allocations. Please try again.",
      },
      { status: 500 },
    );
  }
}