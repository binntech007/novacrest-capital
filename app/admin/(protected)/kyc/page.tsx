import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminKycPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const applications =
    await prisma.kycApplication.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            createdAt: true,
          },
        },
        reviewedBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

  const pendingCount = applications.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "APPROVED",
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "REJECTED",
  ).length;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";

      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
              <FileCheck2 className="h-5 w-5 text-violet-400" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                KYC Verification
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Review customer identity verification
            applications and manage their verification
            status.
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Total Applications
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {applications.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <FileCheck2 className="h-5 w-5 text-violet-400" />
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-400">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock3 className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* APPROVED */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Approved
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {approvedCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* REJECTED */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Rejected
                </p>

                <p className="mt-2 text-2xl font-bold text-rose-400">
                  {rejectedCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <XCircle className="h-5 w-5 text-rose-400" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424]">

          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold">
              KYC Applications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Select an application to review the submitted
              information.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <FileCheck2 className="h-10 w-10 text-slate-700" />

              <p className="mt-4 text-sm font-medium text-slate-400">
                No KYC applications yet
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Customer verification applications will
                appear here.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Document
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Submitted
                      </th>

                      <th className="px-5 py-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((application) => (
                      <tr
                        key={application.id}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-white">
                            {application.user.firstName}{" "}
                            {application.user.lastName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {application.user.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-300">
                            {application.documentType
                              ? application.documentType
                                  .replaceAll(
                                    "_",
                                    " ",
                                  )
                              : "Not provided"}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {application.documentNumber ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              application.status,
                            )}`}
                          >
                            {application.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-400">
                            {application.submittedAt
                              ? new Date(
                                  application.submittedAt,
                                ).toLocaleDateString()
                              : "Not submitted"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/kyc/${application.id}`}
                            className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-white/5 md:hidden">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {application.user.firstName}{" "}
                          {application.user.lastName}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {application.user.email}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                          application.status,
                        )}`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Document
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          {application.documentType
                            ? application.documentType
                                .replaceAll(
                                  "_",
                                  " ",
                                )
                            : "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Submitted
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          {application.submittedAt
                            ? new Date(
                                application.submittedAt,
                              ).toLocaleDateString()
                            : "Not submitted"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/kyc/${application.id}`}
                      className="mt-4 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      Review Application
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}