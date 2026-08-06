import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CompletionModal from "@/components/CompletionModal";
import { getProject } from "@/courses";

describe("CompletionModal 完成弹窗", () => {
  it("open=false 时不渲染任何内容", () => {
    const { container } = render(
      <CompletionModal open={false} onClose={() => {}} project={getProject("hello")!} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("open=true 时显示标题与「任务完成」", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("hello")!} />);
    expect(screen.getByText("任务完成！")).toBeInTheDocument();
  });

  it("点击 ✕ 关闭按钮会调用 onClose", () => {
    const onClose = vi.fn();
    render(<CompletionModal open onClose={onClose} project={getProject("hello")!} />);
    fireEvent.click(screen.getByLabelText("关闭"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("「查看证书」链接指向 /certificate/{slug}", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("hello")!} />);
    const link = screen.getByRole("link", { name: /查看证书/ }) as HTMLAnchorElement;
    expect(link.getAttribute("href")).toContain("/certificate/hello");
  });

  it("「返回任务列表」链接指向所属项目集合 /missions/{stage}", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("hello")!} />);
    const link = screen.getByRole("link", { name: /返回任务列表/ }) as HTMLAnchorElement;
    // hello 属于 stage-6-8，所以返回应回到该学段的项目集合，而非首页
    expect(link.getAttribute("href")).toBe("/missions/stage-6-8");
  });

  it("hello 项目显示「挑战下一个：走到小旗子」并指向 /learn/flag", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("hello")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("走到小旗子");
    expect(btn.getAttribute("href")).toContain("/learn/flag");
  });

  it("square 项目显示「挑战下一个：二零画三角形」并指向 /learn/triangle", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("square")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("二零画三角形");
    expect(btn.getAttribute("href")).toContain("/learn/triangle");
  });

  it("memory_match 不再是最后一个项目，显示「挑战下一个：弹奏 do re mi」并指向 /learn/play_doremi", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("memory_match")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("弹奏 do re mi");
    expect(btn.getAttribute("href")).toContain("/learn/play_doremi");
  });

  it("magic_show 不再是最后一个项目，显示「挑战下一个：昼夜更替」并指向 /learn/day_night", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("magic_show")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("昼夜更替");
    expect(btn.getAttribute("href")).toContain("/learn/day_night");
  });

  it("moon_phase 是阶段最后一个项目，不显示「挑战下一个」", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("moon_phase")!} />);
    expect(screen.queryByRole("link", { name: /挑战下一个/ })).toBeNull();
  });

  it("calculator 不再是最后一个项目，显示「挑战下一个：二零的自我介绍」并指向 /learn/self_intro", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("calculator")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("二零的自我介绍");
    expect(btn.getAttribute("href")).toContain("/learn/self_intro");
  });

  it("compose 不再是最后一个项目，显示「挑战下一个：数数 1 到 10」并指向 /learn/count10", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("compose")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("数数 1 到 10");
    expect(btn.getAttribute("href")).toContain("/learn/count10");
  });

  it("stars 不再是最后一个项目，显示「挑战下一个：走迷宫到出口」并指向 /learn/maze_exit", () => {
    render(<CompletionModal open onClose={() => {}} project={getProject("stars")!} />);
    const btn = screen.getByRole("link", { name: /挑战下一个/ }) as HTMLAnchorElement;
    expect(btn).toHaveTextContent("走迷宫到出口");
    expect(btn.getAttribute("href")).toContain("/learn/maze_exit");
  });
});
