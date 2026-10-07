import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ArrowUpRight as ExternalArrowUpRight,
  Wallet,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import LiveCryptoMarket from "@/components/dashboard/LiveCryptoMarket";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const walletActions = [
  {
    label: "Deposit",
    description: "Add funds to your wallet",
    href: "/dashboard/deposit",
    icon: ArrowDownLeft,
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    label: "Withdraw",
    description: "Withdraw available funds",
    href: "/dashboard/withdraw",
    icon: ArrowUpRight,
    color: "bg-orange-500/10 text-orange-400",
  },
  {
    label: "Transfer",
    description: "Send money to an account",
    href: "/dashboard/transfer",
    icon: ArrowLeftRight,
    color: "bg-blue-500/10 text-blue-400",
  },
];

function formatBalance(
  balance: number,
  currency: string,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);
}

export default async function WalletPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * Get the wallet belonging to the currently logged-in user.
   *
   * The balance comes directly from:
   * Wallet.balance
   *
   * The currency comes directly from:
   * Wallet.currency
   */
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      balance: true,
      currency: true,
    },
  });

  const balance = Number(wallet?.balance ?? 0);
  const currency = wallet?.currency ?? "USD";

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
            <Wallet size={16} />
            <span>Customer dashboard</span>
            <span>/</span>
            <span className="text-emerald-400">
              Wallet
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Wallet
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your funds and follow cryptocurrency market
            prices.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
          <ShieldCheck size={15} />
          Secure wallet
        </div>
      </div>

      {/* Wallet balance */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#142a35] via-[#10212c] to-[#101827] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <CircleDollarSign size={18} />
            <span>Total wallet balance</span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {formatBalance(balance, currency)}
            </h2>

            <span className="mb-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
              {currency}
            </span>
          </div>

          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
            This is your current available wallet balance. The
            amount is loaded directly from your wallet record in
            the database.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {walletActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-400/30 hover:bg-white/[0.08]"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
                  >
                    <Icon size={21} />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-semibold text-white">
                      {action.label}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      {action.description}
                    </span>
                  </span>

                  <ExternalArrowUpRight
                    size={16}
                    className="ml-auto shrink-0 text-slate-500 transition group-hover:text-emerald-400"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cryptocurrency market */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Cryptocurrency Market
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Track cryptocurrency prices and 24-hour market
            changes.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827] p-4 sm:p-6">
          <LiveCryptoMarket />
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Market prices are informational and may be delayed.
          They are not wallet balances or guaranteed trading
          prices.
        </p>
      </section>
    </div>
  );
}
