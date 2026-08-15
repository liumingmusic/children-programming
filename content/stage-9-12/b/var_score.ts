import type { CourseProject } from "@/courses";

export const var_scoreProject: CourseProject = {
  slug: "var_score",
  category: "var",
  title: "计分器游戏",
  ageGroup: "9-12 岁",
  description: "用变量「得分」累计每一次操作的奖励，做个简易计分器。",
  missionBrief: "定义变量「得分」，每走一步就加 10 分，最后说出来——这就是游戏计分的核心。",
  erLingHint: "① 当开始运行：把变量 得分 设为 0；② 重复 5 次（移动 30、变量 得分 增加 10）；③ 最后「说 变量 得分」。",
  steps: [
    { id: 1, title: "用变量当计分板" },
    { id: 2, title: "让得分随动作增加" },
    { id: 3, title: "运行看到总分" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">得分</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                  <next>
                    <block type="maker_change_var">
                      <field name="NAME">得分</field>
                      <value name="DELTA"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">得分</field></block></value>
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
