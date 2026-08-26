import type { CourseProject } from "@/courses";

export const gameRaceProject: CourseProject = {
  slug: "game_race",
  category: "game",
  title: "极速接果",
  ageGroup: "9-12 岁",
  description: "水果从天上落下，用方向键把二零左右移动去接住它们，每接一颗就加分。这是「键盘操控 + 碰撞检测 + 变量计分」的接物类综合练习。",
  missionBrief:
    "天上下起水果雨！当开始运行时，把「得分」设为 0；用「当按下 ← / →」让二零转向并「移动 40 步」，并「如果 碰到苹果 那么 变量 得分 增加 1、说 接住！」。看你能接住几颗！",
  erLingHint:
    "① 当开始运行：设置变量 得分=0；② 当按下 ←：转向 -90 再移动 40 步，里面放「如果 碰到苹果 那么 变量 得分 增加 1、说 接住！」；③ 当按下 →：转向 90 再移动 40 步，同样加碰撞判断；④ 点运行，左右移动去接水果。",
  steps: [
    { id: 1, title: "用方向键让二零左右移动" },
    { id: 2, title: "碰到水果就接住并加分（碰撞检测 + 变量）" },
    { id: 3, title: "运行看到水果落下与被接住、得分增加" },
  ],
  scene: {
    apples: [
      { x: -110, y: 150, vy: 1.6, r: 18 },
      { x: 0, y: 170, vy: 1.3, r: 18 },
      { x: 110, y: 150, vy: 1.7, r: 18 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var"><field name="NAME">得分</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="140">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value>
          <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_apple"></block></value>
              <statement name="DO0">
                <block type="maker_change_var"><field name="NAME">得分</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接住！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
                </block>
              </statement>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="340">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
          <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_apple"></block></value>
              <statement name="DO0">
                <block type="maker_change_var"><field name="NAME">得分</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接住！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
                </block>
              </statement>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
