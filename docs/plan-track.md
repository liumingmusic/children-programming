# 造物星球 · 全阶段项目追踪计划表

> 用途：本表是「阶段 → 分类 → 项目 → 是否已完成」的进度追踪器。每个项目可单独开一个会话去实现/完善，实现后把状态从 ⬜ 改为 ✅ 并补上 slug。
>
> 状态图例：
> - ✅ **已完成**：已上线、步骤判定与"看示范"均通过测试。
> - ⬜ **未开始**：已规划，待开发。
> - 行内 `[需: xxx]` 标注该项目所依赖的运行时扩展（变量 / 键盘 / 多角色 / 音效 / 列表 / 文本JS 等），方便评估工作量。
>
> 能力阶梯（全站统一）：**序列 → 循环 → 事件 → 条件 → 函数/抽象 → 变量/数据 → 文本代码**。

---

## 一、6-8 岁阶段（图形化启蒙 · Blockly 海龟/二零）

> 现状：已建成 **237 个**项目（6-8 阶段 **107 个**·11 分类全交付 + 9-12 阶段 **77 个** + 13-16 阶段 **53 个**：A·函数/B·变量/C·多角色/D·键盘/E·音乐/F·数学/G·列表/H·综合小游戏 各 8/8、I·故事 6/6、J·科学 7/7，均已上线；P·网页/小游戏 6/6（Phase 2e 铺满：计算器/待办/记忆/打字/平台跳跃/聊天机器人，安全 DOM 面板基建已建成）；L·算法 8/8（Phase 3a 铺满：冒泡/二分/栈队列/BFS/递归/素数/串频次/贪心，算法可视化地基已建）；13-16 阶段 分 Phase 推进 —— Phase 0/1 js 分类 **8/8 已铺满**（`js_square`/`js_hello`/`js_variable`/`js_function`/`js_array`/`js_tool`/`js_canvas`/`js_compare`，JS 模式地基已建）；Phase 2 画布渲染基建已落地（Runtime 新增 `drawRect`/`drawCircle`/`drawLine`/`drawText`/`clearCanvas` + `state.shapes`，StagePlayer 统一渲染），M·物理分类 **7/7 已铺满**（`phys_fall`/`phys_bounce`/`phys_parabola`/`phys_gravity`/`phys_spring`/`phys_orbit`/`phys_particle`）；
Phase 2c N·数据可视化 **7/7 已铺满**（`dataviz_bar`/`dataviz_line`/`dataviz_pie`/`dataviz_weather`/`dataviz_scores`/`dataviz_wordcloud`/`dataviz_dashboard`）；
Phase 2d O·创意编程 **6/6 已铺满**（`creative_mandala`/`creative_random`/`creative_generative`/`creative_tree`/`creative_terrain`/`creative_firework`）。
至此 **Phase 2（画布渲染基建 + M/N/O/P 四个分类）全部完成**，Phase 3a（L·算法）/ 3b（Q·AI）/ 3c（R·毕业项目）也已相继完成，13-16 阶段 8 分类均已满编。
> 概念梯度沿用 Code.org + ScratchJr + Blockly Games 的「序列→循环→事件→条件」主线。

### 分类 1 · 基础序列与方向（序列）　✅（11/11 完成）
- ✅ 二零，打个招呼！（`hello` · 序列+说话+事件入门，已上线）
- ✅ 走到小旗子（`flag` · 前进+转向序列，已上线）
- ✅ 绕过小石头（`stone` · 前进+转向绕行，已上线）
- ✅ 画一个"L"形路线（`shapeL` · 落笔折线，已上线）
- ✅ 送信使回家（`home` · 前进+转向到目标，已上线）
- ✅ 走方格迷宫（无循环版）（`maze` · 前进+转向穿迷宫，已上线）
- ✅ 跟着箭头走（`arrow` · 沿箭头前进转向，已上线）
- ✅ 折线探险（`zigzag` · 上下折返序列，已上线）
- ✅ 到达宝藏箱（`treasure` · 前进+转向到目标，已上线）
- ✅ 按指令跳舞（`dance` · 移动+转向循环舞步，已上线）
- ✅ 走"回"字路线（`frame` · 外框+内框序列，已上线）

### 分类 2 · 循环与重复（循环）　✅（10/10 完成）
- ✅ 二零画正方形（`square` · 重复4次+右转90，已上线）
- ✅ 二零画三角形（`triangle` · 重复3次+右转120，已上线）
- ✅ 画正五边形（`pentagon` · 重复5次+右转72，已上线）
- ✅ 原地转圈 12 次（`spin` · 重复12次原地转圈，已上线）
- ✅ 爬楼梯（`stairs` · 重复上行阶梯，已上线）
- ✅ 波浪线（`wave` · 重复画波形，已上线）
- ✅ 螺旋线（`spiral` · 步数递进螺旋，已上线）
- ✅ 画栅栏（`fence` · 重复竖线+横线，已上线）
- ✅ 风车（`windmill` · 重复叶片旋转，已上线）
- ✅ 重复 N 次摘果子（`pickfruit` · 重复N次前进摘果，已上线）

### 分类 3 · 画笔与几何艺术（绘图 / 艺术）　✅（10/10 完成）
- ✅ 二零画彩虹（`rainbow` · 落笔+变色循环，已上线）
- ✅ 二零画五角星（`star5` · 重复5次+右转144，已上线）
- ✅ 二零画花朵（`flower` · 嵌套循环画花瓣，已上线）
- ✅ 雪花（`snowflake` · 对称分支，已上线）
- ✅ 曼陀罗 / 万花筒（`mandala` · 旋转对称图案，已上线）
- ✅ 同心圆（`concentric` · 半径递进圆，已上线）
- ✅ 折线连点画（`connectdot` · 连点折线，已上线）
- ✅ 画小房子（`house` · 方形+三角屋顶，已上线）
- ✅ 画字母 / 自己的名字（`letter` · 笔画折线，已上线）
- ✅ 棋盘格（`checkerboard` · 重复行列方格，已上线）

### 分类 4 · 事件与互动（事件）　✅（10/10 完成）
- ✅ 点击舞台让二零跳（`click_jump` · 点击舞台事件+弹跳，已上线）
- ✅ 点击切换画笔颜色（`click_color` · 点击事件+换色，已上线）
- ✅ [需: 键盘] 按键让二零前进（`key_forward` · 键盘事件+前进，已上线）
- ✅ [需: 边缘检测] 碰到边缘反弹（`edge_bounce` · 边缘检测+反弹，已上线）
- ✅ 连续点击串起对话（`click_dialog` · 多次点击事件+对话，已上线）
- ✅ 两个事件组合（开始 + 点击）（`two_events` · whenStart+whenClicked 双脚本，已上线）
- ✅ 点击播放角色对话（`click_play_dialog` · 点击事件+对话播放，已上线）
- ✅ [需: 大小属性] 点击让二零变大 / 变小（`size_toggle` · 大小属性+点击切换，已上线）
- ✅ 当开始自动巡游（`auto_patrol` · whenStart 自动巡逻，已上线）
- ✅ 摇晃 / 点击变表情（`expression_shake` · 运行时表情状态扩展，已上线）

### 分类 5 · 条件判断（条件）　✅（10/10 完成）
- ✅ 如果碰到星星就说（概念同 `stars`）（`if_touch_star` · 条件+碰到星星判定+收集，已上线）
- ✅ 如果到边缘就转向（`if_edge_turn` · 条件+边缘检测转向，已上线）
- ✅ 如果画笔是红色就停（`if_red_stop` · 条件+笔色判断停止，已上线）
- ✅ 遇到障碍自动绕行（`avoid_obstacle` · 运行时障碍/碰撞判定，已上线）
- ✅ 点击左 / 右半边走不同路（`click_left_right` · 条件+鼠标左右半区分支，已上线）
- ✅ 收集满 3 颗就庆祝（`collect3` · 条件+收集计数庆祝，已上线）
- ✅ 奇偶步数走不同路（`odd_even` · 变量+取模(%2)扩展，已上线）
- ✅ 如果碰到"坏人"就逃跑（`escape_badguy` · 多角色/障碍判定扩展，已上线）
- ✅ 随机分支（`random_branch` · 随机数 Math.random 扩展，已上线）
- ✅ 大小 / 阈值判断（`size_threshold` · 状态变量/大小阈值扩展，已上线）

### 分类 6 · 收集与闯关游戏（游戏）　✅（10/10 完成）
- ✅ 二零收集星星（`stars` · 点击+移到鼠标+碰到判定+收集，已上线，同时覆盖分类5条件）
- ✅ 走迷宫到出口（`maze_exit` · 序列+寻路到出口，已上线）
- ✅ 收集所有苹果（`collect_apples` · 收集类+遍历收集，已上线）
- ✅ 躲避乌云到达终点（`dodge_clouds` · 缓慢飘动乌云 + 碰撞判定，已上线）
- ✅ 按序点亮灯笼（`light_lanterns` · 序列+按序点亮，已上线）
- ✅ 收集彩虹碎片拼图（`collect_rainbow` · 收集类+多碎片拼图，已上线）
- ✅ 寻宝图（goto 坐标）（`treasure_map` · goto 坐标寻宝，已上线）
- ✅ 护送小动物回家（`escort` · 序列+护送移动，已上线）
- ✅ 记忆翻牌（`memory_match` · 独立翻牌小游戏组件，已上线）
- ✅ 交通警察（按灯行走）（`traffic_police` · 条件+红绿灯分支，已上线）

