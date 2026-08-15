import type { CourseProject } from "@/courses";

export const keyMazeProject: CourseProject = {
  slug: "key_maze",
  category: "key",
  title: "走迷宫（键盘操控）",
  ageGroup: "9-12 岁",
  description: "用键盘方向键像开坦克一样操控二零穿过迷宫：↑ 前进、← → 转向。",
  missionBrief:
    "迷宫里不能直走到底！写一个操控程序：用「当按下」事件，让 ↑ 前进、← → 转向，把二零从入口开到出口。先想好每一步往哪转。",
  erLingHint:
    "① 拖「当按下 ↑ 上」放「移动 40」（前进）；② 拖「当按下 ← 左」放「转向 -90」、「当按下 → 右」放「转向 90」；③ 点运行后，用方向键把二零开到迷宫出口。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件" },
    { id: 2, title: "用移动 + 转向操控二零穿过迷宫" },
    { id: 3, title: "按方向键把二零开到出口" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_key_pressed" x="40" y="40">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="160">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="280">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
  </xml>`,
};
