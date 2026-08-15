"use client";

import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import GameShell from "./GameShell";
import { getGameMeta } from "@/games/registry";
import Game2048 from "@/games/entries/game2048";
import BeatTap from "@/games/entries/beat-tap";
import PlanetRace from "@/games/entries/planet-race";
import StarPiano from "@/games/entries/star-piano";
import StarCatch from "@/games/entries/star-catch";
import Breakout from "@/games/entries/breakout";
import SnakeSpace from "@/games/entries/snake-space";
import MemoryCards from "@/games/entries/memory-cards";
import NumberMatch from "@/games/entries/number-match";
import BeatMemory from "@/games/entries/beat-memory";
import GravityBounce from "@/games/entries/gravity-bounce";
import Billiard from "@/games/entries/billiard";

// slug -> 游戏组件 映射（客户端）。
// 新增游戏时：① 建 entries/<slug>/{index.tsx,logic.ts,meta.ts} ② 在 registry.ts 加 meta
// ③ 在此处 import 并加一行映射。组件层因为只有 'use client' 组件、无法放服务端 registry，
// 故保留这张轻量映射表（与数据注册表分离，互不污染）。
const GAME_COMPONENTS: Record<string, ComponentType> = {
  game2048: Game2048,
  "beat-tap": BeatTap,
  "planet-race": PlanetRace,
  "star-piano": StarPiano,
  "star-catch": StarCatch,
  breakout: Breakout,
  "snake-space": SnakeSpace,
  "memory-cards": MemoryCards,
  "number-match": NumberMatch,
  "beat-memory": BeatMemory,
  "gravity-bounce": GravityBounce,
  billiard: Billiard,
};

export default function GamePlayer({ slug }: { slug: string }) {
  const meta = getGameMeta(slug);
  const Comp = GAME_COMPONENTS[slug];
  if (!meta || !Comp) notFound();
  return (
    <GameShell meta={meta}>
      <Comp />
    </GameShell>
  );
}
