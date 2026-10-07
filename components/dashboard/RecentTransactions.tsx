import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/* ================================================================
   TYPES
================================================================ */

type WithdrawalStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

type RecentTransactionType =
  | "CREDIT"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "INVESTMENT"
  | "TRADING_BOT"
  | "INVESTMENT_PROFIT";

type RecentTransaction = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: Date;
  type: RecentTransactionType;
  status?: WithdrawalStatus;
};

/* ================================================================
   FORMAT CURRENCY
================================================================ */

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

/* ================================================================
   FORMAT DATE
================================================================ */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/* ================================================================
   CUSTOMER NAME
================================================================ */

function getCustomerName(customer: {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  /*
   * Use the normal name first.
   */
  if (customer.name?.trim()) {
    return customer.name.trim();
  }

  /*
   * Otherwise use first + last name.
   */
  const fullName = [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  /*
   * Finally fall back to email.
   */
  return customer.email;
}

/* ================================================================
   MONEY DIRECTION
================================================================ */

function isMoneyIn(
  transaction: RecentTransaction
) {
  /*
   * Rejected withdrawals return the funds
   * to the customer's wallet.
   */
  if (
    transaction.type === "WITHDRAWAL" &&
    transaction.status === "REJECTED"
  ) {
    return true;
  }

  /*
   * Wallet credits.
   */
  return (
    transaction.type === "CREDIT" ||
    transaction.type === "DEPOSIT" ||
    transaction.type === "INVESTMENT_PROFIT"
  );
}

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  status,
}: {
  status: WithdrawalStatus;
}) {
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
        <Clock3 className="h-2.5 w-2.5" />
        Pending
      </span>
    );
  }

  if (status === "PROCESSING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-semibold text-blue-400">
        <Clock3 className="h-2.5 w-2.5" />
        Processing
      </span>
    );
  }

  if (status === "COMPLETED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Completed
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-400">
        <XCircle className="h-2.5 w-2.5" />
        Rejected
      </span>
    );
  }

  if (status === "CANCELLED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[9px] font-semibold text-slate-400">
        <XCircle className="h-2.5 w-2.5" />
        Cancelled
      </span>
    );
  }

  return null;
}

/* ================================================================
   TRANSACTION ICON
================================================================ */

