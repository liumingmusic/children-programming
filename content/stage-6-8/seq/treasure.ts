import type { CourseProject } from "@/courses";

export const treasureProject: CourseProject = {
    slug: "treasure",
    category: "seq",
    title: "到达宝藏箱",
    ageGroup: "6-8 岁",
    description: "找到藏起来的宝藏箱📦，指挥二零过去。",
    missionBrief: "造物星球藏着一只宝藏箱📦！指挥二零穿过草地，走到宝藏箱旁边，把它找出来吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到宝藏箱，最后「抬笔」。点「运行」看二零找到宝藏。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "转向走到宝藏箱" },
      { id: 3, title: "运行看找到宝藏" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">70</field></shadow></value>
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
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: -70, y: 90, emoji: "📦", label: "宝藏箱" }] },
  }
