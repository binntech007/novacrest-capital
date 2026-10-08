import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const registrationSchema = z.object({
  secret: z.string().min(1).max(256),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
});

function secretMatches(
  received: string,
  expected: string
): boolean {
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}

export async function POST(request: Request) {
  try {
    /*
     * ------------------------------------------------------------
     * Check admin registration secret
     * ------------------------------------------------------------
     */

    const authorizationSecret =
      process.env.ADMIN_REGISTRATION_SECRET;

    if (
      !authorizationSecret ||
      authorizationSecret.length < 32
    ) {
      console.error(
        "ADMIN_REGISTRATION_SECRET is missing or too short."
      );

      return NextResponse.json(
        {
          error:
            "Admin registration is not configured.",
        },
        {
          status: 503,
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * Parse request body
     * ------------------------------------------------------------
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON request.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * Validate request
     * ------------------------------------------------------------
     */

    const parsed =
      registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid name, email, authorization key, and password of at least 12 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      secret,
      name,
      email,
      password,
    } = parsed.data;

    /*
     * ------------------------------------------------------------
     * Verify authorization secret
     * ------------------------------------------------------------
     */

    if (
      !secretMatches(
        secret,
        authorizationSecret
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid authorization key.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * ------------------------------------------------------------
     * Split full name
     * ------------------------------------------------------------
     */

    const nameParts =
      name.split(/\s+/);

    if (nameParts.length < 2) {
      return NextResponse.json(
        {
          error:
            "Please enter your first and last name.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedEmail =
      email.toLowerCase();

    const firstName =
      nameParts[0];

    const lastName =
      nameParts
        .slice(1)
        .join(" ");

    /*
     * ------------------------------------------------------------
     * Hash password
     * ------------------------------------------------------------
     */

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    /*
     * ------------------------------------------------------------
     * Create the first admin
     * ------------------------------------------------------------
     */

    const admin =
      await prisma.$transaction(
        async (tx) => {
          /*
           * Only allow the first admin
           * to be created through this endpoint.
           */

          const existingAdmin =
            await tx.user.findFirst({
              where: {
                role: "ADMIN",
              },
              select: {
                id: true,
              },
            });

          if (existingAdmin) {
            throw new Error(
              "ADMIN_ALREADY_EXISTS"
            );
          }

          /*
           * Check whether the email
           * is already registered.
           */

          const existingUser =
            await tx.user.findUnique({
              where: {
                email: normalizedEmail,
              },
              select: {
                id: true,
              },
            });

          if (existingUser) {
            throw new Error(
              "EMAIL_ALREADY_EXISTS"
            );
          }

          /*
           * Create admin account.
           */

          return tx.user.create({
            data: {
              name,
              firstName,
              lastName,
              email: normalizedEmail,
              password: hashedPassword,
              role: "ADMIN",
              status: "ACTIVE",
            },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          });
        },
        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        }
      );

    /*
     * ------------------------------------------------------------
     * Success response
     * ------------------------------------------------------------
     */

    return NextResponse.json(
      {
        message:
          "Admin account created successfully.",
        admin,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    /*
     * ------------------------------------------------------------
     * Known application errors
     * ------------------------------------------------------------
     */

    if (error instanceof Error) {
      if (
        error.message ===
        "ADMIN_ALREADY_EXISTS"
      ) {
        return NextResponse.json(
          {
            error:
              "An administrator already exists. New admin registration is closed.",
          },
          {
            status: 409,
          }
        );
      }

      if (
        error.message ===
        "EMAIL_ALREADY_EXISTS"
      ) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * Prisma unique constraint
     * ------------------------------------------------------------
     */

    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error:
              "This account conflicts with an existing record.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * ------------------------------------------------------------
     * Unexpected error
     * ------------------------------------------------------------
     */

    console.error(
      "Admin registration failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create the admin account. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}