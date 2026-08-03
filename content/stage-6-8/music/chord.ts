import type { CourseProject } from "@/courses";

export const chordProject: CourseProject = {
  slug: "chord",
  category: "music",
  title: "弹一个和弦",
  ageGroup: "6-8 岁",
  description: "用「弹和弦」积木，让几个音同时响起来。",
  missionBrief: "和弦是几个音同时响起，听起来更饱满。写一个程序：当开始运行时，让二零用一个「弹和弦」积木，同时弹出 do、mi、sol 三个音，组成好听的大三和弦。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面放一个「弹和弦」积木，三个音符默认就是 do、mi、sol；③ 点「运行」，听三个音同时响起的饱满和声！",
  steps: [
    { id: 1, title: "用「弹和弦」积木" },
    { id: 2, title: "和弦里包含至少 2 个音" },
    { id: 3, title: "点击运行听到和弦" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_chord">
          <field name="N1">do</field>
          <field name="N2">mi</field>
          <field name="N3">sol</field>
        </block>
      </statement>
    </block>
  </xml>`,
};
