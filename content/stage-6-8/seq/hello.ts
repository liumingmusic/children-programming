import type { CourseProject } from "@/courses";

export const helloProject: CourseProject = {
    slug: "hello",
    category: "seq",
    title: "二零，打个招呼！",
    ageGroup: "6-8 岁",
    description: "用积木让二零移动并说出第一句话。",
    missionBrief: "二零刚来到造物星球，它想飞到舞台中央，跟大家说声「你好」。你能帮它写出第一个程序吗？",
    erLingHint: "① 先从积木区拖一个绿色「当开始运行」事件到工作区；② 把黄色「移动」积木拖进它的里面；③ 再拖一个紫色「说」积木接在后面，输入想说的话；④ 点「运行」！卡住时点右上角「看示范」照着学。",
    steps: [
      { id: 1, title: "让二零移动" },
      { id: 2, title: "让二零说话" },
      { id: 3, title: "点击运行看到效果" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_move">
            <value name="STEPS">
              <shadow type="math_number"><field name="NUM">100</field></shadow>
            </value>
            <next>
              <block type="maker_say">
                <value name="TEXT">
                  <shadow type="text"><field name="TEXT">你好！我是二零</field></shadow>
                </value>
                <value name="SECONDS">
                  <shadow type="math_number"><field name="NUM">2</field></shadow>
                </value>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  }
