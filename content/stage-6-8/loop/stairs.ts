import type { CourseProject } from "@/courses";

export const stairsProject: CourseProject = {
    slug: "stairs",
    category: "loop",
    title: "爬楼梯",
    ageGroup: "6-8 岁",
    description: "用循环画出一级一级向上爬的台阶。",
    missionBrief: "造物星球的小屋有台阶。帮二零用「重复执行」画出一级级向上爬的楼梯吧！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 6 次」，里面依次放「移动 50」「右转 90」「移动 50」「右转 90」（一阶一阶地往上爬）；③ 最后「抬笔」；④ 点「运行」看楼梯。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环画出台阶" },
      { id: 3, title: "运行看到楼梯" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
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
  };
