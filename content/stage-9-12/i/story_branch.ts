import type { CourseProject } from "@/courses";

export const storyBranchProject: CourseProject = {
  slug: "story_branch",
  category: "story",
  title: "分支选择故事",
  ageGroup: "9-12 岁",
  description:
    "用「舞台被点击」事件做一本会分叉的互动故事：点一下舞台，故事就走向你选择的那条路。学会用「点击事件」让程序等待读者的决定。",
  missionBrief:
    "写一个互动故事：当开始运行时，二零先说一段开场白；再拖一个「当舞台被点击」事件，在里面让二零或三七说出「你选择了某条路」的结局。点运行后再点舞台，看故事是不是按你的点击讲出了不同走向。",
  erLingHint:
    "① 拖绿色「当开始运行」→ 放「说 欢迎来到冒险山谷！点屏幕做出你的选择。 2 秒」；② 拖蓝色「当舞台被点击」→ 放「控制角色 三七」接着「说 我是向导三七，你选了勇敢的探险路线，前方有宝藏！ 2 秒」；③ 点运行，再点一下舞台，看三七是不是接话了。",
  steps: [
    { id: 1, title: "用「当开始运行」事件翻开故事第一页" },
    { id: 2, title: "添加「舞台被点击」事件，让故事能互动" },
    { id: 3, title: "点击舞台后，角色讲出你选择的故事走向" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">欢迎来到冒险山谷！点屏幕做出你的选择。</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="40" y="160">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">sanqi</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我是向导三七，你选了勇敢的探险路线，前方有宝藏！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
