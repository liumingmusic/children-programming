import type { Metadata } from "next";
import "./globals.css";
import { BASE_PATH } from "@/lib/basePath";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";
import RouteTracker from "@/components/RouteTracker";

/**
 * 站点绝对地址。部署在 GitHub Pages 子路径，与 next.config.ts 的 basePath 一致。
 * 必须显式设置 metadataBase，否则 Next 生成的 og:image / canonical 会是相对路径，
 * 微信、微博等抓取时拼不出完整地址，分享卡片直接不显示。
 */
const SITE_URL = "https://liumingmusic.github.io/children-programming";

const SITE_TITLE = "造物星球 - 和二零一起，把想法种成作品";
const SITE_DESC = "免费、无广告、项目驱动的少儿编程学习平台";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // title.template：子页面只需给自己的标题，自动补上站点名，
  // 避免 243 个项目页都顶着同一句 title（此前正是如此，被搜索引擎当重复内容）。
  title: {
    default: SITE_TITLE,
    template: "%s - 造物星球",
  },
  description: SITE_DESC,
  icons: {
    icon: `${BASE_PATH}/sun-parrot.svg`,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "造物星球",
    title: SITE_TITLE,
    description: SITE_DESC,
    // 社交平台（微信/微博/Twitter）不支持 SVG，必须用位图；相对路径会基于 metadataBase 解析成绝对地址
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "造物星球 · 少儿编程" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AnalyticsBootstrap />
        <RouteTracker />
        {children}
      </body>
    </html>
  );
}
