import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/resend";

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
  const { email, password, fullName } = body as {
    email: string;
    password: string;
    fullName: string;
  };

  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: "Email, password, and name are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: fullName },
    });

  if (userError) {
    if (userError.message.includes("already been registered")) {
      return NextResponse.json(
        { error: "This email is already registered. Try logging in instead." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { data: linkData, error: linkError } =
    await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: { redirectTo: `${appUrl}/auth/callback` },
    });

  if (linkError) {
    console.error("Failed to generate confirmation link:", linkError);
    return NextResponse.json(
      { error: "Account created but failed to send confirmation email." },
      { status: 500 }
    );
  }

  const result = await sendConfirmationEmail({
    to: email,
    userName: fullName.split(" ")[0],
    confirmationUrl: linkData.properties.action_link,
  });

  if (!result.success) {
    console.error("Failed to send confirmation email:", result.error);
  }

  return NextResponse.json({ email }, { status: 201 });
}
