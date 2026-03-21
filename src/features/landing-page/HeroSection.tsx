export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-24 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* YC Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-neutral-300 backdrop-blur-sm mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-orange-400">
            <rect width="24" height="24" rx="4" fill="currentColor" />
            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="sans-serif">Y</text>
          </svg>
          <span className="font-semibold">Y Combinator W26</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight text-white">
          AI-Powered Reception,{" "}
          <span className="text-gradient-ai">Always On</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mt-6">
          Never miss another patient call. FeltSense Clinic picks up every ring,
          schedules visits, confirms coverage, and processes payments &mdash; all
          on autopilot.
        </p>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <a
            href="/try-it-now"
            className="group relative bg-[linear-gradient(110deg,#4F46E5,#818CF8,#06B6D4,#4F46E5)] bg-[length:200%_auto] text-white rounded-full px-10 py-4 text-lg font-bold tracking-wide shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-out min-h-[52px] flex items-center justify-center gap-3 cta-glow cta-shimmer cta-pulse"
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
        </div>

        {/* Product mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden p-2 glow-primary">
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-md aspect-video flex items-center justify-center">
            {/* Mockup dashboard preview */}
            <div className="w-full h-full p-6 md:p-8 flex flex-col gap-4">
              {/* Fake top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="h-4 w-48 bg-white/10 rounded-full" />
                <div className="w-8" />
              </div>
              {/* Fake content */}
              <div className="flex-1 grid grid-cols-4 gap-3">
                {/* Sidebar */}
                <div className="hidden md:flex col-span-1 bg-white/5 rounded-md p-3 flex-col gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 rounded-full ${
                        i === 0 ? "bg-primary/40 w-full" : "bg-white/10 w-3/4"
                      }`}
                    />
                  ))}
                </div>
                {/* Main content */}
                <div className="col-span-4 md:col-span-3 flex flex-col gap-3">
                  {/* KPI row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white/5 rounded-md p-3">
                        <div className="h-2 w-12 bg-white/10 rounded-full mb-2" />
                        <div className="h-4 w-8 bg-primary/30 rounded-full" />
                      </div>
                    ))}
                  </div>
                  {/* Chart area */}
                  <div className="flex-1 bg-white/5 rounded-md p-3 flex items-end gap-1">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 85, 75, 95, 50].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/40 to-accent/20 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-50" />
    </section>
  );
}
