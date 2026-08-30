import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CodeQuiz from "@/components/CodeQuiz";
import { getProject } from "@/courses";

const project = getProject("read_loops")!;
const quiz = project.quiz!;

/** 用 aria-label 精确定位某个选项按钮（组件为每个选项写了 `选项 N：文本`）。 */
function optionButton(qIndex: number, optIndex: number) {
  const q = quiz[qIndex];
  return screen.getByLabelText(`选项 ${optIndex + 1}：${q.options[optIndex]}`);
}

describe("CodeQuiz 组件（读代码 · 预测结果）", () => {
  it("首屏渲染出代码、问题与全部选项", () => {
    render(<CodeQuiz quiz={quiz} onPass={() => {}} />);
    expect(screen.getByText(/__runtime\.penDown/)).toBeTruthy();
    expect(screen.getByText(quiz[0].question)).toBeTruthy();
    quiz[0].options.forEach((_, i) => expect(optionButton(0, i)).toBeTruthy());
    // 未作答时不该出现解析
    expect(screen.queryByText(quiz[0].explain)).toBeNull();
  });

  it("选错：给出解析与「再试一次」，并停在原题（不许蒙混过关）", () => {
    render(<CodeQuiz quiz={quiz} onPass={() => {}} />);
    const wrong = quiz[0].options.findIndex((_, i) => i !== quiz[0].answer);
    fireEvent.click(optionButton(0, wrong));

    expect(screen.getByText("再看看这段解析～")).toBeTruthy();
    expect(screen.getByText(quiz[0].explain)).toBeTruthy();
    expect(screen.getByText("再试一次")).toBeTruthy();
    // 仍在第一题（用进度点的选中态判断；进度文案在 DOM 里被拆成多个文本节点，不便正则匹配）
    expect(screen.getAllByRole("tab")[0].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText(quiz[0].question)).toBeTruthy();
  });

  it("选错后点「再试一次」可重新作答", () => {
    render(<CodeQuiz quiz={quiz} onPass={() => {}} />);
    const wrong = quiz[0].options.findIndex((_, i) => i !== quiz[0].answer);
    fireEvent.click(optionButton(0, wrong));
    fireEvent.click(screen.getByText("再试一次"));
    // 解析收起，可以重选
    expect(screen.queryByText(quiz[0].explain)).toBeNull();
    expect(screen.queryByText("再试一次")).toBeNull();
  });

  it("选对：显示「答对了」与「下一题」，点击进入第二题", () => {
    render(<CodeQuiz quiz={quiz} onPass={() => {}} />);
    fireEvent.click(optionButton(0, quiz[0].answer));
    expect(screen.getByText("答对了！")).toBeTruthy();

    fireEvent.click(screen.getByText("下一题 →"));
    expect(screen.getAllByRole("tab")[1].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText(quiz[1].question)).toBeTruthy();
  });

  it("答对进度通过 onProgress 上报，供左侧步骤点亮", () => {
    const onProgress = vi.fn();
    render(<CodeQuiz quiz={quiz} onPass={() => {}} onProgress={onProgress} />);
    // 挂载时上报 0
    expect(onProgress).toHaveBeenCalledWith(0);
    fireEvent.click(optionButton(0, quiz[0].answer));
    expect(onProgress).toHaveBeenCalledWith(1);
  });

  it("三题全部答对后触发 onPass，并展示通关文案", () => {
    const onPass = vi.fn();
    render(<CodeQuiz quiz={quiz} onPass={onPass} />);
    quiz.forEach((q, i) => {
      fireEvent.click(optionButton(i, q.answer));
      if (i < quiz.length - 1) fireEvent.click(screen.getByText("下一题 →"));
    });
    expect(onPass).toHaveBeenCalled();
    expect(screen.getByText("全部答对，你读懂代码啦！")).toBeTruthy();
  });

  it("只答对部分题目时不触发 onPass", () => {
    const onPass = vi.fn();
    render(<CodeQuiz quiz={quiz} onPass={onPass} />);
    fireEvent.click(optionButton(0, quiz[0].answer));
    fireEvent.click(screen.getByText("下一题 →"));
    expect(onPass).not.toHaveBeenCalled();
  });
});
