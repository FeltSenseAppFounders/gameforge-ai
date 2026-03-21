import { AnimateOnScroll } from "./AnimateOnScroll";

export function FooterCta() {
  return (
    <section
      id="book-demo"
      className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      <AnimateOnScroll className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
          Ready to Stop Losing Revenue?
        </h2>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          Join 50+ dental practices recovering revenue with AI. Get started in
          24 hours.
        </p>
        <a
          href="/try-it-now"
          className="group inline-flex items-center justify-center gap-3 bg-[linear-gradient(110deg,#4F46E5,#818CF8,#06B6D4,#4F46E5)] bg-[length:200%_auto] text-white rounded-full px-10 py-4 text-lg font-bold tracking-wide shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out min-h-[52px] cta-glow cta-shimmer cta-pulse"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          Try it Live
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <p className="text-sm text-neutral-500 mt-6">
          No credit card required. Live in 24 hours.
        </p>
      </AnimateOnScroll>
    </section>
  );
}
