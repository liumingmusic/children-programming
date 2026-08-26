import type { CourseProject } from "@/courses";

export const listRollcallProject: CourseProject = {
  slug: "list_rollcall",
  category: "list",
  title: "随机点名器",
  ageGroup: "9-12 岁",
  description: "把全班同学的名字放进一个列表，再用「随机整数」从列表里抽一个，就做成了一个公平的点名器。列表 + 随机，是数据小工具的常见组合。",
  missionBrief:
    "做一个课堂点名器。当开始运行时，新建「点名表」列表，把 小明、小红、小刚、小丽、小华 加进去；最后让二零「说 列表 点名表 的第 随机整数(1, 列表 点名表 的长度) 项」，每次运行随机点到一位同学。",
  erLingHint:
    "① 新建列表「点名表」并加入 5 个同学名字；② 拖「说」，里面放「列表 点名表 的第 几项」；③ 把「几项」换成「随机整数」，最小值 1、最大值用「列表 点名表 的长度」。点运行，看二零随机点到谁！",
  steps: [
    { id: 1, title: "新建一个名为「点名表」的列表并加入同学" },
    { id: 2, title: "用随机整数从列表里抽一个位置" },
    { id: 3, title: "把抽到的同学说出来，点运行看随机点名" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">点名表</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">点名表</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">小明</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">点名表</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">小红</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">点名表</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">小刚</field></shadow></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">点名表</field>
                          <value name="VALUE"><shadow type="text"><field name="TEXT">小丽</field></shadow></value>
                          <next>
                            <block type="maker_list_add">
                              <field name="NAME">点名表</field>
                              <value name="VALUE"><shadow type="text"><field name="TEXT">小华</field></shadow></value>
                              <next>
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_list_item">
                                    <field name="NAME">点名表</field>
                                    <value name="INDEX"><block type="maker_random_int">
                                      <value name="MIN"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                      <value name="MAX"><block type="maker_list_length"><field name="NAME">点名表</field></block></value>
                                    </block></block></value>
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
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["小明", "小红", "小刚", "小丽", "小华"] },
};
