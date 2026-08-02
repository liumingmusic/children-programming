import type { CourseProject } from "@/courses";

export const starsProject: CourseProject = {
    slug: "stars",
    category: "game",
    title: "二零收集星星",
    ageGroup: "6-8 岁",
    description: "点击舞台，用事件和判断让二零收集星星。",
    missionBrief: "星球上散落着 3 颗小星星。写一个程序：当点击舞台时，二零飞到鼠标位置；如果碰到星星，就宣布「收集到啦！」。",
    erLingHint: "① 拖一个蓝色「当舞台被点击」事件；② 里面放「移到鼠标位置」，再加「如果…那么」，条件放「碰到星星」、那么里放「说 收集到啦！」；③ 点「运行」后，在舞台上依次点击那 3 颗星星就能收集！",
    steps: [
      { id: 1, title: "使用「当舞台被点击」事件" },
      { id: 2, title: "使用「如果碰到星星」判断" },
      { id: 3, title: "收集所有 3 颗星星" },
    ],
    defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_stage_clicked" x="60" y="60">
        <statement name="STACK">
          <block type="maker_goto_mouse">
            <next>
              <block type="controls_if">
                <value name="IF0">
                  <block type="maker_touching_star"></block>
                </value>
                <statement name="DO0">
                  <block type="maker_say">
                    <value name="TEXT">
                      <shadow type="text"><field name="TEXT">收集到啦！</field></shadow>
                    </value>
                    <value name="SECONDS">
                      <shadow type="math_number"><field name="NUM">1</field></shadow>
                    </value>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,
  };
