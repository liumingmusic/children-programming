import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { computeSteps } from "@/lib/steps";
import { getProject } from "@/courses";

// rainbow 示范（看示范）实际会生成的 JS 代码形态
// 注意：生成的代码里只有 __runtime.move / __runtime.turn / for 循环，
// 绝不会出现积木类型名 controls_repeat_ext / maker_move / maker_turn。
const RAINBOW_DEMO_CODE = `for (var count = 0; count < 36; count++) {
  __runtime.penDown();
  __runtime.move(10);
  __runtime.turn(10);
  __runtime.changePenColor(10);
}
`;
const RAINBOW_LOGS = [
  "[系统] 开始执行程序",
  "[系统] 画笔落下",
  "[系统] 画笔颜色改变",
  "[系统] 二零开始移动",
  "[系统] 二零开始转向",
  "[系统] 程序执行完毕",
];

const HELLO_DEMO_CODE = `__runtime.move(100);
__runtime.say("你好！我是二零", 2);
`;
const HELLO_LOGS = [
  "[系统] 开始执行程序",
  "[系统] 二零开始移动",
  "[二零] 你好！我是二零",
  "[系统] 程序执行完毕",
];

const STARS_DEMO_CODE = `__runtime.gotoMouse();
if (__runtime.touchingStar()) {
  __runtime.say("收集到啦！", 1);
}
`;
const STARS_LOGS = [
  "[系统] 舞台被点击，执行事件",
  "[二零] 收集到啦！",
  "[系统] 恭喜！所有星星都收集完了",
  "[系统] 程序执行完毕",
];

describe("computeSteps —— 步骤判定（修复 rainbow 第2步用积木类型名导致永不完成）", () => {
  it("rainbow 示范：三步都应判合格", () => {
    const project = getProject("rainbow")!;
    const st = computeSteps(project, RAINBOW_DEMO_CODE, RAINBOW_LOGS);
    expect(st).toHaveLength(3);
    expect(st.every((s) => s.done)).toBe(true);
    expect(st.map((s) => s.done)).toEqual([true, true, true]);
  });

  it("rainbow：只用 move+turn 而没有循环，第2步应不合格（必须真用循环）", () => {
    const project = getProject("rainbow")!;
    const codeNoLoop = `__runtime.penDown();
__runtime.move(10);
__runtime.turn(10);
__runtime.changePenColor(10);
`;
    const st = computeSteps(project, codeNoLoop, ["[系统] 程序执行完毕"]);
    expect(st[1].done).toBe(false); // 第2步：缺循环
    expect(st[0].done).toBe(true); // 第1步：落笔+变色
    expect(st[2].done).toBe(true); // 第3步：跑完
  });

  it("rainbow：用 while 循环也应判合格（更宽松的循环检测）", () => {
    const project = getProject("rainbow")!;
    const code = `while (true) {
  __runtime.move(10);
  __runtime.turn(10);
}
`;
    const st = computeSteps(project, code, ["[系统] 程序执行完毕"]);
    expect(st[1].done).toBe(true);
  });

  it("hello 示范：三步都应判合格", () => {
    const project = getProject("hello")!;
    const st = computeSteps(project, HELLO_DEMO_CODE, HELLO_LOGS);
    expect(st.every((s) => s.done)).toBe(true);
  });

  it("stars 示范：前两步判合格（第3步需点击收集，仅运行不触发属正常）", () => {
    const project = getProject("stars")!;
    const st = computeSteps(project, STARS_DEMO_CODE, STARS_LOGS);
    expect(st[0].done).toBe(true); // 当舞台被点击 + 移到鼠标
    expect(st[1].done).toBe(true); // 如果碰到星星
    expect(st[2].done).toBe(true); // 收集完（这里给了完整日志）
  });
});

// 第一批绘图项目（正方形 / 三角形 / 五角星 / 花朵）示范会生成的 JS 形态
const SQUARE_DEMO = `__runtime.penDown();
for (var count = 0; count < 4; count++) {
  __runtime.move(100);
  __runtime.turn(90);
}
__runtime.penUp();
`;
const TRIANGLE_DEMO = `__runtime.penDown();
for (var count = 0; count < 3; count++) {
  __runtime.move(100);
  __runtime.turn(120);
}
__runtime.penUp();
`;
const STAR5_DEMO = `__runtime.penDown();
for (var count = 0; count < 5; count++) {
  __runtime.move(100);
  __runtime.turn(144);
}
__runtime.penUp();
`;
const FLOWER_DEMO = `__runtime.penDown();
for (var i = 0; i < 6; i++) {
  for (var j = 0; j < 2; j++) {
    __runtime.move(50);
    __runtime.turn(60);
  }
  __runtime.turn(60);
}
`;
const DRAW_LOGS = [
  "[系统] 开始执行程序",
  "[系统] 画笔落下",
  "[系统] 二零开始移动",
  "[系统] 二零开始转向",
  "[系统] 程序执行完毕",
];

