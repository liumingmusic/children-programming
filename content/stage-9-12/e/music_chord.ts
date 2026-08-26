import type { CourseProject } from "@/courses";

export const musicChordProject: CourseProject = {
  slug: "music_chord",
  category: "music",
  title: "简单和弦",
  ageGroup: "9-12 岁",
  description: "用「弹和弦」积木一次响起三个音（比如 do+mi+sol），听听几个音叠在一起怎么变得饱满好听——这就是和弦。",
  missionBrief: "写一个程序：当开始运行时，依次弹三组不同的和弦（do·mi·sol → re·fa·la → mi·sol·高音do），听和弦的色彩变化。",
  erLingHint: "① 拖绿色「当开始运行」；② 接「弹和弦 do、mi、sol」；③ 接着接「弹和弦 re、fa、la」和「弹和弦 mi、sol、高音do」；点运行听和弦。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "依次接上三组「弹和弦」" },
    { id: 3, title: "点运行，听和弦叠在一起的饱满感" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_chord">
          <field name="N1">do</field>
          <field name="N2">mi</field>
          <field name="N3">sol</field>
          <next>
            <block type="maker_play_chord">
              <field name="N1">re</field>
              <field name="N2">fa</field>
              <field name="N3">la</field>
              <next>
                <block type="maker_play_chord">
                  <field name="N1">mi</field>
                  <field name="N2">sol</field>
                  <field name="N3">do2</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
