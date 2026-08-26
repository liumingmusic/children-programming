import type { CourseProject } from "@/courses";

export const listRankingProject: CourseProject = {
  slug: "list_ranking",
  category: "list",
  title: "成绩排行榜",
  ageGroup: "9-12 岁",
  description: "把几个人的分数放进列表，列表会按顺序记下每一个。学会用列表管理一组数字，再用「长度」知道一共有几人参加。",
  missionBrief:
    "做一张成绩排行榜。当开始运行时，新建「分数」列表，加入 95、88、100、76、60 这五个分数；让二零「说 列表 分数」把成绩念出来，再「说 列表 分数 的长度」告诉大家一共有几人上榜。",
  erLingHint:
    "① 新建列表「分数」并加入 5 个数字（注意用数字积木，不是文字）；② 拖「说」放「列表 分数」展示；③ 再拖「说」放「列表 分数 的长度」。点运行，看排行榜！",
  steps: [
    { id: 1, title: "新建一个名为「分数」的列表并加入成绩" },
    { id: 2, title: "把数字成绩加入列表（填充内容）" },
    { id: 3, title: "展示列表与人数，点运行看排行榜" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">分数</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">分数</field>
              <value name="VALUE"><block type="math_number"><field name="NUM">95</field></block></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">分数</field>
                  <value name="VALUE"><block type="math_number"><field name="NUM">88</field></block></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">分数</field>
                      <value name="VALUE"><block type="math_number"><field name="NUM">100</field></block></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">分数</field>
                          <value name="VALUE"><block type="math_number"><field name="NUM">76</field></block></value>
                          <next>
                            <block type="maker_list_add">
                              <field name="NAME">分数</field>
                              <value name="VALUE"><block type="math_number"><field name="NUM">60</field></block></value>
                              <next>
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_list_var"><field name="NAME">分数</field></block></value>
                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                                  <next>
                                    <block type="maker_say">
                                      <value name="TEXT"><block type="maker_list_length"><field name="NAME">分数</field></block></value>
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
  goal: { saidIncludes: ["95"] },
};
