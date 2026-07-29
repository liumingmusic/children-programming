// 端到端执行测试共享 helper：用真实 Blockly 把「看示范」defaultXml 转成 JS，
// 再用真实 Runtime 跑一遍，收集最终状态与日志。
// 用途：验证「看示范」不是摆设——真能执行、真能画出笔画、几何正确（不跑偏）。
import { vi } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime, type StageState } from "@/lib/runtime";
import { computeSteps } from "@/lib/steps";
import { getProject } from "@/courses";

// 用「真实 Blockly」把 defaultXml 转成 JS（和线上运行时同一套代码生成）
export function genCode(xml: string): string {
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
// 测试里把它桩成立刻跳到终点，避免真实时长等待。
export function withInstantRaf(run: () => Promise<void>) {
  const original = globalThis.requestAnimationFrame;
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now() + 1e7), 0) as unknown as number
  );
  return run().finally(() => vi.stubGlobal("requestAnimationFrame", original));
}

// 把某项目的「看示范」代码真正在 Runtime 里跑一遍，过程/结果全收集
export async function runDemo(slug: string, initialStars: [] | undefined = []) {
  const project = getProject(slug)!;
  const code = genCode(project.defaultXml!);
  const logs: string[] = [];
  const rt = new Runtime(480, 360, (s: StageState) => {
    logs.push(...s.log);
  }, initialStars);
  rt.setScripts({ whenStart: code, whenStageClicked: "" });
  await rt.handleRunStart();
  const finalState = rt.getState();
  const steps = computeSteps(project, code, logs);
  return { code, logs, finalState, steps };
}

// 画布上所有笔画的总点数（判断「到底画了没有」）
export function totalPoints(finalState: StageState): number {
  return finalState.penPaths.reduce((n, p) => n + p.points.length, 0);
}

// 角度归一化到 [0,360)
export function normAngle(a: number): number {
  return ((a % 360) + 360) % 360;
}
