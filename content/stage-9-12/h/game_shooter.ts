import type { CourseProject } from "@/courses";

export const gameShooterProject: CourseProject = {
  slug: "game_shooter",
  category: "game",
  title: "飞机大战",
  ageGroup: "9-12 岁",
  description: "敌机（乌云）从天上飘下来，用方向键操控你的飞机瞄准并击落它们。这是「键盘操控 + 碰撞检测 + 变量计分」的射击版综合练习。",
  missionBrief:
    "敌军来袭！当开始运行时，把「得分」设为 0；用「当按下 ← / →」让飞机转向瞄准不同方向；用「当按下 ↑」发射并「如果 碰到乌云 那么 变量 得分 增加 1、说 击落！」。看你能守住多少波！",
  erLingHint:
    "① 当开始运行：设置变量 得分=0；② 当按下 ← / →：转向 ±90 让飞机对准不同方向；③ 当按下 ↑：如果 碰到乌云 那么 变量 得分 增加 1、说 击落！；④ 点运行，用 ← → 转向、↑ 发射。",
  steps: [
    { id: 1, title: "用方向键让飞机移动和转向" },
    { id: 2, title: "碰到乌云就击落并加分（碰撞检测 + 变量）" },
    { id: 3, title: "运行看到敌机被击落、得分增加" },
  ],
  scene: {
    clouds: [
      { x: -90, y: 120, vx: -0.6, vy: 0.7, r: 32 },
      { x: 90, y: 120, vx: 0.6, vy: 0.7, r: 32 },
      { x: 0, y: 150, vx: 0, vy: 0.9, r: 30 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var"><field name="NAME">得分</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="140">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="controls_if">
          <value name="IF0"><block type="maker_touching_cloud"></block></value>
          <statement name="DO0">
            <block type="maker_change_var"><field name="NAME">得分</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">击落！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="280">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="380">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
  </xml>`,
};
