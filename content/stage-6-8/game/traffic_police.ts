import type { CourseProject } from "@/courses";

export const trafficPoliceProject: CourseProject = {
  slug: "traffic_police",
  category: "game",
  title: "交通警察指挥",
  ageGroup: "6-8 岁",
  description: "根据点击位置，指挥红绿灯：左半边停，右半边走。",
  missionBrief: "二月当上了小交警。写一个程序：点击舞台左半边，它说「红灯，停！」；点击右半边，它说「绿灯，走！」。",
  erLingHint: "① 蓝色「当舞台被点击」里放「如果…那么…否则」；② 条件放「点击在左半边」，那么里放「说 红灯，停！ 1 秒」，否则里放「说 绿灯，走！ 1 秒」；③ 点「运行」后分别点左边和右边。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「点击在左半边」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">红灯，停！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">绿灯，走！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`,
};
