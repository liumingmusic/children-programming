import type { CourseProject } from "@/courses";

export const selfIntroProject: CourseProject = {
  slug: "self_intro",
  category: "story",
  title: "二零的自我介绍",
  ageGroup: "6-8 岁",
  description: "让二零开口介绍自己，认识这位小太阳鹦鹉伙伴。",
  missionBrief:
    "造物星球来了一位新朋友——小太阳鹦鹉「二零」。请写一个程序：当开始运行时，让二零说出自己的名字，再说说自己的爱好。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面放一个紫色「说 你好！我是小太阳鹦鹉二零 2 秒」；③ 接一个「说 我最喜欢在造物星球上编程啦！」。点运行，听二零介绍自己！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "让二零说出自己的名字和爱好" },
    { id: 3, title: "点运行，看二零介绍自己" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你好！我是小太阳鹦鹉二零</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我最喜欢在造物星球上编程啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
