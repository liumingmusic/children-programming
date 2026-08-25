import type { CourseProject } from "@/courses";

export const var_bestProject: CourseProject = {
  slug: "var_best",
  category: "var",
  title: "最高分记录",
  ageGroup: "9-12 岁",
  description: "把这一局的得分存成「最高分」，关掉网页下次还能读出来。",
  missionBrief: "先累计出本局得分，再用「写入最高分」把它记下来（只有更高才更新）。下次用「最高分」积木就能读出来。",
  erLingHint: "① 当开始运行：把变量 本局 设为 0 → 重复 5 次（移动 30、变量 本局 增加 10）；② 把最高分 得分 设为 变量 本局；③ 说 最高分 得分。刷新页面再打开仍能读到。",
  steps: [
    { id: 1, title: "累计出本局得分" },
    { id: 2, title: "把得分写成最高分" },
    { id: 3, title: "运行并能读出最高分" },
  ],
  goal: { vars: [{ name: "本局", equals: 50 }], saidIncludes: ["50"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">本局</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                  <next>
                    <block type="maker_change_var">
                      <field name="NAME">本局</field>
                      <value name="DELTA"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_best_set">
                  <field name="KEY">得分</field>
                  <value name="VALUE"><block type="maker_get_var"><field name="NAME">本局</field></block></value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><block type="maker_best_get"><field name="KEY">得分</field></block></value>
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
