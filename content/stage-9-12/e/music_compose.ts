import type { CourseProject } from "@/courses";

export const musicComposeProject: CourseProject = {
  slug: "music_compose",
  category: "music",
  title: "自己谱曲",
  ageGroup: "9-12 岁",
  description: "把音符、节奏（不同的拍数）和鼓点自由组合，写出一段属于你自己的小曲子——编程就是你的作曲本。",
  missionBrief: "写一个程序：当开始运行时，用「重复执行 2 次」包住一段你设计的旋律（do re mi sol，最后 sol 拖 2 拍），再敲几下鼓点收尾。点运行，听你写的曲子。",
  erLingHint: "① 拖绿色「当开始运行」→ 接「重复执行 2 次」，里面放 do、re、mi、sol（sol 持续 2 拍）；② 重复外面接几个「敲响 鼓」；③ 点运行听你谱的曲子。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "用循环写一段自己的旋律（带长短节奏）" },
    { id: 3, title: "加鼓点收尾，点运行听你写的曲子" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
                          <field name="NOTE">sol</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="maker_play_drum">
              <field name="KIND">kick</field>
              <next>
                <block type="maker_play_drum">
                  <field name="KIND">hat</field>
                  <next>
                    <block type="maker_play_drum">
                      <field name="KIND">kick</field>
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
