import type { CourseProject } from "@/courses";

export const dodgeFallProject: CourseProject = {
  slug: "dodge_fall",
  category: "key",
  title: "躲避下落物",
  ageGroup: "9-12 岁",
  description: "乌云从天上飘下来，用键盘方向键操控二零左躲右闪，千万别撞上。",
  missionBrief:
    "天上有几朵会飘的乌云，碰到就糟糕啦！写一个操控程序：用「当按下」方向键让二零移动或转向，一「碰到乌云」就赶紧拐弯躲开。",
  erLingHint:
    "① 拖「当开始运行」放「重复执行 100 次」，里面放「移动 12 步」再放「如果 碰到乌云 那么 说 撞到啦！快躲开！」；② 再拖「当按下 ← / →」放「转向 ±90」让二零能拐弯；③ 点运行，看乌云飘、二零一路躲。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件" },
    { id: 2, title: "用「碰到乌云」做躲开判断（条件）" },
    { id: 3, title: "运行看到乌云飘动与躲避" },
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
