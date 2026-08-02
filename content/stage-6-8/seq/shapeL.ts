import type { CourseProject } from "@/courses";

export const shapeLProject: CourseProject = {
    slug: "shapeL",
    category: "seq",
    title: "画一个「L」形路线",
    ageGroup: "6-8 岁",
    description: "指挥二零画出一条笔直的 L 形路线。",
    missionBrief: "用画笔让二零画出一条 L 形路线：先直直往上，再拐个弯往旁边。看，像不像字母 L？",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；②「移动」往上走一段；③「右转」拐弯；④ 再「移动」往旁边走一段，最后「抬笔」。运行后就能看到一条 L 形线。",
    steps: [
      { id: 1, title: "让二零落笔画线" },
      { id: 2, title: "拐弯画出 L 的另一边" },
      { id: 3, title: "运行看 L 形图案" },
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
    scene: { marks: [{ x: -100, y: 100, emoji: "🏁", label: "终点" }] },
  }
