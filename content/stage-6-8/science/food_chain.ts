import type { CourseProject } from "@/courses";

export const foodChainProject: CourseProject = {
  slug: "food_chain",
  category: "science",
  title: "食物链大冒险",
  ageGroup: "6-8 岁",
  description: "草被虫吃，虫被鸟吃——大自然里谁吃谁，连成一条食物链。",
  missionBrief:
    "大自然有个规则：小草被虫子吃，虫子被小鸟吃。写一个程序：当开始运行（时间轴）时，让三七（小鸟）从右边飞到左边靠近二零（小草）；并在第 4 秒让二零说「虫子和我，都被小鸟吃掉了」。点运行，看食物链是怎么连接的！",
  erLingHint:
    "① 拖一个橙色「当开始运行（时间轴）」；② 里面放「让 三七 的 左右位置 从 160 到 -40（在 0~8 秒）」（小鸟飞过来）；③ 再放「当时间到达 4 秒，让 二零 说 虫子和我，都被小鸟吃掉了 持续 3 秒」。点运行看小鸟飞来！",
  steps: [
    { id: 1, title: "用「当开始运行（时间轴）」启动模拟" },
    { id: 2, title: "让三七（小鸟）飞向二零，表现捕食" },
    { id: 3, title: "让二零说出食物链的关系，点运行看效果" },
  ],
  timeline: true,
  cast: ["sanqi"],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start_tl" x="40" y="40">
      <statement name="STACK">
        <block type="maker_tween_prop">
          <field name="ACTOR">sanqi</field>
          <field name="PROP">x</field>
          <field name="A">160</field>
          <field name="B">-40</field>
          <field name="T0">0</field>
          <field name="T1">8</field>
          <next>
            <block type="maker_when_at_say">
              <field name="ACTOR">erling</field>
              <field name="T">4</field>
              <value name="TEXT">
                <shadow type="text">
                  <field name="TEXT">虫子和我，都被小鸟吃掉了</field>
                </shadow>
              </value>
              <field name="SECONDS">3</field>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
};
