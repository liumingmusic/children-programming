import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MemoryGame from "@/components/MemoryGame";

function getCards() {
  return screen
    .getAllByRole("button")
    .filter((b) => (b.getAttribute("aria-label") || "").includes("卡片"));
}

describe("MemoryGame 记忆翻牌组件", () => {
  it("渲染 12 张背面卡片与玩法说明", () => {
    render(<MemoryGame onWin={() => {}} />);
    expect(getCards().length).toBe(12);
    expect(screen.getByText(/找出相同的两张卡片/)).toBeTruthy();
    expect(screen.getByText(/重开/)).toBeTruthy();
  });

  it("点击一张卡片可以翻开（露出图案，不再显示未翻开）", () => {
    render(<MemoryGame onWin={() => {}} />);
    const cards = getCards();
    expect(cards[0].getAttribute("aria-label")).toContain("未翻开");
    fireEvent.click(cards[0]);
    expect(cards[0].getAttribute("aria-label")).not.toContain("未翻开");
    expect(cards[0].getAttribute("aria-label")).toContain("卡片");
  });
});
