import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const bank = await prisma.bankPaymentSettings.findFirst();

  return NextResponse.json(bank);
}

export async function PUT(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const bankName =
      typeof body.bankName === "string"
        ? body.bankName.trim()
        : "";

    const bankAccountName =
      typeof body.bankAccountName === "string"
        ? body.bankAccountName.trim()
        : "";

    const bankAccountNumber =
      typeof body.bankAccountNumber === "string"
        ? body.bankAccountNumber.trim()
        : "";

    if (!bankName) {
      return NextResponse.json(
        { error: "Bank name is required." },
        { status: 400 }
      );
    }

    if (!bankAccountName) {
      return NextResponse.json(
        { error: "Account name is required." },
        { status: 400 }
      );
    }

    if (!bankAccountNumber) {
      return NextResponse.json(
        { error: "Account number is required." },
        { status: 400 }
      );
    }

    const existing =
      await prisma.bankPaymentSettings.findFirst();

    const data = {
      enabled:
        typeof body.enabled === "boolean"
          ? body.enabled
          : true,

      bankName,
      bankAccountName,
      bankAccountNumber,

      bankRoutingNumber:
        typeof body.bankRoutingNumber === "string"
          ? body.bankRoutingNumber.trim() || null
          : null,

      bankSwiftCode:
        typeof body.bankSwiftCode === "string"
          ? body.bankSwiftCode.trim() || null
          : null,

      bankIban:
        typeof body.bankIban === "string"
          ? body.bankIban.trim() || null
          : null,

      depositInstructions:
        typeof body.depositInstructions === "string"
          ? body.depositInstructions.trim() || null
          : null,
    };

    const bank = existing
      ? await prisma.bankPaymentSettings.update({
          where: {
            id: existing.id,
          },
          data,
        })
      : await prisma.bankPaymentSettings.create({
          data,
        });

    return NextResponse.json({
      success: true,
      bank,
    });
  } catch (error) {
    console.error(
      "UPDATE BANK SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to save bank settings.",
      },
      { status: 500 }
    );
  }
}