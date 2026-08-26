import type { CourseProject } from "@/courses";

export const musicRandomProject: CourseProject = {
  slug: "music_random",
  category: "music",
  title: "随机音符",
  ageGroup: "9-12 岁",
  description: "用「随机弹一个音」积木，让程序每次运行都弹出不一样的音，听听随机性是怎么给音乐带来惊喜的。",
  missionBrief: "写一个程序：当开始运行时，用「重复执行 8 次」包住「随机弹一个音」，每次运行都会听到一条不一样的旋律。",
  erLingHint: "① 拖绿色「当开始运行」→ 接「重复执行 8 次」；② 在重复里面放一个「随机弹一个音」；③ 多点几次运行，听每次都不一样。",
  steps: [
    { id: 1, title: "用「当开始运行」开始" },
    { id: 2, title: "用「重复执行」包住「随机弹一个音」" },
    { id: 3, title: "点运行，听每次都不一样" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_random_note">
              <next>
                <block type="maker_random_note">
                  <next>
                    <block type="maker_random_note">
                      <next>
                        <block type="maker_random_note">
                          <next>
                            <block type="maker_random_note">
                              <next>
                                <block type="maker_random_note">
                                  <next>
                                    <block type="maker_random_note">
                                      <next>
                                        <block type="maker_random_note"></block>
                                      </next>
                                    </block>
                                  </next>
                                </block>
                              </next>
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
      </statement>
    </block>
  </xml>`,
};
