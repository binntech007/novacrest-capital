import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "PROCESSING"
  | "REJECTED"
  | "CANCELLED";

type AdminTransaction = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  reference: string;
  status: TransactionStatus;
  createdAt: Date;
};

function formatCurrency(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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

function isMoneyIn(type: string) {
  return (
    type === "CREDIT" ||
    type === "DEPOSIT" ||
    type === "INVESTMENT_PROFIT"
  );
}

function getTypeLabel(type: string) {
  switch (type) {
    case "CREDIT":
      return "Credit";

    case "DEPOSIT":
      return "Deposit";

    case "WITHDRAWAL":
      return "Withdrawal";

    case "INVESTMENT_PROFIT":
      return "Investment Profit";

    case "INVESTMENT":
      return "Investment";

    case "TRADING_BOT":
      return "Trading Bot";

    case "TRANSFER":
      return "Transfer";

    default:
      return type.replace(/_/g, " ");
  }
}

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }

  if (
    status === "PENDING" ||
    status === "PROCESSING"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
        <Clock3 className="h-3 w-3" />
        {status === "PENDING"
          ? "Pending"
          : "Processing"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-semibold text-red-300">
      <XCircle className="h-3 w-3" />
      {status === "CANCELLED"
        ? "Cancelled"
        : "Rejected"}
    </span>
  );
}

