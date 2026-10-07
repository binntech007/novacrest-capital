import Link from "next/link";
import {
  ArrowLeft,
  ArrowDownToLine,
  Info,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import WithdrawalForm from "@/components/dashboard/WithdrawalForm";

export const dynamic = "force-dynamic";

export default async function WithdrawPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "ACTIVE") {
    redirect("/login?error=account-unavailable");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/admin");
  }

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
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/wallet"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <ArrowDownToLine className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Withdraw Funds
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Request a withdrawal to your bank account or crypto wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#101621] p-5">
          <p className="text-xs text-slate-500">
            Available Balance
          </p>

          <p className="mt-2 text-3xl font-bold">
            {currency}{" "}
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Information */}
        <div className="mb-6 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

          <div>
            <p className="text-sm font-medium text-amber-300">
              Withdrawal review
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Withdrawal requests are submitted for review before they
              are marked as completed. Make sure the destination details
              you provide are correct.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">
          <WithdrawalForm
            balance={balance}
            currency={currency}
          />
        </div>
      </div>
    </main>
  );
}