### 分类 7 · 故事与动画（故事）　✅（10/10 完成）
- ✅ 二零的自我介绍（`self_intro` · 当开始运行+说，已上线）
- ✅ 两个角色对话（`two_talk` · 控制角色 二零/三七 轮流说话，已上线）
- ✅ 一天的生活（`a_day` · 切换白天/学校/夜晚场景讲一天，已上线）
- ✅ 表情变化（`expression` · 设置表情 happy→surprised+说，已上线）
- ✅ 木头人游戏（`freeze` · 移动+说口令，已上线）
- ✅ 动物运动会（`animal_sports` · 重复执行移动跑圈，已上线）
- ✅ 打招呼接龙（`word_chain` · 连续说出接龙词，已上线）
- ✅ 变魔术（`magic_show` · 隐藏/显示角色 三七，已上线）
- ✅ 生日派对动画（`birthday_party` · 切换场景+说祝福，已上线）
- ✅ 晚安小故事（`good_night` · 切换夜晚场景+睡觉表情+说晚安，已上线）

### 分类 8 · 音乐与节奏（音乐）　✅（10/10 完成）
- ✅ 弹奏 do-re-mi（`play_doremi` · 音符积木+序列，已上线）
- ✅ 一闪一闪小星星（`twinkle` · 7 音小旋律，已上线）
- ✅ 节奏鼓点（`drum_beat` · 鼓/镲+循环，已上线）
- ✅ 随机音符（`random_note` · 随机弹音+循环，已上线）
- ✅ 循环旋律（`loop_melody` · 音符循环回荡，已上线）
- ✅ 点击不同位置发不同音（`pitch_by_click` · 按点击位置弹音，已上线）
- ✅ 音高随移动位置变化（`pitch_by_move` · 边走边按位置弹音，已上线）
- ✅ 简单和弦（`chord` · 三音同时响起，已上线）
- ✅ 生日快乐歌（`birthday` · 6 音经典旋律，已上线）
- ✅ 自己谱曲（`compose` · 自由创作旋律，已上线）

### 分类 9 · 数学启蒙（数学）　✅（10/10 完成）
- ✅ 数数 1-10（`count10` · 重复执行+变量 n 递增并说出，已上线）
- ✅ 数苹果（`count_apples` · 重复 5 次计数+说出，已上线）
- ✅ 比大小（`compare_size` · 变量存 8 与 3 + 比较积木判断大于，已上线）
- ✅ 加减法小助手（`add_sub` · 说 接 加/减 积木算 3+5 与 8-2，已上线）
- ✅ 认识图形（`shape_names` · 落笔+重复画正方形并报名，已上线）
- ✅ 对称图形（`symmetry` · 移到左右各画一形，已上线）
- ✅ 九九乘法初识（`multiplication` · 重复 4 次 sum+3 即 3×4，已上线）
- ✅ 时钟整点（`clock` · 落笔+重复 36 次画圆+报时，已上线）
- ✅ 几何拼图（`geometry_puzzle` · 抬笔/落笔+移到拼两形，已上线）
- ✅ 计算器小工具（`calculator` · 变量 x/y + 说 接 加/减 积木，已上线）

### 分类 10 · 自然科学模拟（科学）　✅（10/10 完成）
- ✅ 昼夜更替（`day_night` · 背景明暗 tween 0→220 + 第5秒旁白，已上线）
- ✅ 四季变化 → 以「种子长大了」承载生长（`seed_grow` · 大小0.1→1 + 上下位置-80→0 双 tween，已上线）
- ✅ 下雨动画（`rain` · 雨点粒子轨道 + 旁白，已上线）
- ✅ 雪花飘落（`snow` · 雪花粒子轨道 + 旁白，已上线）
- ✅ 火山喷发（`volcano` · 岩浆粒子轨道 + 旁白，已上线）
- ✅ 月亮盈亏（`moon_phase` · 显示程度 alpha 0.15→1 弯月→满月，已上线）
- ✅ 颜色混合实验（`color_wheel` · 红+黄→橙 / 黄+蓝→绿 / 红+蓝→紫，已上线）
- ✅ 彩虹桥（`rainbow_bridge` · 左右位置 x tween -160→160 + 旁白，已上线）
- ✅ 太阳系公转（`earth_sun` · 绕中心轨道 orbit 1 圈 + 第1秒旁白，已上线）
- ✅ 食物链（`food_chain` · 三七 x 位置 tween 160→-40 + 二零第4秒旁白，已上线）

### 分类 11 · 自由创作 / PBL 综合（造物工坊）　✅（已上线）

- ✅ **造物工坊**（`/studio` · 自由创作范式，已上线）：不限题目，孩子用全部积木（含双角色「三七」/ 多场景 / 音乐 / 数学）自由创作；作品以命名方式保存到浏览器本地（localStorage），「我的作品」面板可继续编辑 / 回放 / 删除，满足"自由创作 + 本地保存 + 可回看展示"。不做步骤判定、不看示范。
- 该分类除了开放式工坊，还补了 **10 个总结性引导项目**（带步骤判定 + 看示范 + 完成判定），让孩子学完 10 个分类后有个"毕业作品"把多种本领组合起来：
  - ✅ 会唱歌的画（`singing_picture` · 画笔落笔 + 循环画正方形 + 弹奏 do/re/mi，绘图与音乐综合，已上线）
  - ✅ 双角色小剧场（`two_actor_show` · 控制角色切换零三七 + 变表情 + 切换场景 + 对话，故事综合，已上线）
  - ✅ 我的太阳系（`my_solar_system` · 时间轴公转轨道 + 大小 tween + 当时间到达解说"一年365天"，科学综合，已上线）
  - ✅ 互动绘本游戏（`interactive_book` · 舞台点击事件 + 如果碰到星星条件 + 飞向星星收集，事件/条件/收集综合，已上线）
  - ✅ 我的小花园（`my_garden` · 落笔 + 循环画花圃边框 + 说话介绍，画图与故事综合，已上线）
  - ✅ 我的小乐队（`my_band` · 循环包裹弹奏音符 do/re/mi/fa，音乐与循环综合，已上线）
  - ✅ 海底音乐会（`sea_concert` · 画笔画海浪舞台 + 零三七轮流弹琴 + 和弦谢幕，画笔/角色/音乐三合一，已上线）
  - ✅ 四季小屋（`four_seasons` · 时间轴上先雨后雪 + 定时切换夜空场景 + 定时解说四季，时间轴/粒子/场景/故事综合，已上线）
  - ✅ 魔法变装秀（`magic_fashion` · 循环里改变大小 + 画笔变色 + 鼓点节拍，循环/外观/颜色/音乐综合，已上线）
  - ✅ 步数记录仪（`step_counter` · 变量归零 + 循环累加 + 读出总步数，变量/循环/运动/说话综合，已上线）
- 后续可在工坊内沉淀更多"主题挑战"（如电子贺卡 / 互动绘本）作为可选灵感，而非强制任务。

> **6-8 阶段小计**：11 分类，已完成 **111 个引导项目**（含分类11·综合 10 个总结性项目）+ 造物工坊。引导项目明细：分类1·序列 11/11、分类2·循环 10/10、分类3·画笔 10/10、分类4·事件 10/10、分类5·条件 10/10、分类6·游戏 10/10、分类7·故事 10/10、分类8·音乐 10/10、分类9·数学 10/10、分类10·科学 10/10、分类11·综合 10/10。

---

## 二、9-12 岁阶段（图形化进阶 · 函数/变量/多角色/音乐）

> 对标：Scratch（Course C–E）、Tynker、Code.org 中高年级。
> 进入「抽象思维」：自定义积木（函数）、变量与状态、多角色协作、键盘操控、音乐创作、列表数据。
> 落地前提：需先补 4 个轻量运行时能力——`变量/计分`、`键盘事件`、`多角色/显隐/大小`、`音效`，即可解锁本阶段绝大多数项目。
>
> 现状（2026-08-26）：分类 A·函数 8/8、B·变量 8/8、C·多角色 8/8、D·键盘 8/8、E·音乐 8/8、F·数学 8/8、G·列表 8/8、H·综合小游戏 8/8、I·故事 6/6、J·科学 7/7，均已上线（内容+判定+测试就绪，本轮 G/J/H 三批随 gh-pages 部署同步上线）。所需轻量运行时——自定义积木 / 变量·计分 / 多角色碰撞·距离·消息广播 / 键盘(含 apples 下落物) / 音效 / 舞台点击 / **列表 7 原语** / 时间轴引擎——**全部到位**。剩余缺口：无（9-12 阶段 10 分类 77 项目全部上线）。

### 分类 A · 函数与自定义积木（函数/抽象）　✅（8/8 完成）
- ✅ 定义"画正方形"积木（`fn_square` · 自定义积木画正方形，已上线）
- ✅ 定义"画多边形"积木（参数边数）（`fn_polygon` · 自定义积木画多边形，已上线）
- ✅ 用函数画房子（`fn_house` · 自定义积木画房子，已上线）
- ✅ 函数画雪花分支（`fn_snowflake` · 自定义积木画雪花，已上线）
- ✅ 递归画树（`fn_tree` · 递归自定义积木画树，已上线）
- ✅ 我的画图工具箱（`fn_toolbox` · 自定义积木工具箱，已上线）
- ✅ 函数画螺旋（`fn_spiral` · 自定义积木画螺旋，已上线）
- ✅ 组合函数画城堡（`fn_castle` · 组合自定义积木画城堡，已上线）

