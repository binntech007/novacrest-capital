"use client";

import {
  ArrowRight,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Wallet,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

type TransferFormProps = {
  mainBalance: number;
  investmentBalance: number;
  currency: string;
};

type TransferMode =
  | "INVESTMENT"
  | "CUSTOMER";

function formatCurrency(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function TransferForm({
  mainBalance,
  investmentBalance,
  currency,
}: TransferFormProps) {
  const [mode, setMode] =
    useState<TransferMode>(
      "INVESTMENT"
    );

  const [amount, setAmount] =
    useState("");

  const [recipientEmail, setRecipientEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid amount."
      );
      return;
    }

    if (
      mode === "INVESTMENT" &&
      numericAmount > investmentBalance
    ) {
      setError(
        "The transfer amount is greater than your investment account balance."
      );
      return;
    }

    if (
      mode === "CUSTOMER" &&
      numericAmount > mainBalance
    ) {
      setError(
        "The transfer amount is greater than your main account balance."
      );
      return;
    }

    if (
      mode === "CUSTOMER" &&
      !recipientEmail.trim()
    ) {
      setError(
        "Enter the recipient's email address."
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "INVESTMENT"
          ? "/api/transfers/investment-to-main"
          : "/api/transfers/customer";

      const body =
        mode === "INVESTMENT"
          ? {
              amount:
                numericAmount,
            }
          : {
              amount:
                numericAmount,
              recipientEmail:
                recipientEmail
                  .trim()
                  .toLowerCase(),
            };

      const response =
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to complete transfer."
        );
      }

      if (mode === "INVESTMENT") {
        setSuccess(
          "Funds have been transferred to your main account successfully."
        );
      } else {
        setSuccess(
          "Money has been transferred to the customer successfully."
        );
      }

      setAmount("");
      setRecipientEmail("");

      /*
       * Refresh the server-rendered page so the
       * balance cards show the new values.
       */
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to complete transfer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">
      {/* ==========================================================
          MODE SELECTOR
      ========================================================== */}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setMode("INVESTMENT");
            setError("");
            setSuccess("");
          }}
          className={`rounded-xl border p-4 text-left transition ${
            mode === "INVESTMENT"
              ? "border-violet-500/40 bg-violet-500/10"
              : "border-white/10 bg-[#080d19] hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                mode === "INVESTMENT"
                  ? "bg-violet-500/15"
                  : "bg-white/5"
              }`}
            >
              <Building2 className="h-5 w-5 text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Investment to Main
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Move investment funds to your wallet.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("CUSTOMER");
            setError("");
            setSuccess("");
          }}
          className={`rounded-xl border p-4 text-left transition ${
            mode === "CUSTOMER"
              ? "border-violet-500/40 bg-violet-500/10"
              : "border-white/10 bg-[#080d19] hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                mode === "CUSTOMER"
                  ? "bg-violet-500/15"
                  : "bg-white/5"
              }`}
            >
              <Mail className="h-5 w-5 text-violet-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Send to Customer
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Send money using their email.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ==========================================================
          FORM
      ========================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        {mode === "CUSTOMER" && (
          <div className="mb-5">
            <label
              htmlFor="recipientEmail"
              className="mb-2 block text-xs font-medium text-slate-300"
            >
              Recipient email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(event) =>
                  setRecipientEmail(
                    event.target.value
                  )
                }
                placeholder="customer@example.com"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#080d19] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/40"
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="amount"
              className="text-xs font-medium text-slate-300"
            >
              Amount
            </label>

            <span className="text-[10px] text-slate-500">
              Available:{" "}
              {formatCurrency(
                mode === "INVESTMENT"
                  ? investmentBalance
                  : mainBalance,
                currency
              )}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              {currency}
            </span>

            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="0.00"
              disabled={loading}
              className="h-14 w-full rounded-xl border border-white/10 bg-[#080d19] pl-16 pr-4 text-lg font-semibold text-white outline-none transition placeholder:text-slate-700 focus:border-violet-500/40"
            />
          </div>
        </div>

        {/* ========================================================
            TRANSFER PREVIEW
        ======================================================== */}

        <div className="mt-5 rounded-xl border border-white/10 bg-[#080d19] p-4">
          {mode === "INVESTMENT" ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <Building2 className="h-4 w-4 text-violet-400" />
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    Investment Account
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Source
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-600" />

              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-xs font-medium text-white">
                    Main Account
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Destination
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    Main Account
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Your wallet
                  </p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-slate-600" />

              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-xs font-medium text-white">
                    Customer
                  </p>

                  <p className="max-w-[130px] truncate text-[10px] text-slate-500">
                    {recipientEmail ||
                      "Recipient"}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ERROR
        ======================================================== */}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-xs leading-5 text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* ========================================================
            SUCCESS
        ======================================================== */}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />

              <p className="text-xs leading-5 text-emerald-400">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================
            SUBMIT
        ======================================================== */}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="h-4 w-4" />

              {mode === "INVESTMENT"
                ? "Transfer to Main Account"
                : "Send Money"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}