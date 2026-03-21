import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  {
    title: "Voice AI Agent",
    description:
      "Answers calls in natural conversation. Books appointments, answers FAQs, handles emergencies with instant human handoff.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: "PMS Integration",
    description:
      "Real-time two-way sync with Dentrix, OpenDental, and Eaglesoft. No double-booking, no manual entry.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Insurance & Payments",
    description:
      "Instant insurance verification and PCI-compliant payment collection. Revenue recovery on autopilot.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-800 mb-4">
            Everything Your Front Desk Does. Faster.
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            From the first ring to payment collection, FeltSense Clinic handles
            every step.
          </p>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, i) => (
            <AnimateOnScroll key={feature.title} delay={i * 0.15}>
              <div className="bg-white border border-neutral-200/50 rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200 group hover:-translate-y-1 h-full">
                {/* Icon */}
                <div className="w-12 h-12 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                {/* Title */}
                <h3 className="text-xl font-semibold font-heading text-neutral-800 mb-3">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-base text-neutral-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
