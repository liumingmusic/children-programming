import type { CourseProject } from "@/courses";

export const gamePuzzleProject: CourseProject = {
  slug: "game_puzzle",
  category: "game",
  title: "拼图归位",
  ageGroup: "9-12 岁",
  description: "两片拼图散落在舞台两边，指挥二零和三七两个角色分别走到自己的格子里，把拼图摆好。这是「多角色控制 + 移动到指定位置」的综合练习。",
  missionBrief:
    "把两片拼图摆到正确位置。当开始运行时，先「控制角色 三七」并「移到 x=-120 y=80」放好第一片；再「控制角色 二零」并「移到 x=120 y=80」放好第二片；最后「说 归位完成」。",
  erLingHint:
    "①「控制角色 三七」后「移到 x=-120 y=80」；②「控制角色 二零」后「移到 x=120 y=80」；③「说 归位完成」。点运行，看两个角色各就各位。",
  steps: [
    { id: 1, title: "用「控制角色」指挥伙伴三七就位" },
    { id: 2, title: "再控制二零移到自己的位置（多角色协作）" },
    { id: 3, title: "运行看到两片拼图归位并说出「归位完成」" },
  ],
  cast: ["sanqi"],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor"><field name="ACTOR">sanqi</field>
          <next><block type="maker_goto"><value name="X"><shadow type="math_number"><field name="NUM">-120</field></shadow></value><value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
            <next><block type="maker_control_actor"><field name="ACTOR">erling</field>
              <next><block type="maker_goto"><value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value><value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                <next><block type="maker_say"><value name="TEXT"><shadow type="text"><field name="TEXT">归位完成</field></shadow></value><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
  goal: { saidIncludes: ["归位完成"] },
};
