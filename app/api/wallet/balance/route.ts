
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        balance: true,
        currency: true,
      },
    });

    if (!wallet) {
      return NextResponse.json({
        success: true,
        balance: "0.00",
        currency: "USD",
      });
    }

    return NextResponse.json(
      {
        success: true,
        balance: wallet.balance.toString(),
        currency: wallet.currency,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Wallet balance API error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load wallet balance" },
      { status: 500 },
    );
  }
}
