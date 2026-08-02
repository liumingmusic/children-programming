import type { CourseProject } from "@/courses";

export const pentagonProject: CourseProject = {
    slug: "pentagon",
    category: "loop",
    title: "画正五边形",
    ageGroup: "6-8 岁",
    description: "用循环和画笔，让二零画出五条边一样长的正五边形。",
    missionBrief: "造物星球要做一个五边形的路标。帮二零用「重复执行 5 次」，画出五条等长边，拼出一个正五边形吧！",
    erLingHint: "① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 72 度」；③ 最后接「抬笔」；④ 点「运行」。提示：五边形每个外角是 72 度哦。",
    steps: [
      { id: 1, title: "让二零落笔开始画" },
      { id: 2, title: "用循环画出五条边" },
      { id: 3, title: "运行看到正五边形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">72</field></shadow></value></block></next>
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
