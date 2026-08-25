import type { CourseProject } from "@/courses";

export const var_counterProject: CourseProject = {
  slug: "var_counter",
  category: "var",
  title: "计数器数步数",
  ageGroup: "9-12 岁",
  description: "用一个变量记录二零走了多少步，走完大声报数。",
  missionBrief: "定义变量「步数」，每走一步就让它加 1，最后说出来——这就是计数器的原理。",
  erLingHint: "① 当开始运行：把变量 步数 设为 0；② 重复 10 次（移动 20、变量 步数 增加 1）；③ 最后「说 变量 步数」。",
  steps: [
    { id: 1, title: "用变量记录步数" },
    { id: 2, title: "让计数器跟着走增加" },
    { id: 3, title: "运行看到报出的步数" },
  ],
  goal: { vars: [{ name: "步数", equals: 10 }] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">步数</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                  <next>
                    <block type="maker_change_var">
                      <field name="NAME">步数</field>
                      <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">步数</field></block></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
