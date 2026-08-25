import type { CourseProject } from "@/courses";

export const var_parityProject: CourseProject = {
  slug: "var_parity",
  category: "var",
  title: "奇偶判断走不同路",
  ageGroup: "9-12 岁",
  description: "用取余数判断一个数是奇数还是偶数，走不一样的路。",
  missionBrief: "把变量 n 设为 7，用「n ÷ 2 的余数 == 0」判断奇偶：偶数就往左走，奇数就往右走。",
  erLingHint: "① 当开始运行：把变量 n 设为 7；② 如果「比较（取余数：变量 n ÷ 2）等于 0」那么 说 偶数 否则 说 奇数；③ 运行。把 n 改成偶数再试试。",
  steps: [
    { id: 1, title: "用变量存一个数" },
    { id: 2, title: "用取余判断奇偶" },
    { id: 3, title: "运行看判断结果" },
  ],
  goal: { vars: [{ name: "n", min: 0 }], saidIncludes: ["奇数", "偶数"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">n</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">7</field></shadow></value>
          <next>
            <block type="controls_if">
              <mutation else="1"></mutation>
              <value name="IF0">
                <block type="maker_compare">
                  <field name="OP">==</field>
                  <value name="A">
                    <block type="maker_mod">
                      <value name="A"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                      <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                    </block>
                  </value>
                  <value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                </block>
              </value>
              <statement name="DO0">
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">偶数</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </statement>
              <statement name="ELSE0">
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">奇数</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
