import type { CourseProject } from "@/courses";

export const fn_squareProject: CourseProject = {
  slug: "fn_square",
  category: "fn",
  title: "用函数画正方形",
  ageGroup: "9-12 岁",
  description: "把重复的动作打包成「自己的积木」，想画几次就调用几次。",
  missionBrief: "重复的动作不用每次重搭！定义一个「画正方形」积木，再用「调用我的积木」把它画出来。",
  erLingHint: "① 拖一个「定义积木 画正方形」，里面放：落笔 → 重复 4 次（移动 100、右转 90）→ 抬笔；② 在「当开始运行」里放「调用我的积木 画正方形」；③ 点运行。",
  steps: [
    { id: 1, title: "定义一个自己的积木" },
    { id: 2, title: "调用它把正方形画出来" },
    { id: 3, title: "运行看到正方形" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call"><field name="NAME">画正方形</field></block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画正方形</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
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
