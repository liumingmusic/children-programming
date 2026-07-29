import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CertificateClient from "@/components/CertificateClient";
import { getAllProgress } from "@/lib/db";

// 顶部统一定义 mock；具体返回值在每个用例里再设定
vi.mock("@/lib/db", () => ({
  getAllProgress: vi.fn(),
  getAllProjects: vi.fn(async () => []),
}));

describe("CertificateClient 证书页", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("有已完成进度时渲染证书（标题 + 项目名）", async () => {
    vi.mocked(getAllProgress).mockResolvedValue([
      { slug: "hello", completed: true, completedAt: new Date("2026-07-27T10:00:00"), stars: 3 },
    ]);

    render(<CertificateClient slug="hello" />);
    await waitFor(() => {
      expect(screen.getByText("造物星球 · 创作证书")).toBeInTheDocument();
    });
    expect(screen.getByText("二零，打个招呼！")).toBeInTheDocument();
  });

  it("证书页「返回项目」链接指向 /learn/{slug}（而非作品花园/首页）", async () => {
    vi.mocked(getAllProgress).mockResolvedValue([
      { slug: "hello", completed: true, completedAt: new Date("2026-07-27T10:00:00"), stars: 3 },
    ]);

    render(<CertificateClient slug="hello" />);
    await waitFor(() => {
      expect(screen.getByText("造物星球 · 创作证书")).toBeInTheDocument();
    });
    const back = screen.getByRole("link", { name: /返回项目/ }) as HTMLAnchorElement;
    expect(back.getAttribute("href")).toBe("/learn/hello");
  });

  it("没有完成进度时显示「证书未找到」并链接回学习任务", async () => {
    vi.mocked(getAllProgress).mockResolvedValue([]);

    render(<CertificateClient slug="hello" />);
    await waitFor(() => {
      expect(screen.getByText("证书未找到")).toBeInTheDocument();
    });
    const link = screen.getByRole("link", { name: /去完成任务/ }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toContain("/learn/hello");
  });

  it("读取进度异常时不卡在「正在加载」，而是给出错误提示", async () => {
    vi.mocked(getAllProgress).mockRejectedValue(new Error("indexedDB 挂了"));

    render(<CertificateClient slug="hello" />);
    await waitFor(() => {
      expect(screen.getByText("证书加载失败")).toBeInTheDocument();
    });
    // 关键：绝不能停在“正在加载证书...”
    expect(screen.queryByText("正在加载证书...")).toBeNull();
  });
});
