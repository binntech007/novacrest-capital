/* ================================================================
   EMAIL HELPERS
================================================================ */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />

  <title>Novacrest Capital</title>

  <style>
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        padding: 20px 12px !important;
      }

      .email-container {
        width: 100% !important;
        border-radius: 14px !important;
      }

      .email-header {
        padding: 28px 20px !important;
      }

      .email-content {
        padding: 30px 22px !important;
      }

      .email-footer {
        padding: 20px !important;
      }

      .email-title {
        font-size: 24px !important;
      }

      .email-button {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#070b13;
    font-family:Arial,Helvetica,sans-serif;
    color:#ffffff;
    -webkit-font-smoothing:antialiased;
  "
>
  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
      width:100%;
      border-collapse:collapse;
      background-color:#070b13;
    "
  >
    <tr>
      <td
        class="email-wrapper"
        align="center"
        style="
          padding:42px 16px;
        "
      >

        <!-- Main Container -->

        <table
          role="presentation"
          class="email-container"
          width="600"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width:100%;
            max-width:600px;
            border-collapse:separate;
            background-color:#101722;
            border:1px solid #243044;
            border-radius:16px;
            overflow:hidden;
          "
        >

          <!-- =====================================================
               HEADER
          ====================================================== -->

          <tr>
            <td
              class="email-header"
              align="center"
              style="
                padding:32px 28px;
                border-bottom:1px solid #243044;
              "
            >

              <!-- Logo -->

              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                align="center"
              >
                <tr>
                  <td
                    align="center"
                    valign="middle"
                    style="
                      width:48px;
                      height:48px;
                      background-color:#7c3aed;
                      border-radius:12px;
                      color:#ffffff;
                      font-size:22px;
                      font-weight:700;
                      line-height:48px;
                    "
                  >
                    N
                  </td>
                </tr>
              </table>

              <div
                style="
                  margin-top:12px;
                  color:#ffffff;
                  font-size:21px;
                  line-height:28px;
                  font-weight:700;
                  letter-spacing:-0.2px;
                "
              >
                Novacrest
              </div>

              <div
                style="
                  margin-top:3px;
                  color:#a78bfa;
                  font-size:10px;
                  line-height:16px;
                  font-weight:700;
                  letter-spacing:3px;
                "
              >
                CAPITAL
              </div>

            </td>
          </tr>

          <!-- =====================================================
               CONTENT
          ====================================================== -->

          <tr>
            <td
              class="email-content"
              style="
                padding:38px 32px;
              "
            >
              ${content}
            </td>
          </tr>

          <!-- =====================================================
               FOOTER
          ====================================================== -->

          <tr>
            <td
              class="email-footer"
              align="center"
              style="
                padding:24px 28px;
                border-top:1px solid #243044;
                background-color:#0c121d;
              "
            >

              <p
                style="
                  margin:0;
                  color:#7b8799;
                  font-size:12px;
                  line-height:20px;
                "
              >
                This is an automated security and account
                notification from Novacrest Capital.
              </p>

              <p
                style="
                  margin:7px 0 0;
                  color:#566276;
                  font-size:11px;
                  line-height:18px;
                "
              >
                Please do not reply directly to this email.
              </p>

              <p
                style="
                  margin:14px 0 0;
                  color:#414d60;
                  font-size:10px;
                  line-height:16px;
                "
              >
                © ${new Date().getFullYear()} Novacrest Capital.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/* ================================================================
   WELCOME EMAIL
================================================================ */

export function registrationEmail({
  name,
}: {
  name: string;
}) {
  const safeName = escapeHtml(
    name?.trim() || "Customer"
  );

  return {
    subject: "Welcome to Novacrest Capital",

    text: `
Welcome to Novacrest Capital, ${name?.trim() || "Customer"}.

Your account has been successfully created.

You can now sign in using the email address and password you registered with.

If you did not create this account, please contact support immediately.

Novacrest Capital
This is an automated account notification.
`,

    html: emailLayout(`
      <!-- Greeting -->

      <p
        style="
          margin:0 0 8px;
          color:#8b98aa;
          font-size:13px;
          line-height:20px;
        "
      >
        Welcome to Novacrest Capital
      </p>

      <h1
        class="email-title"
        style="
          margin:0 0 16px;
          color:#ffffff;
          font-size:28px;
          line-height:36px;
          font-weight:700;
          letter-spacing:-0.4px;
        "
      >
        Welcome, ${safeName}
      </h1>

      <p
        style="
          margin:0;
          color:#9aa7b8;
          font-size:14px;
          line-height:24px;
        "
      >
        Your Novacrest Capital account has been
        successfully created. We're pleased to have
        you with us.
      </p>

      <!-- Account Created -->

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          margin-top:28px;
          border-collapse:separate;
          background-color:#0a101a;
          border:1px solid #253148;
          border-radius:12px;
        "
      >
        <tr>
          <td style="padding:20px;">

            <p
              style="
                margin:0 0 7px;
                color:#ffffff;
                font-size:14px;
                line-height:21px;
                font-weight:700;
              "
            >
              Account successfully created
            </p>

            <p
              style="
                margin:0;
                color:#8d9aac;
                font-size:13px;
                line-height:21px;
              "
            >
              You can now sign in using the email address
              and password you provided during registration.
            </p>

          </td>
        </tr>
      </table>

      <!-- CTA -->

      <table
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          margin-top:28px;
        "
      >
        <tr>
          <td
            class="email-button"
            align="center"
            style="
              background-color:#7c3aed;
              border-radius:10px;
            "
          >
            <a
              href="#"
              style="
                display:inline-block;
                padding:13px 24px;
                color:#ffffff;
                font-size:13px;
                line-height:20px;
                font-weight:700;
                text-decoration:none;
              "
            >
              Access Your Account
            </a>
          </td>
        </tr>
      </table>

      <!-- Security Notice -->

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          margin-top:28px;
          border-collapse:separate;
          background-color:#111827;
          border:1px solid #263449;
          border-radius:12px;
        "
      >
        <tr>
          <td style="padding:18px 20px;">

            <p
              style="
                margin:0 0 6px;
                color:#cbd5e1;
                font-size:12px;
                line-height:19px;
                font-weight:700;
              "
            >
              Security notice
            </p>

            <p
              style="
                margin:0;
                color:#7f8da1;
                font-size:12px;
                line-height:20px;
              "
            >
              If you did not create this account,
              please contact support immediately.
            </p>

          </td>
        </tr>
      </table>
    `),
  };
}

/* ================================================================
   LOGIN NOTIFICATION
================================================================ */

export function loginNotificationEmail({
  name,
}: {
  name: string;
}) {
  const safeName = escapeHtml(
    name?.trim() || "Customer"
  );

  return {
    subject: "Security alert: New login to your account",

    text: `
Hello ${name?.trim() || "Customer"}.

A new sign-in to your Novacrest Capital account was detected.

If this was you, no further action is required.

If you do not recognize this activity, please secure your account immediately by changing your password and contacting support.

Novacrest Capital
This is an automated security notification.
`,

    html: emailLayout(`
      <!-- Security Label -->

      <p
        style="
          margin:0 0 8px;
          color:#a78bfa;
          font-size:12px;
          line-height:20px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1px;
        "
      >
        Account Security
      </p>

      <h1
        class="email-title"
        style="
          margin:0 0 16px;
          color:#ffffff;
          font-size:28px;
          line-height:36px;
          font-weight:700;
          letter-spacing:-0.4px;
        "
      >
        New login detected
      </h1>

      <p
        style="
          margin:0;
          color:#9aa7b8;
          font-size:14px;
          line-height:24px;
        "
      >
        Hello ${safeName}, we detected a new sign-in
        to your Novacrest Capital account.
      </p>

      <!-- Login Status -->

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          margin-top:28px;
          border-collapse:separate;
          background-color:#0a101a;
          border:1px solid #253148;
          border-radius:12px;
        "
      >
        <tr>
          <td style="padding:20px;">

            <table
              role="presentation"
              cellspacing="0"
              cellpadding="0"
              border="0"
            >
              <tr>

                <td
                  valign="middle"
                  style="
                    width:10px;
                    height:10px;
                    background-color:#22c55e;
                    border-radius:50%;
                  "
                >
                </td>

                <td
                  style="
                    padding-left:10px;
                    color:#e2e8f0;
                    font-size:13px;
                    line-height:20px;
                    font-weight:700;
                  "
                >
                  Sign-in completed successfully
                </td>

              </tr>
            </table>

            <p
              style="
                margin:12px 0 0;
                color:#7f8da1;
                font-size:12px;
                line-height:20px;
              "
            >
              If you recognize this activity,
              no further action is required.
            </p>

          </td>
        </tr>
      </table>

      <!-- Security Warning -->

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
          margin-top:16px;
          border-collapse:separate;
          background-color:#1b1216;
          border:1px solid #54202a;
          border-radius:12px;
        "
      >
        <tr>
          <td style="padding:20px;">

            <p
              style="
                margin:0 0 7px;
                color:#fda4af;
                font-size:13px;
                line-height:20px;
                font-weight:700;
              "
            >
              Don't recognize this activity?
            </p>

            <p
              style="
                margin:0;
                color:#a98189;
                font-size:12px;
                line-height:20px;
              "
            >
              Change your password and contact support
              as soon as possible to help secure your account.
            </p>

          </td>
        </tr>
      </table>

      <!-- Footer Message -->

      <p
        style="
          margin:26px 0 0;
          color:#667386;
          font-size:11px;
          line-height:19px;
        "
      >
        For your security, Novacrest Capital will notify
        you when a new sign-in is detected.
      </p>
    `),
  };
}