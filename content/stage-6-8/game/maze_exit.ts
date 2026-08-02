import type { CourseProject } from "@/courses";

export const mazeExitProject: CourseProject = {
  slug: "maze_exit",
  category: "game",
  title: "走迷宫到出口",
  ageGroup: "6-8 岁",
  description: "用前进和转向，带二零穿过迷宫走到出口。",
  missionBrief: "迷宫的墙挡住了去路。写一个程序：用「移动」和「右转 / 左转」带二零绕过墙，走到插着小旗子的出口。",
  erLingHint: "① 绿色「当开始运行」里用「移动」和「右转 90 度 / 左转 -90 度」拼出一条路线；② 让二零先往上、再拐弯、最后到出口；③ 点「运行」看它走到小旗子。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用前进和转向走出路线" },
    { id: 3, title: "运行走到出口" },
  ],
  scene: {
    walls: [
      { x1: -150, y1: -150, x2: -150, y2: 30 },
      { x1: -150, y1: 30, x2: -30, y2: 30 },
      { x1: 40, y1: 150, x2: 40, y2: -30 },
      { x1: 40, y1: -30, x2: 150, y2: -30 },
    ],
    marks: [{ x: -60, y: 120, emoji: "🏁", label: "出口" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_turn">
            <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
              <next><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
