import type { CourseProject } from "@/courses";

export const collect3Project: CourseProject = {
  slug: "collect3",
  category: "cond",
  title: "集齐三颗星",
  ageGroup: "6-8 岁",
  description: "飞向三颗星星全部收集，再庆祝。",
  missionBrief: "星球上散落着 3 颗星星。写一个程序：让二零依次飞向 1、2、3 号星星把它们都收集起来，最后说「全部收集完成，庆祝！」。",
  erLingHint: "① 绿色「当开始运行」里依次放三个「飞向星星 1 号 / 2 号 / 3 号」；② 最后放「说 全部收集完成，庆祝！ 1 秒」；③ 点「运行」，二零会自己飞去集齐三颗星。",
  steps: [
    { id: 1, title: "让二零飞向星星" },
    { id: 2, title: "收集到星星" },
    { id: 3, title: "集齐所有星星" },
  ],
  stars: [{ x: -100, y: 80 }, { x: 100, y: 0 }, { x: 0, y: -100 }],
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
                <value name="TEXT"><shadow type="text"><field name="TEXT">全部收集完成，庆祝！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
