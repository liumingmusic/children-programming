// 游戏注册表：游乐场的「单一数据源」（仅元数据，不含 React 组件）。
//
// 设计类比 content/index.ts：所有游戏的静态元数据集中在此，路由与卡片页
// 只认本文件，不认具体游戏。新增游戏只需 import 其 meta 并推入 GAMES 一项。
//
// 真正的「slug -> 组件」映射在客户端 games/components/GamePlayer.tsx，
// 因为那里需要 'use client' 的组件；本文件保持服务端安全，便于
// generateStaticParams / generateMetadata 直接导入。

import type { GameDefMeta } from "./types";
import { game2048Meta } from "./entries/game2048/meta";
import { beatTapMeta } from "./entries/beat-tap/meta";
import { planetRaceMeta } from "./entries/planet-race/meta";
import { starPianoMeta } from "./entries/star-piano/meta";
import { starCatchMeta } from "./entries/star-catch/meta";
import { breakoutMeta } from "./entries/breakout/meta";
import { snakeSpaceMeta } from "./entries/snake-space/meta";
import { memoryCardsMeta } from "./entries/memory-cards/meta";
import { numberMatchMeta } from "./entries/number-match/meta";
import { beatMemoryMeta } from "./entries/beat-memory/meta";

/** 全部游戏（按展示顺序排列）。 */
export const GAMES: GameDefMeta[] = [
  game2048Meta,
  beatTapMeta,
  planetRaceMeta,
  starPianoMeta,
  starCatchMeta,
  breakoutMeta,
  snakeSpaceMeta,
  memoryCardsMeta,
  numberMatchMeta,
  beatMemoryMeta,
];

/** 给 generateStaticParams 用的 slug 列表。 */
export const GAME_SLUGS = GAMES.map((g) => ({ slug: g.slug }));

export function getGameMeta(slug: string): GameDefMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}

/** 按分类分组（保留 GAMES 顺序），供卡片页按分类展示。 */
export function getGamesByCategory(): { category: string; games: GameDefMeta[] }[] {
  const groups: { category: string; games: GameDefMeta[] }[] = [];
  for (const g of GAMES) {
    let grp = groups.find((x) => x.category === g.category);
    if (!grp) {
      grp = { category: g.category, games: [] };
      groups.push(grp);
    }
    grp.games.push(g);
  }
  return groups;
}
