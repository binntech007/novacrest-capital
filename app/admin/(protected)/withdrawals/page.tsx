"use client";

import {
  ArrowDownToLine,
  Check,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

type Withdrawal = {
  id: string;
  userId: string;
  amount: string | number;
  currency: string;
  method: "BANK" | "CRYPTO";
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";

  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  swiftCode: string | null;
  iban: string | null;

  cryptoNetwork: string | null;
  cryptoAddress: string | null;

  note: string | null;
  rejectionReason: string | null;

  createdAt: string;
  updatedAt: string;
  processedAt: string | null;

  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
};

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | Withdrawal["status"]>("ALL");

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(
    null
  );

  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadWithdrawals(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/admin/withdrawals", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load withdrawals."
        );
      }

      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const filteredWithdrawals = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return withdrawals.filter((withdrawal) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        withdrawal.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const customerName = [
        withdrawal.user.firstName,
        withdrawal.user.lastName,
        withdrawal.user.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const email =
        withdrawal.user.email?.toLowerCase() || "";

      const id = withdrawal.id.toLowerCase();

      const bankAccount =
        withdrawal.accountNumber?.toLowerCase() || "";

      const cryptoAddress =
        withdrawal.cryptoAddress?.toLowerCase() || "";

      return (
        customerName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        id.includes(searchTerm) ||
        bankAccount.includes(searchTerm) ||
        cryptoAddress.includes(searchTerm)
      );
    });
  }, [withdrawals, search, statusFilter]);

  const pendingCount = withdrawals.filter(
    (item) => item.status === "PENDING"
  ).length;

  const completedCount = withdrawals.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const rejectedCount = withdrawals.filter(
    (item) => item.status === "REJECTED"
  ).length;

  async function processWithdrawal(
    withdrawal: Withdrawal,
    action: "APPROVE" | "REJECT"
  ) {
    setError("");
    setSuccess("");

    if (action === "REJECT" && !rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    const confirmed = window.confirm(
      action === "APPROVE"
        ? `Approve this ${withdrawal.currency} ${formatAmount(
            withdrawal.amount
          )} withdrawal?`
        : `Reject this withdrawal and return the funds to the customer's wallet?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(withdrawal.id);

      const response = await fetch(
        `/api/admin/withdrawals/${withdrawal.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            rejectionReason:
              action === "REJECT"
                ? rejectionReason.trim()
                : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to process withdrawal."
        );
      }

      setSuccess(data.message);

      setSelectedWithdrawal(null);
      setRejectionReason("");

      await loadWithdrawals(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process withdrawal."
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#080d19] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <ArrowDownToLine className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Withdrawals
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Review and manage customer withdrawal requests.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadWithdrawals(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#101621] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Requests"
            value={withdrawals.length}
            icon={<ArrowDownToLine className="h-5 w-5" />}
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            label="Completed"
            value={completedCount}
            icon={<Check className="h-5 w-5" />}
          />

          <StatCard
            label="Rejected"
            value={rejectedCount}
            icon={<X className="h-5 w-5" />}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#101621] p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customer, email, account or withdrawal ID..."
                className="w-full rounded-xl border border-white/10 bg-[#080d19] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/40"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "ALL"
                    | Withdrawal["status"]
                )
              }
              className="rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101621]">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <ArrowDownToLine className="h-10 w-10 text-slate-700" />

              <p className="mt-4 font-medium text-slate-300">
                No withdrawals found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                There are no withdrawal requests matching your filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-4">
                        Customer
                      </th>

                      <th className="px-5 py-4">
                        Amount
                      </th>

                      <th className="px-5 py-4">
                        Method
                      </th>

                      <th className="px-5 py-4">
                        Destination
                      </th>

                      <th className="px-5 py-4">
                        Status
                      </th>

                      <th className="px-5 py-4">
                        Date
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredWithdrawals.map(
                      (withdrawal) => (
                        <tr
                          key={withdrawal.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <CustomerInfo
                              withdrawal={withdrawal}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-white">
                              {withdrawal.currency}{" "}
                              {formatAmount(
                                withdrawal.amount
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <MethodBadge
                              method={withdrawal.method}
                            />
                          </td>

                          <td className="max-w-[220px] px-5 py-4">
                            <Destination
                              withdrawal={withdrawal}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={withdrawal.status}
                            />
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                            {formatDate(
                              withdrawal.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedWithdrawal(
                                  withdrawal
                                )
                              }
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-white/5 lg:hidden">
                {filteredWithdrawals.map(
                  (withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <CustomerInfo
                          withdrawal={withdrawal}
                        />

                        <StatusBadge
                          status={withdrawal.status}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold">
                            {withdrawal.currency}{" "}
                            {formatAmount(
                              withdrawal.amount
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Method
                          </p>

                          <div className="mt-1">
                            <MethodBadge
                              method={withdrawal.method}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-slate-500">
                          Destination
                        </p>

                        <div className="mt-1">
                          <Destination
                            withdrawal={withdrawal}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedWithdrawal(
                            withdrawal
                          )
                        }
                        className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        Review Withdrawal
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedWithdrawal && (
        <ReviewModal
          withdrawal={selectedWithdrawal}
          processing={
            processingId === selectedWithdrawal.id
          }
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onClose={() => {
            if (!processingId) {
              setSelectedWithdrawal(null);
              setRejectionReason("");
            }
          }}
          onApprove={() =>
            processWithdrawal(
              selectedWithdrawal,
              "APPROVE"
            )
          }
          onReject={() =>
            processWithdrawal(
              selectedWithdrawal,
              "REJECT"
            )
          }
        />
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101621] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function CustomerInfo({
  withdrawal,
}: {
  withdrawal: Withdrawal;
}) {
  const name =
    [
      withdrawal.user.firstName,
      withdrawal.user.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    withdrawal.user.name ||
    "Customer";

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
        <User className="h-4 w-4 text-slate-400" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {name}
        </p>

        <p className="truncate text-xs text-slate-500">
          {withdrawal.user.email || "No email"}
        </p>
      </div>
    </div>
  );
}

function MethodBadge({
  method,
}: {
  method: Withdrawal["method"];
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
        method === "BANK"
          ? "bg-blue-500/10 text-blue-400"
          : "bg-violet-500/10 text-violet-400"
      }`}
    >
      {method === "BANK"
        ? "Bank Account"
        : "Crypto Wallet"}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: Withdrawal["status"];
}) {
  const styles: Record<
    Withdrawal["status"],
    string
  > = {
    PENDING:
      "bg-amber-500/10 text-amber-400",
    PROCESSING:
      "bg-blue-500/10 text-blue-400",
    COMPLETED:
      "bg-emerald-500/10 text-emerald-400",
    REJECTED:
      "bg-red-500/10 text-red-400",
    CANCELLED:
      "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Destination({
  withdrawal,
}: {
  withdrawal: Withdrawal;
}) {
  if (withdrawal.method === "BANK") {
    return (
      <div className="text-xs">
        <p className="truncate text-slate-300">
          {withdrawal.bankName || "Bank"}
        </p>

        <p className="mt-1 text-slate-500">
          {withdrawal.accountNumber
            ? maskAccountNumber(
                withdrawal.accountNumber
              )
            : "No account number"}
        </p>
      </div>
    );
  }

  return (
    <div className="text-xs">
      <p className="text-violet-400">
        {withdrawal.cryptoNetwork}
      </p>

      <p className="mt-1 break-all text-slate-500">
        {withdrawal.cryptoAddress
          ? maskCryptoAddress(
              withdrawal.cryptoAddress
            )
          : "No wallet address"}
      </p>
    </div>
  );
}

function ReviewModal({
  withdrawal,
  processing,
  rejectionReason,
  setRejectionReason,
  onClose,
  onApprove,
  onReject,
}: {
  withdrawal: Withdrawal;
  processing: boolean;
  rejectionReason: string;
  setRejectionReason: (value: string) => void;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const customerName =
    [
      withdrawal.user.firstName,
      withdrawal.user.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    withdrawal.user.name ||
    "Customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101621] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#101621] p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Review Withdrawal
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {withdrawal.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* Customer */}
          <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
            <p className="text-xs text-slate-500">
              Customer
            </p>

            <p className="mt-1 font-medium">
              {customerName}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {withdrawal.user.email}
            </p>
          </div>

          {/* Amount */}
          <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
            <p className="text-xs text-slate-500">
              Withdrawal Amount
            </p>

            <p className="mt-1 text-2xl font-bold">
              {withdrawal.currency}{" "}
              {formatAmount(withdrawal.amount)}
            </p>

            <div className="mt-3">
              <StatusBadge
                status={withdrawal.status}
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Destination Details
            </h3>

            <div className="space-y-2">
              {withdrawal.method === "BANK" ? (
                <>
                  <Detail
                    label="Bank Name"
                    value={withdrawal.bankName}
                  />

                  <Detail
                    label="Account Name"
                    value={withdrawal.accountName}
                  />

                  <Detail
                    label="Account Number"
                    value={withdrawal.accountNumber}
                  />

                  <Detail
                    label="Routing Number"
                    value={withdrawal.routingNumber}
                  />

                  <Detail
                    label="SWIFT / BIC"
                    value={withdrawal.swiftCode}
                  />

                  <Detail
                    label="IBAN"
                    value={withdrawal.iban}
                  />
                </>
              ) : (
                <>
                  <Detail
                    label="Network"
                    value={withdrawal.cryptoNetwork}
                  />

                  <Detail
                    label="Wallet Address"
                    value={withdrawal.cryptoAddress}
                    breakAll
                  />
                </>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
            <p className="text-xs text-slate-500">
              Requested
            </p>

            <p className="mt-1 text-sm">
              {formatDate(
                withdrawal.createdAt
              )}
            </p>
          </div>

          {/* Rejection */}
          {withdrawal.status === "PENDING" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rejection Reason
                <span className="ml-1 text-xs font-normal text-slate-500">
                  (required only when rejecting)
                </span>
              </label>

              <textarea
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
                maxLength={500}
                rows={4}
                placeholder="Enter the reason if this withdrawal should be rejected..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none focus:border-red-500/40"
              />
            </div>
          )}

          {/* Actions */}
          {withdrawal.status === "PENDING" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onReject}
                disabled={processing}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Reject Withdrawal
              </button>

              <button
                type="button"
                onClick={onApprove}
                disabled={processing}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve Withdrawal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string | null;
  breakAll?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#080d19] p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm text-white ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatAmount(
  amount: string | number
) {
  return Number(amount).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function maskAccountNumber(
  accountNumber: string
) {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }

  return `•••• ${accountNumber.slice(-4)}`;
}

function maskCryptoAddress(
  address: string
) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}