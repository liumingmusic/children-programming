<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 造物星球 · 项目协作约定（跨会话交接说明）

> 本文件是本项目所有 AI 会话的"交接说明书"。**每次新会话开始时，先读完本文件再动手。**

## 1. 这是什么
纯前端少儿编程网站（6-8 / 9-12 / 13-16 三阶段）。Next.js(App Router)+TS+Tailwind，`output:'export'` 静态导出，GitHub Pages 托管，无后端（IndexedDB/Dexie 本地存储）。图形化用 Google Blockly（生成 JS），运行时 `lib/runtime.ts` 模拟海龟/机器人"二零"。

## 2. 部署真相（最高优先级，已发生真实事故）
- `main` 分支 = 源码；`gh-pages` 分支 = **线上站点**（dist 内容）。
- **改了任何代码/课程后，必须 `build` + 部署 `gh-pages`，否则用户线上永远看不到改动。** 真实案例：分类2/3 做完只 push 了 main，线上一直停在旧版，用户以为代码没生效。
- 部署步骤（保留 `.nojekyll`）：
  ```
  NODE_OPTIONS="" npm run build
  rm -rf /tmp/gh-pages-deploy && mkdir -p /tmp/gh-pages-deploy && cp -r dist/. /tmp/gh-pages-deploy/
  cd /tmp/gh-pages-deploy && git init -q && git add -A && git commit -qm "deploy: <说明>" && git branch -M gh-pages && git remote add origin git@github.com:liumingmusic/children-programming.git && git push -f origin gh-pages
  ```
- 验证：轮询 `https://liumingmusic.github.io/children-programming/learn/<slug>` 返回 200 才算完成。

## 3. 新增/修改一个项目（标准流程）
1. `courses/index.ts`：在 `projects` 加 `CourseProject`（slug/title/ageGroup/description/missionBrief/erLingHint/steps[3步]/defaultXml[可运行的看示范]/category/scene?）。
2. 把 slug 加入对应 stage 的 `projectSlugs`（顺序按概念梯度：序列→循环→绘图→事件→条件→游戏…）。
3. `lib/steps.ts`：`computeSteps` 加该 slug 的**真实 JS 标记**判定 + `coach()` 辅导文案。
4. 测试：`tests/steps.test.ts` + `tests/codegen.test.ts` 加用例（看示范 XML 真实生成 JS + 三步判定通过）。
5. `NODE_OPTIONS="" npm run test` → build → 部署 gh-pages → 验证 200。
6. 回写 `docs/plan-track.md`：把 `⬜` 改为 `✅` 并补 slug。

## 4. 质量红线（踩过的坑，必须遵守）
- 步骤判定必须用**真实生成的 JS 标记**（`__runtime.move/turn`、`for` 循环、`penDown` 等），**绝不**用 Blockly 积木类型名（`controls_repeat_ext`/`maker_move` 等，生成的 JS 里根本没有）。
- "看示范"必须**真实可运行**画出预期结果，不是摆设。
- **必须补端到端执行测试**：用真实 `Runtime` 把 `defaultXml` 跑一遍，断言演员最终坐标/画布产物正确（参照 `tests/sequence-exec.test.ts`）。只测"生成 JS"不够——曾出现 `stone` 项目"判定过、实际跑偏"；分类2/3 的 15 个新项目目前**尚未做此验证**，存在同类隐患。
- 画笔 bug 教训：`penDown/penUp/setPenColor/changePenColor` 必须在 Runtime 内**排队**执行（`eval` 同步阶段笔会被立刻抬起，导致画不出线）。

## 5. 当前进度（2026-07-29）
- 6-8 岁：规划 111 项，已完成 **32**（分类1序列11/分类2循环10/分类3绘图10/分类4事件…）。`docs/plan-track.md` 是进度真值表。
- 9-12 / 13-16：0 完成。
- **已验证项（2026-07-29）**：分类2/3 的 15 个新项目已补端到端执行测试（`tests/draw-exec.test.ts`，用真实 Runtime 把 `defaultXml` 跑一遍，断言闭合/对称图形回到原点、方向复原 90°、确实画出笔画、无运行时报错）；全量测试 196 passed，并已部署 `gh-pages`（线上 `learn/<slug>` 返回 200）。

## 6. 关键文件速查
- `courses/index.ts`：课程数据 + `CATEGORIES` 注册表 + `getStageCategories`/`getNextProject` 纯函数
- `lib/steps.ts`：步骤判定 + 辅导文案（纯函数，易测）
- `lib/runtime.ts`：运行时（move/turn/pen/say/goto/事件）
- `components/StagePlayer.tsx`：画布渲染（含 scene 目标点）+ 自适应镜头
- `components/LearnPageClient.tsx`：学习页（运行/看示范/返回）
- `app/missions/[stage]/page.tsx`：按分类分组展示
- `docs/plan-track.md`：阶段→分类→项目→是否完成 进度表（真值）
- `docs/roadmap-6-8.md`：市面调研 + 路线图

## 7. 测试/构建注意
- 必须 `NODE_OPTIONS=""` 运行测试与构建，否则 WorkBuddy 注入的 `--use-system-ca` 会破坏 worker。
- 测试含 jsdom 下 canvas 报错噪声（测文字宽度），属正常，代码生成/执行仍成功。
