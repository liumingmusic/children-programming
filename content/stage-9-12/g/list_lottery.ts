import type { CourseProject } from "@/courses";

export const listLotteryProject: CourseProject = {
  slug: "list_lottery",
  category: "list",
  title: "幸运抽奖机",
  ageGroup: "9-12 岁",
  description: "把奖品放进列表，用「随机整数」抽一个，就成了一台抽奖机。和随机点名器一样，都是「列表 + 随机」的经典用法。",
  missionBrief:
    "做一台抽奖机。当开始运行时，新建「奖池」列表，把 一等奖、二等奖、三等奖、谢谢参与 加进去；让二零「说 列表 奖池 的第 随机整数(1, 列表 奖池 的长度) 项」，每次运行随机抽出一个结果。",
  erLingHint:
    "① 新建列表「奖池」并加入 4 个奖项；② 拖「说」，里面放「列表 奖池 的第 几项」，把「几项」换成「随机整数(1, 列表 奖池 的长度)」。点运行，看二零抽中什么！",
  steps: [
    { id: 1, title: "新建一个名为「奖池」的列表并加入奖项" },
    { id: 2, title: "用随机整数从奖池里抽一个位置" },
    { id: 3, title: "把抽到的奖项说出来，点运行看抽奖" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">奖池</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">奖池</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">一等奖</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">奖池</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">二等奖</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">奖池</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">三等奖</field></shadow></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">奖池</field>
                          <value name="VALUE"><shadow type="text"><field name="TEXT">谢谢参与</field></shadow></value>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><block type="maker_list_item">
                                <field name="NAME">奖池</field>
                                <value name="INDEX"><block type="maker_random_int">
                                  <value name="MIN"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                  <value name="MAX"><block type="maker_list_length"><field name="NAME">奖池</field></block></value>
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
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["一等奖", "二等奖", "三等奖", "谢谢参与"] },
};