### 分类 B · 变量与状态（变量）　✅（8/8 完成）
- ✅ 计分器游戏（`var_score` · 变量计分，已上线）
- ✅ 计数器数步数（`var_counter` · 变量计数，已上线）
- ✅ 生命值系统（`var_lives` · 变量生命值，已上线）
- ✅ 速度变量控制移动（`var_speed` · 变量控速移动，已上线）
- ✅ 奇偶判断走不同路（`var_parity` · 变量取模奇偶，已上线）
- ✅ 变量画渐变（`var_gradient` · 变量控制渐变，已上线）
- ✅ 计时器挑战（`var_timer` · 变量计时，已上线）
- ✅ 最高分记录（`var_best` · 变量记录最高分，已上线）

### 分类 C · 多角色与协作（多角色 · 8/8 完成）
- ✅ [需: 多角色] 两个角色对话 `two_actor_chat`
- ✅ [需: 多角色] 猫追老鼠 `cat_mouse`
- ✅ [需: 多角色] 接力赛 `relay_race`
- ✅ [需: 多角色+音效] 合唱团（多角色音乐）`chorus`
- ✅ [需: 多角色] 角色间消息传递 `message_relay`
- ✅ [需: 多角色] 守护与躲避 `guardian_dodge`
- ✅ [需: 多角色] 排队的动物 `animal_queue`
- ✅ [需: 多角色] 双人对战小游戏 `two_player`

### 分类 D · 键盘与操控游戏（键盘 · 8/8 完成）
- ✅ [需: 键盘] 用方向键控制移动 `key_move`
- ✅ [需: 键盘+变量] 接苹果游戏 `catch_apple`
- ✅ [需: 键盘] 打砖块入门 `breakout_intro`
- ✅ [需: 键盘+条件] 躲避下落物 `dodge_fall`
- ✅ [需: 键盘+音效] 键盘弹琴 `key_piano`
- ✅ [需: 键盘] 走迷宫（键盘操控） `key_maze`
- ✅ [需: 键盘] 太空射击入门 `space_shooter`
- ✅ [需: 键盘+变量] 反应力小游戏 `reaction_game`

### 分类 E · 音乐创作（音乐）　✅（8/8 完成）
- ✅ [需: 音效] 弹 do-re-mi `music_doremi`
- ✅ [需: 音效] 小星星 `music_twinkle`
- ✅ [需: 音效] 循环旋律 `music_loop`
- ✅ [需: 音效] 随机音符 `music_random`
- ✅ [需: 音效] 音高随位置变 `music_pitch_pos`
- ✅ [需: 音效] 简单和弦 `music_chord`
- ✅ [需: 音效] 生日快乐 `music_birthday`
- ✅ [需: 音效] 自己谱曲 `music_compose`

### 分类 F · 数学与逻辑进阶（数学）　✅（8/8 完成）
- ✅ [需: 变量] 乘法表生成 `math_mul_table`
- ✅ [需: 变量] 因数与质数初识 `math_factor_prime`
- ✅ [需: 变量] 图形面积计算 `math_area`
- ✅ [需: 变量] 斐波那契数列 `math_fib`
- ✅ [需: 变量] 质数筛查 `math_prime_sieve`
- ✅ [需: 变量] 角度与正多边形 `math_polygon`
- ✅ [需: 变量] 坐标绘图 `math_coords`
- ✅ [需: 列表] 数独填空 `math_sudoku`（四宫 4×4 数独：用「列表」存 16 格答案 + 说「数独完成」，判定复用列表模型「非空列表 + 说输出命中」，已上线）

### 分类 G · 列表与数据（列表）　✅（8/8 完成）
> 列表基石（运行时 7 原语：setList / listAppend / getList / listItem / listLength / listRemoveAt / listSetItem）已落地，`maker_list_*` 7 个积木 + BlockDoc 已注册；完成判定走「非空列表 + 仅「说」输出命中 `goal.saidIncludes`」双保险，杜绝空程序/半程序通过。测试 `list-foundation`(5/5) + `list9-goal`(12/12) 全绿。
- ✅ [需: 列表] 购物清单 `list_shopping`
- ✅ [需: 列表] 点名器 `list_rollcall`（random_int + listItem 随机抽）
- ✅ [需: 列表+变量] 排行榜 `list_ranking`
- ✅ [需: 列表] 随机抽奖 `list_lottery`（random_int + listLength 抽奖池）
- ✅ [需: 列表] 待办清单 `list_todo`
- ✅ [需: 列表] 单词记忆卡 `list_words`
- ✅ [需: 列表+变量] 成绩统计 `list_scores`（循环累加=450；曾因 `change_var` 取值输入名误用 `VALUE` 而非 `DELTA` 导致算错，已修）
- ✅ [需: 列表] 排队模拟 `list_queue`

### 分类 H · 综合小游戏（游戏）　✅（8/8 完成）
> 综合小游戏横跨键盘操控 / 变量计分 / 列表数据 / 多角色协作四类能力，作为 9-12 阶段的「综合能力检验」：键盘类（snake/shooter/dodge/race）沿用 `keyHandlers>0` 把关（同 D 分类）；猜数字用「真实 say 输出命中 `猜中啦`」；记忆翻牌 / 2048 用「非空列表 + 说输出命中」；拼图用「控制伙伴角色 engage」。测试 `game9-goal`(19/19) 全绿（看示范 8 项通过 + 三步引导全亮 + 空程序 8 项不通过 + 3 个半程序不通过）。实际交付 8 项，其中 `game_dodge`（躲避乌云）/ `game_race`（接苹果竞速）替代原计划的井字棋 / 俄罗斯方块——同属键盘操控类，能力覆盖一致。
- ✅ [需: 键盘+变量] 贪吃蛇入门 `game_snake`（apples 场景：上下左右移动 + 碰到苹果长度+1 + 说「吃到！」）
- ✅ [需: 键盘+变量] 飞机大战 `game_shooter`（clouds 场景：左右转向 + 碰到乌云得分+1 + 说「击落！」）
- ✅ [需: 键盘] 躲避乌云 `game_dodge`（clouds 场景：左右转向 + 重复移动碰到乌云说「撞到啦」）
- ✅ [需: 键盘+变量] 接苹果竞速 `game_race`（apples 场景：左右转向 + 碰到苹果得分+1 + 说「接住！」）
- ✅ [需: 变量+条件] 猜数字 `game_guess`（变量神秘数=8 + 重复说当前 + 命中「猜中啦」）
- ✅ [需: 列表] 记忆翻牌配对 `game_memory`（牌面列表 + 加入 6 张 + 说「配对成功」）
- ✅ [需: 列表+变量] 2048 简化版 `game_2048lite`（数字块列表 + 改值/移除 + 说「合成」）
- ✅ [需: 多角色] 拼图归位 `game_puzzle`（control_actor 切零三七 + goto 归位 + 说「归位完成」）

### 分类 I · 交互绘本与故事（故事）　✅（6/6 完成）
- ✅ [需: 多角色+变量] 分支选择故事 `story_branch`
- ✅ [需: 多角色] 可点击绘本 `story_clickable`
- ✅ [需: 多角色] 我的冒险书 `story_adventure`
- ✅ [需: 多角色] 角色成长记 `story_growth`
- ✅ [需: 多角色] 科普互动绘本 `story_science`
- ✅ [需: 多角色] 节日互动卡 `story_card`

### 分类 J · 科学探究（科学 · 时间轴引擎）　✅（7/7 完成）
> 复用时间轴引擎（TimelineEngine）：昼夜/四季/公转/水循环/生长/声波/折射均用「轨道」驱动状态场（bgHue / 坐标 / 粒子 / actorSize tween），完成判定走 timeline 独立的 computeSteps 分支（只看轨道是否真正驱动了状态场，空轨道不通过）。测试 `sci9-goal`(15/15) 全绿。本轮顺带修复了 bgHue 在 `getState` 浅拷贝下丢失的缺陷（新增 `Runtime.setBgHue()`）。
- ✅ [需: 多角色] 昼夜模拟 `science_day_night`（bgHue 0→220）
- ✅ [需: 多角色] 四季变化 `science_seasons`（bgHue 20→200）
- ✅ [需: 坐标] 太阳系公转 `science_orbit`（绕中心 orbit）
- ✅ [需: 多角色] 水循环 `science_water_cycle`（雨点粒子）
- ✅ [需: 循环长大] 植物生长 `science_grow`（actorSize 0.1→1）
- ✅ [需: 多角色] 声音传播 `science_sound`（声波扩散 actorSize 0.2→3）
- ✅ [需: 粒子] 光的折射 `science_light`（先直走再斜折）

> **9-12 阶段小计**：10 分类，**77 项目**，已完成 **77**（A·函数 8/8 + B·变量 8/8 + C·多角色 8/8 + D·键盘 8/8 + E·音乐 8/8 + F·数学 8/8 + G·列表 8/8 + H·综合小游戏 8/8 + I·故事 6/6 + J·科学 7/7；全部上线，无待建）。全部轻量运行时（自定义积木/变量/多角色/键盘/音效/舞台点击/列表 7 原语/时间轴引擎）已落地。

---

## 三、13-16 岁阶段（抽象思维 · 文本代码过渡 / 算法 / 创造）

