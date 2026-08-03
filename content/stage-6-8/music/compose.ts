import type { CourseProject } from "@/courses";

export const composeProject: CourseProject = {
  slug: "compose",
  category: "music",
  title: "我的小创作",
  ageGroup: "6-8 岁",
  description: "自由组合音符，创作一段属于你自己的小旋律。",
  missionBrief: "现在轮到你当小作曲家啦！用「弹奏音符」积木（也可以用循环），随便排一排，创作一段属于你自己的小旋律，让二零唱给你听。",
  erLingHint: "① 拖一个绿色「当开始运行」事件；② 在里面对接至少 3 个「弹奏音符」（或用一个「重复执行」包住几个音）排成你喜欢的顺序；③ 点「运行」，听二零唱出你的原创小曲！没有标准答案，好听就行～",
  steps: [
    { id: 1, title: "用「弹奏音符」积木" },
    { id: 2, title: "创作至少 3 个音的小旋律" },
    { id: 3, title: "点击运行听到你的创作" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">do</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">re</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">mi</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
