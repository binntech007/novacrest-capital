"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Clock3,
  Gem,
  Handshake,
  Loader2,
  Percent,
  ShieldCheck,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const plans = [
  {
    id: "gold",
    name: "Gold Plan",
    description: "For customers exploring the entry-level plan.",
    min: 1000,
    max: 5000,
    dailyRate: "5%",
    roi: "15%",
    duration: 3,
    commission: "10%",
    icon: CircleDollarSign,
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    description: "A higher investment tier with a longer term.",
    min: 3000,
    max: 10000,
    dailyRate: "4%",
    roi: "20%",
    duration: 5,
    commission: "10%",
    icon: Gem,
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    description: "A premium tier with a seven-day term.",
    min: 10000,
    max: 25000,
    dailyRate: "5%",
    roi: "35%",
    duration: 7,
    commission: "10%",
    icon: ChartNoAxesCombined,
  },
  {
    id: "joint",
    name: "Joint Investment Plan",
    description: "A plan intended for joint investment arrangements.",
    min: 5000,
    max: 15000,
    dailyRate: "2.9%",
    roi: "40%",
    duration: 14,
    commission: "10%",
    icon: Handshake,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);

export default function NewInvestmentPage() {
  const searchParams = useSearchParams();

  const planId = searchParams.get("plan");

  const plan = useMemo(
    () => plans.find((item) => item.id === planId),
    [planId]
  );

  /*
   * IMPORTANT:
   * TypeScript sees plan as possibly undefined.
   *
   * After this check, we create selectedPlan.
   * selectedPlan is then guaranteed to exist and can safely
   * be used inside handleSubmit.
   */
  if (!plan) {
    return (
      <main className="min-h-screen bg-[#080d19] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-red-500/20 bg-[#101621] p-6">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={22}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h1 className="text-lg font-semibold text-white">
                  Investment plan not found
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The investment plan you selected does not exist or the plan
                  parameter is missing.
                </p>

                <Link
                  href="/dashboard/investments"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  <ArrowLeft size={17} />
                  Back to Investment Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // From this point onward selectedPlan is guaranteed to exist.
  const selectedPlan = plan;

  const Icon = selectedPlan.icon;

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const numericAmount = Number(amount);

  const amountIsValid =
    amount.trim() !== "" &&
    Number.isFinite(numericAmount) &&
    numericAmount >= selectedPlan.min &&
    numericAmount <= selectedPlan.max;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const value = Number(amount);

    if (!amount.trim() || !Number.isFinite(value)) {
      setError("Please enter a valid investment amount.");
      return;
    }

    if (value < selectedPlan.min) {
      setError(
        `The minimum amount for ${selectedPlan.name} is ${formatCurrency(
          selectedPlan.min
        )}.`
      );
      return;
    }

    if (value > selectedPlan.max) {
      setError(
        `The maximum amount for ${selectedPlan.name} is ${formatCurrency(
          selectedPlan.max
        )}.`
      );
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: value,
          reason: reason.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to start the investment. Please try again."
        );
      }

      setSuccess(
        data?.message ||
          `${selectedPlan.name} has been started successfully.`
      );

      setAmount("");
      setReason("");

      setTimeout(() => {
        window.location.href = "/dashboard/investments";
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start the investment. Please try again."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/dashboard/investments"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Investment Plans
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck size={16} />
            <span>Start Investment</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start {selectedPlan.name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Enter the amount you want to allocate to this plan and review the
            plan details before confirming.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Plan Summary */}
          <section className="rounded-2xl border border-slate-800 bg-[#101621] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                <Icon size={23} className="text-cyan-400" />
              </div>

              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Selected Plan
              </div>
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              {selectedPlan.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {selectedPlan.description}
            </p>

            <div className="mt-6 space-y-4">
              {/* Range */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                <div>
                  <p className="text-xs text-slate-500">Minimum</p>

                  <p className="mt-1 font-semibold text-white">
                    {formatCurrency(selectedPlan.min)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Maximum</p>

                  <p className="mt-1 font-semibold text-white">
                    {formatCurrency(selectedPlan.max)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Percent size={14} />
                    Daily Rate
                  </div>

                  <p className="mt-2 font-semibold text-white">
                    {selectedPlan.dailyRate}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Percent size={14} />
                    Advertised ROI
                  </div>

                  <p className="mt-2 font-semibold text-white">
                    {selectedPlan.roi}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={14} />
                    Duration
                  </div>

                  <p className="mt-2 font-semibold text-white">
                    {selectedPlan.duration}{" "}
                    {selectedPlan.duration === 1 ? "day" : "days"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Percent size={14} />
                    Commission
                  </div>

                  <p className="mt-2 font-semibold text-white">
                    {selectedPlan.commission}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="rounded-2xl border border-slate-800 bg-[#101621] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Investment Amount
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Choose an amount within this plan&apos;s permitted range.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Amount
                </label>

                <div className="relative">
                  <Wallet
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min={selectedPlan.min}
                    max={selectedPlan.max}
                    step="0.01"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder={String(selectedPlan.min)}
                    disabled={pending}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-[#0b111d] py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>
                    Min: {formatCurrency(selectedPlan.min)}
                  </span>

                  <span>
                    Max: {formatCurrency(selectedPlan.max)}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Investment Amount
                  </span>

                  <span className="font-semibold text-white">
                    {amountIsValid
                      ? formatCurrency(numericAmount)
                      : "$0.00"}
                  </span>
                </div>

                <div className="my-3 border-t border-slate-800" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Plan
                  </span>

                  <span className="text-sm font-medium text-white">
                    {selectedPlan.name}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Duration
                  </span>

                  <span className="text-sm font-medium text-white">
                    {selectedPlan.duration}{" "}
                    {selectedPlan.duration === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Note{" "}
                  <span className="font-normal text-slate-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  maxLength={200}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  disabled={pending}
                  placeholder="Optional note for this investment"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-[#0b111d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <p className="text-sm leading-6 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <p className="text-sm leading-6 text-emerald-300">
                    {success}
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  The selected amount will be allocated from the available
                  wallet balance after the server verifies the customer&apos;s
                  balance and the investment terms.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={pending || !amountIsValid}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Starting Investment...
                  </>
                ) : (
                  <>
                    Start Investment
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-800 bg-[#101621] p-5">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-cyan-400"
          />

          <p className="text-xs leading-5 text-slate-500">
            The displayed rates and ROI are configured plan terms and are not
            guarantees of returns. Review the applicable risks, fees, and
            conditions before confirming an investment.
          </p>
        </div>
      </div>
    </main>
  );
}