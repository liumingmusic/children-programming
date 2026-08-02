import type { CourseProject } from "@/courses";

export const checkerboardProject: CourseProject = {
    slug: "checkerboard",
    category: "draw",
    title: "棋盘格",
    ageGroup: "6-8 岁",
    description: "用嵌套循环画出一排排小方格，组成棋盘。",
    missionBrief: "下棋需要棋盘格。帮二零用「循环里再套循环」画出一格格的小方块吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面先放「重复执行 4 次」画一个小方格（移动 40、右转 90），再放「右转 90」「移动 50」「右转 -90」挪到下一格；③ 最后「抬笔」；④ 点「运行」看棋盘格。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用嵌套循环画方格" },
      { id: 3, title: "运行看到棋盘格" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                          <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                        </block></next>
                      </block>
                    </next>
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
