import type { CourseProject } from "@/courses";

export const connectdotProject: CourseProject = {
    slug: "connectdot",
    category: "draw",
    title: "折线连点画",
    ageGroup: "6-8 岁",
    description: "用循环把点连成折线图形。",
    missionBrief: "把桌面上的小点用线连起来，就能变出图形！帮二零用「重复执行」连出一条折线吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 8 次」，里面放「移动 60 步」和「右转 45 度」；③ 最后「抬笔」；④ 点「运行」，二零会把点连成一个八边形。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用循环连点成图" },
      { id: 3, title: "运行看到图形" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
    scene: { marks: [{ x: 0, y: 0, emoji: "🔗", label: "连点" }] },
  };
