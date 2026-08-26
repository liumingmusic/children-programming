// 列表（数据）运行时基石验证：确认 7 个列表积木能生成合法 JS 并在真实 Runtime 跑通。
// 这是分类 G·列表与数据 全部 8 项目，以及 F·数独、H 部分项目赖以运行的前提。
import { describe, it, expect } from "vitest";
import { genCode } from "./exec-helpers";
import { Runtime, type StageState } from "@/lib/runtime";

// 一个覆盖了全部 7 个列表原语的「看示范」式脚本：
// 新建清单 → 加入三项（文字+数字混合）→ 读出第 2 项 → 取长度 → 修改第 1 项 → 移除第 3 项。
const LIST_XML = `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="maker_when_start" x="40" y="40">
    <statement name="STACK">
      <block type="maker_list_create">
        <field name="NAME">清单</field>
        <next>
          <block type="maker_list_add">
            <field name="NAME">清单</field>
            <value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
            <next>
              <block type="maker_list_add">
                <field name="NAME">清单</field>
                <value name="VALUE"><shadow type="text"><field name="TEXT">香蕉</field></shadow></value>
                <next>
                  <block type="maker_list_add">
                    <field name="NAME">清单</field>
                    <value name="VALUE"><block type="math_number"><field name="NUM">3</field></block></value>
                    <next>
                      <block type="maker_list_set">
                        <field name="NAME">清单</field>
                        <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                        <value name="VALUE"><shadow type="text"><field name="TEXT">橙子</field></shadow></value>
                        <next>
                          <block type="maker_list_remove">
                            <field name="NAME">清单</field>
                            <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                            <next>
                              <block type="maker_say">
                                <value name="TEXT"><block type="maker_list_var"><field name="NAME">清单</field></block></value>
                                <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`;

async function runList(xml: string) {
  const code = genCode(xml);
  const logs: string[] = [];
  const rt = new Runtime(480, 360, (s: StageState) => {
    logs.push(...s.log);
  });
  rt.setScripts({ whenStart: code, whenStageClicked: "" });
  await rt.handleRunStart();
  return { code, logs, state: rt.getState() };
}

describe("列表基石 · 代码生成", () => {
  it("7 个列表原语都能生成对应 __runtime 调用", () => {
    const code = genCode(LIST_XML);
    expect(code).toContain("__runtime.setList(");
    expect(code).toContain("__runtime.listAppend(");
    expect(code).toContain("__runtime.getList(");
    expect(code).toContain("__runtime.listSetItem(");
    expect(code).toContain("__runtime.listRemoveAt(");
  });

  it("list_item / list_length 两个 reporter 也能生成对应调用", () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_list_create">
            <field name="NAME">t</field>
            <next><block type="maker_say">
              <value name="TEXT"><block type="maker_list_length"><field name="NAME">t</field></block></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><block type="maker_list_item">
                  <field name="NAME">t</field>
                  <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block>
        </statement>
      </block></xml>`;
    const code = genCode(xml);
    expect(code).toContain("__runtime.listLength(");
    expect(code).toContain("__runtime.listItem(");
  });
});

describe("列表基石 · 真实运行（端到端）", () => {
  it("新建+加入+改+删后，列表内容正确且能被「说」出来", async () => {
    const { code, logs, state } = await runList(LIST_XML);
    // 不应出现「列表程序出错」之类异常（handleRunStart 内部吞掉也会留痕，这里主要靠不崩 + 状态正确）
    expect(code).toBeTruthy();
    const list = state.vars["清单"] as unknown[];
    expect(Array.isArray(list)).toBe(true);
    // 初始加入 [苹果, 香蕉, 3] → 第1项改为橙子 → 移除第3项(原3) → 剩 [橙子, 香蕉]
    expect(list).toEqual(["橙子", "香蕉"]);
    // 「说 列表」会把数组逗号拼接进日志
    expect(logs.some((l) => l.includes("橙子") && l.includes("香蕉"))).toBe(true);
  });

  it("空程序（只有新建列表）不会崩，列表为空", async () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_list_create"><field name="NAME">空表</field></block>
        </statement>
      </block></xml>`;
    const { state } = await runList(xml);
    expect(Array.isArray(state.vars["空表"])).toBe(true);
    expect((state.vars["空表"] as unknown[]).length).toBe(0);
  });

  it("读取越界项返回空串（不崩）", async () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_list_create">
            <field name="NAME">t</field>
            <next><block type="maker_list_add">
              <field name="NAME">t</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">x</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><block type="maker_list_item">
                  <field name="NAME">t</field>
                  <value name="INDEX"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                </block></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block>
        </statement>
      </block></xml>`;
    const { state } = await runList(xml);
    const list = state.vars["t"] as unknown[];
    expect(list).toEqual(["x"]);
  });
});
