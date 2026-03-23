import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * POST /api/demo/create
 *
 * Creates a demo studio with seeded game projects. User must confirm email before signing in.
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { name, email, password } = body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
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

  // 1. Create user with email_confirm: false (Supabase sends verification email)
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: name, is_demo: true },
    });

  if (userError) {
    if (userError.message.includes("already been registered")) {
      return NextResponse.json(
        { error: "This email is already registered. Try logging in instead." },
        { status: 409 }
      );
    }
    console.error("Failed to create demo user:", userError);
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  const userId = userData.user.id;

  // 2. Seed demo studio with game projects via RPC
  const { data: studioId, error: seedError } = await supabase.rpc(
    "seed_demo_studio",
    { p_user_id: userId }
  );

  if (seedError) {
    console.error("Failed to seed demo studio:", seedError);
    return NextResponse.json({ error: seedError.message }, { status: 400 });
  }

  // 3. Insert lead record
  await supabase.from("leads").insert({
    email,
    name: name.trim(),
    source: "demo_signup",
  });

  return NextResponse.json(
    { studioId, email },
    { status: 201 }
  );
}
