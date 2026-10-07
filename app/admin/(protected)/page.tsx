
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

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!admin) {
    redirect("/admin/login");
  }

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
