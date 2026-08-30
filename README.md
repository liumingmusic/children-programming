# 造物星球 · 儿童编程学习平台

面向 6–16 岁孩子的图形化编程学习网站：拖拽彩色积木让角色「二零」动起来、画图案、做小游戏，
并配套作品花园、组件库、家长入口与纯休闲的「星球游乐场」。

- 线上地址：<https://liumingmusic.github.io/children-programming/>
- 技术栈：Next.js 16（App Router，静态导出 `output: 'export'`）、React 19、TypeScript、Blockly 13、Tailwind v4、Vitest。
- 内容规模：**243 个引导项目**（6-8 岁 111 / 9-12 岁 79 / 13-16 岁 53）+ 17 个游乐场小游戏。

## 产品定位

**免费、无广告、不收集任何儿童数据**，目标用户是学生（第一）与家长（第二）。

由此派生出两条贯穿全工程的硬约束，改动代码前请先确认没有违反：

1. **不引入后端、不引入用户系统。** 作品、进度、学习时长**全部只存在浏览器的 localStorage**
   （键统一以 `mp:` 前缀，见 `lib/db.ts`）。
2. **可以埋点，但默认不外发。** `lib/analytics.ts` 只在配置了 `NEXT_PUBLIC_GA_ID` 时才上报 GA4，
   未配置时降级为纯本地队列，一行数据都不出设备。

推论：**必须让用户知道「数据只在这台设备上」**。清缓存 / 换设备 / 换浏览器会永久丢失且无法找回，
因此家长页有醒目警示条与「导出备份 / 恢复」入口，学习页工具栏也有常驻提醒。

---

## 核心理念：内容 / 引擎分离

整个项目最重要的约定是**「数据 = 内容」与「运行 = 引擎」彻底分开**：

- **内容（数据）**：每个学习项目、每个游乐场小游戏，都是一份独立的、纯数据的描述文件。
- **引擎（代码）**：画布、积木台、步骤判定、运行、看示范、完成弹窗等**通用组件只写一次**，
  它们只读取数据来渲染，不内置任何具体项目的逻辑。

这样做的好处（也是这个工程的出发点）：

- 改一个项目 = 改一个数据文件，**完全不动引擎代码**；
- 加一个项目 / 加一个大模块 = **只加数据 + 在注册表追加一行**，引擎与路由零改动；
- 新模块（导航项、游乐场游戏）都能 drop-in 扩展，长期不混乱。

---

## 目录结构

