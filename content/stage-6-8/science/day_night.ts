import type { CourseProject } from "@/courses";

export const dayNightProject: CourseProject = {
  slug: "day_night",
  category: "science",
  title: "昼夜更替",
  ageGroup: "6-8 岁",
  description: "让天空从明亮的白天慢慢变成安静的夜晚，观察一天里光线的变化。",
  missionBrief:
    "地球自己转一圈，就有了白天和黑夜。写一个程序：当开始运行（时间轴）时，让「背景明暗」从 0 慢慢变到 220（白天→夜晚），并在第 5 秒让二零说「天黑了，星星要出来啦」。点运行，拖动进度条看看一天的变化！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的 背景明暗 从 0 到 220（在 0~8 秒）」；③ 再放「当时间到达 5 秒，让 二零 说 天黑了，星星要出来啦 持续 3 秒」。点运行，用进度条拉动看昼夜变化！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动科学模拟" },
    { id: 2, title: "让背景明暗从白天平滑变到夜晚" },
    { id: 3, title: "到某个时刻让二零说出旁白，点运行看昼夜变化" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">bgHue</field>
          <field name="A">0</field>
          <field name="B">220</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">5</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">天黑了，星星要出来啦</field>
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
