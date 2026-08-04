import type { CourseProject } from "@/courses";

export const countApplesProject: CourseProject = {
  slug: "count_apples",
  category: "math",
  title: "数一数苹果",
  ageGroup: "6-8 岁",
  description: "树上有 5 个苹果，用「重复执行」和「变量」把它们一个一个数出来。",
  missionBrief:
    "造物星球的小果园丰收啦！写一个程序：当开始运行时，让二零把树上的 5 个苹果一个一个数出来，最后告诉大家「一共 5 个苹果」。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面放橙色「重复执行 5 次」；③ 循环里先放「变量 n 增加 1」，再放「说 变量 n」；④ 循环外面再放一个「说 一共 5 个苹果！」；⑤ 点运行，听二零清点苹果。",
  steps: [
    { id: 1, title: "用重复执行或变量来数苹果" },
    { id: 2, title: "一边加一边说出数字，数到 5" },
    { id: 3, title: "点运行听二零数完苹果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
          <statement name="DO">
            <block type="maker_change_var">
              <field name="NAME">n</field>
              <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">一共 5 个苹果！</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
