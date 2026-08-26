import type { CourseProject } from "@/courses";

export const listQueueProject: CourseProject = {
  slug: "list_queue",
  category: "list",
  title: "排队模拟",
  ageGroup: "9-12 岁",
  description: "队伍就是一种列表：排在前面的先离开，新来的排到末尾。用「移除第 1 项」和「加入」，就能模拟真实的排队过程。",
  missionBrief:
    "模拟一支小动物排队。当开始运行时，新建「队伍」列表，加入 小猫、小狗、小兔；先「说 列表 队伍」展示；再用「从列表 队伍 移除第 1 项」让队首离开，接着「把 小熊 加入列表 队伍」让新成员排到队尾，最后再「说 列表 队伍」看队伍变成什么样。",
  erLingHint:
    "① 新建列表「队伍」并加入 3 只小动物；②「说 列表 队伍」展示；③「移除第 1 项」让队首离开，再「把 小熊 加入列表 队伍」排到末尾；④ 再「说 列表 队伍」。点运行看排队变化！",
  steps: [
    { id: 1, title: "新建一个名为「队伍」的列表并加入成员" },
    { id: 2, title: "把成员加入列表（填充队伍）" },
    { id: 3, title: "移除队首并加入新成员后展示，点运行看变化" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">队伍</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">队伍</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">小猫</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">队伍</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">小狗</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">队伍</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">小兔</field></shadow></value>
                      <next>
                        <block type="maker_say">
                          <value name="TEXT"><block type="maker_list_var"><field name="NAME">队伍</field></block></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                          <next>
                            <block type="maker_list_remove">
                              <field name="NAME">队伍</field>
                              <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                              <next>
                                <block type="maker_list_add">
                                  <field name="NAME">队伍</field>
                                  <value name="VALUE"><shadow type="text"><field name="TEXT">小熊</field></shadow></value>
                                  <next>
                                    <block type="maker_say">
                                      <value name="TEXT"><block type="maker_list_var"><field name="NAME">队伍</field></block></value>
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
  goal: { saidIncludes: ["小猫"] },
};
