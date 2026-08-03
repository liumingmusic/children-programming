// 星球赛车 · 纯函数核心（可无 DOM 测试）。
// 逻辑分辨率固定，组件按 devicePixelRatio 缩放渲染。

export const W = 360;
export const H = 540;
export const SHIP_Y = H - 80;
export const SHIP_W = 36;
export const SHIP_H = 46;
export const SHIP_SPEED = 320; // 飞船横向速度 px/s
export const BASE_SPEED = 190; // 世界滚动起始速度 px/s
export const MAX_SPEED = 430;
export const SPEED_RAMP = 7; // 每秒提速 px/s

export type ObstacleKind = "rock" | "star";

export interface Obstacle {
  id: number;
  x: number; // 中心 x
  y: number; // 中心 y
  r: number;
  kind: ObstacleKind;
}

export interface GameState {
  shipX: number;
  t: number;
  speed: number;
  distance: number;
  score: number;
  collected: number;
  alive: boolean;
  obstacles: Obstacle[];
  nextId: number;
  spawnTimer: number;
  starTimer: number;
}

export interface Input {
  dir: number; // -1 | 0 | 1（键盘左右）
  targetX: number | null; // 指针目标 x（优先于 dir）
}

export function createState(): GameState {
  return {
    shipX: W / 2,
    t: 0,
    speed: BASE_SPEED,
    distance: 0,
    score: 0,
    collected: 0,
    alive: true,
    obstacles: [],
    nextId: 1,
    spawnTimer: 0.6,
    starTimer: 1.4,
  };
}

/** 矩形（飞船）与圆（障碍）碰撞判定。 */
export function rectCircleHit(
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  cx: number,
  cy: number,
  cr: number
): boolean {
  const nx = Math.max(rx, Math.min(cx, rx + rw));
  const ny = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < cr * cr;
}

/** 推进一帧，返回新状态（不可变）。 */
export function step(s: GameState, dt: number, input: Input): GameState {
  if (!s.alive) return s;
  const t = s.t + dt;
  const speed = Math.min(MAX_SPEED, BASE_SPEED + t * SPEED_RAMP);
  const distance = s.distance + speed * dt;

  // 飞船横向移动
  let shipX = s.shipX;
  if (input.targetX != null) {
    const d = input.targetX - shipX;
    const mv = SHIP_SPEED * dt;
    shipX += Math.max(-mv, Math.min(mv, d));
  } else {
    shipX += input.dir * SHIP_SPEED * dt;
  }
  shipX = Math.max(SHIP_W / 2, Math.min(W - SHIP_W / 2, shipX));

  // 障碍下落 + 越界剔除
  const moved = s.obstacles
    .map((o) => ({ ...o, y: o.y + speed * dt }))
    .filter((o) => o.y - o.r < H);

  // 碰撞
  let alive = true;
  let collected = s.collected;
  const sx = shipX - SHIP_W / 2;
  const sy = SHIP_Y - SHIP_H / 2;
  const remaining: Obstacle[] = [];
  for (const o of moved) {
    if (rectCircleHit(sx, sy, SHIP_W, SHIP_H, o.x, o.y, o.r)) {
      if (o.kind === "star") collected += 1;
      else alive = false;
    } else {
      remaining.push(o);
    }
  }

  // 生成陨石 / 星星
  let nextId = s.nextId;
  let spawnTimer = s.spawnTimer - dt;
  let starTimer = s.starTimer - dt;
  if (spawnTimer <= 0) {
    const r = 16 + Math.random() * 12;
    const x = r + Math.random() * (W - 2 * r);
    remaining.push({ id: nextId++, x, y: -r, r, kind: "rock" });
    spawnTimer = Math.max(0.32, 0.85 - t * 0.012);
  }
  if (starTimer <= 0) {
    const r = 13;
    const x = r + Math.random() * (W - 2 * r);
    remaining.push({ id: nextId++, x, y: -r, r, kind: "star" });
    starTimer = 1.6 + Math.random() * 1.2;
  }

  const score = Math.floor(distance / 10) + collected * 50;

  return {
    ...s,
    t,
    speed,
    distance,
    shipX,
    score,
    collected,
    alive,
    obstacles: remaining,
    nextId,
    spawnTimer,
    starTimer,
  };
}
