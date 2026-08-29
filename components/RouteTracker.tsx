"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * 路由级曝光埋点：覆盖「首页 → 选学段 → 项目页」整条转化漏斗。
 * 放在 RootLayout，所有页面自动上报 page_view（带路由 path），无需逐页注入。
 */
export default function RouteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) trackEvent("page_view", { path: pathname });
  }, [pathname]);
  return null;
}
