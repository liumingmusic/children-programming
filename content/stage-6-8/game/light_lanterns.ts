import type { CourseProject } from "@/courses";

export const lightLanternsProject: CourseProject = {
  slug: "light_lanterns",
  category: "game",
  title: "按顺序点灯笼",
  ageGroup: "6-8 岁",
  description: "依次飞到三盏灯笼前，把它们依次点亮。",
  missionBrief: "节日到了，三盏灯笼还没亮。写一个程序：让二零依次飞到 1、2、3 号灯笼前，每到一个就换个颜色、说一句「第几盏亮了」。",
  erLingHint: "① 绿色「当开始运行」里用「移到 x: y:」依次飞到三个位置；② 每到一个就「设置画笔颜色」换色、再「说 第几盏亮了」；③ 点「运行」看灯笼依次亮起。",
  steps: [
    { id: 1, title: "使用「当开始运行」事件" },
    { id: 2, title: "依次点亮多盏灯笼" },
    { id: 3, title: "运行看到点亮效果" },
  ],
  scene: {
    marks: [
      { x: -100, y: 80, emoji: "🏮", label: "灯1" },
      { x: 0, y: 0, emoji: "🏮", label: "灯2" },
      { x: 100, y: -80, emoji: "🏮", label: "灯3" },
    ],
  },
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_pen_set_color">
            <value name="HUE"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">第一盏亮了</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_goto">
                <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <next><block type="maker_pen_set_color">
                  <value name="HUE"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                  <next><block type="maker_say">
                    <value name="TEXT"><shadow type="text"><field name="TEXT">第二盏亮了</field></shadow></value>
                    <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <next><block type="maker_goto">
                      <value name="X"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                      <value name="Y"><shadow type="math_number"><field name="NUM">-80</field></shadow></value>
                      <next><block type="maker_pen_set_color">
                        <value name="HUE"><shadow type="math_number"><field name="NUM">240</field></shadow></value>
                        <next><block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">第三盏亮了</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                        </block></next>
                      </block></next>
                    </block></next>
                  </block></next>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block></next>
      </statement>
    </block>
  </xml>`,
};
