// 接星星 · 纯函数核心（可无 DOM 测试）。
// 竖屏逻辑分辨率，组件按 devicePixelRatio 缩放渲染。
// 增强：5 个关卡（按累计接住数递进）+ 连击倍率 + 难度随关卡递增。

export const W = 360;
export const H = 540;
export const BASKET_W = 78;
export const BASKET_H = 30;
export const BASKET_Y = H - 48;
export const BASKET_SPEED = 360; // 篮子横向速度 px/s
export const STAR_R = 13;
export const FALL_BASE = 150;
export const FALL_MAX = 380;
export const FALL_RAMP = 7; // 每秒加速 px/s
export const MAX_LIVES = 3;

export const MAX_LEVEL = 5;
const LEVEL_BASE_TARGET = 10; // 第 1 关需累计接住 10 颗
const LEVEL_STEP = 6; // 每关目标 +6 颗
const COMBO_STEP = 5; // 每 5 连击 +0.5 倍

/** 第 level 关的累计接住目标。 */
export function levelTargetFor(level: number): number {
  return LEVEL_BASE_TARGET + (level - 1) * LEVEL_STEP;
}
/** 第 level 关的起始下落速度。 */
export function fallBaseFor(level: number): number {
  return FALL_BASE + (level - 1) * 42;
}
/** 第 level 关的最快下落速度。 */
export function fallMaxFor(level: number): number {
  return FALL_MAX + (level - 1) * 34;
}
/** 连击倍率：每 COMBO_STEP 连击 +0.5 倍，上限 3 倍。 */
export function comboMult(combo: number): number {
  return Math.min(3, 1 + Math.floor(combo / COMBO_STEP) * 0.5);
}

export interface Star {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
}

export interface GameState {
  basketX: number;
  t: number;
  score: number;
  caught: number;
  lives: number;
  alive: boolean;
  cleared: boolean; // 已通关全部关卡（之后进入无尽挑战）
  level: number;
  levelTarget: number; // 当前关需累计接住数
  combo: number;
  comboBest: number;
  stars: Star[];
  nextId: number;
  spawnTimer: number;
  fallSpeed: number;
}

export interface Input {
  dir: number; // -1 | 0 | 1
  targetX: number | null;
}

export function createState(): GameState {
  return {
    basketX: W / 2,
    t: 0,
    score: 0,
    caught: 0,
    lives: MAX_LIVES,
    alive: true,
    cleared: false,
    level: 1,
    levelTarget: levelTargetFor(1),
    combo: 0,
    comboBest: 0,
    stars: [],
    nextId: 1,
    spawnTimer: 0.5,
    fallSpeed: fallBaseFor(1),
  };
}

/** 篮子（矩形）与星星（圆）碰撞：星星落入篮子口区域即接住。 */
export function caught(s: GameState, star: Star): boolean {
  const bx = s.basketX;
  const half = BASKET_W / 2;
  const top = BASKET_Y - BASKET_H / 2;
  const bottom = BASKET_Y + BASKET_H / 2;
  return (
    star.x >= bx - half &&
    star.x <= bx + half &&
    star.y + star.r >= top &&
    star.y - star.r <= bottom
  );
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const level = s.level;
  const fallSpeed = Math.min(fallMaxFor(level), fallBaseFor(level) + s.t * FALL_RAMP);

  // 篮子横向移动
  let basketX = s.basketX;
  if (input.targetX != null) {
    const d = input.targetX - basketX;
    const mv = BASKET_SPEED * dt;
    basketX += Math.max(-mv, Math.min(mv, d));
  } else {
    basketX += input.dir * BASKET_SPEED * dt;
  }
  basketX = Math.max(BASKET_W / 2, Math.min(W - BASKET_W / 2, basketX));

  // 星星下落 / 接住 / 漏接
  let lives = s.lives;
  let caughtCount = s.caught;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let score = s.score;
  let cleared = s.cleared;
  let curLevel = level;
  let levelTarget = s.levelTarget;
  const remaining: Star[] = [];
  for (const st of s.stars) {
    const ny = st.y + st.speed * dt;
    if (caught(s, { ...st, y: ny })) {
      caughtCount += 1;
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      score += Math.round(10 * comboMult(combo));
      // 关卡递进：达到当前关目标且未通关 → 进下一关
      if (!cleared && caughtCount >= levelTarget) {
        if (curLevel < MAX_LEVEL) {
          curLevel += 1;
          levelTarget = levelTargetFor(curLevel);
        } else {
          cleared = true;
        }
      }
    } else if (ny - st.r > H) {
      lives -= 1; // 漏接：断连击
      combo = 0;
    } else {
      remaining.push({ ...st, y: ny });
    }
  }

  // 生成星星（高关卡生成更密）
  let nextId = s.nextId;
  let spawnTimer = s.spawnTimer - dt;
  if (spawnTimer <= 0) {
    const x = STAR_R + Math.random() * (W - 2 * STAR_R);
    remaining.push({
      id: nextId++,
      x,
      y: -STAR_R,
      r: STAR_R,
      speed: fallSpeed,
    });
    spawnTimer = Math.max(0.32, 0.9 - s.t * 0.012 - (curLevel - 1) * 0.05);
  }

  const t = s.t + dt;
  const alive = lives > 0;

  return {
    ...s,
    basketX,
    t,
    fallSpeed,
    score,
    caught: caughtCount,
    lives,
    alive,
    cleared,
    level: curLevel,
    levelTarget,
    combo,
    comboBest,
    stars: remaining,
    nextId,
    spawnTimer,
  };
}
