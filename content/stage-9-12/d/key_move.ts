import type { CourseProject } from "@/courses";

export const keyMoveProject: CourseProject = {
  slug: "key_move",
  category: "key",
  title: "方向键控制移动",
  ageGroup: "9-12 岁",
  description: "用键盘方向键实时操控二零移动与转向，像玩一个小游戏。",
  missionBrief:
    "写一个操控程序：用「当按下」方向键事件，让二零随你的按键移动或转向。试试 ↑ 前进、← → 转向，把二零开到你想要的地方！",
  erLingHint:
    "① 拖几个「当按下」事件（↑ ↓ ← →）；② 在「↑ 上」里放「移动 40」，在「← 左 / → 右」里放「转向 90」；③ 点运行后，用键盘方向键操控二零（看示范会自动按几下演示）。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件" },
    { id: 2, title: "让二零随按键移动或转向" },
    { id: 3, title: "按方向键看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_key_pressed" x="40" y="40">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="160">
      <field name="KEY">down</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="280">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="400">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
  </xml>`,
};
