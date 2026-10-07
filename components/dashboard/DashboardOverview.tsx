import Link from "next/link";

import {
  Plus,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  Bot,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import BalanceCards from "./BalanceCards";
import QuickActions from "./QuickActions";
import RecentTransactions from "./RecentTransactions";
import ActiveInvestments from "./ActiveInvestments";
import DashboardFooter from "./DashboardFooter";

type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type DashboardOverviewProps = {
  name: string;

  // Values loaded from the customer's database records
  availableBalance: number;
  activeInvestmentAmount: number;
  tradingBotAmount: number;

  currency?: string;

  // KYC information loaded from the database
  kycStatus?: KycStatus | null;
  kycRejectionReason?: string | null;
};

export default function DashboardOverview({
  name,
  availableBalance,
  activeInvestmentAmount,
  tradingBotAmount,
  currency = "USD",
  kycStatus = "NOT_STARTED",
  kycRejectionReason = null,
}: DashboardOverviewProps) {
  const firstName =
    name.trim().split(/\s+/)[0] || "Customer";

  /*
   * ---------------------------------------------------------
   * SAFE DATABASE VALUES
   * ---------------------------------------------------------
   *
   * These values are already fetched from the database by
   * app/dashboard/page.tsx.
   *
   * Number() makes sure Prisma Decimal values converted by
   * the server are treated as numbers by the UI.
   */

  const safeAvailableBalance = Number.isFinite(
    Number(availableBalance),
  )
    ? Number(availableBalance)
    : 0;

  const safeActiveInvestmentAmount = Number.isFinite(
    Number(activeInvestmentAmount),
  )
    ? Number(activeInvestmentAmount)
    : 0;

  const safeTradingBotAmount = Number.isFinite(
    Number(tradingBotAmount),
  )
    ? Number(tradingBotAmount)
    : 0;

  /*
   * ---------------------------------------------------------
   * KYC STATUS
   * ---------------------------------------------------------
   */

  const currentKycStatus: KycStatus =
    kycStatus && [
      "NOT_STARTED",
      "IN_PROGRESS",
      "PENDING",
      "APPROVED",
      "REJECTED",
    ].includes(kycStatus)
      ? kycStatus
      : "NOT_STARTED";

  const kycConfig = {
    NOT_STARTED: {
      title: "KYC verification required",
      description:
        "Complete identity verification to keep your account information up to date and access services that require verification.",
      button: "Start verification",
      icon: ShieldCheck,
      iconClass: "text-slate-400",
      iconBg: "bg-slate-500/10",
      border: "border-white/10",
      background: "bg-white/[0.03]",
      titleClass: "text-slate-200",
      textClass: "text-slate-400",
      buttonClass:
        "text-slate-300 hover:text-white",
    },

    IN_PROGRESS: {
      title: "KYC verification incomplete",
      description:
        "You have started your verification but have not completed all required steps.",
      button: "Continue verification",
      icon: AlertCircle,
      iconClass: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      border: "border-cyan-400/20",
      background: "bg-cyan-400/[0.05]",
      titleClass: "text-cyan-300",
      textClass: "text-slate-400",
      buttonClass:
        "text-cyan-300 hover:text-cyan-200",
    },

    PENDING: {
      title: "KYC verification under review",
      description:
        "Your verification information has been submitted and is currently being reviewed.",
      button: "View verification",
      icon: Clock3,
      iconClass: "text-amber-400",
      iconBg: "bg-amber-500/10",
      border: "border-amber-400/20",
      background: "bg-amber-400/[0.05]",
      titleClass: "text-amber-300",
      textClass: "text-slate-400",
      buttonClass:
        "text-amber-300 hover:text-amber-200",
    },

    APPROVED: {
      title: "KYC verification approved",
      description:
        "Your identity verification has been successfully approved. Your account is verified.",
      button: "View verification",
      icon: CheckCircle2,
      iconClass: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      border: "border-emerald-400/20",
      background: "bg-emerald-400/[0.06]",
      titleClass: "text-emerald-300",
      textClass: "text-slate-400",
      buttonClass:
        "text-emerald-300 hover:text-emerald-200",
    },

    REJECTED: {
      title: "KYC verification requires attention",
      description:
        kycRejectionReason ||
        "Your previous verification application was not approved. Review your information and resubmit your application.",
      button: "Review & resubmit",
      icon: XCircle,
      iconClass: "text-rose-400",
      iconBg: "bg-rose-500/10",
      border: "border-rose-400/20",
      background: "bg-rose-400/[0.05]",
      titleClass: "text-rose-300",
      textClass: "text-slate-400",
      buttonClass:
        "text-rose-300 hover:text-rose-200",
    },
  }[currentKycStatus];

  const KycIcon = kycConfig.icon;

  return (
    <div className="space-y-8 bg-[#080d19] text-white">
      {/* =====================================================
          WELCOME BANNER
      ====================================================== */}

      <section className="relative isolate overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#17183d] via-[#111a35] to-[#0d1425] p-6 shadow-xl shadow-black/10 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
          <div className="max-w-2xl">
            {/* BADGE */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Customer dashboard
            </div>

            <p className="text-base text-slate-300">
              Welcome back,
            </p>

            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {firstName}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Manage your account, explore investment plans,
              and access your account tools from one convenient
              place.
            </p>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/investments"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#111a35]"
              >
                <Plus className="h-4 w-4" />
                Explore investments
              </Link>

              <Link
                href="/dashboard/kyc"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
              >
                <ShieldCheck className="h-4 w-4" />
                KYC verification
              </Link>
            </div>
          </div>

          {/* INVESTMENT PLANS CALLOUT */}

          <div className="w-full rounded-2xl border border-white/10 bg-[#0b1120]/80 p-5 sm:p-6 xl:max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <TrendingUp className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Explore investment plans
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Review available options, terms, and risks
                  before deciding whether to invest.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/investments"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              View Investment Plans
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT OVERVIEW / KYC STATUS
      ====================================================== */}

      <section
        className={`rounded-2xl border ${kycConfig.border} ${kycConfig.background} p-4 sm:p-5`}
      >
        <div className="flex items-start gap-3">
          {/* ICON */}

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${kycConfig.iconBg}`}
          >
            <KycIcon
              className={`h-5 w-5 ${kycConfig.iconClass}`}
            />
          </div>

          {/* CONTENT */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2
                className={`text-sm font-semibold ${kycConfig.titleClass}`}
              >
                {kycConfig.title}
              </h2>

              {/* STATUS BADGE */}

              <span
                className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  currentKycStatus === "APPROVED"
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                    : currentKycStatus === "PENDING"
                      ? "border-amber-400/20 bg-amber-500/10 text-amber-400"
                      : currentKycStatus === "REJECTED"
                        ? "border-rose-400/20 bg-rose-500/10 text-rose-400"
                        : currentKycStatus === "IN_PROGRESS"
                          ? "border-cyan-400/20 bg-cyan-500/10 text-cyan-400"
                          : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                {currentKycStatus.replaceAll("_", " ")}
              </span>
            </div>

            <p
              className={`mt-1 text-sm leading-6 ${kycConfig.textClass}`}
            >
              {kycConfig.description}
            </p>

            {/* REVIEW LINK */}

            <Link
              href="/dashboard/kyc"
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium transition ${kycConfig.buttonClass}`}
            >
              {kycConfig.button}

              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT SUMMARY
      ====================================================== */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Account summary
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            View your available balance, active investments,
            and trading bot allocation.
          </p>
        </div>

        <BalanceCards
          availableBalance={safeAvailableBalance}
          activeInvestmentAmount={
            safeActiveInvestmentAmount
          }
          tradingBotAmount={safeTradingBotAmount}
          currency={currency}
        />
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <QuickActions />

      {/* =====================================================
          TRANSACTIONS + INVESTMENTS
      ====================================================== */}

      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <RecentTransactions />
        </div>

        <div className="min-w-0">
          <ActiveInvestments />
        </div>
      </section>

      {/* =====================================================
          TRADING TOOLS
      ====================================================== */}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Trading tools
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Explore trading features and practice in a
            simulated environment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* TRADING BOT */}

          <Link
            href="/dashboard/trading-bot"
            className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111c30] to-[#0d1424] p-5 transition hover:border-cyan-400/30 hover:bg-[#141c30] sm:p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
              <Bot className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white">
                Trading Bot
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Review bot settings and allocated trading funds.
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
          </Link>

          {/* DEMO TRADING */}

          <Link
            href="/dashboard/demo-trading"
            className="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111c30] to-[#0d1424] p-5 transition hover:border-amber-400/30 hover:bg-[#141c30] sm:p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
              <TrendingUp className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-white">
                Demo Trading
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Practice with simulated funds without risking
                real money.
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-amber-300" />
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <DashboardFooter />
    </div>
  );
}