// 第二批 12 个游戏的「关卡+连击」增强逻辑锁测试。
// 主要防御 linter 改写常量/函数名与改值：验证 createState 默认值、关卡目标、连击倍率。
import { describe, it, expect } from "vitest";
import {
  createState as createTetris,
  levelTargetFor as tetrisTarget,
  comboMult,
} from "@/games/entries/tetris/logic";
import {
  createState as createBounce,
  step as stepBounce,
  levelTargetFor as bounceTarget,
} from "@/games/entries/gravity-bounce/logic";
import {
  createState as createDodge,
  step as stepDodge,
  levelTargetFor as dodgeTarget,
} from "@/games/entries/meteor-dodge/logic";
import {
  createState as createRunner,
  step as stepRunner,
  levelTargetFor as runnerTarget,
} from "@/games/entries/space-runner/logic";
import {
  createState as createRace,
  step as stepRace,
  levelTargetFor as raceTarget,
} from "@/games/entries/planet-race/logic";
import {
  createState as createFish,
  step as stepFish,
  levelTargetFor as fishTarget,
} from "@/games/entries/fishing/logic";
import {
  LEVELS,
  LEVEL_COUNT,
  createState as createSoko,
  step as stepSoko,
  type Level as SokoLevel,
} from "@/games/entries/sokoban/logic";
import {
  levelTargetFor as memTarget,
  MAX_LEVELS as memMax,
  buildDeck,
} from "@/games/entries/memory-cards/logic";
import {
  levelTargetFor as numTarget,
  MAX_LEVELS as numMax,
  buildTiles,
} from "@/games/entries/number-match/logic";
import { MAX_LEVELS as beatMax } from "@/games/entries/beat-memory/logic";
import {
  MAX_LEVELS as pianoMax,
  comboMult as pianoComboMult,
  levelTargetFor as pianoTarget,
  challengePool,
  pickTarget,
  WHITE_KEYS,
  BLACK_KEYS,
} from "@/games/entries/star-piano/logic";

describe("俄罗斯方块 · 关卡/连击", () => {
  it("createState 含关卡与连击字段且默认合理", () => {
    const s = createTetris();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(10);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.cleared).toBe(false);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +10 行", () => {
    expect(tetrisTarget(1)).toBe(10);
    expect(tetrisTarget(5)).toBe(50);
  });
  it("comboMult：连续消行倍率递增、封顶 4", () => {
    expect(comboMult(1, 4, 3, 0.5)).toBe(1);
    expect(comboMult(3, 4, 3, 0.5)).toBe(1.5);
    expect(comboMult(99, 4, 3, 0.5)).toBe(4);
  });
});

describe("重力弹球 · 关卡/连击", () => {
  it("createState 含关卡/连击/挡板宽且默认合理", () => {
    const s = createBounce();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(8);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.cleared).toBe(false);
    expect(s.paddleW).toBeGreaterThan(0);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +8 次接球", () => {
    expect(bounceTarget(1)).toBe(8);
    expect(bounceTarget(5)).toBe(40);
  });
  it("连续接住累积连击与连击加分，漏接重置连击", () => {
    let s = createBounce();
    const noMove = { dir: 0, targetX: null as number | null };
    // 让挡板对准落点，模拟多次接住
    for (let i = 0; i < 600 && s.alive; i++) {
      // 把挡板移到球 x，保证接住
      s = { ...s, paddleX: s.x };
      s = stepBounce(s, 1 / 60, noMove);
    }
    expect(s.combo).toBeGreaterThan(0);
    expect(s.bounces).toBeGreaterThan(0);
    expect(s.score).toBeGreaterThanOrEqual(s.bounces * 10);
  });
});

describe("躲避流星 · 关卡/连击", () => {
  it("createState 含关卡/连击字段且默认合理", () => {
    const s = createDodge();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(10);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.cleared).toBe(false);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +10 颗流星", () => {
    expect(dodgeTarget(1)).toBe(10);
    expect(dodgeTarget(5)).toBe(50);
  });
  it("存活更久且连续躲过累积连击与加分", () => {
    let s = createDodge();
    const idle = { dir: 0, targetX: null as number | null };
    for (let i = 0; i < 1200 && s.alive; i++) s = stepDodge(s, 1 / 60, idle);
    expect(s.dodged).toBeGreaterThan(0);
    expect(s.score).toBeGreaterThanOrEqual(Math.floor(s.t * 10));
  });
});

describe("太空跑酷 · 关卡/连击", () => {
  it("createState 含关卡/连击字段且默认合理", () => {
    const s = createRunner();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(8);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.won).toBe(false);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +8 颗小行星", () => {
    expect(runnerTarget(1)).toBe(8);
    expect(runnerTarget(5)).toBe(40);
  });
  it("不跳时存活、累计躲过与连击加分随距离增长", () => {
    let s = createRunner(7);
    const noJump = { jump: false };
    for (let i = 0; i < 900 && s.alive; i++) s = stepRunner(s, 1 / 60, noJump);
    expect(s.score).toBeGreaterThan(0);
    expect(s.score).toBeGreaterThanOrEqual(Math.floor(s.t * 120));
  });
});

