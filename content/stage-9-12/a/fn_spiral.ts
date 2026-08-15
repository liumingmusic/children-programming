import type { CourseProject } from "@/courses";

export const fn_spiralProject: CourseProject = {
  slug: "fn_spiral",
  category: "fn",
  title: "用函数画螺旋",
  ageGroup: "9-12 岁",
  description: "在函数里用变量让每一步越走越长，画出漂亮的螺旋。",
  missionBrief: "定义「画螺旋」积木：每次移动后让步长变大一点，调用它就画出一圈圈向外散开的螺旋。",
  erLingHint: "① 定义积木 画螺旋：把变量 步 设为 5 → 落笔 → 重复 20 次（移动 步、变量 步 增加 4、右转 15）→ 抬笔；② 当开始运行里「调用我的积木 画螺旋」；③ 运行。",
  steps: [
    { id: 1, title: "定义会越走越长的积木" },
    { id: 2, title: "调用它画螺旋" },
    { id: 3, title: "运行看到螺旋" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call"><field name="NAME">画螺旋</field></block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画螺旋</field>
      <statement name="DO">
        <block type="maker_set_var">
          <field name="NAME">步</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
          <next>
            <block type="maker_pen_down">
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_move">
                      <value name="STEPS"><block type="maker_get_var"><field name="NAME">步</field></block></value>
                      <next>
                        <block type="maker_change_var">
                          <field name="NAME">步</field>
                          <value name="DELTA"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                          <next>
                            <block type="maker_turn">
                              <value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
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
