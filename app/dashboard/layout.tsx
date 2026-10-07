
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      firstName: true,
      lastName: true,
      name: true,
      image: true,
      role: true,
      status: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }

  if (user.role !== "CUSTOMER") {
    if (user.role === "ADMIN") {
      redirect("/admin");
    }

    redirect("/login");
  }

  const displayName =
    `${user.firstName} ${user.lastName}`.trim() ||
    user.name ||
    "Customer";

  return (
    <DashboardShell
      name={displayName}
      image={user.image}
    >
      {children}
    </DashboardShell>
  );
}
