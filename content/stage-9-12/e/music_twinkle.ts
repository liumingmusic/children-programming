import type { CourseProject } from "@/courses";

export const musicTwinkleProject: CourseProject = {
  slug: "music_twinkle",
  category: "music",
  title: "小星星",
  ageGroup: "9-12 岁",
  description: "用「弹奏音符」积木把《小星星》的开头一句弹出来：do do sol sol la la sol，听熟悉的旋律从积木里流出来。",
  missionBrief: "写一个程序：当开始运行时，依次弹奏 do、do、sol、sol、la、la、sol（每个 1 拍）。点运行，听《小星星》的前一句。",
  erLingHint: "① 拖绿色「当开始运行」；② 依次接 7 个「弹奏音符」：do、do、sol、sol、la、la、sol（都持续 1 拍）；③ 点运行听旋律。",
  steps: [
    { id: 1, title: "用「当开始运行」开始弹旋律" },
    { id: 2, title: "依次接上 do do sol sol la la sol" },
    { id: 3, title: "点运行，听《小星星》的前一句" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">do</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">do</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
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
                              <field name="NOTE">la</field>
                              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                              <next>
                                <block type="maker_play_note">
                                  <field name="NOTE">sol</field>
                                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
};
