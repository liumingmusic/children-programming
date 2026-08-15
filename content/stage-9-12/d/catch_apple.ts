import type { CourseProject } from "@/courses";

export const catchAppleProject: CourseProject = {
  slug: "catch_apple",
  category: "key",
  title: "接苹果游戏",
  ageGroup: "9-12 岁",
  description: "苹果从天上落下，用键盘方向键把二零开到苹果下面，按方向键就能接住并加分。",
  missionBrief:
    "天上下起苹果雨！写一个操控程序：用「当按下」方向键让二零四处移动，每当二零碰到苹果就接住它、分数 +1。看你能接住几颗！",
  erLingHint:
    "① 拖一个「当开始运行」放「把变量 score 设为 0」；② 拖四个「当按下」方向键事件：↑/↓ 放「移动 40」、←/→ 放「转向 ±90」再「移动 40」；③ 在每个方向键里都接一个「如果 碰到苹果 那么 变量 score 增加 1、说 接到！」；④ 点运行后，用方向键把二零移到落下的苹果上按一下就接住。",
  steps: [
    { id: 1, title: "使用「当按下方向键」事件控制移动" },
    { id: 2, title: "碰到苹果就接住并加分（用到变量）" },
    { id: 3, title: "运行看到苹果落下与被接住" },
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
        <block type="maker_set_var"><field name="NAME">score</field><value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="140">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_touching_apple"></block></value>
            <statement name="DO0">
              <block type="maker_change_var"><field name="NAME">score</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接到！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
              </block>
            </statement>
          </block></next>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="320">
      <field name="KEY">down</field>
      <statement name="STACK">
        <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">-40</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_touching_apple"></block></value>
            <statement name="DO0">
              <block type="maker_change_var"><field name="NAME">score</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接到！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
              </block>
            </statement>
          </block></next>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="500">
      <field name="KEY">left</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value>
          <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_apple"></block></value>
              <statement name="DO0">
                <block type="maker_change_var"><field name="NAME">score</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接到！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
                </block>
              </statement>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
    <block type="maker_when_key_pressed" x="40" y="700">
      <field name="KEY">right</field>
      <statement name="STACK">
        <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
          <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_apple"></block></value>
              <statement name="DO0">
                <block type="maker_change_var"><field name="NAME">score</field><value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">接到！</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next>
                </block>
              </statement>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
