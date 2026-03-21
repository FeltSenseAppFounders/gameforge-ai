import type { GameProject } from "@/core/types";
import { GameCard } from "./GameCard";

export function GamesGrid({ games }: { games: GameProject[] }) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          width="48"
          height="48"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          className="text-neutral-700 mb-4"
        >
          <line x1="6" y1="11" x2="10" y2="11" />
          <line x1="8" y1="9" x2="8" y2="13" />
          <line x1="15" y1="12" x2="15.01" y2="12" />
          <line x1="18" y1="10" x2="18.01" y2="10" />
          <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
        </svg>
        <h3 className="text-lg font-heading text-neutral-500 uppercase mb-2">
          NO GAMES YET
        </h3>
        <p className="text-sm text-neutral-600 max-w-xs">
          Head to Create Game and tell MAX what to build. Your games will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
