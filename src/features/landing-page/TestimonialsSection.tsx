import { AnimateOnScroll } from "./AnimateOnScroll";

const testimonials = [
  {
    quote:
      "We went from missing 30% of calls to zero. FeltSense Clinic paid for itself in the first week.",
    name: "Dr. Sarah Mitchell, DDS",
    title: "Owner, Bright Smiles Dental",
    initials: "SM",
  },
  {
    quote:
      "The insurance verification alone saves my front desk 15 hours a week. My staff actually enjoys coming to work now.",
    name: "Dr. James Rodriguez",
    title: "Partner, Summit Dental Group",
    initials: "JR",
  },
  {
    quote:
      "Setup took 20 minutes. The next morning, AI was answering calls like it had worked here for years.",
    name: "Dr. Amanda Chen, DDS",
    title: "Owner, Pacific Dental Care",
    initials: "AC",
  },
];

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-800 mb-4">
            Loved by Dental Practices
          </h2>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} delay={i * 0.15}>
              <article className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="text-base text-neutral-600 leading-relaxed italic mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* Attribution */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {t.name}
                    </p>
                    <p className="text-xs text-neutral-500">{t.title}</p>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
