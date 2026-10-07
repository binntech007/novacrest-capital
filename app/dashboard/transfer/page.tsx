import Link from "next/link";
import {
  ArrowLeft,
  ArrowRightLeft,
  Building2,
  ChevronRight,
  Mail,
  Wallet,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import TransferForm from "@/components/dashboard/TransferForm";

export const dynamic = "force-dynamic";

export default async function TransferPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "ACTIVE") {
    redirect(
      "/login?error=account-unavailable"
    );
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/admin");
  }

  const [wallet, allocation] =
    await Promise.all([
      prisma.wallet.findUnique({
        where: {
          userId: session.user.id,
        },

        select: {
          balance: true,
          currency: true,
        },
      }),

      prisma.customerAllocation.findUnique({
        where: {
          userId: session.user.id,
        },

        select: {
          activeInvestmentAmount: true,
        },
      }),
    ]);

  const currency =
    wallet?.currency || "USD";

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ========================================================
            BACK
        ======================================================== */}

        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* ========================================================
            HEADER
        ======================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
              <ArrowRightLeft className="h-6 w-6 text-violet-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Transfer Money
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Move funds between your accounts or send money to another customer.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            BALANCE CARDS
        ======================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#101621] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Main account
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {new Intl.NumberFormat(
                    "en-US",
                    {
                      style: "currency",
                      currency,
                    }
                  ).format(
                    Number(
                      wallet?.balance ?? 0
                    )
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101621] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Building2 className="h-5 w-5 text-violet-400" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Investment account
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {new Intl.NumberFormat(
                    "en-US",
                    {
                      style: "currency",
                      currency,
                    }
                  ).format(
                    Number(
                      allocation?.activeInvestmentAmount ??
                        0
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            TRANSFER FORM
        ======================================================== */}

        <TransferForm
          mainBalance={Number(
            wallet?.balance ?? 0
          )}
          investmentBalance={Number(
            allocation?.activeInvestmentAmount ??
              0
          )}
          currency={currency}
        />

        {/* ========================================================
            SECURITY NOTE
        ======================================================== */}

        <div className="mt-6 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
          <p className="text-xs leading-5 text-amber-300/80">
            Check the recipient email and transfer amount
            carefully before confirming a customer-to-customer
            transfer.
          </p>
        </div>
      </div>
    </main>
  );
}