function TransactionIcon({
  type,
}: {
  type: string;
}) {
  const moneyIn = isMoneyIn(type);

  if (type === "WITHDRAWAL") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
        <ArrowUpRight className="h-[18px] w-[18px] text-red-400" />
      </div>
    );
  }

  if (type === "TRANSFER") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
        <ArrowLeftRight className="h-[18px] w-[18px] text-violet-400" />
      </div>
    );
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        moneyIn
          ? "bg-emerald-500/10"
          : "bg-red-500/10"
      }`}
    >
      {moneyIn ? (
        <ArrowDownLeft className="h-[18px] w-[18px] text-emerald-400" />
      ) : (
        <ArrowUpRight className="h-[18px] w-[18px] text-red-400" />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
        <FileText className="h-7 w-7 text-slate-500" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        No transactions yet
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Customer wallet transactions and withdrawals
        will appear here.
      </p>
    </div>
  );
}

export default async function AdminTransactionsPage() {
  const session = await auth();

  /*
   * Authentication
   */
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  /*
   * Account status
   */
  if (session.user.status !== "ACTIVE") {
    redirect(
      "/admin/login?error=account-unavailable"
    );
  }

  /*
   * Admin only
   */
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  /*
   * Load wallet transactions and withdrawals.
   */
  const [walletTransactions, withdrawals] =
    await Promise.all([
      prisma.walletTransaction.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 500,

        select: {
          id: true,
          walletId: true,
          amount: true,
          type: true,
          description: true,
          reference: true,
          createdAt: true,

          wallet: {
            select: {
              currency: true,

              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),

      prisma.withdrawal.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 500,

        select: {
          id: true,
          userId: true,
          amount: true,
          currency: true,
          method: true,
          status: true,
          bankName: true,
          accountNumber: true,
          cryptoNetwork: true,
          cryptoAddress: true,
          createdAt: true,

          user: {
            select: {
              firstName: true,
              lastName: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

  /*
   * Convert wallet transactions.
   */
  const normalTransactions: AdminTransaction[] =
    walletTransactions
      /*
       * Withdrawal records created by the withdrawal
       * API are represented by the Withdrawal table
       * because that table contains the current status.
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
        const user =
          transaction.wallet.user;

        const customerName =
          user.name?.trim() ||
          `${user.firstName ?? ""} ${
            user.lastName ?? ""
          }`.trim() ||
          "Customer";

        return {
          id: transaction.id,

          customerName,

          customerEmail: user.email,

          amount: Number(transaction.amount),

          currency:
            transaction.wallet.currency || "USD",

          type: transaction.type,

          description: transaction.description,

          reference: transaction.reference,

          /*
           * WalletTransaction records represent
           * completed account activity.
           */
          status: "COMPLETED",

          createdAt: transaction.createdAt,
        };
      });

  /*
   * Convert withdrawals.
   */
  const withdrawalTransactions: AdminTransaction[] =
    withdrawals.map((withdrawal) => {
      const user = withdrawal.user;

      const customerName =
        user.name?.trim() ||
        `${user.firstName ?? ""} ${
          user.lastName ?? ""
        }`.trim() ||
        "Customer";

      let description = "Withdrawal";

      if (withdrawal.method === "BANK") {
        description = withdrawal.bankName
          ? `Bank withdrawal - ${withdrawal.bankName}`
          : "Bank withdrawal";
      } else {
        description =
          withdrawal.cryptoNetwork
            ? `Crypto withdrawal - ${withdrawal.cryptoNetwork}`
            : "Crypto withdrawal";
      }

      return {
        id: `withdrawal-${withdrawal.id}`,

        customerName,

        customerEmail: user.email,

        amount: Number(withdrawal.amount),

        currency:
          withdrawal.currency || "USD",

        type: "WITHDRAWAL",

        description,

        reference: `WD-${withdrawal.id}`,

        status:
          withdrawal.status as TransactionStatus,

        createdAt: withdrawal.createdAt,
      };
    });

  /*
   * Combine everything.
   */
  const transactions: AdminTransaction[] = [
    ...normalTransactions,
    ...withdrawalTransactions,
  ].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime()
  );

  /*
   * Summary statistics.
   */
  const totalTransactions =
    transactions.length;

  const pendingTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status === "PENDING" ||
        transaction.status === "PROCESSING"
    ).length;

  const completedTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status === "COMPLETED"
    ).length;

  const totalWithdrawals =
    transactions
      .filter(
        (transaction) =>
          transaction.type === "WITHDRAWAL"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  return (
    <main className="min-h-screen bg-[#080d19] px-3 py-5 text-white sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <ArrowLeftRight className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Transactions
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                View and monitor all customer account activity.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />

            <span className="text-xs text-slate-400">
              Admin transaction monitoring
            </span>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            title="Transactions"
            value={totalTransactions.toString()}
            description="Total recorded activity"
            icon={ArrowLeftRight}
          />

          <SummaryCard
            title="Completed"
            value={completedTransactions.toString()}
            description="Completed transactions"
            icon={CheckCircle2}
          />

          <SummaryCard
            title="Pending"
            value={pendingTransactions.toString()}
            description="Pending or processing"
            icon={Clock3}
          />

          <SummaryCard
            title="Withdrawals"
            value={formatCurrency(
              totalWithdrawals,
              "USD"
            )}
            description="Recorded withdrawal value"
            icon={Wallet}
          />

        </section>

        {/* TRANSACTION TABLE */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                All Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest customer wallet and withdrawal activity.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
              <FileText className="h-3.5 w-3.5" />

              {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"}
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop table header */}
              <div className="hidden grid-cols-[2fr_1.3fr_1.2fr_1.1fr_1.2fr] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 lg:grid">
                <span>Customer</span>
                <span>Transaction</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {transactions.map(
                  (transaction) => {
                    const moneyIn =
                      isMoneyIn(
                        transaction.type
                      );

                    return (
                      <div
                        key={transaction.id}
                        className="px-4 py-4 transition hover:bg-white/[0.02] sm:px-5"
                      >
                        {/* Desktop */}
                        <div className="hidden grid-cols-[2fr_1.3fr_1.2fr_1.1fr_1.2fr] items-center gap-4 lg:grid">

                          {/* Customer */}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {transaction.customerName}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {transaction.customerEmail}
                            </p>
                          </div>

                          {/* Transaction */}
                          <div className="flex min-w-0 items-center gap-3">
                            <TransactionIcon
                              type={transaction.type}
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-200">
                                {getTypeLabel(
                                  transaction.type
                                )}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {transaction.description}
                              </p>

                              <p className="mt-1 truncate font-mono text-[10px] text-slate-600">
                                {transaction.reference}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                moneyIn
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {moneyIn
                                ? "+"
                                : "-"}
                              {formatCurrency(
                                transaction.amount,
                                transaction.currency
                              )}
                            </p>
                          </div>

                          {/* Status */}
                          <div>
                            <StatusBadge
                              status={
                                transaction.status
                              }
                            />
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-600" />

                            <span>
                              {formatDate(
                                transaction.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Mobile */}
                        <div className="lg:hidden">
                          <div className="flex items-start gap-3">
                            <TransactionIcon
                              type={transaction.type}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {transaction.customerName}
                                  </p>

                                  <p className="mt-1 truncate text-xs text-slate-500">
                                    {transaction.customerEmail}
                                  </p>
                                </div>

                                <p
                                  className={`shrink-0 text-sm font-semibold ${
                                    moneyIn
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {moneyIn
                                    ? "+"
                                    : "-"}
                                  {formatCurrency(
                                    transaction.amount,
                                    transaction.currency
                                  )}
                                </p>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-300">
                                  {getTypeLabel(
                                    transaction.type
                                  )}
                                </span>

                                <StatusBadge
                                  status={
                                    transaction.status
                                  }
                                />
                              </div>

                              <p className="mt-2 text-xs text-slate-500">
                                {transaction.description}
                              </p>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
                                <span className="font-mono">
                                  {transaction.reference}
                                </span>

                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {formatDate(
                                    transaction.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
      </div>
    </div>
  );
}