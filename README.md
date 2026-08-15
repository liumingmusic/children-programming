# 造物星球 · 儿童编程学习平台

一个面向 6–16 岁孩子的图形化编程学习网站：拖拽彩色积木让角色「二零」动起来、画图案、做小游戏，并配套作品花园、组件库、家长入口与纯休闲的「星球游乐场」。

- 线上地址：<https://liumingmusic.github.io/children-programming/>
- 技术栈：Next.js 16（App Router，静态导出 `output: 'export'`）、React 19、TypeScript、Blockly 13、Tailwind v4、Vitest。

---

## 核心理念：内容 / 引擎分离

整个项目最重要的约定是**「数据 = 内容」与「运行 = 引擎」彻底分开**：

- **内容（数据）**：每个学习项目、每个游乐场小游戏，都是一份独立的、纯数据的描述文件。
- **引擎（代码）**：画布、积木台、步骤判定、运行、看示范、完成弹窗等**通用组件只写一次**，它们只读取数据来渲染，不内置任何具体项目的逻辑。

这样做的好处（也是这个工程的出发点）：

- 改一个项目 = 改一个数据文件，**完全不动引擎代码**；
- 加一个项目 / 加一个大模块 = **只加数据 + 在注册表追加一行**，引擎与路由零改动；
- 新模块（导航项、游乐场游戏）都能 drop-in 扩展，长期不混乱。

---

## 目录结构

```
children-programming/
├── app/                         # 页面路由（Next.js App Router，静态导出）
│   ├── page.tsx                 # 首页（导航项之一 /）
│   ├── missions/                # 星球任务
│   │   ├── page.tsx             #   学龄段总览
│   │   └── [stage]/page.tsx     #   某学龄段 → 分类 → 项目 卡片（如 /missions/stage-6-8）
│   ├── learn/[id]/              # 单个项目学习页（画布 + 积木 + 步骤 + 看示范 + 完成弹窗）
│   ├── toolbox/                 # 组件库（积木工具箱说明）
│   ├── gallery/                 # 作品花园
│   ├── parent/                  # 家长入口
│   ├── playground/              # 星球游乐场（纯休闲游戏支线）
│   │   └── [slug]/              #   单个小游戏
│   ├── certificate/[slug]/      # 通关证书页
│   └── layout.tsx               # 全局布局（挂载统一导航 SiteHeader）
│
├── content/                     # ★ 内容层（纯数据，按 学龄 → 分类 → 项目 拆分）
│   ├── stages.ts                #   学龄段定义（6-8 / 9-12 / 13-16 岁），含每阶段 projectSlugs 顺序
│   ├── index.ts                 #   汇总 CATEGORIES / projects / stages（单一出口）
│   ├── stage-6-8/
│   │   ├── categories.ts        #     该阶段「分类」元数据（序列/循环/绘图/事件/条件/游戏/故事…）
│   │   ├── index.ts             #     聚合各分类项目 → stage6Projects（按 projectSlugs 顺序）
│   │   ├── seq/  loop/  draw/   #     各分类下，每个项目一个 .ts，导出 CourseProject
│   │   ├── event/ cond/  game/  #     （目前 stage-6-8 共 105 个项目，每个文件即一个独立项目）
│   │   │   └── <slug>.ts        #       例：loop/square.ts 导出 squareProject
│   ├── stage-9-12/              #   图形化进阶：分类 A·函数 8/8 ✅ + 分类 B·变量 8/8 ✅ + 分类 C·多角色 8/8 ✅ + 分类 D·键盘 8/8 ✅（共 32 项目，自定义积木/变量/多角色/键盘运行时已落地）；分类 E–J 规划中
│   └── stage-13-16/             #   文本代码过渡：categories.ts 已定义 8 分类（K–R），项目待填充（需先开 JS 模式运行时）
│
├── courses/                     # ★ 引擎与内容的「薄聚合层」
│   └── index.ts                 #   从 @/content 导入 stages/CATEGORIES/projects → 跑镜像(MIRROR)
│                                 #   → re-export getProject / getStageProjects / getStageCategories
│                                 #   / getStageOfProject / getNextProject / getCategoryLabel 等。
│                                 #   对外 API 是稳定契约，下游组件只依赖它，不碰 content 内部。
│
├── games/                       # ★ 星球游乐场（与编程学习解耦的纯休闲游戏，同样的「注册表单一数据源」哲学）
│   ├── types.ts                 #   游戏类型定义（GameDefMeta 等）
│   ├── registry.ts              #   游戏注册表：GAMES[] + getGameMeta / getGamesByCategory（卡片页/路由只读它）
│   ├── components/              #   游乐场共享 UI：GameShell / GameCard / PlaygroundGrid / GamePlayer
│   ├── hooks/                   #   useHighScore(localStorage 最高分) / useGameLoop(rAF 主循环)
│   └── entries/<slug>/          #   每个游戏自包含：index.tsx(组件) + logic.ts(纯逻辑) + meta.ts(注册元数据)
│                                 #   已上线：game2048 / beat-tap / planet-race / star-piano
│
├── components/                  # ★ 通用引擎 UI（只写一次，读数据渲染，不内嵌具体项目逻辑）
│   ├── SiteHeader.tsx           #   全站统一导航（client，usePathname 高亮；数据来自 lib/nav.ts）
│   ├── BlocklyEditor.tsx        #   积木编辑台（注入/载入/退出 flush 存档）
│   ├── StagePlayer.tsx          #   画布（角色/场景/镜头，恒定参考系取景）
│   ├── LearnPageClient.tsx      #   学习页容器（拼装编辑器+画布+步骤+示范+完成）
│   ├── DemoOverlay.tsx          #   看示范浮层
│   ├── CompletionModal.tsx      #   完成弹窗
│   ├── AdventurePath.tsx        #   闯关路径（分类 → 项目卡片网格）
│   ├── StageCard.tsx / ErLingAvatar.tsx / MemoryGame.tsx / GalleryClient.tsx / ParentClient.tsx / CertificateClient.tsx / BlockChip.tsx
│
├── lib/                         # ★ 通用引擎逻辑
│   ├── runtime.ts               #   编程运行时（角色移动/旋转/画笔/收集判定，角度与 Y 轴约定）
│   ├── steps.ts                 #   步骤判定 + 辅导提示（基于真实运行日志匹配）
│   ├── path.ts                  #   闯关路径计算（completed/current/locked 状态）
│   ├── blockly-blocks.ts        #   Blockly 积木定义与 JS 代码生成
│   ├── block-catalog.ts         #   组件库（积木工具箱）数据层
│   ├── db.ts                    #   本地存储（localStorage 降级写法：作品/进度/时长）
│   └── nav.ts                   #   ★ 全站导航单一数据源 NAV_ITEMS（新增模块只改这里）
│
├── tests/                       # Vitest 测试（全量约 248 用例，含 courses / runtime / steps / 编辑器 / games）
├── docs/                        # 规划与跟踪文档（plan-track 真值表 / roadmap-6-8 市调）
├── scripts/                     # 辅助脚本（如 analyze-components.ts）
├── public/                      # 静态资源
└── next.config.ts / tailwind / tsconfig / vitest.config.ts   # 构建与配置
```

