"use client";

import { AnimatedCounter } from "./AnimatedCounter";
import { AnimateOnScroll } from "./AnimateOnScroll";

const stats = [
  { target: 1000, suffix: "+", label: "Games Created" },
  { target: 5000, suffix: "+", label: "Creators" },
  { target: 98, suffix: "%", label: "Playable on First Try" },
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
            NUMBERS DON&apos;T LIE
          </h2>
        </AnimateOnScroll>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16">
          {stats.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 0.15}>
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-heading text-primary-light neon-text uppercase">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <p className="text-base text-neutral-400 mt-2 uppercase tracking-wider font-semibold text-sm">
                  {stat.label}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
