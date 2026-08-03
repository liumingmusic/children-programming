import type { CourseProject } from "@/courses";

export const birthdayProject: CourseProject = {
  slug: "birthday",
  category: "music",
  title: "生日快乐歌",
  ageGroup: "6-8 岁",
  description: "把音符排好，弹出大家都爱的《生日快乐歌》第一句。",
  missionBrief: "《生日快乐歌》第一句是「祝你生日快乐」。写一个程序：当开始运行时，让二零依次弹出 sol、sol、la、sol、高音do、ti 六个音，奏出这句经典旋律。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面依次接 6 个「弹奏音符」，音符顺序设为 sol、sol、la、sol、高音do、ti（高音do 在下拉里选「高音do」）；③ 点「运行」，为小伙伴唱一首生日歌！",
  steps: [
    { id: 1, title: "用「弹奏音符」积木" },
    { id: 2, title: "弹出至少 6 个音符的旋律" },
    { id: 3, title: "点击运行听到《生日快乐歌》" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">sol</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">sol</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">la</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">do2</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_play_note">
                              <field name="NOTE">ti</field>
                              <value name="BEATS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
};
