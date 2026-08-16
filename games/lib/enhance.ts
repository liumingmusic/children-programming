// 游戏「关卡 + 连击」增强共享纯函数。
// 新游戏统一复用，避免每个游戏重复定义且被 linter 改写。

export const MAX_LEVEL = 5;

/**
 * 连击倍率：每 perN 连击 +step 倍，上限 cap 倍。
 * 默认：第 5 连击起 1.5×，之后每 5 连击 +0.5×，封顶 4×。
 */
export function comboMult(
  combo: number,
  cap = 4,
  perN = 5,
  step = 0.5
): number {
  if (combo <= 0) return 1;
  return Math.min(cap, 1 + Math.floor(combo / perN) * step);
}

/** 第 level 关目标值：base + (level - 1) * step。 */
export function levelTarget(
  base: number,
  step: number,
  level: number
): number {
  return base + (level - 1) * step;
}
