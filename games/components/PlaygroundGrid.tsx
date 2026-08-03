"use client";

import type { GameDefMeta } from "@/games/types";
import GameCard from "./GameCard";

/** 游乐场卡片网格。 */
export default function PlaygroundGrid({ games }: { games: GameDefMeta[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((g) => (
        <GameCard key={g.slug} game={g} />
      ))}
    </div>
  );
}
