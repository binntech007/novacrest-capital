import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import type { LucideIcon } from "lucide-react";

import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
  Wallet as WalletIcon,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";

/* ================================================================
   TYPES
================================================================ */

type WalletTransactionType =
  | "CREDIT"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "INVESTMENT_PROFIT";

type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

type DisplayTransactionType =
  | WalletTransactionType
  | "INVESTMENT"
  | "TRADING_BOT";

type Transaction = {
  id: string;
  amount: number;
  type: DisplayTransactionType;

  /**
   * Original wallet transaction type.
   * Used to determine whether money entered or left
   * the customer's wallet.
   */
  walletType: WalletTransactionType;

  description: string;
  reference: string;
  createdAt: Date;

  status?: WithdrawalStatus;

  withdrawalMethod?: "BANK" | "CRYPTO";

  withdrawalDestination?: string | null;
};

/* ================================================================
   FORMATTERS
================================================================ */

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/* ================================================================
   DISPLAY TYPE
================================================================ */

function getDisplayType(
  type: WalletTransactionType,
  description: string,
): DisplayTransactionType {
  const lowerDescription = description.toLowerCase();

  /*
   * Trading bot transactions are currently recorded
   * as WITHDRAWAL in the wallet transaction table.
   */
  if (
    lowerDescription.includes("trading bot") ||
    lowerDescription.includes("bot subscription")
  ) {
    return "TRADING_BOT";
  }

  /*
   * Investment purchases are currently recorded
   * as WITHDRAWAL in the wallet transaction table.
   */
  if (
    lowerDescription.includes("investment started") ||
    lowerDescription.includes("investment plan") ||
    lowerDescription.includes("investment -")
  ) {
    return "INVESTMENT";
  }

  return type;
}

/* ================================================================
   MONEY DIRECTION
================================================================ */

function isMoneyIn(
  type: DisplayTransactionType,
  walletType: WalletTransactionType,
  status?: WithdrawalStatus,
) {
  /*
   * If a withdrawal is rejected, the money is returned
   * to the customer's wallet.
   */
  if (walletType === "WITHDRAWAL" && status === "REJECTED") {
    return true;
  }

  /*
   * Investment and trading-bot subscriptions are money out.
   */
  if (type === "INVESTMENT" || type === "TRADING_BOT") {
    return false;
  }

  return (
    walletType === "CREDIT" ||
    walletType === "DEPOSIT" ||
    walletType === "INVESTMENT_PROFIT"
  );
}

/* ================================================================
   TYPE LABEL
================================================================ */

function getTypeLabel(type: DisplayTransactionType) {
  switch (type) {
    case "CREDIT":
      return "Credit";

    case "DEPOSIT":
      return "Deposit";

    case "WITHDRAWAL":
      return "Withdrawal";

    case "INVESTMENT":
      return "Investment";

    case "TRADING_BOT":
      return "Trading Bot";

    case "INVESTMENT_PROFIT":
      return "Investment Profit";

    default:
      return "Transaction";
  }
}

/* ================================================================
   TYPE ICON
================================================================ */

function getTypeIcon(type: DisplayTransactionType): LucideIcon {
  switch (type) {
    case "CREDIT":
      return ArrowDownLeft;

    case "DEPOSIT":
      return Banknote;

    case "WITHDRAWAL":
      return ArrowUpRight;

    case "INVESTMENT":
      return TrendingUp;

    case "TRADING_BOT":
      return Bot;

    case "INVESTMENT_PROFIT":
      return TrendingUp;

    default:
      return FileText;
  }
}

/* ================================================================
   WITHDRAWAL STATUS BADGE
================================================================ */

function WithdrawalStatusBadge({
  status,
}: {
  status: WithdrawalStatus;
}) {
  switch (status) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
          <Clock3 className="h-3 w-3" />
          Pending
        </span>
      );

    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
          <Clock3 className="h-3 w-3" />
          Processing
        </span>
      );

    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );

    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );

    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );

    default:
      return null;
  }
}

/* ================================================================
   TYPE BADGE
================================================================ */

function TypeBadge({
  type,
  walletType,
  status,
}: {
  type: DisplayTransactionType;
  walletType: WalletTransactionType;
  status?: WithdrawalStatus;
}) {
  const moneyIn = isMoneyIn(type, walletType, status);

  /*
   * Withdrawals display their transaction type and
   * current withdrawal status separately.
   */
  if (type === "WITHDRAWAL" && status) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
          <ArrowUpRight className="h-3 w-3" />
          Withdrawal
        </span>

        <WithdrawalStatusBadge status={status} />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
        moneyIn
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      {moneyIn ? (
        <ArrowDownRight className="h-3 w-3" />
      ) : (
        <ArrowUpRight className="h-3 w-3" />
      )}

      {getTypeLabel(type)}
    </span>
  );
}

