import { describe, it, expect, vi } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime, type StageState } from "@/lib/runtime";
import { computeSteps } from "@/lib/steps";
import { getProject } from "@/courses";

// 用「真实 Blockly」把 defaultXml（看示范内容）转成 JS
function genCode(xml: string): string {
  registerCustomBlocks();
  const div = document.createElement("div");
  document.body.appendChild(div);
  const ws = Blockly.inject(div, {
    toolbox: TOOLBOX,
    grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
    zoom: { controls: true, wheel: true, startScale: 0.85 },
    trashcan: true,
    theme: Blockly.Themes.Classic,
  });
  ws.clear();
  const dom = Blockly.utils.xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(dom, ws);
  const code = javascriptGenerator.workspaceToCode(ws).toString();
  ws.dispose();
  return code;
}

// 让动画即时完成：runtime 用 requestAnimationFrame 按真实时长播放，
// 测试里把它桩成立刻结束，避免真实时长等待。
function withInstantRaf(run: () => Promise<void>) {
  const original = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => vi.stubGlobal("requestAnimationFrame", original));
}

// 把某项目的「看示范」代码真正在 Runtime 里跑一遍，过程/结果全收集
async function runDemo(slug: string) {
  const project = getProject(slug)!;
  const code = genCode(project.defaultXml!);
  const logs: string[] = [];
  const rt = new Runtime(480, 360, (s: StageState) => {
    logs.push(...s.log);
  }, []); // 非 stars 项目隐藏默认星星
  rt.setScripts({ whenStart: code, whenStageClicked: "" });
  await rt.handleRunStart();
  const finalState = rt.getState();
  const steps = computeSteps(project, code, logs);
  return { code, logs, finalState, steps };
}

// 有「目标点」的项目：演员最终必须停在目标 emoji 处（这才是「走到了」）
// 注意：初始朝向已改为 angle=270（朝上），场景坐标同步做了 180° 镜像，
// 故目标点取镜像后的坐标（x→-x, y→-y）。
const GOALS: Record<string, { x: number; y: number }> = {
  flag: { x: 80, y: -80 },
  shapeL: { x: 100, y: -100 },
  home: { x: 120, y: -80 },
  maze: { x: 80, y: 0 },
  arrow: { x: 100, y: -100 },
  treasure: { x: 70, y: -90 },
  stone: { x: -100, y: -75 }, // 绕过小石头后到达的终点🏁
};

const SEQ = ["flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame"];

describe("分类一·端到端真实运行（看示范必须真能跑到目标）", () => {
  for (const slug of SEQ) {
    it(`${slug}：看示范代码能真实跑完、不报错、三步判定全亮`, async () => {
      await withInstantRaf(async () => {
        const { logs, finalState, steps } = await runDemo(slug);
        // 1) 真实执行无异常、收尾
        expect(logs.some((l) => l.includes("程序执行完毕"))).toBe(true);
        // 2) 三步进度全部完成（孩子点运行/看示范后弹「完成」）
        expect(steps.every((s) => s.done)).toBe(true);
        // 3) 有目标点的项目：演员必须停到目标坐标
        const goal = GOALS[slug];
        if (goal) {
          expect(finalState.actor.x).toBeCloseTo(goal.x, 5);
          expect(finalState.actor.y).toBeCloseTo(goal.y, 5);
        }
      });
    });
  }

  it("stone：演员路径全程不压到小石头（绕行成立）", async () => {
    await withInstantRaf(async () => {
      const { finalState } = await runDemo("stone");
      // 小石头经 180° 镜像后位于 (0,-75)；路径终点在 (-100,-75)
      const stone = { x: 0, y: -75 };
      const d = Math.hypot(finalState.actor.x - stone.x, finalState.actor.y - stone.y);
      expect(d).toBeGreaterThan(35);
    });
  });
});
