import type { CourseProject } from "@/courses";

export const earthSunProject: CourseProject = {
  slug: "earth_sun",
  category: "science",
  title: "地球绕着太阳转",
  ageGroup: "6-8 岁",
  description: "地球一边自转，一边绕着太阳转圈，一年就过去啦。",
  missionBrief:
    "太阳在中间，地球绕着它转，转一圈就是一年。写一个程序：当开始运行（时间轴）时，让二零（当作地球）「绕舞台中心转 1 圈（在 0~8 秒）」；并在第 1 秒让二零说「我绕着太阳转一圈，就是一年」。点运行，看地球怎么绕太阳！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 绕舞台中心转 1 圈（在 0~8 秒）」；③ 再放「当时间到达 1 秒，让 二零 说 我绕着太阳转一圈，就是一年 持续 3 秒」。点运行看地球公转！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让二零绕中心公转一圈" },
    { id: 3, title: "让二零说出公转的解说，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_orbit">
          <field name="ACTOR">erling</field>
          <field name="LOOPS">1</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">1</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">我绕着太阳转一圈，就是一年</field>
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
