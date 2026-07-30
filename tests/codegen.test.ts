import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { getProject } from "@/courses";

/**
 * 用「真实的 Blockly」把每个项目的 defaultXml（即「看示范」内容）
 * 真正转成 JavaScript，确保孩子点「看示范」后能看到形状，而不只是步骤判定通过。
 * 这复刻了 BlocklyEditor 的运行路径（inject → domToWorkspace → workspaceToCode）。
 */
function loadAndGenCode(xml: string): string {
  registerCustomBlocks();
  const div = document.createElement("div");
  document.body.appendChild(div);
  const workspace = Blockly.inject(div, {
    toolbox: TOOLBOX,
    grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
    zoom: { controls: true, wheel: true, startScale: 0.85 },
    trashcan: true,
    theme: Blockly.Themes.Classic,
  });
  workspace.clear();
  const dom = Blockly.utils.xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(dom, workspace);
  const code = javascriptGenerator.workspaceToCode(workspace).toString();
  workspace.dispose();
  return code;
}

describe("第一批绘图项目 defaultXml 真实生成 JS（看示范必须能跑）", () => {
  for (const slug of ["square", "triangle", "star5", "flower"]) {
    it(`${slug} 的 defaultXml 能生成含正确标记的 JS 且不报错`, () => {
      const project = getProject(slug)!;
      expect(project.defaultXml).toBeTruthy();
      let code = "";
      expect(() => {
        code = loadAndGenCode(project.defaultXml!);
      }).not.toThrow();

      // 画图必备：落笔 + 移动 + 转向
      expect(code).toContain("__runtime.penDown()");
      expect(code).toContain("__runtime.move(");
      expect(code).toContain("__runtime.turn(");

      // 画图必备：循环（正方形/三角形/五角星用单层循环，花朵用嵌套循环）
      if (slug === "flower") {
        expect((code.match(/for\s*\(/g) || []).length).toBeGreaterThanOrEqual(2);
      } else {
        expect(code).toMatch(/for\s*\(/);
      }
    });
  }
});

describe("分类一序列类项目 defaultXml 真实生成 JS（看示范必须能跑）", () => {
  const SEQ = ["flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame"];
  for (const slug of SEQ) {
    it(`${slug} 的 defaultXml 能生成含 move/turn 的 JS 且不报错`, () => {
      const project = getProject(slug)!;
      expect(project.defaultXml).toBeTruthy();
      let code = "";
      expect(() => {
        code = loadAndGenCode(project.defaultXml!);
      }).not.toThrow();
      expect(code).toContain("__runtime.move(");
      expect(code).toContain("__runtime.turn(");
    });
  }
});

describe("左转积木 maker_turn_left 生成器", () => {
  it("左转应生成 __runtime.turn(-N)（负角度 = 向左转）", () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_turn_left"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
        </statement>
      </block>
    </xml>`;
    let code = "";
    expect(() => { code = loadAndGenCode(xml); }).not.toThrow();
    expect(code).toContain("__runtime.turn(-90)");
  });
});

// 分类2/3 新增项目（共 15 项）：defaultXml 必须能真实生成含正确标记的 JS
const NEW_DRAW_SLUGS = [
  "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit",
  "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard",
];
const NESTED_SLUGS = ["wave", "mandala", "checkerboard", "spiral", "concentric"];

describe("分类2/3 新增项目 defaultXml 真实生成 JS（看示范必须能跑）", () => {
  for (const slug of NEW_DRAW_SLUGS) {
    it(`${slug} 的 defaultXml 能生成含正确标记的 JS 且不报错`, () => {
      const project = getProject(slug)!;
      expect(project.defaultXml).toBeTruthy();
      let code = "";
      expect(() => {
        code = loadAndGenCode(project.defaultXml!);
      }).not.toThrow();
      expect(code).toContain("__runtime.penDown()");
      expect(code).toContain("__runtime.move(");
      expect(code).toContain("__runtime.turn(");
      expect(code).toMatch(/for\s*\(/);
    });
  }
  for (const slug of NESTED_SLUGS) {
    it(`${slug} 的 defaultXml 应含嵌套/多段循环（>=2 个 for）`, () => {
      const project = getProject(slug)!;
      const code = loadAndGenCode(project.defaultXml!);
      expect((code.match(/for\s*\(/g) || []).length).toBeGreaterThanOrEqual(2);
    });
  }
});
