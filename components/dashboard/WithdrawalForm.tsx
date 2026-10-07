"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Wallet,
} from "lucide-react";

type WithdrawalFormProps = {
  balance: number;
  currency: string;
};

export default function WithdrawalForm({
  balance,
  currency,
}: WithdrawalFormProps) {
  const [method, setMethod] = useState<"BANK" | "CRYPTO">("BANK");
  const [amount, setAmount] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [iban, setIban] = useState("");

  const [cryptoNetwork, setCryptoNetwork] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submitWithdrawal(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericAmount = Number(amount);

    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (numericAmount > balance) {
      setError("Withdrawal amount cannot exceed your available balance.");
      return;
    }

    if (method === "BANK") {
      if (!bankName.trim()) {
        setError("Enter your bank name.");
        return;
      }

      if (!accountName.trim()) {
        setError("Enter the account name.");
        return;
      }

      if (!accountNumber.trim()) {
        setError("Enter your account number.");
        return;
      }
    }

    if (method === "CRYPTO") {
      if (!cryptoNetwork.trim()) {
        setError("Enter the crypto network.");
        return;
      }

      if (!cryptoAddress.trim()) {
        setError("Enter your crypto wallet address.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.trim(),
          method,

          bankName,
          accountName,
          accountNumber,
          routingNumber,
          swiftCode,
          iban,

          cryptoNetwork,
          cryptoAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to submit withdrawal.");
        return;
      }

      setSuccess(
        "Withdrawal request submitted successfully. It is now pending review."
      );

      setAmount("");

      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setRoutingNumber("");
      setSwiftCode("");
      setIban("");

      setCryptoNetwork("");
      setCryptoAddress("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitWithdrawal} className="space-y-6">
      {/* Method */}
      <div>
        <p className="mb-3 text-sm font-medium text-slate-300">
          Withdrawal Method
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod("BANK")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "BANK"
                ? "border-blue-500/40 bg-blue-500/10"
                : "border-white/10 bg-[#080d19] hover:bg-white/5"
            }`}
          >
            <Building2
              className={`h-6 w-6 ${
                method === "BANK"
                  ? "text-blue-400"
                  : "text-slate-500"
              }`}
            />

            <p className="mt-3 text-sm font-semibold">
              Bank Account
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Withdraw to a bank account
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMethod("CRYPTO")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "CRYPTO"
                ? "border-violet-500/40 bg-violet-500/10"
                : "border-white/10 bg-[#080d19] hover:bg-white/5"
            }`}
          >
            <Wallet
              className={`h-6 w-6 ${
                method === "CRYPTO"
                  ? "text-violet-400"
                  : "text-slate-500"
              }`}
            />

            <p className="mt-3 text-sm font-semibold">
              Crypto Wallet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Withdraw to a crypto address
            </p>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Withdrawal Amount
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            $
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3 pl-9 pr-4 text-white outline-none transition focus:border-blue-500/50"
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Available balance:{" "}
          {currency}{" "}
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Bank */}
      {method === "BANK" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#080d19] p-5">
          <div>
            <h3 className="font-semibold">Bank Account Details</h3>
            <p className="mt-1 text-xs text-slate-500">
              Enter the account where the withdrawal should be sent.
            </p>
          </div>

          <Input
            label="Bank Name"
            value={bankName}
            onChange={setBankName}
            placeholder="Enter bank name"
          />

          <Input
            label="Account Name"
            value={accountName}
            onChange={setAccountName}
            placeholder="Enter account name"
          />

          <Input
            label="Account Number"
            value={accountNumber}
            onChange={setAccountNumber}
            placeholder="Enter account number"
          />

          <Input
            label="Routing Number"
            value={routingNumber}
            onChange={setRoutingNumber}
            placeholder="Optional"
          />

          <Input
            label="SWIFT / BIC"
            value={swiftCode}
            onChange={setSwiftCode}
            placeholder="Optional"
          />

          <Input
            label="IBAN"
            value={iban}
            onChange={setIban}
            placeholder="Optional"
          />
        </div>
      )}

      {/* Crypto */}
      {method === "CRYPTO" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#080d19] p-5">
          <div>
            <h3 className="font-semibold">Crypto Wallet Details</h3>
            <p className="mt-1 text-xs text-slate-500">
              Make sure the network matches your wallet.
            </p>
          </div>

          <Input
            label="Network"
            value={cryptoNetwork}
            onChange={setCryptoNetwork}
            placeholder="e.g. Bitcoin, Ethereum, USDT TRC20"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Wallet Address
            </label>

            <textarea
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
              placeholder="Enter your wallet address"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#101621] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/50"
            />
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Withdrawal
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#101621] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
      />
    </div>
  );
}