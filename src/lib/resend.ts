import { Resend } from "resend";
import {
  getConfirmationEmailTemplate,
  getPasswordResetEmailTemplate,
} from "./email-templates";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("Missing RESEND_API_KEY environment variable");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM = "PlayFoundry AI <noreply@feltsense.com>";

export async function sendConfirmationEmail({
  to,
  userName,
  confirmationUrl,
}: {
  to: string;
  userName: string;
  confirmationUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to,
      subject: "Confirm your email — PlayFoundry AI",
      html: getConfirmationEmailTemplate({ userName, confirmationUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: {
  to: string;
  userName: string;
  resetUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM,
      to,
      subject: "Reset your password — PlayFoundry AI",
      html: getPasswordResetEmailTemplate({ userName, resetUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return { success: false, error: "Failed to send email" };
  }
}
