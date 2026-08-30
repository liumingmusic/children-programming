import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import LearnPageClient from "@/components/LearnPageClient";
import { getProject } from "@/courses";

// 记录「父组件通过 onReady 收到的 handle」。
//
// 背景：BlocklyEditor 改成 next/dynamic 懒加载后，ref 实测透传不进来——ref 为 null 时
// React 根本不会调用 useImperativeHandle 的工厂函数。于是改为组件用 onReady 回调把
// handle 交出去。父组件若忘记接 onReady，editorRef 会一直是 null，而 handleSave /
// handleRun 里都是 `if (!editor) return`——不报错，只表现为「点了保存 / 运行没反应」。
// 刻意只在「父组件确实传了 onReady」时才记录，这样「忘了接」会被下面这条测试抓出来。
const captured = vi.hoisted(() => ({ handle: null as unknown }));

// Blockly 在 jsdom 里注入成本太高，用轻量桩替代
vi.mock("@/components/BlocklyEditor", () => ({
  default: forwardRef(function MockBlocklyEditor(
    props: { onReady?: (h: unknown) => void },
    ref
  ) {
    const handle = {
      getXml: () => "",
      loadXml: () => {},
      getCode: () => "",
      run: async () => {},
      resetWorkspace: () => {},
      addBlock: () => {},
    };
    useImperativeHandle(ref, () => handle);
    useEffect(() => {
      if (props.onReady) {
        captured.handle = handle;
        props.onReady(handle);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onReady]);
    return <div data-testid="editor" />;
  }),
}));

vi.mock("@/components/StagePlayer", () => ({
  default: () => <div data-testid="stage" />,
}));

vi.mock("@/components/DemoOverlay", () => ({
  default: () => <div data-testid="demo-overlay" />,
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
  it("懒加载的 BlocklyEditor 能通过 onReady 把 handle 交给页面（防「保存/运行点了没反应」）", async () => {
    captured.handle = null;
    render(<LearnPageClient project={getProject("hello")!} />);
    await screen.findByTestId("editor");
    await waitFor(() => {
      expect(
        captured.handle,
        "编辑器 handle 没交到页面上：editorRef 会是 null，保存 / 运行 / 添加积木将静默失效（不报错、只没反应）"
      ).not.toBeNull();
    });
  });

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
    const runBtn = await screen.findByRole("button", { name: "运行" });
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
