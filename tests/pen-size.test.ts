import { describe, it, expect } from "vitest";
import { Runtime, type StageState } from "@/lib/runtime";
import { genCode, withInstantRaf } from "./exec-helpers";

// 一个用「设置画笔粗细为 8」的积木串：落笔 → 设粗细 8 → 移动。
// 用来验证线宽积木既能被 Blockly 正确生成 JS，也能在真实 Runtime 里改变 penSize 与笔画 width。
const PEN_SIZE_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="maker_when_start" x="20" y="20">
    <statement name="STACK">
      <block type="maker_pen_down">
        <next>
          <block type="maker_pen_set_size">
            <value name="SIZE"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
            <next>
              <block type="maker_move">
                <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`;

describe("线宽积木 maker_pen_set_size", () => {
  it("能生成 __runtime.setPenSize(8) 的 JS", () => {
    const code = genCode(PEN_SIZE_XML);
    expect(code).toContain("__runtime.setPenSize(8)");
  });

  it("运行后运行时 penSize 变为 8，且产生的笔画 width=8", async () => {
    const code = genCode(PEN_SIZE_XML);
    let final: StageState | null = null;
    const rt = new Runtime(480, 360, (s) => {
      final = s;
    });
    rt.setScripts({ whenStart: code, whenStageClicked: "" });
    await withInstantRaf(async () => {
      await rt.handleRunStart();
    });
    expect(final).not.toBeNull();
    expect(final!.penSize).toBe(8);
    // 至少有一条笔画记录了 width=8（默认未设时是 3，这里应被改成 8）
    expect(final!.penPaths.some((p) => p.width === 8)).toBe(true);
  });

  it("不放线宽积木时，笔画默认 width=3", async () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next>
          </block>
        </statement>
      </block>
    </xml>`;
    const code = genCode(xml);
    let final: StageState | null = null;
    const rt = new Runtime(480, 360, (s) => {
      final = s;
    });
    rt.setScripts({ whenStart: code, whenStageClicked: "" });
    await withInstantRaf(async () => {
      await rt.handleRunStart();
    });
    expect(final!.penSize).toBe(3);
    expect(final!.penPaths.every((p) => p.width === 3)).toBe(true);
  });
});
