import type { CourseProject } from "@/courses";

export const storyAdventureProject: CourseProject = {
  slug: "story_adventure",
  category: "story",
  title: "我的冒险书",
  ageGroup: "9-12 岁",
  description:
    "写一本随点击推进的冒险书：从卧室出发，每点一次舞台就前进到下一个地点、讲一段新剧情。学会用「点击事件」串联多个场景，串成一趟旅程。",
  missionBrief:
    "写一个冒险书：当开始运行时「切换场景 卧室」并说「冒险从家开始」；再拖「当舞台被点击」事件，在里面「切换场景 学校」并说「我们来到了神秘的学校！」。点运行后点舞台，看地点是不是换到了学校。",
  erLingHint:
    "① 拖绿色「当开始运行」→「切换场景 卧室」接「说 冒险从家开始！ 2 秒」；② 拖蓝色「当舞台被点击」→「切换场景 学校」接「说 我们来到了神秘的学校！ 2 秒」；③ 点运行再点舞台，看场景从卧室变成学校。",
  steps: [
    { id: 1, title: "用「当开始运行」事件从第一个地点出发" },
    { id: 2, title: "添加「舞台被点击」事件，让冒险能前进" },
    { id: 3, title: "点击舞台后，场景切换到新地点并讲出剧情" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">bedroom</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">冒险从家开始！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="40" y="180">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">school</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我们来到了神秘的学校！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
