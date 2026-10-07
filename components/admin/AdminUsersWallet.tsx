"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  Wallet,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck,
  TrendingUp,
  Bot,
  Save,
  Trash2,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "BLOCKED" | string;
  balance: string;
  currency: string;
  activeInvestmentAmount: string;
  tradingBotAmount: string;
};

type AdminUsersWalletProps = {
  customers: Customer[];
};

/* ========================================================================= */
/* HELPERS                                                                   */
/* ========================================================================= */

function formatMoney(
  amount: string | number,
  currency: string,
): string {
  const value = Number(amount);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);
  } catch {
    return `${currency} ${
      Number.isFinite(value) ? value.toFixed(2) : "0.00"
    }`;
  }
}

function formatNumber(
  amount: string | number,
): string {
  const value = Number(amount);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

/* ========================================================================= */
/* COMPONENT                                                                 */
/* ========================================================================= */

export default function AdminUsersWallet({
  customers,
}: AdminUsersWalletProps) {
  /* ----------------------------------------------------------------------- */
  /* CUSTOMER SELECTION                                                      */
  /* ----------------------------------------------------------------------- */

  const [userId, setUserId] = useState("");

  /* ----------------------------------------------------------------------- */
  /* ACCOUNT VALUES                                                           */
  /* ----------------------------------------------------------------------- */

  const [walletBalance, setWalletBalance] = useState("");

  const [activeInvestmentAmount, setActiveInvestmentAmount] =
    useState("");

  const [tradingBotAmount, setTradingBotAmount] =
    useState("");

  const [reason, setReason] = useState("");

  /* ----------------------------------------------------------------------- */
  /* SEARCH                                                                   */
  /* ----------------------------------------------------------------------- */

  const [search, setSearch] = useState("");

  /* ----------------------------------------------------------------------- */
  /* MESSAGES                                                                 */
  /* ----------------------------------------------------------------------- */

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  /* ----------------------------------------------------------------------- */
  /* TRANSITION                                                               */
  /* ----------------------------------------------------------------------- */

  const [pending, startTransition] = useTransition();

  /* ========================================================================= */
  /* SELECTED CUSTOMER                                                        */
  /* ========================================================================= */

  const selectedCustomer = customers.find(
    (customer) => customer.id === userId,
  );

  /* ========================================================================= */
  /* FILTER CUSTOMERS                                                         */
  /* ========================================================================= */

  const filteredCustomers = customers.filter(
    (customer) => {
      const query = search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.email
          .toLowerCase()
          .includes(query)
      );
    },
  );

  /* ========================================================================= */
  /* SELECT CUSTOMER                                                           */
  /* ========================================================================= */

  function selectCustomer(customer: Customer) {
    setUserId(customer.id);

    setWalletBalance(
      customer.balance || "0.00",
    );

    setActiveInvestmentAmount(
      customer.activeInvestmentAmount || "0.00",
    );

    setTradingBotAmount(
      customer.tradingBotAmount || "0.00",
    );

    setReason("");

    setMessage("");

    setSuccess(false);
  }

  /* ========================================================================= */
  /* UPDATE CUSTOMER ACCOUNT                                                  */
  /* ========================================================================= */

  function handleAccountSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    /* ----------------------------------------------------------------------- */
    /* CUSTOMER                                                                 */
    /* ----------------------------------------------------------------------- */

    if (!userId) {
      setMessage("Please select a customer.");
      return;
    }

    if (!selectedCustomer) {
      setMessage(
        "The selected customer could not be found.",
      );
      return;
    }

    if (selectedCustomer.status !== "ACTIVE") {
      setMessage(
        "This customer's account is not active.",
      );
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* WALLET                                                                   */
    /* ----------------------------------------------------------------------- */

    if (
      !walletBalance ||
      !/^\d{1,16}(\.\d{1,2})?$/.test(
        walletBalance,
      )
    ) {
      setMessage(
        "Enter a valid wallet balance with no more than two decimal places.",
      );
      return;
    }

    const walletValue = Number(walletBalance);

    if (
      !Number.isFinite(walletValue) ||
      walletValue < 0
    ) {
      setMessage(
        "Wallet balance cannot be negative.",
      );
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* INVESTMENT                                                               */
    /* ----------------------------------------------------------------------- */

    if (
      !activeInvestmentAmount ||
      !/^\d{1,16}(\.\d{1,2})?$/.test(
        activeInvestmentAmount,
      )
    ) {
      setMessage(
        "Enter a valid active investment amount.",
      );
      return;
    }

    const investmentValue = Number(
      activeInvestmentAmount,
    );

    if (
      !Number.isFinite(investmentValue) ||
      investmentValue < 0
    ) {
      setMessage(
        "Active investment amount cannot be negative.",
      );
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* TRADING BOT                                                              */
    /* ----------------------------------------------------------------------- */

    if (
      !tradingBotAmount ||
      !/^\d{1,16}(\.\d{1,2})?$/.test(
        tradingBotAmount,
      )
    ) {
      setMessage(
        "Enter a valid trading bot amount.",
      );
      return;
    }

    const botValue = Number(
      tradingBotAmount,
    );

    if (
      !Number.isFinite(botValue) ||
      botValue < 0
    ) {
      setMessage(
        "Trading bot amount cannot be negative.",
      );
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* REASON                                                                   */
    /* ----------------------------------------------------------------------- */

    if (!reason.trim()) {
      setMessage(
        "Enter a reason or reference for this account update.",
      );
      return;
    }

    if (reason.trim().length > 200) {
      setMessage(
        "The reason must be 200 characters or fewer.",
      );
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* CONFIRMATION                                                             */
    /* ----------------------------------------------------------------------- */

    const confirmed = window.confirm(
      `Update account for ${selectedCustomer.name}?\n\n` +
        `Wallet Balance: ${formatMoney(
          walletBalance,
          selectedCustomer.currency,
        )}\n` +
        `Active Investment: ${formatNumber(
          activeInvestmentAmount,
        )}\n` +
        `Trading Bot Money: ${formatNumber(
          tradingBotAmount,
        )}\n\n` +
        `Reason: ${reason.trim()}`,
    );

    if (!confirmed) {
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* API                                                                      */
    /* ----------------------------------------------------------------------- */

    startTransition(async () => {
      try {
        const response = await fetch(
          "/api/admin/users/account",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userId,
              balance: walletBalance,
              activeInvestmentAmount,
              tradingBotAmount,
              reason: reason.trim(),
            }),
          },
        );

        const result =
          await response.json();

        if (!response.ok) {
          setSuccess(false);

          setMessage(
            result.error ??
              "Unable to update the customer account.",
          );

          return;
        }

        setSuccess(true);

        setMessage(
          result.message ??
            "Customer account updated successfully.",
        );

        window.location.reload();
      } catch (error) {
        console.error(
          "ADMIN ACCOUNT UPDATE ERROR:",
          error,
        );

        setSuccess(false);

        setMessage(
          "An unexpected error occurred. Please try again.",
        );
      }
    });
  }

  /* ========================================================================= */
  /* DELETE CUSTOMER                                                           */
  /* ========================================================================= */

  function handleDeleteCustomer(
    customer: Customer,
  ) {
    setMessage("");
    setSuccess(false);

    /* ----------------------------------------------------------------------- */
    /* FIRST CONFIRMATION                                                       */
    /* ----------------------------------------------------------------------- */

    const firstConfirmation =
      window.confirm(
        `WARNING: Permanently delete ${customer.name}?\n\n` +
          `Email: ${customer.email}\n\n` +
          `This will permanently remove the customer's account and associated account data.\n\n` +
          `This action cannot be undone.`,
      );

    if (!firstConfirmation) {
      return;
    }

    /* ----------------------------------------------------------------------- */
    /* SECOND CONFIRMATION                                                      */
    /* ----------------------------------------------------------------------- */

    const confirmation =
      window.prompt(
        `Type DELETE to permanently remove ${customer.name}'s account.`,
      );

    if (confirmation !== "DELETE") {
      setSuccess(false);

      setMessage(
        'Customer deletion cancelled. You must type "DELETE" exactly.',
      );

      return;
    }

    /* ----------------------------------------------------------------------- */
    /* DELETE REQUEST                                                            */
    /* ----------------------------------------------------------------------- */

    startTransition(async () => {
      try {
        const response = await fetch(
          "/api/admin/users/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userId: customer.id,
              confirmation: "DELETE",
            }),
          },
        );

        const result =
          await response.json();

        if (!response.ok) {
          setSuccess(false);

          setMessage(
            result.error ??
              "Unable to delete the customer account.",
          );

          return;
        }

        setSuccess(true);

        setMessage(
          result.message ??
            "Customer account deleted successfully.",
        );

        /* ------------------------------------------------------------------- */
        /* CLEAR SELECTED CUSTOMER                                             */
        /* ------------------------------------------------------------------- */

        if (userId === customer.id) {
          setUserId("");
          setWalletBalance("");
          setActiveInvestmentAmount("");
          setTradingBotAmount("");
          setReason("");
        }

        /* ------------------------------------------------------------------- */
        /* REFRESH SERVER DATA                                                  */
        /* ------------------------------------------------------------------- */

        window.location.reload();
      } catch (error) {
        console.error(
          "DELETE CUSTOMER ERROR:",
          error,
        );

        setSuccess(false);

        setMessage(
          "An unexpected error occurred while deleting the customer.",
        );
      }
    });
  }

  /* ========================================================================= */
  /* STATISTICS                                                                */
  /* ========================================================================= */

  const activeCount = customers.filter(
    (customer) =>
      customer.status === "ACTIVE",
  ).length;

  const blockedCount = customers.filter(
    (customer) =>
      customer.status === "BLOCKED",
  ).length;

  /* ========================================================================= */
  /* UI                                                                        */
  /* ========================================================================= */

  return (
    <div className="space-y-6">
      {/* =================================================================== */}
      {/* STATISTICS                                                          */}
      {/* =================================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total customers */}
        <article className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-[#151d32] to-[#0d1424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Total customers
            </span>

            <Users className="h-5 w-5 text-violet-300" />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {customers.length}
          </p>
        </article>

        {/* Active */}
        <article className="rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-[#132a29] to-[#0d1424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Active accounts
            </span>

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {activeCount}
          </p>
        </article>

        {/* Blocked */}
        <article className="rounded-2xl border border-rose-400/15 bg-gradient-to-br from-[#28171d] to-[#0d1424] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Blocked accounts
            </span>

            <AlertCircle className="h-5 w-5 text-rose-400" />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">
            {blockedCount}
          </p>
        </article>
      </section>

      {/* =================================================================== */}
      {/* MAIN CONTENT                                                        */}
      {/* =================================================================== */}

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        {/* ================================================================= */}
        {/* EDIT CUSTOMER                                                     */}
        {/* ================================================================= */}

        <section className="h-fit min-w-0 rounded-2xl border border-white/10 bg-[#101827] p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Wallet className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">
                Edit customer account
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Update the wallet balance, active
                investment, and trading bot
                allocation.
              </p>
            </div>
          </div>

          {/* No customer selected */}
          {!selectedCustomer ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 p-8 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-600" />

              <p className="mt-3 text-sm font-medium text-slate-300">
                Select a customer
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose a customer from the
                list to edit their account
                values.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleAccountSubmit}
              className="mt-6 space-y-5"
            >
              {/* Selected customer */}
              <div className="rounded-xl border border-violet-400/20 bg-violet-500/[0.06] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-white">
                      {selectedCustomer.name}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-400">
                      {selectedCustomer.email}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                      selectedCustomer.status ===
                      "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>

              {/* Wallet */}
              <div>
                <label
                  htmlFor="wallet-balance"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <Wallet className="h-4 w-4 text-blue-400" />

                  Wallet Balance
                </label>

                <input
                  id="wallet-balance"
                  type="number"
                  min="0"
                  max="9999999999999999.99"
                  step="0.01"
                  inputMode="decimal"
                  value={walletBalance}
                  onChange={(event) =>
                    setWalletBalance(
                      event.target.value,
                    )
                  }
                  placeholder="0.00"
                  required
                  disabled={pending}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Current:{" "}
                  {formatMoney(
                    selectedCustomer.balance,
                    selectedCustomer.currency,
                  )}
                </p>
              </div>

              {/* Investment */}
              <div>
                <label
                  htmlFor="active-investment"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-400" />

                  Active Investment Plan
                </label>

                <input
                  id="active-investment"
                  type="number"
                  min="0"
                  max="9999999999999999.99"
                  step="0.01"
                  inputMode="decimal"
                  value={
                    activeInvestmentAmount
                  }
                  onChange={(event) =>
                    setActiveInvestmentAmount(
                      event.target.value,
                    )
                  }
                  placeholder="0.00"
                  required
                  disabled={pending}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Current:{" "}
                  {formatNumber(
                    selectedCustomer.activeInvestmentAmount,
                  )}
                </p>
              </div>

              {/* Trading Bot */}
              <div>
                <label
                  htmlFor="trading-bot"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <Bot className="h-4 w-4 text-violet-400" />

                  Trading Bot Money
                </label>

                <input
                  id="trading-bot"
                  type="number"
                  min="0"
                  max="9999999999999999.99"
                  step="0.01"
                  inputMode="decimal"
                  value={tradingBotAmount}
                  onChange={(event) =>
                    setTradingBotAmount(
                      event.target.value,
                    )
                  }
                  placeholder="0.00"
                  required
                  disabled={pending}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Current:{" "}
                  {formatNumber(
                    selectedCustomer.tradingBotAmount,
                  )}
                </p>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="account-reason"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Reason or reference
                </label>

                <textarea
                  id="account-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(
                      event.target.value,
                    )
                  }
                  maxLength={200}
                  rows={3}
                  placeholder="Enter a verified reason or reference for this account update"
                  required
                  disabled={pending}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {reason.length}/200
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
                    success
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-400/20 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {success ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}

                  <span>{message}</span>
                </div>
              )}

              {/* Update button */}
              <button
                type="submit"
                disabled={
                  pending ||
                  !userId ||
                  !selectedCustomer ||
                  selectedCustomer.status !==
                    "ACTIVE"
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />

                    Updating account...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />

                    Update Customer Account
                  </>
                )}
              </button>

              {/* Security notice */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

                <p className="text-xs leading-5 text-slate-400">
                  This action directly updates
                  the customer's recorded
                  account values. Only make
                  changes that are authorized
                  and properly documented.
                </p>
              </div>
            </form>
          )}
        </section>

        {/* ================================================================= */}
        {/* CUSTOMER LIST                                                      */}
        {/* ================================================================= */}

        <section className="min-w-0 rounded-2xl border border-white/10 bg-[#101827] p-5 sm:p-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Customer accounts
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Select a customer to edit their
                wallet, investment, and trading
                bot values.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              {filteredCustomers.length}{" "}
              {filteredCustomers.length === 1
                ? "customer"
                : "customers"}
            </span>
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search name or email..."
              aria-label="Search customers"
              className="w-full rounded-xl border border-white/10 bg-[#0b1120] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
            />
          </div>

          {/* Customer cards */}
          <div className="mt-5 space-y-3">
            {filteredCustomers.map(
              (customer) => {
                const isSelected =
                  userId === customer.id;

                return (
                  <div
                    key={customer.id}
                    className={`rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-violet-400/40 bg-violet-500/[0.08]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Customer details */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-white">
                          {customer.name}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-400">
                          {customer.email}
                        </p>
                      </div>

                      <span
                        className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs ${
                          customer.status ===
                          "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </div>

                    {/* Account values */}
                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
                      {/* Wallet */}
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Wallet
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-blue-400">
                          {formatMoney(
                            customer.balance,
                            customer.currency,
                          )}
                        </p>
                      </div>

                      {/* Investment */}
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Investment
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-emerald-300">
                          {formatNumber(
                            customer.activeInvestmentAmount,
                          )}
                        </p>
                      </div>

                      {/* Trading bot */}
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Trading Bot
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-violet-300">
                          {formatNumber(
                            customer.tradingBotAmount,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ===================================================== */}
                    {/* SELECT CUSTOMER                                        */}
                    {/* ===================================================== */}

                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          selectCustomer(
                            customer,
                          )
                        }
                        disabled={
                          pending ||
                          customer.status !==
                            "ACTIVE"
                        }
                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-violet-600 text-white hover:bg-violet-500"
                            : "border border-violet-400/20 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />

                            Customer Selected
                          </>
                        ) : (
                          <>
                            <Users className="h-4 w-4" />

                            Select Customer
                          </>
                        )}
                      </button>

                      {/* =================================================== */}
                      {/* DELETE CUSTOMER                                      */}
                      {/* =================================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCustomer(
                            customer,
                          )
                        }
                        disabled={pending}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {pending ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />

                            Processing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />

                            Delete Customer Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              },
            )}

            {/* No customers */}
            {filteredCustomers.length ===
              0 && (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm font-medium text-slate-300">
                  No customers found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try a different name or email.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}