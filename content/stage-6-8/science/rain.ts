import type { CourseProject } from "@/courses";

export const rainProject: CourseProject = {
  slug: "rain",
  category: "science",
  title: "下雨了",
  ageGroup: "6-8 岁",
  description: "用成千上万的小雨滴，模拟一场从天而降的雨。",
  missionBrief:
    "雨是从云里落下来的小水滴。写一个程序：当开始运行（时间轴）时「开始下雨」，让雨滴在 0~8 秒里不断落下；并在第 1 秒让二零说「下雨啦，记得带伞」。点运行，看雨是怎么落下的！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「开始下雨（从 0 到 8 秒，每秒 25 滴，速度 140~220）」；③ 再放「当时间到达 1 秒，让 二零 说 下雨啦，记得带伞 持续 2 秒」。点运行看雨滴落下！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "加一段下雨的粒子（雨滴持续落下）" },
    { id: 3, title: "让二零在雨中说一句话，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_emit_rain">
          <field name="T0">0</field>
          <field name="T1">8</field>
          <field name="RATE">25</field>
          <field name="SMIN">140</field>
          <field name="SMAX">220</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">1</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">下雨啦，记得带伞</field>
                </shadow>
              </value>
              <field name="SECONDS">2</field>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
