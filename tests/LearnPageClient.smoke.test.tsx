import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { forwardRef, useImperativeHandle } from "react";
import LearnPageClient from "@/components/LearnPageClient";
import { getProject } from "@/courses";

// Blockly 在 jsdom 里注入成本太高，用轻量桩替代
vi.mock("@/components/BlocklyEditor", () => ({
  default: forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
      getXml: () => "",
      loadXml: () => {},
      getCode: () => "",
      run: async () => {},
      resetWorkspace: () => {},
    }));
    return <div data-testid="editor" />;
  }),
}));

vi.mock("@/components/StagePlayer", () => ({
  default: () => <div data-testid="stage" />,
}));

vi.mock("@/lib/db", () => ({
  loadProject: vi.fn(async () => ""),
  saveProject: vi.fn(async () => {}),
  markProgress: vi.fn(async () => {}),
  getProgress: vi.fn(async () => null),
  getAllProgress: vi.fn(async () => []),
  recordSessionTime: vi.fn(async () => {}),
}));

describe("LearnPageClient 学习页冒烟", () => {
  it("能正常挂载，渲染标题与积木工作区", async () => {
    render(<LearnPageClient project={getProject("hello")!} />);
    expect(await screen.findByText("积木工作区")).toBeInTheDocument();
    expect(screen.getByText("任务步骤")).toBeInTheDocument();
  });

  it("顶部「返回任务列表」指向所属项目集合 /missions/{stage}，而非首页", async () => {
    render(<LearnPageClient project={getProject("hello")!} />);
    const back = (await screen.findByRole("link", { name: /返回任务列表/ })) as HTMLAnchorElement;
    expect(back.getAttribute("href")).toBe("/missions/stage-6-8");
    expect(back.getAttribute("href")).not.toBe("/");
  });

  it("运行按钮在积木为空时给出提示（交互有响应）", async () => {
    render(<LearnPageClient project={getProject("hello")!} />);
    const runBtn = await screen.findByRole("button", { name: /运行/ });
    fireEvent.click(runBtn);
    expect(await screen.findByText(/二零还没收到指令/)).toBeInTheDocument();
  });

  it("重置按钮可点击且不会抛错", async () => {
    render(<LearnPageClient project={getProject("hello")!} />);
    const resetBtn = await screen.findByRole("button", { name: /重置/ });
    fireEvent.click(resetBtn);
    await waitFor(() => expect(resetBtn).toBeInTheDocument());
  });

  it("看示范按钮可点击且不会抛错", async () => {
    render(<LearnPageClient project={getProject("hello")!} />);
    const demoBtn = await screen.findByRole("button", { name: /看示范/ });
    fireEvent.click(demoBtn);
    await waitFor(() => expect(demoBtn).toBeInTheDocument());
  });
});
