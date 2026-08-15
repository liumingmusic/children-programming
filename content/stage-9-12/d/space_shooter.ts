import type { CourseProject } from "@/courses";

export const spaceShooterProject: CourseProject = {
  slug: "space_shooter",
  category: "key",
  title: "太空射击入门",
  ageGroup: "9-12 岁",
  description: "敌人飞船从天上飘下来，用键盘操控你的飞船瞄准并击落它们。",
  missionBrief:
    "敌军从顶部来袭！写一个操控程序：用「当按下 ← / →」转向瞄准，用「当按下 ↑」发射激光——一旦激光碰到敌人（乌云）就算击落、分数 +1。看你能守住多少波！",
  erLingHint:
    "① 拖「当开始运行」放「把变量 score 设为 0」；② 拖「当按下 ← / →」放「转向 ±90」让飞船对准不同方向；③ 拖「当按下 ↑」放「如果 碰到乌云 那么 变量 score 增加 1、说 击落！」；④ 点运行，用 ← → 转向、↑ 发射，击落飘下来的敌人。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件操控与瞄准" },
    { id: 2, title: "用「碰到乌云」判断并发射击落敌人" },
    { id: 3, title: "运行看到敌人被击落与加分" },
  ],
  scene: {
    clouds: [
      { x: -90, y: 120, vx: -0.8, vy: 0.7, r: 32 },
      { x: 90, y: 120, vx: 0.8, vy: 0.7, r: 32 },
      { x: 0, y: 150, vx: 0, vy: 0.9, r: 30 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var"><field name="NAME">score</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="140">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="260">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="380">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="controls_if">
          <value name="IF0"><block type="maker_touching_cloud"></block></value>
          <statement name="DO0">
            <block type="maker_change_var"><field name="NAME">score</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">击落！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
