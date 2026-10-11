
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to submit a deposit." },
        { status: 401 }
      );
    }

    // 2. Only customer accounts can submit deposits
    if (session.user.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customer accounts can submit deposits." },
        { status: 403 }
      );
    }

    // 3. Verify that the account exists and is active
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account cannot submit deposits." },
        { status: 403 }
      );
    }

    // 4. Read and validate the request body
    let body: {
      amount?: unknown;
      cryptoAddressId?: unknown;
      receiptUrl?: unknown;
      receiptPublicId?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);
    const cryptoAddressId =
      typeof body.cryptoAddressId === "string"
        ? body.cryptoAddressId.trim()
        : "";

    const receiptUrl =
      typeof body.receiptUrl === "string"
        ? body.receiptUrl.trim()
        : "";

    const receiptPublicId =
      typeof body.receiptPublicId === "string"
        ? body.receiptPublicId.trim()
        : "";

    if (
      typeof body.amount !== "number" &&
      typeof body.amount !== "string"
    ) {
      return NextResponse.json(
        { error: "Enter a valid deposit amount." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1_000_000 ||
      Math.round(amount * 100) !== amount * 100
    ) {
      return NextResponse.json(
        { error: "Enter a valid amount with no more than two decimal places." },
        { status: 400 }
      );
    }

    if (!cryptoAddressId) {
      return NextResponse.json(
        { error: "Please select a cryptocurrency payment method." },
        { status: 400 }
      );
    }

    // 5. Validate the uploaded receipt URL
    let parsedReceiptUrl: URL;

    try {
      parsedReceiptUrl = new URL(receiptUrl);
    } catch {
      return NextResponse.json(
        { error: "Please upload a valid payment receipt." },
        { status: 400 }
      );
    }

    if (
      parsedReceiptUrl.protocol !== "https:" ||
      parsedReceiptUrl.hostname !== "res.cloudinary.com" ||
      !receiptPublicId.startsWith("novacrest/deposit-receipts/")
    ) {
      return NextResponse.json(
        { error: "The receipt must be uploaded through the receipt uploader." },
        { status: 400 }
      );
    }

    // 6. Verify that the selected crypto address is enabled
    const cryptoAddress = await prisma.cryptoDepositAddress.findFirst({
      where: {
        id: cryptoAddressId,
        enabled: true,
      },
      select: {
        id: true,
        name: true,
        network: true,
        address: true,
      },
    });

    if (!cryptoAddress) {
      return NextResponse.json(
        { error: "This cryptocurrency deposit method is unavailable." },
        { status: 400 }
      );
    }

    // 7. Save the deposit request for admin review
    const deposit = await prisma.depositRequest.create({
      data: {
        reference: `DEP-${randomUUID()}`,
        userId: user.id,
        amount,
        currency: "USD",
        cryptoName: cryptoAddress.name || "Cryptocurrency",
        network: cryptoAddress.network,
        depositAddress: cryptoAddress.address,
        receiptUrl,
        receiptPublicId,
        status: "PENDING",
      },
      select: {
        id: true,
        reference: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Your deposit request has been submitted for review.",
        deposit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Deposit submission failed:", error);

    return NextResponse.json(
      { error: "Could not submit your deposit. Please try again." },
      { status: 500 }
    );
  }
}
