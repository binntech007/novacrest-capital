import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { registrationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Enter a valid name and email, and a password of at least 12 characters.",
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password } = parsed.data;

    const normalizedEmail = email.toLowerCase();

    // ---------------------------------------------------------
    // CHECK EXISTING USER
    // ---------------------------------------------------------

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Unable to register with those details.",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------------------
    // HASH PASSWORD
    // ---------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 12);

    const name = `${firstName} ${lastName}`;

    // ---------------------------------------------------------
    // CREATE CUSTOMER
    // ---------------------------------------------------------

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
      },
    });

    // ---------------------------------------------------------
    // SEND WELCOME EMAIL
    // ---------------------------------------------------------

    try {
      const emailContent = registrationEmail({
        name:
          user.name ||
          `${user.firstName} ${user.lastName}`.trim() ||
          "Customer",
      });

      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      console.log(
        `Registration email sent successfully to ${user.email}`
      );
    } catch (emailError) {
      // Do not fail registration if the email service has a
      // temporary problem. The customer account already exists.
      console.error(
        "REGISTRATION EMAIL ERROR:",
        emailError
      );
    }

    // ---------------------------------------------------------
    // SUCCESS
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        message:
          "Account created successfully. You can now sign in.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate emails even if two requests arrive together.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "Unable to register with those details.",
        },
        { status: 409 }
      );
    }

    console.error(
      "Customer registration failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create your account right now.",
      },
      { status: 500 }
    );
  }
}