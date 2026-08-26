import type { CourseProject } from "@/courses";

export const mathAreaProject: CourseProject = {
  slug: "math_area",
  category: "math",
  title: "图形面积计算",
  ageGroup: "9-12 岁",
  description: "先画出长 6、宽 4 的长方形，再用「变量」把长乘宽算出来并说出来——把图形和算式连在一起想，面积就不再是抽象的公式。",
  missionBrief: "写一个程序：落笔画一个长方形（四个角用「移到 x,y」连起来），再用变量 长=6、宽=4，让 面积 = 长 × 宽，最后把面积说出来。",
  erLingHint: "① 拖绿色「当开始运行」→「画笔落下」，用 5 个「移到 x,y」连成一个长方形（记得回到起点闭合）；②「画笔抬起」，设置 长=6、宽=4、面积 = 长×宽；③「说 面积」。",
  steps: [
    { id: 1, title: "用「移到 x,y」画出长方形" },
    { id: 2, title: "用变量算出 长 × 宽" },
    { id: 3, title: "点运行，看画出的长方形和算出的面积 24" },
  ],
  goal: { drew: true, saidIncludes: ["24"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
              <next>
                <block type="maker_goto">
                  <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                  <value name="Y"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
                  <next>
                    <block type="maker_goto">
                      <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                      <value name="Y"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                      <next>
                        <block type="maker_goto">
                          <value name="X"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
                          <value name="Y"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                          <next>
                            <block type="maker_goto">
                              <value name="X"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
                              <value name="Y"><shadow type="math_number"><field name="NUM">-120</field></shadow></value>
                              <next>
                                <block type="maker_pen_up">
                                  <next>
                                    <block type="maker_set_var">
                                      <field name="NAME">长</field>
                                      <value name="VALUE"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                                      <next>
                                        <block type="maker_set_var">
                                          <field name="NAME">宽</field>
                                          <value name="VALUE"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                                          <next>
                                            <block type="maker_set_var">
                                              <field name="NAME">面积</field>
                                              <value name="VALUE"><block type="maker_mul">
                                                <value name="A"><block type="maker_get_var"><field name="NAME">长</field></block></value>
                                                <value name="B"><block type="maker_get_var"><field name="NAME">宽</field></block></value>
                                              </block></value>
                                              <next>
                                                <block type="maker_say">
                                                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">面积</field></block></value>
                                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