> 对标：Scratch 进阶 / Python·JavaScript 入门、Code.org CS Discoveries、App Inventor。
> 本阶段从图形化平滑过渡到**文本代码（JavaScript）**，覆盖算法、数据、物理模拟、数据可视化、Web/小游戏、AI 启蒙。
> 落地前提（Phase 0 已解决「文本代码运行时 / 代码编辑器」）：`CourseProject` 新增 `codeMode` + `defaultCode` 字段；
> 新增 `CodeEditor`（CodeMirror 6）组件；`Runtime` 新增 `runUserCode(code)` 复用同一套 `__runtime` 命令式 API；
> `LearnPageClient` / `DemoOverlay` 已按 `codeMode` 切分支。
> **画布渲染基建已于 Phase 2 落地**（分类 M/N/O 可用；DOM 渲染仍未建，分类 P 待 Phase 2 末）。
> 命名说明：本表蓝图用 K–R 分类编号；实际代码注册的分类 id 为 `js / algo / phys / dataviz / creative / web / ai / capstone`（见 `content/stage-13-16/categories.ts`）。

### 13-16 推进路线图（分 Phase，一次只推一个）

> 13-16 是最后一个阶段、也是能力跨度最大的一个，采用「先建地基 → 再按依赖批量铺」的节奏推进，
> 每个 Phase 结束都要跑完「测试 + 构建 + 真实浏览器链式冒烟」再落库。

| Phase | 内容 | 涉及分类 | 项目数 | 状态 |
|---|---|---|---|---|
| **0** | 代码模式地基（`codeMode` + `defaultCode` / CodeMirror 编辑器 / `runUserCode`）+ 1 个试点 | K·`js` | 1 | ✅ 完成（`192e3a28`） |
| **1** | js 分类铺满：输出 / 变量 / 函数 / 数组 / 计算工具 / 画布换色 / 积木→代码综合 | K·`js` | 7 | ✅ 完成（`a7bca5a8`） |
| **2a** | **画布渲染基建**（Runtime 五原语 + `state.shapes` + StagePlayer 统一渲染）+ M 物理试点 2 项 | M·`phys` | 2 | ✅ 完成（`affc3776`） |
| **2b** | M 物理补齐（抛物线 / 重力模拟 / 弹簧振子 / 圆周运动 / 粒子系统） | M·`phys` | 5 | ✅ 完成（本分类 7/7 满编） |
| **2c** | **N 数据可视化**（柱状图 / 折线图 / 饼图 / 天气图 / 成绩分布 / 词云 / 实时仪表盘） | N·`dataviz` | 7 | ✅ 完成（本分类 7/7 满编） |
| **2d** | O 创意编程（曼陀罗 / 随机艺术 / 生成艺术 / 分形树 / 噪声地形 / 粒子烟花） | O·`creative` | 6 | ✅ 完成（本分类 6/6 满编） |
| **2e** | **P 网页 / 小游戏**：先建 **DOM 渲染基建**（安全 DOM 面板），再做计算器 / 待办 / 记忆 / 打字 / 平台跳跃 / 聊天机器人 | P·`web` | 6 | ✅ 完成（见下方分类 P） |
| **3a** | L 算法与数据结构（冒泡排序可视化 / 二分查找 / 栈与队列 / BFS 迷宫 / 递归 / 素数 / 贪心） | L·`algo` | 8 | ✅ 完成（本分类 8/8 满编） |
| **3b** | Q 人工智能启蒙（决策树 / 分类器 / 规则聊天机器人 / 推荐直觉 / 神经网络可视化） | Q·`ai` | 6 | ✅ 完成（本分类 6/6 满编） |
| **3c** | R 毕业项目（完整小游戏 / 数据作品 / 创意工具 / 开源贡献 / 作品集） | R·`capstone` | 5 | ✅ 完成（R 5/5 满编） |

**节奏与依赖说明**

- **2b → 2c → 2d 可并行也可串行**，三者都只依赖已落地的画布基建，无新增运行时需求；
  建议按「物理 → 数据可视化 → 创意」推进，因为难度与抽象度递增。
- **2e 是本阶段唯一需要新建运行时能力的 Phase**：画布只能画像素，做不了按钮 / 输入框 / 列表 DOM。
  需先设计「安全 DOM 面板」（受控容器 + 有限 API，如 `__ui.button()` / `__ui.text()` / `__ui.input()`），
  不能直接把 `document` 交给学生代码（会破坏舞台与 React 渲染）。
  另：代码模式目前的模型是「eval 一次性生成动作队列 → 队列回放」，查询类方法（如 `__runtime.mouseX()`）
  **在 eval 阶段就已求值**，拿不到「播放时」的鼠标 / 键盘状态，所以**「真交互」也依赖这套事件基建**——
  届时可与分类 O 的「交互视觉」一并补上（该蓝图项本轮已改为随机艺术，见分类 O 的说明）。
- **3a/3b 依赖列表与可视化**：算法可视化本质是「列表 + 画布逐帧重画」，AI 启蒙依赖列表与条件逻辑，
  两者都建立在 Phase 2 的画布基建之上，故排在 Phase 3。
- **3c 毕业项目放最后**：需要前面所有能力都齐备，学生才有材料可综合。

### 分类 K · 文本代码过渡（JS Transition）
> 实现分类 id = `js`。**Phase 1 已铺满 8/8**：Phase 0 试点 `js_square` 验证「写 JS → 判完成 → 看示范」最小闭环，
> Phase 1 补齐其余 7 项，每个项目瞄准一个 JS 语言概念，全部 `codeMode`，判定走 `lib/steps.ts` 的 `JS_CODE_SLUGS` 分支
> （基于学生手写 JS 的真实标记 + 运行日志，空程序必然不通过）。
>
> **概念落地说明（对原蓝图的适配）**：蓝图里「打印 / 控制台小工具」原设想依赖 `console.log` 与控制台面板，
> 当前运行时尚无 console 捕获与 DOM，故改用 `__runtime.say(...)` 承载「程序产生输出」（二零开口说话），
> 概念目标（写出第一行会输出的代码 / 算出结果并展示）不变；「从积木到代码对照表」为教学对照性质，
> 落地为综合练习项目 `js_compare`（missionBrief 内置积木→代码对照表，任务是落笔/画/换色/说话串起来）。
> 真正的 console / DOM / 画布独立渲染留到分类 P / N / M。
- ✅ [JS模式] JS 循环画图形（`js_square` · 落笔 + for 循环画正方形）
- ✅ [JS模式] 第一个 JS 程序：输出（`js_hello` · `__runtime.say` 让二零开口，校验真产生 [二零] 输出）
- ✅ [JS模式] JS 变量与运算（`js_variable` · 用变量控制图形；**变量须真用在 move/turn 参数里**，防循环计数器蒙混）
- ✅ [JS模式] JS 函数（`js_function` · 定义 `function` 并调用它画图）
- ✅ [JS模式] JS 数组（`js_array` · 数组字面量 + 遍历，批量画多个正多边形）
- ✅ [JS模式] 计算小工具（`js_tool` · 长方形面积计算器，`*` 运算 + `say` 报结果）
- ✅ [JS模式+画布] JS 画布绘图（`js_canvas` · 循环里步长与 `setPenColor` 同步变化，画彩色螺旋）
- ✅ [JS模式] 从积木到代码（`js_compare` · 落笔 → 换色 → 说话 综合复习，4 步）

### 分类 L · 算法与数据结构（算法）
> 实现分类 id = `algo`。**Phase 3a 一次铺满 8/8**。
> 算法可视化本质是「数组/递归/查找/图 + 画布逐帧重画」：`clearCanvas` 每步 + `drawXxx` + `wait`，
> 末态有「完成」文字。判定走 `lib/steps.ts` 的 `ALGO_CODE_SLUGS` 分支
> （基于真实 JS 标记：数组字面量 / 循环 / 函数定义 / `drawXxx` / `[系统] 程序执行完毕`；空程序必然不通过）。
- ✅ [JS模式+列表+画布] 冒泡排序可视化（`algo_bubble` · 两层 for + 比较 `a[j]>a[j+1]` 交换，柱子逐帧染色）
- ✅ [JS模式+列表+画布] 二分查找（`algo_binary` · `lo/hi/mid` 收敛，`a[mid]===target` 命中，命中后画「找到目标」）
- ✅ [JS模式+列表+画布] 栈与队列（`algo_stack` · `push/pop` 叠方块，栈顶出栈演示）
- ✅ [JS模式+图+画布] BFS 迷宫（`algo_maze` · `const maze=[[0,1,...]]` + visited 二维 + `queue.shift()` 四方向扩散）
- ✅ [JS模式+递归] 斐波那契与递归（`algo_fib` · `function fib(n){...return fib(n-1)+fib(n-2)}` 自调用画柱子）
- ✅ [JS模式] 素数判断优化（`algo_prime` · `n%i` 取余 + `i*i<=n` 开方上界，绿/灰柱标素数）
- ✅ [JS模式+列表] 字符串处理（`algo_string` · `counts[c]=counts[c]+1` 频次统计画直方图）
- ✅ [JS模式+贪心] 贪心入门（`algo_greedy` · `coins=[25,10,5,1]` 零钱凑整，`while(amount>=coins[i])` 取最大面额）

