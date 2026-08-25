import type { CourseProject } from "@/courses";

export const storyCardProject: CourseProject = {
  slug: "story_card",
  category: "story",
  title: "节日互动卡",
  ageGroup: "9-12 岁",
  description:
    "做一张点一下就送出祝福的节日互动卡片：开场布置好夜空场景，每点一次舞台，伙伴就跳出一句节日祝福。把「切换场景」和「点击事件 + 控制角色说话」组合成会送祝福的卡片。",
  missionBrief:
    "写一张节日卡：当开始运行时「切换场景 夜晚·星空」并说「送你一张节日卡片」；再拖「当舞台被点击」事件，在里面「控制角色 三七」说「新年快乐，愿你天天开心！」。点运行后点舞台，看三七是不是送出了祝福。",
  erLingHint:
    "① 拖绿色「当开始运行」→「切换场景 夜晚·星空」接「说 送你一张节日卡片～ 2 秒」；② 拖蓝色「当舞台被点击」→「控制角色 三七」→「说 新年快乐，愿你天天开心！ 2 秒」；③ 点运行再点舞台，看夜空下三七送上祝福。",
  steps: [
    { id: 1, title: "用「当开始运行」事件布置卡片场景" },
    { id: 2, title: "添加「舞台被点击」事件，让卡片能送出祝福" },
    { id: 3, title: "点击舞台后，伙伴讲出节日祝福" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">night</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">送你一张节日卡片～</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="40" y="180">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">sanqi</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">新年快乐，愿你天天开心！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
