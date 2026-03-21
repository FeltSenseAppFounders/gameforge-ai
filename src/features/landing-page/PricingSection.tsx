import { AnimateOnScroll } from "./AnimateOnScroll";

const tiers = [
  {
    name: "Starter",
    price: "$299",
    period: "/mo",
    description: "For solo practices getting started with AI.",
    features: [
      "500 calls/month",
      "Basic PMS sync",
      "Call transcripts & logs",
      "Email support",
      "1 phone line",
    ],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Growth",
    price: "$599",
    period: "/mo",
    description: "For growing practices that want it all.",
    features: [
      "Unlimited calls",
      "Full PMS integration",
      "Insurance verification",
      "Payment collection",
      "Priority support",
      "Outbound campaigns",
      "3 phone lines",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For multi-location dental groups.",
    features: [
      "Everything in Growth",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Unlimited phone lines",
      "Custom AI training",
    ],
    cta: "Contact Sales",
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
      className="text-secondary shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="bg-neutral-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-800 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            No hidden fees. Cancel anytime. 14-day free trial on all plans.
          </p>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-start">
          {tiers.map((tier, i) => (
            <AnimateOnScroll key={tier.name} delay={i * 0.15}>
              <div
                className={`bg-white rounded-lg border p-8 relative flex flex-col h-full ${
                  tier.featured
                    ? "shadow-lg border-primary/30 ring-2 ring-primary/20 md:scale-105"
                    : "shadow-sm border-neutral-200"
                }`}
              >
                {/* Most Popular badge */}
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                {/* Tier name */}
                <h3 className="text-lg font-semibold font-heading text-neutral-800 mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold font-heading text-neutral-900">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-lg text-neutral-400 font-normal">
                      {tier.period}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-500 mb-6">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-neutral-600"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#book-demo"
                  className={`w-full rounded-md px-6 py-3 text-sm font-semibold text-center transition-all duration-200 min-h-[44px] flex items-center justify-center ${
                    tier.featured
                      ? "bg-gradient-to-br from-primary to-accent text-white shadow-md hover:shadow-lg hover:brightness-110"
                      : "border border-primary text-primary hover:bg-primary/5"
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