```
children-programming/
├── app/                         # 页面路由（Next.js App Router，静态导出）
│   ├── page.tsx                 #   首页（导航项之一 /）
│   ├── missions/                #   星球任务
│   │   ├── page.tsx             #     学龄段总览
│   │   └── [stage]/page.tsx     #     某学龄段 → 分类 → 项目（如 /missions/stage-6-8）
│   ├── learn/[id]/              #   单个项目学习页（画布 + 积木 + 步骤 + 看示范 + 完成弹窗）
│   │                            #     每个项目页都有独立的 generateMetadata（SEO）
│   ├── toolbox/                 #   组件库（积木工具箱说明）
│   ├── gallery/                 #   作品花园
│   ├── parent/                  #   家长入口（进度 + 时长 + 作品备份与隐私）
│   ├── playground/              #   星球游乐场（纯休闲游戏支线）
│   │   └── [slug]/              #     单个小游戏
│   ├── certificate/[slug]/      #   通关证书页
│   └── layout.tsx               #   全局布局（SEO metadataBase + OG 卡片 + 导航）
│
├── content/                     # ★ 内容层（纯数据，按 学龄 → 分类 → 项目 拆分）
│   ├── stages.ts                #   学龄段定义，含每阶段 projectSlugs 顺序（决定解锁链）
│   ├── index.ts                 #   汇总 CATEGORIES / projects / stages
│   ├── stage-6-8/               #   111 个项目，11 分类
│   │   ├── categories.ts        #     分类元数据（顺序 = 解锁顺序，勿随意调整）
│   │   ├── index.ts             #     聚合各分类项目（须与 projectSlugs 顺序一致）
│   │   └── <分类>/<slug>.ts     #     每个项目一个文件，导出 CourseProject
│   ├── stage-9-12/              #   79 个项目，11 个非空分类
│   │                            #     fn / var / multi / key / music / math / list
│   │                            #     / game / story / science / code（读代码）
│   └── stage-13-16/             #   53 个项目，8 分类（全部手写 JavaScript）
│                                #     js / phys / dataviz / creative / web / algo / ai / capstone
│
├── courses/                     # ★ 内容的「薄聚合层」，全站唯一出口
│   └── index.ts                 #   re-export getProject / getStageProjects / getStageCategories
│                                #   / getStageOfProject / getNextProject / getCategoryLabel 等。
│                                #   对外 API 是稳定契约：下游组件只依赖它，不碰 content 内部。
│
├── games/                       # ★ 星球游乐场（与编程学习解耦的纯休闲游戏，同样的注册表哲学）
│   ├── types.ts                 #   游戏类型定义
│   ├── registry.ts              #   游戏注册表 GAMES[]（卡片页与路由只读它）
│   ├── components/              #   共享 UI：GameShell / GameCard / PlaygroundGrid / GamePlayer
│   ├── hooks/                   #   useHighScore / useGameLoop
│   └── entries/<slug>/          #   每个游戏自包含：index.tsx + logic.ts + meta.ts
│                                #   已上线 17 个（2048 / 打地鼠 / 贪吃蛇 / 俄罗斯方块 / 弹球 …）
│
├── components/                  # ★ 通用引擎 UI（只写一次，读数据渲染，不内嵌具体项目逻辑）
│   ├── SiteHeader.tsx           #   全站统一导航（数据来自 lib/nav.ts）
│   ├── BlocklyEditor.tsx        #   积木编辑台（懒加载；通过 onReady 回调把 handle 交给父组件）
│   ├── CodeEditor.tsx           #   代码编辑器（13-16 用，CodeMirror，同样懒加载）
│   ├── CodeQuiz.tsx             #   「读代码」选择题组件（只读代码预测结果，不写代码）
│   ├── LearnPageClient.tsx      #   学习页容器（拼装编辑器+画布+步骤+示范+完成）
│   ├── StagePlayer.tsx          #   画布（角色/场景/镜头）
│   ├── DemoOverlay.tsx / CompletionModal.tsx / AdventurePath.tsx
│   ├── MemoryGame.tsx           #   翻牌小游戏（独立组件型项目，不走积木）
│   └── GalleryClient.tsx / ParentClient.tsx / CertificateClient.tsx / BlockChip.tsx …
│
├── lib/                         # ★ 通用引擎逻辑
│   ├── runtime.ts               #   编程运行时（移动/旋转/画笔/收集判定，角度与 Y 轴约定）
│   ├── steps.ts                 #   步骤判定 + 完成闸门 + 辅导提示（基于真实运行日志匹配）
│   ├── path.ts                  #   闯关路径（completed / current / locked）
│   ├── blockly-blocks.ts        #   Blockly 积木定义与 JS 代码生成
│   ├── block-catalog.ts         #   组件库（积木工具箱）数据层
│   ├── db.ts                    #   ★ 本地存储：作品/进度/时长 + 备份导出导入 + 连续天数
│   ├── nav.ts                   #   ★ 全站导航单一数据源 NAV_ITEMS（新增模块只改这里）
│   ├── analytics.ts             #   埋点（未配 GA_ID 时完全本地，不外发）
│   └── basePath.ts / scripts.ts / toolbox-category.ts
│
├── tests/                       # Vitest 测试（全量 1055 个用例，58+ 文件）
├── docs/                        # 规划与跟踪文档（见文末「文档」一节）
├── scripts/
│   ├── gen-sitemap.mjs          #   postbuild：扫描 dist/ 产物生成 sitemap.xml（271 条 URL）
│   └── analyze-components.ts    #   组件使用分析
├── public/                      # 静态资源（og-image.png / robots.txt / sun-parrot.svg）
├── .github/workflows/pages.yml  # 部署：workflow_dispatch 手动触发 → build → 推 gh-pages
└── next.config.ts / tailwind / tsconfig / vitest.config.ts   # 构建与配置
```

### 三句话记住结构

1. **`content/` 放数据**（每个项目一个文件），`courses/index.ts` 是它对外唯一出口。
2. **`components/` + `lib/` 放引擎**（画布/积木/运行/步骤/导航），对所有项目通用。
3. **`lib/nav.ts`、`games/registry.ts`、`content/*/categories.ts` 都是「单一数据源」**
   —— 加模块、加游戏、加分类只改这三处 + 加一个数据文件，其余不动。

---

## 数据存在哪里（改动前必读）

| 数据 | 存储位置 | 会不会丢 |
|---|---|---|
| 作品 XML / 代码 | `localStorage`（`mp:xml:<slug>`） | **会**：清缓存 / 换设备即丢 |
| 完成进度 | `localStorage`（`mp:prog:<slug>`） | 会 |
| 学习时长 | `localStorage`（`mp:time:<slug>:<date>`） | 会 |
| 埋点事件 | `localStorage`（`wb_events`） | 会，且默认不外发 |

因为会丢，所以 `lib/db.ts` 提供了 `exportBackup / parseBackup / importBackup`，
家长页 `/parent` 有「导出备份文件 / 从备份文件恢复」入口，支持纯前端换设备迁移。
导入采用**同名覆盖、不清空其他**，避免误选文件把现有作品一起抹掉。

