# 造物星球 · 轻量埋点接入说明（PM 数据闭环）

> 目的：让产品「不再瞎」——上线后能看清「谁在用、卡在哪、哪些项目最受欢迎」。
> 设计原则：零外部依赖、可降级；配置 GA4 后自动切换到云端聚合，不配也能在本地看到事件。

## 当前状态
- 已落地：`lib/analytics.ts` + `components/AnalyticsBootstrap.tsx`，已在 `app/layout.tsx` 全局挂载，并在学习页（`LearnPageClient.tsx`）埋入核心事件。
- 当前为**降级模式**：未配置 GA，事件写入浏览器 `localStorage`（最多保留 300 条）并 `console.debug` 打印；配置 `NEXT_PUBLIC_GA_ID` 后自动改走 GA4。

## 已埋事件
| 事件名 | 触发时机 | 携带字段 | 用途 |
|--------|----------|----------|------|
| `project_open` | 进入任一关卡（解锁且渲染完成） | `slug`、`stage` | 入口流量（PV / 各项目热度） |
| `run_click` | 点击「运行」按钮（非空代码） | `slug` | 运行次数 → 完成次数 = 尝试转化率 |
| `project_complete` | 判定达成目标（完成横幅出现那一刻） | `slug`、`stage` | **核心转化指标：完成率 / 卡点** |
| `run_error` | 学生代码运行抛错 | `slug`、`message` | 卡点归因（哪关、什么错） |
| `page_error` | 全局 JS 报错 / 未捕获 Promise | `message`、`src`、`line` | 线上稳定性监控 |

指标推导示例：
- **完成率** = `project_complete(slug)` 次数 / `run_click(slug)` 次数
- **卡点 TopN** = `run_error` 按 `slug` 聚合
- **热门项目** = `project_open` 按 `slug` 聚合

## 启用 GA4（可选，推荐）
1. 注册 Google Analytics 4，拿到「衡量 ID」形如 `G-XXXXXXXXXX`。
2. 在仓库根目录新建 `.env`（或 CI 环境变量）写入：
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. 重新 `npm run build` 并触发 GitHub Pages 部署。
4. 上线后事件自动上报到 GA4 的「事件」报告，无需改代码。

> 注意：`.workbuddy` 是项目数据目录，请勿删除；`.env` 可放项目根（已被 gitignore 或未跟踪，切勿把密钥提交）。

## 本地查看（降级模式）
无需任何配置即可在开发/测试时查看事件：
```js
// 浏览器控制台执行，导出最近 300 条事件
JSON.parse(localStorage.getItem("wb_events") || "[]")
```
或调用模块提供的 `dumpEvents()`（仅客户端）。

## 后续建议
- 若需要「跨设备聚合、看板、留存」而非单点调试，优先接 GA4（免费、无需后端）。
- 如需自建数据管线，可将 `trackEvent` 的 `localStorage` 队列改为周期性 POST 到自有接口（改动仅限 `lib/analytics.ts`）。
