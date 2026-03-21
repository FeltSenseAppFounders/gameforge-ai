import { AnimateOnScroll } from "./AnimateOnScroll";

const steps = [
  {
    number: 1,
    title: "DESCRIBE YOUR GAME",
    description:
      "Tell MAX what you want. \"Make me a space shooter\" or \"Create a platformer with double jump\" — anything goes.",
  },
  {
    number: 2,
    title: "MAX BUILDS IT",
    description:
      "MAX generates real Phaser.js code in seconds. Your game appears instantly in the live preview — fully playable.",
  },
  {
    number: 3,
    title: "PLAY & SHARE",
    description:
      "Test your game, iterate with MAX, then publish to the community gallery. Other creators can play and like your games.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            THREE STEPS TO YOUR GAME
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            No code. No downloads. Just describe, build, and play.
          </p>
        </AnimateOnScroll>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-primary-light/30" />

          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15} className="text-center">
              {/* Number */}
              <div className="w-12 h-12 rounded-md bg-primary text-white text-lg font-heading flex items-center justify-center mx-auto mb-6 relative z-10 glow-green">
                {step.number}
              </div>
              {/* Title */}
              <h3 className="text-xl font-heading text-primary-light mb-3 uppercase">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-base text-neutral-400 max-w-xs mx-auto">
                {step.description}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