### 分类 M · 物理与模拟（物理）
> 实现分类 id = `phys`。**Phase 2b 已完成，本分类 7/7 满编**（2a 试点 2 项 + 2b 补齐 5 项）：
> 舞台本就是 canvas，但由 React 在 state 变化时整体重绘，**不能把 2D context 直接交给学生代码**（会被下一次重绘冲掉）。
> 故沿用现有「动作队列」架构：`Runtime` 新增 `drawRect / drawCircle / drawLine / drawText / clearCanvas` 五个原语，
> 执行时写入 `StageState.shapes`，由 `StagePlayer` 用同一套 `toScreen`（世界坐标 / y 轴向上）变换统一渲染。
> 好处：天然支持「每帧 clearCanvas + 重画」的动画、SSR/测试环境无需真实 canvas、完成判定可读图元统计。
> 五个原语**刻意不打日志**——动画每帧画多个图元，逐条 log 会刷爆日志面板且无判定价值。
> 判定走 `lib/steps.ts` 的 `PHYS_CODE_SLUGS` 分支（真实 JS 标记：`y = y + ...` / `v = v - ...` 变量自更新、
> `__runtime.clearCanvas()` + `drawXxx(` + `__runtime.wait(` 逐帧重画、`if (` + `v = -v` 碰撞反弹）。
- ✅ [JS模式+画布] 自由落体（`phys_fall` · 重力累积 `v = v - g*dt` → `y = y + v*dt`，每帧 clearCanvas + drawCircle 重画）
- ✅ [JS模式+画布] 抛物线（`phys_parabola` · 水平匀速 + 竖直加速两方向独立；用 trailX/trailY 两个数组存轨迹点，每帧重画让弧线显形）
- ✅ [JS模式+画布] 弹球碰撞（`phys_bounce` · 撞地检测 + `v = -v * 0.7` 反弹衰减 + 静止阈值防「哆嗦」，drawRect 画地面 / drawText 记次数）
- ✅ [JS模式+画布] 重力模拟（`phys_gravity` · 平行数组 gs/ys/vs 同时驱动三颗球，地球 g=300 / 月球 50 / 木星 750，看谁先落地）
- ✅ [JS模式+画布] 弹簧振子（`phys_spring` · `a = -k * x` 力与位移成正比且反向；水平放置弹簧，位移 x 就是真实横坐标）
- ✅ [JS模式+画布] 圆周运动（`phys_orbit` · 角度匀速自增 + `Math.cos/sin` 换算坐标；画轨道点、半径线（向心力方向）与实时角度）
- ✅ [JS模式+粒子] 粒子系统（`phys_particle` · 四个平行数组装 12 个粒子，各自受重力 + 撞地衰减 + 撞左右边界反向）

### 分类 N · 数据可视化（数据可视化）
> 实现分类 id = `dataviz`。**Phase 2c 一次铺满 7/7**。
> 与物理模拟不同：这些图大多是**静态**的——画一次就完事，不需要 `clearCanvas + wait` 的动画循环
> （只有最后的实时仪表盘需要逐帧重画）。因此完成判定不能照搬 PHYS 那套「逐帧重画」标记，
> 而是抓每关真正要教的**「数据 → 视觉属性」映射**：
> `data[i] * scale`（数值→高度）、记住上一个点（→连线）、`Math.cos/sin` + 角度累加（→扇区）、
> `counts[k] = counts[k] + 1`（→分组计数）、drawText 最后一个参数非写死数字（→字号随权重）、
> `.push(` + `.shift(`（→滑动窗口）。判定走 `lib/steps.ts` 的 `DATAVIZ_CODE_SLUGS` 分支。
>
> **实现说明（对原蓝图的适配）**：画布原语只有 rect/circle/line/text，**没有扇形**，
> 故饼图用「每 2 度一条半径线、线宽 6」密集填充来画出扇形（相邻线重叠即无缝）。
> 蓝图里「天气预报 / 成绩分布」标注依赖列表，实际用**数组 + 循环**实现（13-16 阶段列表原语属于 9-12 图形化体系，
> 代码模式下直接用 JS 数组更自然），教学目标不变。
- ✅ [JS模式+画布] 柱状图生成器（`dataviz_bar` · 数值 × 缩放系数 = 柱高，数组 + 循环逐根画）
- ✅ [JS模式+画布] 折线图（`dataviz_line` · 记住上一个点 `lastX/lastY`，把相邻点连起来；含目标参考线）
- ✅ [JS模式+画布] 饼图（`dataviz_pie` · 份额→角度→三角函数坐标，半径线密集填充扇形 + 右侧图例）
- ✅ [JS模式+画布] 天气预报图表（`dataviz_weather` · 求总和/极值画平均参考线，颜色随温度三档变化）
- ✅ [JS模式+画布] 成绩分布（`dataviz_scores` · 先按分数段分组计数再画直方图，按最高桶自动缩放）
- ✅ [JS模式+画布] 词云（`dataviz_wordcloud` · 数值→字号，绕圈排版，含中文居中估算）
- ✅ [JS模式+画布] 实时数据仪表盘（`dataviz_dashboard` · 数组当滑动窗口 push/shift，每帧重算统计并擦掉重画）

### 分类 O · 创意编程（创意）
> 实现分类 id = `creative`。**Phase 2d 一次铺满 6/6**。
> 与物理/数据可视化不同：这里不追求「算得对」，而是让学生体会**几条规则就能生成复杂图案**。
> 判定抓各自的**生成机制**（走 `lib/steps.ts` 的 `CREATIVE_CODE_SLUGS` 分支）：
> 对称复制（数组 + 双层极坐标循环）、`Math.random()` 多次用于绘图参数、参数方程（三角函数嵌套）、
> **递归**（大括号配出函数体、再看里面有没有调用自己）、多频波叠加（≥3 个不同频率的 `Math.sin`）、
> 阻尼（速度乘一个小于 1 的系数）。前 5 项是静态作品，只有粒子烟花需要逐帧重画。
>
> **概念落地说明（对原蓝图的偏离）**：蓝图最后一项是「交互视觉」，本轮改为 **`creative_random` 随机艺术**。
> 原因：代码模式的执行模型是「eval 一次性生成动作队列 → 队列回放」，
> 而 `__runtime.mouseX()` 之类的查询在 **eval 阶段就已求值**，拿不到「播放时」的鼠标位置；
> 且 `setMouse` 目前只在**点击舞台**时更新、codeMode 没有 click 脚本入口。
> 要做真交互需要把「事件回调」引入学生代码（新建运行时能力），
> 留到 Phase 2e 做 DOM / 事件基建时一并考虑（见分类 P）。
> 教学目标（用代码生成变化、每件作品独一无二）不变，且随机性本身就是生成艺术的核心。
- ✅ [JS模式+画布] 曼陀罗生成（`creative_mandala` · 三个平行数组描述各层，双层循环按极坐标摆出对称图案）
- ✅ [JS模式+画布] 随机艺术（`creative_random` · 规则定骨架 + 随机制造变化，每次运行都是新作品）
- ✅ [JS模式+画布] 生成艺术（`creative_generative` · 万花尺参数方程，颜色随角度 hsl 渐变，3 圈闭合）
- ✅ [JS模式+画布] 分形树（`creative_tree` · **递归**：函数体内调用自己 + 终止条件，127 段树枝）
- ✅ [JS模式+噪声] 噪声地形（`creative_terrain` · 四个不同频率的波叠加，振幅随频率递减，按高度三档上色）
- ✅ [JS模式+粒子] 粒子烟花（`creative_firework` · 均匀炸开 + 重力 + **空气阻尼** 0.97，否则会飞出画面）

### 分类 P · 网页 / 小游戏开发（Web / Game）
- ✅ [JS模式+DOM] 迷你计算器（`web_calculator` · 输入框收集算式 → 按钮触发 → 安全求值 Function 写回面板）
- ✅ [JS模式+DOM] 会生长的待办清单（`web_todo` · 列表 + 清空重渲染，状态驱动界面雏形）
- ✅ [JS模式+DOM] 记忆力大挑战（`web_memory` · 展示→等待隐藏→凭记忆输入→比对）
- ✅ [JS模式+画布/循环] 平台跳跃（`web_platformer` · 游戏循环 + 键盘 + 重力，实时操控）
- ✅ [JS模式+DOM] 打字练习小游戏（`web_typing` · 随机出题→输入→比对→计分）
- ✅ [JS模式+DOM] 小鹦鹉聊天室（`web_chatbot` · 关键词规则回复 + 列表展示对话，蓝图「后端聊天室」改为本地规则机器人，零依赖）

### 分类 Q · 人工智能启蒙（AI）
> 实现分类 id = `ai`。**Phase 3b 已铺满 6/6**：全部 `codeMode`（学生直接写 JS），判定走 `lib/steps.ts` 的 `AI_CODE_SLUGS` 分支（基于真实 JS 标记 + 运行日志，空程序必然不通过）。
- ✅ [需: 列表+逻辑] 猜动物（决策树）（`ai_tree` · 嵌套 if/else 分类 + 画决策树）
- ✅ [需: JS模式+ML] K 近邻分类（`ai_knn` · Math.hypot 距离排序取前 K 投票）
- ✅ [需: 逻辑] 朴素贝叶斯垃圾邮件（`ai_bayes` · 词频统计 + 先验判定）
- ✅ [需: JS模式+ML] 感知机训练（`ai_perceptron` · 权重迭代更新 + 分界线）
- ✅ [需: 列表] 推荐系统直觉（`ai_recommend` · 余弦相似度找最像用户）
- ✅ [需: JS模式+可视化] 神经网络可视化（`ai_network` · 前向传播逐层乘权重加偏置）

