import nodemailer from "nodemailer";

const smtpHost =
  process.env.ZOHO_SMTP_HOST || "smtp.zoho.com";

const smtpPort = Number(
  process.env.ZOHO_SMTP_PORT || 465
);

const smtpUser = process.env.ZOHO_SMTP_USER;

const smtpPassword =
  process.env.ZOHO_SMTP_PASSWORD;

const fromEmail =
  process.env.ZOHO_FROM_EMAIL || smtpUser;

const fromName =
  process.env.ZOHO_FROM_NAME || "Novacrest Capital";

if (!smtpUser) {
  console.warn(
    "ZOHO_SMTP_USER is not configured."
  );
}

if (!smtpPassword) {
  console.warn(
    "ZOHO_SMTP_PASSWORD is not configured."
  );
}

export const mailTransporter =
  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,

    secure: smtpPort === 465,

    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!smtpUser || !smtpPassword) {
    throw new Error(
      "Zoho SMTP is not configured."
    );
  }

  return mailTransporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
}