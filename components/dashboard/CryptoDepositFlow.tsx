
"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  FileImage,
  Info,
  LoaderCircle,
  Upload,
  Wallet,
} from "lucide-react";
import CryptoDepositCard from "@/components/dashboard/CryptoDepositCard";

type CryptoAddress = {
  id: string;
  name: string | null;
  network: string;
  address: string;
  qrCodeUrl: string | null;
  instructions: string | null;
};

type Props = {
  cryptoAddresses: CryptoAddress[];
};

type ApiResponse = {
  error?: string;
  message?: string;
  deposit?: {
    reference: string;
    status: string;
  };
  url?: string;
  publicId?: string;
};

export default function CryptoDepositFlow({
  cryptoAddresses,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState("");
  const [selectedCryptoId, setSelectedCryptoId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedCrypto = cryptoAddresses.find(
    (crypto) => crypto.id === selectedCryptoId
  );

  function continueToPayment() {
    setError("");
    setSuccess("");

    const parsedAmount = Number(amount);

    if (
      !amount.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      parsedAmount > 1_000_000
    ) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (!selectedCrypto) {
      setError("Please select a cryptocurrency and network.");
      return;
    }

    setShowDetails(true);
  }

  async function copyAddress() {
    if (!selectedCrypto?.address) return;

    try {
      await navigator.clipboard.writeText(selectedCrypto.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the address. Please copy it manually.");
    }
  }

  function handleReceiptChange(file?: File) {
    setError("");
    setSuccess("");

    if (!file) {
      setReceipt(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setReceipt(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("Choose a JPG, PNG, or WEBP receipt image.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setReceipt(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError("Your receipt image must be smaller than 5 MB.");
      return;
    }

    setReceipt(file);
  }

  async function submitDeposit() {
    setError("");
    setSuccess("");

    if (!selectedCrypto) {
      setError("Please select a cryptocurrency.");
      return;
    }

    if (!receipt) {
      setError("Please upload your payment receipt before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      // Upload the receipt to the server.
      const formData = new FormData();
      formData.append("file", receipt);

      const uploadResponse = await fetch("/api/deposits/upload", {
        method: "POST",
        body: formData,
      });

      const uploaded = (await uploadResponse.json()) as ApiResponse;

      if (!uploadResponse.ok || !uploaded.url || !uploaded.publicId) {
        throw new Error(uploaded.error || "Receipt upload failed.");
      }

      // Save the deposit request in the database.
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          cryptoAddressId: selectedCrypto.id,
          receiptUrl: uploaded.url,
          receiptPublicId: uploaded.publicId,
        }),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.deposit) {
        throw new Error(result.error || "Could not submit the deposit.");
      }

      setSuccess(
        `Deposit submitted successfully. Reference: ${result.deposit.reference}. Status: PENDING.`
      );

      setReceipt(null);
      setAmount("");
      setSelectedCryptoId("");
      setShowDetails(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (cryptoAddresses.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-6 text-center">
        <Wallet className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <h2 className="text-lg font-semibold text-white">
          No deposit methods available
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Please check again later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {!showDetails ? (
        <section className="rounded-2xl border border-white/10 bg-[#0b1220] p-5 sm:p-7">
          <div className="mb-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Wallet className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Make a crypto deposit
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Enter your intended amount and choose a cryptocurrency to view
              its deposit instructions.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="deposit-amount"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Deposit amount (USD)
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-[#080d19] px-4 focus-within:border-blue-500">
                <span className="mr-3 text-gray-400">$</span>
                <input
                  id="deposit-amount"
                  type="number"
                  min="0.01"
                  max="1000000"
                  step="any"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent py-3 text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="deposit-crypto"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Cryptocurrency and network
              </label>

              <select
                id="deposit-crypto"
                value={selectedCryptoId}
                onChange={(event) => setSelectedCryptoId(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">Choose a cryptocurrency</option>
                {cryptoAddresses.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name || "Cryptocurrency"} — {crypto.network}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={continueToPayment}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : selectedCrypto ? (
        <section className="space-y-5">
          <button
            type="button"
            onClick={() => {
              setShowDetails(false);
              setError("");
            }}
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to deposit details
          </button>

          <div className="rounded-2xl border border-white/10 bg-[#0b1220] p-5 sm:p-7">
            <h2 className="text-xl font-semibold text-white">
              Payment instructions
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Amount entered:{" "}
              <span className="font-semibold text-white">
                ${Number(amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </span>
            </p>

            <div className="mt-5">
              <CryptoDepositCard
                name={selectedCrypto.name || "Cryptocurrency"}
                network={selectedCrypto.network}
                address={selectedCrypto.address}
                qrCodeUrl={selectedCrypto.qrCodeUrl}
                instructions={selectedCrypto.instructions}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Deposit address
              </label>

              <div className="flex items-stretch gap-2">
                <div className="min-w-0 flex-1 break-all rounded-xl border border-white/10 bg-[#080d19] p-3 text-sm text-gray-200">
                  {selectedCrypto.address}
                </div>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-white hover:bg-white/5"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#080d19] p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-sm leading-6 text-gray-300">
                  Confirm the cryptocurrency and network before sending.
                  Uploading a receipt is not proof that funds have arrived.
                  Your request remains pending until the payment is verified.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="deposit-receipt"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Upload payment receipt
              </label>

              <input
                ref={fileInputRef}
                id="deposit-receipt"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  handleReceiptChange(event.target.files?.[0])
                }
                className="block w-full rounded-xl border border-white/10 bg-[#080d19] p-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:font-medium file:text-white"
              />

              <p className="mt-2 text-xs text-gray-500">
                Accepted formats: JPG, PNG, WEBP. Maximum size: 5 MB.
              </p>

              {receipt && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#080d19] p-3 text-sm text-gray-300">
                  <FileImage className="h-5 w-5 text-blue-400" />
                  <span className="min-w-0 flex-1 truncate">
                    {receipt.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReceipt(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submitDeposit}
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Submitting deposit...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit deposit for review
                </>
              )}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
