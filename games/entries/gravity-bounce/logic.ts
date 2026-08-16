// 重力弹球 · 纯函数核心（可无 DOM 测试）。
// 物理：小球受恒定重力下落，撞墙与挡板按弹性系数反弹。
// 增强：5 关按弹跳次数递进（挡板变窄、回弹更快）+ 连击倍率（连续接住累积加分）。

import { comboMult as comboMultFn, levelTarget as levelTargetFn, MAX_LEVEL as MAX_LEVEL_FN } from "@/games/lib/enhance";

export const MAX_LEVEL = MAX_LEVEL_FN;
export const comboMult = comboMultFn;
/** 第 level 关需累计接住的球数。 */
export function levelTargetFor(level: number): number {
  return levelTargetFn(8, 8, level);
}

export const W = 360;
export const H = 540;
export const BALL_R = 14;
export const GRAVITY = 1000; // px/s^2
export const RESTITUTION = 0.92; // 墙/挡板弹性系数
export const PADDLE_W = 96;
export const PADDLE_H = 16;
export const PADDLE_Y = H - 46;
export const PADDLE_SPEED = 420; // 挡板横向速度 px/s
export const MAX_LIVES = 3;

export interface GameState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  paddleX: number;
  paddleW: number;
  t: number;
  score: number;
  bounces: number;
  level: number;
  levelTarget: number;
  combo: number;
  comboBest: number;
  cleared: boolean;
  lives: number;
  alive: boolean;
}

export interface Input {
  dir: number; // -1 | 0 | 1
  targetX: number | null;
}

export function createState(): GameState {
  return {
    x: W / 2,
    y: 60,
    vx: (Math.random() < 0.5 ? -1 : 1) * 160,
    vy: 120,
    paddleX: W / 2,
    paddleW: PADDLE_W,
    t: 0,
    score: 0,
    bounces: 0,
    level: 1,
    levelTarget: levelTargetFor(1),
    combo: 0,
    comboBest: 0,
    cleared: false,
    lives: MAX_LIVES,
    alive: true,
  };
}

export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;

  let paddleW = s.paddleW;
  // 挡板移动
  let paddleX = s.paddleX;
  if (input.targetX != null) {
    const d = input.targetX - paddleX;
    const mv = PADDLE_SPEED * dt;
    paddleX += Math.max(-mv, Math.min(mv, d));
  } else {
    paddleX += input.dir * PADDLE_SPEED * dt;
  }
  paddleX = Math.max(paddleW / 2, Math.min(W - paddleW / 2, paddleX));

  // 物理积分
  let { x, y, vx, vy } = s;
  vy += GRAVITY * dt;
  x += vx * dt;
  y += vy * dt;

  // 左右墙反弹
  if (x - BALL_R < 0) {
    x = BALL_R;
    vx = Math.abs(vx) * RESTITUTION;
  } else if (x + BALL_R > W) {
    x = W - BALL_R;
    vx = -Math.abs(vx) * RESTITUTION;
  }

  // 挡板反弹（仅下落且进入挡板口时）
  let bounces = s.bounces;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let level = s.level;
  let levelTarget = s.levelTarget;
  let cleared = s.cleared;
  let points = s.score - s.bounces * 10; // 现有连击加分部分
  const paddleTop = PADDLE_Y - PADDLE_H / 2;
  if (
    vy > 0 &&
    y + BALL_R >= paddleTop &&
    y - BALL_R <= PADDLE_Y + PADDLE_H / 2 &&
    x >= paddleX - paddleW / 2 &&
    x <= paddleX + paddleW / 2
  ) {
    y = paddleTop - BALL_R;
    const centered = 1 - Math.abs(x - paddleX) / (paddleW / 2); // 0..1
    const levelKick = (level - 1) * 25;
    vy = -(Math.abs(vy) * RESTITUTION + 120 + centered * 160 + levelKick);
    vx += (x - paddleX) * 1.6; // 边缘给一点横向偏移
    bounces += 1;
    combo += 1;
    comboBest = Math.max(comboBest, combo);
    points += Math.round(5 * comboMult(combo));
    // 关卡递进
    if (bounces >= levelTarget) {
      if (level < MAX_LEVEL) {
        level += 1;
        levelTarget = levelTargetFor(level);
        // 挡板随关卡变窄（下限 60%）
        paddleW = Math.max(PADDLE_W * 0.6, PADDLE_W - (level - 1) * 10);
      } else if (!cleared) {
        cleared = true;
      }
    }
  }

  // 漏接（掉出底部）
  let lives = s.lives;
  if (y - BALL_R > H) {
    lives -= 1;
    combo = 0;
    if (lives <= 0) {
      return { ...s, x, y, vx, vy, paddleX, paddleW, t, bounces, combo, comboBest, level, levelTarget, cleared, lives, alive: false, score: bounces * 10 + points };
    }
    // 重置小球到顶部
    x = W / 2;
    y = 60;
    vx = (Math.random() < 0.5 ? -1 : 1) * 160;
    vy = 120 + (level - 1) * 30;
  }

  const score = bounces * 10 + points;
  return { ...s, x, y, vx, vy, paddleX, paddleW, t, score, bounces, level, levelTarget, combo, comboBest, cleared, lives, alive: true };
}
