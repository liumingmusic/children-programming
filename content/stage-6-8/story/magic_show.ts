import type { CourseProject } from "@/courses";

export const magicShowProject: CourseProject = {
  slug: "magic_show",
  category: "story",
  title: "神奇魔术秀",
  ageGroup: "6-8 岁",
  description: "用「隐藏角色 / 显示角色」积木，让三七变没又变回来。",
  missionBrief:
    "魔术师二零要表演魔术！写一个程序：当开始运行时，让二零先喊一声，然后让伙伴三七「藏起来」，再「变出来」。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「说 看我变魔术！」，再放「隐藏角色 三七」+「说 三七不见啦！」；③ 放「显示角色 三七」+「说 三七又回来啦！」。点运行看魔术！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "让一个伙伴先藏起来再变出来（隐藏 + 显示）" },
    { id: 3, title: "点运行，看神奇的魔术" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">看我变魔术！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
          <next>
            <block type="maker_hide_actor">
              <field name="ACTOR">sanqi</field>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">三七不见啦！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                  <next>
                    <block type="maker_show_actor">
                      <field name="ACTOR">sanqi</field>
                      <next>
                        <block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">三七又回来啦！</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
