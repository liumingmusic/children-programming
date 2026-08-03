import type { CourseProject } from "@/courses";

export const drumBeatProject: CourseProject = {
  slug: "drum_beat",
  category: "music",
  title: "敲出节奏鼓点",
  ageGroup: "6-8 岁",
  description: "用「敲响」积木和循环，做出有节奏的鼓点。",
  missionBrief: "造物星球要开音乐会啦！写一个程序：当开始运行时，让二零用「重复执行」连续敲出鼓点，做出「咚、嚓、咚、嚓」的节奏。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里先放一个「敲响 鼓」，再用「下一个」接一个「敲响 镲」；④ 点「运行」，听二零敲出节奏！",
  steps: [
    { id: 1, title: "用「敲响」积木" },
    { id: 2, title: "用循环敲出一段节奏" },
    { id: 3, title: "点击运行听到鼓点" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_play_drum">
              <field name="KIND">kick</field>
              <next>
                <block type="maker_play_drum">
                  <field name="KIND">hat</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
