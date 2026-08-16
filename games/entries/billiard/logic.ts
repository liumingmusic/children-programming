// 星球台球 · 纯函数核心（可无 DOM 测试）。
// 两种模式：
//  沙盒（createState()）：两球弹性碰撞演示，无袋口，供物理教学与单测使用。
//  闯关（createState({challenge:true})）：桌面四角有袋口，用白球把星球撞进袋，
//        每关需进袋若干颗、限定击球数，连续进袋有连击加分，共 5 关。

export const W = 360;
export const H = 540;
export const BALL_R = 16;
export const WALL_E = 0.98; // 桌边弹性
export const FRICTION = 0.25; // 每秒速度衰减（桌布摩擦）
export const MAX_SPEED = 900;
export const LEVEL_COUNT = 5;
export const POT_PER_LEVEL = 3; // 每关需进袋的星球数

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Pocket {
  x: number;
  y: number;
  r: number;
}

export interface GameState {
  balls: [Ball, Ball]; // [白球, 星球]
  t: number;
  collisions: number;
  // 闯关相关（沙盒模式下全部为 0 / 空 / false）
  challenge: boolean;
  pockets: Pocket[];
  level: number;
  potted: number; // 累计进袋
  pottedLevel: number; // 本关已进袋
  combo: number;
  comboBest: number;
  score: number;
  shots: number; // 已用击球数
  shotMax: number; // 击球预算
  cleared: boolean; // 全部关卡通关
  over: boolean; // 击球预算用尽且未通关
  lastPocket: Pocket | null; // 最近一次进袋的袋口（供 UI 特效）
}

/** 四角袋口。 */
export function cornerPockets(): Pocket[] {
  const m = 26;
  return [
    { x: m, y: m, r: 22 },
    { x: W - m, y: m, r: 22 },
    { x: m, y: H - m, r: 22 },
    { x: W - m, y: H - m, r: 22 },
  ];
}

/** 第 level 关的击球预算（关卡越高越紧）。 */
export function shotBudgetFor(level: number): number {
  return Math.max(4, 9 - (level - 1));
}

/** 连击倍率：每连击 +0.1 倍，最高 1.8 倍。 */
export function comboMult(combo: number): number {
  return Math.min(1.8, 1 + combo * 0.1);
}

function speed(b: Ball): number {
  return Math.hypot(b.vx, b.vy);
}

/** 在桌面安全区随机放置星球（避开袋口与白球）。 */
function randomPlanet(white: Ball): Ball {
  for (let i = 0; i < 40; i++) {
    const x = BALL_R + 40 + Math.random() * (W - 2 * BALL_R - 80);
    const y = BALL_R + 40 + Math.random() * (H - 2 * BALL_R - 80);
    const inPocket = cornerPockets().some(
      (p) => Math.hypot(p.x - x, p.y - y) <= p.r + BALL_R + 6
    );
    const tooClose = Math.hypot(white.x - x, white.y - y) < BALL_R * 4;
    if (!inPocket && !tooClose) return { x, y, vx: 0, vy: 0 };
  }
  return { x: W * 0.7, y: H * 0.4, vx: 0, vy: 0 };
}

export function createState(opts?: { challenge?: boolean }): GameState {
  const challenge = !!opts?.challenge;
  const white: Ball = { x: W * 0.3, y: H * 0.7, vx: 0, vy: 0 };
  const planet: Ball = { x: W * 0.7, y: H * 0.4, vx: 0, vy: 0 };
  return {
    balls: [white, planet],
    t: 0,
    collisions: 0,
    challenge,
    pockets: challenge ? cornerPockets() : [],
    level: 1,
    potted: 0,
    pottedLevel: 0,
    combo: 0,
    comboBest: 0,
    score: 0,
    shots: 0,
    shotMax: challenge ? shotBudgetFor(1) : 0,
    cleared: false,
    over: false,
    lastPocket: null,
  };
}

/** 等质量弹性碰撞：沿法线交换速度分量；仅在相互接近且重叠时处理。 */
export function resolveCollision(a: Ball, b: Ball): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist >= BALL_R * 2) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  const rvx = a.vx - b.vx;
  const rvy = a.vy - b.vy;
  const vrel = rvx * nx + rvy * ny;
  if (vrel <= 0) return false; // 正在分离，不处理
  a.vx -= vrel * nx;
  a.vy -= vrel * ny;
  b.vx += vrel * nx;
  b.vy += vrel * ny;
  const overlap = BALL_R * 2 - dist;
  const px = (nx * overlap) / 2;
  const py = (ny * overlap) / 2;
  a.x -= px;
  a.y -= py;
  b.x += px;
  b.y += py;
  return true;
}

