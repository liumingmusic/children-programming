import type { CourseProject } from "@/courses";

export const arrowProject: CourseProject = {
    slug: "arrow",
    category: "seq",
    title: "跟着箭头走",
    ageGroup: "6-8 岁",
    description: "沿着箭头指的方向，一步步走到终点。",
    missionBrief: "地上画着箭头⬆️⬅️，指引二零前进的方向。照着箭头走，把它带到终点🎯吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 跟着箭头「移动」前进；③ 箭头转弯处用「右转」换方向；④ 走到终点🎯后「抬笔」。点「运行」照箭头走一遍。",
    steps: [
      { id: 1, title: "让二零向前走" },
      { id: 2, title: "按箭头转向前进" },
      { id: 3, title: "运行到终点" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
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
    scene: {
      marks: [
        { x: 0, y: 50, emoji: "⬆️" },
        { x: -50, y: 100, emoji: "⬅️" },
        { x: -100, y: 100, emoji: "🎯", label: "终点" },
      ],
    },
  }
