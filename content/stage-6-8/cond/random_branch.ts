import type { CourseProject } from "@/courses";

export const randomBranchProject: CourseProject = {
  slug: "random_branch",
  category: "cond",
  title: "随机走不同路",
  ageGroup: "6-8 岁",
  description: "用「随机整数」让二零走不同的方向。",
  missionBrief: "让二零每次都有点不一样：用「随机整数」决定它向左还是向右走。",
  erLingHint: "① 绿色「当开始运行」里放「如果…那么…否则」（点齿轮加「否则」）；② 条件放「比较：随机整数 1 到 2 等于 1」；③ 那么里放「移动 -60 步」，否则里放「移动 60 步」；④ 点「运行」多试几次，看二零每次方向是否不同。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "用「随机整数」做判断" },
    { id: 3, title: "运行看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_compare">
            <value name="A"><block type="maker_random_int">
              <value name="MIN"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <value name="MAX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></value>
            <field name="OP">==</field>
            <value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></value>
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
