// 造物钢琴 · 音名 / 频率映射（纯函数，可测试）。
// 等程律：freq = 440 * 2^(n/12)，n 为相对 A4 的半音数。

export interface PianoKey {
  note: string; // 如 "C4" / "C#4"
  freq: number;
  isBlack: boolean;
  key: string; // 键盘按键（小写），白键无则 ""
}

const A4 = 440;

export function freqOf(semitonesFromA4: number): number {
  return A4 * Math.pow(2, semitonesFromA4 / 12);
}

const SEMI: Record<string, number> = {
  "C4": -9, "C#4": -8, "D4": -7, "D#4": -6, "E4": -5, "F4": -4,
  "F#4": -3, "G4": -2, "G#4": -1, "A4": 0, "A#4": 1, "B4": 2, "C5": 3,
  "C#5": 4, "D5": 5, "D#5": 6, "E5": 7, "F5": 8,
  "F#5": 9, "G5": 10, "G#5": 11, "A5": 12, "A#5": 13, "B5": 14, "C6": 15,
};

// 第一八度保留键盘按键（低龄友好）；第二八度无对应按键，仅触摸可弹。
const KEYMAP: Record<string, string> = {
  "C4": "a", "C#4": "w", "D4": "s", "D#4": "e", "E4": "d", "F4": "f",
  "F#4": "t", "G4": "g", "G#4": "y", "A4": "h", "A#4": "u", "B4": "j", "C5": "k",
};

// 展示顺序（左→右），覆盖两个八度 C4 → C6
const ORDER = [
  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4",
  "G4", "G#4", "A4", "A#4", "B4", "C5",
  "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6",
];

export const PIANO_KEYS: PianoKey[] = ORDER.map((note) => ({
  note,
  freq: freqOf(SEMI[note]),
  isBlack: note.includes("#"),
  key: KEYMAP[note] ?? "",
}));

export const WHITE_KEYS = PIANO_KEYS.filter((k) => !k.isBlack);
export const BLACK_KEYS = PIANO_KEYS.filter((k) => k.isBlack);

// 黑键中心位置（占宽度的比例）：在它前面的第几个白键之后
const BLACK_AFTER: Record<string, number> = {
  "C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5,
  "C#5": 7, "D#5": 8, "F#5": 10, "G#5": 11, "A#5": 12,
};

export function blackKeyFraction(blackNote: string): number {
  const idx = BLACK_AFTER[blackNote];
  if (idx == null) return 0;
  return (idx + 1) / WHITE_KEYS.length;
}
