
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    // Authenticate the user.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to change your password." },
        { status: 401 },
      );
    }

    // Only active customers may use this endpoint.
    if (
      session.user.role !== "CUSTOMER" ||
      session.user.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { error: "Your account cannot change its password." },
        { status: 403 },
      );
    }

    // Recheck the account against the database.
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (
      !user ||
      user.role !== "CUSTOMER" ||
      user.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { error: "Your account cannot change its password." },
        { status: 403 },
      );
    }

    // Read and validate the request body.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const currentPassword = data.currentPassword;
    const newPassword = data.newPassword;
    const confirmPassword = data.confirmPassword;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "Please complete all password fields." },
        { status: 400 },
      );
    }

    if (
      currentPassword.length === 0 ||
      newPassword.length === 0 ||
      confirmPassword.length === 0
    ) {
      return NextResponse.json(
        { error: "Please complete all password fields." },
        { status: 400 },
      );
    }

    // Avoid unnecessarily expensive password-hash operations
    // on oversized input.
    if (
      Buffer.byteLength(currentPassword, "utf8") > 72 ||
      Buffer.byteLength(newPassword, "utf8") > 72
    ) {
      return NextResponse.json(
        { error: "Passwords must not exceed 72 UTF-8 bytes." },
        { status: 400 },
      );
    }

    if (newPassword.length < 12) {
      return NextResponse.json(
        { error: "Your new password must be at least 12 characters." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Your new passwords do not match." },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          error:
            "Your new password must be different from your current password.",
        },
        { status: 400 },
      );
    }

    // Verify the existing password.
    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      return NextResponse.json(
        { error: "Your current password is incorrect." },
        { status: 400 },
      );
    }

    // Hash the new password before saving it.
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update only the authenticated user's password.
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Your password has been changed successfully.",
    });
  } catch (error) {
    console.error("Customer password update failed:", error);

    return NextResponse.json(
      { error: "Unable to change your password right now." },
      { status: 500 },
    );
  }
}
