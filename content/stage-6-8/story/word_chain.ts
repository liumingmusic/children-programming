import type { CourseProject } from "@/courses";

export const wordChainProject: CourseProject = {
  slug: "word_chain",
  category: "story",
  title: "词语接龙",
  ageGroup: "6-8 岁",
  description: "让二零玩词语接龙，一个接一个说出相关的词。",
  missionBrief:
    "词语接龙游戏：前一个词的最后一个字，是后一个词的开头。写一个程序：当开始运行时，让二零连续说出至少两个词（比如「苹果 → 果实 → 实力」）。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面连放三个紫色「说」，分别输入「苹果」「果实」「实力」；③ 点运行，听二零接龙！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "让二零连续说出至少两个词来接龙" },
    { id: 3, title: "点运行，听二零接龙" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">果实</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">实力</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
