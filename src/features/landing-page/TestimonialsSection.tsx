import { AnimateOnScroll } from "./AnimateOnScroll";

const useCases = [
  {
    heading: "Describe a racing game and play it in seconds",
    description:
      "Tell MAX what you want — a platformer, a shooter, a puzzle game. Watch it appear in your browser, fully playable, in moments.",
  },
  {
    heading: "Prototype 5 ideas in an afternoon",
    description:
      "No more weeks of setup and boilerplate. Iterate on game concepts at the speed of thought and find the fun faster.",
  },
  {
    heading: "Build games with your kids — no coding needed",
    description:
      "Describe what you want in plain language. MAX handles the code so anyone can create, regardless of technical background.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            USE CASES
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            WHAT CREATORS ARE BUILDING
          </h2>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {useCases.map((uc, i) => (
            <AnimateOnScroll key={uc.heading} delay={i * 0.15}>
              <article className="bg-surface-dark rounded-lg border border-neutral-700 p-4 sm:p-6 md:p-8 h-full flex flex-col">
                <h3 className="text-lg font-semibold text-neutral-200 mb-3">
                  {uc.heading}
                </h3>
                <p className="text-base text-neutral-400 leading-relaxed flex-1">
                  {uc.description}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
