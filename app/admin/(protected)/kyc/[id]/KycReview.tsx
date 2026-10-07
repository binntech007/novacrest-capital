"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Loader2,
  MapPin,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type KycReviewProps = {
  application: {
    id: string;
    status: KycStatus;
    currentStep: number;

    firstName: string | null;
    lastName: string | null;
    dateOfBirth: Date | string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    postalCode: string | null;
    phone: string | null;

    documentType: string | null;
    documentNumber: string | null;

    submittedAt: Date | string | null;
    reviewedAt: Date | string | null;

    rejectionReason: string | null;

    documentFrontUrl: string | null;
    documentBackUrl: string | null;

    user: {
      firstName: string;
      lastName: string;
      email: string;
      status: string;
      createdAt: Date | string;
    };

    reviewedBy: {
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  };
};

export default function KycReview({
  application,
}: KycReviewProps) {
  const [status, setStatus] = useState(
    application.status,
  );

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showReject, setShowReject] =
    useState(false);

  async function reviewKyc(
    action: "APPROVE" | "REJECT",
  ) {
    setError("");

    if (
      action === "REJECT" &&
      !rejectionReason.trim()
    ) {
      setError(
        "Please provide a reason for rejecting this application.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/kyc/${application.id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            rejectionReason:
              rejectionReason.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to review this application.",
        );
      }

      setStatus(data.status);

      setShowReject(false);

      setRejectionReason("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to review this application.",
      );
    } finally {
      setLoading(false);
    }
  }

  const isPending = status === "PENDING";

  const statusStyle =
    status === "APPROVED"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : status === "REJECTED"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
        : status === "PENDING"
          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
          : "border-white/10 bg-white/5 text-slate-400";

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-6">
          <Link
            href="/admin/kyc"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to KYC applications
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                KYC Review
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {application.user.firstName}{" "}
                {application.user.lastName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {application.user.email}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-semibold ${statusStyle}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />

            <p className="text-sm text-rose-300">
              {error}
            </p>
          </div>
        )}

        {/* APPROVAL NOTICE */}

        {status === "APPROVED" && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-300">
                KYC application approved
              </p>

              <p className="mt-1 text-xs text-slate-500">
                This application has been successfully
                verified.
              </p>
            </div>
          </div>
        )}

        {/* REJECTION NOTICE */}

        {status === "REJECTED" && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <XCircle className="mt-0.5 h-6 w-6 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-rose-300">
                KYC application rejected
              </p>

              {application.rejectionReason && (
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {application.rejectionReason}
                </p>
              )}
            </div>
          </div>
        )}

        {/* INFORMATION GRID */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* PERSONAL INFORMATION */}

          <section className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <UserRound className="h-5 w-5 text-violet-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Personal Information
                </h2>

                <p className="text-xs text-slate-500">
                  Customer identity details
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <InfoItem
                label="First Name"
                value={
                  application.firstName
                }
              />

              <InfoItem
                label="Last Name"
                value={
                  application.lastName
                }
              />

              <InfoItem
                label="Date of Birth"
                value={
                  application.dateOfBirth
                    ? new Date(
                        application.dateOfBirth,
                      ).toLocaleDateString()
                    : null
                }
              />

              <InfoItem
                label="Phone"
                value={
                  application.phone
                }
              />

              <InfoItem
                label="Country"
                value={
                  application.country
                }
              />

              <InfoItem
                label="State / Province"
                value={
                  application.state
                }
              />

              <InfoItem
                label="City"
                value={
                  application.city
                }
              />

              <InfoItem
                label="Postal Code"
                value={
                  application.postalCode
                }

              />

              <div className="sm:col-span-2">
                <InfoItem
                  label="Residential Address"
                  value={
                    application.address
                  }
                />
              </div>
            </div>
          </section>

          {/* ACCOUNT INFORMATION */}

          <section className="rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Account Information
                </h2>

                <p className="text-xs text-slate-500">
                  Verification and account details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <InfoItem
                label="Email"
                value={
                  application.user.email
                }
              />

              <InfoItem
                label="Account Status"
                value={
                  application.user.status
                }
              />

              <InfoItem
                label="Customer Since"
                value={new Date(
                  application.user.createdAt,
                ).toLocaleDateString()}
              />

              <InfoItem
                label="Submitted"
                value={
                  application.submittedAt
                    ? new Date(
                        application.submittedAt,
                      ).toLocaleString()
                    : "Not submitted"
                }
              />

              {application.reviewedAt && (
                <InfoItem
                  label="Reviewed"
                  value={new Date(
                    application.reviewedAt,
                  ).toLocaleString()}
                />
              )}

              {application.reviewedBy && (
                <InfoItem
                  label="Reviewed By"
                  value={`${application.reviewedBy.firstName} ${application.reviewedBy.lastName}`}
                />
              )}
            </div>
          </section>

          {/* DOCUMENT INFORMATION */}

          <section className="rounded-2xl border border-white/10 bg-[#0c1424] p-5 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <FileCheck2 className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Identity Document
                </h2>

                <p className="text-xs text-slate-500">
                  Review the submitted identity document
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Document Type"
                value={
                  application.documentType
                    ? application.documentType.replaceAll(
                        "_",
                        " ",
                      )
                    : null
                }
              />

              <InfoItem
                label="Document Number"
                value={
                  application.documentNumber
                }
              />
            </div>

            {/* DOCUMENT IMAGES */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* FRONT */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080d19]">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">
                    Front of Document
                  </p>
                </div>

                <div className="flex min-h-[280px] items-center justify-center p-4">
                  {application.documentFrontUrl ? (
                    <img
                      src={
                        application.documentFrontUrl
                      }
                      alt="Front of identity document"
                      className="max-h-[420px] w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileCheck2 className="mx-auto h-10 w-10 text-slate-700" />

                      <p className="mt-3 text-sm text-slate-500">
                        Front document unavailable
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* BACK */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080d19]">
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">
                    Back of Document
                  </p>
                </div>

                <div className="flex min-h-[280px] items-center justify-center p-4">
                  {application.documentBackUrl ? (
                    <img
                      src={
                        application.documentBackUrl
                      }
                      alt="Back of identity document"
                      className="max-h-[420px] w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileCheck2 className="mx-auto h-10 w-10 text-slate-700" />

                      <p className="mt-3 text-sm text-slate-500">
                        Back document unavailable
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* REVIEW ACTIONS */}

        {isPending && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <div className="mb-5">
              <h2 className="font-semibold">
                Review Application
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Carefully review the submitted information
                before making a decision.
              </p>
            </div>

            {!showReject ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* APPROVE */}

                <button
                  type="button"
                  onClick={() =>
                    reviewKyc("APPROVE")
                  }
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#03100b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  Approve KYC
                </button>

                {/* REJECT */}

                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowReject(true);
                  }}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />

                  Reject KYC
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-rose-400" />

                  <div>
                    <p className="text-sm font-semibold text-rose-300">
                      Reject application
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Provide a clear reason so the customer
                      knows what needs to be corrected.
                    </p>
                  </div>
                </div>

                <textarea
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value,
                    )
                  }
                  maxLength={1000}
                  rows={5}
                  placeholder="Enter the reason for rejection..."
                  className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/40 focus:ring-1 focus:ring-rose-400/10"
                />

                <div className="mt-2 text-right text-[11px] text-slate-600">
                  {rejectionReason.length}/1000
                </div>

                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReject(false);
                      setRejectionReason("");
                      setError("");
                    }}
                    disabled={loading}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      reviewKyc("REJECT")
                    }
                    disabled={
                      loading ||
                      !rejectionReason.trim()
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* REVIEWED MESSAGE */}

        {!isPending && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0c1424] p-5">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

            <div>
              <p className="text-sm font-medium text-slate-300">
                This application has already been reviewed.
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The current status is{" "}
                <span className="font-semibold text-slate-300">
                  {status}
                </span>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-300">
        {value || "Not provided"}
      </p>
    </div>
  );
}