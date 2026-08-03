"use client";

import Link from "next/link";
import type { GameDefMeta } from "@/games/types";

/** 游乐场卡片：点击进入 /playground/[slug]。 */
export default function GameCard({ game }: { game: GameDefMeta }) {
  return (
    <Link
      href={`/playground/${game.slug}`}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE] text-2xl">
        {game.emoji}
      </div>
      <h3 className="font-medium text-[#04342C]">{game.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-[#5F5E5A]">{game.description}</p>
      <span className="mt-3 inline-block w-fit rounded-full bg-[#FAEEDA] px-2.5 py-0.5 text-xs font-medium text-[#412402]">
        {game.category} · {game.ageGroup}
      </span>
    </Link>
  );
}