### 三句话记住结构

1. **`content/` 放数据**（每个项目一个文件），`courses/index.ts` 是它对外唯一出口。
2. **`components/` + `lib/` 放引擎**（画布/积木/运行/步骤/导航），对所有项目通用。
3. **`lib/nav.ts` 与 `games/registry.ts` 都是「单一数据源」** —— 加模块加游戏只改这两处 + 加一个数据文件，其余不动。

---

## 本地开发

```bash
npm install
npm run dev          # 启动开发服务器，访问 http://localhost:3000
```

打开后默认在子路径 `/children-programming` 下（静态导出 basePath 约定）。

## 测试

```bash
npm test             # 运行 Vitest（npm run test 亦可）
```

> 注：构建或测试若遇到本机 Cloudflare 代理注入的证书问题，可前置 `NODE_OPTIONS=""` 再执行（如 `NODE_OPTIONS="" npm run build`）。

## 构建与部署（GitHub Pages）

项目用 `output: 'export'` 静态导出，产物在 `dist/`。部署到 `gh-pages` 分支后由 GitHub Pages 托管。

```bash
NODE_OPTIONS="" npm run build        # 静态导出到 dist/（务必保留 dist/.nojekyll）
```

部署 `dist/` 到 `gh-pages`（推荐用 worktree 法，避免污染工作树）：

```bash
REPO=$(pwd)
WT=/tmp/cp-gh-pages
git worktree add "$WT" gh-pages
cd "$WT"
git fetch origin gh-pages
git reset --hard origin/gh-pages
git rm -r -q . || true
cp -R "$REPO"/dist/. ./
git add -A
git commit -m "deploy: <说明>"
git push origin gh-pages
cd "$REPO"
rm -rf "$WT"
git worktree prune
```

推送后约 40 秒生效，验证：

```bash
curl -I https://liumingmusic.github.io/children-programming/
```

## 新增内容指南

- **新增一个学习项目**：在 `content/stage-<id>/<分类>/` 下新建 `<slug>.ts` 导出 `CourseProject`，并在 `content/stage-<id>/index.ts` 追加一行 import（保持 `projectSlugs` 的分类连续顺序）。引擎与路由无需改动。
- **新增一个学龄段**：按 `stage-6-8` 的模式建 `content/stage-<id>/` 与对应 `categories.ts`，并在 `content/stages.ts` 与 `content/index.ts` 注册。
- **新增一个导航模块**：在 `lib/nav.ts` 的 `NAV_ITEMS` 追加一项，并在 `app/` 下加对应页面。
- **新增一个游乐场游戏**：在 `games/entries/<slug>/` 建 `index.tsx` + `logic.ts` + `meta.ts`，再到 `games/registry.ts` 追加一行；并在 `games/components/GamePlayer.tsx` 补一条 slug→组件映射。无需改动路由。

---

## 文档

更深入的规划与进度见 `docs/`：`plan-track.md`（总体计划与上线跟踪，跨三阶段真值表）、`roadmap-6-8.md`（早期市面调研与 6–8 岁阶段路线图）。