describe("computeSteps —— 第一批绘图项目（正方形/三角形/五角星/花朵）", () => {
  for (const [slug, demo] of [
    ["square", SQUARE_DEMO],
    ["triangle", TRIANGLE_DEMO],
    ["star5", STAR5_DEMO],
    ["flower", FLOWER_DEMO],
  ] as const) {
    it(`${slug} 示范：三步都应判合格`, () => {
      const project = getProject(slug)!;
      const st = computeSteps(project, demo, DRAW_LOGS);
      expect(st).toHaveLength(3);
      expect(st.map((s) => s.done)).toEqual([true, true, true]);
    });

    it(`${slug}：只放 move+turn 而没有循环，第2步应不合格`, () => {
      const project = getProject(slug)!;
      const codeNoLoop = `__runtime.penDown();
__runtime.move(100);
__runtime.turn(90);
`;
      const st = computeSteps(project, codeNoLoop, ["[系统] 程序执行完毕"]);
      expect(st[0].done).toBe(true); // 第1步：落笔
      expect(st[1].done).toBe(false); // 第2步：缺循环
      expect(st[2].done).toBe(true); // 第3步：跑完
    });

    it(`${slug}：没落笔，第1步应不合格`, () => {
      const project = getProject(slug)!;
      const codeNoPen = `for (var count = 0; count < 4; count++) {
  __runtime.move(100);
  __runtime.turn(90);
}
`;
      const st = computeSteps(project, codeNoPen, ["[系统] 程序执行完毕"]);
      expect(st[0].done).toBe(false); // 第1步：没落笔
      expect(st[1].done).toBe(true); // 第2步：有循环+移动+转向
      expect(st[2].done).toBe(true); // 第3步：跑完
    });
  }
});

// 分类一：基础序列与方向（SEQ_SLUGS）—— 看示范生成的真实代码必须让三步都判合格
const SEQ_SLUGS = ["flag", "stone", "shapeL", "home", "maze", "arrow", "zigzag", "treasure", "dance", "frame"];

function seqGenCode(xml: string): string {
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

describe("computeSteps —— 分类一序列类（看示范真实生成代码必须走完三步）", () => {
  for (const slug of SEQ_SLUGS) {
    it(`${slug} 的看示范生成的真实 JS 让三步都判合格`, () => {
      const project = getProject(slug)!;
      expect(project.defaultXml).toBeTruthy();
      let code = "";
      expect(() => {
        code = seqGenCode(project.defaultXml!);
      }).not.toThrow();
      const st = computeSteps(project, code, ["[系统] 程序执行完毕"]);
      expect(st).toHaveLength(3);
      expect(st.map((s) => s.done)).toEqual([true, true, true]);
    });

    it(`${slug}：只有前进没有转向，第2步应不合格`, () => {
      const project = getProject(slug)!;
      const code = `__runtime.penDown();\n__runtime.move(100);\n__runtime.move(100);\n`;
      const st = computeSteps(project, code, ["[系统] 程序执行完毕"]);
      expect(st[0].done).toBe(true);
      expect(st[1].done).toBe(false);
      expect(st[2].done).toBe(true);
    });
  }
});

// 分类2/3 新增项目（共 15 项）：看示范真实生成的 JS 必须让三步都判合格
const NEW_DRAW_SLUGS = [
  "pentagon", "spin", "stairs", "wave", "spiral", "fence", "windmill", "pickfruit",
  "snowflake", "mandala", "concentric", "connectdot", "house", "letter", "checkerboard",
];

describe("computeSteps —— 分类2/3 新增项目（看示范真实生成代码必须走完三步）", () => {
  for (const slug of NEW_DRAW_SLUGS) {
    it(`${slug} 的看示范生成的真实 JS 让三步都判合格`, () => {
      const project = getProject(slug)!;
      expect(project.defaultXml).toBeTruthy();
      let code = "";
      expect(() => {
        code = seqGenCode(project.defaultXml!);
      }).not.toThrow();
      const st = computeSteps(project, code, ["[系统] 程序执行完毕"]);
      expect(st).toHaveLength(3);
      expect(st.map((s) => s.done)).toEqual([true, true, true]);
    });

    it(`${slug}：只放 move+turn 而没有循环，第2步应不合格`, () => {
      const project = getProject(slug)!;
      const codeNoLoop = `__runtime.penDown();\n__runtime.move(100);\n__runtime.turn(90);\n`;
      const st = computeSteps(project, codeNoLoop, ["[系统] 程序执行完毕"]);
      expect(st[0].done).toBe(true);
      expect(st[1].done).toBe(false);
      expect(st[2].done).toBe(true);
    });

    it(`${slug}：没落笔，第1步应不合格`, () => {
      const project = getProject(slug)!;
      const codeNoPen = `for (var count = 0; count < 4; count++) {\n  __runtime.move(100);\n  __runtime.turn(90);\n}\n`;
      const st = computeSteps(project, codeNoPen, ["[系统] 程序执行完毕"]);
      expect(st[0].done).toBe(false);
      expect(st[1].done).toBe(true);
      expect(st[2].done).toBe(true);
    });
  }
});
