import type { CourseProject } from "@/courses";

export const mathPrimeSieveProject: CourseProject = {
  slug: "math_prime_sieve",
  category: "math",
  title: "质数筛查",
  ageGroup: "9-12 岁",
  description: "用「试除法」找出 30 以内的质数：对每个数 n，试着用 2 到 n-1 去整除它，只要有一个能整除，n 就不是质数。把判断出来的质数一个个说出来。",
  missionBrief: "写一个程序：变量 n 从 2 数到 30；对每个 n，先假定它是质数(isP=1)，再用内层循环用 2…n-1 试除，能整除就把 isP 改成 0；最后如果 isP 还是 1 就说 n（它就是质数）。",
  erLingHint: "① 拖绿色「当开始运行」→「设置变量 n = 2」，接「重复执行 29 次」；② 里面「设置变量 isP = 1」「设置变量 i = 2」，再接「重复执行 (n-2) 次」：如果「n 取余数 i 等于 0」就「设置变量 isP = 0」，然后「变量 i 增加 1」；③ 出来后「如果 isP 等于 1 那么 说 n」，最后「变量 n 增加 1」。",
  steps: [
    { id: 1, title: "用变量 n 从 2 数到 30" },
    { id: 2, title: "内层用 2…n-1 试除判断质数" },
    { id: 3, title: "点运行，听 30 以内的质数一个个报出来" },
  ],
  goal: { saidIncludes: ["29"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">n</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">29</field></shadow></value>
              <statement name="DO">
                <block type="maker_set_var">
                  <field name="NAME">isP</field>
                  <value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_set_var">
                      <field name="NAME">i</field>
                      <value name="VALUE"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                      <next>
                        <block type="controls_repeat_ext">
                          <value name="TIMES"><block type="maker_sub">
                            <value name="A"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                            <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                          </block></value>
                          <statement name="DO">
                            <block type="controls_if">
                              <value name="IF0">
                                <block type="maker_compare">
                                  <value name="A">
                                    <block type="maker_mod">
                                      <value name="A"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                                      <value name="B"><block type="maker_get_var"><field name="NAME">i</field></block></value>
                                    </block>
                                  </value>
                                  <value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                                </block>
                              </value>
                              <statement name="DO0">
                                <block type="maker_set_var">
                                  <field name="NAME">isP</field>
                                  <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                                </block>
                              </statement>
                              <next>
                                <block type="maker_change_var">
                                  <field name="NAME">i</field>
                                  <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="controls_if">
                              <value name="IF0">
                                <block type="maker_compare">
                                  <value name="A"><block type="maker_get_var"><field name="NAME">isP</field></block></value>
                                  <value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                </block>
                              </value>
                              <statement name="DO0">
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                </block>
                              </statement>
                              <next>
                                <block type="maker_change_var">
                                  <field name="NAME">n</field>
                                  <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                </block>
                              </next>
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
      </statement>
    </block>
  </xml>`,
};
