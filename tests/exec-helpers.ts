// 端到端执行测试共享 helper：用真实 Blockly 把「看示范」defaultXml 转成 JS，
// 再用真实 Runtime 跑一遍，收集最终状态与日志。
// 用途：验证「看示范」不是摆设——真能执行、真能画出笔画、几何正确（不跑偏）。
import { vi } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime, type StageState, type Species } from "@/lib/runtime";
import { computeSteps } from "@/lib/steps";
import { getProject, type CourseProject } from "@/courses";

// 伙伴角色元数据（与 Runtime 的 companions 构造一致；仅需 id→species/name 映射）。
// 新增伙伴角色时在此补一条即可，exec 测试会自动把 project.cast 里的角色实例化出来。
const CAST_SPECIES: Record<string, { species: Species; name: string }> = {
  sanqi: { species: "sanqi", name: "三七" },
};
function companionsFor(project: CourseProject) {
  return (project.cast ?? []).map((id) => ({
    id,
    species: (CAST_SPECIES[id]?.species ?? "erling") as Species,
    name: CAST_SPECIES[id]?.name ?? id,
  }));
}

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
  }, initialStars, { companions: companionsFor(project) });
  rt.setScripts({ whenStart: code, whenStageClicked: "" });
  await rt.handleRunStart();
  const finalState = rt.getState();
  const steps = computeSteps(project, code, logs);
  return { code, logs, finalState, steps };
}

// 按「帽子积木类型」把 defaultXml 拆成各事件脚本（与线上 BlocklyEditor.run 同逻辑），
// 用于把 click / key 类项目的「看示范」也真正跑起来（runDemo 只跑 whenStart）。
export function genScripts(xml: string): {
  whenStart: string;
  whenStageClicked: string;
  whenKeyPressed: { key: string; code: string }[];
} {
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
  // 单块 blockToCode 不会自动初始化生成器的变量表（variableDB_），
  // 而「重复执行」这类循环积木在生成时需要它，否则会抛 getDistinctName 错误。
  // 这里手动 init / finish，与 workspaceToCode 内部一致。
  javascriptGenerator.init(ws);
  const topBlocks = ws.getTopBlocks(true);
  let whenStart = "";
  let whenStageClicked = "";
  const whenKeyPressed: { key: string; code: string }[] = [];
  for (const block of topBlocks) {
    const type = block.type;
    if (type === "maker_when_start") {
      whenStart = javascriptGenerator.blockToCode(block).toString();
    } else if (type === "maker_when_stage_clicked") {
      whenStageClicked = javascriptGenerator.blockToCode(block).toString();
    } else if (type === "maker_when_key_pressed") {
      const key = block.getFieldValue("KEY") || "up";
      whenKeyPressed.push({ key, code: javascriptGenerator.blockToCode(block).toString() });
    }
  }
  javascriptGenerator.finish();
  ws.dispose();
  return { whenStart, whenStageClicked, whenKeyPressed };
}

// 把某项目（含 click / key / 收集类）的「看示范」真实跑一遍：
// 用 project.stars 作为可收集目标，并自动触发一次「点击 / 按键」以模拟演示。
export async function runDemoFull(slug: string) {
  const project = getProject(slug)!;
  const { whenStart, whenStageClicked, whenKeyPressed } = genScripts(project.defaultXml!);
  const code =
    whenStart + "\n" + whenStageClicked + "\n" + whenKeyPressed.map((k) => k.code).join("\n");
  const logs: string[] = [];
  const initialStars = project.stars
    ? project.stars.map((s, i) => ({ id: i + 1, x: s.x, y: s.y, collected: false }))
    : undefined;
  const hazards = project.scene?.marks
    ?.filter((m) => m.kind === "obstacle" || m.kind === "badguy")
    .map((m) => ({ x: m.x, y: m.y, r: 32, kind: m.kind as "obstacle" | "badguy" })) ?? [];
  const clouds = project.scene?.clouds ?? [];
  const rt = new Runtime(
    480,
    360,
    (s: StageState) => {
      logs.push(...s.log);
    },
    initialStars,
    { hazards, clouds, companions: companionsFor(project) }
  );
  rt.setScripts({ whenStart, whenStageClicked, whenKeyPressed });
  await rt.handleRunStart();
  // 与线上 BlocklyEditor.run 一致：有点击脚本就自动点一下，否则有按键脚本就自动按一下
  if (whenStageClicked) await rt.handleStageClick(0, 0);
  else if (whenKeyPressed.length) await rt.handleKeyPressed(whenKeyPressed[0].key);
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
