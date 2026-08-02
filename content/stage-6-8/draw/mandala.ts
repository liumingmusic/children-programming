import type { CourseProject } from "@/courses";

export const mandalaProject: CourseProject = {
    slug: "mandala",
    category: "draw",
    title: "曼陀罗 / 万花筒",
    ageGroup: "6-8 岁",
    description: "用嵌套循环画出对称的曼陀罗花纹。",
    missionBrief: "万花筒里的图案好漂亮！帮二零用「循环里再套循环」画出一圈圈对称的花纹吧。",
    erLingHint: "① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面先放「重复执行 3 次」画一个小三角（移动 40、右转 120），再放「右转 30 度」换到下一朵；③ 最后「抬笔」；④ 点「运行」看曼陀罗。",
    steps: [
      { id: 1, title: "让二零落笔开始" },
      { id: 2, title: "用嵌套循环画花纹" },
      { id: 3, title: "运行看到曼陀罗" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value></block></next>
                      </block>
                    </statement>
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
