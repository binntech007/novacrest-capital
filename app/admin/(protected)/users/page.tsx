import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminUsersWallet from "@/components/admin/AdminUsersWallet";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,

      wallet: {
        select: {
          id: true,
          balance: true,
          currency: true,
        },
      },

      customerAllocation: {
        select: {
          activeInvestmentAmount: true,
          tradingBotAmount: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const customers = users.map((user) => ({
    id: user.id,

    name:
      `${user.firstName} ${user.lastName}`.trim() ||
      user.email,

    email: user.email,

    status: user.status,

    balance: user.wallet
      ? user.wallet.balance.toString()
      : "0.00",

    currency:
      user.wallet?.currency ?? "USD",

    activeInvestmentAmount:
      user.customerAllocation
        ?.activeInvestmentAmount.toString() ??
      "0.00",

    tradingBotAmount:
      user.customerAllocation
        ?.tradingBotAmount.toString() ??
      "0.00",
  }));

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-medium text-violet-300">
            NOVACREST CAPITAL
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Admin Users
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage customer wallet balances, active
            investments, and trading bot allocations.
          </p>
        </div>

        <AdminUsersWallet
          customers={customers}
        />
      </div>
    </main>
  );
}