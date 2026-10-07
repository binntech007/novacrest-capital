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

/**
 * GET
 * Get all withdrawal requests for the admin.
 */
export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const withdrawals = await prisma.withdrawal.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error("GET ADMIN WITHDRAWALS ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to load withdrawals.",
      },
      { status: 500 }
    );
  }
}