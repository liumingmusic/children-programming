import type { CourseProject } from "@/courses";

export const fourSeasonsProject: CourseProject = {
  slug: "four_seasons",
  category: "pbl",
  title: "四季小屋",
  ageGroup: "6-8 岁",
  description: "用时间轴让小屋先下雨后下雪，切换夜空场景，再定时解说四季变化。",
  missionBrief:
    "小屋要经历春夏秋冬！写一个程序：当开始运行（时间轴）时，先让「开始下雨」覆盖 0~4 秒，再让「开始下雪」覆盖 4~8 秒，用「当时间到达 4 秒·切换场景」把背景换成夜晚星空，最后用「当时间到达·说话」让二零解说一句四季的话。把时间轴、天气粒子、场景和故事合起来，拍一段四季短片吧！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面先放「开始下雨」（0 到 4 秒），再放「开始下雪」（4 到 8 秒），让两种天气一前一后落到小屋上；③ 加一个「当时间到达 4 秒·切换场景」选「夜晚·星空」，再放「当时间到达 6 秒，让 二零 说 春天雨、冬天雪，四季真奇妙」。点运行播放时间轴，看四季怎么变换！",
  steps: [
    { id: 1, title: "时间轴开始，先让小屋下起雨" },
    { id: 2, title: "后半段改成下雪，并切换成夜空场景" },
    { id: 3, title: "让二零在指定时间解说四季" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_emit_rain">
          <field name="T0">0</field>
          <field name="T1">4</field>
          <field name="RATE">20</field>
          <field name="SMIN">120</field>
          <field name="SMAX">200</field>
          <next>
            <block type="maker_emit_snow">
              <field name="T0">4</field>
              <field name="T1">8</field>
              <field name="RATE">15</field>
              <field name="SMIN">40</field>
              <field name="SMAX">80</field>
              <next>
                <block type="maker_when_at_scene">
                  <field name="T">4</field>
                  <field name="SCENE">night</field>
                  <next>
                    <block type="maker_when_at_say">
                      <field name="ACTOR">erling</field>
                      <field name="T">6</field>
                      <value name="TEXT">
                        <shadow type="text">
                          <field name="TEXT">春天雨、冬天雪，四季真奇妙</field>
                        </shadow>
                      </value>
                      <field name="SECONDS">2</field>
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
