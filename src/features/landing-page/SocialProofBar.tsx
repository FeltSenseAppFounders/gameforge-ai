export function SocialProofBar() {
  return (
    <section className="bg-surface py-10 px-4 sm:px-6 lg:px-8 border-y border-neutral-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
          {[
            { label: "AI-POWERED CREATION" },
            { label: "REAL-TIME PREVIEW" },
            { label: "INSTANT SHARING" },
          ].map((signal, i) => (
            <div key={signal.label} className="flex items-center">
              {i > 0 && (
                <div className="hidden sm:block border-l border-neutral-600 h-8 mx-8" />
              )}
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                {signal.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
