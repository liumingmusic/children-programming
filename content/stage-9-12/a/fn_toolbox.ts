import type { CourseProject } from "@/courses";

export const fn_toolboxProject: CourseProject = {
  slug: "fn_toolbox",
  category: "fn",
  title: "我的画图工具箱",
  ageGroup: "9-12 岁",
  description: "定义好几个小积木（前进、画圆），组合成一个属于你的工具箱。",
  missionBrief: "定义「前进」和「画圆」两个积木，再在程序里随意调用它们，感受「工具箱」带来的方便。",
  erLingHint: "① 定义积木 前进（里面放 移动 60）；② 定义积木 画圆（里面放 落笔 → 重复 36 次（移动 6、右转 10）→ 抬笔）；③ 当开始运行里依次「调用 前进」「调用 画圆」「调用 前进」。",
  steps: [
    { id: 1, title: "定义多个自己的积木" },
    { id: 2, title: "组合调用它们" },
    { id: 3, title: "运行看到作品" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_func_call">
          <field name="NAME">前进</field>
          <next>
            <block type="maker_func_call">
              <field name="NAME">画圆</field>
              <next>
                <block type="maker_func_call"><field name="NAME">前进</field></block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="300">
      <field name="NAME">前进</field>
      <statement name="DO">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
        </block>
      </statement>
    </block>
    <block type="maker_func_def" x="60" y="460">
      <field name="NAME">画圆</field>
      <statement name="DO">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">36</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
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
