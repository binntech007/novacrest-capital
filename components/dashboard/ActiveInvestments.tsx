import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Clock3,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/* ================================================================
   HELPERS
================================================================ */

function formatCurrency(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRemainingDays(
  endsAt: Date
) {
  const now = new Date();

  const difference =
    endsAt.getTime() - now.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function getProgress(
  startedAt: Date,
  endsAt: Date
) {
  const now = new Date();

  const total =
    endsAt.getTime() -
    startedAt.getTime();

  const elapsed =
    now.getTime() -
    startedAt.getTime();

  if (total <= 0) {
    return 100;
  }

  const progress =
    (elapsed / total) * 100;

  return Math.min(
    100,
    Math.max(0, progress)
  );
}

/* ================================================================
   COMPONENT
================================================================ */

export default async function ActiveInvestments() {
  const session = await auth();

  /*
   * No authenticated customer.
   */
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  /* ================================================================
     LOAD WALLET + ACTIVE INVESTMENTS
  ================================================================= */

  const [wallet, investments] =
    await Promise.all([
      prisma.wallet.findUnique({
        where: {
          userId,
        },

        select: {
          currency: true,
        },
      }),

      prisma.investment.findMany({
        where: {
          userId,
          status: "ACTIVE",
        },

        orderBy: {
          startedAt: "desc",
        },

        take: 5,

        select: {
          id: true,
          planName: true,
          amount: true,
          duration: true,
          dailyRate: true,
          roi: true,
          status: true,
          startedAt: true,
          endsAt: true,
        },
      }),
    ]);

  const currency =
    wallet?.currency || "USD";

  /* ================================================================
     EMPTY STATE
  ================================================================= */

  if (investments.length === 0) {
    return (
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101727]">
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] p-5 sm:px-6">
          <div>
            <h2 className="font-semibold text-white">
              My investments
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your active investment plans
            </p>
          </div>

          <Link
            href="/dashboard/investments"
            className="inline-flex items-center gap-1 text-sm text-violet-300 transition hover:text-violet-200"
          >
            Explore plans

            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <ChartNoAxesColumnIncreasing className="h-6 w-6 text-slate-400" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">
            No active investments
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400">
            Once you start an investment plan,
            its status and details will appear
            here.
          </p>

          <Link
            href="/dashboard/investments"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-500"
          >
            Explore investment plans

            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  /* ================================================================
     ACTIVE INVESTMENTS
  ================================================================= */

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101727]">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] p-5 sm:px-6">
        <div>
          <h2 className="font-semibold text-white">
            My investments
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your active investment plans
          </p>
        </div>

        <Link
          href="/dashboard/investments"
          className="inline-flex items-center gap-1 text-sm text-violet-300 transition hover:text-violet-200"
        >
          Explore plans

          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ============================================================
          INVESTMENT LIST
      ============================================================ */}

      <div className="divide-y divide-white/[0.06]">
        {investments.map((investment) => {
          const remainingDays =
            getRemainingDays(
              investment.endsAt
            );

          const progress =
            getProgress(
              investment.startedAt,
              investment.endsAt
            );

          return (
            <div
              key={investment.id}
              className="p-5 transition hover:bg-white/[0.02] sm:p-6"
            >
              {/* ==================================================
                  TOP
              ================================================== */}

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <ChartNoAxesColumnIncreasing className="h-5 w-5 text-violet-400" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {investment.planName}
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Investment plan
                    </p>
                  </div>
                </div>

                {/* Active badge */}
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>

              {/* ==================================================
                  AMOUNT
              ================================================== */}

              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Investment amount
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {formatCurrency(
                    Number(
                      investment.amount
                    ),
                    currency
                  )}
                </p>
              </div>

              {/* ==================================================
                  DETAILS
              ================================================== */}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/[0.06] bg-[#0b101b] p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Daily rate
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {investment.dailyRate}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#0b101b] p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    ROI
                  </p>

                  <p className="mt-1 text-xs font-semibold text-emerald-400">
                    {investment.roi}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#0b101b] p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Duration
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {investment.duration}{" "}
                    {investment.duration === 1
                      ? "day"
                      : "days"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#0b101b] p-3">
                  <p className="text-[9px] uppercase tracking-wide text-slate-600">
                    Remaining
                  </p>

                  <p className="mt-1 text-xs font-semibold text-violet-300">
                    {remainingDays}{" "}
                    {remainingDays === 1
                      ? "day"
                      : "days"}
                  </p>
                </div>
              </div>

              {/* ==================================================
                  PROGRESS
              ================================================== */}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Investment progress
                  </span>

                  <span className="text-[10px] font-medium text-slate-400">
                    {Math.round(
                      progress
                    )}
                    %
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* ==================================================
                  DATES
              ================================================== */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-600" />

                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-600">
                      Started
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {formatDate(
                        investment.startedAt
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-slate-600" />

                  <div>
                    <p className="text-[9px] uppercase tracking-wide text-slate-600">
                      Ends
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {formatDate(
                        investment.endsAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-violet-500/10 bg-violet-500/5 px-3 py-2.5">
                <TrendingUp className="h-3.5 w-3.5 shrink-0 text-violet-400" />

                <p className="text-[10px] leading-4 text-slate-400">
                  This investment is currently
                  active and will remain active
                  until its scheduled end date.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================
          VIEW ALL
      ============================================================ */}

      <div className="border-t border-white/[0.08] p-4">
        <Link
          href="/dashboard/investments"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          View all investments

          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}