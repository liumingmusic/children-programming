import type { CourseProject } from "@/courses";

export const zigzagProject: CourseProject = {
    slug: "zigzag",
    category: "seq",
    title: "折线探险",
    ageGroup: "6-8 岁",
    description: "画出一条上下折返的折线探险路线。",
    missionBrief: "造物星球有一条 zigzag 小路。指挥二零一会上、一会下，画出一条弯弯折折的探险路线吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；②「移动」、「右转」交替使用，让路线一会上、一会下；③ 重复几次「移动 + 右转」画出折线，最后「抬笔」。点「运行」看折线。",
    steps: [
      { id: 1, title: "让二零落笔画线" },
      { id: 2, title: "画出上下折返的折线" },
      { id: 3, title: "运行看折线图案" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
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
        </statement>
      </block>
    </xml>`,
  }
