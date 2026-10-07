import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  // Require an authenticated user.
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Prevent blocked or unavailable accounts.
  if (session.user.status !== "ACTIVE") {
    redirect("/login?error=account-unavailable");
  }

  // Keep administrators on the admin dashboard.
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  // Only customers can access this dashboard.
  if (session.user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch wallet, KYC and customer allocations together.
  const [wallet, kyc, allocation] = await Promise.all([
    prisma.wallet.findUnique({
      where: {
        userId,
      },
      select: {
        balance: true,
        currency: true,
      },
    }),

    prisma.kycApplication.findUnique({
      where: {
        userId,
      },
      select: {
        status: true,
        rejectionReason: true,
      },
    }),

    prisma.customerAllocation.findUnique({
      where: {
        userId,
      },
      select: {
        activeInvestmentAmount: true,
        tradingBotAmount: true,
      },
    }),
  ]);

  // Values managed by the administrator.
  const activeInvestmentAmount = Number(
    allocation?.activeInvestmentAmount ?? 0,
  );

  const tradingBotAmount = Number(
    allocation?.tradingBotAmount ?? 0,
  );

  return (
    <DashboardOverview
      name={session.user.name || "Customer"}
      availableBalance={Number(wallet?.balance ?? 0)}
      activeInvestmentAmount={activeInvestmentAmount}
      tradingBotAmount={tradingBotAmount}
      currency={wallet?.currency ?? "USD"}
      kycStatus={kyc?.status ?? "NOT_STARTED"}
      kycRejectionReason={kyc?.rejectionReason ?? null}
    />
  );
}