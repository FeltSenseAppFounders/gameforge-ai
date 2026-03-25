export const CREDIT_PACKS = [
  {
    id: "starter",
    credits: 50,
    priceCents: 1299,
    label: "STARTER",
    description: "50 credits",
    popular: false,
  },
  {
    id: "pro",
    credits: 150,
    priceCents: 2999,
    label: "PRO",
    description: "150 credits",
    popular: true,
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];