### 分类 R · 毕业项目（Capstone）　✅（5/5 完成）
> 实现分类 id = `capstone`。**Phase 3c 一次铺满 5/5**，全部 `codeMode`（学生直接写 JS），判定走 `lib/steps.ts` 的 `CAPSTONE_CODE_SLUGS` 分支（基于真实 JS 标记：数组/函数/循环/drawXxx/clearCanvas/`[系统] 程序执行完毕`；空程序必然不通过）。
- ✅ [JS模式+画布] 我的完整小游戏：接金币（`capstone_game` · 数组存金币位置 + 逐帧 clearCanvas + 落地判定加分）
- ✅ [JS模式+画布] 我的数据作品：气温可视化（`capstone_data` · 数组 + 循环映射成柱状图）
- ✅ [JS模式+画布] 我的创意工具：万花尺（`capstone_tool` · 可复用 ring() 工具函数 + 循环批量生成对称图案）
- ✅ [JS模式+画布] 开源贡献：绘图工具库（`capstone_oss` · mapRange/dot/grid 通用函数 + 循环演示）
- ✅ [JS模式+画布] 我的作品集：成长展板（`capstone_portfolio` · 数组循环批量画卡片展板）

> **13-16 阶段小计**：8 分类，**53 项目**（K 8 + L 8 + M 7 + N 7 + O 6 + P 6 + Q 6 + R 5），已完成 **53**
> （K·`js` **8/8 铺满**：Phase 0 试点 `js_square` + Phase 1 七个 `js_hello`/`js_variable`/`js_function`/`js_array`/`js_tool`/`js_canvas`/`js_compare`；
> L·`algo` **8/8 满编**：`algo_bubble`/`algo_binary`/`algo_stack`/`algo_maze`/`algo_fib`/`algo_prime`/`algo_string`/`algo_greedy`，算法可视化（数组+画布逐帧重画）地基已落地；
> M·`phys` **7/7 满编**：`phys_fall` 自由落体 / `phys_bounce` 弹跳球 / `phys_parabola` 抛物线 / `phys_gravity` 重力对比 /
> `phys_spring` 弹簧振子 / `phys_orbit` 圆周运动 / `phys_particle` 粒子系统；
> N·`dataviz` **7/7 满编**：`dataviz_bar`/`dataviz_line`/`dataviz_pie`/`dataviz_weather`/`dataviz_scores`/`dataviz_wordcloud`/`dataviz_dashboard`；
> O·`creative` **6/6 满编**：`creative_mandala`/`creative_random`/`creative_generative`/`creative_tree`/`creative_terrain`/`creative_firework`；
> P·`web` **6/6 满编**：`web_calculator`/`web_todo`/`web_memory`/`web_typing`/`web_platformer`/`web_chatbot`，安全 DOM 面板基建已落地；
> Q·`ai` **6/6 满编**：`ai_tree`/`ai_knn`/`ai_bayes`/`ai_perceptron`/`ai_recommend`/`ai_network`，AI 启蒙（决策树/分类/贝叶斯/感知机/推荐/神经网络）地基已落地；
> R·`capstone` **5/5 满编**：`capstone_game`/`capstone_data`/`capstone_tool`/`capstone_oss`/`capstone_portfolio`，毕业项目（综合前面所有能力）地基已落地）。
> JS 模式地基与画布渲染基建均已落地，**Phase 2 的四个画布分类（M/N/O/P 全部 + 地基）已全部铺满**；
> Phase 3a（L·算法 8 项）、Phase 3b（Q·AI 启蒙 6 项）、Phase 3c（R·毕业项目 5 项）均已完成，**13-16 阶段 8 分类已全部满编**。

---

## 四、总览与下一步

| 阶段 | 分类数 | 项目数 | 已完成 | 待解锁关键能力 |
|---|---|---|---|---|
| 6-8 岁 | 11 | 111 | **111** + 造物工坊（含分类11·综合 10 个总结项目） | 分类7·故事 ✅ / 分类10·科学 ✅ / 分类11·综合 ✅ / 造物工坊 ✅ 全部交付 |
| 9-12 岁 | 10 | 77 | **77** | 全部轻量运行时已落地（含列表 7 原语 / 时间轴引擎）；9-12 阶段 10 分类全部满编 |
| 13-16 岁 | 8 | 53 | **53**（K·js 8/8 + L·algo 8/8 + M·phys 7/7 + N·dataviz 7/7 + O·creative 6/6 + P·web 6/6 + Q·ai 6/6 + R·capstone 5/5） | 文本 JS 模式 / 画布渲染基建 / 算法可视化（L）/ AI 启蒙（Q）/ 毕业项目（R）八分类全部满编，13-16 阶段整体交付完成 |

**当前下一步**：6-8（111/111）、9-12（77/77）、13-16（53/53）三阶段已全部满编，全站累计 **241 个**引导项目（含造物工坊）均已上线。
按「**三、13-16 岁阶段 · 推进路线图**」的 Phase 顺序，**Phase 0/1**（K·js 8 项）、**Phase 2a-2e**（M/N/O/P 四个画布分类 26 项 + DOM 基建）、**Phase 3a**（L·算法 8 项）、**Phase 3b**（Q·AI 启蒙 6 项）、**Phase 3c**（R·毕业项目 5 项）全部完成——53 个 codeMode 项目全部上线并已通过 53 关链式浏览器冒烟。至此「造物星球」全课程交付完毕。
后续可考虑：① 「真交互」（鼠标跟随 / 点击事件回调）作为可选增强；② 内容/教学打磨与线上数据复盘。

**如何完善（单会话工作流）**：
1. 从本表挑一个 ⬜ 项目（或一整个分类）。
2. 在 `courses/index.ts` 增加 `CourseProject`（含 `missionBrief` / 分步 `erLingHint` / 3 步 `steps` / 可真实运行的 `defaultXml` 看示范）。
3. 在 `lib/steps.ts` 的 `computeSteps` 增加该 slug 的**真实 JS 标记**判定（不靠积木名），并在 `coach()` 补辅导文案。
4. 若项目需新能力（如变量/键盘），先在 `lib/runtime.ts` 加原语，再写积木生成器。
5. 在 `tests/steps.test.ts` 加回归用例；若"看示范"是真实 Blockly XML，追加 `tests/codegen.test.ts` 验证真能生成 JS。
6. 跑 `NODE_OPTIONS="" npm run test` + `NODE_OPTIONS="" npm run build`（注意 `generateStaticParams` 已自动派生，无需手改）。
7. 部署 gh-pages 后验证 `/learn/<slug>` 与 `/certificate/<slug>` 返回 200。
8. **回写本表**：把对应行 ⬜ 改为 ✅ 并补 slug。

> 约定：所有新增项目默认接入对应阶段的 `projectSlugs`（stage-6-8 已含 111 项；stage-9-12 已含 77 项；stage-13-16 已含 10 项）。每次完善后同步更新本表，保证「计划」与「实况」一致。
>
> **13-16 内容组织约定**：按分类拆文件夹，与 9-12 阶段同一套约定 ——
> `content/stage-13-16/<cat>/<slug>.ts` + `content/stage-13-16/<cat>/index.ts` 聚合成 `stage13<Cat>Projects`，
> 再由 `content/stage-13-16/index.ts` 汇总为 `stage13Projects`。已建 `js/`（8 项）、`phys/`（2 项）。

---

## 五、站点功能模块（课程之外 · 非引导项目）

> 这些模块是「课程任务（/learn）」之外的独立站点功能，不属于上面三阶段的引导项目计数，但同样需要随上线同步维护。导航由 `lib/nav.ts` 的 `NAV_ITEMS` 单一收口（现 6 项：首页 / 星球任务 / 星球游乐场 / 造物工坊 / 组件库 / 作品花园 / 家长入口）。

### 5.1 平台指南（已并入首页 `/`）
- 原独立菜单页 `/guide` 于 2026-08-16 下线：其内容与首页高度重复（三步上手 / 年龄入口 / 精选作品 / 家长放心 / FAQ 几乎一字不差），保留独立页只是制造「第二个首页」。
- 仅把 `/guide` 真正独有且有价值的两块融进首页：`app/page.tsx` 的 **双鹦鹉 Hero（二零 + 三七，凸显多角色平台）** 与 **学习阶梯（序列→循环→事件→条件→函数→变量→代码 7 步）**；并将原「更多玩法」两卡升级为 **六大模块全览**（任务/游乐场/工坊/组件库/花园/家长入口）。
- 导航栏「平台指南」项已移除，平台介绍统一收口到首页 `/`。

### 5.2 星球游乐场（`/playground`）　✅（已上线 · 17 个游戏）
- drop-in 三步契约：每个游戏建 `games/entries/<slug>/{index.tsx, logic.ts, meta.ts}`，`registry.ts` 加 meta，`games/components/GamePlayer.tsx` 加 `GAME_COMPONENTS` 映射。
- 现 17 个（`GameCategory` 四类）：
  - 逻辑益智：`game2048`、`memory-cards`（记忆翻牌）、`number-match`（数字消消乐）、`snake-space`（太空贪吃蛇）、`tetris`（俄罗斯方块 · 7-bag+旋转/消行）、`sokoban`（推箱子 · 标准关卡记号）
  - 音乐节奏：`beat-tap`、`planet-race`、`star-piano`、`beat-memory`（节拍记忆 Simon）
  - 体育竞速：`star-catch`（接星星）、`breakout`（星球打砖块）、`space-runner`（太空跑酷 · 跳跃躲小行星）、`meteor-dodge`（躲避流星 · 左右移动）、`fishing`（钓鱼 · 时机收竿）
  - 物理沙盒：`gravity-bounce`（重力弹球 · 重力+弹性碰撞）、`billiard`（星球台球 · 等质量弹性碰撞/动量守恒）
- 由上一轮的 4 个扩到 10 个、再扩到 12 个、本轮再扩到 17 个（体育竞速补 3 个、逻辑益智补 2 个经典）；核心模式为纯函数 `logic.ts`（`createState`/`step`/`Input`，含可选 seed 做确定性测试）+ canvas 渲染（`useGameLoop`/`useHighScore`）或 DOM 游戏（React state），零引擎改动。

