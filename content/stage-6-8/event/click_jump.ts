import type { CourseProject } from "@/courses";

export const clickJumpProject: CourseProject = {
  slug: "click_jump",
  category: "event",
  title: "点一下，二零跳一跳",
  ageGroup: "6-8 岁",
  description: "点击舞台，让二零向上跳一下再落回来。",
  missionBrief: "造物星球上有一只爱蹦跳的二零。写一个程序：当舞台被点击时，二零先向上跳一下，停一小会儿，再落回原处。",
  erLingHint: "① 拖一个蓝色「当舞台被点击」事件；② 里面放「移动 -30 步」（向上跳），接「等待 0.3 秒」，再接「移动 30 步」（落回来）；③ 点「运行」后在舞台上点一下，二零就蹦起来啦！",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "让二零向上跳起" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
          <next><block type="maker_wait">
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">0.3</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`,
};
