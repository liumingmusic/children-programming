import type { CourseProject } from "@/courses";

export const scienceSoundProject: CourseProject = {
  slug: "science_sound",
  category: "science",
  title: "声音怎样传出去",
  ageGroup: "9-12 岁",
  description: "声音不是凭空消失，而是像一圈圈水波那样从声源向外扩散，碰到耳朵才被听到。用时间轴模拟声波传播。",
  missionBrief:
    "声音以波的形式向外扩散。写一个程序：当开始运行（时间轴）时，让二零的大小从 0.2 慢慢变到 3（0~8 秒），就像一圈圈声波不断变大向外传；并在第 4 秒让二零说「声音像一圈圈水波向外扩散，碰到耳朵就被听到」。点运行，看声波怎么传开！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的大小 从 0.2 到 3（在 0~8 秒）」代表声波一圈圈变大；③ 再放「当时间到达 4 秒，让 二零 说 声音像一圈圈水波…… 持续 3 秒」。点运行看声音传播！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让二零的大小随时间不断变大（代表声波向外扩散）" },
    { id: 3, title: "到某个时刻让二零说出声音传播的解说，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">size</field>
          <field name="A">0.2</field>
          <field name="B">3</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">4</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">声音像一圈圈水波向外扩散，碰到耳朵就被听到</field>
                </shadow>
              </value>
              <field name="SECONDS">3</field>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
