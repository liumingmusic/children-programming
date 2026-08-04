import type { CourseProject } from "@/courses";

export const calculatorProject: CourseProject = {
  slug: "calculator",
  category: "math",
  title: "小小计算器",
  ageGroup: "6-8 岁",
  description: "把两个数存进变量，再用算术积木算出结果并显示出来。",
  missionBrief:
    "造物星球的小朋友想要一个会算数的一零。写一个程序：当开始运行时，让二零算出 12 + 7 和 12 - 7，并把两个答案都说出来。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「把变量 x 设为 12」「把变量 y 设为 7」；③ 放一个「说」，数字口接黄色「加」积木，左右都放进「变量 x」「变量 y」；④ 再放一个「说」，接黄色「减」积木（也都是变量 x、y）；⑤ 点运行，听二零当小计算器！",
  steps: [
    { id: 1, title: "用变量输入两个数" },
    { id: 2, title: "用加 / 减等算术积木算出结果" },
    { id: 3, title: "点运行听二零算出答案" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">x</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
          <next>
            <block type="maker_set_var">
              <field name="NAME">y</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">7</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT">
                    <block type="maker_add">
                      <value name="A"><block type="maker_get_var"><field name="NAME">x</field></block></value>
                      <value name="B"><block type="maker_get_var"><field name="NAME">y</field></block></value>
                    </block>
                  </value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT">
                        <block type="maker_sub">
                          <value name="A"><block type="maker_get_var"><field name="NAME">x</field></block></value>
                          <value name="B"><block type="maker_get_var"><field name="NAME">y</field></block></value>
                        </block>
                      </value>
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
