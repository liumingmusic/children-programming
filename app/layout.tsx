import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "造物星球 - 和二零一起，把想法种成作品",
  description: "免费、无广告、项目驱动的少儿编程学习平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
