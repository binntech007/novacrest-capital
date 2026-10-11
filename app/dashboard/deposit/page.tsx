
import Link from "next/link";
import {
  ArrowLeft,
  Info,
  Wallet,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CryptoDepositFlow from "@/components/dashboard/CryptoDepositFlow";

export const dynamic = "force-dynamic";

export default async function DepositPage() {
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

  const cryptoAddresses =
    await prisma.cryptoDepositAddress.findMany({
      where: {
        enabled: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        network: true,
        address: true,
        qrCodeUrl: true,
        instructions: true,
      },
    });

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/wallet"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Deposit Funds
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Choose your cryptocurrency and enter your deposit amount.
            </p>
          </div>
        </div>

        {/* Important notice */}
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

            <div>
              <p className="text-sm font-medium text-amber-300">
                Check the network before sending
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Send only the selected cryptocurrency using the exact
                network displayed. Sending funds through an unsupported
                network or to an incorrect address may result in loss.
                Your account balance should only be credited after the
                payment has been verified.
              </p>
            </div>
          </div>
        </div>

        {/* Cryptocurrency selection and deposit details */}
        {cryptoAddresses.length === 0 ? (
          <section className="rounded-2xl border border-white/10 bg-[#101621] p-8 text-center">
            <Wallet className="mx-auto h-10 w-10 text-slate-500" />

            <h2 className="mt-4 text-lg font-semibold">
              Deposits temporarily unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              No cryptocurrency deposit methods are currently enabled.
              Please try again later.
            </p>
          </section>
        ) : (
          <CryptoDepositFlow
            cryptoAddresses={cryptoAddresses.map((crypto) => ({
              id: crypto.id,
              name: crypto.name,
              network: crypto.network,
              address: crypto.address,
              qrCodeUrl: crypto.qrCodeUrl,
              instructions: crypto.instructions,
            }))}
          />
        )}
      </div>
    </main>
  );
}
