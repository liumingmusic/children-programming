import type { CourseProject } from "@/courses";

export const autoPatrolProject: CourseProject = {
  slug: "auto_patrol",
  category: "event",
  title: "自动巡逻一圈",
  ageGroup: "6-8 岁",
  description: "点「运行」就让二零自己转圈巡逻。",
  missionBrief: "哨兵二零要绕场巡逻一圈。写一个程序：当开始运行时，它落下笔，重复转着圈走，画出一圈巡逻路线。",
  erLingHint: "① 绿色「当开始运行」里放「落笔」；② 接「重复执行 12 次」，里面放「移动 30 步」和「右转 30 度」；③ 最后接「抬笔」；④ 点「运行」，二零会转出一圈。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用循环让二零边走边转" },
    { id: 3, title: "运行看到巡逻路线" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down"><next>
          <block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <statement name="DO">
              <block type="maker_move">
                <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                <next><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block></next>
              </block>
            </statement>
            <next><block type="maker_pen_up"></block></next>
          </block>
        </next></block>
      </statement>
    </block>
  </xml>`,
};
