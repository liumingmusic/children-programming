(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,30684,51494,94757,e=>{"use strict";let t=[{id:"stage-6-8",ageRange:"6-8 岁",name:"图形化积木启蒙",tagline:"拖拽彩色积木，让二零动起来、画图案、做小游戏。",status:"open",projectSlugs:["hello","flag","stone","shapeL","home","maze","arrow","zigzag","treasure","dance","frame","square","triangle","pentagon","spin","stairs","wave","spiral","fence","windmill","pickfruit","star5","flower","rainbow","snowflake","mandala","concentric","connectdot","house","letter","checkerboard","click_jump","click_color","click_dialog","two_events","click_play_dialog","auto_patrol","key_forward","edge_bounce","size_toggle","expression_shake","if_touch_star","if_edge_turn","if_red_stop","click_left_right","collect3","random_branch","odd_even","size_threshold","avoid_obstacle","escape_badguy","stars","maze_exit","collect_apples","light_lanterns","collect_rainbow","treasure_map","escort","traffic_police","dodge_clouds","memory_match","play_doremi","twinkle","drum_beat","random_note","loop_melody","pitch_by_click","pitch_by_move","chord","birthday","compose","count10","count_apples","compare_size","add_sub","shape_names","symmetry","multiplication","clock","geometry_puzzle","calculator","self_intro","expression","freeze","animal_sports","word_chain","birthday_party","good_night","two_talk","a_day","magic_show"]},{id:"stage-9-12",ageRange:"9-12 岁",name:"代码初探",tagline:"从积木过渡到 JavaScript，做小工具与互动游戏。",status:"soon",projectSlugs:[]},{id:"stage-13-16",ageRange:"13-16 岁",name:"进阶工坊",tagline:"用 Python 与网页技术，完成属于自己的独立项目。",status:"soon",projectSlugs:[]}];e.s(["stages",0,t],51494);let a={"stage-6-8":[{id:"seq",name:"基础序列与方向",shortTag:"序列",description:"用「前进 / 转向」让二零按指令移动，先打好程序顺序的基础。"},{id:"loop",name:"循环与重复",shortTag:"循环",description:"用「重复执行」省去重复步骤，画出整齐的图形。"},{id:"draw",name:"画笔与几何艺术",shortTag:"绘图",description:"落笔 + 循环，画出彩虹、星星、花朵等美丽图案。"},{id:"event",name:"事件与互动",shortTag:"事件",description:"用「当点击 / 当开始」让程序响应外界动作。"},{id:"cond",name:"条件判断",shortTag:"条件",description:"用「如果…那么」让二零根据情况做不同选择。"},{id:"game",name:"收集与闯关游戏",shortTag:"游戏",description:"结合移动、判定与收集，做成好玩的小游戏。"},{id:"story",name:"故事与动画",shortTag:"故事",description:"让二零说话、表演，编排小动画和故事。"},{id:"music",name:"音乐与节奏",shortTag:"音乐",description:"用积木弹奏旋律，感受编程与节奏的结合。"},{id:"math",name:"数学启蒙",shortTag:"数学",description:"在玩中认识数数、图形、对称与规律。"},{id:"science",name:"自然科学模拟",shortTag:"科学",description:"模拟昼夜、四季、生长等自然现象。"},{id:"pbl",name:"综合创意 / 毕业项目",shortTag:"综合",description:"把学到的本领组合起来，做出属于自己的作品。"}],"stage-9-12":[{id:"fn",name:"函数与自定义积木",shortTag:"函数",description:"把重复的动作打包成自己的积木，学会抽象。"},{id:"var",name:"变量与状态",shortTag:"变量",description:"用变量记录分数、步数、状态，让程序记住东西。"},{id:"multi",name:"多角色与协作",shortTag:"多角色",description:"让多个角色一起表演、对话、协作。"},{id:"key",name:"键盘与操控游戏",shortTag:"键盘",description:"用方向键控制角色，做可操控的小游戏。"},{id:"music",name:"音乐创作",shortTag:"音乐",description:"用积木创作旋律与节奏。"},{id:"math",name:"数学与逻辑进阶",shortTag:"数学",description:"乘法表、质数、坐标绘图等进阶数学。"},{id:"list",name:"列表与数据",shortTag:"列表",description:"用列表管理一组有序的数据。"},{id:"game",name:"综合小游戏",shortTag:"游戏",description:"贪吃蛇、井字棋、猜数字等综合小游戏。"},{id:"story",name:"交互绘本与故事",shortTag:"故事",description:"可点击、可分支的互动绘本。"},{id:"science",name:"科学探究",shortTag:"科学",description:"昼夜、四季、水循环等科学模拟。"}],"stage-13-16":[{id:"js",name:"文本代码过渡",shortTag:"JS",description:"从积木平滑过渡到 JavaScript 文本代码。"},{id:"algo",name:"算法与数据结构",shortTag:"算法",description:"排序、查找、递归等算法思维。"},{id:"phys",name:"物理与模拟",shortTag:"物理",description:"自由落体、碰撞、重力等物理模拟。"},{id:"dataviz",name:"数据可视化",shortTag:"数据",description:"用图表把数据画出来。"},{id:"creative",name:"创意编程",shortTag:"创意",description:"分形、粒子、生成艺术等创意作品。"},{id:"web",name:"网页 / 小游戏开发",shortTag:"Web",description:"用 DOM 与画布做网页和小游戏。"},{id:"ai",name:"人工智能启蒙",shortTag:"AI",description:"决策树、分类器、聊天机器人等 AI 直觉。"},{id:"capstone",name:"毕业项目",shortTag:"毕业",description:"综合运用，完成属于自己的完整作品。"}]},l=[{slug:"hello",category:"seq",title:"二零，打个招呼！",ageGroup:"6-8 岁",description:"用积木让二零移动并说出第一句话。",missionBrief:"二零刚来到造物星球，它想飞到舞台中央，跟大家说声「你好」。你能帮它写出第一个程序吗？",erLingHint:"① 先从积木区拖一个绿色「当开始运行」事件到工作区；② 把黄色「移动」积木拖进它的里面；③ 再拖一个紫色「说」积木接在后面，输入想说的话；④ 点「运行」！卡住时点右上角「看示范」照着学。",steps:[{id:1,title:"让二零移动"},{id:2,title:"让二零说话"},{id:3,title:"点击运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
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
    </xml>`},{slug:"flag",category:"seq",title:"走到小旗子",ageGroup:"6-8 岁",description:"用前进和转向，指挥二零穿过星球走到小旗子旁。",missionBrief:"造物星球上插着一面小旗子🚩。帮二零按顺序前进、转向，稳稳地走到小旗子旁边吧！",erLingHint:"① 先拖一个绿色「当开始运行」事件到工作区；② 在里面放「落笔」，让路线看得见；③ 再依次放「移动」和「右转」积木，指挥二零前进、拐弯；④ 点「运行」，看二零走到小旗子旁。卡住就点「看示范」。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"用转向走到小旗子"},{id:3,title:"运行看二零到达"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next>
                                  <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:-80,y:80,emoji:"🚩",label:"小旗子"}]}},{slug:"stone",category:"seq",title:"绕过小石头",ageGroup:"6-8 岁",description:"路上有一块小石头，指挥二零拐个弯绕过去。",missionBrief:"一颗小石头🪨挡在前面。让二零先往前走一点，再拐弯从旁边绕过去，别撞上它！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 先「移动」往前走一段；③ 用「右转」拐弯，从石头旁边绕过去；④ 再「移动」继续前进，最后「抬笔」。点「运行」看看绕行的路线。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"拐弯绕过小石头"},{id:3,title:"运行看绕行路线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">140</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">75</field></shadow></value>
                                                <next>
                                                  <block type="maker_pen_up"></block>
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
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:75,emoji:"🪨",label:"小石头"},{x:100,y:75,emoji:"🏁",label:"终点"}]}},{slug:"shapeL",category:"seq",title:"画一个「L」形路线",ageGroup:"6-8 岁",description:"指挥二零画出一条笔直的 L 形路线。",missionBrief:"用画笔让二零画出一条 L 形路线：先直直往上，再拐个弯往旁边。看，像不像字母 L？",erLingHint:"① 绿色「当开始运行」里放「落笔」；②「移动」往上走一段；③「右转」拐弯；④ 再「移动」往旁边走一段，最后「抬笔」。运行后就能看到一条 L 形线。",steps:[{id:1,title:"让二零落笔画线"},{id:2,title:"拐弯画出 L 的另一边"},{id:3,title:"运行看 L 形图案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:-100,y:100,emoji:"🏁",label:"终点"}]}},{slug:"home",category:"seq",title:"送信使回家",ageGroup:"6-8 岁",description:"送信使迷路了，指挥二零带它回到小屋。",missionBrief:"一只送信使🏠找不到回家的路。帮二零按顺序走，把它平安送回小屋门口吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到小屋，最后「抬笔」。点「运行」看二零送它回家。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"转向走到小屋"},{id:3,title:"运行看到达小屋"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:-120,y:80,emoji:"🏠",label:"信使的家"}]}},{slug:"maze",category:"seq",title:"走方格迷宫",ageGroup:"6-8 岁",description:"沿着格子路线，不靠循环走到出口。",missionBrief:"造物星球有个小迷宫，出口🚪在一角。用一步一步的前进和转向，把二零带到出口吧（这一关先不用循环哦）！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 按路线「移动」前进；③ 遇到墙就「右转」换方向；④ 继续「移动」直到出口，最后「抬笔」。点「运行」走一遍迷宫。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"拐弯穿过迷宫"},{id:3,title:"运行走到出口"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                <next>
                                  <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:-80,y:0,emoji:"🚪",label:"出口"}],walls:[{x1:40,y1:0,x2:40,y2:90},{x1:0,y1:40,x2:110,y2:40}]}},{slug:"arrow",category:"seq",title:"跟着箭头走",ageGroup:"6-8 岁",description:"沿着箭头指的方向，一步步走到终点。",missionBrief:"地上画着箭头⬆️⬅️，指引二零前进的方向。照着箭头走，把它带到终点🎯吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 跟着箭头「移动」前进；③ 箭头转弯处用「右转」换方向；④ 走到终点🎯后「抬笔」。点「运行」照箭头走一遍。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"按箭头转向前进"},{id:3,title:"运行到终点"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:0,y:50,emoji:"⬆️"},{x:-50,y:100,emoji:"⬅️"},{x:-100,y:100,emoji:"🎯",label:"终点"}]}},{slug:"zigzag",category:"seq",title:"折线探险",ageGroup:"6-8 岁",description:"画出一条上下折返的折线探险路线。",missionBrief:"造物星球有一条 zigzag 小路。指挥二零一会上、一会下，画出一条弯弯折折的探险路线吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；②「移动」、「右转」交替使用，让路线一会上、一会下；③ 重复几次「移动 + 右转」画出折线，最后「抬笔」。点「运行」看折线。",steps:[{id:1,title:"让二零落笔画线"},{id:2,title:"画出上下折返的折线"},{id:3,title:"运行看折线图案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                <next>
                                                  <block type="maker_pen_up"></block>
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
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"treasure",category:"seq",title:"到达宝藏箱",ageGroup:"6-8 岁",description:"找到藏起来的宝藏箱📦，指挥二零过去。",missionBrief:"造物星球藏着一只宝藏箱📦！指挥二零穿过草地，走到宝藏箱旁边，把它找出来吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 先「移动」往前；③「右转」换方向；④ 再「移动」走到宝藏箱，最后「抬笔」。点「运行」看二零找到宝藏。",steps:[{id:1,title:"让二零向前走"},{id:2,title:"转向走到宝藏箱"},{id:3,title:"运行看找到宝藏"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">70</field></shadow></value>
                        <next>
                          <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:-70,y:90,emoji:"📦",label:"宝藏箱"}]}},{slug:"dance",category:"seq",title:"按指令跳舞",ageGroup:"6-8 岁",description:"用移动和转向，给二零编一段方块舞。",missionBrief:"音乐响起来🎵！给二零下一串「移动 + 右转」的指令，看它转出一段可爱的方块舞步吧。",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 重复放「移动」和「右转」（比如 8 次），每次转一个小角度；③ 二零就会转着圈跳舞，最后「抬笔」。点「运行」看舞步。",steps:[{id:1,title:"让二零动起来"},{id:2,title:"用转向跳出舞步"},{id:3,title:"运行看跳舞"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                            <next>
                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                <next>
                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                    <next>
                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                        <next>
                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                            <next>
                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value>
                                                                                            <next>
                                                                                              <block type="maker_pen_up"></block>
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
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"💃",label:"跳舞"}]}},{slug:"frame",category:"seq",title:"走「回」字路线",ageGroup:"6-8 岁",description:"指挥二零走出一个「回」字形路线。",missionBrief:"挑战一下：让二零先走一个大正方形外框，再走一个小正方形内框，连起来就像汉字「回」啦！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 用「移动 + 右转」重复 4 次画出外框；③ 走到中间，再「移动 + 右转」重复 4 次画出内框；④ 最后「抬笔」。点「运行」看「回」字。",steps:[{id:1,title:"让二零落笔画外框"},{id:2,title:"走到中间画内框"},{id:3,title:"运行看「回」字"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                <next>
                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    <next>
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                        <next>
                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                            <next>
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                <next>
                                  <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                    <next>
                                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                                        <next>
                                          <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                            <next>
                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                <next>
                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                    <next>
                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                        <next>
                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                                                            <next>
                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                <next>
                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                    <next>
                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                        <next>
                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                            <next>
                                                                              <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                <next>
                                                                                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                                    <next>
                                                                                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                                                                        <next>
                                                                                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                                                                                            <next>
                                                                                              <block type="maker_pen_up"></block>
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
    </xml>`},{slug:"square",category:"loop",title:"二零画正方形",ageGroup:"6-8 岁",description:"用循环和画笔，让二零画出方方正正的正方形。",missionBrief:"造物星球要盖一座方形的小房子，需要一条笔直的四边围墙。帮二零拿起画笔，用「重复执行」一次画出四条边吧！",erLingHint:"① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 4 次」，里面依次放「移动 100 步」和「右转 90 度」；③ 最后接一个「抬笔」收尾；④ 点「运行」，二零会转着圈画出正方形。卡住就点「看示范」。",steps:[{id:1,title:"让二零落笔开始画"},{id:2,title:"用循环画出四条边"},{id:3,title:"运行看到正方形"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">4</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">90</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"triangle",category:"loop",title:"二零画三角形",ageGroup:"6-8 岁",description:"用循环和画笔，让二零画出三条边一样长的正三角形。",missionBrief:"小树的影子是一个三角形。帮二零用「重复执行 3 次」，画出三条等长边，拼出一个稳稳的三角形吧！",erLingHint:"① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 3 次」，里面放「移动 100 步」和「右转 120 度」；③ 最后接「抬笔」；④ 点「运行」看二零画三角形。提示：三角形每个角是 120 度哦。",steps:[{id:1,title:"让二零落笔开始画"},{id:2,title:"用循环画出三条边"},{id:3,title:"运行看到三角形"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">3</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">120</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"pentagon",category:"loop",title:"画正五边形",ageGroup:"6-8 岁",description:"用循环和画笔，让二零画出五条边一样长的正五边形。",missionBrief:"造物星球要做一个五边形的路标。帮二零用「重复执行 5 次」，画出五条等长边，拼出一个正五边形吧！",erLingHint:"① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 72 度」；③ 最后接「抬笔」；④ 点「运行」。提示：五边形每个外角是 72 度哦。",steps:[{id:1,title:"让二零落笔开始画"},{id:2,title:"用循环画出五条边"},{id:3,title:"运行看到正五边形"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">72</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"spin",category:"loop",title:"原地转圈 12 次",ageGroup:"6-8 岁",description:"用循环让二零转着圈走 12 步，画出一个圆。",missionBrief:"二零想在原地转个圈热身。用「重复执行 12 次」，每次走一小步再转一点点，它就转出一圈啦！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面放「移动 20 步」和「右转 30 度」；③ 最后「抬笔」；④ 点「运行」，二零会转着圈走成一个圆。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环转圈 12 步"},{id:3,title:"运行看到圆圈"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"stairs",category:"loop",title:"爬楼梯",ageGroup:"6-8 岁",description:"用循环画出一级一级向上爬的台阶。",missionBrief:"造物星球的小屋有台阶。帮二零用「重复执行」画出一级级向上爬的楼梯吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 6 次」，里面依次放「移动 50」「右转 90」「移动 50」「右转 90」（一阶一阶地往上爬）；③ 最后「抬笔」；④ 点「运行」看楼梯。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画出台阶"},{id:3,title:"运行看到楼梯"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"wave",category:"loop",title:"波浪线",ageGroup:"6-8 岁",description:"用嵌套循环画出上下起伏的波浪线。",missionBrief:"小河边的水波一上一下。帮二零用「循环里再套循环」画出弯弯的波浪线吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面先放一个「重复执行 9 次」画上半圆（移动 10、右转 20），再放一个「重复执行 9 次」画下半圆（移动 10、右转 -20）；③ 最后「抬笔」；④ 点「运行」看波浪。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用嵌套循环画波浪"},{id:3,title:"运行看到波浪线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">9</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-20</field></shadow></value></block></next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"spiral",category:"loop",title:"螺旋线",ageGroup:"6-8 岁",description:"用几段循环让二零画出越转越大的螺旋。",missionBrief:"蜗牛壳是螺旋形的！帮二零把几段「重复执行」拼起来，每一步走得更远，画出一条螺旋线吧。",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放 4 个「重复执行 8 次」，里面的「移动」步数分别用 10、20、30、40，每次都「右转 15 度」；③ 最后「抬笔」；④ 点「运行」看螺旋。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用多段循环画出螺旋"},{id:3,title:"运行看到螺旋线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                          </block>
                        </statement>
                        <next>
                          <block type="controls_repeat_ext">
                            <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                            <statement name="DO">
                              <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                              </block>
                            </statement>
                            <next><block type="maker_pen_up"></block></next>
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
    </xml>`},{slug:"fence",category:"loop",title:"画栅栏",ageGroup:"6-8 岁",description:"用循环画出一排整齐的栅栏。",missionBrief:"农场需要一圈栅栏。帮二零用「重复执行」画出一根根竖起的栅栏吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 5 次」，里面放「移动 60」「右转 90」「移动 20」「右转 -90」（画一根竖条再挪到下一根）；③ 最后「抬笔」；④ 点「运行」看栅栏。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画出栅栏"},{id:3,title:"运行看到栅栏"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"windmill",category:"loop",title:"风车",ageGroup:"6-8 岁",description:"用循环画出一架四叶风车。",missionBrief:"造物星球的风车转呀转。帮二零用「重复执行 4 次」画出四片风车叶片吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 100」「右转 180」「移动 100」「右转 90」（出去再回来，再转向下一叶）；③ 最后「抬笔」；④ 点「运行」看风车。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画出叶片"},{id:3,title:"运行看到风车"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"🌬️",label:"风车"}]}},{slug:"pickfruit",category:"loop",title:"重复 N 次摘果子",ageGroup:"6-8 岁",description:"用循环绕着果树走，练习重复 N 次。",missionBrief:"果树上挂满了果子🍎。让二零用「重复执行 8 次」绕着树转圈去摘果子吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 8 次」，里面放「移动 60 步」和「右转 45 度」；③ 最后「抬笔」；④ 点「运行」，二零会绕着果树转一圈。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环绕树转圈"},{id:3,title:"运行看到路线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"🌳",label:"果树"}]}},{slug:"rainbow",category:"draw",title:"二零画彩虹",ageGroup:"6-8 岁",description:"用循环和画笔命令让二零画出彩虹螺旋。",missionBrief:"二零捡到了一支神奇的画笔。只要重复转圈，它就能画出彩虹。",erLingHint:"① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 36 次」，里面依次放「移动」「右转」「画笔颜色增加」；③ 点「运行」，二零会一圈圈画出彩虹。找不到灵感就点「看示范」。",steps:[{id:1,title:"使用落笔和画笔颜色积木"},{id:2,title:"用循环让二零边移动边转向"},{id:3,title:"运行并看到彩虹图案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">36</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">10</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">10</field></shadow>
                        </value>
                        <next>
                          <block type="maker_pen_change_color">
                            <value name="DELTA">
                              <shadow type="math_number"><field name="NUM">10</field></shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"star5",category:"draw",title:"二零画五角星",ageGroup:"6-8 岁",description:"用循环和画笔，让二零画出闪闪发光的五角星。",missionBrief:"夜空里少了一颗星星。帮二零用「重复执行 5 次」画出一颗五角星，挂回造物星球的夜空吧！",erLingHint:"① 绿色「当开始运行」里先放绿色「落笔」；② 再放「重复执行 5 次」，里面放「移动 100 步」和「右转 144 度」；③ 最后接「抬笔」；④ 点「运行」。记住：星星的魔法角度是 144 度！",steps:[{id:1,title:"让二零落笔开始画"},{id:2,title:"用循环画出五角星"},{id:3,title:"运行看到五角星"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">5</field></shadow>
                </value>
                <statement name="DO">
                  <block type="maker_move">
                    <value name="STEPS">
                      <shadow type="math_number"><field name="NUM">100</field></shadow>
                    </value>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">144</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_pen_up"></block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"flower",category:"draw",title:"二零画花朵",ageGroup:"6-8 岁",description:"用嵌套循环和画笔，让二零画出一朵六瓣花。",missionBrief:"造物星球的花园空空的。帮二零用「循环里再套循环」画出一片片花瓣，变出一朵六瓣花送给伙伴吧！",erLingHint:"① 绿色「当开始运行」里先放「落笔」；② 放「重复执行 6 次」（画 6 片花瓣），里面再放一个「重复执行 2 次」的小循环；③ 小循环里放「移动 50 步」和「右转 60 度」，小循环后面接一个「右转 60 度」收一片花瓣；④ 大循环后面再「右转 60 度」转到下一片；⑤ 点「运行」看花朵绽放。",steps:[{id:1,title:"让二零落笔开始画"},{id:2,title:"用嵌套循环画出花瓣"},{id:3,title:"运行看到花朵"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES">
                  <shadow type="math_number"><field name="NUM">6</field></shadow>
                </value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES">
                      <shadow type="math_number"><field name="NUM">2</field></shadow>
                    </value>
                    <statement name="DO">
                      <block type="maker_move">
                        <value name="STEPS">
                          <shadow type="math_number"><field name="NUM">50</field></shadow>
                        </value>
                        <next>
                          <block type="maker_turn">
                            <value name="DEGREES">
                              <shadow type="math_number"><field name="NUM">60</field></shadow>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn">
                        <value name="DEGREES">
                          <shadow type="math_number"><field name="NUM">60</field></shadow>
                        </value>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="maker_turn">
                    <value name="DEGREES">
                      <shadow type="math_number"><field name="NUM">60</field></shadow>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"snowflake",category:"draw",title:"雪花",ageGroup:"6-8 岁",description:"用循环画出六角对称的雪花。",missionBrief:"冬天到了，天上飘着雪花❄️。帮二零用「重复执行 6 次」画出六条放射的雪花瓣吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 6 次」，里面放「移动 80」「右转 180」「移动 80」「右转 60」（画一条出去再回来的放射线，再转到下一瓣）；③ 最后「抬笔」；④ 点「运行」看雪花。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画出雪花瓣"},{id:3,title:"运行看到雪花"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                      <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">60</field></shadow></value></block></next>
                      </block></next>
                    </block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"❄️",label:"雪花"}]}},{slug:"mandala",category:"draw",title:"曼陀罗 / 万花筒",ageGroup:"6-8 岁",description:"用嵌套循环画出对称的曼陀罗花纹。",missionBrief:"万花筒里的图案好漂亮！帮二零用「循环里再套循环」画出一圈圈对称的花纹吧。",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 12 次」，里面先放「重复执行 3 次」画一个小三角（移动 40、右转 120），再放「右转 30 度」换到下一朵；③ 最后「抬笔」；④ 点「运行」看曼陀罗。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用嵌套循环画花纹"},{id:3,title:"运行看到曼陀罗"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"concentric",category:"draw",title:"同心圆",ageGroup:"6-8 岁",description:"用几段循环画出一圈套一圈的同心圆。",missionBrief:"水面上的波纹一圈圈散开。帮二零用几段「重复执行」画出大小不同的同心圆吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放 3 个「重复执行 24 次」，里面的「移动」步数分别用 3、5、7，每次都「右转 15 度」（步子越大圆越大）；③ 最后「抬笔」；④ 点「运行」看同心圆。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用多段循环画圆"},{id:3,title:"运行看到同心圆"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="controls_repeat_ext">
                        <value name="TIMES"><shadow type="math_number"><field name="NUM">24</field></shadow></value>
                        <statement name="DO">
                          <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">7</field></shadow></value>
                            <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">15</field></shadow></value></block></next>
                          </block>
                        </statement>
                        <next><block type="maker_pen_up"></block></next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"connectdot",category:"draw",title:"折线连点画",ageGroup:"6-8 岁",description:"用循环把点连成折线图形。",missionBrief:"把桌面上的小点用线连起来，就能变出图形！帮二零用「重复执行」连出一条折线吧。",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 8 次」，里面放「移动 60 步」和「右转 45 度」；③ 最后「抬笔」；④ 点「运行」，二零会把点连成一个八边形。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环连点成图"},{id:3,title:"运行看到图形"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">45</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"🔗",label:"连点"}]}},{slug:"house",category:"draw",title:"画小房子",ageGroup:"6-8 岁",description:"用循环画出房身和屋顶，拼出小房子。",missionBrief:"造物星球需要一座小房子🏠。帮二零先用「重复执行 4 次」画方方的房身，再画一个三角形的屋顶吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」画房身（移动 80、右转 90）；③ 再放「重复执行 3 次」画屋顶（移动 80、右转 120）；④ 最后「抬笔」；⑤ 点「运行」看小房子。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画房身和屋顶"},{id:3,title:"运行看到小房子"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                  </block>
                </statement>
                <next>
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next><block type="maker_pen_up"></block></next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:-40,emoji:"🏠",label:"小房子"}]}},{slug:"letter",category:"draw",title:"画字母 / 自己的名字",ageGroup:"6-8 岁",description:"用循环画一个方框，再在里面写出自己的名字。",missionBrief:"想用画笔写出自己的名字吗？先让二零画一个方框当本子，你就能在里面写出第一个字母啦！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面放「移动 60 步」和「右转 90 度」（画一个方框）；③ 最后「抬笔」；④ 点「运行」看方框，再想象在里面写自己的名字。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用循环画方框"},{id:3,title:"运行看到图形"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                    <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`,scene:{marks:[{x:0,y:0,emoji:"✏️",label:"写字"}]}},{slug:"checkerboard",category:"draw",title:"棋盘格",ageGroup:"6-8 岁",description:"用嵌套循环画出一排排小方格，组成棋盘。",missionBrief:"下棋需要棋盘格。帮二零用「循环里再套循环」画出一格格的小方块吧！",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 放「重复执行 4 次」，里面先放「重复执行 4 次」画一个小方格（移动 40、右转 90），再放「右转 90」「移动 50」「右转 -90」挪到下一格；③ 最后「抬笔」；④ 点「运行」看棋盘格。",steps:[{id:1,title:"让二零落笔开始"},{id:2,title:"用嵌套循环画方格"},{id:3,title:"运行看到棋盘格"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="60" y="60">
        <statement name="STACK">
          <block type="maker_pen_down">
            <next>
              <block type="controls_repeat_ext">
                <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <statement name="DO">
                  <block type="controls_repeat_ext">
                    <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                    <statement name="DO">
                      <block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                        <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></next>
                      </block>
                    </statement>
                    <next>
                      <block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        <next><block type="maker_move"><value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                          <next><block type="maker_turn"><value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value></block></next>
                        </block></next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next><block type="maker_pen_up"></block></next>
              </block>
            </next>
          </block>
        </statement>
      </block>
    </xml>`},{slug:"click_jump",category:"event",title:"点一下，二零跳一跳",ageGroup:"6-8 岁",description:"点击舞台，让二零向上跳一下再落回来。",missionBrief:"造物星球上有一只爱蹦跳的二零。写一个程序：当舞台被点击时，二零先向上跳一下，停一小会儿，再落回原处。",erLingHint:"① 拖一个蓝色「当舞台被点击」事件；② 里面放「移动 -30 步」（向上跳），接「等待 0.3 秒」，再接「移动 30 步」（落回来）；③ 点「运行」后在舞台上点一下，二零就蹦起来啦！",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"让二零向上跳起"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
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
  </xml>`},{slug:"click_color",category:"event",title:"点一下换颜色",ageGroup:"6-8 岁",description:"每次点击舞台，让二零画出不同颜色的线。",missionBrief:"二零有一支会变色的画笔。写一个程序：当舞台被点击时，它落下笔、换个颜色、向前画一小段，再抬笔。每点一次颜色都不一样！",erLingHint:"① 蓝色「当舞台被点击」里面放「落笔」；② 接「画笔颜色增加 60」（每次换色）；③ 接「移动 40 步」和「抬笔」；④ 点「运行」后多戳几下舞台，看线条变色。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"使用换画笔颜色积木"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next><block type="maker_pen_change_color">
            <value name="DELTA"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
              <next><block type="maker_pen_up"></block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"click_dialog",category:"event",title:"连续点击对话",ageGroup:"6-8 岁",description:"每点一次舞台，二零说出不同的话。",missionBrief:"二零是个小话痨。写一个程序：每次点击舞台，它先说一句「你好呀！」，再说一句「今天天气真好！」，像在跟你聊天。",erLingHint:"① 蓝色「当舞台被点击」里放第一个紫色「说 你好呀！ 1 秒」；② 接第二个「说 今天天气真好！ 1 秒」；③ 点「运行」后多点几下舞台，听听二零聊天。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"让二零说出两句话"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你好呀！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">今天天气真好！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"two_events",category:"event",title:"两个事件一起用",ageGroup:"6-8 岁",description:"把「当开始运行」和「当舞台被点击」两个事件组合到一起。",missionBrief:"一个程序可以有好几个事件！写一个程序：点「运行」时二零说「开始啦」，点击舞台时它又说「你点我啦」。",erLingHint:"① 拖一个绿色「当开始运行」，里面放「说 开始啦！ 1 秒」；② 再拖一个蓝色「当舞台被点击」，里面放「说 你点我啦！ 1 秒」；③ 点「运行」看看开始的效果，再点舞台听听另一句。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"使用「当舞台被点击」事件"},{id:3,title:"两个事件都能触发"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">开始啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
    <block type="maker_when_stage_clicked" x="60" y="200">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你点我啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"click_play_dialog",category:"event",title:"点我讲故事",ageGroup:"6-8 岁",description:"点击舞台，让二零讲出三段小故事。",missionBrief:"二零想当小小讲故事员。写一个程序：点击舞台时，它连着说出三句话，像一个迷你小故事。",erLingHint:"① 蓝色「当舞台被点击」里依次接三个紫色「说」积木；② 分别输入「从前有只二零」「它最爱编程」「你也来吗？」每段 1 秒；③ 点「运行」后点舞台，听二零讲故事。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"让二零连说三句话"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">从前有只二零</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">它最爱编程</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">你也来吗？</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"auto_patrol",category:"event",title:"自动巡逻一圈",ageGroup:"6-8 岁",description:"点「运行」就让二零自己转圈巡逻。",missionBrief:"哨兵二零要绕场巡逻一圈。写一个程序：当开始运行时，它落下笔，重复转着圈走，画出一圈巡逻路线。",erLingHint:"① 绿色「当开始运行」里放「落笔」；② 接「重复执行 12 次」，里面放「移动 30 步」和「右转 30 度」；③ 最后接「抬笔」；④ 点「运行」，二零会转出一圈。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用循环让二零边走边转"},{id:3,title:"运行看到巡逻路线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_down"><next>
          <block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <statement name="DO">
              <block type="maker_move">
                <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                <next><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block></next>
              </block>
            </statement>
            <next><block type="maker_pen_up"></block></next>
          </block>
        </next></block>
      </statement>
    </block>
  </xml>`},{slug:"key_forward",category:"event",title:"按键前进",ageGroup:"6-8 岁",description:"用键盘方向键让二零前进，像操控小游戏。",missionBrief:"写一个小操控程序：按下「↑ 上」方向键，二零就向前走 50 步。在键盘上戳戳看！",erLingHint:"① 拖一个「当按下 ↑ 上」事件；② 里面放「移动 50 步」；③ 点「运行」后，用键盘的方向键 ↑ 控制二零前进（看示范会自动按一下演示）。",steps:[{id:1,title:"使用「当按下方向键」事件"},{id:2,title:"让二零向前移动"},{id:3,title:"按方向键看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_key_pressed" x="60" y="60">
      <field name="KEY">up</field>
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"edge_bounce",category:"event",title:"碰壁就转弯",ageGroup:"6-8 岁",description:"让二零边走边判断，碰到边缘就转弯。",missionBrief:"聪明的二零会看路。写一个程序：它一直向前走，一旦「碰到边缘」就转个弯，继续探索。",erLingHint:"① 绿色「当开始运行」里放「重复执行 60 次」；② 里面放「移动 20 步」，再放「如果…那么」，条件放「碰到边缘」、那么里放「右转 120 度」；③ 点「运行」看二零闯关。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「如果碰到边缘」做判断"},{id:3,title:"运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">20</field></shadow></value>
              <next><block type="controls_if">
                <value name="IF0"><block type="maker_touching_edge"></block></value>
                <statement name="DO0"><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                </block></statement>
              </block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"size_toggle",category:"event",title:"点一下变大",ageGroup:"6-8 岁",description:"每次点击舞台，让二零变大一点。",missionBrief:"点一下舞台，二零就长大一点，像充气一样！再试试把它变小。",erLingHint:"① 蓝色「当舞台被点击」里放「二零大小增加 1」（每点一次变大）；② 想让它变小，就把数字改成 -1；③ 点「运行」后多点几下舞台看二零变大变小。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"改变二零的大小"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_change_size">
          <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"expression_shake",category:"event",title:"摇晃变表情",ageGroup:"6-8 岁",description:"点击舞台让二零摇晃一下，并换上开心的表情。",missionBrief:"二零想用表情表达心情。写一个程序：点击舞台，二零先左右摇晃一下，然后换上「开心」的表情说一句话。",erLingHint:"① 蓝色「当舞台被点击」里先放两个「移动」（一个 -15、一个 15）让二零晃一晃；② 接「让二零表情变成 开心」；③ 最后接「说 我变开心啦！ 1 秒」；④ 点「运行」后点击舞台试试。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"用「让二零表情变成」换表情"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">-15</field></shadow></value>
          <next><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="maker_set_expression">
              <field name="EXPR">happy</field>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">我变开心啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"if_touch_star",category:"cond",title:"碰到星星就说话",ageGroup:"6-8 岁",description:"用「如果…那么」判断碰到星星时说话。",missionBrief:"舞台上有几颗星星。写一个程序：点击舞台让二零飞过去，如果碰到了星星，就大声说「找到星星啦！」。",erLingHint:"① 蓝色「当舞台被点击」里放「移到鼠标位置」；② 接「如果…那么」，条件放「碰到星星」，那么里放「说 找到星星啦！」；③ 点「运行」后点击那颗在中间的星星试试。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"用「如果碰到星星」做判断"},{id:3,title:"点击舞台看到效果"}],stars:[{x:0,y:0},{x:130,y:-70},{x:-130,y:-70}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
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
  </xml>`},{slug:"if_edge_turn",category:"cond",title:"到边缘就拐弯",ageGroup:"6-8 岁",description:"用条件判断「如果碰到边缘就拐弯」。",missionBrief:"二零在星球上探险。写一个程序：它一直往前走，一旦「碰到边缘」就拐个弯，换方向继续走。",erLingHint:"① 绿色「当开始运行」里放「重复执行 80 次」；② 里面放「移动 15 步」，再放「如果…那么」，条件放「碰到边缘」、那么里放「右转 135 度」；③ 点「运行」看二零绕场。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「如果碰到边缘」做判断"},{id:3,title:"运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
              <next><block type="controls_if">
                <value name="IF0"><block type="maker_touching_edge"></block></value>
                <statement name="DO0"><block type="maker_turn">
                  <value name="DEGREES"><shadow type="math_number"><field name="NUM">135</field></shadow></value>
                </block></statement>
              </block></next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"if_red_stop",category:"cond",title:"红色就停下",ageGroup:"6-8 岁",description:"用「如果画笔是红色就停下」做判断。",missionBrief:"二月学会了看信号灯。写一个程序：先把画笔设成红色，如果「画笔是红色」就大声说「红色，停下！」。",erLingHint:"① 绿色「当开始运行」里放「设置画笔颜色为 0」（红色）；② 接「如果…那么」，条件放「画笔是红色」，那么里放「说 红色，停下！ 2 秒」；③ 点「运行」看二零的反应。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「如果画笔是红色」做判断"},{id:3,title:"运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_pen_set_color">
          <value name="HUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next><block type="controls_if">
            <value name="IF0"><block type="maker_pen_is_red"></block></value>
            <statement name="DO0"><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">红色，停下！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></statement>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"click_left_right",category:"cond",title:"点左点右走不同路",ageGroup:"6-8 岁",description:"用「如果…否则」根据点击位置走不同方向。",missionBrief:"点舞台左边，二零向左走；点右边，它向右走。写一个程序：用「点击在左半边」判断，走不同的路。",erLingHint:"① 蓝色「当舞台被点击」里放「如果…那么…否则」（点积木上的齿轮加「否则」）；② 条件放「点击在左半边」，那么里放「移动 -60 步」，否则里放「移动 60 步」；③ 点「运行」后分别点左边和右边试试。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"用「点击在左半边」做判断"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"collect3",category:"cond",title:"集齐三颗星",ageGroup:"6-8 岁",description:"飞向三颗星星全部收集，再庆祝。",missionBrief:"星球上散落着 3 颗星星。写一个程序：让二零依次飞向 1、2、3 号星星把它们都收集起来，最后说「全部收集完成，庆祝！」。",erLingHint:"① 绿色「当开始运行」里依次放三个「飞向星星 1 号 / 2 号 / 3 号」；② 最后放「说 全部收集完成，庆祝！ 1 秒」；③ 点「运行」，二零会自己飞去集齐三颗星。",steps:[{id:1,title:"让二零飞向星星"},{id:2,title:"收集到星星"},{id:3,title:"集齐所有星星"}],stars:[{x:-100,y:80},{x:100,y:0},{x:0,y:-100}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">全部收集完成，庆祝！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"random_branch",category:"cond",title:"随机走不同路",ageGroup:"6-8 岁",description:"用「随机整数」让二零走不同的方向。",missionBrief:"让二零每次都有点不一样：用「随机整数」决定它向左还是向右走。",erLingHint:"① 绿色「当开始运行」里放「如果…那么…否则」（点齿轮加「否则」）；② 条件放「比较：随机整数 1 到 2 等于 1」；③ 那么里放「移动 -60 步」，否则里放「移动 60 步」；④ 点「运行」多试几次，看二零每次方向是否不同。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「随机整数」做判断"},{id:3,title:"运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_compare">
            <value name="A"><block type="maker_random_int">
              <value name="MIN"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <value name="MAX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block></value>
            <field name="OP">==</field>
            <value name="B"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></value>
          <statement name="DO0"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"odd_even",category:"cond",title:"奇偶步数走不同路",ageGroup:"6-8 岁",description:"用「变量 + 取余数」判断奇偶，让二零走锯齿路线。",missionBrief:"数数小游戏：让二零重复走 6 步，第「偶数」步走左边、第「奇数」步走右边，走出一条锯齿小路。",erLingHint:"① 绿色「当开始运行」里先放「把变量 n 设为 0」；② 接「重复执行 6 次」，里面放「如果…那么…否则」：条件放「比较：变量 n 取余数 2 等于 0」，那么里放「右转 30 度」、否则里放「右转 -30 度」；③ 接着放「变量 n 增加 1」和「移动 40 步」；④ 点「运行」看锯齿形。",steps:[{id:1,title:"设置并使用变量"},{id:2,title:"用「取余数」判断奇偶"},{id:3,title:"运行看到锯齿路线"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">n</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next><block type="controls_repeat_ext">
            <value name="TIMES"><shadow type="math_number"><field name="NUM">6</field></shadow></value>
            <statement name="DO"><block type="controls_if">
              <mutation else="1"></mutation>
              <value name="IF0"><block type="maker_compare">
                <value name="A"><block type="maker_mod">
                  <value name="A"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                  <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block></value>
                <field name="OP">==</field>
                <value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              </block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
              </block></statement>
              <statement name="ELSE"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
              </block></statement>
            </block><next>
              <block type="maker_change_var">
                <field name="NAME">n</field>
                <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                </block></next>
              </block>
            </next></block></statement>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"size_threshold",category:"cond",title:"长到一定大小就停",ageGroup:"6-8 岁",description:"用「比较 + 二零当前大小」做阈值判断。",missionBrief:"二零一点点变大。写一个程序：它不断变大，一旦「大小超过 2」就大声说「够大啦！」停下来。",erLingHint:"① 绿色「当开始运行」里放「重复执行 8 次」；② 里面先放「二零大小增加 0.4」；③ 接「如果…那么」，条件放「比较：二零当前大小 大于 2」，那么里放「说 够大啦！ 1 秒」；④ 点「运行」，看二零变大到阈值就喊停。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「比较 + 二零当前大小」做阈值判断"},{id:3,title:"运行看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO"><block type="maker_change_size">
            <value name="DELTA"><shadow type="math_number"><field name="NUM">0.4</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_compare">
                <value name="A"><block type="maker_get_size"></block></value>
                <field name="OP">></field>
                <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              </block></value>
              <statement name="DO0"><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">够大啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"avoid_obstacle",category:"cond",title:"遇到石头绕过去",ageGroup:"6-8 岁",description:"用「碰到障碍」判断，让二零绕开石头。",missionBrief:"舞台上有块石头 🪨。写一个程序：二零一直往前走，一「碰到障碍」就拐个弯继续走。",erLingHint:"① 绿色「当开始运行」里放「重复执行 40 次」；② 里面放「移动 15 步」，再放「如果…那么」，条件放「碰到 障碍」、那么里放「右转 90 度」；③ 点「运行」看二零绕开石头。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「碰到障碍」做判断"},{id:3,title:"运行看到效果"}],scene:{marks:[{x:60,y:0,emoji:"🪨",label:"石头",kind:"obstacle"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">15</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_mark"><field name="KIND">obstacle</field></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"escape_badguy",category:"cond",title:"碰到坏人就快跑",ageGroup:"6-8 岁",description:"用「碰到坏人」判断，让二零遇到坏猫咪就掉头逃跑。",missionBrief:"星球上有只坏猫咪 🐱。写一个程序：二零往前走，一旦「碰到坏人」就立刻掉头跑开。",erLingHint:"① 绿色「当开始运行」里放「重复执行 60 次」；② 里面放「移动 10 步」，再放「如果…那么」，条件放「碰到 坏人」、那么里放「右转 180 度」+「移动 30 步」；③ 点「运行」看二零遇到坏猫咪就掉头。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「碰到坏人」做判断"},{id:3,title:"运行看到效果"}],scene:{marks:[{x:40,y:40,emoji:"🐱",label:"坏猫咪",kind:"badguy"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_mark"><field name="KIND">badguy</field></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">180</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">30</field></shadow></value>
                </block></next>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"stars",category:"game",title:"二零收集星星",ageGroup:"6-8 岁",description:"点击舞台，用事件和判断让二零收集星星。",missionBrief:"星球上散落着 3 颗小星星。写一个程序：当点击舞台时，二零飞到鼠标位置；如果碰到星星，就宣布「收集到啦！」。",erLingHint:"① 拖一个蓝色「当舞台被点击」事件；② 里面放「移到鼠标位置」，再加「如果…那么」，条件放「碰到星星」、那么里放「说 收集到啦！」；③ 点「运行」后，在舞台上依次点击那 3 颗星星就能收集！",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"使用「如果碰到星星」判断"},{id:3,title:"收集所有 3 颗星星"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
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
    </xml>`},{slug:"maze_exit",category:"game",title:"走迷宫到出口",ageGroup:"6-8 岁",description:"用前进和转向，带二零穿过迷宫走到出口。",missionBrief:"迷宫的墙挡住了去路。写一个程序：用「移动」和「右转 / 左转」带二零绕过墙，走到插着小旗子的出口。",erLingHint:"① 绿色「当开始运行」里用「移动」和「右转 90 度 / 左转 -90 度」拼出一条路线；② 让二零先往上、再拐弯、最后到出口；③ 点「运行」看它走到小旗子。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用前进和转向走出路线"},{id:3,title:"运行走到出口"}],scene:{walls:[{x1:-150,y1:-150,x2:-150,y2:30},{x1:-150,y1:30,x2:-30,y2:30},{x1:40,y1:150,x2:40,y2:-30},{x1:40,y1:-30,x2:150,y2:-30}],marks:[{x:-60,y:120,emoji:"🏁",label:"出口"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_turn">
            <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
            <next><block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
              <next><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">-90</field></shadow></value>
                <next><block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"collect_apples",category:"game",title:"摘完所有苹果",ageGroup:"6-8 岁",description:"飞向每颗苹果树，把苹果都摘回家。",missionBrief:"果园里有 3 棵苹果树。写一个程序：让二零依次飞向 1、2、3 号苹果把它们都摘下来，最后说「苹果都摘完啦！」。",erLingHint:"① 绿色「当开始运行」里放三个「飞向星星 1 / 2 / 3 号」（每颗苹果就是一颗星星）；② 最后放「说 苹果都摘完啦！ 1 秒」；③ 点「运行」看二零摘光苹果。",steps:[{id:1,title:"让二零飞向苹果"},{id:2,title:"收集到苹果"},{id:3,title:"摘完所有苹果"}],stars:[{x:-110,y:70},{x:110,y:50},{x:0,y:-100}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">苹果都摘完啦！</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"light_lanterns",category:"game",title:"按顺序点灯笼",ageGroup:"6-8 岁",description:"依次飞到三盏灯笼前，把它们依次点亮。",missionBrief:"节日到了，三盏灯笼还没亮。写一个程序：让二零依次飞到 1、2、3 号灯笼前，每到一个就换个颜色、说一句「第几盏亮了」。",erLingHint:"① 绿色「当开始运行」里用「移到 x: y:」依次飞到三个位置；② 每到一个就「设置画笔颜色」换色、再「说 第几盏亮了」；③ 点「运行」看灯笼依次亮起。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"依次点亮多盏灯笼"},{id:3,title:"运行看到点亮效果"}],scene:{marks:[{x:-100,y:80,emoji:"🏮",label:"灯1"},{x:0,y:0,emoji:"🏮",label:"灯2"},{x:100,y:-80,emoji:"🏮",label:"灯3"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_pen_set_color">
            <value name="HUE"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
            <next><block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">第一盏亮了</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next><block type="maker_goto">
                <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
                <next><block type="maker_pen_set_color">
                  <value name="HUE"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
                  <next><block type="maker_say">
                    <value name="TEXT"><shadow type="text"><field name="TEXT">第二盏亮了</field></shadow></value>
                    <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    <next><block type="maker_goto">
                      <value name="X"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
                      <value name="Y"><shadow type="math_number"><field name="NUM">-80</field></shadow></value>
                      <next><block type="maker_pen_set_color">
                        <value name="HUE"><shadow type="math_number"><field name="NUM">240</field></shadow></value>
                        <next><block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">第三盏亮了</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                        </block></next>
                      </block></next>
                    </block></next>
                  </block></next>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block></next>
      </statement>
    </block>
  </xml>`},{slug:"collect_rainbow",category:"game",title:"收集彩虹碎片",ageGroup:"6-8 岁",description:"飞向四块彩虹碎片，把它们都收集齐。",missionBrief:"彩虹碎成了 4 块散落各地。写一个程序：让二零依次飞向 1、2、3、4 号碎片，把它们都找回来，最后说「彩虹拼好啦！」。",erLingHint:"① 绿色「当开始运行」里放四个「飞向星星 1 / 2 / 3 / 4 号」；② 最后放「说 彩虹拼好啦！ 1 秒」；③ 点「运行」看二零拼好彩虹。",steps:[{id:1,title:"让二零飞向彩虹碎片"},{id:2,title:"收集到碎片"},{id:3,title:"集齐所有碎片"}],stars:[{x:-130,y:60},{x:-50,y:-90},{x:50,y:-90},{x:130,y:60}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto_star">
          <value name="INDEX"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next><block type="maker_goto_star">
            <value name="INDEX"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            <next><block type="maker_goto_star">
              <value name="INDEX"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next><block type="maker_goto_star">
                <value name="INDEX"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                <next><block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">彩虹拼好啦！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                </block></next>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"treasure_map",category:"game",title:"跟着地图找宝藏",ageGroup:"6-8 岁",description:"按地图标记飞到宝藏箱的位置。",missionBrief:"你有一张藏宝图，宝藏箱在右下角。写一个程序：让二零直接飞到宝藏的位置，然后说「找到宝藏啦！」。",erLingHint:"① 绿色「当开始运行」里放「移到 x: 120 y: -60」（宝藏箱的位置）；② 接「说 找到宝藏啦！ 1 秒」；③ 点「运行」看二零挖到宝。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"飞到宝藏的位置"},{id:3,title:"运行找到宝藏"}],scene:{marks:[{x:120,y:-60,emoji:"📦",label:"宝藏"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">找到宝藏啦！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"escort",category:"game",title:"护送小动物回家",ageGroup:"6-8 岁",description:"飞到小动物身边接它，再送它回小屋。",missionBrief:"一只小动物在左上角迷路了，家在舞台中间。写一个程序：让二零先飞到小动物身边说「我来接你啦」，再飞回家说「回家咯」。",erLingHint:"① 绿色「当开始运行」里放「移到 小动物坐标」，接「说 我来接你啦 1 秒」；② 再放「移到 0,0（家）」，接「说 回家咯 1 秒」；③ 点「运行」看护送成功。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"飞到小动物并接它"},{id:3,title:"运行护送它回家"}],scene:{marks:[{x:-100,y:80,emoji:"🐰",label:"小动物"},{x:0,y:0,emoji:"🏠",label:"家"}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="maker_goto">
          <value name="X"><shadow type="math_number"><field name="NUM">-100</field></shadow></value>
          <value name="Y"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
          <next><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">我来接你啦</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
            <next><block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
              <next><block type="maker_say">
                <value name="TEXT"><shadow type="text"><field name="TEXT">回家咯</field></shadow></value>
                <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              </block></next>
            </block></next>
          </block></next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"traffic_police",category:"game",title:"交通警察指挥",ageGroup:"6-8 岁",description:"根据点击位置，指挥红绿灯：左半边停，右半边走。",missionBrief:"二月当上了小交警。写一个程序：点击舞台左半边，它说「红灯，停！」；点击右半边，它说「绿灯，走！」。",erLingHint:"① 蓝色「当舞台被点击」里放「如果…那么…否则」；② 条件放「点击在左半边」，那么里放「说 红灯，停！ 1 秒」，否则里放「说 绿灯，走！ 1 秒」；③ 点「运行」后分别点左边和右边。",steps:[{id:1,title:"使用「当舞台被点击」事件"},{id:2,title:"用「点击在左半边」做判断"},{id:3,title:"点击舞台看到效果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="60" y="60">
      <statement name="STACK">
        <block type="controls_if">
          <mutation else="1"></mutation>
          <value name="IF0"><block type="maker_mouse_left"></block></value>
          <statement name="DO0"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">红灯，停！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
          <statement name="ELSE"><block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">绿灯，走！</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"dodge_clouds",category:"game",title:"躲避乌云",ageGroup:"6-8 岁",description:"乌云会飘动，让二零躲开它们。",missionBrief:"天上有几朵会飘的乌云 ☁，碰到就糟糕啦。写一个程序：二零一直往前走，一「碰到乌云」就拐弯躲开。",erLingHint:"① 绿色「当开始运行」里放「重复执行 100 次」；② 里面放「移动 12 步」，再放「如果…那么」，条件放「碰到乌云」、那么里放「右转 120 度」；③ 点「运行」，看乌云慢慢飘、二零一路躲。",steps:[{id:1,title:"使用「当开始运行」事件"},{id:2,title:"用「碰到乌云」做判断"},{id:3,title:"运行看到乌云飘动与躲避"}],scene:{clouds:[{x:0,y:0,vx:1.2,vy:.8,r:35},{x:-110,y:70,vx:-1,vy:1,r:30}]},defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="60" y="60">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
          <statement name="DO"><block type="maker_move">
            <value name="STEPS"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
            <next><block type="controls_if">
              <value name="IF0"><block type="maker_touching_cloud"></block></value>
              <statement name="DO0"><block type="maker_turn">
                <value name="DEGREES"><shadow type="math_number"><field name="NUM">120</field></shadow></value>
              </block></statement>
            </block></next>
          </block></statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"memory_match",category:"game",title:"记忆翻牌",ageGroup:"6-8 岁",description:"独立的翻牌配对小游戏：记住卡片位置，找出相同的两张。",missionBrief:"桌面上有几对图案卡片，全部背面朝上。翻开两张，如果一样就消除，不一样就盖回去——靠记忆力把全部卡片配对成功吧！",erLingHint:"这是一个记忆小游戏：点一张卡片翻开，再点另一张。两张图案相同就留在桌面，不同会自动盖回去。把全部配对成功就通关啦！",steps:[{id:1,title:"翻开两张卡片"},{id:2,title:"记住并找出相同的两张"},{id:3,title:"把全部卡片配对成功"}],component:"memory"},{slug:"play_doremi",category:"music",title:"弹奏 do re mi",ageGroup:"6-8 岁",description:"用「弹奏音符」积木，让二零唱出 do re mi。",missionBrief:"造物星球上有一架会唱歌的小琴。写一个程序：当开始运行时，让二零依次弹出 do、re、mi 三个音，奏出最基础的小调子。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面接一个紫色「弹奏音符」积木（默认 do）；③ 在它下面再接两个「弹奏音符」，分别把音符改成 re、mi；④ 点「运行」，听二零唱出 do re mi！",steps:[{id:1,title:"用「弹奏音符」积木"},{id:2,title:"弹出 do re mi 三个音"},{id:3,title:"点击运行听到旋律"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">do</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">re</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">mi</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"twinkle",category:"music",title:"一闪一闪小星星",ageGroup:"6-8 岁",description:"把音符连成一串，弹出耳熟能详的《小星星》。",missionBrief:"大家都熟悉的《小星星》开头是「一闪一闪亮晶晶」。写一个程序：当开始运行时，让二零依次弹出 do、do、sol、sol、la、la、sol，奏出这句经典旋律。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 在里面依次接 7 个紫色「弹奏音符」积木，音符按顺序设为 do、do、sol、sol、la、la、sol；③ 点「运行」，听二零唱出《小星星》第一句！",steps:[{id:1,title:"用「弹奏音符」积木"},{id:2,title:"弹出至少 7 个音符的小旋律"},{id:3,title:"点击运行听到《小星星》"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">do</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">do</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">sol</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">la</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_play_note">
                              <field name="NOTE">la</field>
                              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                              <next>
                                <block type="maker_play_note">
                                  <field name="NOTE">sol</field>
                                  <value name="BEATS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
  </xml>`},{slug:"drum_beat",category:"music",title:"敲出节奏鼓点",ageGroup:"6-8 岁",description:"用「敲响」积木和循环，做出有节奏的鼓点。",missionBrief:"造物星球要开音乐会啦！写一个程序：当开始运行时，让二零用「重复执行」连续敲出鼓点，做出「咚、嚓、咚、嚓」的节奏。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里先放一个「敲响 鼓」，再用「下一个」接一个「敲响 镲」；④ 点「运行」，听二零敲出节奏！",steps:[{id:1,title:"用「敲响」积木"},{id:2,title:"用循环敲出一段节奏"},{id:3,title:"点击运行听到鼓点"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_play_drum">
              <field name="KIND">kick</field>
              <next>
                <block type="maker_play_drum">
                  <field name="KIND">hat</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"random_note",category:"music",title:"随机变奏小曲",ageGroup:"6-8 岁",description:"用「随机弹一个音」，让每次弹奏都不一样。",missionBrief:"想让二零即兴来一段吗？写一个程序：当开始运行时，用「重复执行」让二零连续随机弹出音符，每次运行都能听到不一样的旋律。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里放一个橙色「随机弹一个音」；④ 多点几次「运行」，听二零每次即兴的不同小曲！",steps:[{id:1,title:"用「随机弹一个音」积木"},{id:2,title:"用循环连续随机弹奏"},{id:3,title:"点击运行听到即兴旋律"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_random_note"></block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"loop_melody",category:"music",title:"循环旋律",ageGroup:"6-8 岁",description:"把几个音符放进循环里，让旋律一遍遍回荡。",missionBrief:"重复是音乐的好朋友。写一个程序：当开始运行时，用「重复执行」让二零反复弹奏 do、mi、sol 三个音，旋律就会一遍遍回荡。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 4 次」；③ 循环里依次接三个「弹奏音符」：do、mi、sol；④ 点「运行」，听旋律反复循环！",steps:[{id:1,title:"用「重复执行」循环"},{id:2,title:"循环里弹奏音符"},{id:3,title:"点击运行听到循环旋律"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
          <statement name="DO">
            <block type="maker_play_note">
              <field name="NOTE">do</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">mi</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"pitch_by_click",category:"music",title:"点哪响哪",ageGroup:"6-8 岁",description:"用「按点击位置弹音」，点舞台不同位置发出不同音高。",missionBrief:"造物星球有一架「位置琴」：点舞台左边音低，点右边音高。写一个程序：当舞台被点击时，让二零按点击位置弹出一个音，越靠右声音越高。",erLingHint:"① 拖一个蓝色「当舞台被点击」事件；② 里面放一个「按点击位置弹音（越靠右越高）」积木；③ 点「运行」后，在舞台上不同位置点几下，听音高随位置变化！",steps:[{id:1,title:"用「当舞台被点击」事件"},{id:2,title:"用「按点击位置弹音」"},{id:3,title:"点击舞台听到不同音高"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_stage_clicked" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_by_mouse"></block>
      </statement>
    </block>
  </xml>`},{slug:"pitch_by_move",category:"music",title:"走哪响哪",ageGroup:"6-8 岁",description:"让二零边走边按自己的位置弹音，画出声音的楼梯。",missionBrief:"让二零一边在舞台上移动，一边按自己所在位置发出不同音高。写一个程序：当开始运行时，用「重复执行」让二零不断前进并弹奏「按二零位置弹音」，越往右走音越高。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面放「重复执行 8 次」；③ 循环里先放「移动 40 步」，再用「下一个」接「按二零位置弹音（越靠右越高）」；④ 点「运行」，听二零边走边奏出声音楼梯！",steps:[{id:1,title:"用「当开始运行」事件"},{id:2,title:"边移动边按位置弹音"},{id:3,title:"点击运行听到音高变化"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <statement name="DO">
            <block type="maker_move">
              <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
              <next>
                <block type="maker_play_by_actor"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"chord",category:"music",title:"弹一个和弦",ageGroup:"6-8 岁",description:"用「弹和弦」积木，让几个音同时响起来。",missionBrief:"和弦是几个音同时响起，听起来更饱满。写一个程序：当开始运行时，让二零用一个「弹和弦」积木，同时弹出 do、mi、sol 三个音，组成好听的大三和弦。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面放一个「弹和弦」积木，三个音符默认就是 do、mi、sol；③ 点「运行」，听三个音同时响起的饱满和声！",steps:[{id:1,title:"用「弹和弦」积木"},{id:2,title:"和弦里包含至少 2 个音"},{id:3,title:"点击运行听到和弦"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_chord">
          <field name="N1">do</field>
          <field name="N2">mi</field>
          <field name="N3">sol</field>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"birthday",category:"music",title:"生日快乐歌",ageGroup:"6-8 岁",description:"把音符排好，弹出大家都爱的《生日快乐歌》第一句。",missionBrief:"《生日快乐歌》第一句是「祝你生日快乐」。写一个程序：当开始运行时，让二零依次弹出 sol、sol、la、sol、高音do、ti 六个音，奏出这句经典旋律。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 里面依次接 6 个「弹奏音符」，音符顺序设为 sol、sol、la、sol、高音do、ti（高音do 在下拉里选「高音do」）；③ 点「运行」，为小伙伴唱一首生日歌！",steps:[{id:1,title:"用「弹奏音符」积木"},{id:2,title:"弹出至少 6 个音符的旋律"},{id:3,title:"点击运行听到《生日快乐歌》"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">sol</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">sol</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">la</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                      <next>
                        <block type="maker_play_note">
                          <field name="NOTE">do2</field>
                          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                          <next>
                            <block type="maker_play_note">
                              <field name="NOTE">ti</field>
                              <value name="BEATS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
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
  </xml>`},{slug:"compose",category:"music",title:"我的小创作",ageGroup:"6-8 岁",description:"自由组合音符，创作一段属于你自己的小旋律。",missionBrief:"现在轮到你当小作曲家啦！用「弹奏音符」积木（也可以用循环），随便排一排，创作一段属于你自己的小旋律，让二零唱给你听。",erLingHint:"① 拖一个绿色「当开始运行」事件；② 在里面对接至少 3 个「弹奏音符」（或用一个「重复执行」包住几个音）排成你喜欢的顺序；③ 点「运行」，听二零唱出你的原创小曲！没有标准答案，好听就行～",steps:[{id:1,title:"用「弹奏音符」积木"},{id:2,title:"创作至少 3 个音的小旋律"},{id:3,title:"点击运行听到你的创作"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_play_note">
          <field name="NOTE">do</field>
          <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_play_note">
              <field name="NOTE">re</field>
              <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_play_note">
                  <field name="NOTE">mi</field>
                  <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                  <next>
                    <block type="maker_play_note">
                      <field name="NOTE">sol</field>
                      <value name="BEATS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"count10",category:"math",title:"数数 1 到 10",ageGroup:"6-8 岁",description:"用「重复执行」加上「变量」，让二零一边数一边把数字说出来。",missionBrief:"造物星球上要办数数比赛。写一个程序：当开始运行时，让二零从 1 数到 10，每数一个数就大声说出来。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面放一个橙色「重复执行 10 次」；③ 循环里先放紫色「变量 n 增加 1」，再放粉色「说 变量 n」（用「变量 n」积木当数字）；④ 点运行，听二零数 1、2、3……10！",steps:[{id:1,title:"用重复执行或变量来数数"},{id:2,title:"一边加一边说出数字，数到 10"},{id:3,title:"点运行听二零数完 1-10"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
          <statement name="DO">
            <block type="maker_change_var">
              <field name="NAME">n</field>
              <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"count_apples",category:"math",title:"数一数苹果",ageGroup:"6-8 岁",description:"树上有 5 个苹果，用「重复执行」和「变量」把它们一个一个数出来。",missionBrief:"造物星球的小果园丰收啦！写一个程序：当开始运行时，让二零把树上的 5 个苹果一个一个数出来，最后告诉大家「一共 5 个苹果」。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面放橙色「重复执行 5 次」；③ 循环里先放「变量 n 增加 1」，再放「说 变量 n」；④ 循环外面再放一个「说 一共 5 个苹果！」；⑤ 点运行，听二零清点苹果。",steps:[{id:1,title:"用重复执行或变量来数苹果"},{id:2,title:"一边加一边说出数字，数到 5"},{id:3,title:"点运行听二零数完苹果"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="controls_repeat_ext">
          <value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
          <statement name="DO">
            <block type="maker_change_var">
              <field name="NAME">n</field>
              <value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">n</field></block></value>
                </block>
              </next>
            </block>
          </statement>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">一共 5 个苹果！</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"compare_size",category:"math",title:"比一比谁更大",ageGroup:"6-8 岁",description:"用「变量」记下两个数，再用「比较」积木判断谁大谁小。",missionBrief:"造物星球的两颗能量球，一颗是 8，一颗是 3。写一个程序：当开始运行时，让二零比较它们，说出「8 比 3 大！」。",erLingHint:"① 拖绿色「当开始运行」；② 里面放两个「把变量 a 设为 8」「把变量 b 设为 3」；③ 再放一个「如果…那么」，条件里放「比较 变量 a 大于 变量 b」；④ 那么里放「说 8 比 3 大！」；⑤ 点运行，看二零比大小。",steps:[{id:1,title:"用变量记下两个数"},{id:2,title:"用比较积木判断谁更大"},{id:3,title:"点运行听二零比出大小"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">a</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
          <next>
            <block type="maker_set_var">
              <field name="NAME">b</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <next>
                <block type="controls_if">
                  <value name="IF0">
                    <block type="maker_compare">
                      <value name="A"><block type="maker_get_var"><field name="NAME">a</field></block></value>
                      <value name="B"><block type="maker_get_var"><field name="NAME">b</field></block></value>
                      <field name="OP">&gt;</field>
                    </block>
                  </value>
                  <statement name="DO0">
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">8 比 3 大！</field></shadow></value>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"add_sub",category:"math",title:"加减法小助手",ageGroup:"6-8 岁",description:"用「加法」「减法」积木算出结果，再把答案说出来。",missionBrief:"造物星球的小商店要用到算术。写一个程序：当开始运行时，让二零算出 3 + 5 和 8 - 2，并把两个答案都说出来。",erLingHint:"① 拖绿色「当开始运行」；② 里面放一个粉色「说」，把它的数字口接上一个黄色「加」积木（左边 3、右边 5）；③ 下面再放一个「说」，接上黄色「减」积木（左边 8、右边 2）；④ 点运行，听二零报出 8 和 6！",steps:[{id:1,title:"用加法积木算出结果"},{id:2,title:"用减法积木算出结果"},{id:3,title:"点运行听二零报出答案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT">
            <block type="maker_add">
              <value name="A"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
              <value name="B"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
            </block>
          </value>
          <next>
            <block type="maker_say">
              <value name="TEXT">
                <block type="maker_sub">
                  <value name="A"><shadow type="math_number"><field name="NUM">8</field></shadow></value>
                  <value name="B"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"shape_names",category:"math",title:"认识图形",ageGroup:"6-8 岁",description:"落笔 + 循环画出一个正方形，再说出它的名字。",missionBrief:"造物星球的图形课上，二零要画出各种形状并说出名字。先来画一个正方形：当开始运行时，让二零画出一个正方形，并说「我画了一个正方形！」。",erLingHint:"① 拖绿色「当开始运行」；② 先放绿色「落笔」；③ 再放橙色「重复执行 4 次」，里面放「移动 80 步」和「右转 90 度」；④ 放「抬笔」；⑤ 最后放「说 我画了一个正方形！」；⑥ 点运行，看二零画出正方形并报名。",steps:[{id:1,title:"用落笔开始画画"},{id:2,title:"用循环画出一个图形"},{id:3,title:"说出图形的名字"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">80</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_pen_up">
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">我画了一个正方形！</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"symmetry",category:"math",title:"对称图形",ageGroup:"6-8 岁",description:"用「移到」把两个一样的图形摆成左右镜像，感受对称。",missionBrief:"造物星球的对称花园里，左右两边要一模一样。写一个程序：当开始运行时，让二零在左边和右边各画一个一样的正方形，组成左右对称的图案。",erLingHint:"① 拖绿色「当开始运行」；② 放「落笔」，再用「移到 x:-60 y:-40」定位到左边；③ 放「重复执行 4 次」画一个正方形；④ 放「抬笔」，再用「移到 x:60 y:-40」定位到右边；⑤ 再「落笔」画一个一样的正方形；⑥ 最后「说 左右两边一样，这就是对称！」；⑦ 点运行看对称图案。",steps:[{id:1,title:"用落笔开始画画"},{id:2,title:"用「移到」摆出左右对称的两部分"},{id:3,title:"点运行看二零画出对称图案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">-60</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">-40</field></shadow></value>
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                      <next>
                        <block type="maker_turn">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="maker_pen_up">
                      <next>
                        <block type="maker_goto">
                          <value name="X"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
                          <value name="Y"><shadow type="math_number"><field name="NUM">-40</field></shadow></value>
                          <next>
                            <block type="maker_pen_down">
                              <next>
                                <block type="controls_repeat_ext">
                                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                                  <statement name="DO">
                                    <block type="maker_move">
                                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                      <next>
                                        <block type="maker_turn">
                                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="maker_pen_up">
                                      <next>
                                        <block type="maker_say">
                                          <value name="TEXT"><shadow type="text"><field name="TEXT">左右两边一样，这就是对称！</field></shadow></value>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"multiplication",category:"math",title:"九九乘法初识",ageGroup:"6-8 岁",description:"乘法就是「几个相同的数相加」，用循环和变量就能算出来。",missionBrief:"造物星球的数学老师说：3 × 4 就是把 3 加 4 次。写一个程序：当开始运行时，让二零算出 3 × 4，并说出答案。",erLingHint:"① 拖绿色「当开始运行」；② 先放「把变量 sum 设为 0」；③ 再放橙色「重复执行 4 次」，里面放「变量 sum 增加 3」；④ 循环后放「说 变量 sum」和「说 3×4=12！」；⑤ 点运行，看二零用加法变出乘法。",steps:[{id:1,title:"用重复执行来算"},{id:2,title:"用变量累加（乘法=几个相同数相加）"},{id:3,title:"点运行听二零算出乘法"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">sum</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_change_var">
                  <field name="NAME">sum</field>
                  <value name="DELTA"><shadow type="math_number"><field name="NUM">3</field></shadow></value>
                </block>
              </statement>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><block type="maker_get_var"><field name="NAME">sum</field></block></value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">3\xd74=12！</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"clock",category:"math",title:"时钟整点",ageGroup:"6-8 岁",description:"用循环画一个圆圆的表盘，再说出现在是几点整。",missionBrief:"造物星球的小镇钟楼要报时了。写一个程序：当开始运行时，让二零画出一个圆形的表盘，并说「3 点整啦！」。",erLingHint:"① 拖绿色「当开始运行」；② 放「落笔」，再放橙色「重复执行 36 次」，里面放「移动 10 步」和「右转 10 度」，画出一个圆；③ 放「抬笔」；④ 最后放「说 3 点整啦！」；⑤ 点运行，看二零画出钟表。",steps:[{id:1,title:"用落笔 + 循环画出圆形表盘"},{id:2,title:"说出整点的时间"},{id:3,title:"点运行看二零画出时钟"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">36</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                  <next>
                    <block type="maker_turn">
                      <value name="DEGREES"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="maker_pen_up">
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">3 点整啦！</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"geometry_puzzle",category:"math",title:"几何拼图",ageGroup:"6-8 岁",description:"用「移到」把几个图形摆到不同位置，拼出一幅小图画。",missionBrief:"造物星球的拼图角，要用基本图形拼出图案。写一个程序：当开始运行时，让二零在左右两边各画一个正方形，拼出一座小房子。",erLingHint:"① 拖绿色「当开始运行」；② 放「落笔」，用「移到 x:-50 y:-30」定位，再「重复执行 4 次」画一个正方形；③ 放「抬笔」，再「落笔」用「移到 x:40 y:-30」定位到右边，画第二个正方形；④ 放「说 我用两个正方形拼出了一座小房子！」；⑤ 点运行看拼图。",steps:[{id:1,title:"用落笔开始画画"},{id:2,title:"用「移到」摆好几个图形拼成图案"},{id:3,title:"点运行看二零拼出图案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_pen_down">
          <next>
            <block type="maker_goto">
              <value name="X"><shadow type="math_number"><field name="NUM">-50</field></shadow></value>
              <value name="Y"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
              <next>
                <block type="controls_repeat_ext">
                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                  <statement name="DO">
                    <block type="maker_move">
                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                      <next>
                        <block type="maker_turn">
                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="maker_pen_up">
                      <next>
                        <block type="maker_pen_down">
                          <next>
                            <block type="maker_goto">
                              <value name="X"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                              <value name="Y"><shadow type="math_number"><field name="NUM">-30</field></shadow></value>
                              <next>
                                <block type="controls_repeat_ext">
                                  <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
                                  <statement name="DO">
                                    <block type="maker_move">
                                      <value name="STEPS"><shadow type="math_number"><field name="NUM">40</field></shadow></value>
                                      <next>
                                        <block type="maker_turn">
                                          <value name="DEGREES"><shadow type="math_number"><field name="NUM">90</field></shadow></value>
                                        </block>
                                      </next>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type="maker_pen_up">
                                      <next>
                                        <block type="maker_say">
                                          <value name="TEXT"><shadow type="text"><field name="TEXT">我用两个正方形拼出了一座小房子！</field></shadow></value>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"calculator",category:"math",title:"小小计算器",ageGroup:"6-8 岁",description:"把两个数存进变量，再用算术积木算出结果并显示出来。",missionBrief:"造物星球的小朋友想要一个会算数的一零。写一个程序：当开始运行时，让二零算出 12 + 7 和 12 - 7，并把两个答案都说出来。",erLingHint:"① 拖绿色「当开始运行」；② 放「把变量 x 设为 12」「把变量 y 设为 7」；③ 放一个「说」，数字口接黄色「加」积木，左右都放进「变量 x」「变量 y」；④ 再放一个「说」，接黄色「减」积木（也都是变量 x、y）；⑤ 点运行，听二零当小计算器！",steps:[{id:1,title:"用变量输入两个数"},{id:2,title:"用加 / 减等算术积木算出结果"},{id:3,title:"点运行听二零算出答案"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_var">
          <field name="NAME">x</field>
          <value name="VALUE"><shadow type="math_number"><field name="NUM">12</field></shadow></value>
          <next>
            <block type="maker_set_var">
              <field name="NAME">y</field>
              <value name="VALUE"><shadow type="math_number"><field name="NUM">7</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT">
                    <block type="maker_add">
                      <value name="A"><block type="maker_get_var"><field name="NAME">x</field></block></value>
                      <value name="B"><block type="maker_get_var"><field name="NAME">y</field></block></value>
                    </block>
                  </value>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT">
                        <block type="maker_sub">
                          <value name="A"><block type="maker_get_var"><field name="NAME">x</field></block></value>
                          <value name="B"><block type="maker_get_var"><field name="NAME">y</field></block></value>
                        </block>
                      </value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"self_intro",category:"story",title:"二零的自我介绍",ageGroup:"6-8 岁",description:"让二零开口介绍自己，认识这位小太阳鹦鹉伙伴。",missionBrief:"造物星球来了一位新朋友——小太阳鹦鹉「二零」。请写一个程序：当开始运行时，让二零说出自己的名字，再说说自己的爱好。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面放一个紫色「说 你好！我是小太阳鹦鹉二零 2 秒」；③ 接一个「说 我最喜欢在造物星球上编程啦！」。点运行，听二零介绍自己！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"让二零说出自己的名字和爱好"},{id:3,title:"点运行，看二零介绍自己"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">你好！我是小太阳鹦鹉二零</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我最喜欢在造物星球上编程啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"expression",category:"story",title:"表情变变变",ageGroup:"6-8 岁",description:"用「设置表情」积木，让二零一会儿开心、一会儿惊讶。",missionBrief:"二零是个表情丰富的小鹦鹉。写一个程序：当开始运行时，让二零先变成「开心」，说一句话，再变成「惊讶」，说另一句话。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面放粉色「让二零表情变成 开心」，接「说 今天真开心！」；③ 再放「让二零表情变成 惊讶」，接「说 哇，有惊喜！」。点运行看表情变化！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"用「设置表情」积木让二零换表情"},{id:3,title:"点运行，看表情变来变去"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_expression">
          <field name="EXPR">happy</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">今天真开心！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
              <next>
                <block type="maker_set_expression">
                  <field name="EXPR">surprised</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">哇，有惊喜！</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"freeze",category:"story",title:"木头人游戏",ageGroup:"6-8 岁",description:"让二零一边跑一边玩「我们都是木头人」的口令游戏。",missionBrief:"大家来玩木头人！写一个程序：当开始运行时，让二零先跑几步，然后停下大声说「我们都是木头人，不许说话不许动！」。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面放黄色「移动 60 步」让二零跑起来；③ 接紫色「说 我们都是木头人，不许说话不许动！ 2 秒」。点运行玩一局木头人！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"让二零先跑动再停下说「不许动」"},{id:3,title:"点运行，玩一局木头人"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_move">
          <value name="STEPS"><shadow type="math_number"><field name="NUM">60</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">我们都是木头人，不许说话不许动！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"animal_sports",category:"story",title:"动物运动会",ageGroup:"6-8 岁",description:"用「重复执行」让二零一圈圈跑起来，参加动物运动会。",missionBrief:"造物星球举办动物运动会！写一个程序：当开始运行时，让二零先喊一声「运动会开始啦！」，再用「重复执行」一圈圈跑起来。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面先放「说 运动会开始啦！」；③ 接「重复执行 4 次」，循环里放「移动 50 步」。点运行，看二零参赛！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"让二零跑起来参加比赛（移动 + 重复）"},{id:3,title:"点运行，看运动会开幕"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">运动会开始啦！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
          <next>
            <block type="controls_repeat_ext">
              <value name="TIMES"><shadow type="math_number"><field name="NUM">4</field></shadow></value>
              <statement name="DO">
                <block type="maker_move">
                  <value name="STEPS"><shadow type="math_number"><field name="NUM">50</field></shadow></value>
                </block>
              </statement>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"word_chain",category:"story",title:"词语接龙",ageGroup:"6-8 岁",description:"让二零玩词语接龙，一个接一个说出相关的词。",missionBrief:"词语接龙游戏：前一个词的最后一个字，是后一个词的开头。写一个程序：当开始运行时，让二零连续说出至少两个词（比如「苹果 → 果实 → 实力」）。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面连放三个紫色「说」，分别输入「苹果」「果实」「实力」；③ 点运行，听二零接龙！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"让二零连续说出至少两个词来接龙"},{id:3,title:"点运行，听二零接龙"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">果实</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">实力</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"birthday_party",category:"story",title:"生日派对",ageGroup:"6-8 岁",description:"切换到派对场景，让二零送上生日祝福。",missionBrief:"今天是谁的生日？写一个程序：当开始运行时，先切换到一个明亮的场景，再让二零大声送上生日祝福。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面先放「切换场景 白天」，再放「说 生日快乐！」；③ 接「说 大家一起吃蛋糕吧！」。点运行庆祝！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"切换到一个派对场景并送上生日祝福"},{id:3,title:"点运行，一起庆祝"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">day</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">生日快乐！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">大家一起吃蛋糕吧！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"good_night",category:"story",title:"晚安故事",ageGroup:"6-8 岁",description:"切换到夜晚场景，让二零道一声晚安。",missionBrief:"夜深了，星星出来了。写一个程序：当开始运行时，切换到夜晚场景，让二零轻声说晚安，再换上「睡觉」表情。",erLingHint:"① 拖一个绿色「当开始运行」；② 里面先放「切换场景 夜晚」；③ 放「说 月亮出来了，该睡觉啦」，再「让二零表情变成 睡觉」，接「说 晚安，明天见！」。点运行听晚安！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"切换到夜晚场景并说晚安"},{id:3,title:"点运行，听二零道晚安"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">night</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">月亮出来了，该睡觉啦</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
              <next>
                <block type="maker_set_expression">
                  <field name="EXPR">sleepy</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">晚安，明天见！</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`},{slug:"two_talk",category:"story",title:"两个伙伴的对话",ageGroup:"6-8 岁",description:"用「控制角色」积木，让二零和三七你一句我一句聊起来。",missionBrief:"二零的好朋友三七（玄凤鹦鹉）来啦！写一个程序：当开始运行时，让二零先说话，再用「控制角色」切换到三七让它回话，最后切回二零再说一句。",erLingHint:"① 拖绿色「当开始运行」；② 放「控制角色 二零」+「说 三七，你来啦！」；③ 放「控制角色 三七」+「说 二零，今天玩什么？」，再「控制角色 二零」+「说 我们来编程吧！」。点运行看对话！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"用「控制角色」积木让两个伙伴都开口说话"},{id:3,title:"点运行，看二零和三七聊天"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_control_actor">
          <field name="ACTOR">erling</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">三七，你来啦！</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
              <next>
                <block type="maker_control_actor">
                  <field name="ACTOR">sanqi</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">二零，今天玩什么？</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                      <next>
                        <block type="maker_control_actor">
                          <field name="ACTOR">erling</field>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><shadow type="text"><field name="TEXT">我们来编程吧！</field></shadow></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
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
  </xml>`,cast:["sanqi"]},{slug:"a_day",category:"story",title:"跟着二零过一天",ageGroup:"6-8 岁",description:"切换不同场景，用编程讲完二零从早到晚的一天。",missionBrief:"用场景切换，给小伙伴讲讲二零的一天：早上在明亮的白天醒来，白天去学校学编程，晚上回到夜晚的家睡觉。",erLingHint:"① 拖绿色「当开始运行」；② 放「切换场景 白天」+「说 早上好！太阳升起啦」；③ 放「切换场景 学校」+「说 去学校学编程」，再「切换场景 夜晚」+「说 晚上回家睡觉」。点运行过一天！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"切换至少两个场景，讲完一天的经过"},{id:3,title:"点运行，跟二零过一天"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_set_scene">
          <field name="SCENE">day</field>
          <next>
            <block type="maker_say">
              <value name="TEXT"><shadow type="text"><field name="TEXT">早上好！太阳升起啦</field></shadow></value>
              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
              <next>
                <block type="maker_set_scene">
                  <field name="SCENE">school</field>
                  <next>
                    <block type="maker_say">
                      <value name="TEXT"><shadow type="text"><field name="TEXT">去学校学编程</field></shadow></value>
                      <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                      <next>
                        <block type="maker_set_scene">
                          <field name="SCENE">night</field>
                          <next>
                            <block type="maker_say">
                              <value name="TEXT"><shadow type="text"><field name="TEXT">晚上回家睡觉</field></shadow></value>
                              <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
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
  </xml>`,cast:["sanqi"]},{slug:"magic_show",category:"story",title:"神奇魔术秀",ageGroup:"6-8 岁",description:"用「隐藏角色 / 显示角色」积木，让三七变没又变回来。",missionBrief:"魔术师二零要表演魔术！写一个程序：当开始运行时，让二零先喊一声，然后让伙伴三七「藏起来」，再「变出来」。",erLingHint:"① 拖绿色「当开始运行」；② 放「说 看我变魔术！」，再放「隐藏角色 三七」+「说 三七不见啦！」；③ 放「显示角色 三七」+「说 三七又回来啦！」。点运行看魔术！",steps:[{id:1,title:"用「当开始运行」事件启动程序"},{id:2,title:"让一个伙伴先藏起来再变出来（隐藏 + 显示）"},{id:3,title:"点运行，看神奇的魔术"}],defaultXml:`<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="maker_when_start" x="40" y="40">
      <statement name="STACK">
        <block type="maker_say">
          <value name="TEXT"><shadow type="text"><field name="TEXT">看我变魔术！</field></shadow></value>
          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
          <next>
            <block type="maker_hide_actor">
              <field name="ACTOR">sanqi</field>
              <next>
                <block type="maker_say">
                  <value name="TEXT"><shadow type="text"><field name="TEXT">三七不见啦！</field></shadow></value>
                  <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
                  <next>
                    <block type="maker_show_actor">
                      <field name="ACTOR">sanqi</field>
                      <next>
                        <block type="maker_say">
                          <value name="TEXT"><shadow type="text"><field name="TEXT">三七又回来啦！</field></shadow></value>
                          <value name="SECONDS"><shadow type="math_number"><field name="NUM">1.5</field></shadow></value>
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
  </xml>`,cast:["sanqi"]}];e.s(["CATEGORIES",0,a,"projects",0,l],94757);let m=new Set(["light_lanterns","treasure_map","escort"]);for(let e of l){if(m.has(e.slug))continue;if(e.stars)for(let t of e.stars)t.x=-t.x;let t=e.scene?.marks;if(t)for(let e of t)e.x=-e.x;let a=e.scene?.clouds;if(a)for(let e of a)e.x=-e.x}function o(e){return l.find(t=>t.slug===e)}function n(e){let a=t.find(t=>t.id===e);return a?a.projectSlugs.map(e=>o(e)).filter(e=>!!e):[]}e.s(["getCategoryLabel",0,function(e){for(let t of Object.keys(a)){let l=a[t].find(t=>t.id===e);if(l)return l.shortTag}return e},"getNextProject",0,function(e){for(let a of t){let t=n(a.id),l=t.findIndex(t=>t.slug===e);if(l>=0&&l<t.length-1)return t[l+1]}},"getProject",0,o,"getStageOfProject",0,function(e){return t.find(t=>t.projectSlugs.includes(e))},"getStageProjects",0,n],30684)}]);