import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function KycReviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#080d19] p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">KYC Review</h1>
        <p className="mt-2 text-white/60">
          Your KYC review page is ready.
        </p>
      </div>
    </main>
  );
}