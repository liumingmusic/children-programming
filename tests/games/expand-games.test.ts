import { describe, it, expect } from "vitest";
import {
  W as RW, H as RH, GROUND_Y, PX, PW, PH, MAX_LIVES,
  createState as createRunner, step as stepRunner, type Input as RunnerInput,
} from "@/games/entries/space-runner/logic";
import {
  W as MW, PLAYER_SIZE, MAX_LIVES as MD_LIVES,
  createState as createDodge, step as stepDodge, type Input as DodgeInput,
} from "@/games/entries/meteor-dodge/logic";
import {
  W as FW, BAR_W, ZONE_HALF, createState as createFishing, step as stepFishing, type Input as FishInput,
} from "@/games/entries/fishing/logic";
import {
  COLS, ROWS, ROTATIONS, createState as createTetris, step as stepTetris,
  collide, clearLines, type Input as TetrisInput,
} from "@/games/entries/tetris/logic";
import {
  createState as createSokoban, step as stepSokoban, parseLevel, isWon,
  type Input as SokoInput, type Level,
} from "@/games/entries/sokoban/logic";

const DT = 1 / 60;

describe("太空跑酷", () => {
  it("不跳跃时分数随时间增加、玩家在地面、存活", () => {
    let s = createRunner(1);
    const noJump: RunnerInput = { jump: false };
    for (let i = 0; i < 60; i++) s = stepRunner(s, DT, noJump); // ~1s
    expect(s.score).toBeGreaterThan(0);
    expect(s.alive).toBe(true);
    expect(s.py).toBeGreaterThanOrEqual(GROUND_Y - PH - 1); // 未离地（未跳）
    expect(s.py).toBeLessThanOrEqual(GROUND_Y - PH + 1);
    expect(PX).toBeGreaterThanOrEqual(0);
    expect(PX + PW).toBeLessThanOrEqual(RW);
  });

  it("跳跃时玩家离地（y 减小）", () => {
    let s = createRunner(2);
    // 先跑几帧确保在地面
    for (let i = 0; i < 5; i++) s = stepRunner(s, DT, { jump: false });
    const before = s.py;
    s = stepRunner(s, DT, { jump: true });
    expect(s.py).toBeLessThan(before); // 起跳上升
  });
});

describe("躲避流星", () => {
  it("静止居中 1 秒内不撞、分数增加、生命满", () => {
    let s = createDodge(3);
    const idle: DodgeInput = { dir: 0, targetX: null };
    for (let i = 0; i < 60; i++) s = stepDodge(s, DT, idle);
    expect(s.score).toBeGreaterThan(0);
    expect(s.alive).toBe(true);
    expect(s.lives).toBe(MD_LIVES);
    expect(s.playerX).toBeGreaterThanOrEqual(0);
    expect(s.playerX + PLAYER_SIZE).toBeLessThanOrEqual(MW);
  });

  it("移动到边缘被夹紧", () => {
    let s = createDodge(4);
    for (let i = 0; i < 120; i++) s = stepDodge(s, DT, { dir: -1, targetX: null });
    expect(s.playerX).toBe(0);
  });
});

describe("钓鱼", () => {
  it("不收竿时分数 0、指针在光条范围内", () => {
    let s = createFishing(5);
    const noReel: FishInput = { reel: false };
    for (let i = 0; i < 60; i++) s = stepFishing(s, DT, noReel);
    expect(s.score).toBe(0);
    expect(s.pos).toBeGreaterThanOrEqual(0);
    expect(s.pos).toBeLessThanOrEqual(BAR_W);
  });

  it("指针在绿区收竿 -> 钓到鱼加分", () => {
    let s = createFishing(6);
    const noReel: FishInput = { reel: false };
    // 步进直到指针进入中央绿区
    let guard = 0;
    while (Math.abs(s.pos - BAR_W / 2) > ZONE_HALF && guard < 600) {
      s = stepFishing(s, DT, noReel);
      guard++;
    }
    const before = s.catches;
    s = stepFishing(s, DT, { reel: true });
    expect(s.catches).toBe(before + 1);
    expect(s.score).toBeGreaterThan(0);
  });

  it("指针在边缘收竿 -> 失误 +1", () => {
    let s = createFishing(7);
    const noReel: FishInput = { reel: false };
    let guard = 0;
    while (Math.abs(s.pos - BAR_W / 2) <= BAR_W / 2 - 20 && guard < 600) {
      s = stepFishing(s, DT, noReel);
      guard++;
    }
    const before = s.misses;
    s = stepFishing(s, DT, { reel: true });
    expect(s.misses).toBe(before + 1);
  });
});

