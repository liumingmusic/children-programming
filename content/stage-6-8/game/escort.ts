import type { CourseProject } from "@/courses";

export const escortProject: CourseProject = {
  slug: "escort",
  category: "game",
  title: "护送小动物回家",
  ageGroup: "6-8 岁",
  description: "飞到小动物身边接它，再送它回小屋。",
  missionBrief: "一只小动物在左上角迷路了，家在舞台中间。写一个程序：让二零先飞到小动物身边说「我来接你啦」，再飞回家说「回家咯」。",
  erLingHint: "① 绿色「当开始运行」里放「移到 小动物坐标」，接「说 我来接你啦 1 秒」；② 再放「移到 0,0（家）」，接「说 回家咯 1 秒」；③ 点「运行」看护送成功。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "飞到小动物并接它" },
    { id: 3, title: "运行护送它回家" },
  ],
  scene: {
    marks: [
      { x: -100, y: 80, emoji: "🐰", label: "小动物" },
      { x: 0, y: 0, emoji: "🏠", label: "家" },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">我来接你啦</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">回家咯</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
