import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * POST /api/demo/create
 *
 * Creates a demo clinic with seeded data for instant onboarding.
 * Uses Supabase service role (admin) to create user without email verification.
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
  const { name, email, clinicName, timezone } = body as {
    name: string;
    email: string;
    clinicName?: string;
    timezone?: string;
  };

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Create user with email_confirm: true (no verification email)
  const demoPassword = crypto.randomUUID();
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { full_name: name, is_demo: true },
    });

  if (userError) {
    // If user already exists, try to find them
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
  const resolvedClinicName =
    clinicName?.trim() || `${name.split(" ")[0]}'s Dental Practice`;

  // 2. Create demo clinic
  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .insert({
      name: resolvedClinicName,
      owner_id: userId,
      subscription_tier: "demo",
      timezone: timezone || "America/New_York",
    })
    .select("id")
    .single();

  if (clinicError) {
    console.error("Failed to create demo clinic:", clinicError);
    return NextResponse.json({ error: clinicError.message }, { status: 400 });
  }

  // 3. Create clinic_member (owner role)
  const { error: memberError } = await supabase
    .from("clinic_members")
    .insert({
      clinic_id: clinic.id,
      user_id: userId,
      role: "owner",
    });

  if (memberError) {
    console.error("Failed to create clinic member:", memberError);
    return NextResponse.json({ error: memberError.message }, { status: 400 });
  }

  // 4. Seed demo data (providers, patients, appointments, calls)
  const { error: seedError } = await supabase.rpc("seed_demo_clinic", {
    _clinic_id: clinic.id,
    _owner_id: userId,
  });

  if (seedError) {
    console.error("Failed to seed demo clinic:", seedError);
    return NextResponse.json({ error: seedError.message }, { status: 400 });
  }

  // 5. Insert lead record
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

  await supabase.from("leads").insert({
    clinic_id: clinic.id,
    first_name: firstName,
    last_name: lastName,
    phone: "not-provided",
    email,
    source: "demo_signup",
    status: "new",
  });

  // 6. Generate session for immediate sign-in
  const { data: sessionData, error: sessionError } =
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

  if (sessionError) {
    console.error("Failed to generate session link:", sessionError);
    // Return credentials as fallback so the client can sign in
    return NextResponse.json(
      {
        clinicId: clinic.id,
        email,
        password: demoPassword,
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    {
      clinicId: clinic.id,
      email,
      password: demoPassword,
      // The client will use email + password to sign in directly
    },
    { status: 201 }
  );
}