埋点说明见 `docs/analytics-guide.md`。

---

## 本地开发

```bash
npm install
npm run dev          # 启动开发服务器
```

打开后默认在子路径 `/children-programming` 下（静态导出 basePath 约定）。
改 `next.config.ts` 的 `basePath` 时，**务必同步 `lib/basePath.ts`**：
本版本 Next 不会自动为 `<img src>` 与 `metadata.icons` 补 basePath，需手动拼接。

## 测试

```bash
npm test             # 运行 Vitest
```

> 注：本机若被注入代理证书导致 `fetch failed`，可前置 `NODE_OPTIONS=""`
> （如 `NODE_OPTIONS="" npm run build`）。全量约 6 分钟。

**回归判定的关键习惯**：全量跑出 failed 时，先单独重跑可疑文件，区分
「断言失败（真回归）」与「环境/依赖报错（非回归）」，不要凭文件类型想当然。

## 构建与部署（GitHub Pages）

项目用 `output: 'export'` 静态导出到 `dist/`，由 GitHub Actions 部署到 `gh-pages` 分支。

```bash
NODE_OPTIONS="" npm run build        # 静态导出；postbuild 会自动生成 dist/sitemap.xml
```

部署走 `.github/workflows/pages.yml` 的 **`workflow_dispatch`（手动触发）**：
push 到 `main` 后需到 Actions 页面手动触发一次，流程会 checkout main → install
→ build → 推 `gh-pages`（orphan + force），由 GitHub Pages 自动发布。

> `npm install` 偶发 `ECONNRESET`（registry 连接被重置）导致 Install 步骤失败时，
> 与代码无关，直接重新触发一次即可。

验证：

```bash
curl -I https://liumingmusic.github.io/children-programming/
```

---

## 新增内容指南

- **新增一个学习项目**：在 `content/stage-<id>/<分类>/` 下新建 `<slug>.ts` 导出 `CourseProject`，
  在该阶段 `index.ts` 追加，并在 `content/stages.ts` 的 `projectSlugs` 注册。
  ⚠️ **新增后必须跑 `tests/path.test.ts`**：它硬编码了 6-8 阶段线性顺序总数（现为 111）。
- **新增一个分类 / 学龄段**：在 `content/stage-<id>/categories.ts` 注册（**注册顺序即解锁顺序**），
  再按分类建文件夹。空分类不贡献解锁节点，所以「先注册空分类、后填内容」会埋雷。
- **新增一个「非积木」的独立交互项目**（如读代码 `codequiz`、翻牌 `memory`）：
  在 `courses/index.ts` 扩展 `component` 联合类型并加数据字段 → 新建 `components/Xxx.tsx`
  → 在 `LearnPageClient` 加渲染分支与完成回调。注意这类项目没有积木代码，
  步骤点亮要绕开 `computeSteps`，且要在 `tests/all-projects-smoke.test.ts` 里跳过。
- **新增一个导航模块**：在 `lib/nav.ts` 的 `NAV_ITEMS` 追加一项，并在 `app/` 下加对应页面。
- **新增一个游乐场游戏**：在 `games/entries/<slug>/` 建 `index.tsx` + `logic.ts` + `meta.ts`，
  再到 `games/registry.ts` 追加一行，并在 `GamePlayer.tsx` 补 slug → 组件映射。无需改路由。

### 两个容易踩的坑

- **`next/dynamic` 透传不了 `ref`**（React 19 + Next 16 实测）：ref 为 null 时
  `useImperativeHandle` 的工厂根本不会被调用，而调用处多写成 `if (!editor) return`
  ——不报错，只表现为「点了保存没反应」。编辑器已改用 **`onReady` 回调**绕开，新增懒加载组件请沿用。
- **别拿未压缩体积下性能结论**：GitHub Pages 会自动 gzip（Blockly chunk 793KB → 约 210KB）。
  另外 App Router 静态导出会把 dynamic chunk 写进路由 preload 清单，懒加载减不了下载量。

---

## 文档

更深入的规划与进度见 `docs/`：

| 文件 | 内容 |
|---|---|
| `plan-track.md` | **总体计划与上线跟踪（跨三阶段真值表，进度唯一依据）** |
| `transition-audit.md` | 学段衔接审计（6-8 → 9-12 → 13-16 的积木→代码跨越） |
| `content-audit.md` | 内容深度抽检与质量核查 |
| `roadmap-6-8.md` | 早期市面调研与 6–8 岁阶段路线图 |
| `analytics-guide.md` | 埋点事件说明 |

另有 `AGENTS.md`（本仓库的协作约定与开发规范，`CLAUDE.md` 直接引用它）。
