import type { CourseProject } from "@/courses";

export const clickPlayDialogProject: CourseProject = {
  slug: "click_play_dialog",
  category: "event",
  title: "点我讲故事",
  ageGroup: "6-8 岁",
  description: "点击舞台，让二零讲出三段小故事。",
  missionBrief: "二零想当小小讲故事员。写一个程序：点击舞台时，它连着说出三句话，像一个迷你小故事。",
  erLingHint: "① 蓝色「当舞台被点击」里依次接三个紫色「说」积木；② 分别输入「从前有只二零」「它最爱编程」「你也来吗？」每段 1 秒；③ 点「运行」后点舞台，听二零讲故事。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "让二零连说三句话" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">从前有只二零</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">它最爱编程</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">你也来吗？</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
