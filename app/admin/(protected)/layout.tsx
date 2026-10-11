
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (
    !admin ||
    admin.role !== "ADMIN" ||
    admin.status !== "ACTIVE"
  ) {
    redirect("/admin/login?error=unauthorized");
  }

  const name =
    `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim() ||
    "Administrator";

  return (
    <AdminLayoutClient name={name} email={admin.email}>
      {children}
    </AdminLayoutClient>
  );
}
