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

  it("键盘共 13 键：8 白 5 黑", () => {
    expect(PIANO_KEYS).toHaveLength(13);
    expect(WHITE_KEYS).toHaveLength(8);
    expect(BLACK_KEYS).toHaveLength(5);
  });

  it("黑键位置比例为 (白键序号+1)/8", () => {
    expect(blackKeyFraction("C#4")).toBeCloseTo(1 / 8, 5);
    expect(blackKeyFraction("A#4")).toBeCloseTo(6 / 8, 5);
  });
});
