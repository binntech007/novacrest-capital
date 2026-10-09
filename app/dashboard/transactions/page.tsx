import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  TrendingUp,
  Wallet as WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type WalletTransactionType =
  | "CREDIT"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "INVESTMENT_PROFIT";

type Transaction = {
  id: string;
  amount: number;
  type: WalletTransactionType;
  description: string;
  reference: string;
  createdAt: Date;
};

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

function isMoneyIn(type: WalletTransactionType) {
  return (
    type === "CREDIT" ||
    type === "DEPOSIT" ||
    type === "INVESTMENT_PROFIT"
  );
}

function getTypeLabel(type: WalletTransactionType) {
  switch (type) {
    case "CREDIT":
      return "Credit";
    case "DEPOSIT":
      return "Deposit";
    case "WITHDRAWAL":
      return "Withdrawal";
    case "INVESTMENT_PROFIT":
      return "Investment Profit";
    default:
      return "Transaction";
  }
}

function getTypeIcon(type: WalletTransactionType): LucideIcon {
  switch (type) {
    case "CREDIT":
      return ArrowDownLeft;
    case "DEPOSIT":
      return Banknote;
    case "WITHDRAWAL":
      return ArrowUpRight;
    case "INVESTMENT_PROFIT":
      return TrendingUp;
    default:
      return FileText;
  }
}

function TypeBadge({ type }: { type: WalletTransactionType }) {
  const moneyIn = isMoneyIn(type);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
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

function TransactionIcon({ type }: { type: WalletTransactionType }) {
  const Icon = getTypeIcon(type);
  const moneyIn = isMoneyIn(type);

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

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-1 truncate text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function TransactionRow({
  transaction,
  currency,
}: {
  transaction: Transaction;
  currency: string;
}) {
  const moneyIn = isMoneyIn(transaction.type);

  return (
    <div className="border-b border-white/5 px-5 py-4 transition last:border-b-0 hover:bg-white/[0.02]">
      <div className="grid gap-4 lg:grid-cols-[2fr_1.1fr_1fr_1.2fr] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <TransactionIcon type={transaction.type} />

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

              <Link
                href={`/dashboard/transactions/receipt?reference=${encodeURIComponent(
                  transaction.reference
                )}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-blue-400 transition hover:bg-blue-500/15 hover:text-blue-300"
                aria-label={`View receipt for transaction ${transaction.reference}`}
              >
                <FileText className="h-3.5 w-3.5" />
                View Receipt
              </Link>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-600 lg:hidden">
            Amount
          </p>

          <p
            className={`text-sm font-bold ${
              moneyIn ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {moneyIn ? "+" : "-"}
            {formatCurrency(transaction.amount, currency)}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-600 lg:hidden">
            Type
          </p>

          <TypeBadge type={transaction.type} />
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-600 lg:hidden">
            Date
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5 text-slate-600" />
            {formatDate(transaction.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

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
        Your wallet credits, deposits, withdrawals, and investment
        profits will appear here once they are recorded.
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

export default async function TransactionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wallet = await prisma.wallet.findUnique({
    where: {
      userId: session.user.id,
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
  });

  const currency = wallet?.currency || "USD";
  const balance = Number(wallet?.balance ?? 0);

  const transactions: Transaction[] = (wallet?.transactions ?? []).map(
    (transaction) => ({
      id: transaction.id,
      amount: Number(transaction.amount),
      type: transaction.type as WalletTransactionType,
      description: transaction.description,
      reference: transaction.reference,
      createdAt: transaction.createdAt,
    }),
  );

  const totalCredits = transactions
    .filter((transaction) => isMoneyIn(transaction.type))
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalWithdrawals = transactions
    .filter((transaction) => transaction.type === "WITHDRAWAL")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalInvestmentProfit = transactions
    .filter((transaction) => transaction.type === "INVESTMENT_PROFIT")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <ArrowDownRight className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Transactions
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  View and track all activity on your wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />

            <span className="text-xs text-slate-400">
              Secure wallet history
            </span>
          </div>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Available Balance"
            value={formatCurrency(balance, currency)}
            description="Current wallet balance"
            icon={WalletIcon}
            iconClassName="bg-blue-500/10 text-blue-400"
          />

          <SummaryCard
            title="Total Credits"
            value={formatCurrency(totalCredits, currency)}
            description="Credits, deposits and profits"
            icon={ArrowDownRight}
            iconClassName="bg-emerald-500/10 text-emerald-400"
          />

          <SummaryCard
            title="Total Withdrawals"
            value={formatCurrency(totalWithdrawals, currency)}
            description="Recorded withdrawals"
            icon={ArrowUpRight}
            iconClassName="bg-red-500/10 text-red-400"
          />

          <SummaryCard
            title="Investment Profit"
            value={formatCurrency(totalInvestmentProfit, currency)}
            description="Recorded investment profits"
            icon={TrendingUp}
            iconClassName="bg-purple-500/10 text-purple-400"
          />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Transaction History
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest wallet transactions are shown below.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
              <FileText className="h-3.5 w-3.5" />

              {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"}
            </div>
          </div>

          {transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="hidden grid-cols-[2fr_1.1fr_1fr_1.2fr] gap-4 border-b border-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 lg:grid">
                <span>Description</span>
                <span>Amount</span>
                <span>Type</span>
                <span>Date</span>
              </div>

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

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <WalletIcon className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Wallet Balance
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your available balance is read directly from your
                  Wallet record.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Investment Profits
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Investment profit transactions are displayed as
                  credits and included in the Investment Profit
                  summary.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
