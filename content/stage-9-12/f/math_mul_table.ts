import type { CourseProject } from "@/courses";

export const mathMulTableProject: CourseProject = {
  slug: "math_mul_table",
  category: "math",
  title: "乘法表生成",
  ageGroup: "9-12 岁",
  description: "用「变量」+「重复执行」自动生成 9 的乘法表：每次让积增加 9 并说出来，体会乘法就是连加、循环能替我们省力气。",
  missionBrief: "写一个程序：用变量「积」从 0 开始，重复 9 次「积 增加 9、说出 积」。点运行，看 9、18、27…一直加到 81。",
  erLingHint: "① 拖绿色「当开始运行」→「设置变量 积 = 0」；② 接「重复执行 9 次」，里面放「变量 积 增加 9」和「说 积」；③ 点运行看 9 的乘法表。",
  steps: [
    { id: 1, title: "用变量「积」记下当前结果" },
    { id: 2, title: "用「重复执行」让积不断加 9" },
    { id: 3, title: "点运行，看 9 的乘法表一直加到 81" },
  ],
  goal: { saidIncludes: ["81"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">积</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
              <statement name="DO">
                <block type="maker_change_var">
                  <field name="NAME">积</field>
                  <value name="DELTA"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><block type="maker_get_var"><field name="NAME">积</field></block></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
