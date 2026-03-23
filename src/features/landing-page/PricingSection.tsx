import { AnimateOnScroll } from "./AnimateOnScroll";

const tiers = [
  {
    name: "FREE",
    price: "$0",
    period: "/mo",
    description: "Get started building games for free.",
    features: [
      "5 games per month",
      "Chat with MAX",
      "Live game preview",
      "Community gallery access",
      "Basic game templates",
    ],
    cta: "START FREE",
    featured: false,
  },
  {
    name: "PRO",
    price: "$29",
    period: "/mo",
    description: "Unlimited creation for serious builders.",
    features: [
      "Unlimited games",
      "Priority MAX responses",
      "Export game code",
      "Custom thumbnails",
      "Advanced game features",
      "Priority support",
      "No watermark",
    ],
    cta: "GO PRO",
    featured: true,
  },
  {
    name: "STUDIO",
    price: "Custom",
    period: "",
    description: "For teams and educational institutions.",
    features: [
      "Everything in Pro",
      "API access",
      "Team collaboration",
      "Custom AI training",
      "Dedicated support",
      "White-label option",
    ],
    cta: "CONTACT US",
    featured: false,
  },
];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      className="text-primary-light shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="bg-surface-dark py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            PRICING
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            CHOOSE YOUR LOADOUT
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready to go unlimited.
          </p>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-start">
          {tiers.map((tier, i) => (
            <AnimateOnScroll key={tier.name} delay={i * 0.15}>
              <div
                className={`bg-surface rounded-lg border p-4 sm:p-6 md:p-8 relative flex flex-col h-full ${
                  tier.featured
                    ? "border-primary-light/30 glow-green md:-my-4 md:py-12"
                    : "border-neutral-700"
                }`}
              >
                {/* Most Popular badge */}
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-md whitespace-nowrap uppercase tracking-wider glow-green">
                    MOST POPULAR
                  </div>
                )}

                {/* Tier name */}
                <h3 className="text-lg font-heading text-secondary mb-2 uppercase">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-heading text-neutral-100 uppercase">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-lg text-neutral-500 font-normal">
                      {tier.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-400 mb-6">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-neutral-300"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/try-it-now"
                  className={`w-full rounded-md px-6 py-3 text-sm font-bold text-center transition-all duration-200 min-h-[44px] flex items-center justify-center uppercase tracking-wider ${
                    tier.featured
                      ? "bg-primary hover:bg-primary-light text-white glow-green glow-green-hover"
                      : "border border-neutral-600 text-neutral-300 hover:border-primary-light hover:text-primary-light"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
