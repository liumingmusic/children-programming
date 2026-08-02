import type { CourseProject } from "@/courses";

export const spinProject: CourseProject = {
    slug: "spin",
    category: "loop",
    title: "原地转圈 12 次",
    ageGroup: "6-8 岁",
    description: "用循环让二零转着圈走 12 步，画出一个圆。",
    missionBrief: "二零想在原地转个圈热身。用「重复执行 12 次」，每次走一小步再转一点点，它就转出一圈啦！",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面放「移动 20 步」和「右转 30 度」；③ 最后「抬笔」；④ 点「运行」，二零会转着圈走成一个圆。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环转圈 12 步" },
      { id: 3, title: "运行看到圆圈" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></next>
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
