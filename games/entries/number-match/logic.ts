// 数字消消乐 · 纯函数工具（牌组生成 + 关卡/连击增强）。

import { levelTarget as levelTargetFn, MAX_LEVEL } from "@/games/lib/enhance";

export const MAX_LEVELS = MAX_LEVEL;

/** 第 level 关的牌数：8 → 16（4 列网格 2..4 行）。 */
export function levelTargetFor(level: number): number {
  return levelTargetFn(8, 2, level);
}

export interface Tile {
  id: number;
  value: number;
  cleared: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成 size 张数字牌（size 须为偶数），1..size/2 各出现两次并打乱。 */
export function buildTiles(size = 16): Tile[] {
  const half = size / 2;
  const values: number[] = [];
  for (let v = 1; v <= half; v++) {
    values.push(v, v);
  }
  return shuffle(values).map((value, id) => ({ id, value, cleared: false }));
}
