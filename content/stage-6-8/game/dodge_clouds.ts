import type { CourseProject } from "@/courses";

export const dodgeCloudsProject: CourseProject = {
  slug: "dodge_clouds",
  category: "game",
  title: "躲避乌云",
  ageGroup: "6-8 岁",
  description: "乌云会飘动，让二零躲开它们。",
  missionBrief: "天上有几朵会飘的乌云 ☁，碰到就糟糕啦。写一个程序：二零一直往前走，一「碰到乌云」就拐弯躲开。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 100 次」；② 里面放「移动 12 步」，再放「如果…那么」，条件放「碰到乌云」、那么里放「右转 120 度」；③ 点「运行」，看乌云慢慢飘、二零一路躲。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「碰到乌云」做判断" },
    { id: 3, title: "运行看到乌云飘动与躲避" },
  ],
  scene: {
    clouds: [
      { x: 0, y: 0, vx: 1.2, vy: 0.8, r: 35 },
      { x: -110, y: 70, vx: -1, vy: 1, r: 30 },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_cloud"></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
