import type { CourseProject } from "@/courses";

export const count10Project: CourseProject = {
  slug: "count10",
  category: "math",
  title: "数数 1 到 10",
  ageGroup: "6-8 岁",
  description: "用「重复执行」加上「变量」，让二零一边数一边把数字说出来。",
  missionBrief:
    "造物星球上要办数数比赛。写一个程序：当开始运行时，让二零从 1 数到 10，每数一个数就大声说出来。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面放一个橙色「重复执行 10 次」；③ 循环里先放紫色「变量 n 增加 1」，再放粉色「说 变量 n」（用「变量 n」积木当数字）；④ 点运行，听二零数 1、2、3……10！",
  steps: [
    { id: 1, title: "用重复执行或变量来数数" },
    { id: 2, title: "一边加一边说出数字，数到 10" },
    { id: 3, title: "点运行听二零数完 1-10" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
          <statement name="DO">
            <block type="maker_change_var">
              <field name="NAME">n</field>
              <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
