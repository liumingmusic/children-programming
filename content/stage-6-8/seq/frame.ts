import type { CourseProject } from "@/courses";

export const frameProject: CourseProject = {
    slug: "frame",
    category: "seq",
    title: "走「回」字路线",
    ageGroup: "6-8 岁",
    description: "指挥二零走出一个「回」字形路线。",
    missionBrief: "挑战一下：让二零先走一个大正方形外框，再走一个小正方形内框，连起来就像汉字「回」啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 用「移动 + 右转」重复 4 次画出外框；③ 走到中间，再「移动 + 右转」重复 4 次画出内框；④ 最后「抬笔」。点「运行」看「回」字。",
    steps: [
      { id: 1, title: "让二零落笔画外框" },
      { id: 2, title: "走到中间画内框" },
      { id: 3, title: "运行看「回」字" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                <next>
                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                    <next>
                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                        <next>
                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                            <next>
                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
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
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  }
