import type { CourseProject } from "@/courses";

export const treasureMapProject: CourseProject = {
  slug: "treasure_map",
  category: "game",
  title: "跟着地图找宝藏",
  ageGroup: "6-8 岁",
  description: "按地图标记飞到宝藏箱的位置。",
  missionBrief: "你有一张藏宝图，宝藏箱在右下角。写一个程序：让二零直接飞到宝藏的位置，然后说「找到宝藏啦！」。",
  erLingHint: "① 绿色「当开始运行」里放「移到 x: 120 y: -60」（宝藏箱的位置）；② 接「说 找到宝藏啦！ 1 秒」；③ 点「运行」看二零挖到宝。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "飞到宝藏的位置" },
    { id: 3, title: "运行找到宝藏" },
  ],
  scene: {
    marks: [{ x: 120, y: -60, emoji: "📦", label: "宝藏" }],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">找到宝藏啦！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
