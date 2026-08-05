import type { CourseProject } from "@/courses";

export const freezeProject: CourseProject = {
  slug: "freeze",
  category: "story",
  title: "木头人游戏",
  ageGroup: "6-8 岁",
  description: "让二零一边跑一边玩「我们都是木头人」的口令游戏。",
  missionBrief:
    "大家来玩木头人！写一个程序：当开始运行时，让二零先跑几步，然后停下大声说「我们都是木头人，不许说话不许动！」。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面放黄色「移动 60 步」让二零跑起来；③ 接紫色「说 我们都是木头人，不许说话不许动！ 2 秒」。点运行玩一局木头人！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "让二零先跑动再停下说「不许动」" },
    { id: 3, title: "点运行，玩一局木头人" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我们都是木头人，不许说话不许动！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
