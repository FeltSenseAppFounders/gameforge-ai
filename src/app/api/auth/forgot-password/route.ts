import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { email } = body as { email: string };

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Always return 200 to avoid revealing whether an email exists
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data: linkData, error: linkError } =
    await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
      },
    });

  if (linkError) {
    // User may not exist — don't reveal this
    console.error("Failed to generate recovery link:", linkError);
    return NextResponse.json({ success: true });
  }

  // Try to get user name from metadata
  const { data: userData } = await supabase.auth.admin.getUserById(
    linkData.user.id
  );
  const userName =
    userData?.user?.user_metadata?.full_name?.split(" ")[0] || "there";

  const result = await sendPasswordResetEmail({
    to: email,
    userName,
    resetUrl: linkData.properties.action_link,
  });

  if (!result.success) {
    console.error("Failed to send password reset email:", result.error);
  }

  return NextResponse.json({ success: true });
}
