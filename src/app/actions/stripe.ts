"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe";
import { CREDIT_PACKS } from "@/features/credits/constants";

export async function createCheckoutSession(packId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    throw new Error("Invalid pack");
  }

  const { data: studio } = await supabase
    .from("studios")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (!studio) {
    throw new Error("No studio found");
  }

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    payment_method_types: ["card"],
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pack.priceCents,
          product_data: {
            name: `${pack.credits} PlayFoundry Credits`,
            description: `${pack.credits} AI generation credits for PlayFoundry AI`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      pack_id: pack.id,
      studio_id: studio.id,
      credits_amount: String(pack.credits),
    },
    payment_intent_data: {
      metadata: {
        pack_id: pack.id,
        studio_id: studio.id,
        credits_amount: String(pack.credits),
      },
    },
    customer_email: user.email,
  });

  // Record purchase for idempotency
  const serviceClient = createServiceClient();
  await serviceClient.from("credit_purchases").insert({
    studio_id: studio.id,
    stripe_checkout_session_id: session.id,
    credits_amount: pack.credits,
    price_cents: pack.priceCents,
    status: "pending",
  });

  return session.client_secret;
}