function inPocket(pockets: Pocket[], x: number, y: number): Pocket | null {
  for (const p of pockets) {
    if (Math.hypot(p.x - x, p.y - y) <= p.r) return p;
  }
  return null;
}

export function step(s: GameState, dt: number): GameState {
  const t = s.t + dt;
  const balls: [Ball, Ball] = [{ ...s.balls[0] }, { ...s.balls[1] }];
  let collisions = s.collisions;
  let potted = s.potted;
  let pottedLevel = s.pottedLevel;
  let combo = s.combo;
  let comboBest = s.comboBest;
  let score = s.score;
  let level = s.level;
  let shots = s.shots;
  let shotMax = s.shotMax;
  let cleared = s.cleared;
  let over = s.over;
  let lastPocket: Pocket | null = null;

  for (const ball of balls) {
    const f = Math.max(0, 1 - FRICTION * dt);
    ball.vx *= f;
    ball.vy *= f;
    const sp = Math.hypot(ball.vx, ball.vy);
    if (sp > MAX_SPEED) {
      ball.vx = (ball.vx / sp) * MAX_SPEED;
      ball.vy = (ball.vy / sp) * MAX_SPEED;
    }
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x - BALL_R < 0) {
      ball.x = BALL_R;
      ball.vx = Math.abs(ball.vx) * WALL_E;
    } else if (ball.x + BALL_R > W) {
      ball.x = W - BALL_R;
      ball.vx = -Math.abs(ball.vx) * WALL_E;
    }
    if (ball.y - BALL_R < 0) {
      ball.y = BALL_R;
      ball.vy = Math.abs(ball.vy) * WALL_E;
    } else if (ball.y + BALL_R > H) {
      ball.y = H - BALL_R;
      ball.vy = -Math.abs(ball.vy) * WALL_E;
    }
  }

  if (resolveCollision(balls[0], balls[1])) collisions += 1;

  if (s.challenge && s.pockets.length > 0) {
    // 星球进袋
    const pp = inPocket(s.pockets, balls[1].x, balls[1].y);
    if (pp) {
      potted += 1;
      pottedLevel += 1;
      combo += 1;
      comboBest = Math.max(comboBest, combo);
      score += Math.round(100 * comboMult(combo));
      balls[1] = randomPlanet(balls[0]);
      lastPocket = pp;
    }
    // 白球进袋（犯规）：复位白球、连击清零
    const wp = inPocket(s.pockets, balls[0].x, balls[0].y);
    if (wp) {
      combo = 0;
      balls[0] = { x: W * 0.3, y: H * 0.7, vx: 0, vy: 0 };
      lastPocket = wp;
    }
    // 过关 / 通关
    if (!cleared && pottedLevel >= POT_PER_LEVEL) {
      if (level < LEVEL_COUNT) {
        level += 1;
        pottedLevel = 0;
        shots = 0; // 补满击球预算
        shotMax = shotBudgetFor(level);
      } else {
        cleared = true;
        over = true;
      }
    }
    // 失败：击球用尽且两球基本静止仍未通关
    if (!cleared && shots >= shotMax && speed(balls[0]) < 20 && speed(balls[1]) < 20) {
      over = true;
    }
  }

  return {
    balls,
    t,
    collisions,
    challenge: s.challenge,
    pockets: s.pockets,
    level,
    potted,
    pottedLevel,
    combo,
    comboBest,
    score,
    shots,
    shotMax,
    cleared,
    over,
    lastPocket,
  };
}

/** 发射白球：从白球当前位置朝目标点给一个速度，并消耗一次击球。 */
export function shoot(
  s: GameState,
  targetX: number,
  targetY: number,
  power = 640
): GameState {
  if (s.challenge && (s.cleared || s.over)) return s;
  const a = s.balls[0];
  const dx = targetX - a.x;
  const dy = targetY - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const shots = s.challenge ? s.shots + 1 : s.shots;
  return {
    ...s,
    balls: [{ ...a, vx: (dx / d) * power, vy: (dy / d) * power }, { ...s.balls[1] }],
    shots,
  };
}
