import type { CourseProject } from "@/courses";

export const compareSizeProject: CourseProject = {
  slug: "compare_size",
  category: "math",
  title: "比一比谁更大",
  ageGroup: "6-8 岁",
  description: "用「变量」记下两个数，再用「比较」积木判断谁大谁小。",
  missionBrief:
    "造物星球的两颗能量球，一颗是 8，一颗是 3。写一个程序：当开始运行时，让二零比较它们，说出「8 比 3 大！」。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 里面放两个「把变量 a 设为 8」「把变量 b 设为 3」；③ 再放一个「如果…那么」，条件里放「比较 变量 a 大于 变量 b」；④ 那么里放「说 8 比 3 大！」；⑤ 点运行，看二零比大小。",
  steps: [
    { id: 1, title: "用变量记下两个数" },
    { id: 2, title: "用比较积木判断谁更大" },
    { id: 3, title: "点运行听二零比出大小" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">a</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <next>
            <block type="maker_set_var">
              <field name="NAME">b</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next>
                <block type="controls_if">
                  <value name="IF0">
                    <block type="maker_compare">
                      <value name="A"><block type="maker_get_var"><field name="NAME">a</field></block></value>
                      <value name="B"><block type="maker_get_var"><field name="NAME">b</field></block></value>
                      <field name="OP">&gt;</field>
                    </block>
                  </value>
                  <statement name="DO0">
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">8 比 3 大！</field></shadow></value>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
