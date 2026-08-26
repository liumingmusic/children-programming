import type { CourseProject } from "@/courses";

export const listTodoProject: CourseProject = {
  slug: "list_todo",
  category: "list",
  title: "待办清单",
  ageGroup: "9-12 岁",
  description: "待办清单可以记录要做的事，做完一项就从列表里划掉一项。学会用「移除第几项」来更新列表，体会数据会随时间变化。",
  missionBrief:
    "做一个待办清单。当开始运行时，新建「待办」列表，加入 写作业、练琴、运动、看书；先让二零「说 列表 待办」展示全部任务；再用「从列表 待办 移除第 1 项」划掉第一项（写完作业），最后再「说 列表 待办」看看还剩什么。",
  erLingHint:
    "① 新建列表「待办」并加入 4 件事；② 拖「说」放「列表 待办」展示；③ 拖「从列表 待办 移除第 1 项」划掉已完成的那件，再「说 列表 待办」看剩下的。点运行！",
  steps: [
    { id: 1, title: "新建一个名为「待办」的列表并加入任务" },
    { id: 2, title: "把任务加入列表（填充内容）" },
    { id: 3, title: "展示列表并移除一项，点运行看更新" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">待办</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">待办</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">写作业</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">待办</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">练琴</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">待办</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">运动</field></shadow></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">待办</field>
                          <value name="VALUE"><shadow type="text"><field name="TEXT">看书</field></shadow></value>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><block type="maker_list_var"><field name="NAME">待办</field></block></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                              <next>
                                <block type="maker_list_remove">
                                  <field name="NAME">待办</field>
                                  <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                  <next>
                                    <block type="maker_say">
                                      <value name="TEXT"><block type="maker_list_var"><field name="NAME">待办</field></block></value>
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
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["写作业"] },
};
