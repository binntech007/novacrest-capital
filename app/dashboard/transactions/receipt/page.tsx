
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";
import PrintReceiptButton from "./PrintReceiptButton";

type ReceiptPageProps = {
  searchParams: Promise<{
    reference?: string;
  }>;
};

type ReceiptData = {
  reference: string;
  description: string;
  type: string;
  amount: number;
  currency: string;
  date: Date;
  status: string;
};

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusLabel(status: string) {
  if (status === "RECORDED") return "Recorded";

  return formatType(status);
}

function StatusIcon({ status }: { status: string }) {
  if (status === "COMPLETED" || status === "RECORDED") {
    return <CheckCircle2 className="h-4 w-4" />;
  }

  if (status === "REJECTED" || status === "CANCELLED") {
    return <XCircle className="h-4 w-4" />;
  }

  return <Clock3 className="h-4 w-4" />;
}

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
    case "RECORDED":
      return "text-emerald-400";

    case "PENDING":
      return "text-amber-400";

    case "PROCESSING":
      return "text-blue-400";

    case "REJECTED":
      return "text-red-400";

    case "CANCELLED":
      return "text-slate-400";

    default:
      return "text-slate-400";
  }
}

export default async function ReceiptPage({
  searchParams,
}: ReceiptPageProps) {
  const session = await auth();

  // Authentication
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "ACTIVE") {
    redirect("/login?error=account-unavailable");
  }

  if (session.user.role !== "CUSTOMER") {
    redirect("/admin");
  }

  const { reference } = await searchParams;

  if (
    !reference ||
    reference.length > 200 ||
    /[\r\n]/.test(reference)
  ) {
    notFound();
  }

  const userId = session.user.id;
  let receipt: ReceiptData | null = null;

  // Withdrawal references use the format WD-<withdrawal ID>.
  if (reference.startsWith("WD-")) {
    const withdrawalId = reference.slice(3);

    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        id: withdrawalId,
        userId,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        method: true,
        status: true,
        bankName: true,
        cryptoNetwork: true,
        createdAt: true,
      },
    });

    if (withdrawal) {
      let description = "Withdrawal";

      if (withdrawal.method === "BANK") {
        description = withdrawal.bankName
          ? `Bank withdrawal - ${withdrawal.bankName}`
          : "Bank withdrawal";
      } else {
        description = withdrawal.cryptoNetwork
          ? `Crypto withdrawal - ${withdrawal.cryptoNetwork}`
          : "Crypto withdrawal";
      }

      receipt = {
        reference: `WD-${withdrawal.id}`,
        description,
        type: "Withdrawal",
        amount: Number(withdrawal.amount),
        currency: withdrawal.currency || "USD",
        date: withdrawal.createdAt,
        status: String(withdrawal.status),
      };
    }
  } else {
    // Only search transactions in the signed-in customer's wallet.
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
      select: {
        currency: true,
        transactions: {
          where: {
            reference,
          },
          take: 1,
          select: {
            amount: true,
            type: true,
            description: true,
            reference: true,
            createdAt: true,
          },
        },
      },
    });

    const transaction = wallet?.transactions[0];

    if (transaction) {
      receipt = {
        reference: transaction.reference,
        description: transaction.description,
        type: formatType(String(transaction.type)),
        amount: Number(transaction.amount),
        currency: wallet?.currency || "USD",
        date: transaction.createdAt,
        status: "RECORDED",
      };
    }
  }

  // Do not expose a receipt if the transaction does not belong
  // to this customer's wallet or withdrawal records.
  if (!receipt) {
    notFound();
  }

  const statusLabel = getStatusLabel(receipt.status);
  const statusColor = getStatusColor(receipt.status);

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-8 text-white sm:px-6 print:min-h-0 print:bg-white print:p-0 print:text-slate-900">
      <div className="mx-auto max-w-2xl">
        {/* Navigation and print controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/dashboard/transactions"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </div>

        {/* Receipt */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422] shadow-xl print:rounded-none print:border-slate-300 print:bg-white print:shadow-none">
          {/* Receipt header */}
          <div className="border-b border-white/10 p-6 text-center print:border-slate-200 sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 print:bg-slate-100">
              <FileText className="h-7 w-7 text-blue-400 print:text-slate-800" />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-white print:text-slate-900">
              Novacrest Capital
            </h1>

            <p className="mt-2 text-sm text-slate-400 print:text-slate-600">
              Transaction Receipt
            </p>

            <div
              className={`mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold print:border-slate-200 print:bg-white ${statusColor}`}
            >
              <StatusIcon status={receipt.status} />
              {statusLabel}
            </div>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            {/* Amount */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center print:border-slate-200 print:bg-white">
              <p className="text-xs text-slate-400 print:text-slate-600">
                Transaction Amount
              </p>

              <p className="mt-2 break-words text-3xl font-bold text-white print:text-slate-900">
                {formatCurrency(receipt.amount, receipt.currency)}
              </p>

              <p className="mt-2 text-xs text-slate-500 print:text-slate-600">
                {receipt.type}
              </p>
            </div>

            {/* Transaction details */}
            <div className="divide-y divide-white/10 print:divide-slate-200">
              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-sm text-slate-400 print:text-slate-600">
                  Transaction Reference
                </span>

                <span className="max-w-[60%] break-all text-right text-sm font-semibold text-white print:text-slate-900">
                  {receipt.reference}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-sm text-slate-400 print:text-slate-600">
                  Transaction Type
                </span>

                <span className="text-right text-sm font-semibold text-white print:text-slate-900">
                  {receipt.type}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-sm text-slate-400 print:text-slate-600">
                  Description
                </span>

                <span className="max-w-[60%] break-words text-right text-sm text-white print:text-slate-900">
                  {receipt.description}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-sm text-slate-400 print:text-slate-600">
                  Date
                </span>

                <span className="text-right text-sm text-white print:text-slate-900">
                  {formatDate(receipt.date)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-4">
                <span className="text-sm text-slate-400 print:text-slate-600">
                  Status
                </span>

                <span
                  className={`text-right text-sm font-semibold ${statusColor} print:text-slate-900`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Receipt disclaimer */}
            <div className="rounded-xl border border-white/10 p-4 text-xs leading-5 text-slate-400 print:border-slate-200 print:text-slate-600">
              This receipt reflects the transaction information currently
              recorded in your account. A recorded transaction does not
              independently confirm that an external payment or bank
              transfer has settled.
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row print:hidden">
              <PrintReceiptButton />

              <Link
                href="/dashboard/transactions"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Back to Transactions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
