import type { CourseProject } from "@/courses";

export const mathFibProject: CourseProject = {
  slug: "math_fib",
  category: "math",
  title: "斐波那契数列",
  ageGroup: "9-12 岁",
  description: "从 0、1 出发，后面每一项都等于前两项之和（0,1,1,2,3,5,8…）。用三个变量滚动更新，让程序把这条神奇的数列一项项说出来。",
  missionBrief: "写一个程序：设置 a=0、b=1，先说出 a、b，再用「重复执行 9 次」每次算出 c = a + b、说出 c，然后把 a 更新成 b、b 更新成 c。",
  erLingHint: "① 拖绿色「当开始运行」→ 设置变量 a=0、b=1，分别「说 a」「说 b」；② 接「重复执行 9 次」：里面「设置变量 c = a + b」「说 c」「设置变量 a = b」「设置变量 b = c」；③ 点运行看数列到 55。",
  steps: [
    { id: 1, title: "用变量 a、b 记下数列开头两项" },
    { id: 2, title: "用循环让 c = a + b 并滚动更新 a、b" },
    { id: 3, title: "点运行，看数列一路长到 55" },
  ],
  goal: { saidIncludes: ["55"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">a</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="maker_set_var">
              <field name="NAME">b</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">a</field></block></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><block type="maker_get_var"><field name="NAME">b</field></block></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="controls_repeat_ext">
                          <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                          <statement name="DO">
                            <block type="maker_set_var">
                              <field name="NAME">c</field>
                              <value name="VALUE"><block type="maker_add">
                                <value name="A"><block type="maker_get_var"><field name="NAME">a</field></block></value>
                                <value name="B"><block type="maker_get_var"><field name="NAME">b</field></block></value>
                              </block></value>
                              <next>
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">c</field></block></value>
                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                  <next>
                                    <block type="maker_set_var">
                                      <field name="NAME">a</field>
                                      <value name="VALUE"><block type="maker_get_var"><field name="NAME">b</field></block></value>
                                      <next>
                                        <block type="maker_set_var">
                                          <field name="NAME">b</field>
                                          <value name="VALUE"><block type="maker_get_var"><field name="NAME">c</field></block></value>
                                        </block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </next>
                            </block>
                          </statement>
                        </block>
                      </next>
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
