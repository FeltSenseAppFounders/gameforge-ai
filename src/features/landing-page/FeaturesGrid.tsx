import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  {
    title: "INSTANT GAME CREATION",
    description:
      "Describe any 2D game. MAX generates playable Phaser.js code in seconds. Space shooters, platformers, puzzles — you name it.",
    color: "accent" as const,
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "ITERATE IN REAL-TIME",
    description:
      "Add enemies, power-ups, levels — just tell MAX. See changes instantly in the live preview. No coding required.",
    color: "accent-blue" as const,
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "SHARE & PLAY",
    description:
      "Publish to the community gallery. Play games built by other creators. Like, share, and get inspired.",
    color: "accent-purple" as const,
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const colorMap = {
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/20",
    text: "text-accent",
    iconBg: "bg-accent",
    glow: "glow-orange",
  },
  "accent-blue": {
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/20",
    text: "text-accent-blue",
    iconBg: "bg-accent-blue",
    glow: "glow-blue",
  },
  "accent-purple": {
    bg: "bg-accent-purple/10",
    border: "border-accent-purple/20",
    text: "text-accent-purple",
    iconBg: "bg-accent-purple",
    glow: "glow-purple",
  },
};

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-surface-dark py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            FEATURES
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            BUILD ANY GAME YOU CAN IMAGINE
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            From concept to playable game in seconds. MAX handles the code &mdash; you bring the ideas.
          </p>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <AnimateOnScroll key={feature.title} delay={i * 0.15}>
                <div className={`bg-surface border border-neutral-700 rounded-lg p-8 hover:${colors.border} transition-all duration-200 group hover:-translate-y-1 h-full`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-md ${colors.iconBg} flex items-center justify-center mb-6 text-white`}>
                    {feature.icon}
                  </div>
                  {/* Title */}
                  <h3 className={`text-xl font-heading ${colors.text} mb-3 uppercase`}>
                    {feature.title}
                  </h3>
                  {/* Description */}
                  <p className="text-base text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
