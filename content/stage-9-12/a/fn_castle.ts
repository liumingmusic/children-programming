import type { CourseProject } from "@/courses";

export const fn_castleProject: CourseProject = {
  slug: "fn_castle",
  category: "fn",
  title: "组合函数画城堡",
  ageGroup: "9-12 岁",
  description: "定义「画塔」积木，调用两次并移动位置，拼出一座城堡。",
  missionBrief: "定义「画塔」积木（画一个正方形塔身），先画一座，移到右边再画一座，两座塔就是城堡的雏形。",
  erLingHint: "① 定义积木 画塔：落笔 → 重复 4 次（移动 60、右转 90）→ 抬笔；② 当开始运行：调用 画塔 → 移到 x:120 y:0 → 调用 画塔；③ 运行。",
  steps: [
    { id: 1, title: "定义画塔的积木" },
    { id: 2, title: "多次调用拼出城堡" },
    { id: 3, title: "运行看到城堡" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call">
          <field name="NAME">画塔</field>
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next>
                <block type="maker_func_call"><field name="NAME">画塔</field></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画塔</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_pen_up"></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
