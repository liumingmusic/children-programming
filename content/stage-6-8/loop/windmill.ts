import type { CourseProject } from "@/courses";

export const windmillProject: CourseProject = {
    slug: "windmill",
    category: "loop",
    title: "风车",
    ageGroup: "6-8 岁",
    description: "用循环画出一架四叶风车。",
    missionBrief: "造物星球的风车转呀转。帮二零用「重复执行 4 次」画出四片风车叶片吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 100」「右转 180」「移动 100」「右转 90」（出去再回来，再转向下一叶）；③ 最后「抬笔」；④ 点「运行」看风车。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出叶片" },
      { id: 3, title: "运行看到风车" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
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
    scene: { marks: [{ x: 0, y: 0, emoji: "🌬️", label: "风车" }] },
  };
