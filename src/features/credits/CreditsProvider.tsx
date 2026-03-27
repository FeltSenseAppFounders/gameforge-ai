"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { CreditsPurchaseModal } from "./CreditsPurchaseModal";

interface CreditsContextValue {
  balance: number;
  isLoading: boolean;
  hasCredits: boolean;
  isPaidUser: boolean;
  refetch: () => Promise<void>;
  openPurchaseModal: () => void;
}

const CreditsContext = createContext<CreditsContextValue>({
  balance: 0,
  isLoading: true,
  hasCredits: false,
  isPaidUser: false,
  refetch: async () => {},
  openPurchaseModal: () => {},
});

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchBalance = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: studio } = await supabase
        .from("studios")
        .select("id, credits")
        .eq("owner_id", user.id)
        .limit(1)
        .single();

      if (studio) {
        setBalance(studio.credits);

        // Check if user has ever purchased credits
        const { count } = await supabase
          .from("credit_purchases")
          .select("id", { count: "exact", head: true })
          .eq("studio_id", studio.id)
          .eq("status", "completed");

        setIsPaidUser((count ?? 0) > 0);
      }
    } catch (err) {
      console.error("Failed to fetch credit balance:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Re-fetch when user returns from Stripe checkout
  useEffect(() => {
    function handleFocus() {
      fetchBalance();
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchBalance]);

  return (
    <CreditsContext.Provider
      value={{
        balance,
        isLoading,
        hasCredits: balance > 0,
        isPaidUser,
        refetch: fetchBalance,
        openPurchaseModal: () => setShowModal(true),
      }}
    >
      {children}
      <CreditsPurchaseModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditsContext);
}
