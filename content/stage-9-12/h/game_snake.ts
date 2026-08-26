import type { CourseProject } from "@/courses";

export const gameSnakeProject: CourseProject = {
  slug: "game_snake",
  category: "game",
  title: "贪吃蛇（操控版）",
  ageGroup: "9-12 岁",
  description: "用方向键操控二零在舞台上巡游，碰到苹果就「吃」掉它、身体变长（分数 +1）。这是把「键盘操控 + 碰撞检测 + 变量计分」综合起来的小游戏。",
  missionBrief:
    "操控二零去吃苹果。当开始运行时，把「长度」设为 0；用「当按下 ↑」让二零前进并「如果 碰到苹果 那么 变量 长度 增加 1、说 吃到！」；用「当按下 ← / →」让二零转向，方便拐弯找苹果。看你能吃几颗！",
  erLingHint:
    "① 当开始运行：设置变量 长度=0；② 当按下 ↑：移动 30 步，再「如果 碰到苹果 那么 变量 长度 增加 1、说 吃到！」；③ 当按下 ← / →：转向 ±90 度来拐弯；④ 点运行，用方向键去碰苹果。",
  steps: [
    { id: 1, title: "用方向键让二零移动和转向" },
    { id: 2, title: "碰到苹果就「吃」掉并加分（碰撞检测 + 变量）" },
    { id: 3, title: "运行看到苹果被吃掉、长度增加" },
  ],
  scene: {
    apples: [
      { x: -110, y: 150, vy: 0.4, r: 18 },
      { x: 0, y: 170, vy: 0.3, r: 18 },
      { x: 110, y: 150, vy: 0.5, r: 18 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var"><field name="NAME">长度</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="140">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_touching_apple"></block></value>
            <statement name="DO0">
              <block type="maker_change_var"><field name="NAME">长度</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">吃到！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
              </block>
            </statement>
          </block></next>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="320">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="420">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="520">
      <field name="KEY">down</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">-30</field></shadow></value></block>
      </statement>
    </block>
  </xml>`,
};
