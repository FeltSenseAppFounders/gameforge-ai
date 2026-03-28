"use client";

import { useState, useCallback, useEffect } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CREDIT_PACKS } from "./constants";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useCredits } from "./CreditsProvider";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CreditsPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  initialPackId?: string | null;
}

export function CreditsPurchaseModal({
  open,
  onClose,
  initialPackId,
}: CreditsPurchaseModalProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const { refetch } = useCredits();

  useEffect(() => {
    if (initialPackId && open) {
      setSelectedPack(initialPackId);
    }
  }, [initialPackId, open]);

  const fetchClientSecret = useCallback(async () => {
    if (!selectedPack) throw new Error("No pack selected");
    const secret = await createCheckoutSession(selectedPack);
    if (!secret) throw new Error("Failed to create checkout session");
    return secret;
  }, [selectedPack]);

  function handleClose() {
    setSelectedPack(null);
    onClose();
  }

  function handleComplete() {
    refetch();
    setSelectedPack(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-surface border border-primary/30 rounded-lg max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {!selectedPack ? (
          <>
            {/* Pack selection */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading text-primary-light uppercase">
                GET CREDITS
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                1 credit per new game &middot; 2 credits per iteration
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className={`relative flex flex-col items-center p-4 rounded-lg border transition-colors ${
                    pack.popular
                      ? "border-primary/50 bg-primary/5"
                      : "border-neutral-700 bg-surface-light"
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2.5 px-2 py-0.5 bg-primary text-white text-[10px] font-bold uppercase rounded">
                      POPULAR
                    </span>
                  )}
                  <span className="text-2xl font-heading text-neutral-100 mt-1">
                    {pack.credits}
                  </span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    CREDITS
                  </span>
                  <span className="text-lg font-bold text-secondary mt-2">
                    ${(pack.priceCents / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => setSelectedPack(pack.id)}
                    className={`mt-3 w-full py-2 rounded text-xs font-bold uppercase transition-colors ${
                      pack.popular
                        ? "bg-primary text-white hover:bg-primary-light glow-green"
                        : "bg-surface border border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    BUY NOW
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-600 text-center mt-4">
              Secure payment via Stripe. Credits never expire.
            </p>
          </>
        ) : (
          <>
            {/* Embedded checkout */}
            <button
              onClick={() => setSelectedPack(null)}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 mb-4 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 12H5m7-7l-7 7 7 7"
                />
              </svg>
              BACK
            </button>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                fetchClientSecret,
                onComplete: handleComplete,
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </>
        )}
      </div>
    </div>
  );
}
