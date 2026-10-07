"use client";

import {
  Check,
  Copy,
  QrCode,
} from "lucide-react";
import { useState } from "react";

type CryptoDepositCardProps = {
  name: string | null;
  network: string;
  address: string;
  qrCodeUrl: string | null;
  instructions: string | null;
};

export default function CryptoDepositCard({
  name,
  network,
  address,
  qrCodeUrl,
  instructions,
}: CryptoDepositCardProps) {
  const [copied, setCopied] =
    useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(
        address
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">

      {/* CRYPTO NAME */}
      <div className="flex items-center justify-between gap-3">

        <div>
          <h3 className="text-sm font-semibold text-white">
            {name || network}
          </h3>

          <p className="mt-1 text-xs text-violet-400">
            {network}
          </p>
        </div>

        <div className="rounded-full bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-300">
          Crypto
        </div>

      </div>

      {/* QR CODE */}
      {qrCodeUrl ? (
        <div className="mt-5">

          <p className="mb-2 text-xs text-slate-500">
            Scan QR Code
          </p>

          <div className="flex justify-center rounded-xl bg-white p-5">

            <img
              src={qrCodeUrl}
              alt={`${network} deposit QR code`}
              className="h-56 w-56 max-w-full object-contain"
            />

          </div>

        </div>
      ) : (
        <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-white/10">

          <div className="text-center">

            <QrCode className="mx-auto h-8 w-8 text-slate-600" />

            <p className="mt-2 text-xs text-slate-500">
              QR code not available
            </p>

          </div>

        </div>
      )}

      {/* WALLET ADDRESS */}
      <div className="mt-5">

        <p className="mb-2 text-xs text-slate-500">
          Deposit Address
        </p>

        <div className="flex gap-2">

          <div className="min-w-0 flex-1 break-all rounded-xl border border-white/10 bg-[#101621] p-3 text-xs leading-5 text-slate-300">
            {address}
          </div>

          <button
            type="button"
            title={
              copied
                ? "Copied"
                : "Copy address"
            }
            onClick={copyAddress}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

        </div>

        {copied && (
          <p className="mt-2 text-xs text-emerald-400">
            Address copied successfully.
          </p>
        )}

      </div>

      {/* INSTRUCTIONS */}
      {instructions && (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#101621] p-4">

          <p className="text-xs font-medium text-slate-400">
            Deposit Instructions
          </p>

          <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-500">
            {instructions}
          </p>

        </div>
      )}

      {/* WARNING */}
      <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3">
        <p className="text-xs leading-5 text-amber-300/80">
          Make sure you send funds using the
          correct network shown above.
        </p>
      </div>

    </div>
  );
}