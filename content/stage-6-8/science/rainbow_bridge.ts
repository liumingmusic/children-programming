import type { CourseProject } from "@/courses";

export const rainbowBridgeProject: CourseProject = {
  slug: "rainbow_bridge",
  category: "science",
  title: "彩虹桥",
  ageGroup: "6-8 岁",
  description: "雨过天晴，天边挂起一座七彩的桥——看看彩虹是怎么来的。",
  missionBrief:
    "阳光照在小水珠上，会分出七种颜色，就成了彩虹。写一个程序：当开始运行（时间轴）时，让「背景明暗」慢慢变化（像天色变幻），并让二零从左走到右，最后说出「看，彩虹出来啦」。点运行，拖动进度条看彩虹出现的那一刻！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的 左右位置 从 -160 到 160（在 0~8 秒）」（像在走过彩虹）；③ 再放「当时间到达 8 秒，让 二零 说 看，彩虹出来啦 持续 3 秒」。点运行看零零走过天边！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让二零随时间从一边移动到另一边" },
    { id: 3, title: "到结尾让二零说出彩虹出现了，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">x</field>
          <field name="A">-160</field>
          <field name="B">160</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">8</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">看，彩虹出来啦</field>
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
