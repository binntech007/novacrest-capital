import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  PauseCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency = "USD") {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getDaysRemaining(endsAt: Date) {
  const now = new Date();
  const difference = endsAt.getTime() - now.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

export default async function TradingBotPage() {
  // ---------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "ACTIVE") {
    redirect("/login?error=account-unavailable");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const userId = session.user.id;

  // ---------------------------------------------------------
  // Load wallet, allocation and active subscription
  // ---------------------------------------------------------

  const [wallet, allocation, subscription] =
    await Promise.all([
      prisma.wallet.findUnique({
        where: {
          userId,
        },
        select: {
          balance: true,
          currency: true,
        },
      }),

      prisma.customerAllocation.findUnique({
        where: {
          userId,
        },
        select: {
          tradingBotAmount: true,
        },
      }),

      prisma.tradingBotSubscription.findFirst({
        where: {
          userId,
          status: "ACTIVE",
        },
        orderBy: {
          startedAt: "desc",
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
      }),
    ]);

  const currency = wallet?.currency ?? "USD";

  const availableBalance = Number(
    wallet?.balance ?? 0
  );

  const tradingBotAmount = Number(
    allocation?.tradingBotAmount ?? 0
  );

  const subscriptionAmount = Number(
    subscription?.amount ?? 0
  );

  const daysRemaining = subscription
    ? getDaysRemaining(subscription.endsAt)
    : 0;

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <Bot className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Trading Bot
                </h1>

                <p className="text-sm text-slate-400">
                  Manage your trading bot subscription and allocated funds.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/trading-bot/plans"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Bot className="h-4 w-4" />
            View Bot Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* =====================================================
            INFORMATION NOTICE
        ====================================================== */}

        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

            <div>
              <p className="text-sm font-medium text-amber-300">
                Trading bot subscription
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your trading-bot allocation represents funds assigned to the
                selected subscription. The displayed plan rate is a configured
                plan parameter and is not a guarantee of financial returns.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            ACCOUNT SUMMARY
        ====================================================== */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Available Balance */}
          <div className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-[#111a2b] to-[#0a1020] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Available Balance
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  {formatMoney(
                    availableBalance,
                    currency
                  )}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Wallet className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Funds remaining in your wallet
            </p>
          </div>

          {/* Bot Allocation */}
          <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-[#111a2b] to-[#0a1020] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Trading Bot Money
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  {formatMoney(
                    tradingBotAmount,
                    currency
                  )}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Bot className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Funds allocated to the trading bot
            </p>
          </div>

          {/* Subscription Amount */}
          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-[#111a2b] to-[#0a1020] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Subscription Amount
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  {subscription
                    ? formatMoney(
                        subscriptionAmount,
                        currency
                      )
                    : formatMoney(0, currency)}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Amount assigned to the current subscription
            </p>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#111a2b] to-[#0a1020] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Bot Status
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                  {subscription
                    ? "Active"
                    : "Not Active"}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              {subscription
                ? "Your bot subscription is active"
                : "Choose a plan to get started"}
            </p>
          </div>
        </section>

        {/* =====================================================
            ACTIVE SUBSCRIPTION
        ====================================================== */}

        {subscription ? (
          <section className="mb-6 rounded-2xl border border-white/10 bg-[#0d1422] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-400">
                      Active Subscription
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-white">
                      {subscription.planName}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
                <p className="text-xs text-slate-500">
                  Subscription Amount
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formatMoney(
                    subscriptionAmount,
                    currency
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
                <p className="text-xs text-slate-500">
                  Plan Parameter
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {subscription.roi}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
                <p className="text-xs text-slate-500">
                  Started
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formatDate(subscription.startedAt)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
                <p className="text-xs text-slate-500">
                  Ends
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formatDate(subscription.endsAt)}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 rounded-xl border border-white/10 bg-[#080d19] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-cyan-400" />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Subscription period
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {subscription.duration} day subscription
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CalendarDays className="h-4 w-4 text-slate-500" />

                  {daysRemaining > 0
                    ? `${daysRemaining} ${
                        daysRemaining === 1
                          ? "day"
                          : "days"
                      } remaining`
                    : "Ending today"}
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* =====================================================
             NO ACTIVE SUBSCRIPTION
          ====================================================== */

          <section className="mb-6 rounded-2xl border border-white/10 bg-[#0d1422] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Bot className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No Active Trading Bot
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              You currently do not have an active trading bot subscription.
              Review the available plans to choose one.
            </p>

            <Link
              href="/dashboard/trading-bot/plans"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              View Trading Bot Plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              How the Trading Bot Works
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your subscription and wallet allocation are recorded
              automatically.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <DollarSign className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                1. Choose a Plan
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Select a trading bot subscription that fits the available
                plan terms.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Wallet className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                2. Allocate Funds
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The subscription amount is deducted from your available wallet
                balance and assigned to the bot allocation.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                3. Subscription Becomes Active
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Your active subscription and allocated amount appear here and
                in your account summary.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}