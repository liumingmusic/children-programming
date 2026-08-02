import type { CourseProject } from "@/courses";

export const ifTouchStarProject: CourseProject = {
  slug: "if_touch_star",
  category: "cond",
  title: "碰到星星就说话",
  ageGroup: "6-8 岁",
  description: "用「如果…那么」判断碰到星星时说话。",
  missionBrief: "舞台上有几颗星星。写一个程序：点击舞台让二零飞过去，如果碰到了星星，就大声说「找到星星啦！」。",
  erLingHint: "① 蓝色「当舞台被点击」里放「移到鼠标位置」；② 接「如果…那么」，条件放「碰到星星」，那么里放「说 找到星星啦！」；③ 点「运行」后点击那颗在中间的星星试试。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "用「如果碰到星星」做判断" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  stars: [{ x: 0, y: 0 }, { x: 130, y: -70 }, { x: -130, y: -70 }],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_mouse"><next>
          <block type="controls_if">
            <value name="IF0"><block type="maker_touching_star"></block></value>
            <statement name="DO0"><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">找到星星啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block></statement>
          </block>
        </next></block>
      </statement>
    </block>
  </xml>`,
};
