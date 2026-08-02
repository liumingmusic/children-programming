import type { CourseProject } from "@/courses";

export const stoneProject: CourseProject = {
    slug: "stone",
    category: "seq",
    title: "绕过小石头",
    ageGroup: "6-8 岁",
    description: "路上有一块小石头，指挥二零拐个弯绕过去。",
    missionBrief: "一颗小石头🪨挡在前面。让二零先往前走一点，再拐弯从旁边绕过去，别撞上它！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前走一段；③ 用「右转」拐弯，从石头旁边绕过去；④ 再「移动」继续前进，最后「抬笔」。点「运行」看看绕行的路线。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "拐弯绕过小石头" },
      { id: 3, title: "运行看绕行路线" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">140</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">75</field></shadow></value>
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
    scene: {
      marks: [
        { x: 0, y: 75, emoji: "🪨", label: "小石头" },
        { x: 100, y: 75, emoji: "🏁", label: "终点" },
      ],
    },
  }
