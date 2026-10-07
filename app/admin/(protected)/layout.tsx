
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

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

  // Verify the current role and status from the database.
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
    <div className="min-h-screen bg-[#090c13] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <AdminHeader
            name={name}
            email={admin.email}
          />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
