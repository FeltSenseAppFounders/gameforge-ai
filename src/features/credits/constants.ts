export const CREDIT_PACKS = [
  {
    id: "pack_10",
    credits: 10,
    priceCents: 499,
    label: "10 CREDITS",
    description: "Get started",
    popular: false,
  },
  {
    id: "pack_50",
    credits: 50,
    priceCents: 1999,
    label: "50 CREDITS",
    description: "Most popular",
    popular: true,
  },
  {
    id: "pack_200",
    credits: 200,
    priceCents: 5999,
    label: "200 CREDITS",
    description: "Best value",
    popular: false,
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];
