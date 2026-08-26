import type { CourseProject } from "@/courses";

export const musicDoremiProject: CourseProject = {
  slug: "music_doremi",
  category: "music",
  title: "弹 do-re-mi",
  ageGroup: "9-12 岁",
  description: "认识七个基本音 do、re、mi…，用「弹奏音符」积木依次弹出 do-re-mi，听一听音阶是怎么一级一级往上升的。",
  missionBrief: "写一个程序：当开始运行时，依次弹奏 do、re、mi 三个音（每个持续 1 拍）。点运行，听音阶一级一级往上升。",
  erLingHint: "① 拖绿色「当开始运行」→ 接「弹奏音符 do 持续 1 拍」；② 接着接「弹奏音符 re」；③ 再接「弹奏音符 mi」；点运行听音阶。",
  steps: [
    { id: 1, title: "用「当开始运行」开始弹奏" },
    { id: 2, title: "依次接上 do、re、mi 三个音符" },
    { id: 3, title: "点运行，听音阶一级一级往上升" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
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
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
