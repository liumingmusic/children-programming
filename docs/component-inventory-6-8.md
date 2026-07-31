# 6-8 岁阶段 · 组件（积木 + 扩展）使用清单

> 自动分析 `courses/index.ts` 全 61 个项目生成。统计口径：每个项目的 `defaultXml`（Blockly 积木）逐一解析，外加 `scene`/`component` 字段识别的特殊组件。
> 生成脚本：`scripts/analyze-components.ts`（`vite-node` 运行）。

---

## 一、应用级 / 运行时组件（61 个项目全部共用）

| 组件 | 作用 | 覆盖范围 |
|---|---|---|
| `LearnPageClient` | 编辑器 + 运行器外壳，串起积木→代码→Runtime | 全部 61 个 |
| `StagePlayer` | 画布渲染：角色(二零)、笔迹、星星、标记、乌云、表情 | 全部 61 个 |
| `AdventurePath` / `MissionsExplorer` | 多邻国式闯关地图（阶段→章节→项目） | 入口/任务页 |
| `Runtime`（`lib/runtime.ts`） | 执行引擎：移动/转向/落笔/事件/碰撞/变量/云 | 全部 61 个 |
| `MemoryGame` | 独立翻牌小游戏（非 Blockly） | 仅 `memory_match` |

---

## 二、积木组件使用频率（按使用项目数降序）

| 用到几个项目 | 积木（组件） |
|---:|---|
| 49 | 当开始(启动帽子) |
| 45 | 移动(前进 N 步) |
| 38 | 右转 N 度 |
| 32 | 落笔 |
| 30 | 抬笔 |
| 28 | 重复 N 次(循环) |
| 16 | 说一句话 |
| 13 | 如果(条件) |
| 11 | 当点击舞台(帽子) |
| 3 | 走到星星位置 / 比较(>/</=) / 走到坐标(x,y) |
| 2 | 改变画笔颜色 / 碰到边缘? / 改变大小 / 走到鼠标位置 / 碰到星星? / 设置画笔颜色 / 鼠标在左半边? / 碰到标记?(障碍/坏人) |
| 1 | 等待 N 秒 / 当按下按键(帽子) / 设置表情 / 画笔是红色? / 随机整数 / 设置变量 / 取模(求余) / 读取变量 / 改变变量 / 读取大小 / 碰到乌云? |

> 注：「数字」「文本」是积木里填值的占位字段，不是独立功能组件，已在上表剔除。
> 「左转 N 度」积木已存在 toolbox，但目前 61 个示范项目**均未使用**（新加的，还没进任何 demo）。

---

## 三、各项目实际用到的积木（按分类）

### 分类1·序列（11）
`hello` 当开始/移动/说 · 其余 10 个(走到小旗子、绕石头、L形、送信、迷宫、箭头、折线、宝藏、跳舞、回字) = 当开始/落笔/移动/右转/抬笔

### 分类2·循环（10）
`square / triangle / pentagon / spin / stairs / wave / spiral / fence / windmill / pickfruit` = 当开始/落笔/重复N次/移动/右转/抬笔

### 分类3·画笔（10）
`star5 / flower / rainbow / snowflake / mandala / concentric / connectdot / house / letter / checkerboard` = 当开始/落笔/重复N次/移动/右转/(抬笔)；其中 `rainbow` 额外用「改变画笔颜色」、`flower` 省略抬笔

### 分类4·事件（10）
- `click_jump` 点击舞台/移动/等待
- `click_color` 点击舞台/落笔/改变画笔颜色/移动/抬笔
- `click_dialog` `click_play_dialog` 点击舞台/说
- `two_events` 当开始/说 + 当点击舞台
- `auto_patrol` 当开始/落笔/重复/移动/右转/抬笔
- `key_forward` 当按下按键/移动
- `edge_bounce` 当开始/重复/移动/如果/碰到边缘?/右转
- `size_toggle` 点击舞台/改变大小
- `expression_shake` 点击舞台/移动/设置表情/说

### 分类5·条件（10）
- `if_touch_star` 点击舞台/走到鼠标/如果/碰到星星?/说
- `if_edge_turn` 当开始/重复/移动/如果/碰到边缘?/右转
- `if_red_stop` 当开始/设置画笔颜色/如果/画笔是红色?/说
- `click_left_right` 点击舞台/如果/鼠标在左半边?/移动
- `collect3` 当开始/走到星星位置/说
- `random_branch` 当开始/如果/比较/随机整数/移动
- `odd_even` 当开始/设置变量/重复/如果/比较/取模/读取变量/右转/改变变量/移动
- `size_threshold` 当开始/重复/改变大小/如果/比较/读取大小/说
- `avoid_obstacle` 当开始/重复/移动/如果/碰到标记?(障碍)/右转 **+障碍标记**
- `escape_badguy` 当开始/重复/移动/如果/碰到标记?(坏人)/右转 **+坏人标记**

### 分类6·游戏（10）
- `stars` 点击舞台/走到鼠标/如果/碰到星星?/说
- `maze_exit` 当开始/移动/右转
- `collect_apples` `collect_rainbow` 当开始/走到星星位置/说
- `light_lanterns` 当开始/走到坐标/设置画笔颜色/说
- `treasure_map` `escort` 当开始/走到坐标/说
- `traffic_police` 点击舞台/如果/鼠标在左半边?/说
- `dodge_clouds` 当开始/重复/移动/如果/碰到乌云?/右转 **+飘动乌云**
- `memory_match` **记忆翻牌组件(MemoryGame)，非 Blockly**

---

## 四、特殊扩展组件（只在少数项目出现）

| 扩展组件 | 首次出现项目 | 说明 |
|---|---|---|
| 障碍标记 Obstacle (`touchingMark("obstacle")`) | `avoid_obstacle` | 运行时障碍碰撞判定 |
| 坏人标记 Badguy (`touchingMark("badguy")`) | `escape_badguy` | 多角色碰撞逃跑 |
| 飘动乌云 Cloud (`startClouds`) | `dodge_clouds` | 动画子系统，缓慢飘动+反弹 |
| 记忆翻牌 MemoryGame | `memory_match` | 独立 React 组件，非 Blockly |
| 变量 Var | `odd_even` | setVar/changeVar/getVar |
| 取模 Mod | `odd_even` | 奇偶判断 |
| 随机数 Random | `random_branch` | maker_random_int |
| 表情 Expression | `expression_shake` | setExpression |
| 大小阈值 Size | `size_threshold` | getSize/changeSize |
| 画笔颜色 PenColor | `if_red_stop` / `rainbow` | set/change/isRed |
| 鼠标互动 Mouse | `if_touch_star` / `click_left_right` / `stars` | gotoMouse/mouseX/mouseLeft |
| 键盘事件 Key | `key_forward` | whenKeyPressed |
| 点击舞台 Click | 分类4 多数 | whenStageClicked |
