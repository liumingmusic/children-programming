import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ParentClient from "@/components/ParentClient";

// 家长页的数据全来自本地存储，测试里用桩替代（不依赖真实 localStorage）
const dbMock = vi.hoisted(() => ({
  exportBackup: vi.fn(async () => ({
    format: "zaowu-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    counts: { projects: 2, progress: 1, timeLogs: 0 },
    entries: { "mp:xml:hello": "<xml />", "mp:prog:hello": "{}" },
  })),
  importBackup: vi.fn(async () => 2),
  parseBackup: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getAllProjects: vi.fn(async () => []),
  getAllProgress: vi.fn(async () => []),
  getTimeStats: vi.fn(async () => ({
    totalSeconds: 0,
    todaySeconds: 0,
    byProject: {},
    last7Days: [],
  })),
  exportBackup: dbMock.exportBackup,
  importBackup: dbMock.importBackup,
  parseBackup: dbMock.parseBackup,
}));

// jsdom 没有实现 URL.createObjectURL / revokeObjectURL，补桩让导出流程可跑
beforeEach(() => {
  dbMock.exportBackup.mockClear();
  Object.defineProperty(URL, "createObjectURL", { value: () => "blob:mock", configurable: true });
  Object.defineProperty(URL, "revokeObjectURL", { value: () => {}, configurable: true });
});

describe("家长页 · 作品备份与隐私", () => {
  it("渲染「作品备份与隐私」区块，含导出 / 恢复两个入口", async () => {
    render(<ParentClient />);
    expect(await screen.findByText("作品备份与隐私")).toBeTruthy();
    expect(screen.getByRole("button", { name: "导出备份文件" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "从备份文件恢复" })).toBeTruthy();
  });

  it("隐私说明讲清了「只存在本机、不上传、不需注册」", async () => {
    render(<ParentClient />);
    await screen.findByText("作品备份与隐私");
    expect(screen.getByText(/只保存在/)).toBeTruthy();
    expect(screen.getByText(/不会上传任何信息/)).toBeTruthy();
    expect(screen.getByText(/不需要注册账号/)).toBeTruthy();
  });

  it("点「导出备份文件」会真的调用导出，并给出条数反馈", async () => {
    render(<ParentClient />);
    const btn = await screen.findByRole("button", { name: "导出备份文件" });
    fireEvent.click(btn);
    await waitFor(() => expect(dbMock.exportBackup).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/已导出 2 份作品/)).toBeTruthy();
  });

  it("搜索框有 aria-label（读屏可读，不依赖 placeholder）", async () => {
    render(<ParentClient />);
    await screen.findByText("作品备份与隐私");
    expect(screen.getByLabelText("搜索某个项目")).toBeTruthy();
  });
});
