import type { CourseProject } from "@/courses";

export const listScoresProject: CourseProject = {
  slug: "list_scores",
  category: "list",
  title: "成绩统计分析",
  ageGroup: "9-12 岁",
  description: "把一组分数放进列表，再用「重复执行」配合「列表的第几项」把每一项加起来，就能算出总分。这是「列表 + 循环」做统计的第一步。",
  missionBrief:
    "统计五次考试的总分。当开始运行时，新建「成绩」列表，加入 90、85、95、80、100；用变量「总分」从 0 开始，再「重复 列表 成绩 的长度 次」——每次把「列表 成绩 的第 i 项」加到总分上、并让 i 增加 1；最后「说 总分」告诉大家总和是多少。",
  erLingHint:
    "① 新建列表「成绩」并加入 5 个数字；②「设置变量 总分=0」「设置变量 i=1」；③ 拖「重复执行」，次数用「列表 成绩 的长度」，里面放「变量 总分 增加 列表 成绩 的第 i 项」「变量 i 增加 1」；④「说 总分」。点运行，看总分 450！",
  steps: [
    { id: 1, title: "新建一个名为「成绩」的列表并加入分数" },
    { id: 2, title: "用变量和循环把列表里的分数一项项加起来" },
    { id: 3, title: "把统计结果（总分）说出来，点运行看计算" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">成绩</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">成绩</field>
              <value name="VALUE"><block type="math_number"><field name="NUM">90</field></block></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">成绩</field>
                  <value name="VALUE"><block type="math_number"><field name="NUM">85</field></block></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">成绩</field>
                      <value name="VALUE"><block type="math_number"><field name="NUM">95</field></block></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">成绩</field>
                          <value name="VALUE"><block type="math_number"><field name="NUM">80</field></block></value>
                          <next>
                            <block type="maker_list_add">
                              <field name="NAME">成绩</field>
                              <value name="VALUE"><block type="math_number"><field name="NUM">100</field></block></value>
                              <next>
                                <block type="maker_set_var">
                                  <field name="NAME">总分</field>
                                  <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                                  <next>
                                    <block type="maker_set_var">
                                      <field name="NAME">i</field>
                                      <value name="VALUE"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                      <next>
                                        <block type="controls_repeat_ext">
                                          <value name="TIMES"><block type="maker_list_length"><field name="NAME">成绩</field></block></value>
                                          <statement name="DO">
                                            <block type="maker_change_var">
                                              <field name="NAME">总分</field>
                                              <value name="DELTA"><block type="maker_list_item">
                                                <field name="NAME">成绩</field>
                                                <value name="INDEX"><block type="maker_get_var"><field name="NAME">i</field></block></value>
                                              </block></value>
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
                                              <value name="TEXT"><block type="maker_get_var"><field name="NAME">总分</field></block></value>
                                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                                              <next>
                                                <block type="maker_say">
                                                  <value name="TEXT"><block type="maker_list_var"><field name="NAME">成绩</field></block></value>
                                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
  </xml>`,
  goal: { saidIncludes: ["450"] },
};
