"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

/**
 * 全局埋点引导组件：挂载即初始化埋点并安装错误捕获。
 * 放在 RootLayout 中，覆盖所有页面；不影响任何 UI。
 */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
