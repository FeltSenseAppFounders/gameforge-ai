export function SocialProofBar() {
  return (
    <section className="bg-surface py-10 px-4 sm:px-6 lg:px-8 border-y border-neutral-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
          {[
            { value: "1,000+", label: "GAMES CREATED" },
            { value: "5,000+", label: "CREATORS" },
            { value: "98%", label: "PLAYABLE ON FIRST TRY" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div className="hidden sm:block border-l border-neutral-600 h-8 mx-8" />
              )}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-heading text-primary-light uppercase neon-text">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
