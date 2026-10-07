
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CreditInput = {
  userId: string;
  amount: string;
  reason: string;
};

export async function creditCustomerWallet(input: CreditInput) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  const userId = input.userId?.trim();
  const reason = input.reason?.trim();
  const amountText = input.amount?.trim();

  if (!userId || !reason || !amountText) {
    return { success: false, error: "Complete all fields." };
  }

  if (reason.length > 200) {
    return { success: false, error: "Reason must be 200 characters or fewer." };
  }

  // Accept positive amounts with at most two decimal places.
  if (!/^\d{1,16}(\.\d{1,2})?$/.test(amountText)) {
    return { success: false, error: "Enter a valid amount." };
  }

  const amount = Number(amountText);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be greater than zero." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const customer = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, status: true },
      });

      if (!customer || customer.role !== "CUSTOMER") {
        throw new Error("Customer account was not found.");
      }

      if (customer.status !== "ACTIVE") {
        throw new Error("This customer account is not active.");
      }

      const wallet = await tx.wallet.upsert({
        where: { userId },
        create: {
          userId,
          balance: "0.00",
          currency: "USD",
        },
        update: {},
        select: { id: true },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amountText },
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          adminId: session.user.id,
          amount: amountText,
          type: "CREDIT",
          description: reason,
        },
      });
    });

    revalidatePath("/admin/users");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/wallet");

    return {
      success: true,
      message: "Wallet credit recorded successfully.",
    };
  } catch (error) {
    console.error("Admin wallet credit failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to credit this wallet.",
    };
  }
}
