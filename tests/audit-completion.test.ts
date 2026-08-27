/**
 * 全量审计（精简版）：6-8 与 9-12 岁「完成条件合理性」+ 6-8「示范达标」。
 *
 * 说明：9-12 岁的「示范达成目标」已由既有分类 goal 测试覆盖（fn/var/multi/key/list/
 * sci9/story/music/math/game9-goal），故本文件不再重复跑 9-12 批量运行时，避免暴露
 * 个别 demo 可能存在的同步死循环卡死 worker。6-8 的示范达标此前从未做目标断言，是本文件重点。
 *
 * 三组：
 *   D. 完成条件宽松度全量分类（纯函数，瞬时，核心交付）：哪些项目 isGoalAchieved(零状态)=true
 *      （不验证产出）/ 哪些是时间轴（生产中永不触发完成·结构性缺口）/ 哪些是 memory 组件。
 *   C. 9-12 非时间轴：零状态必须不通过（实质把关）。纯函数，瞬时。
 *   A. 6-8 非时间轴、非 memory：看示范必须达成目标（运行时）。唯一 novel 运行时检查。
 */
import { describe, it, expect, beforeAll } from "vitest";
import { projects, getStageOfProject } from "@/courses";
import { isGoalAchieved } from "@/lib/steps";
import { runDemoFull, withInstantRaf } from "./exec-helpers";

beforeAll(() => {
  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = function () {
      return {
        measureText: (t: string) => ({ width: (t ? String(t).length : 0) * 6 }),
        font: "", fillText: () => {}, scale: () => {}, translate: () => {},
        clearRect: () => {}, fillRect: () => {}, beginPath: () => {}, moveTo: () => {},
        lineTo: () => {}, stroke: () => {}, save: () => {}, restore: () => {},
      } as unknown as CanvasRenderingContext2D;
    } as unknown as typeof HTMLCanvasElement.prototype.getContext;
  }
});

const ZERO_STATE = {
  actor: { x: 0, y: 0 },
  stars: [] as { collected: boolean }[],
  penPaths: [] as { points: { x: number; y: number }[] }[],
  vars: {} as Record<string, number | unknown[]>,
  movedDistance: 0,
  log: [] as string[],
  actors: [] as { id: string; acted?: boolean }[],
  companionEngaged: false,
  keyHandlers: 0,
  clickHandlers: 0,
  sounded: false,
};

function stageOf(slug: string): "6-8" | "9-12" | "?" {
  const s = getStageOfProject(slug);
  if (s?.id === "stage-6-8") return "6-8";
  if (s?.id === "stage-9-12") return "9-12";
  return "?";
}

describe("D. 完成条件宽松度全量分类（纯函数·核心交付）", () => {
  it("打印全量分类报告并断言分类自洽", () => {
    const loose: string[] = [];
    const timelineGap: string[] = [];
    const memory: string[] = [];
    const guarded: string[] = [];
    for (const p of projects) {
      if (p.component === "memory") { memory.push(p.slug); continue; }
      if (p.timeline) { timelineGap.push(`${p.slug}（${stageOf(p.slug)}）`); continue; }
      const ok = isGoalAchieved(p, ZERO_STATE as never, []);
      if (ok) loose.push(`${p.slug}（${stageOf(p.slug)}）`);
      else guarded.push(p.slug);
    }
    // eslint-disable-next-line no-console
    console.log("\n===== 完成条件审计分类 =====");
    // eslint-disable-next-line no-console
    console.log(`[有实质把关·零状态不通过] 共 ${guarded.length} 个`);
    // eslint-disable-next-line no-console
    console.log(`[宽松·零状态通过·不验证产出] 共 ${loose.length} 个：\n  ${loose.join("\n  ")}`);
    // eslint-disable-next-line no-console
    console.log(`[时间轴·生产中永不触发完成·结构性缺口] 共 ${timelineGap.length} 个：\n  ${timelineGap.join("\n  ")}`);
    // eslint-disable-next-line no-console
    console.log(`[memory 翻牌组件·独立判定] 共 ${memory.length} 个：\n  ${memory.join("\n  ")}`);
    // eslint-disable-next-line no-console
    console.log("==============================\n");
    // 9-12 非时间轴必须全部在 guarded 集合（合理性硬指标）
    const nine12Loose = loose.filter((s) => s.includes("（9-12）"));
    expect(nine12Loose, `存在 9-12 宽松判定（应全部实质把关）：${nine12Loose.join(", ")}`).toEqual([]);
    expect(projects.length).toBeGreaterThan(0);
  });
});

describe("C. 9-12 非时间轴：零状态必须不通过（实质把关）", () => {
  const targets = projects.filter(
    (p) => stageOf(p.slug) === "9-12" && !p.timeline && p.component !== "memory"
  );
  it(`共 ${targets.length} 个 9-12 项目参与`, () => {
    expect(targets.length).toBeGreaterThan(0);
  });
  for (const p of targets) {
    it(`${p.slug}：零状态不判完成`, () => {
      expect(isGoalAchieved(p, ZERO_STATE as never, [])).toBe(false);
    });
  }
});

describe("A. 6-8 非时间轴、非 memory：看示范必须达成目标", () => {
  const targets = projects.filter(
    (p) => stageOf(p.slug) === "6-8" && !p.timeline && p.component !== "memory" && p.defaultXml
  );
  it(`共 ${targets.length} 个 6-8 项目参与`, () => {
    expect(targets.length).toBeGreaterThan(0);
  });
  for (const p of targets) {
    it(`${p.slug} 示范达成目标`, async () => {
      const { logs, finalState } = await withInstantRaf(() => runDemoFull(p.slug));
      const ok = isGoalAchieved(p, finalState as never, logs);
      expect(ok, `示范未通过 isGoalAchieved（logs 末 5 行：${logs.slice(-5).join(" | ")}）`).toBe(true);
    });
  }
});
