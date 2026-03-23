import { AnimateOnScroll } from "./AnimateOnScroll";

const benefits = [
  {
    heading: "Instant Creation",
    description:
      "Describe your game in plain language and play it in your browser within seconds. No setup, no boilerplate.",
  },
  {
    heading: "Real-Time Iteration",
    description:
      "Ask MAX to add features, change mechanics, or tweak difficulty. Your game updates live as you chat.",
  },
  {
    heading: "One-Click Publishing",
    description:
      "Share your creation with the community instantly. Get a playable link anyone can open.",
  },
];

export function StatsSection() {
  return (
    <section className="bg-surface-dark py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-y border-neutral-700">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section header */}
        <AnimateOnScroll>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary mb-3">
            IMPACT
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            BUILT FOR SPEED
          </h2>
        </AnimateOnScroll>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16">
          {benefits.map((b, i) => (
            <AnimateOnScroll key={b.heading} delay={i * 0.15}>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl md:text-3xl font-heading text-primary-light uppercase">
                  {b.heading}
                </h3>
                <p className="text-base text-neutral-400 mt-2 max-w-xs">
                  {b.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
