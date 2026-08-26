import type { CourseProject } from "@/courses";

export const scienceLightProject: CourseProject = {
  slug: "science_light",
  category: "science",
  title: "光为什么会拐弯",
  ageGroup: "9-12 岁",
  description: "光在同一种介质里直着走，但从空气斜射进水面时会改变方向，这就是折射。用时间轴模拟一条光路的弯折。",
  missionBrief:
    "光从空气进入水中会偏折。写一个程序：当开始运行（时间轴）时，先让二零笔直向下移动（上下位置 -100 到 0，0~4 秒），到达水面后再让它斜着前进（左右位置 0 到 60、上下位置 0 到 100，4~8 秒），并在第 4 秒让二零说「光线从空气斜射入水，会向法线偏折，这就是折射」。点运行，看光路怎么拐弯！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的 上下位置 从 -100 到 0（在 0~4 秒）」代表空气中的直线光；③ 接着放「让 二零 的 左右位置 从 0 到 60（在 4~8 秒）」和「上下位置 从 0 到 100（在 4~8 秒）」让光斜着走；④ 再放「当时间到达 4 秒，让 二零 说 光线从空气斜射入水…… 持续 3 秒」。点运行看折射！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让光先直走、再到水面后斜着走（两条以上变化轨道）" },
    { id: 3, title: "到水面时刻让二零说出折射的解说，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">y</field>
          <field name="A">-100</field>
          <field name="B">0</field>
          <field name="T0">0</field>
          <field name="T1">4</field>
          <next>
            <block type="maker_tween_prop">
              <field name="ACTOR">erling</field>
              <field name="PROP">x</field>
              <field name="A">0</field>
              <field name="B">60</field>
              <field name="T0">4</field>
              <field name="T1">8</field>
              <next>
                <block type="maker_tween_prop">
                  <field name="ACTOR">erling</field>
                  <field name="PROP">y</field>
                  <field name="A">0</field>
                  <field name="B">100</field>
                  <field name="T0">4</field>
                  <field name="T1">8</field>
                  <next>
                    <block type="maker_when_at_say">
                      <field name="ACTOR">erling</field>
                      <field name="T">4</field>
                      <value name="TEXT">
                        <shadow type="text">
                          <field name="TEXT">光线从空气斜射入水，会向法线偏折，这就是折射</field>
                        </shadow>
                      </value>
                      <field name="SECONDS">3</field>
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
