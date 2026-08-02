import type { CourseProject } from "@/courses";

export const flagProject: CourseProject = {
    slug: "flag",
    category: "seq",
    title: "走到小旗子",
    ageGroup: "6-8 岁",
    description: "用前进和转向，指挥二零穿过星球走到小旗子旁。",
    missionBrief: "造物星球上插着一面小旗子🚩。帮二零按顺序前进、转向，稳稳地走到小旗子旁边吧！",
    erLingHint: "① 先拖一个绿色「当开始运行」事件到工作区；② 在里面放「落笔」，让路线看得见；③ 再依次放「移动」和「右转」积木，指挥二零前进、拐弯；④ 点「运行」，看二零走到小旗子旁。卡住就点「看示范」。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "用转向走到小旗子" },
      { id: 3, title: "运行看二零到达" },
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
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
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
    scene: { marks: [{ x: -80, y: 80, emoji: "🚩", label: "小旗子" }] },
  }
