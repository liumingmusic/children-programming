import type { CourseProject } from "@/courses";

export const mathFactorPrimeProject: CourseProject = {
  slug: "math_factor_prime",
  category: "math",
  title: "因数与质数初识",
  ageGroup: "9-12 岁",
  description: "用「取余数」判断一个数能被谁整除，从而找出它的全部因数。再想一想：只有 1 和它本身两个因数的是质数——这就是质数的秘密。",
  missionBrief: "写一个程序：用变量逐一试 1 到 12，凡是「12 除以 i 的余数为 0」就把 i 说出来（i 就是 12 的因数）。最后想一想质数要满足什么条件。",
  erLingHint: "① 拖绿色「当开始运行」→「设置变量 数 = 12」「说 12 的因数」「设置变量 i = 1」；② 接「重复执行 12 次」：里面放「如果 数 取余数 i 等于 0 那么 说 i」和「变量 i 增加 1」；③ 点运行看 12 的因数。",
  steps: [
    { id: 1, title: "用变量记下要分解的数和试除的 i" },
    { id: 2, title: "用「取余数 == 0」判断 i 是不是因数" },
    { id: 3, title: "点运行，看 12 的全部因数（想想质数的条件）" },
  ],
  goal: { saidIncludes: ["12"] },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">数</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><block type="text"><field name="TEXT">12 的因数</field></block></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_set_var">
                  <field name="NAME">i</field>
                  <value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="controls_repeat_ext">
                      <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                      <statement name="DO">
                        <block type="controls_if">
                          <value name="IF0">
                            <block type="maker_compare">
                              <value name="A">
                                <block type="maker_mod">
                                  <value name="A"><block type="maker_get_var"><field name="NAME">数</field></block></value>
                                  <value name="B"><block type="maker_get_var"><field name="NAME">i</field></block></value>
                                </block>
                              </value>
                              <value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                            </block>
                          </value>
                          <statement name="DO0">
                            <block type="maker_say">
                              <value name="TEXT"><block type="maker_get_var"><field name="NAME">i</field></block></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
                        <block type="maker_say">
                          <value name="TEXT"><block type="text"><field name="TEXT">只有两个因数的是质数</field></block></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
