import { AnimateOnScroll } from "./AnimateOnScroll";

const testimonials = [
  {
    quote:
      "I described a racing game and had something playable in 10 seconds. Then I said 'add nitro boost' and it just worked. This is insane.",
    name: "Alex Rivera",
    title: "Indie Game Creator",
    initials: "AR",
  },
  {
    quote:
      "I used GameForge to prototype 5 game ideas in an afternoon. What would have taken me weeks of coding happened in hours.",
    name: "Sarah Kim",
    title: "Game Design Student",
    initials: "SK",
  },
  {
    quote:
      "My kids and I spend weekends building games together now. They describe what they want and MAX makes it real. Pure magic.",
    name: "Marcus Thompson",
    title: "Parent & Hobbyist",
    initials: "MT",
  },
];

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FED985">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            CREATORS LOVE GAMEFORGE
          </h2>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((t, i) => (
            <AnimateOnScroll key={t.name} delay={i * 0.15}>
              <article className="bg-surface-dark rounded-lg border border-neutral-700 p-4 sm:p-6 md:p-8 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="text-base text-neutral-300 leading-relaxed italic mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* Attribution */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">
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
