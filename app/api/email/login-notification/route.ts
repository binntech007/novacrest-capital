import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { sendEmail } from "@/lib/mail";
import { loginNotificationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST() {
  try {
    // ---------------------------------------------------------
    // GET AUTHENTICATED SESSION
    // ---------------------------------------------------------

    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // ---------------------------------------------------------
    // ONLY ACTIVE USERS
    // ---------------------------------------------------------

    if (session.user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "Account is not active.",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // SEND LOGIN NOTIFICATION
    // ---------------------------------------------------------

    const emailContent = loginNotificationEmail({
      name:
        session.user.name?.trim() ||
        "Customer",
    });

    await sendEmail({
      to: session.user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log(
      `Login notification sent successfully to ${session.user.email}`
    );

    return NextResponse.json({
      success: true,
      message: "Login notification email sent successfully.",
    });
  } catch (error) {
    console.error(
      "LOGIN NOTIFICATION EMAIL ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to send login notification email.",
      },
      { status: 500 }
    );
  }
}