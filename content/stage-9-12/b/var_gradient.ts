import type { CourseProject } from "@/courses";

export const var_gradientProject: CourseProject = {
  slug: "var_gradient",
  category: "var",
  title: "变量画渐变",
  ageGroup: "9-12 岁",
  description: "让颜色随着循环一点点变化，画出彩虹渐变条。",
  missionBrief: "定义变量「色」，每画一段就把颜色加 20，连起来就是一条从红到紫的渐变。",
  erLingHint: "① 当开始运行：落笔 → 把变量 色 设为 0；② 重复 10 次（设置画笔颜色为 色、移动 20、右转 36、变量 色 增加 20）；③ 抬笔；④ 运行。",
  steps: [
    { id: 1, title: "用变量记录颜色" },
    { id: 2, title: "循环中让颜色渐变" },
    { id: 3, title: "运行看渐变条" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_set_var">
              <field name="NAME">色</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_pen_set_color">
                      <value name="HUE"><block type="maker_get_var"><field name="NAME">色</field></block></value>
                      <next>
                        <block type="maker_move">
                          <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                          <next>
                            <block type="maker_turn">
                              <value name="DEGREES"><shadow type="math_number"><field name="NUM">36</field></shadow></value>
                              <next>
                                <block type="maker_change_var">
                                  <field name="NAME">色</field>
                                  <value name="DELTA"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                                </block>
                              </next>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="maker_pen_up"></block>
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