/* ================================================================
   TRANSACTION ICON
================================================================ */

function TransactionIcon({
  type,
  walletType,
  status,
}: {
  type: DisplayTransactionType;
  walletType: WalletTransactionType;
  status?: WithdrawalStatus;
}) {
  const Icon = getTypeIcon(type);

  const moneyIn = isMoneyIn(type, walletType, status);

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        moneyIn ? "bg-emerald-500/10" : "bg-red-500/10"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${
          moneyIn ? "text-emerald-400" : "text-red-400"
        }`}
      />
    </div>
  );
}

/* ================================================================
   WITHDRAWAL MESSAGE
================================================================ */

function WithdrawalMessage({
  status,
}: {
  status: WithdrawalStatus;
}) {
  if (status === "PENDING") {
    return (
      <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-amber-400" />

          <p className="text-[10px] leading-4 text-amber-400/90">
            Your withdrawal is pending admin review.
          </p>
        </div>
      </div>
    );
  }

  if (status === "PROCESSING") {
    return (
      <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-blue-400" />

          <p className="text-[10px] leading-4 text-blue-400/90">
            Your withdrawal is currently being processed.
          </p>
        </div>
      </div>
    );
  }

  if (status === "COMPLETED") {
    return (
      <div className="mt-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

          <p className="text-[10px] leading-4 text-emerald-400/90">
            Your withdrawal has been approved.
          </p>
        </div>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />

          <p className="text-[10px] leading-4 text-red-400/90">
            This withdrawal was rejected and the funds were returned to your
            wallet.
          </p>
        </div>
      </div>
    );
  }

  if (status === "CANCELLED") {
    return (
      <div className="mt-4 rounded-xl border border-slate-500/10 bg-slate-500/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />

          <p className="text-[10px] leading-4 text-slate-400">
            This withdrawal was cancelled.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/* ================================================================
   TRANSACTION ROW
================================================================ */

function TransactionRow({
  transaction,
  currency,
}: {
  transaction: Transaction;
  currency: string;
}) {
  const moneyIn = isMoneyIn(
    transaction.type,
    transaction.walletType,
    transaction.status,
  );

  return (
    <div className="border-b border-white/5 px-4 py-4 transition last:border-b-0 hover:bg-white/2 sm:px-5">
      {/* ============================================================
          MOBILE
      ============================================================ */}

      <div className="block lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <TransactionIcon
              type={transaction.type}
              walletType={transaction.walletType}
              status={transaction.status}
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {transaction.description}
              </p>

              <p className="mt-1 truncate text-[10px] text-slate-500">
                Ref: {transaction.reference}
              </p>
            </div>
          </div>

          <p
            className={`shrink-0 text-sm font-bold ${
              moneyIn ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {moneyIn ? "+" : "-"}
            {formatCurrency(transaction.amount, currency)}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Type */}

          <div className="min-w-0">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Type
            </p>

            <TypeBadge
              type={transaction.type}
              walletType={transaction.walletType}
              status={transaction.status}
            />
          </div>

          {/* Date */}

          <div className="min-w-0">
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Date
            </p>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <CalendarDays className="h-3 w-3 shrink-0 text-slate-600" />

              <span className="truncate">
                {formatDate(transaction.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {transaction.type === "WITHDRAWAL" &&
          transaction.status && (
            <WithdrawalMessage status={transaction.status} />
          )}
      </div>

      {/* ============================================================
          DESKTOP
      ============================================================ */}

      <div className="hidden lg:grid lg:grid-cols-[2fr_1.1fr_1fr_1.2fr] lg:items-center lg:gap-4">
        {/* Description */}

        <div className="flex min-w-0 items-center gap-3">
          <TransactionIcon
            type={transaction.type}
            walletType={transaction.walletType}
            status={transaction.status}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {transaction.description}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="truncate text-[11px] text-slate-500">
                Ref: {transaction.reference}
              </span>

              <span className="text-slate-700">•</span>

              <span className="text-[11px] text-slate-500">
                Wallet transaction
              </span>
            </div>
          </div>
        </div>

        {/* Amount */}

        <div>
          <p
            className={`text-sm font-bold ${
              moneyIn ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {moneyIn ? "+" : "-"}
            {formatCurrency(transaction.amount, currency)}
          </p>
        </div>

        {/* Type */}

        <div>
          <TypeBadge
            type={transaction.type}
            walletType={transaction.walletType}
            status={transaction.status}
          />
        </div>

        {/* Date */}

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-slate-600" />

            {formatDate(transaction.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <FileText className="h-7 w-7 text-slate-500" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        No transactions yet
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Your wallet credits, deposits, withdrawals, and investment profits
        will appear here once they are recorded.
      </p>

      <Link
        href="/dashboard"
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default async function TransactionsPage() {
  const session = await auth();

  /* ================================================================
     AUTHENTICATION
  ================================================================ */

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "ACTIVE") {
    redirect("/login?error=account-unavailable");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/admin");
  }

  const userId = session.user.id;

  /* ================================================================
     LOAD WALLET + WITHDRAWALS
  ================================================================ */

  const [wallet, withdrawals] = await Promise.all([
    prisma.wallet.findUnique({
      where: {
        userId,
      },

      select: {
        balance: true,
        currency: true,

        transactions: {
          orderBy: {
            createdAt: "desc",
          },

          take: 100,

          select: {
            id: true,
            amount: true,
            type: true,
            description: true,
            reference: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.withdrawal.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,

      select: {
        id: true,
        amount: true,
        currency: true,
        method: true,
        status: true,
        bankName: true,
        accountNumber: true,
        cryptoNetwork: true,
        cryptoAddress: true,
        createdAt: true,
      },
    }),
  ]);

  const currency = wallet?.currency || "USD";

  /* ================================================================
     NORMAL WALLET TRANSACTIONS
  ================================================================ */

  const normalTransactions: Transaction[] = (
    wallet?.transactions ?? []
  )
    /*
     * Withdrawal records created by the withdrawal API
     * are rebuilt from the Withdrawal table so we can
     * display their current status.
     */
    .filter((transaction) => {
      if (
        transaction.type === "WITHDRAWAL" &&
        transaction.reference.startsWith("WD-")
      ) {
        return false;
      }

      return true;
    })
    .map((transaction) => {
      const walletType =
        transaction.type as WalletTransactionType;

      const displayType = getDisplayType(
        walletType,
        transaction.description,
      );

      return {
        id: transaction.id,

        amount: Number(transaction.amount),

        type: displayType,

        walletType,

        description: transaction.description,

        reference: transaction.reference,

        createdAt: transaction.createdAt,
      };
    });

  /* ================================================================
     WITHDRAWAL TRANSACTIONS
  ================================================================ */

  const withdrawalTransactions: Transaction[] =
    withdrawals.map((withdrawal) => {
      let description = "Withdrawal";

      if (withdrawal.method === "BANK") {
        description = withdrawal.bankName
          ? `Bank withdrawal - ${withdrawal.bankName}`
          : "Bank withdrawal";
      } else {
        description = withdrawal.cryptoNetwork
          ? `Crypto withdrawal - ${withdrawal.cryptoNetwork}`
          : "Crypto withdrawal";
      }

      return {
        id: `withdrawal-${withdrawal.id}`,

        amount: Number(withdrawal.amount),

        type: "WITHDRAWAL",

        walletType: "WITHDRAWAL",

        description,

        reference: `WD-${withdrawal.id}`,

        createdAt: withdrawal.createdAt,

        status: withdrawal.status as WithdrawalStatus,

        withdrawalMethod: withdrawal.method,

        withdrawalDestination:
          withdrawal.method === "BANK"
            ? withdrawal.accountNumber
            : withdrawal.cryptoAddress,
      };
    });

  /* ================================================================
     COMBINE + SORT
  ================================================================ */

  const transactions: Transaction[] = [
    ...normalTransactions,
    ...withdrawalTransactions,
  ].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime(),
  );

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <main className="min-h-screen bg-[#080d19] px-3 py-5 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-11 sm:w-11">
                <ArrowDownRight className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold sm:text-3xl">
                  Transactions
                </h1>

                <p className="mt-1 text-[11px] text-slate-400 sm:text-sm">
                  View and track all activity on your wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 sm:flex">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />

            <span className="text-xs text-slate-400">
              Secure wallet history
            </span>
          </div>
        </div>

        {/* ============================================================
            TRANSACTION HISTORY
        ============================================================ */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422] sm:mt-6">
          {/* Section header */}

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:p-5">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Transaction History
              </h2>

              <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                Your latest wallet transactions are shown below.
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] text-slate-400 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs">
              <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

              {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"}
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop header */}

              <div className="hidden grid-cols-[2fr_1.1fr_1fr_1.2fr] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 lg:grid">
                <span>Description</span>
                <span>Amount</span>
                <span>Type / Status</span>
                <span>Date</span>
              </div>

              {/* Transactions */}

              <div>
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    currency={currency}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ============================================================
            INFORMATION
        ============================================================ */}

        <section className="mt-5 grid gap-4 sm:mt-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:h-10 sm:w-10">
                <WalletIcon className="h-4 w-4 text-blue-400 sm:h-5 sm:w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Wallet Balance
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                  Your available balance is read directly from your Wallet
                  record. Pending withdrawals are already deducted from the
                  available balance while awaiting review.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 sm:h-10 sm:w-10">
                <TrendingUp className="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Investment Profits
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                  Investment profit transactions are displayed as credits in
                  your wallet transaction history.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}