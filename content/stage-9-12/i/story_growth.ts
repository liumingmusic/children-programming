import type { CourseProject } from "@/courses";

export const storyGrowthProject: CourseProject = {
  slug: "story_growth",
  category: "story",
  title: "角色成长记",
  ageGroup: "9-12 岁",
  description:
    "用「设置大小」讲一个成长故事：一开始角色很小，每点一次舞台就长大一点，直到变成大角色。学会用「点击事件」配合「改变大小」，让角色随互动发生变化。",
  missionBrief:
    "写一个成长故事：当开始运行时「将大小设为 0.5 倍」并说「我是一颗小种子」；再拖「当舞台被点击」事件，在里面「二零大小增加 1」并说「我长大啦！」。点运行后点舞台，看二零是不是从小变大。",
  erLingHint:
    "① 拖绿色「当开始运行」→「将二零大小设为 0.5 倍」接「说 我是一颗小种子。 2 秒」；② 拖蓝色「当舞台被点击」→「二零大小增加 1」接「说 我长大啦！ 2 秒」；③ 点运行再点舞台，看二零一点点长大。",
  steps: [
    { id: 1, title: "用「当开始运行」事件让角色以「小」状态登场" },
    { id: 2, title: "添加「舞台被点击」事件，让角色能长大" },
    { id: 3, title: "点击舞台后，角色真的变大并说出成长" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_size">
          <value name="SIZE"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我是一颗小种子。</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="40" y="180">
      <statement name="STACK">
        <block type="maker_change_size">
          <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我长大啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
