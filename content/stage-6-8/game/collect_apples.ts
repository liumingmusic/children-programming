import type { CourseProject } from "@/courses";

export const collectApplesProject: CourseProject = {
  slug: "collect_apples",
  category: "game",
  title: "摘完所有苹果",
  ageGroup: "6-8 岁",
  description: "飞向每颗苹果树，把苹果都摘回家。",
  missionBrief: "果园里有 3 棵苹果树。写一个程序：让二零依次飞向 1、2、3 号苹果把它们都摘下来，最后说「苹果都摘完啦！」。",
  erLingHint: "① 绿色「当开始运行」里放三个「飞向星星 1 / 2 / 3 号」（每颗苹果就是一颗星星）；② 最后放「说 苹果都摘完啦！ 1 秒」；③ 点「运行」看二零摘光苹果。",
  steps: [
    { id: 1, title: "让二零飞向苹果" },
    { id: 2, title: "收集到苹果" },
    { id: 3, title: "摘完所有苹果" },
  ],
  stars: [{ x: -110, y: 70 }, { x: 110, y: 50 }, { x: 0, y: -100 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">苹果都摘完啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
