import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks } from "@/lib/blockly-blocks";
import { collectScripts } from "@/lib/scripts";
import { projects } from "@/courses";

// 真实 eval 回归：验证「定义了函数、在事件脚本里调用」不再抛 ReferenceError。
// 这正是线上 bug 的复现——旧实现丢弃顶层定义积木，调用时函数未定义。

function makeRuntimeStub() {
  // 用 Proxy 兜底：任何 __runtime.xxx(...) 调用都返回 no-op，确保函数体里调用的
  // move/turn/pen/say/wait 等方法在「仅验证函数可见性、不验证运行效果」时不会抛错。
  const calls: string[] = [];
  const target: Record<string, unknown> = { calls, log: (s: string) => calls.push(s) };
  return new Proxy(target, {
    get(t, prop: string) {
      if (prop in t) return (t as Record<string, unknown>)[prop];
      // 任意未知方法 → no-op
      return () => {};
    },
  });
}

function runCode(code: string, rt: ReturnType<typeof makeRuntimeStub>) {
  // 复用运行时 wrap：每个脚本是独立 IIFE，__runtimeArg 注入桩。
  const wrapped = `(function(__runtime) {\n${code}\n})(__runtimeArg);`;
  // eslint-disable-next-line no-eval
  (eval as unknown as (s: string) => void)(wrapped);
}

describe("函数积木：定义后可被事件脚本调用（真实 eval）", () => {
  it("自定义「我的积木」定义后，当开始运行里调用不抛 ReferenceError", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const xml = `
      <xml>
        <block type="maker_func_def" x="20" y="20">
          <field name="NAME">我的积木</field>
          <statement name="DO">
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">hi</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block>
          </statement>
        </block>
        <block type="maker_when_start" x="20" y="200">
          <statement name="STACK">
            <block type="maker_func_call">
              <field name="NAME">我的积木</field>
            </block>
          </statement>
        </block>
      </xml>`;
    const dom = Blockly.utils.xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, ws);

    const { whenStart } = collectScripts(ws);
    ws.dispose();

    expect(whenStart).toContain("function 我的积木");
    expect(whenStart).toContain("我的积木();");

    const rt = makeRuntimeStub();
    (globalThis as Record<string, unknown>).__runtimeArg = rt;
    expect(() => runCode(whenStart, rt)).not.toThrow();
  });

  it("fn_square 默认 xml：真实 eval 不抛错（含函数定义前置）", () => {
    registerCustomBlocks();
    const p = projects.find((x) => x.slug === "fn_square")!;
    expect(p.defaultXml).toBeTruthy();
    const ws = new Blockly.Workspace();
    const dom = Blockly.utils.xml.textToDom(p.defaultXml!);
    Blockly.Xml.domToWorkspace(dom, ws);
    const { whenStart } = collectScripts(ws);
    ws.dispose();

    expect(whenStart).toContain("function ");
    expect(whenStart).toContain("();");

    const rt = makeRuntimeStub();
    (globalThis as Record<string, unknown>).__runtimeArg = rt;
    expect(() => runCode(whenStart, rt)).not.toThrow();
  });

  it("当舞台被点击脚本里调用函数，函数定义同样前置可见", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const xml = `
      <xml>
        <block type="maker_func_def" x="20" y="20">
          <field name="NAME">跳一下</field>
          <statement name="DO"><block type="maker_wait"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></statement>
        </block>
        <block type="maker_when_stage_clicked" x="20" y="200">
          <statement name="STACK"><block type="maker_func_call"><field name="NAME">跳一下</field></block></statement>
        </block>
      </xml>`;
    const dom = Blockly.utils.xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(dom, ws);
    const { whenStageClicked } = collectScripts(ws);
    ws.dispose();

    expect(whenStageClicked).toContain("function 跳一下");
    expect(whenStageClicked).toContain("跳一下();");

    const rt = makeRuntimeStub();
    (globalThis as Record<string, unknown>).__runtimeArg = rt;
    expect(() => runCode(whenStageClicked, rt)).not.toThrow();
  });
});
