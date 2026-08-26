import type { CourseProject } from "@/courses";

export const scienceGrowProject: CourseProject = {
  slug: "science_grow",
  category: "science",
  title: "一颗种子长成大树",
  ageGroup: "9-12 岁",
  description: "种子吸足水分、得到阳光就会发芽长大。用时间轴模拟一颗种子从土里钻出来、慢慢长高的过程。",
  missionBrief:
    "种子破土需要两个条件：体积长大、位置从地下升到地面。写一个程序：当开始运行（时间轴）时，让二零的大小从 0.1 变到 1（0~5 秒），同时让它的上下位置从 -80 变到 0（0~5 秒），并在第 5 秒让二零说「种子吸足水分，发芽长成小树」。点运行，看种子怎么长大！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的大小 从 0.1 到 1（在 0~5 秒）」；③ 接着放「让 二零 的 上下位置 从 -80 到 0（在 0~5 秒）」；④ 再放「当时间到达 5 秒，让 二零 说 种子吸足水分…… 持续 3 秒」。点运行看种子长大！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让种子一边变大、一边从地下升到地面（两条变化轨道）" },
    { id: 3, title: "到结尾让二零说出生长的解说，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">size</field>
          <field name="A">0.1</field>
          <field name="B">1</field>
          <field name="T0">0</field>
          <field name="T1">5</field>
          <next>
            <block type="maker_tween_prop">
              <field name="ACTOR">erling</field>
              <field name="PROP">y</field>
              <field name="A">-80</field>
              <field name="B">0</field>
              <field name="T0">0</field>
              <field name="T1">5</field>
              <next>
                <block type="maker_when_at_say">
                  <field name="ACTOR">erling</field>
                  <field name="T">5</field>
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">种子吸足水分，发芽长成小树</field>
                    </shadow>
                  </value>
                  <field name="SECONDS">3</field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
