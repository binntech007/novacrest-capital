import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

const TRADING_BOT_PLANS = {
  starter: {
    id: "starter",
    name: "AI Starter",
    amount: 500,
    roi: "12%",
    duration: 7,
  },

  bronze: {
    id: "bronze",
    name: "AI Bronze",
    amount: 1000,
    roi: "15%",
    duration: 7,
  },

  silver: {
    id: "silver",
    name: "AI Silver",
    amount: 2500,
    roi: "18%",
    duration: 7,
  },

  gold: {
    id: "gold",
    name: "AI Gold",
    amount: 5000,
    roi: "22%",
    duration: 7,
  },

  platinum: {
    id: "platinum",
    name: "AI Platinum",
    amount: 10000,
    roi: "27%",
    duration: 7,
  },

  diamond: {
    id: "diamond",
    name: "AI Diamond",
    amount: 25000,
    roi: "33%",
    duration: 7,
  },

  quantum: {
    id: "quantum",
    name: "AI Quantum VIP",
    amount: 50000,
    roi: "40%",
    duration: 7,
  },
} as const;

type TradingBotPlanId = keyof typeof TRADING_BOT_PLANS;

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // 1. AUTHENTICATION
    // ---------------------------------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to subscribe to a trading bot.",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // ---------------------------------------------------------
    // 2. READ REQUEST
    // ---------------------------------------------------------

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const planId =
      typeof data.planId === "string"
        ? data.planId.trim()
        : "";

    // ---------------------------------------------------------
    // 3. VALIDATE PLAN
    // ---------------------------------------------------------

    if (!planId) {
      return NextResponse.json(
        {
          error: "Trading bot plan is required.",
        },
        { status: 400 }
      );
    }

    if (!(planId in TRADING_BOT_PLANS)) {
      return NextResponse.json(
        {
          error: "The selected trading bot plan is invalid.",
        },
        { status: 400 }
      );
    }

    const plan =
      TRADING_BOT_PLANS[planId as TradingBotPlanId];

    const amount = new Prisma.Decimal(plan.amount);

    // ---------------------------------------------------------
    // 4. FIND CUSTOMER
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
    // 5. CUSTOMER ONLY
    // ---------------------------------------------------------

    if (user.role !== "CUSTOMER") {
      return NextResponse.json(
        {
          error:
            "Only customer accounts can subscribe to trading bots.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 6. ACCOUNT MUST BE ACTIVE
    // ---------------------------------------------------------

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error:
            "Your account is not active and cannot subscribe to a trading bot.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 7. DATABASE TRANSACTION
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
        // Prevent duplicate active subscriptions
        //
        // Remove this block later if you want customers to be
        // able to have multiple active bot subscriptions.
        // -----------------------------------------------------

        const existingSubscription =
          await tx.tradingBotSubscription.findFirst({
            where: {
              userId,
              status: "ACTIVE",
            },
            select: {
              id: true,
              planName: true,
            },
          });

        if (existingSubscription) {
          throw new Error("ACTIVE_SUBSCRIPTION_EXISTS");
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
        // The balance condition is included again here so that
        // two simultaneous subscription requests cannot both
        // spend the same available balance.
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
        // Calculate subscription dates
        // -----------------------------------------------------

        const startedAt = new Date();

        const endsAt = new Date(startedAt);

        endsAt.setDate(
          endsAt.getDate() + plan.duration
        );

        // -----------------------------------------------------
        // Create subscription
        // -----------------------------------------------------

        const subscription =
          await tx.tradingBotSubscription.create({
            data: {
              userId,
              planId: plan.id,
              planName: plan.name,
              amount,
              roi: plan.roi,
              duration: plan.duration,
              status: "ACTIVE",
              startedAt,
              endsAt,
            },

            select: {
              id: true,
              planId: true,
              planName: true,
              amount: true,
              roi: true,
              duration: true,
              status: true,
              startedAt: true,
              endsAt: true,
            },
          });

        // -----------------------------------------------------
        // Update customer allocation
        // -----------------------------------------------------

        const allocation =
          await tx.customerAllocation.upsert({
            where: {
              userId,
            },

            create: {
              userId,
              activeInvestmentAmount:
                new Prisma.Decimal(0),
              tradingBotAmount: amount,
            },

            update: {
              tradingBotAmount: {
                increment: amount,
              },
            },

            select: {
              activeInvestmentAmount: true,
              tradingBotAmount: true,
            },
          });

        // -----------------------------------------------------
        // Create wallet transaction
        //
        // Your current enum doesn't contain INVESTMENT, so we
        // use WITHDRAWAL for the money leaving the available
        // wallet balance.
        // -----------------------------------------------------

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: "WITHDRAWAL",
            description:
              `Trading bot subscription - ${plan.name}`,
          },
        });

        // -----------------------------------------------------
        // Get updated wallet
        // -----------------------------------------------------

        const updatedWallet =
          await tx.wallet.findUnique({
            where: {
              id: wallet.id,
            },

            select: {
              balance: true,
              currency: true,
            },
          });

        return {
          subscription,
          allocation,
          wallet: updatedWallet,
        };
      }
    );

    // ---------------------------------------------------------
    // 8. SUCCESS
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          `${plan.name} subscription started successfully.`,

        subscription: {
          id: result.subscription.id,
          planId: result.subscription.planId,
          planName: result.subscription.planName,
          amount:
            result.subscription.amount.toString(),
          roi: result.subscription.roi,
          duration: result.subscription.duration,
          status: result.subscription.status,
          startedAt: result.subscription.startedAt,
          endsAt: result.subscription.endsAt,
        },

        wallet: result.wallet
          ? {
              balance:
                result.wallet.balance.toString(),
              currency: result.wallet.currency,
            }
          : null,

        allocation: {
          activeInvestmentAmount:
            result.allocation.activeInvestmentAmount.toString(),

          tradingBotAmount:
            result.allocation.tradingBotAmount.toString(),
        },
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
            "Insufficient available wallet balance for this trading bot subscription.",
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "ACTIVE_SUBSCRIPTION_EXISTS"
    ) {
      return NextResponse.json(
        {
          error:
            "You already have an active trading bot subscription.",
        },
        { status: 400 }
      );
    }

    console.error(
      "TRADING BOT SUBSCRIPTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to start the trading bot subscription right now. Please try again.",
      },
      { status: 500 }
    );
  }
}