import type { CourseProject } from "@/courses";

export const fn_snowflakeProject: CourseProject = {
  slug: "fn_snowflake",
  category: "fn",
  title: "用函数画雪花",
  ageGroup: "9-12 岁",
  description: "定义一个「画枝」积木，转着圈调用六次，就得到一片雪花。",
  missionBrief: "雪花是六条对称的枝。定义「画枝」积木，再用「重复 6 次」转着圈调用它，一片六角雪花就出现了。",
  erLingHint: "① 定义积木 画枝：落笔 → 移动 80 → 右转 120 → 移动 50 → 右转 -120 → 移动 80 → 抬笔；② 当开始运行：落笔 → 重复 6 次（调用 画枝、右转 60）→ 抬笔；③ 运行。",
  steps: [
    { id: 1, title: "定义画枝的积木" },
    { id: 2, title: "多次调用拼出雪花" },
    { id: 3, title: "运行看到雪花" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
              <statement name="DO">
                <block type="maker_func_call">
                  <field name="NAME">画枝</field>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
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
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="360">
      <field name="NAME">画枝</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
              <next>
                <block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                  <next>
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                      <next>
                        <block type="maker_turn_left">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                          <next>
                            <block type="maker_move">
                              <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
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
      </statement>
    </block>
  </xml>`,
};
