import type { CourseProject } from "@/courses";

export const homeProject: CourseProject = {
    slug: "home",
    category: "seq",
    title: "送信使回家",
    ageGroup: "6-8 岁",
    description: "送信使迷路了，指挥二零带它回到小屋。",
    missionBrief: "一只送信使🏠找不到回家的路。帮二零按顺序走，把它平安送回小屋门口吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到小屋，最后「抬笔」。点「运行」看二零送它回家。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "转向走到小屋" },
      { id: 3, title: "运行看到达小屋" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
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
    scene: { marks: [{ x: -120, y: 80, emoji: "🏠", label: "信使的家" }] },
  }
