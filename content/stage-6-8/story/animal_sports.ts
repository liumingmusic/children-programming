import type { CourseProject } from "@/courses";

export const animalSportsProject: CourseProject = {
  slug: "animal_sports",
  category: "story",
  title: "动物运动会",
  ageGroup: "6-8 岁",
  description: "用「重复执行」让二零一圈圈跑起来，参加动物运动会。",
  missionBrief:
    "造物星球举办动物运动会！写一个程序：当开始运行时，让二零先喊一声「运动会开始啦！」，再用「重复执行」一圈圈跑起来。",
  erLingHint:
    "① 拖一个绿色「当开始运行」；② 里面先放「说 运动会开始啦！」；③ 接「重复执行 4 次」，循环里放「移动 50 步」。点运行，看二零参赛！",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动程序" },
    { id: 2, title: "让二零跑起来参加比赛（移动 + 重复）" },
    { id: 3, title: "点运行，看运动会开幕" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">运动会开始啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
