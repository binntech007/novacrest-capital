
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsPage from "@/components/dashboard/SettingsPage";

export const dynamic = "force-dynamic";

export default async function CustomerSettingsRoute() {
  // Get the currently authenticated user.
  const session = await auth();

  // Redirect unauthenticated users to login.
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Allow only customer accounts to access these settings.
  if (session.user.role !== "CUSTOMER") {
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    }

    redirect("/login");
  }

  // Retrieve the customer's profile from the database.
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      status: true,
    },
  });

  // Reject missing or inactive accounts.
  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }

  // Pass only the fields required by SettingsPage.
  return (
    <SettingsPage
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      }}
    />
  );
}
