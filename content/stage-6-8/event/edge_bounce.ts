import type { CourseProject } from "@/courses";

export const edgeBounceProject: CourseProject = {
  slug: "edge_bounce",
  category: "event",
  title: "碰壁就转弯",
  ageGroup: "6-8 岁",
  description: "让二零边走边判断，碰到边缘就转弯。",
  missionBrief: "聪明的二零会看路。写一个程序：它一直向前走，一旦「碰到边缘」就转个弯，继续探索。",
  erLingHint: "① 绿色「当开始运行」里放「重复执行 60 次」；② 里面放「移动 20 步」，再放「如果…那么」，条件放「碰到边缘」、那么里放「右转 120 度」；③ 点「运行」看二零闯关。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「如果碰到边缘」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
              <next><block type="controls_if">
                <value name="IF0"><block type="maker_touching_edge"></block></value>
                <statement name="DO0"><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                </block></statement>
              </block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
