import type { CourseProject } from "@/courses";

export const twoActorChatProject: CourseProject = {
  slug: "two_actor_chat",
  category: "multi",
  title: "两个角色对话",
  ageGroup: "9-12 岁",
  description:
    "用「控制角色」轮流让二零和三七说话，编一段两个小伙伴的对话。这是多角色协作里最基础也最有趣的一课。",
  missionBrief:
    "写一个程序：当开始运行时，先「控制角色 二零」说一句话，再「控制角色 三七」说一句话，最后让二零和三七各再说一句，像真的在聊天。点运行，看两个角色是不是你一言我一语聊起来。",
  erLingHint:
    "① 拖绿色「当开始运行」；② 放「控制角色 二零」→「说 三七，今天一起去探险吧！ 2 秒」；③ 接「控制角色 三七」→「说 好呀二零！我准备好了。 2 秒」；④ 再接「控制角色 二零」→「说 那我们出发咯！ 1 秒」和「控制角色 三七」→「说 出发！ 1 秒」；⑤ 点运行看对话。",
  steps: [
    { id: 1, title: "用「当开始运行」事件启动对话" },
    { id: 2, title: "让二零和三七都开口说话（控制两个角色 + 说）" },
    { id: 3, title: "点运行，看两个角色是不是聊起来了" },
  ],
  defaultXml: `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">三七，今天一起去探险吧！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_control_actor">
                  <field name="ACTOR">sanqi</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">好呀二零！我准备好了。</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                      <next>
                        <block type="maker_control_actor">
                          <field name="ACTOR">erling</field>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><shadow type="text"><field name="TEXT">那我们出发咯！</field></shadow></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                              <next>
                                <block type="maker_control_actor">
                                  <field name="ACTOR">sanqi</field>
                                  <next>
                                    <block type="maker_say">
                                      <value name="TEXT"><shadow type="text"><field name="TEXT">出发！</field></shadow></value>
                                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  cast: ["sanqi"],
};
