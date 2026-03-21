export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-surface-dark flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 pb-24 overflow-hidden">
      {/* Neon green radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[600px] bg-primary-light/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-heading leading-tight text-neutral-100 uppercase">
          CREATE{" "}
          <span className="text-primary-light neon-text">REAL GAMES</span>{" "}
          WITH AI
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mt-6">
          Describe your game to MAX. Watch it come to life in your browser
          &mdash; playable in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <a
            href="/try-it-now"
            className="group bg-primary hover:bg-primary-light text-white rounded-md px-10 py-4 text-lg font-bold uppercase tracking-wider glow-green glow-green-hover animate-pulse-neon transition-all duration-300 min-h-[52px] flex items-center justify-center gap-3"
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
          <a
            href="#features"
            className="border border-secondary text-secondary hover:bg-secondary/10 rounded-md px-10 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 min-h-[52px] flex items-center justify-center gap-3"
          >
            SEE EXAMPLES
          </a>
        </div>

        {/* Product mockup — split screen: chat on left + game preview on right */}
        <div className="mt-16 max-w-5xl mx-auto rounded-lg border border-primary-light/20 bg-surface/50 shadow-xl overflow-hidden p-2 glow-green">
          <div className="bg-surface rounded-md aspect-video flex">
            {/* Left side: Chat panel mockup */}
            <div className="w-2/5 border-r border-neutral-700 p-4 md:p-6 flex flex-col gap-3">
              {/* Chat header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse" />
                <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">MAX ONLINE</span>
              </div>
              {/* MAX message */}
              <div className="bg-surface-light rounded-md p-3 border-l-2 border-primary-light">
                <p className="text-xs text-neutral-300 leading-relaxed">Yo! I&apos;m MAX. Tell me what kind of game you want to build!</p>
              </div>
              {/* User message */}
              <div className="bg-secondary/10 rounded-md p-3 ml-auto max-w-[85%]">
                <p className="text-xs text-secondary leading-relaxed">Make me a space shooter with power-ups</p>
              </div>
              {/* MAX response */}
              <div className="bg-surface-light rounded-md p-3 border-l-2 border-primary-light">
                <p className="text-xs text-neutral-300 leading-relaxed">Building your space shooter now...</p>
              </div>
              {/* Input bar */}
              <div className="mt-auto">
                <div className="bg-surface-dark rounded-md border border-neutral-600 px-3 py-2 flex items-center gap-2">
                  <div className="h-2 w-24 bg-neutral-600 rounded-full" />
                  <div className="ml-auto w-6 h-6 rounded-md bg-primary/40 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary-light">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side: Game preview mockup */}
            <div className="w-3/5 p-4 md:p-6 flex flex-col">
              {/* Controls bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-16 bg-primary-light/20 rounded-sm" />
                <div className="ml-auto flex gap-1">
                  <div className="w-5 h-5 rounded-sm bg-surface-light border border-neutral-600" />
                  <div className="w-5 h-5 rounded-sm bg-surface-light border border-neutral-600" />
                  <div className="w-5 h-5 rounded-sm bg-primary/30 border border-primary-light/30" />
                </div>
              </div>
              {/* Game canvas mockup */}
              <div className="flex-1 bg-surface-dark rounded-md border border-neutral-700 flex items-center justify-center relative overflow-hidden">
                {/* Stars background */}
                <div className="absolute inset-0">
                  {[
                    { top: "10%", left: "15%", size: "1px" },
                    { top: "25%", left: "45%", size: "2px" },
                    { top: "40%", left: "75%", size: "1px" },
                    { top: "60%", left: "30%", size: "1px" },
                    { top: "75%", left: "60%", size: "2px" },
                    { top: "85%", left: "20%", size: "1px" },
                    { top: "15%", left: "85%", size: "1px" },
                    { top: "50%", left: "50%", size: "2px" },
                  ].map((star, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-neutral-500"
                      style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                    />
                  ))}
                </div>
                {/* Ship (triangle) */}
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
                  <svg width="24" height="28" viewBox="0 0 24 28" className="text-primary-light">
                    <polygon points="12,0 0,28 24,28" fill="currentColor" />
                  </svg>
                </div>
                {/* Enemy dots */}
                <div className="absolute top-[15%] left-[30%] w-4 h-4 rounded-sm bg-error/80" />
                <div className="absolute top-[20%] left-[60%] w-4 h-4 rounded-sm bg-error/80" />
                <div className="absolute top-[10%] left-[75%] w-4 h-4 rounded-sm bg-error/60" />
                {/* Score HUD */}
                <div className="absolute top-2 left-3">
                  <span className="text-[10px] font-heading text-primary-light uppercase">SCORE: 2,450</span>
                </div>
                <div className="absolute top-2 right-3">
                  <span className="text-[10px] font-heading text-secondary uppercase">LIVES: 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
