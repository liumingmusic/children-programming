import type { CourseProject } from "@/courses";

export const storyScienceProject: CourseProject = {
  slug: "story_science",
  category: "story",
  title: "科普互动绘本",
  ageGroup: "9-12 岁",
  description:
    "做一本点一下就弹出科学知识的互动绘本：每点一次舞台，三七就讲出一个有趣的科学事实。把「点击事件」和「控制角色说话」组合成会科普的小书。",
  missionBrief:
    "写一个科普绘本：当开始运行时二零说「欢迎来到科学绘本，点屏幕发现秘密」；再拖「当舞台被点击」事件，在里面「控制角色 三七」说一句科学知识，比如「太阳是离我们最近的恒星！」。点运行后点舞台，看三七是不是讲出了科学事实。",
  erLingHint:
    "① 拖绿色「当开始运行」→「说 欢迎来到科学绘本，点屏幕发现秘密。 2 秒」；② 拖蓝色「当舞台被点击」→「控制角色 三七」→「说 太阳是离我们最近的恒星！ 2 秒」；③ 点运行再点舞台，看三七当起小老师。",
  steps: [
    { id: 1, title: "用「当开始运行」事件打开科普绘本" },
    { id: 2, title: "添加「舞台被点击」事件，让绘本能讲知识" },
    { id: 3, title: "点击舞台后，伙伴讲出一条科学知识" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">欢迎来到科学绘本，点屏幕发现秘密。</field></shadow></value>
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
              <value name="TEXT"><shadow type="text"><field name="TEXT">太阳是离我们最近的恒星！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
