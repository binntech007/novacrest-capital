import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Info,
  QrCode,
  Wallet,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import CryptoDepositCard from "@/components/dashboard/CryptoDepositCard";

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

  const [cryptoAddresses, bank] =
    await Promise.all([
      prisma.cryptoDepositAddress.findMany({
        where: {
          enabled: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.bankPaymentSettings.findFirst({
        where: {
          enabled: true,
        },
      }),
    ]);

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          href="/dashboard/wallet"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Wallet
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Deposit Funds
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Choose one of the available payment
                methods below.
              </p>
            </div>

          </div>
        </div>

        {/* PAYMENT WARNING */}
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex gap-3">

            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

            <div>
              <p className="text-sm font-medium text-amber-300">
                Verify payment details
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Always use the current payment details
                displayed on this page before making a
                transfer or cryptocurrency payment.
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* =====================================================
              CRYPTO
          ====================================================== */}

          <section className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <QrCode className="h-5 w-5 text-violet-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Cryptocurrency
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Available cryptocurrency payment
                  addresses
                </p>
              </div>

            </div>

            {cryptoAddresses.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No cryptocurrency payment methods
                  are currently available.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">

                {cryptoAddresses.map(
                  (crypto) => (
                    <CryptoDepositCard
                      key={crypto.id}
                      name={crypto.name}
                      network={crypto.network}
                      address={crypto.address}
                      qrCodeUrl={
                        crypto.qrCodeUrl
                      }
                      instructions={
                        crypto.instructions
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>

          {/* =====================================================
              BANK
          ====================================================== */}

          <section className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Bank Transfer
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current bank transfer details
                </p>
              </div>

            </div>

            {!bank ? (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-sm text-slate-500">
                  Bank transfer is currently
                  unavailable.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">

                <BankDetail
                  label="Bank Name"
                  value={bank.bankName}
                />

                <BankDetail
                  label="Account Name"
                  value={
                    bank.bankAccountName
                  }
                />

                <BankDetail
                  label="Account Number"
                  value={
                    bank.bankAccountNumber
                  }
                />

                {bank.bankRoutingNumber && (
                  <BankDetail
                    label="Routing Number"
                    value={
                      bank.bankRoutingNumber
                    }
                  />
                )}

                {bank.bankSwiftCode && (
                  <BankDetail
                    label="SWIFT / BIC"
                    value={
                      bank.bankSwiftCode
                    }
                  />
                )}

                {bank.bankIban && (
                  <BankDetail
                    label="IBAN"
                    value={
                      bank.bankIban
                    }
                  />
                )}

                {bank.depositInstructions && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#080d19] p-4">

                    <p className="text-xs font-medium text-slate-400">
                      Deposit Instructions
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                      {
                        bank.depositInstructions
                      }
                    </p>

                  </div>
                )}

              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}

function BankDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-white">
        {value}
      </p>

    </div>
  );
}