import type { CourseProject } from "@/courses";

export const fn_houseProject: CourseProject = {
  slug: "fn_house",
  category: "fn",
  title: "用函数盖房子",
  ageGroup: "9-12 岁",
  description: "把「画房子」打包成一个积木，想盖几栋就调几次。",
  missionBrief: "定义一个「画房子」积木（先画正方形身体，再画三角形屋顶），调用它就能盖出一栋小房子。",
  erLingHint: "① 定义积木 画房子：落笔 → 重复 4 次（移动 100、右转 90）→ 再右转 30、移动 100、右转 120、移动 100、右转 120、移动 100 → 抬笔；② 当开始运行里「调用我的积木 画房子」；③ 运行。",
  steps: [
    { id: 1, title: "定义画房子的积木" },
    { id: 2, title: "调用它盖出房子" },
    { id: 3, title: "运行看到房子" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call"><field name="NAME">画房子</field></block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画房子</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                  <next>
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                      <next>
                        <block type="maker_turn">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                          <next>
                            <block type="maker_move">
                              <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                              <next>
                                <block type="maker_turn">
                                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                  <next>
                                    <block type="maker_move">
                                      <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                                      <next>
                                        <block type="maker_pen_up"></block>
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
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
