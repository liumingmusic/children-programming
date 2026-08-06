import type { CourseProject } from "@/courses";

export const snowProject: CourseProject = {
  slug: "snow",
  category: "science",
  title: "下雪了",
  ageGroup: "6-8 岁",
  description: "让一片片小雪花从天上轻轻飘落，感受冬日的安静。",
  missionBrief:
    "雪花比雨滴轻，会一边飘一边落。写一个程序：当开始运行（时间轴）时「开始下雪」，让雪花在 0~8 秒里轻轻飘落；并在第 1 秒让二零说「下雪了，世界变白了」。点运行，看雪花怎么飘！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「开始下雪（从 0 到 8 秒，每秒 18 片，速度 40~80）」；③ 再放「当时间到达 1 秒，让 二零 说 下雪了，世界变白了 持续 2 秒」。点运行看雪花飘落！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "加一段下雪的粒子（雪花轻轻飘落）" },
    { id: 3, title: "让二零在雪中说一句话，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_emit_snow">
          <field name="T0">0</field>
          <field name="T1">8</field>
          <field name="RATE">18</field>
          <field name="SMIN">40</field>
          <field name="SMAX">80</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">1</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">下雪了，世界变白了</field>
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
