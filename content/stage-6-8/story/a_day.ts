import type { CourseProject } from "@/courses";

export const aDayProject: CourseProject = {
  slug: "a_day",
  category: "story",
  title: "跟着二零过一天",
  ageGroup: "6-8 岁",
  description: "切换不同场景，用编程讲完二零从早到晚的一天。",
  missionBrief:
    "用场景切换，给小伙伴讲讲二零的一天：早上在明亮的白天醒来，白天去学校学编程，晚上回到夜晚的家睡觉。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「切换场景 白天」+「说 早上好！太阳升起啦」；③ 放「切换场景 学校」+「说 去学校学编程」，再「切换场景 夜晚」+「说 晚上回家睡觉」。点运行过一天！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "切换至少两个场景，讲完一天的经过" },
    { id: 3, title: "点运行，跟二零过一天" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">day</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">早上好！太阳升起啦</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
              <next>
                <block type="maker_set_scene">
                  <field name="SCENE">school</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">去学校学编程</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                      <next>
                        <block type="maker_set_scene">
                          <field name="SCENE">night</field>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><shadow type="text"><field name="TEXT">晚上回家睡觉</field></shadow></value>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
