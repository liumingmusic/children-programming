import type { CourseProject } from "@/courses";

export const expressionShakeProject: CourseProject = {
  slug: "expression_shake",
  category: "event",
  title: "摇晃变表情",
  ageGroup: "6-8 岁",
  description: "点击舞台让二零摇晃一下，并换上开心的表情。",
  missionBrief: "二零想用表情表达心情。写一个程序：点击舞台，二零先左右摇晃一下，然后换上「开心」的表情说一句话。",
  erLingHint: "① 蓝色「当舞台被点击」里先放两个「移动」（一个 -15、一个 15）让二零晃一晃；② 接「让二零表情变成 开心」；③ 最后接「说 我变开心啦！ 1 秒」；④ 点「运行」后点击舞台试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「让二零表情变成」换表情" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">-15</field></shadow></value>
          <next><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="maker_set_expression">
              <field name="EXPR">happy</field>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">我变开心啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
