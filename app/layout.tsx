import type { Metadata } from "next";
import "./globals.css";
import { BASE_PATH } from "@/lib/basePath";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";
import RouteTracker from "@/components/RouteTracker";

export const metadata: Metadata = {
  title: "造物星球 - 和二零一起，把想法种成作品",
  description: "免费、无广告、项目驱动的少儿编程学习平台",
  icons: {
    icon: `${BASE_PATH}/sun-parrot.svg`,
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
