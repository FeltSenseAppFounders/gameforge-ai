"use client";

import { AnimatedCounter } from "./AnimatedCounter";
import { AnimateOnScroll } from "./AnimateOnScroll";

const stats = [
  { target: 10000, suffix: "+", label: "Calls Handled" },
  { target: 2.4, prefix: "$", suffix: "M", label: "Revenue Recovered", isCurrency: true },
  { target: 35, suffix: "", label: "Hours Saved / Week" },
];

export function StatsSection() {
  return (
    <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section header */}
        <AnimateOnScroll>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-3">
            Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Numbers That Speak For Themselves
          </h2>
        </AnimateOnScroll>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16">
          {stats.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 0.15}>
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-bold font-heading text-gradient-ai">
                  {stat.isCurrency ? (
                    <span>
                      {stat.prefix}
                      <AnimatedCounter
                        target={24}
                        suffix=""
                        duration={2000}
                      />
                      .
                      <AnimatedCounter
                        target={4}
                        suffix=""
                        duration={2000}
                      />
                      {stat.suffix}
                    </span>
                  ) : (
                    <AnimatedCounter
                      target={stat.target}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  )}
                </div>
                <p className="text-base text-neutral-400 mt-2">{stat.label}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
