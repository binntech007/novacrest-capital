"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  DollarSign,
  Gem,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Wallet,
  X,
} from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "AI Starter",
    amount: 500,
    roi: "12%",
    duration: 7,
    icon: Bot,
    description:
      "Entry-level trading bot subscription.",
    featured: false,
  },
  {
    id: "bronze",
    name: "AI Bronze",
    amount: 1000,
    roi: "15%",
    duration: 14,
    icon: Trophy,
    description:
      "A higher allocation tier for customers who want a larger bot allocation.",
    featured: false,
  },
  {
    id: "silver",
    name: "AI Silver",
    amount: 2500,
    roi: "18%",
    duration: 21,
    icon: Sparkles,
    description:
      "An intermediate trading bot subscription tier.",
    featured: false,
  },
  {
    id: "gold",
    name: "AI Gold",
    amount: 5000,
    roi: "22%",
    duration: 28,
    icon: Star,
    description:
      "A higher-value trading bot subscription tier.",
    featured: true,
  },
  {
    id: "platinum",
    name: "AI Platinum",
    amount: 10000,
    roi: "27%",
    duration: 35,
    icon: Gem,
    description:
      "A premium trading bot subscription tier.",
    featured: false,
  },
  {
    id: "diamond",
    name: "AI Diamond",
    amount: 25000,
    roi: "33%",
    duration: 42,
    icon: Gem,
    description:
      "An advanced trading bot subscription tier.",
    featured: false,
  },
  {
    id: "quantum",
    name: "AI Quantum VIP",
    amount: 50000,
    roi: "40%",
    duration: 50,
    icon: Trophy,
    description:
      "The highest configured trading bot subscription tier.",
    featured: false,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TradingBotPlansPage() {
  const [selectedPlan, setSelectedPlan] =
    useState<(typeof plans)[number] | null>(null);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function subscribeToPlan() {
    if (!selectedPlan || pending) {
      return;
    }

    setPending(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/trading-bot/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: selectedPlan.id,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to start the trading bot subscription."
        );
      }

      setSuccess(
        data?.message ||
          `${selectedPlan.name} subscription started successfully.`
      );

      setSelectedPlan(null);

      // Refresh the dashboard after the database update.
      setTimeout(() => {
        window.location.href = "/dashboard/trading-bot";
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to start the trading bot subscription."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <Link
            href="/dashboard/trading-bot"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trading Bot
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-emerald-400">
                <Bot className="h-4 w-4" />
                Trading Bot
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                AI Trading Bot Plans
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Review the available subscription tiers and choose one to
                allocate funds to your trading bot.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            NOTICE
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

            <div>
              <p className="text-sm font-medium text-amber-300">
                Review the plan terms
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                The rates displayed on these plans are configured plan
                parameters and are not guaranteed returns. Make sure the
                applicable risks, fees, and conditions are understood before
                subscribing.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <p className="text-sm text-emerald-300">
              {success}
            </p>
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* =====================================================
            PLANS
        ====================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#101621] transition ${
                  plan.featured
                    ? "border-emerald-500/50 shadow-lg shadow-emerald-500/5"
                    : "border-white/10"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-4 top-4 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Popular
                  </div>
                )}

                <div className="p-5">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#080d19]">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-white">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">
                    {plan.description}
                  </p>

                  {/* Amount */}
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#080d19] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Subscription
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      {formatCurrency(plan.amount)}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <span className="text-sm text-slate-400">
                        Plan Rate
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {plan.roi}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock3 className="h-4 w-4" />
                        Duration
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {plan.duration} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <div className="mt-auto border-t border-white/[0.06] p-5">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSelectedPlan(plan);
                    }}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            HOW MONEY IS ALLOCATED
        ====================================================== */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              How your subscription is recorded
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The subscription process updates the account atomically.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Wallet className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Wallet
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The subscription amount is deducted from the available wallet
                balance after the server verifies sufficient funds.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Bot className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Bot Allocation
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                The same amount is added to the customer&apos;s trading bot
                allocation.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#080d19] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Subscription
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                A permanent subscription record is created with its plan,
                amount, start date, end date, and status.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          CONFIRMATION MODAL
      ====================================================== */}

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101621] p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-400">
                  Confirm Subscription
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  {selectedPlan.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!pending) {
                    setSelectedPlan(null);
                  }
                }}
                disabled={pending}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080d19] p-4">
                <span className="text-sm text-slate-400">
                  Subscription Amount
                </span>

                <span className="text-lg font-bold text-white">
                  {formatCurrency(selectedPlan.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080d19] p-4">
                <span className="text-sm text-slate-400">
                  Duration
                </span>

                <span className="text-sm font-semibold text-white">
                  {selectedPlan.duration} days
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080d19] p-4">
                <span className="text-sm text-slate-400">
                  Configured Rate
                </span>

                <span className="text-sm font-semibold text-white">
                  {selectedPlan.roi}
                </span>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs leading-5 text-slate-400">
                Confirming this subscription will deduct{" "}
                <span className="font-semibold text-white">
                  {formatCurrency(selectedPlan.amount)}
                </span>{" "}
                from your available wallet balance and allocate the amount to
                the trading bot.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                disabled={pending}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={subscribeToPlan}
                disabled={pending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Subscription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}