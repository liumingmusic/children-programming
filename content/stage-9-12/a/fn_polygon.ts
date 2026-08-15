import type { CourseProject } from "@/courses";

export const fn_polygonProject: CourseProject = {
  slug: "fn_polygon",
  category: "fn",
  title: "用函数画多边形",
  ageGroup: "9-12 岁",
  description: "定义一个「画多边形」积木，改个数字就能画不同边数的图形。",
  missionBrief: "定义「画多边形」积木（重复 6 次：移动 80、右转 60），调用两次看看六边形长什么样，体会「定义一次、到处调用」。",
  erLingHint: "① 定义积木 画多边形：里面放 落笔 → 重复 6 次（移动 80、右转 60）→ 抬笔；② 当开始运行里放两次「调用我的积木 画多边形」；③ 运行。",
  steps: [
    { id: 1, title: "定义画多边形的积木" },
    { id: 2, title: "多次调用它" },
    { id: 3, title: "运行看到六边形" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call"><field name="NAME">画多边形</field>
          <next>
            <block type="maker_func_call"><field name="NAME">画多边形</field></block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="320">
      <field name="NAME">画多边形</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
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
