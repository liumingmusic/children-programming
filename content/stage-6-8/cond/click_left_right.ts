import type { CourseProject } from "@/courses";

export const clickLeftRightProject: CourseProject = {
  slug: "click_left_right",
  category: "cond",
  title: "点左点右走不同路",
  ageGroup: "6-8 岁",
  description: "用「如果…否则」根据点击位置走不同方向。",
  missionBrief: "点舞台左边，二零向左走；点右边，它向右走。写一个程序：用「点击在左半边」判断，走不同的路。",
  erLingHint: "① 蓝色「当舞台被点击」里放「如果…那么…否则」（点积木上的齿轮加「否则」）；② 条件放「点击在左半边」，那么里放「移动 -60 步」，否则里放「移动 60 步」；③ 点「运行」后分别点左边和右边试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「点击在左半边」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
