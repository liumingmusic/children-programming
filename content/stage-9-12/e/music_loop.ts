import type { CourseProject } from "@/courses";

export const musicLoopProject: CourseProject = {
  slug: "music_loop",
  category: "music",
  title: "循环旋律",
  ageGroup: "9-12 岁",
  description: "用「重复执行」积木把一小段旋律反复弹奏，体会循环怎么让音乐自动一遍遍响起来，而不用手动复制一堆音符。",
  missionBrief: "写一个程序：当开始运行时，用「重复执行 4 次」包住 do、re、mi、re 四个音符，让这段旋律循环 4 遍。",
  erLingHint: "① 拖绿色「当开始运行」→ 接「重复执行 4 次」；② 在重复里面依次接 do、re、mi、re（各 1 拍）；③ 点运行，听旋律循环 4 遍。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "用「重复执行」包住一小段旋律 do-re-mi-re" },
    { id: 3, title: "点运行，听旋律自动循环" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
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
                          <field name="NOTE">re</field>
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
