import { AnimateOnScroll } from "./AnimateOnScroll";

const steps = [
  {
    number: 1,
    title: "Connect Your PMS",
    description:
      "Link Dentrix, OpenDental, or Eaglesoft. We sync your calendar, patient records, and insurance data.",
  },
  {
    number: 2,
    title: "AI Handles Calls",
    description:
      "Every inbound call is answered instantly. Appointments booked, insurance verified, payments collected.",
  },
  {
    number: 3,
    title: "Revenue Grows",
    description:
      "Recover $50K+/year in missed revenue. Zero missed calls, zero manual work.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-800 mb-4">
            Up and Running in 24 Hours
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Three simple steps to transform your front desk.
          </p>
        </AnimateOnScroll>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-primary via-accent to-secondary" />

          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15} className="text-center">
              {/* Number circle */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white text-lg font-bold font-heading flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md">
                {step.number}
              </div>
              {/* Title */}
              <h3 className="text-xl font-semibold font-heading text-neutral-800 mb-3">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-base text-neutral-500 max-w-xs mx-auto">
                {step.description}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
