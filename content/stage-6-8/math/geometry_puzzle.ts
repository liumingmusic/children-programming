import type { CourseProject } from "@/courses";

export const geometryPuzzleProject: CourseProject = {
  slug: "geometry_puzzle",
  category: "math",
  title: "几何拼图",
  ageGroup: "6-8 岁",
  description: "用「移到」把几个图形摆到不同位置，拼出一幅小图画。",
  missionBrief:
    "造物星球的拼图角，要用基本图形拼出图案。写一个程序：当开始运行时，让二零在左右两边各画一个正方形，拼出一座小房子。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「落笔」，用「移到 x:-50 y:-30」定位，再「重复执行 4 次」画一个正方形；③ 放「抬笔」，再「落笔」用「移到 x:40 y:-30」定位到右边，画第二个正方形；④ 放「说 我用两个正方形拼出了一座小房子！」；⑤ 点运行看拼图。",
  steps: [
    { id: 1, title: "用落笔开始画画" },
    { id: 2, title: "用「移到」摆好几个图形拼成图案" },
    { id: 3, title: "点运行看二零拼出图案" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">-50</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                      <next>
                        <block type="maker_turn">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="maker_pen_up">
                      <next>
                        <block type="maker_pen_down">
                          <next>
                            <block type="maker_goto">
                              <value name="X"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                              <value name="Y"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
                              <next>
                                <block type="controls_repeat_ext">
                                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                                  <statement name="DO">
                                    <block type="maker_move">
                                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                      <next>
                                        <block type="maker_turn">
                                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="maker_pen_up">
                                      <next>
                                        <block type="maker_say">
                                          <value name="TEXT"><shadow type="text"><field name="TEXT">我用两个正方形拼出了一座小房子！</field></shadow></value>
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
