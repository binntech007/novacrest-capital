
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  DepositRequestStatus,
  WalletTransactionType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

const MAX_ADMIN_NOTE_LENGTH = 500;

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: administrator access required.");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (
    !admin ||
    admin.role !== "ADMIN" ||
    admin.status !== "ACTIVE"
  ) {
    throw new Error(
      "Your account is not authorized to review deposits."
    );
  }

  return admin;
}

function getFormString(
  formData: FormData,
  field: string
): string {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function validateAdminNote(note: string) {
  if (note.length > MAX_ADMIN_NOTE_LENGTH) {
    throw new Error(
      `The admin note must be ${MAX_ADMIN_NOTE_LENGTH} characters or fewer.`
    );
  }
}

/**
 * Approve a pending deposit and credit the customer's wallet.
 *
 * IMPORTANT:
 * Verify the actual payment has arrived before approving.
 */
export async function approveDeposit(formData: FormData) {
  const admin = await requireAdmin();

  const depositId = getFormString(formData, "depositId");
  const adminNote = getFormString(formData, "adminNote");

  if (!depositId) {
    throw new Error("Missing deposit ID.");
  }

  validateAdminNote(adminNote);

  await prisma.$transaction(async (tx) => {
    // Read the request and confirm that it is still pending.
    const deposit = await tx.depositRequest.findUnique({
      where: { id: depositId },
      select: {
        id: true,
        userId: true,
        amount: true,
        currency: true,
        reference: true,
        status: true,
      },
    });

    if (!deposit) {
      throw new Error("Deposit request not found.");
    }

    if (deposit.status !== DepositRequestStatus.PENDING) {
      throw new Error(
        "This deposit has already been reviewed."
      );
    }

    // Claim the pending request atomically. If another admin
    // has already reviewed it, the update count will be zero.
    const claimed = await tx.depositRequest.updateMany({
      where: {
        id: deposit.id,
        status: DepositRequestStatus.PENDING,
      },
      data: {
        status: DepositRequestStatus.APPROVED,
        adminNote: adminNote || null,
        reviewedById: admin.id,
        reviewedAt: new Date(),
      },
    });

    if (claimed.count !== 1) {
      throw new Error(
        "This deposit has already been reviewed. Refresh the page."
      );
    }

    // Create the wallet if one does not exist; otherwise
    // increment the current balance without replacing it.
    const wallet = await tx.wallet.upsert({
      where: {
        userId: deposit.userId,
      },
      create: {
        userId: deposit.userId,
        balance: deposit.amount,
        currency: deposit.currency,
      },
      update: {
        balance: {
          increment: deposit.amount,
        },
      },
      select: {
        id: true,
        currency: true,
      },
    });

    // The deposit reference is unique in WalletTransaction.
    // If this insert fails, the entire transaction rolls back,
    // including the status update and wallet balance change.
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        adminId: admin.id,
        amount: deposit.amount,
        type: WalletTransactionType.DEPOSIT,
        description: `Approved deposit ${deposit.reference}`,
        reference: deposit.reference,
      },
    });
  });

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallet");
  revalidatePath("/dashboard/transactions");
}

/**
 * Reject a pending deposit without crediting the wallet.
 */
export async function rejectDeposit(formData: FormData) {
  const admin = await requireAdmin();

  const depositId = getFormString(formData, "depositId");
  const adminNote = getFormString(formData, "adminNote");

  if (!depositId) {
    throw new Error("Missing deposit ID.");
  }

  if (!adminNote) {
    throw new Error("Please provide a reason for rejecting the deposit.");
  }

  validateAdminNote(adminNote);

  const result = await prisma.depositRequest.updateMany({
    where: {
      id: depositId,
      status: DepositRequestStatus.PENDING,
    },
    data: {
      status: DepositRequestStatus.REJECTED,
      adminNote,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  if (result.count !== 1) {
    throw new Error(
      "This deposit has already been reviewed or does not exist. Refresh the page."
    );
  }

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
}
