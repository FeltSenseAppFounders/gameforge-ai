import { AnimateOnScroll } from "./AnimateOnScroll";

export function FooterCta() {
  return (
    <section className="bg-surface-dark py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-neutral-700">
      <AnimateOnScroll className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
          READY TO CREATE YOUR GAME?
        </h2>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          Join thousands of creators building real games with AI. No code required.
        </p>
        <a
          href="/try-it-now"
          className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-light text-white rounded-md px-10 py-4 text-lg font-bold uppercase tracking-wider glow-green glow-green-hover animate-pulse-neon transition-all duration-300 min-h-[52px]"
        >
          {/* Gamepad icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
            <line x1="6" y1="11" x2="10" y2="11" />
            <line x1="8" y1="9" x2="8" y2="13" />
            <line x1="15" y1="12" x2="15.01" y2="12" />
            <line x1="18" y1="10" x2="18.01" y2="10" />
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
          </svg>
          START CREATING
        </a>
        <p className="text-sm text-neutral-500 mt-6">
          Free to start. No credit card required.
        </p>
      </AnimateOnScroll>
    </section>
  );
}
