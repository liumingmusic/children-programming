import type { CourseProject } from "@/courses";

export const mathPolygonProject: CourseProject = {
  slug: "math_polygon",
  category: "math",
  title: "角度与正多边形",
  ageGroup: "9-12 岁",
  description: "用「移动 + 右转」就能画出正多边形：转的角度越小、边数越多。正六边形每次右转 60 度，每个内角正好是 120 度——把角度和图形连起来。",
  missionBrief: "写一个程序：落笔后「重复执行 6 次」（每次「移动 100」「右转 60 度」），画出一个正六边形，最后说出「正六边形每个内角 120 度」。",
  erLingHint: "① 拖绿色「当开始运行」→「画笔落下」，接「重复执行 6 次」；② 里面放「移动 100」和「右转 60 度」；③「画笔抬起」，最后「说 正六边形每个内角 120 度」。",
  steps: [
    { id: 1, title: "用画笔 + 循环画出正多边形" },
    { id: 2, title: "用「右转 60 度」控制转角" },
    { id: 3, title: "点运行，看正六边形并说出内角 120 度" },
  ],
  goal: { drew: true, saidIncludes: ["120"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_pen_up">
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><block type="text"><field name="TEXT">正六边形每个内角 120 度</field></block></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
};
