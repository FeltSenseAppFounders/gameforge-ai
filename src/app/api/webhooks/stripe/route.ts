import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const studioId = session.metadata?.studio_id;
    const creditsAmount = Number(session.metadata?.credits_amount);

    if (!studioId || !creditsAmount) {
      console.error("Missing metadata in checkout session:", session.id);
      return new Response("Missing metadata", { status: 400 });
    }

    const supabase = createServiceClient();

    // Idempotency: check if this session was already fulfilled
    const { data: existing } = await supabase
      .from("credit_purchases")
      .select("status")
      .eq("stripe_checkout_session_id", session.id)
      .single();

    if (existing?.status === "completed") {
      return new Response("Already fulfilled", { status: 200 });
    }

    // Add credits atomically via RPC (race-condition safe)
    const { error: updateError } = await supabase.rpc("add_credits", {
      studio_id: studioId,
      amount: creditsAmount,
    });

    if (updateError) {
      console.error("Credit fulfillment failed:", updateError);
      return new Response("Fulfillment failed", { status: 500 });
    }

    // Mark purchase as completed
    await supabase
      .from("credit_purchases")
      .update({ status: "completed" })
      .eq("stripe_checkout_session_id", session.id);
  }

  return new Response("OK", { status: 200 });
}
