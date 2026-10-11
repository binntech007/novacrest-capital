
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DepositRequestStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  approveDeposit,
  rejectDeposit,
} from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatMoney(amount: { toString(): string }, currency: string) {
  const value = Number(amount.toString());

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminDepositsPage({
  searchParams,
}: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, status: true },
  });

  if (
    !admin ||
    admin.role !== "ADMIN" ||
    admin.status !== "ACTIVE"
  ) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const requestedStatus = params.status?.toUpperCase();

  const validStatuses = Object.values(DepositRequestStatus);
  const selectedStatus =
    requestedStatus && validStatuses.includes(
      requestedStatus as DepositRequestStatus
    )
      ? (requestedStatus as DepositRequestStatus)
      : undefined;

  const [deposits, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      prisma.depositRequest.findMany({
        where: selectedStatus ? { status: selectedStatus } : undefined,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.depositRequest.count({
        where: { status: "PENDING" },
      }),
      prisma.depositRequest.count({
        where: { status: "APPROVED" },
      }),
      prisma.depositRequest.count({
        where: { status: "REJECTED" },
      }),
    ]);

  const filters = [
    { label: "All deposits", value: "ALL", count: pendingCount + approvedCount + rejectedCount },
    { label: "Pending", value: "PENDING", count: pendingCount },
    { label: "Approved", value: "APPROVED", count: approvedCount },
    { label: "Rejected", value: "REJECTED", count: rejectedCount },
  ];

  return (
    <main className="min-h-screen bg-[#080d19] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              NOVACREST CAPITAL
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Deposit Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Review customer payments and manage deposit requests.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-400">Awaiting review</p>
            <p className="mt-1 text-2xl font-bold text-amber-400">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending deposits"
            count={pendingCount}
            color="text-amber-400"
          />
          <StatCard
            label="Approved deposits"
            count={approvedCount}
            color="text-emerald-400"
          />
          <StatCard
            label="Rejected deposits"
            count={rejectedCount}
            color="text-red-400"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 p-4">
            {filters.map((filter) => {
              const active =
                filter.value === (selectedStatus ?? "ALL");

              return (
                <a
                  key={filter.value}
                  href={
                    filter.value === "ALL"
                      ? "/admin/deposits"
                      : `/admin/deposits?status=${filter.value}`
                  }
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    active
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {filter.label} ({filter.count})
                </a>
              );
            })}
          </div>

          {deposits.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">
                No deposit requests found
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Customer deposit requests will appear here when submitted.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {deposits.map((deposit) => (
                <article key={deposit.id} className="space-y-5 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold">
                          {deposit.user.firstName} {deposit.user.lastName}
                        </h2>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[deposit.status] ?? ""
                          }`}
                        >
                          {deposit.status}
                        </span>
                      </div>

                      <p className="mt-1 break-all text-sm text-slate-400">
                        {deposit.user.email}
                      </p>
                      <p className="mt-2 break-all text-xs text-slate-500">
                        Reference: {deposit.reference}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Submitted: {formatDate(deposit.createdAt)}
                      </p>
                    </div>

                    <div className="lg:text-right">
                      <p className="text-2xl font-bold text-white">
                        {formatMoney(deposit.amount, deposit.currency)}
                      </p>
                      <p className="mt-1 text-sm text-cyan-300">
                        {deposit.cryptoName} · {deposit.network}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-xl border border-slate-800 bg-[#080d19] p-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Deposit address
                      </p>
                      <p className="mt-1 break-all text-sm text-slate-300">
                        {deposit.depositAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        Review date
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {deposit.reviewedAt
                          ? formatDate(deposit.reviewedAt)
                          : "Not reviewed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={deposit.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
                    >
                      View payment receipt ↗
                    </a>
                  </div>

                  {deposit.adminNote && (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                      <p className="text-xs text-slate-500">Admin note</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                        {deposit.adminNote}
                      </p>
                    </div>
                  )}

                  {deposit.status === "PENDING" && (
                    <div className="grid gap-4 rounded-xl border border-slate-800 p-4 lg:grid-cols-2">
                      <form action={approveDeposit} className="space-y-3">
                        <input
                          type="hidden"
                          name="depositId"
                          value={deposit.id}
                        />
                        <label
                          htmlFor={`approve-note-${deposit.id}`}
                          className="block text-sm font-medium text-slate-300"
                        >
                          Approval note (optional)
                        </label>
                        <textarea
                          id={`approve-note-${deposit.id}`}
                          name="adminNote"
                          maxLength={500}
                          rows={2}
                          placeholder="Add an internal review note..."
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
                        >
                          Approve and credit wallet
                        </button>
                      </form>

                      <form action={rejectDeposit} className="space-y-3">
                        <input
                          type="hidden"
                          name="depositId"
                          value={deposit.id}
                        />
                        <label
                          htmlFor={`reject-note-${deposit.id}`}
                          className="block text-sm font-medium text-slate-300"
                        >
                          Reason for rejection
                        </label>
                        <textarea
                          id={`reject-note-${deposit.id}`}
                          name="adminNote"
                          maxLength={500}
                          rows={2}
                          required
                          placeholder="Explain why this deposit is rejected..."
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-red-500"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          Reject deposit
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{count}</p>
    </div>
  );
}
