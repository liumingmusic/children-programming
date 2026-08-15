import type { CourseProject } from "@/courses";

export const guardianDodgeProject: CourseProject = {
  slug: "guardian_dodge",
  category: "multi",
  title: "守护与躲避",
  ageGroup: "9-12 岁",
  description: "用「到角色的距离」判断两个角色离得多近，守护者靠近时就说话提醒。",
  missionBrief:
    "二零要守护好朋友三七！写一个程序：当开始运行时，控制角色二零，重复前进，并用「如果 到角色 三七 的距离 < 50 那么 说 我在守护你」来在靠近时提醒。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「控制角色 二零」，接「重复 6 次」：里面放「移动 20」+「如果 到角色 三七 的距离 < 50 那么 说 我在守护你！ 1.5 秒」；③ 点运行看守护提醒。",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "用「控制角色」+「到角色的距离」做守护判断" },
    { id: 3, title: "点运行，看守护提醒有没有出现" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                  <next>
                    <block type="controls_if">
                      <value name="IF0">
                        <block type="maker_compare">
                          <field name="OP">&lt;</field>
                          <value name="A">
                            <block type="maker_distance_to">
                              <field name="ACTOR">sanqi</field>
                            </block>
                          </value>
                          <value name="B"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        </block>
                      </value>
                      <statement name="DO0">
                        <block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">我在守护你！</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
