import type { CourseProject } from "@/courses";

export const moonPhaseProject: CourseProject = {
  slug: "moon_phase",
  category: "science",
  title: "月亮的脸",
  ageGroup: "6-8 岁",
  description: "月亮每个月都会变样子：有时细得像眉毛，有时圆得像盘子。",
  missionBrief:
    "月亮自己不会发光，它被太阳照亮的部分有时多、有时少，就有了月相。写一个程序：当开始运行（时间轴）时，让二零的「显示程度」从 0.15 慢慢变到 1（新月→满月）；并在第 1 秒让二零说「我从弯弯的月牙，变成了圆圆的满月」。点运行，看月亮的脸怎么变！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的 显示程度 从 0.15 到 1（在 0~8 秒）」（月亮由缺变圆）；③ 再放「当时间到达 1 秒，让 二零 说 我从弯弯的月牙，变成了圆圆的满月 持续 3 秒」。点运行看月相变化！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让月亮随时间从新月（暗）变到满月（亮）" },
    { id: 3, title: "让二零说出月相变化，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">alpha</field>
          <field name="A">0.15</field>
          <field name="B">1</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">1</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">我从弯弯的月牙，变成了圆圆的满月</field>
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
