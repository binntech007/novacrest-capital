
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminOverview from "@/components/admin/AdminOverview";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/admin/login");
  }

  if (admin.status !== "ACTIVE") {
    redirect("/admin/login?error=account-unavailable");
  }

  const [customerCount, adminCount, activeUserCount] =
    await Promise.all([
      prisma.user.count({
        where: { role: "CUSTOMER" },
      }),
      prisma.user.count({
        where: { role: "ADMIN" },
      }),
      prisma.user.count({
        where: { status: "ACTIVE" },
      }),
    ]);

  const name =
    `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() ||
    "Administrator";

  return (
    <AdminOverview
      name={name}
      email={admin.email}
      customerCount={customerCount}
      adminCount={adminCount}
      activeUserCount={activeUserCount}
    />
  );
}
