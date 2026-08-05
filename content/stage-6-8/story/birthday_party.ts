import type { CourseProject } from "@/courses";

export const birthdayPartyProject: CourseProject = {
  slug: "birthday_party",
  category: "story",
  title: "生日派对",
  ageGroup: "6-8 岁",
  description: "切换到派对场景，让二零送上生日祝福。",
  missionBrief:
    "今天是谁的生日？写一个程序：当开始运行时，先切换到一个明亮的场景，再让二零大声送上生日祝福。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面先放「切换场景 白天」，再放「说 生日快乐！」；③ 接「说 大家一起吃蛋糕吧！」。点运行庆祝！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "切换到一个派对场景并送上生日祝福" },
    { id: 3, title: "点运行，一起庆祝" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">day</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">生日快乐！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">大家一起吃蛋糕吧！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
