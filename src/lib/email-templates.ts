interface EmailTemplateProps {
  userName: string;
  confirmationUrl?: string;
  resetUrl?: string;
}

export function getConfirmationEmailTemplate({
  userName,
  confirmationUrl,
}: EmailTemplateProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirm your email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0F0F; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F0F0F; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 24px; font-weight: 900; color: #7CFC00; text-transform: uppercase; letter-spacing: 2px;">PLAYFOUNDRY</span>
              <span style="font-size: 24px; font-weight: 900; color: #FED985; text-transform: uppercase; letter-spacing: 2px;"> AI</span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1A1A1A; border: 1px solid #404040; border-radius: 4px; padding: 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 56px; height: 56px; background-color: #1a2e0d; border: 1px solid #2d4a16; border-radius: 4px; display: inline-block; line-height: 56px; text-align: center;">
                      <span style="font-size: 24px;">&#127918;</span>
                    </div>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 900; color: #F5F5F5; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                CONFIRM YOUR EMAIL
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #A3A3A3; text-align: center; line-height: 1.6;">
                Hey ${userName}, your studio is almost ready! Click below to verify your email and start creating games with MAX.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="${confirmationUrl}"
                       style="display: inline-block; background-color: #47761E; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      VERIFY EMAIL
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 16px; font-size: 13px; color: #737373; text-align: center; line-height: 1.5;">
                If you didn't create an account, you can safely ignore this email.
              </p>
              <div style="border-top: 1px solid #404040; padding-top: 16px;">
                <p style="margin: 0; font-size: 12px; color: #737373; text-align: center; word-break: break-all; line-height: 1.5;">
                  Or copy this link:<br />
                  <a href="${confirmationUrl}" style="color: #7CFC00;">${confirmationUrl}</a>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #737373;">
                &copy; 2026 PlayFoundry AI. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getPasswordResetEmailTemplate({
  userName,
  resetUrl,
}: EmailTemplateProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0F0F0F; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F0F0F; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width: 480px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-size: 24px; font-weight: 900; color: #7CFC00; text-transform: uppercase; letter-spacing: 2px;">PLAYFOUNDRY</span>
              <span style="font-size: 24px; font-weight: 900; color: #FED985; text-transform: uppercase; letter-spacing: 2px;"> AI</span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1A1A1A; border: 1px solid #404040; border-radius: 4px; padding: 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 56px; height: 56px; background-color: #2a1a0a; border: 1px solid #4a3020; border-radius: 4px; display: inline-block; line-height: 56px; text-align: center;">
                      <span style="font-size: 24px;">&#128274;</span>
                    </div>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 900; color: #F5F5F5; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                RESET YOUR PASSWORD
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #A3A3A3; text-align: center; line-height: 1.6;">
                Hey ${userName}, we received a request to reset your password. Click below to choose a new one.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="${resetUrl}"
                       style="display: inline-block; background-color: #47761E; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      RESET PASSWORD
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 16px; font-size: 13px; color: #737373; text-align: center; line-height: 1.5;">
                If you didn't request this, you can safely ignore this email. Your password won't change.
              </p>
              <div style="border-top: 1px solid #404040; padding-top: 16px;">
                <p style="margin: 0; font-size: 12px; color: #737373; text-align: center; word-break: break-all; line-height: 1.5;">
                  Or copy this link:<br />
                  <a href="${resetUrl}" style="color: #7CFC00;">${resetUrl}</a>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="margin: 0; font-size: 12px; color: #737373;">
                &copy; 2026 PlayFoundry AI. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