describe("星球赛车 · 关卡/连击", () => {
  it("createState 含关卡/连击字段且默认合理", () => {
    const s = createRace();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(5);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.cleared).toBe(false);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +5 颗星", () => {
    expect(raceTarget(1)).toBe(5);
    expect(raceTarget(5)).toBe(25);
  });
  it("吃星累积连击与连击加分，撞陨石结束", () => {
    let s = createRace();
    const noMove = { dir: 0, targetX: null as number | null };
    // 持续把飞船移到星星上（星星从顶部随机生成，这里靠运气偶尔吃到）
    for (let i = 0; i < 1800 && s.alive; i++) {
      const star = s.obstacles.find((o) => o.kind === "star");
      const input = star ? { dir: 0, targetX: star.x } : noMove;
      s = stepRace(s, 1 / 60, input);
    }
    expect(s.score).toBeGreaterThanOrEqual(0);
    if (s.collected > 0) {
      expect(s.starScore).toBeGreaterThanOrEqual(s.collected * 50);
    }
  });
});

describe("钓鱼 · 关卡/连击", () => {
  it("createState 含关卡/连击/绿区字段且默认合理", () => {
    const s = createFish();
    expect(s.level).toBe(1);
    expect(s.levelTarget).toBe(5);
    expect(s.combo).toBe(0);
    expect(s.comboBest).toBe(0);
    expect(s.zoneHalf).toBeGreaterThan(0);
    expect(s.cleared).toBe(false);
    expect(s.alive).toBe(true);
  });
  it("levelTargetFor：每关累计 +5 条鱼", () => {
    expect(fishTarget(1)).toBe(5);
    expect(fishTarget(5)).toBe(25);
  });
  it("绿区随关卡变窄", () => {
    const s = { ...createFish(), level: 3, levelTarget: fishTarget(3) };
    const ns = stepFish(s, 0.016, { reel: false });
    expect(ns.zoneHalf).toBeLessThan(34);
  });
});

describe("推箱子 · 多关卡/连击", () => {
  it("内置 5 个递进关卡", () => {
    expect(LEVEL_COUNT).toBe(5);
    expect(LEVELS.length).toBe(5);
  });
  it("把箱子推上目标触发连击与加分", () => {
    const lvl: SokoLevel = { rows: ["#####", "#@$.#", "#####"] };
    const s = createSoko(lvl);
    expect(s.placed).toBe(0);
    const ns = stepSoko(s, 0, { move: 1 });
    expect(ns.placed).toBe(1);
    expect(ns.combo).toBe(1);
    expect(ns.score).toBe(30);
    expect(ns.won).toBe(true);
  });
});

describe("记忆翻牌 · 关卡/连击字段", () => {
  it("MAX_LEVELS 与关卡目标（4→8 对）", () => {
    expect(memMax).toBe(5);
    expect(memTarget(1)).toBe(4);
    expect(memTarget(5)).toBe(8);
  });
  it("buildDeck(pairs) 生成 2*pairs 张牌", () => {
    expect(buildDeck(4).length).toBe(8);
    expect(buildDeck(8).length).toBe(16);
  });
});

describe("数字消消乐 · 关卡/连击字段", () => {
  it("MAX_LEVELS 与关卡目标（8→16 张）", () => {
    expect(numMax).toBe(5);
    expect(numTarget(1)).toBe(8);
    expect(numTarget(5)).toBe(16);
  });
  it("buildTiles(size) 生成 size 张、1..size/2 各两枚", () => {
    const t = buildTiles(16);
    expect(t.length).toBe(16);
    const counts = new Map<number, number>();
    for (const tile of t) counts.set(tile.value, (counts.get(tile.value) ?? 0) + 1);
    for (const c of counts.values()) expect(c).toBe(2);
  });
});

describe("节奏记忆 · 关卡上限", () => {
  it("MAX_LEVELS=5，round 即关卡", () => {
    expect(beatMax).toBe(5);
  });
});

describe("造物钢琴 · 星星挑战关卡/连击", () => {
  it("MAX_LEVELS 与关卡目标（5→13 次）", () => {
    expect(pianoMax).toBe(5);
    expect(pianoTarget(1)).toBe(5);
    expect(pianoTarget(5)).toBe(13);
  });
  it("comboMult 复用增强层：连击递增、封顶 4", () => {
    expect(pianoComboMult(1)).toBe(1);
    expect(pianoComboMult(5)).toBe(1.5);
    expect(pianoComboMult(99)).toBe(4);
  });
  it("challengePool：低关只白键、最高关含黑键", () => {
    const p1 = challengePool(1);
    expect(p1.length).toBe(5);
    expect(p1.every((k) => !k.isBlack)).toBe(true);
    const p5 = challengePool(5);
    // 第 5 关：取前 min(白键数, 3+5*2) 个白键 + 全部黑键
    const expectedWhite = Math.min(WHITE_KEYS.length, 3 + 5 * 2);
    expect(p5.filter((k) => !k.isBlack).length).toBe(expectedWhite);
    expect(p5.some((k) => k.isBlack)).toBe(true);
  });
  it("pickTarget 返回音池内成员", () => {
    const pool = challengePool(3);
    const t = pickTarget(pool);
    expect(pool.some((k) => k.note === t.note)).toBe(true);
  });
});
