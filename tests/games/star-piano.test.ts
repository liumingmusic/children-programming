import { describe, expect, it } from "vitest";
import {
  PIANO_KEYS,
  WHITE_KEYS,
  BLACK_KEYS,
  freqOf,
  blackKeyFraction,
} from "@/games/entries/star-piano/logic";

describe("star-piano logic", () => {
  it("A4 频率等于 440Hz", () => {
    expect(freqOf(0)).toBeCloseTo(440, 5);
  });

  it("C4 约等于 261.63Hz（比 A4 低 9 个半音）", () => {
    expect(freqOf(-9)).toBeCloseTo(261.63, 1);
  });

  it("键盘共 25 键：15 白 10 黑（两个八度 C4→C6）", () => {
    expect(PIANO_KEYS).toHaveLength(25);
    expect(WHITE_KEYS).toHaveLength(15);
    expect(BLACK_KEYS).toHaveLength(10);
  });

  it("黑键位置比例为 (白键序号+1)/15", () => {
    expect(blackKeyFraction("C#4")).toBeCloseTo(1 / 15, 5);
    expect(blackKeyFraction("A#4")).toBeCloseTo(6 / 15, 5);
    expect(blackKeyFraction("C#5")).toBeCloseTo(8 / 15, 5);
  });
});