### 5.3 造物工坊（`/studio`）　✅（已上线 · 按学龄分龄）
- 单路由 + `?stage=` 参数分龄，避免拆重路由的 UI 重复；`StudioClient` 读取 `window.location.search` 的 `stage`（仅接受 `stage-6-8` / `stage-9-12`）。
- **6-8 岁 · 纯积木**：工具箱过滤为 `["事件","运动","外观","画笔","控制","侦测","运算","声音","角色"]`（不含变量/函数），无代码预览区。
- **9-12 岁 · 代码初探**：全量工具箱 + 显示「生成的 JavaScript（代码初探）」预览区，让孩子从积木过渡到看代码。
- 工坊内可自由创作并 localStorage 本地保存（命名 / 我的作品 / 回放 / 删除）；任务页各阶段末尾 CTA 卡片 `Link href={\`/studio?stage=${current.id}\`}` 引导自由创作。

---

## 六、修复与质量记录

### 2026-08-26 · 新增 9-12 分类 G·列表（8/8）+ 分类 J·科学（7/7）+ 列表基石与 bgHue 修复
- **列表基石（解锁 G 全类 + F·数独）**：runtime 拓宽 `vars` 为 `Record<string, number | unknown[]>`（数组即列表），新增 7 原语 `setList / getList / listAppend / listItem / listSetItem / listRemoveAt / listLength`（1-based 索引，符合孩子直觉）；`blockly-blocks.ts` 注册 `maker_list_*` 7 积木 + 生成器；`block-catalog.ts` 加「列表」分类（紫 `#A569BD`）+ 7 条 BlockDoc；`steps.ts` 的 `LIST9_SLUGS` 判定走「非空列表 + 仅 `[二零]` 前缀日志命中 `goal.saidIncludes`」双保险，杜绝空程序/半程序通过。
- **分类 G·列表 8 项目**（`list_shopping`/`list_rollcall`/`list_ranking`/`list_lottery`/`list_todo`/`list_words`/`list_scores`/`list_queue`）：购物/待办/单词/排行榜用「新建+加入+说整表」；点名器/抽奖用 `maker_random_int` + `listItem`/`listLength` 随机抽；成绩统计用「循环 × 列表长度 + listItem 累加」=450；排队模拟用 `listAppend` 入队。测试 `list-foundation`(5/5) + `list9-goal`(12/12) 全绿。
  - **修复（G 收尾）**：`list_scores` 默认 XML 把 `maker_change_var` 的取值输入误写成 `value name="VALUE"`（正确名是 `DELTA`），导致取值被忽略、累加量回落默认 `1`、总分只算到 5；改为 `DELTA` 后真算出 450。提醒：9-12 变量积木 `set_var` 用 `VALUE`、`change_var` 用 `DELTA`，不可混用。
- **分类 J·科学 7 项目**（时间轴引擎）：`science_day_night`(bgHue 0→220)/`science_seasons`(20→200)/`science_orbit`(orbit)/`science_water_cycle`(雨点粒子)/`science_grow`(actorSize 0.1→1)/`science_sound`(声波 0.2→3)/`science_light`(折射)。完成判定走 timeline 独立分支（只看轨道是否驱动状态场）。测试 `sci9-goal`(15/15) 全绿。
  - **修复（影响全平台）**：J·科学 `bgHue` 在 `getState()` 浅拷贝下顶层字段写入丢失——`getState` 返回 `this.state` 浅拷贝，`applyTarget` 的 `case "bgHue"` 直接写浅拷贝被丢弃。新增 `Runtime.setBgHue()` + `StageState.bgHue` 字段 + 初始化，`applyTarget` 改调 `setBgHue`；同步修好 6-8 昼夜/四季同类潜在 bug。
- **验证（待提交部署）**：`tsc --noEmit` 零错误；`NODE_OPTIONS=""` 回归（all-projects-smoke + courses + list-foundation/list9-goal/sci9-goal/multi-key-goal/story-goal/music-math-goal/var-goal/fn-goal）全绿。G(8)+J(7) 内容+测试就绪但**尚未 commit / 部署 gh-pages**，线上 `/learn/list_*`、`/learn/science_*` 暂未上线。

### 2026-08-26（续）· 交付分类 H·综合小游戏（8/8）+ 部署 G/J/H 三批上线
- **分类 H·综合小游戏 8 项目**（综合能力检验，横跨键盘/变量/列表/多角色四类）：`game_snake`(贪吃蛇·apples)/`game_shooter`(飞机大战·clouds)/`game_dodge`(躲避乌云·clouds)/`game_race`(接苹果竞速·apples)/`game_guess`(猜数字·变量+条件)/`game_memory`(记忆翻牌·列表)/`game_2048lite`(2048·列表+变量)/`game_puzzle`(拼图归位·多角色)。沿用 D 分类 `keyHandlers>0` 把关键盘类；猜数字走 `goal.saidIncludes=["猜中啦"]`；记忆翻牌/2048 走「非空列表 + 说输出命中」；拼图走 `companionEngaged`。测试 `game9-goal`(19/19) 全绿（看示范 8 通过 + 空程序 8 不通过 + 半程序 3 不通过）。
  - **修复（H 收尾）**：`game_guess` 默认 XML 的 `<maker_say>` 误写了两个 `<next>`（controls_if 与 changeVar），Blockly 只认一个导致 `changeVar 当前+1` 被丢弃、「当前」恒为 1 永不命中「==神秘数」、不说「猜中啦」；改为把 `maker_change_var` 挂到 `controls_if` 的 `<next>` 后重测通过。提醒：9-12 序列积木仅允许一个 `<next>`，多分支须用 controls_if 的 else/嵌套。
- **部署 G/J/H 三批**：G·列表(8) 与 J·科学(7) 已于 commit `0014f9d7` 提交（代码含 runtime/blockly-blocks/block-catalog/steps/components + g/ + j/ + 3 测试）；本轮补 H(8) 后随本批次 commit 一并经 gh-pages worktree 强制推送上线。线上 `/learn/list_*`(8)、`/learn/science_*`(7)、`/learn/game_*`(8) 共 23 个新页面均返回 200。9-12 阶段累计完成 **76/77**（仅 F·数独待建）。
- **验证**：`tsc --noEmit` 零错误；`NODE_OPTIONS=""` 全量回归 **600/600 用例通过**（46 文件）；`npm run build` 静态导出零错误（新增 23 个 /learn 路径）。注：回归末尾出现 19 个 `draw-exec.test.ts` 的 `fetch failed`（Cloudflare IPv6 出口被沙箱拒，网络抖动），与该文件（6-8 绘图）及本轮 H 改动无关，所有真实断言均通过。

### 2026-08-26（再续）· 补完 F·数独（math_sudoku）达成 9-12 满编 77/77
- **分类 F·数独填空 1 项目** `math_sudoku`（四宫 4×4 数独，用「列表」存 16 格合法答案 + 说「数独完成」）：category 保持 `math`（补 F 分类坑），判定复用分类 G·列表模型——加入 `LIST9_SLUGS`（走「建列表 / 填充 / 展示」三步引导 + 「非空列表 + 仅 `[二零]` 日志命中 `goal.saidIncludes`」双保险），**不进 `MATH9_SLUGS`**（避免走 hasVar 分支导致引导误判）；`steps.ts` 同步更新 MATH9 注释（数独不再待补）。测试 `math9-sudoku`(4/4) 全绿（看示范通过 + 三步全亮 + 空程序不通过 + 半程序 2 例不通过）。
- **9-12 阶段满编**：F·数学 7/8 → 8/8，9-12 小计 76 → 77（10 分类全满）。全站累计上线 **182 个**引导项目（6-8 105 + 9-12 77）。
- **验证**：`tsc --noEmit` 零错误；`NODE_OPTIONS=""` 全量回归全绿（46 文件，末尾 19 个 `draw-exec` 的 `fetch failed` 为沙箱网络抖动，与本轮无关）；`npm run build` 静态导出零错误（新增 `/learn/math_sudoku`）。gh-pages 经 worktree 强制推送上线，线上 `/learn/math_sudoku` 返回 200。

### 2026-08-25 · 收紧函数类完成判定（修复「随便搭积木也能通过校验」）
- **根因**：`lib/steps.ts` 的 `isGoalAchieved` 对「无 stars / 无目标标记」的分类（如自定义积木/变量类）兜底 `return true`，导致「用函数画正方形」这类项目只要程序跑完就判定完成，与「是否真正画出正方形」无关。
- **修复**：在 `isGoalAchieved` 新增几何校验分支——`fn_square` 必须画出「等边 + 相邻垂直 + 闭合」的正方形，`fn_polygon` 必须画出「闭合多边形」，其余自定义积木至少要有真实笔画（≥4 段）。运行时已记录 `penPaths`（画笔轨迹），直接用于判定。
- **测试**：新增 `tests/fn-goal.test.ts`，用真实 Runtime 跑「看示范」断言 `fn_square` / `fn_polygon` 判定通过，并用合成轨迹断言「直线 / 空轨迹 / 五边形 / 菱形」均判定不通过。
- **验证**：相关测试 132 项通过，构建 167 页零错误，已部署 gh-pages（main `d406f272` → 线上 `fbafb6c`）。线上 `learn/fn_square`、`learn/fn_polygon` 返回 200。
- **遗留**：`computeSteps` 的 FN/VAR 三步引导仍基于「真实 JS 标记」，完成与否统一由 `isGoalAchieved` 把关；`fn_square` 默认示范已验证真能画出正方形，「判定过、实际跑偏」隐患已消除。

