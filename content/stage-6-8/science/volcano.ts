import type { CourseProject } from "@/courses";

export const volcanoProject: CourseProject = {
  slug: "volcano",
  category: "science",
  title: "火山喷发",
  ageGroup: "6-8 岁",
  description: "看火山怎么把滚烫的岩浆喷向天空，再落回地面。",
  missionBrief:
    "火山爆发时，岩浆会从山顶喷出来，像放烟花一样。写一个程序：当开始运行（时间轴）时「火山喷发」，让岩浆在 0~8 秒里从底部喷出；并在第 1 秒让二零说「火山喷发啦，快躲远一点」。点运行，看岩浆怎么飞！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「火山喷发（从 0 到 8 秒，每秒 28 颗，速度 140~220）」；③ 再放「当时间到达 1 秒，让 二零 说 火山喷发啦，快躲远一点 持续 2 秒」。点运行看岩浆喷飞！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "加一段火山喷发的粒子（岩浆喷出）" },
    { id: 3, title: "让二零在喷发时说一句话，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_emit_lava">
          <field name="T0">0</field>
          <field name="T1">8</field>
          <field name="RATE">28</field>
          <field name="SMIN">140</field>
          <field name="SMAX">220</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">1</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">火山喷发啦，快躲远一点</field>
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
