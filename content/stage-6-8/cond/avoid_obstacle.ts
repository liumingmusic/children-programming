import type { CourseProject } from "@/courses";

export const avoidObstacleProject: CourseProject = {
  slug: "avoid_obstacle",
  category: "cond",
  title: "遇到石头绕过去",
  ageGroup: "6-8 岁",
  description: "用「碰到障碍」判断，让二零绕开石头。",
  missionBrief: "舞台上有块石头 🪨。写一个程序：二零一直往前走，一「碰到障碍」就拐个弯继续走。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 40 次」；② 里面放「移动 15 步」，再放「如果…那么」，条件放「碰到 障碍」、那么里放「右转 90 度」；③ 点「运行」看二零绕开石头。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「碰到障碍」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  scene: {
    marks: [{ x: 60, y: 0, emoji: "🪨", label: "石头", kind: "obstacle" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_mark"><field name="KIND">obstacle</field></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
