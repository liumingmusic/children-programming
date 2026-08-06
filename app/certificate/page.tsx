import CertificateClient from "@/components/CertificateClient";

// 单页静态导出：证书内容完全由客户端渲染（读 URL ?slug= 与本地进度），
// 不再为每个项目静态预渲染一页，避免导出文件爆炸（105 → 1）。
export default function CertificatePage() {
  return <CertificateClient />;
}
