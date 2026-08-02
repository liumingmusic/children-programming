import type { CourseProject } from "@/courses";

export const ifRedStopProject: CourseProject = {
  slug: "if_red_stop",
  category: "cond",
  title: "红色就停下",
  ageGroup: "6-8 岁",
  description: "用「如果画笔是红色就停下」做判断。",
  missionBrief: "二月学会了看信号灯。写一个程序：先把画笔设成红色，如果「画笔是红色」就大声说「红色，停下！」。",
  erLingHint: "① 绿色「当开始运行」里放「设置画笔颜色为 0」（红色）；② 接「如果…那么」，条件放「画笔是红色」，那么里放「说 红色，停下！ 2 秒」；③ 点「运行」看二零的反应。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「如果画笔是红色」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_set_color">
          <value name="HUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_pen_is_red"></block></value>
            <statement name="DO0"><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">红色，停下！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></statement>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
