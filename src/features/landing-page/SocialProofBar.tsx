const trustSignals = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-orange-500">
        <rect width="24" height="24" rx="4" fill="currentColor" />
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="sans-serif">Y</text>
      </svg>
    ),
    text: "Y Combinator W26",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-success">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "$1M Pre-Seed Raised",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    text: "50+ Dental Practices",
  },
];

export function SocialProofBar() {
  return (
    <section className="bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Trust signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
          {trustSignals.map((signal, i) => (
            <div key={signal.text} className="flex items-center">
              {i > 0 && (
                <div className="hidden sm:block border-l border-neutral-200 h-5 mx-6" />
              )}
              <div className="flex items-center gap-2">
                {signal.icon}
                <span className="text-sm font-semibold text-neutral-600">
                  {signal.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Logo row */}
        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-4 text-center">
            Trusted by leading dental practices
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 opacity-40">
            {["Bright Smiles Dental", "Summit Dental Group", "Valley Dental Care", "Pacific Dental", "Lakewood Dental"].map((name) => (
              <div
                key={name}
                className="hidden sm:flex items-center gap-1.5 text-neutral-400"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs font-semibold whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
