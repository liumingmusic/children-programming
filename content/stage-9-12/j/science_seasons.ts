import type { CourseProject } from "@/courses";

export const scienceSeasonsProject: CourseProject = {
  slug: "science_seasons",
  category: "science",
  title: "一年四季的颜色",
  ageGroup: "9-12 岁",
  description: "地球公转时地轴倾斜，不同季节接收到的阳光不一样，景色也随之变化。用时间轴模拟春夏秋冬。",
  missionBrief:
    "一年有四季，是因为地球绕太阳公转时地轴一直倾斜。写一个程序：当开始运行（时间轴）时，让背景明暗从 20 慢慢变到 200（光线随季节流转），并分别在 0/2/4/6 秒让二零说出春、夏、秋、冬的特点。点运行，看四季如何轮转！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 二零 的背景明暗 从 20 到 200（在 0~8 秒）」；③ 再接连放 4 个「当时间到达 0/2/4/6 秒，让 二零 说」对应季节的话。点运行看四季轮转！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让背景明暗随时间平滑变化（代表四季光线流转）" },
    { id: 3, title: "在几个时刻让二零说出四季的特点，点运行看效果" },
  ],
  timeline: true,
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">erling</field>
          <field name="PROP">bgHue</field>
          <field name="A">20</field>
          <field name="B">200</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">0</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">春天：天气变暖，植物发芽</field>
                </shadow>
              </value>
              <field name="SECONDS">2</field>
              <next>
                <block type="maker_when_at_say">
                  <field name="ACTOR">erling</field>
                  <field name="T">2</field>
                  <value name="TEXT">
                    <shadow type="text">
                      <field name="TEXT">夏天：阳光强烈，白昼最长</field>
                    </shadow>
                  </value>
                  <field name="SECONDS">2</field>
                  <next>
                    <block type="maker_when_at_say">
                      <field name="ACTOR">erling</field>
                      <field name="T">4</field>
                      <value name="TEXT">
                        <shadow type="text">
                          <field name="TEXT">秋天：天气转凉，树叶变黄</field>
                        </shadow>
                      </value>
                      <field name="SECONDS">2</field>
                      <next>
                        <block type="maker_when_at_say">
                          <field name="ACTOR">erling</field>
                          <field name="T">6</field>
                          <value name="TEXT">
                            <shadow type="text">
                              <field name="TEXT">冬天：阳光斜射，白昼最短</field>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
