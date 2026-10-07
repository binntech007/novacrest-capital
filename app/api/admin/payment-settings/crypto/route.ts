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

// GET ALL CRYPTO DEPOSIT ADDRESSES
export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const addresses =
      await prisma.cryptoDepositAddress.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error(
      "GET CRYPTO ADDRESSES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load crypto deposit addresses.",
      },
      { status: 500 }
    );
  }
}

// CREATE CRYPTO DEPOSIT ADDRESS
export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const network =
      typeof body.network === "string"
        ? body.network.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const qrCodeUrl =
      typeof body.qrCodeUrl === "string"
        ? body.qrCodeUrl.trim()
        : null;

    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : null;

    const enabled =
      typeof body.enabled === "boolean"
        ? body.enabled
        : true;

    // VALIDATION
    if (!network) {
      return NextResponse.json(
        {
          error: "Network is required.",
        },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          error: "Crypto address is required.",
        },
        { status: 400 }
      );
    }

    // Validate QR URL if supplied
    if (qrCodeUrl) {
      try {
        new URL(qrCodeUrl);
      } catch {
        return NextResponse.json(
          {
            error: "Invalid QR code image URL.",
          },
          { status: 400 }
        );
      }
    }

    const cryptoAddress =
      await prisma.cryptoDepositAddress.create({
        data: {
          name: name || null,
          network,
          address,
          qrCodeUrl,
          instructions,
          enabled,
        },
      });

    return NextResponse.json(
      {
        success: true,
        address: cryptoAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE CRYPTO ADDRESS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create crypto deposit address.",
      },
      { status: 500 }
    );
  }
}

// UPDATE CRYPTO DEPOSIT ADDRESS
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

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Crypto address ID is required.",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.cryptoDepositAddress.findUnique({
        where: { id },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Crypto deposit address not found.",
        },
        { status: 404 }
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : undefined;

    const network =
      typeof body.network === "string"
        ? body.network.trim()
        : undefined;

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : undefined;

    const qrCodeUrl =
      typeof body.qrCodeUrl === "string"
        ? body.qrCodeUrl.trim()
        : undefined;

    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : undefined;

    const enabled =
      typeof body.enabled === "boolean"
        ? body.enabled
        : undefined;

    if (network !== undefined && !network) {
      return NextResponse.json(
        {
          error: "Network cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (address !== undefined && !address) {
      return NextResponse.json(
        {
          error: "Crypto address cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (qrCodeUrl) {
      try {
        new URL(qrCodeUrl);
      } catch {
        return NextResponse.json(
          {
            error: "Invalid QR code image URL.",
          },
          { status: 400 }
        );
      }
    }

    const updated =
      await prisma.cryptoDepositAddress.update({
        where: { id },

        data: {
          name:
            name !== undefined
              ? name || null
              : undefined,

          network,

          address,

          qrCodeUrl:
            qrCodeUrl !== undefined
              ? qrCodeUrl || null
              : undefined,

          instructions:
            instructions !== undefined
              ? instructions || null
              : undefined,

          enabled,
        },
      });

    return NextResponse.json({
      success: true,
      address: updated,
    });
  } catch (error) {
    console.error(
      "UPDATE CRYPTO ADDRESS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update crypto deposit address.",
      },
      { status: 500 }
    );
  }
}

// DELETE CRYPTO DEPOSIT ADDRESS
export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Crypto address ID is required.",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.cryptoDepositAddress.findUnique({
        where: { id },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Crypto deposit address not found.",
        },
        { status: 404 }
      );
    }

    await prisma.cryptoDepositAddress.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Crypto deposit address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CRYPTO ADDRESS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete crypto deposit address.",
      },
      { status: 500 }
    );
  }
}