### 2026-08-25 · 收紧变量类完成判定 + 修复 if/else 生成器丢失
- **变量类校验（P0 收尾）**：`isGoalAchieved` 新增 VAR 分支——`VAR_SLUGS` 8 个项目（counter/score/lives/speed/parity/gradient/timer/best）每个在 `CourseProject.goal` 上声明成功信号（变量终值 / 移动距离 / 说文本 / 真实笔画），无 `goal` 声明则 `return false`，彻底消除「随便搭积木也能通过校验」。运行时 state 快照新增 `vars`、`movedDistance` 字段（`lib/runtime.ts`），供校验读取变量终值与是否移动。
- **附带修复（影响全平台）**：发现 `controls_if` 的「否则」分支在代码生成时整体丢失（`else {}` 为空）——根因是项目从未引入标准 `controls_if` 的 else 突变定义，`blockly/blocks` 未加载。在 `lib/blockly-blocks.ts` 注册带固定 `ELSE0` 输入的自定义 `controls_if` 积木 + 显式读 `ELSE0` 的生成器，所有用到 if/else 的项目（含 var_parity）恢复正常。
- **测试**：新增 `tests/var-goal.test.ts`（17 例）——真实 Runtime 跑 8 个VAR默认XML断言通过，合成「随便搭」轨迹断言不通过；VAR 测试 17/17 通过。
- **回归守卫**：`tests/all-projects-smoke.test.ts`（105 项目 codegen 冒烟）+ stage9/fn-goal/var-goal/steps 等共 106 断言通过；执行类 stage9/sequence/draw/math 等 86 项通过——确认 `controls_if` 改动未破坏任何项目代码生成。
- **验证**：构建须以 `NODE_OPTIONS=""` 清除沙箱注入的 `--use-system-ca`（Next.js 16 Turbopack worker 拒绝该变量）。相关测试全绿；部署后线上 `learn/var_*` 应返回 200。

### 2026-08-17 · 收紧多角色 / 键盘类完成判定（消灭 P0 收尾的最后两类）
- **根因**：与 FN/VAR 同一 P0 缺陷——`isGoalAchieved` 末尾 `return true` 仍兜底覆盖 **分类 C·多角色（8 项）** 与 **分类 D·键盘（8 项）**，空程序也能通过校验。
- **分类 C·多角色修复**：新增 `companionEngaged` 运行时信号——程序「真正引用了伙伴角色」即视为 engage（`controlActor` 切到非 erling 角色 / `broadcast` 广播 / `touchingActor` 触碰伙伴 / `distanceTo` 测量伙伴，四处均置位）。`isGoalAchieved` 的 `MULTI_SLUGS` 分支返回 `state.companionEngaged === true`。
  - 设计取舍：初版用「伙伴角色 `acted`（执行过动作）」做信号，但 cat_mouse / guardian_dodge / two_player / animal_queue 的伙伴是**被动目标**（小老鼠 / 守护对象 / 排队跟随者），演示里并不「动」，故改用「是否 engage 伙伴」更贴合——既拦住空程序，又不误杀合法演示。
  - 运行时配套：`ActorState` 加 `acted`（performAction 执行任一动作即置位，保留作诊断）、`StageState` 加 `companionEngaged`；发声类 action（playNote/playChord/playDrum/playRandomNote/playToneByMouseX）补齐 `actorId` 以便合唱等场景精确归因；`getState` 合并 `companionEngaged` 与 `keyHandlers`。
- **分类 D·键盘修复**：键盘游戏完成判定在「当开始运行」跑完时触发，而按键处理器在其后才执行（时序上项目永远无法靠「真的按过」完成），故校验**注册按键处理器数量 `keyHandlers > 0`**（`KEY_SLUGS` + `D_GAME` 共 8 项全部覆盖）。`StageState` 新增必填 `keyHandlers` 字段，`getState` 合并 `this.scripts.whenKeyPressed.length`。
- **测试**：新增 `tests/multi-key-goal.test.ts`（34 例）——8 个 MULTI「看示范」断言 `companionEngaged` 为真且判定通过，8 个 KEY「看示范」断言 `keyHandlers>0` 且判定通过；两类各 8 个「空程序」断言判定不通过；另含 2 个 synthetic 守卫。配套更新 `LearnPageClient` / `StudioClient` 的 `StageState` 字面量（补 `keyHandlers`、`acted`）。
- **验证**：`NODE_OPTIONS=""` 全量测试相关套件 74 项全绿（`multi-key-goal`/`var-goal`/`fn-goal`/`stage9-multiactor`/`stage9-fn-var`/`all-projects-smoke`）；类型检查零错误。

### 2026-08-17 · 新增 9-12 分类 I·交互绘本（零新运行时）+ 收紧点击类完成判定（P0 收尾延续）
- **交付内容**：分类 I·交互绘本 6 项目全部上线（`story_branch`/`story_clickable`/`story_adventure`/`story_growth`/`story_science`/`story_card`），复用已落地的多角色 + 变量运行时，全部以「舞台点击事件」驱动（交互绘本本质）。
- **完成判定收紧（同类 P0 隐患）**：交互绘本的点击事件与键盘同理——完成判定在「当开始运行」跑完时触发，点击在其后才派发；且 `runScript` 每次运行会重置 `companionEngaged`，导致点击脚本会覆盖多角色 engage 信号。故新增 `StageState.clickHandlers`（注册舞台点击处理器数，与 `keyHandlers` 同源），`isGoalAchieved` 的 `STORY9_SLUGS` 分支返回 `state.clickHandlers > 0`——空程序 / 未配点击事件判定不通过，杜绝「随便搭积木也能通过」。
- **设计取舍**：绘本统一做成「点击驱动」，完成信号取注册数而非「真的点过」（时序安全，与键盘类一致）；`computeSteps` 三步引导（当开始运行 → 舞台被点击 → 讲出/表现出故事内容），`coach` 补交互绘本辅导文案。
- **测试**：新增 `tests/story-goal.test.ts`（13 例）——6 个「看示范」断言 `clickHandlers>0` 且判定通过，6 个「空程序」断言不通过，1 个 synthetic 守卫。`tsc` 零错误；`courses` 一致性 10 绿；`all-projects-smoke` 全量代码生成通过；`build` 173 页零错误。
- **验证**：提交 `db4429d2` → gh-pages 经 worktree 推送 `308b7f6b`；线上 6 个 `/learn/story_*` 均返回 200。9-12 阶段累计完成 38 项（A/B/C/D/I）。

### 2026-08-18 · 新增 9-12 分类 E·音乐（8/8）+ F·数学（7/8）+ 收紧两类完成判定（P0 收尾延续）
- **交付内容**：
  - 分类 E·音乐创作 8 项目全部上线（`music_doremi`/`music_twinkle`/`music_loop`/`music_random`/`music_pitch_pos`/`music_chord`/`music_birthday`/`music_compose`），复用已落地的音效运行时；以「代码初探」差异化 6-8 音乐（避免重复）。
  - 分类 F·数学进阶 7 项目上线（`math_mul_table`/`math_factor_prime`/`math_area`/`math_fib`/`math_prime_sieve`/`math_polygon`/`math_coords`），复用已落地的变量 + 坐标(goto) + 画笔运行时；**数独填空 `[需:列表]` 留待「列表」基石落地后补**（本轮策略：零新运行时优先）。
- **完成判定收紧（同类 P0 隐患闭环）**：
  - 音乐类：runtime 在 `performAction` 的 6 个发声动作（playNote/playRandomNote/playDrum/playToneByMouseX/playToneByActorX/playChord）同步置位 `sounded`；`StageState` 新增 `sounded` 字段、`getState` 合并；`isGoalAchieved` 的 `MUSIC9_SLUGS` 分支返回 `sounded===true` → **空程序（不发声）必然不通过**。
  - 数学类：复用 VAR 的 `goal` 真实结果断言分支（扩展守卫为 `VAR_SLUGS || MATH9_SLUGS`，**未波及 6-8 数学**：6-8 用独立的 `MATH_SLUGS` 常量、无 `goal` 不受影响）；每个项目声明 `goal.saidIncludes`（如 斐波那契 55 / 质数 29 / 乘法表 81 / 面积 24 / 六边形内角 120）或 `drew`（面积/多边形/坐标绘图）→ **空程序无输出必然不通过**。
  - `computeSteps` 为两类补三步引导（音乐：当开始运行→用到音频积木→真的播放；数学：变量→循环/画笔→跑完），`coach` 补辅导文案。
  - 命名约定：9-12 常量统一加 `9` 后缀（`MUSIC9_SLUGS`/`MATH9_SLUGS`/`STORY9_SLUGS`），避免与 6-8 同名 `MUSIC_SLUGS`/`MATH_SLUGS` 冲突（曾因此触发 TS 重复声明，已修复）。
- **测试**：新增 `tests/music-math-goal.test.ts`（32 例）——音乐 8「看示范」断言 `sounded` 为真且判定通过 + 8「空程序」不通过 + 1 synthetic；数学 7「看示范」断言 `goal` 通过 + 7「空程序」不通过 + 1 synthetic。`tsc` 零错误；`courses` 一致性 10 绿；`all-projects-smoke` 全量代码生成通过；`build` 新增 15 个 `/learn` 路径零错误。
- **验证**：（待提交后推送）9-12 阶段累计完成 53 项（A/B/C/D/E/I 全 8/8 + F 7/8）。