describe("俄罗斯方块", () => {
  it("硬降后方块写入棋盘（出现非空格）", () => {
    let s = createTetris(11);
    s = stepTetris(s, DT, { left: false, right: false, rotate: false, soft: false, hard: true });
    const filled = s.board.flat().filter((v) => v !== 0).length;
    expect(filled).toBeGreaterThan(0);
  });

  it("棋盘尺寸正确、落定格取值 0..7", () => {
    const s = createTetris(12);
    expect(s.board.length).toBe(ROWS);
    expect(s.board[0].length).toBe(COLS);
    for (const row of s.board) for (const v of row) expect(v).toBe(0);
  });

  it("长时间无操作不报错、棋盘状态合法", () => {
    let s = createTetris(13);
    const noop: TetrisInput = { left: false, right: false, rotate: false, soft: false, hard: false };
    for (let i = 0; i < 300; i++) s = stepTetris(s, DT, noop);
    expect(s.board.length).toBe(ROWS);
    for (const row of s.board) for (const v of row) expect(v).toBeGreaterThanOrEqual(0);
  });

  it("旋转边沿触发改变旋转态", () => {
    let s = createTetris(14);
    s = stepTetris(s, DT, { left: false, right: false, rotate: true, soft: false, hard: false });
    expect(s.cur.rot).toBe(1);
  });

  it("持续右移使方块 x 不减小", () => {
    const s0 = createTetris(15);
    const initialX = s0.cur.x;
    let s = s0;
    for (let i = 0; i < 40; i++)
      s = stepTetris(s, DT, { left: false, right: true, rotate: false, soft: false, hard: false });
    expect(s.cur.x).toBeGreaterThanOrEqual(initialX);
    expect(s.cur.x).toBeLessThanOrEqual(COLS);
  });

  it("collide：越界/重叠返回 true，空位返回 false", () => {
    const empty = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    const inBoard = { type: 0, rot: 0, x: 0, y: 0 }; // I 占 (0..3,1)
    expect(collide(empty, inBoard)).toBe(false);
    const offBoard = { type: 0, rot: 0, x: -1, y: 0 };
    expect(collide(empty, offBoard)).toBe(true);
    const occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    occupied[1][0] = 1;
    expect(collide(occupied, inBoard)).toBe(true);
  });

  it("clearLines：整行填满被消除并补空行", () => {
    const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    board[ROWS - 1] = Array(COLS).fill(1); // 底行填满
    const res = clearLines(board);
    expect(res.cleared).toBe(1);
    expect(res.board.length).toBe(ROWS);
    expect(res.board[ROWS - 1].every((v) => v === 0)).toBe(true);
  });
});

describe("推箱子", () => {
  const tiny: Level = { rows: ["#####", "#@$.#", "#####"] };

  it("小关卡向右一步即可把箱子推上目标并胜利", () => {
    let s = createSokoban(tiny);
    s = stepSokoban(s, 0, { move: 1 }); // 右
    expect(s.won).toBe(true);
    expect(s.moves).toBe(1);
    expect(s.player.x).toBe(2);
    expect(s.boxes[1][3]).toBe(true);
  });

  it("撞墙时不移动", () => {
    const wall: Level = { rows: ["####", "#@ #", "####"] };
    let s = createSokoban(wall);
    const before = { ...s.player };
    s = stepSokoban(s, 0, { move: 0 }); // 上，撞墙
    expect(s.player).toEqual(before);
    expect(s.moves).toBe(0);
  });

  it("箱子被墙挡住时无法推", () => {
    const blocked: Level = { rows: ["#####", "#@$# #", "#####"] };
    let s = createSokoban(blocked);
    s = stepSokoban(s, 0, { move: 1 }); // 右：箱子右侧是墙
    expect(s.moves).toBe(0);
    expect(s.boxes[1][2]).toBe(true); // 箱子原地不动
  });

  it("parseLevel / isWon 正确识别目标与箱子", () => {
    const p = parseLevel(tiny);
    expect(p.targets[1][3]).toBe(true);
    expect(p.boxes[1][2]).toBe(true);
    const s = createSokoban(tiny);
    expect(isWon(s.targets, s.boxes)).toBe(false);
  });
});
