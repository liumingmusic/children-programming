// 轻量埋点模块。
// 设计原则：零外部依赖、可降级。配置 NEXT_PUBLIC_GA_ID 后自动走 GA4；
// 未配置时降级为 localStorage 队列 + console.debug，便于离线/调试时也能看到事件。
// 这样既能在「无凭证」条件下先把数据采集骨架铺好，又不阻塞交付。

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export type EventProps = Record<string, string | number | boolean>;

const STORAGE_KEY = "wb_events";

/** 初始化：注入 GA4（若有 ID）并安装全局错误捕获。整个应用只需调用一次。 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  if (GA_ID) {
    const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function (...args: unknown[]) {
      w.dataLayer!.push(args);
    };
    w.gtag("js", new Date());
    w.gtag("config", GA_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  installErrorHandlers();
}

/** 上报事件。GA 可用时上报到 GA4；否则落入本地队列 + 控制台，方便调试。 */
export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) || "[]";
    const arr = JSON.parse(raw) as Array<{ name: string; props: EventProps; t: number }>;
    arr.push({ name, props, t: Date.now() });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(-300)));
  } catch {
    /* 忽略存储异常，不影响主流程 */
  }

  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (GA_ID && w.gtag) {
    w.gtag("event", name, props);
  } else {
    // 降级模式：开发/调试可见
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, props);
  }
}

/**
 * 导出本地事件队列（供调试或接入自有后端时拉取）。
 * 返回最近最多 300 条事件。
 */
export function dumpEvents(): Array<{ name: string; props: EventProps; t: number }> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function installErrorHandlers(): void {
  window.addEventListener("error", (e: ErrorEvent) => {
    trackEvent("page_error", {
      message: String(e.message),
      src: e.filename || "",
      line: e.lineno || 0,
    });
  });
  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    trackEvent("page_error", {
      message: "unhandledrejection: " + String(e.reason),
    });
  });
}

/**
 * 首次完成某项目时上报「首个作品」转化事件（核心漏斗指标：
 * 一个全新用户是否能在体验后真正完成第一个作品）。
 * 仅在本地从未记录过完成时触发一次；返回 true 表示「这是首个」。
 */
export function trackFirstCompletion(slug: string, stage: string): boolean {
  if (typeof window === "undefined") return false;
  const FIRST_KEY = "wb_first_completed";
  if (window.localStorage.getItem(FIRST_KEY)) return false;
  window.localStorage.setItem(FIRST_KEY, slug);
  trackEvent("first_project_completed", { slug, stage });
  return true;
}
