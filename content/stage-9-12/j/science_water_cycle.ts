import type { CourseProject } from "@/courses";

export const scienceWaterCycleProject: CourseProject = {
  slug: "science_water_cycle",
  category: "science",
  title: "水循环去哪儿了",
  ageGroup: "9-12 岁",
  description: "江海里的雨水被太阳晒成水汽升上天空，结成云，又变成雨落回地面，这就是水循环。用时间轴模拟它。",
  missionBrief:
    "水会不断旅行：太阳把地面上的水蒸发到天上，变成云，再以下雨的形式回到地面。写一个程序：当开始运行（时间轴）时，先让二零向上移动（蒸发上升，0~3 秒），再让天空下起雨（3~8 秒），并在第 8 秒让二零说「雨水落回地面，水循环完成一圈」。点运行，看水怎么旅行！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的 上下位置 从 0 到 -80（在 0~3 秒）」代表蒸发上升；③ 接着放「让天空下起雨（在 3~8 秒）」；④ 再放「当时间到达 8 秒，让 二零 说 雨水落回地面…… 持续 3 秒」。点运行看水循环！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让水汽蒸发上升，再让天空下起雨" },
    { id: 3, title: "到结尾让二零说出水循环的解说，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">y</field>
          <field name="A">0</field>
          <field name="B">-80</field>
          <field name="T0">0</field>
          <field name="T1">3</field>
          <next>
            <block type="maker_emit_rain">
              <field name="T0">3</field>
              <field name="T1">8</field>
              <field name="RATE">20</field>
              <field name="SMIN">60</field>
              <field name="SMAX">120</field>
              <next>
                <block type="maker_when_at_say">
                  <field name="ACTOR">erling</field>
                  <field name="T">8</field>
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">雨水落回地面，水循环完成一圈</field>
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
