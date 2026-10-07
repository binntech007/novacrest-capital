import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

const PLANS = {
  gold: {
    id: "gold",
    name: "Gold Plan",
    min: 1000,
    max: 5000,
    dailyRate: "5%",
    roi: "15%",
    duration: 3,
    commission: "10%",
  },

  diamond: {
    id: "diamond",
    name: "Diamond Plan",
    min: 3000,
    max: 10000,
    dailyRate: "4%",
    roi: "20%",
    duration: 5,
    commission: "10%",
  },

  platinum: {
    id: "platinum",
    name: "Platinum Plan",
    min: 10000,
    max: 25000,
    dailyRate: "5%",
    roi: "35%",
    duration: 7,
    commission: "10%",
  },

  joint: {
    id: "joint",
    name: "Joint Investment Plan",
    min: 5000,
    max: 15000,
    dailyRate: "2.9%",
    roi: "40%",
    duration: 14,
    commission: "10%",
  },
} as const;

type PlanId = keyof typeof PLANS;

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // 1. CHECK AUTHENTICATION
    // ---------------------------------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to start an investment.",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ---------------------------------------------------------
    // 2. READ REQUEST BODY
    // ---------------------------------------------------------

    const body = await request.json();

    const planId =
      typeof body.planId === "string"
        ? body.planId.trim()
        : "";

    const amountValue = body.amount;

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    // ---------------------------------------------------------
    // 3. VALIDATE PLAN ID
    // ---------------------------------------------------------

    if (!planId) {
      return NextResponse.json(
        {
          error: "Investment plan is required.",
        },
        { status: 400 }
      );
    }

    if (!(planId in PLANS)) {
      return NextResponse.json(
        {
          error: "The selected investment plan is invalid.",
        },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];

    // ---------------------------------------------------------
    // 4. VALIDATE AMOUNT FORMAT
    // ---------------------------------------------------------

    let amountString: string;

    if (typeof amountValue === "number") {
      if (!Number.isFinite(amountValue)) {
        return NextResponse.json(
          {
            error: "Invalid investment amount.",
          },
          { status: 400 }
        );
      }

      amountString = amountValue.toString();
    } else if (typeof amountValue === "string") {
      amountString = amountValue.trim();
    } else {
      return NextResponse.json(
        {
          error: "Investment amount is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Only allow:
     * 100
     * 1000
     * 1000.50
     * 9999999999999999.99
     */
    if (!/^\d{1,16}(\.\d{1,2})?$/.test(amountString)) {
      return NextResponse.json(
        {
          error:
            "Enter a valid amount with no more than two decimal places.",
        },
        { status: 400 }
      );
    }

    let amount: Prisma.Decimal;

    try {
      amount = new Prisma.Decimal(amountString);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid investment amount.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 5. CHECK AMOUNT IS POSITIVE
    // ---------------------------------------------------------

    if (amount.lessThanOrEqualTo(0)) {
      return NextResponse.json(
        {
          error: "Investment amount must be greater than zero.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 6. CHECK PLAN MINIMUM / MAXIMUM
    // ---------------------------------------------------------

    const minimum = new Prisma.Decimal(plan.min);
    const maximum = new Prisma.Decimal(plan.max);

    if (amount.lessThan(minimum)) {
      return NextResponse.json(
        {
          error: `The minimum amount for ${plan.name} is $${plan.min.toLocaleString()}.`,
        },
        { status: 400 }
      );
    }

    if (amount.greaterThan(maximum)) {
      return NextResponse.json(
        {
          error: `The maximum amount for ${plan.name} is $${plan.max.toLocaleString()}.`,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 7. VALIDATE OPTIONAL REASON
    // ---------------------------------------------------------

    if (reason.length > 200) {
      return NextResponse.json(
        {
          error: "The note must be 200 characters or fewer.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 8. CHECK CUSTOMER IN DATABASE
    // ---------------------------------------------------------

    const user = await prisma.user.findUnique({
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

    if (!user) {
      return NextResponse.json(
        {
          error: "Customer account could not be found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // 9. CUSTOMER ONLY
    // ---------------------------------------------------------

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          error: "Only customer accounts can start investments.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 10. CHECK ACCOUNT STATUS
    // ---------------------------------------------------------

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "Your account is not active and cannot start an investment.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 11. RUN EVERYTHING IN ONE DATABASE TRANSACTION
    // ---------------------------------------------------------

    const result = await prisma.$transaction(
      async (tx) => {
        // -----------------------------------------------------
        // Find wallet
        // -----------------------------------------------------

        const wallet = await tx.wallet.findUnique({
          where: {
            userId,
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

        // -----------------------------------------------------
        // Check available balance
        // -----------------------------------------------------

        if (wallet.balance.lessThan(amount)) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        // -----------------------------------------------------
        // Deduct wallet balance
        //
        // The balance check is repeated inside the update
        // condition to reduce race-condition problems when
        // multiple requests happen at nearly the same time.
        // -----------------------------------------------------

        const walletUpdate = await tx.wallet.updateMany({
          where: {
            id: wallet.id,
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

        if (walletUpdate.count !== 1) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        // -----------------------------------------------------
        // Calculate investment dates
        // -----------------------------------------------------

        const startedAt = new Date();

        const endsAt = new Date(startedAt);

        endsAt.setDate(
          endsAt.getDate() + plan.duration
        );

        // -----------------------------------------------------
        // Create investment
        // -----------------------------------------------------

        const investment = await tx.investment.create({
          data: {
            userId,
            planId: plan.id,
            planName: plan.name,
            amount,
            duration: plan.duration,
            dailyRate: plan.dailyRate,
            roi: plan.roi,
            status: "ACTIVE",
            startedAt,
            endsAt,
          },
          select: {
            id: true,
            planId: true,
            planName: true,
            amount: true,
            duration: true,
            dailyRate: true,
            roi: true,
            status: true,
            startedAt: true,
            endsAt: true,
          },
        });

        // -----------------------------------------------------
        // Increase active investment allocation
        // -----------------------------------------------------

        await tx.customerAllocation.upsert({
          where: {
            userId,
          },

          create: {
            userId,
            activeInvestmentAmount: amount,
            tradingBotAmount: new Prisma.Decimal(0),
          },

          update: {
            activeInvestmentAmount: {
              increment: amount,
            },
          },
        });

        // -----------------------------------------------------
        // Create wallet transaction / audit record
        // -----------------------------------------------------

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: "WITHDRAWAL",
            description: reason
              ? `Investment started - ${plan.name}: ${reason}`
              : `Investment started - ${plan.name}`,
          },
        });

        // -----------------------------------------------------
        // Get updated wallet
        // -----------------------------------------------------

        const updatedWallet = await tx.wallet.findUnique({
          where: {
            id: wallet.id,
          },
          select: {
            balance: true,
            currency: true,
          },
        });

        // -----------------------------------------------------
        // Get updated allocation
        // -----------------------------------------------------

        const updatedAllocation =
          await tx.customerAllocation.findUnique({
            where: {
              userId,
            },
            select: {
              activeInvestmentAmount: true,
              tradingBotAmount: true,
            },
          });

        return {
          investment,
          wallet: updatedWallet,
          allocation: updatedAllocation,
        };
      }
    );

    // ---------------------------------------------------------
    // 12. SUCCESS RESPONSE
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message: `${plan.name} has been started successfully.`,

        investment: {
          id: result.investment.id,
          planId: result.investment.planId,
          planName: result.investment.planName,
          amount: result.investment.amount.toString(),
          duration: result.investment.duration,
          dailyRate: result.investment.dailyRate,
          roi: result.investment.roi,
          status: result.investment.status,
          startedAt: result.investment.startedAt,
          endsAt: result.investment.endsAt,
        },

        wallet: result.wallet
          ? {
              balance: result.wallet.balance.toString(),
              currency: result.wallet.currency,
            }
          : null,

        allocation: result.allocation
          ? {
              activeInvestmentAmount:
                result.allocation.activeInvestmentAmount.toString(),

              tradingBotAmount:
                result.allocation.tradingBotAmount.toString(),
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    // ---------------------------------------------------------
    // EXPECTED ERRORS
    // ---------------------------------------------------------

    if (
      error instanceof Error &&
      error.message === "WALLET_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "Your wallet could not be found. Please contact support.",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "INSUFFICIENT_BALANCE"
    ) {
      return NextResponse.json(
        {
          error:
            "Insufficient available wallet balance for this investment.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // DATABASE / UNKNOWN ERROR
    // ---------------------------------------------------------

    console.error("START INVESTMENT ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Unable to start the investment right now. Please try again.",
      },
      { status: 500 }
    );
  }
}