import type { CourseProject } from "@/courses";

export const fenceProject: CourseProject = {
    slug: "fence",
    category: "loop",
    title: "画栅栏",
    ageGroup: "6-8 岁",
    description: "用循环画出一排整齐的栅栏。",
    missionBrief: "农场需要一圈栅栏。帮二零用「重复执行」画出一根根竖起的栅栏吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 5 次」，里面放「移动 60」「右转 90」「移动 20」「右转 -90」（画一根竖条再挪到下一根）；③ 最后「抬笔」；④ 点「运行」看栅栏。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出栅栏" },
      { id: 3, title: "运行看到栅栏" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  };
