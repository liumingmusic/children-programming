import type { CourseProject } from "@/courses";

export const musicBirthdayProject: CourseProject = {
  slug: "music_birthday",
  category: "music",
  title: "生日快乐",
  ageGroup: "9-12 岁",
  description: "把《生日快乐》歌用「弹奏音符」积木一个音一个音弹出来，体会一首完整的曲子是怎么由一串音符连成的。",
  missionBrief: "写一个程序：当开始运行时，依次弹奏《生日快乐》的音符（sol sol la sol do ti | sol sol la sol re do | sol sol do2 mi do ti la | fa fa mi do re do）。点运行，听听看是不是那首歌。",
  erLingHint: "① 拖绿色「当开始运行」；② 按顺序接一长串「弹奏音符」，每个 1 拍：sol sol la sol do ti / sol sol la sol re do / sol sol do2 mi do ti la / fa fa mi do re do；③ 点运行听整首。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "依次接上《生日快乐》的全部音符" },
    { id: 3, title: "点运行，听是不是那首歌" },
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
                          <field name="NOTE">do</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_play_note">
                              <field name="NOTE">ti</field>
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
                                                      <field name="NOTE">re</field>
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
                                                                      <field name="NOTE">do2</field>
                                                                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                      <next>
                                                                        <block type="maker_play_note">
                                                                          <field name="NOTE">mi</field>
                                                                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                          <next>
                                                                            <block type="maker_play_note">
                                                                              <field name="NOTE">do</field>
                                                                              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                              <next>
                                                                                <block type="maker_play_note">
                                                                                  <field name="NOTE">ti</field>
                                                                                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                  <next>
                                                                                    <block type="maker_play_note">
                                                                                      <field name="NOTE">la</field>
                                                                                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                      <next>
                                                                                        <block type="maker_play_note">
                                                                                          <field name="NOTE">fa</field>
                                                                                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                          <next>
                                                                                            <block type="maker_play_note">
                                                                                              <field name="NOTE">fa</field>
                                                                                              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                              <next>
                                                                                                <block type="maker_play_note">
                                                                                                  <field name="NOTE">mi</field>
                                                                                                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                                  <next>
                                                                                                    <block type="maker_play_note">
                                                                                                      <field name="NOTE">do</field>
                                                                                                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                                      <next>
                                                                                                        <block type="maker_play_note">
                                                                                                          <field name="NOTE">re</field>
                                                                                                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                                                                                                          <next>
                                                                                                            <block type="maker_play_note">
                                                                                                              <field name="NOTE">do</field>
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
