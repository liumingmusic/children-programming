import type { CourseProject } from "@/courses";

export const listWordsProject: CourseProject = {
  slug: "list_words",
  category: "list",
  title: "单词记忆卡",
  ageGroup: "9-12 岁",
  description: "把要背的英语单词放进一个列表，让二零按列表念出来，再用「长度」告诉你一共要背几个。列表是整理零散知识的好帮手。",
  missionBrief:
    "做一套单词记忆卡。当开始运行时，新建「单词」列表，加入 apple、banana、cat、dog、elephant；让二零「说 列表 单词」把单词念出来，再「说 列表 单词 的长度」告诉你一共几个单词。",
  erLingHint:
    "① 新建列表「单词」并加入 5 个英文单词；② 拖「说」放「列表 单词」展示；③ 再拖「说」放「列表 单词 的长度」。点运行，听二零背单词！",
  steps: [
    { id: 1, title: "新建一个名为「单词」的列表并加入单词" },
    { id: 2, title: "把单词加入列表（填充内容）" },
    { id: 3, title: "展示列表与长度，点运行看记忆卡" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_list_create">
          <field name="NAME">单词</field>
          <next>
            <block type="maker_list_add">
              <field name="NAME">单词</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">apple</field></shadow></value>
              <next>
                <block type="maker_list_add">
                  <field name="NAME">单词</field>
                  <value name="VALUE"><shadow type="text"><field name="TEXT">banana</field></shadow></value>
                  <next>
                    <block type="maker_list_add">
                      <field name="NAME">单词</field>
                      <value name="VALUE"><shadow type="text"><field name="TEXT">cat</field></shadow></value>
                      <next>
                        <block type="maker_list_add">
                          <field name="NAME">单词</field>
                          <value name="VALUE"><shadow type="text"><field name="TEXT">dog</field></shadow></value>
                          <next>
                            <block type="maker_list_add">
                              <field name="NAME">单词</field>
                              <value name="VALUE"><shadow type="text"><field name="TEXT">elephant</field></shadow></value>
                              <next>
                                <block type="maker_say">
                                  <value name="TEXT"><block type="maker_list_var"><field name="NAME">单词</field></block></value>
                                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                                  <next>
                                    <block type="maker_say">
                                      <value name="TEXT"><block type="maker_list_length"><field name="NAME">单词</field></block></value>
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
  goal: { saidIncludes: ["apple"] },
};
