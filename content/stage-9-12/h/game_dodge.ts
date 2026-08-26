import type { CourseProject } from "@/courses";

export const gameDodgeProject: CourseProject = {
  slug: "game_dodge",
  category: "game",
  title: "躲避流星",
  ageGroup: "9-12 岁",
  description: "流星（乌云）从天上飘下来，用方向键操控二零左躲右闪，千万别撞上。这是「键盘操控 + 条件判断」的躲避类综合练习。",
  missionBrief:
    "天上有几颗会飘的流星，碰到就糟糕啦！当开始运行时，用「重复执行 100 次」让二零一直「移动 12 步」，并「如果 碰到乌云 那么 说 撞到啦！快躲开！」；再拖「当按下 ← / →」放「转向 ±90」让二零能拐弯。",
  erLingHint:
    "① 当开始运行：「重复执行 100 次」里面放「移动 12 步」再放「如果 碰到乌云 那么 说 撞到啦！快躲开！」；② 当按下 ← / →：转向 ±90 让二零能拐弯；③ 点运行，看流星飘、二零一路躲。",
  steps: [
    { id: 1, title: "用方向键让二零能转向躲避" },
    { id: 2, title: "用「碰到乌云」做躲开判断（条件）" },
    { id: 3, title: "运行看到流星飘动与躲避" },
  ],
  scene: {
    clouds: [
      { x: -90, y: 120, vx: -1, vy: 0.8, r: 34 },
      { x: 80, y: 90, vx: 1.1, vy: 0.6, r: 30 },
      { x: 0, y: 150, vx: -0.8, vy: 1.2, r: 32 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_cloud"></block></value>
              <statement name="DO0"><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">撞到啦！快躲开！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="380">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="480">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
  </xml>`,
};
