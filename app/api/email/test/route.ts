import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function GET() {
  const testEmail = process.env.ZOHO_SMTP_USER;

  if (!testEmail) {
    return NextResponse.json(
      {
        success: false,
        message: "ZOHO_SMTP_USER is not configured.",
      },
      { status: 500 }
    );
  }

  try {
    const result = await sendEmail({
      to: testEmail,
      subject: "Novacrest Capital SMTP Test",
      text: "This is a test email from your Novacrest Capital application.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
          <h2>Novacrest Capital</h2>
          <p>This is a test email from your application.</p>
          <p>Your Zoho SMTP configuration is working correctly.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully.",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("EMAIL TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send test email.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to: email,
      subject: "Novacrest Capital SMTP Test",
      text: "This is a test email from your Novacrest Capital application.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
          <h2>Novacrest Capital</h2>
          <p>This is a test email from your application.</p>
          <p>Your Zoho SMTP configuration is working correctly.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully.",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("EMAIL TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send test email.",
      },
      { status: 500 }
    );
  }
}