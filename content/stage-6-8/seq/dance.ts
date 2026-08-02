import type { CourseProject } from "@/courses";

export const danceProject: CourseProject = {
    slug: "dance",
    category: "seq",
    title: "按指令跳舞",
    ageGroup: "6-8 岁",
    description: "用移动和转向，给二零编一段方块舞。",
    missionBrief: "音乐响起来🎵！给二零下一串「移动 + 右转」的指令，看它转出一段可爱的方块舞步吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 重复放「移动」和「右转」（比如 8 次），每次转一个小角度；③ 二零就会转着圈跳舞，最后「抬笔」。点「运行」看舞步。",
    steps: [
      { id: 1, title: "让二零动起来" },
      { id: 2, title: "用转向跳出舞步" },
      { id: 3, title: "运行看跳舞" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                <next>
                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                    <next>
                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                        <next>
                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                            <next>
                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
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
    scene: { marks: [{ x: 0, y: 0, emoji: "💃", label: "跳舞" }] },
  }