function TransactionIcon({
  transaction,
}: {
  transaction: RecentTransaction;
}) {
  /*
   * Trading bot
   */
  if (transaction.type === "TRADING_BOT") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
        <Bot className="h-[18px] w-[18px] text-red-400" />
      </div>
    );
  }

  /*
   * Investment
   */
  if (transaction.type === "INVESTMENT") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
        <TrendingUp className="h-[18px] w-[18px] text-purple-400" />
      </div>
    );
  }

  /*
   * Withdrawal
   */
  if (transaction.type === "WITHDRAWAL") {
    if (transaction.status === "REJECTED") {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
          <ArrowDownLeft className="h-[18px] w-[18px] text-emerald-400" />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
        <ArrowUpRight className="h-[18px] w-[18px] text-red-400" />
      </div>
    );
  }

  /*
   * Normal credit/debit transaction.
   */
  const moneyIn = isMoneyIn(transaction);

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
        moneyIn
          ? "bg-emerald-500/10"
          : "bg-red-500/10"
      }`}
    >
      {moneyIn ? (
        <ArrowDownLeft className="h-[18px] w-[18px] text-emerald-400" />
      ) : (
        <ArrowUpRight className="h-[18px] w-[18px] text-red-400" />
      )}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default async function RecentTransactions() {
  const session = await auth();

  /*
   * No authenticated customer.
   */
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  /* ================================================================
     LOAD DATA
  ================================================================= */

  const [wallet, withdrawals, internalTransfers] =
    await Promise.all([
      /*
       * Wallet transactions.
       */
      prisma.wallet.findUnique({
        where: {
          userId,
        },

        select: {
          currency: true,

          transactions: {
            orderBy: {
              createdAt: "desc",
            },

            take: 20,

            select: {
              id: true,
              amount: true,
              type: true,
              description: true,
              reference: true,
              createdAt: true,
            },
          },
        },
      }),

      /*
       * Withdrawal requests.
       *
       * We use this table because it contains the
       * real withdrawal status.
       */
      prisma.withdrawal.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 20,

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
      }),

      /*
       * Customer-to-customer transfers.
       *
       * This gives us the sender and recipient names
       * for the transaction description.
       */
      prisma.internalTransfer.findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              recipientId: userId,
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 50,

        select: {
          id: true,
          senderId: true,
          recipientId: true,
          amount: true,
          type: true,
          reference: true,
          createdAt: true,

          sender: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          recipient: {
            select: {
              name: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

  const currency =
    wallet?.currency || "USD";

  /* ================================================================
     NORMAL WALLET TRANSACTIONS
  ================================================================= */

  const walletTransactions: RecentTransaction[] = (
    wallet?.transactions ?? []
  )
    /*
     * Remove withdrawal wallet records created
     * by the withdrawal API.
     *
     * Withdrawals are displayed from the Withdrawal
     * table because that table contains their status.
     */
    .filter((transaction) => {
      if (
        transaction.type === "WITHDRAWAL" &&
        transaction.reference.startsWith("WD-")
      ) {
        return false;
      }

      return true;
    })
    .map((transaction) => {
      const description =
        transaction.description.toLowerCase();

      let type: RecentTransactionType;

      /*
       * Trading bot transaction.
       */
      if (
        description.includes("trading bot") ||
        description.includes("bot subscription")
      ) {
        type = "TRADING_BOT";
      }

      /*
       * Investment transaction.
       */
      else if (
        description.includes("investment started") ||
        description.includes("investment plan") ||
        description.includes("investment -")
      ) {
        type = "INVESTMENT";
      }

      /*
       * Existing wallet transaction.
       */
      else {
        type =
          transaction.type as RecentTransactionType;
      }

      /* ============================================================
         CUSTOMER-TO-CUSTOMER TRANSFER NAME
      ============================================================ */

      let displayDescription =
        transaction.description;

      /*
       * Money received from another customer.
       *
       * Reference format:
       * TR-IN-{transferId}
       */
      if (
        transaction.reference.startsWith(
          "TR-IN-"
        )
      ) {
        const transferId =
          transaction.reference.replace(
            "TR-IN-",
            ""
          );

        const transfer =
          internalTransfers.find(
            (item) =>
              item.id === transferId
          );

        if (transfer?.sender) {
          const senderName =
            getCustomerName(
              transfer.sender
            );

          displayDescription =
            `Transfer received from ${senderName}`;
        }
      }

      /*
       * Money sent to another customer.
       *
       * Reference format:
       * TR-OUT-{transferId}
       */
      if (
        transaction.reference.startsWith(
          "TR-OUT-"
        )
      ) {
        const transferId =
          transaction.reference.replace(
            "TR-OUT-",
            ""
          );

        const transfer =
          internalTransfers.find(
            (item) =>
              item.id === transferId
          );

        if (transfer?.recipient) {
          const recipientName =
            getCustomerName(
              transfer.recipient
            );

          displayDescription =
            `Transfer to ${recipientName}`;
        }
      }

      return {
        id: transaction.id,

        amount: Number(
          transaction.amount
        ),

        currency,

        description:
          displayDescription,

        createdAt:
          transaction.createdAt,

        type,
      };
    });

  /* ================================================================
     WITHDRAWAL TRANSACTIONS
  ================================================================= */

  const withdrawalTransactions: RecentTransaction[] =
    withdrawals.map((withdrawal) => {
      let description = "Withdrawal";

      if (withdrawal.method === "BANK") {
        description = withdrawal.bankName
          ? `Bank withdrawal - ${withdrawal.bankName}`
          : "Bank withdrawal";
      } else {
        description =
          withdrawal.cryptoNetwork
            ? `Crypto withdrawal - ${withdrawal.cryptoNetwork}`
            : "Crypto withdrawal";
      }

      return {
        id: `withdrawal-${withdrawal.id}`,

        amount: Number(
          withdrawal.amount
        ),

        currency:
          withdrawal.currency || currency,

        description,

        createdAt:
          withdrawal.createdAt,

        type: "WITHDRAWAL",

        status:
          withdrawal.status as WithdrawalStatus,
      };
    });

  /* ================================================================
     COMBINE + SORT + ONLY 2
  ================================================================= */

  const recentTransactions = [
    ...walletTransactions,
    ...withdrawalTransactions,
  ]
    .sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime()
    )
    .slice(0, 2);

  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#101727]">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col justify-between gap-3 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2 className="font-semibold text-white">
            Recent transactions
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your latest account activity
          </p>
        </div>

        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-300 transition hover:text-violet-200"
        >
          View all

          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ============================================================
          EMPTY STATE
      ============================================================ */}

      {recentTransactions.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
            <ArrowLeftRight className="h-6 w-6 text-slate-400" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">
            No transactions yet
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400">
            Your recorded transactions will appear
            here when available.
          </p>
        </div>
      ) : (
        /* ==========================================================
           TRANSACTION LIST
        ========================================================== */

        <div className="divide-y divide-white/5">
          {recentTransactions.map(
            (transaction) => {
              const moneyIn =
                isMoneyIn(transaction);

              /*
               * Determine transaction label.
               */
              let typeLabel =
                "Transaction";

              if (
                transaction.type ===
                "CREDIT"
              ) {
                typeLabel = "Credit";
              } else if (
                transaction.type ===
                "DEPOSIT"
              ) {
                typeLabel = "Deposit";
              } else if (
                transaction.type ===
                "WITHDRAWAL"
              ) {
                typeLabel =
                  "Withdrawal";
              } else if (
                transaction.type ===
                "INVESTMENT"
              ) {
                typeLabel =
                  "Investment";
              } else if (
                transaction.type ===
                "TRADING_BOT"
              ) {
                typeLabel =
                  "Trading Bot";
              } else if (
                transaction.type ===
                "INVESTMENT_PROFIT"
              ) {
                typeLabel =
                  "Investment Profit";
              }

              return (
                <div
                  key={transaction.id}
                  className="p-4 transition hover:bg-white/2 sm:px-6 sm:py-5"
                >
                  <div className="flex items-start gap-3">
                    {/* ==================================================
                        ICON
                    ================================================== */}

                    <TransactionIcon
                      transaction={
                        transaction
                      }
                    />

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="min-w-0 flex-1">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {
                              transaction.description
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {formatDate(
                              transaction.createdAt
                            )}
                          </p>
                        </div>

                        {/* Amount */}
                        <p
                          className={`shrink-0 text-sm font-bold ${
                            moneyIn
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {moneyIn
                            ? "+"
                            : "-"}

                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </p>
                      </div>

                      {/* ==================================================
                          BADGES
                      ================================================== */}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${
                            moneyIn
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >
                          {moneyIn ? (
                            <ArrowDownLeft className="h-2.5 w-2.5" />
                          ) : (
                            <ArrowUpRight className="h-2.5 w-2.5" />
                          )}

                          {typeLabel}
                        </span>

                        {transaction.type ===
                          "WITHDRAWAL" &&
                          transaction.status && (
                            <StatusBadge
                              status={
                                transaction.status
                              }
                            />
                          )}
                      </div>

                      {/* ==================================================
                          PENDING
                      ================================================== */}

                      {transaction.type ===
                        "WITHDRAWAL" &&
                        transaction.status ===
                          "PENDING" && (
                          <p className="mt-2 text-[10px] text-amber-400/80">
                            Withdrawal pending
                            admin review.
                          </p>
                        )}

                      {/* ==================================================
                          PROCESSING
                      ================================================== */}

                      {transaction.type ===
                        "WITHDRAWAL" &&
                        transaction.status ===
                          "PROCESSING" && (
                          <p className="mt-2 text-[10px] text-blue-400/80">
                            Withdrawal is being
                            processed.
                          </p>
                        )}

                      {/* ==================================================
                          COMPLETED
                      ================================================== */}

                      {transaction.type ===
                        "WITHDRAWAL" &&
                        transaction.status ===
                          "COMPLETED" && (
                          <p className="mt-2 text-[10px] text-emerald-400/80">
                            Withdrawal approved.
                          </p>
                        )}

                      {/* ==================================================
                          REJECTED
                      ================================================== */}

                      {transaction.type ===
                        "WITHDRAWAL" &&
                        transaction.status ===
                          "REJECTED" && (
                          <p className="mt-2 text-[10px] text-red-400/80">
                            Withdrawal rejected.
                            Funds returned to
                            wallet.
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}