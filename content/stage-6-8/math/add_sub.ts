import type { CourseProject } from "@/courses";

export const addSubProject: CourseProject = {
  slug: "add_sub",
  category: "math",
  title: "加减法小助手",
  ageGroup: "6-8 岁",
  description: "用「加法」「减法」积木算出结果，再把答案说出来。",
  missionBrief:
    "造物星球的小商店要用到算术。写一个程序：当开始运行时，让二零算出 3 + 5 和 8 - 2，并把两个答案都说出来。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 里面放一个粉色「说」，把它的数字口接上一个黄色「加」积木（左边 3、右边 5）；③ 下面再放一个「说」，接上黄色「减」积木（左边 8、右边 2）；④ 点运行，听二零报出 8 和 6！",
  steps: [
    { id: 1, title: "用加法积木算出结果" },
    { id: 2, title: "用减法积木算出结果" },
    { id: 3, title: "点运行听二零报出答案" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT">
            <block type="maker_add">
              <value name="A"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <value name="B"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
            </block>
          </value>
          <next>
            <block type="maker_say">
              <value name="TEXT">
                <block type="maker_sub">
                  <value name="A"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                  <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
