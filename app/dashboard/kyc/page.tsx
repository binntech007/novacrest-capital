import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import KycForm from "./KycForm";

export default async function KycPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      kycApplication: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <KycForm
      user={{
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }}
      kyc={user.kycApplication}
    />
  );
}