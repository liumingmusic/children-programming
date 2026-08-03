import type { CourseProject } from "@/courses";

export const playDoremiProject: CourseProject = {
  slug: "play_doremi",
  category: "music",
  title: "弹奏 do re mi",
  ageGroup: "6-8 岁",
  description: "用「弹奏音符」积木，让二零唱出 do re mi。",
  missionBrief: "造物星球上有一架会唱歌的小琴。写一个程序：当开始运行时，让二零依次弹出 do、re、mi 三个音，奏出最基础的小调子。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面接一个紫色「弹奏音符」积木（默认 do）；③ 在它下面再接两个「弹奏音符」，分别把音符改成 re、mi；④ 点「运行」，听二零唱出 do re mi！",
  steps: [
    { id: 1, title: "用「弹奏音符」积木" },
    { id: 2, title: "弹出 do re mi 三个音" },
    { id: 3, title: "点击运行听到旋律" },
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
