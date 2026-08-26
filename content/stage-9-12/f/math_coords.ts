import type { CourseProject } from "@/courses";

export const mathCoordsProject: CourseProject = {
  slug: "math_coords",
  category: "math",
  title: "坐标绘图",
  ageGroup: "9-12 岁",
  description: "用「移到 x,y」按坐标精确画出图形——每个点都由一对数字决定位置。先画一个正方形，理解坐标系是怎么把“位置”变成“数字”的。",
  missionBrief: "写一个程序：落笔后用 5 个「移到 x,y」依次走到 (-120,-120)、(120,-120)、(120,120)、(-120,120)、再回到 (-120,-120)，画出一个正方形，最后说出你用坐标画好了。",
  erLingHint: "① 拖绿色「当开始运行」→「画笔落下」，接 5 个「移到 x,y」连成一个正方形（最后回到起点闭合）；②「画笔抬起」；③「说 我用坐标画好了一个正方形」。",
  steps: [
    { id: 1, title: "用「移到 x,y」按坐标走到四个角" },
    { id: 2, title: "落笔连成正方形（记得闭合）" },
    { id: 3, title: "点运行，看坐标画出的正方形" },
  ],
  goal: { drew: true, saidIncludes: ["正方形"] },
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
                                    <block type="maker_say">
                                      <value name="TEXT"><block type="text"><field name="TEXT">我用坐标画好了一个正方形</field></block></value>
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
      </statement>
    </block>
  </xml>`,
};
