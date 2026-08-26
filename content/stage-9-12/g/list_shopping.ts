import type { CourseProject } from "@/courses";

export const listShoppingProject: CourseProject = {
  slug: "list_shopping",
  category: "list",
  title: "购物清单",
  ageGroup: "9-12 岁",
  description: "列表就像一个能装很多东西的购物袋。学会用「新建列表」和「把 X 加入列表」，把想买的东西一件件记下来，再让二零一口气念出来。",
  missionBrief:
    "用列表帮妈妈记一张购物清单。写一个程序：当开始运行时，新建一个叫「购物清单」的列表，把 苹果、香蕉、牛奶、面包 一样样加进去，最后让二零「说 列表 购物清单」把清单念出来，再「说 列表 购物清单 的长度」告诉大家一共买了几样。",
  erLingHint:
    "① 从「列表」分类拖「新建列表」，名字填 购物清单；② 连续拖 4 个「把 X 加入列表」，分别填 苹果、香蕉、牛奶、面包；③ 拖「说」，里面放「列表 购物清单」，再拖一个「说」放「列表 购物清单 的长度」。点运行，看二零念清单！",
  steps: [
    { id: 1, title: "新建一个名为「购物清单」的列表" },
    { id: 2, title: "把想买的东西一件件加入列表" },
    { id: 3, title: "把列表内容展示出来，点运行看二零念清单" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">购物清单</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">购物清单</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">购物清单</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">香蕉</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">购物清单</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">牛奶</field></shadow></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">购物清单</field>
                          <value name="VALUE"><shadow type="text"><field name="TEXT">面包</field></shadow></value>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><block type="maker_list_var"><field name="NAME">购物清单</field></block></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                              <next>
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_list_length"><field name="NAME">购物清单</field></block></value>
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
  goal: { saidIncludes: ["苹果"] },
};
