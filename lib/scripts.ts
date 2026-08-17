// 从 Blockly 工作区收集「可执行的事件脚本」并修复自定义函数积木的可见性。
//
// 背景（9-12 阶段函数积木的致命 bug）：
//   maker_func_def（定义积木）与 maker_when_start / when_stage_clicked / 按键 / 广播
//   是「并列的顶层积木」。旧实现只提取事件积木的代码传给运行时，
//   函数定义被整体丢弃 —— 于是事件脚本里调用「我的积木()」时，函数根本没定义，
//   直接 ReferenceError: 我的积木 is not defined（即使孩子明明定义了函数）。
//
// 修复：把全部顶层「定义积木」的函数声明聚合成一段 prefix，前置到「每一个」事件脚本之前。
//   因为 JS 函数声明会 hoist，调用写在定义之前也能执行；函数体内调用自己（递归）也天然成立。
//   这样：在 when_start 里调用、在 when_stage_clicked 里调用、在按键里调用、在递归里调用，全部可见。

import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

export interface CollectedScripts {
  fnPrefix: string;
  whenStart: string;
  whenStageClicked: string;
  whenKeyPressed: { key: string; code: string }[];
  whenReceived: { message: string; code: string }[];
}

/** 顶层积木里属于「定义积木」的，返回其生成的 function 声明串。 */
function collectFnDefinitions(workspace: Blockly.Workspace): string {
  const defs: string[] = [];
  for (const block of workspace.getTopBlocks(true)) {
    if (block.type === "maker_func_def") {
      const code = javascriptGenerator.blockToCode(block).toString();
      if (code.trim()) defs.push(code);
    }
  }
  return defs.join("\n");
}

/** 把一个事件脚本用 fnPrefix 包起来（仅当脚本非空，避免污染空脚本）。 */
function withFnPrefix(prefix: string, script: string): string {
  if (!script || !script.trim()) return script;
  return `${prefix}\n${script}`;
}

/**
 * 从工作区收集全部事件脚本 + 函数定义前缀。
 * 抽成纯函数，供 BlocklyEditor.run 与测试共用，确保「函数可见性」只由一处逻辑决定。
 */
export function collectScripts(workspace: Blockly.Workspace): CollectedScripts {
  // 确保 generator 已针对该 workspace 初始化（headless 测试或编辑器未预跑时都需要）。
  javascriptGenerator.init(workspace);
  const fnPrefix = collectFnDefinitions(workspace);

  let whenStart = "";
  let whenStageClicked = "";
  const whenKeyPressed: { key: string; code: string }[] = [];
  const whenReceived: { message: string; code: string }[] = [];

  for (const block of workspace.getTopBlocks(true)) {
    const type = block.type;
    if (type === "maker_when_start") {
      whenStart += javascriptGenerator.blockToCode(block).toString();
    } else if (type === "maker_when_stage_clicked") {
      whenStageClicked += javascriptGenerator.blockToCode(block).toString();
    } else if (type === "maker_when_key_pressed") {
      const key = block.getFieldValue("KEY") || "up";
      whenKeyPressed.push({ key, code: javascriptGenerator.blockToCode(block).toString() });
    } else if (type === "maker_when_receive") {
      const msg = block.getFieldValue("MSG") || "出发";
      whenReceived.push({ message: msg, code: javascriptGenerator.blockToCode(block).toString() });
    }
  }

  return {
    fnPrefix,
    whenStart: withFnPrefix(fnPrefix, whenStart),
    whenStageClicked: withFnPrefix(fnPrefix, whenStageClicked),
    whenKeyPressed: whenKeyPressed.map((k) => ({ key: k.key, code: withFnPrefix(fnPrefix, k.code) })),
    whenReceived: whenReceived.map((r) => ({ message: r.message, code: withFnPrefix(fnPrefix, r.code) })),
  };
}
