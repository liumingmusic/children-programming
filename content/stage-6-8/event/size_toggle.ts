import type { CourseProject } from "@/courses";

export const sizeToggleProject: CourseProject = {
  slug: "size_toggle",
  category: "event",
  title: "点一下变大",
  ageGroup: "6-8 岁",
  description: "每次点击舞台，让二零变大一点。",
  missionBrief: "点一下舞台，二零就长大一点，像充气一样！再试试把它变小。",
  erLingHint: "① 蓝色「当舞台被点击」里放「二零大小增加 1」（每点一次变大）；② 想让它变小，就把数字改成 -1；③ 点「运行」后多点几下舞台看二零变大变小。",
  steps: [
    { id: 1, title: "使用「当舞台被点击」事件" },
    { id: 2, title: "改变二零的大小" },
    { id: 3, title: "点击舞台看到效果" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_change_size">
          <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`,
};
