import type { CourseProject } from "@/courses";

export const myBandProject: CourseProject = {
  slug: "my_band",
  category: "pbl",
  title: "我的小乐队",
  ageGroup: "6-8 岁",
  description: "综合音乐与循环，让二零连续奏出一段会循环的小旋律。",
  missionBrief:
    "造物星球要开一场小小音乐会。写一个程序：当开始运行时，让二零用「弹奏音符」连奏 do、re、mi、fa 四个音，再用「重复执行」把它变成会循环演奏的旋律。组合你学过的音乐本领，开一场自己的演奏会吧！",
  erLingHint:
    "① 绿色「当开始运行」里放几个紫色「弹奏音符」（do、re、mi、fa）；② 把它们整体放进「重复执行 2 次」，旋律就会循环演奏；③ 点运行，听二零的小乐队奏起来！",
  steps: [
    { id: 1, title: "用「弹奏音符」奏出旋律" },
    { id: 2, title: "用循环让旋律重复" },
    { id: 3, title: "运行听到完整的演奏" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <shadow type="math_number"><field name="NUM">2</field></shadow>
          </value>
          <statement name="DO">
            <block type="maker_play_note">
              <field name="NOTE">do</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">re</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">mi</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">fa</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
