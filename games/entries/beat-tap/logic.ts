// 星球打节拍：纯逻辑（无 DOM / React / Audio，便于单元测试）。
// 时间单位均为「秒」；音符的 time 表示它应当被击中的时刻（由游戏开始计时）。

/** 完美命中窗口（秒，绝对值）。 */
export const PERFECT_WINDOW = 0.09;
/** 良好命中窗口（秒）。 */
export const GOOD_WINDOW = 0.2;
/** 超过音符时刻多少秒仍未击中，判为 miss。 */
export const MISS_GRACE = 0.2;

export type Judgement = "perfect" | "good" | "miss";

/** 根据时间差判定命中等级；超出 GOOD_WINDOW 返回 null（不算命中）。 */
export function judge(deltaSec: number): Exclude<Judgement, "miss"> | null {
  const a = Math.abs(deltaSec);
  if (a <= PERFECT_WINDOW) return "perfect";
  if (a <= GOOD_WINDOW) return "good";
  return null;
}

/** 计分：基础分 × (1 + min(combo,10)×0.1) 连击加成。 */
export function scoreFor(j: "perfect" | "good", combo: number): number {
  const base = j === "perfect" ? 100 : 50;
  const mult = 1 + Math.min(combo, 10) * 0.1;
  return Math.round(base * mult);
}

export interface BeatNote {
  id: number;
  /** 轨道索引（0..lanes-1） */
  lane: number;
  /** 应被击中的时刻（秒，自游戏开始） */
  time: number;
}

/**
 * 生成谱面：每个节拍一个音符，车道按固定规律循环（有规律、低龄友好）。
 * @param bpm      节拍速度
 * @param count    音符总数
 * @param start    第一个音符的时刻（= 下落提前量 lead，使首音符 t=0 即出现）
 * @param lanes    轨道数
 */
export function generateNotes(opts: {
  bpm: number;
  count: number;
  start: number;
  lanes: number;
}): BeatNote[] {
  const beat = 60 / opts.bpm;
  const pattern = [0, 1, 2, 3, 2, 1, 0, 3, 1, 2, 3, 0, 3, 2, 1, 0];
  const notes: BeatNote[] = [];
  for (let i = 0; i < opts.count; i++) {
    const lane = pattern[i % pattern.length] % opts.lanes;
    notes.push({ id: i, lane, time: opts.start + i * beat });
  }
  return notes;
}

/** 谱面最后一拍的时刻（用于判定歌曲结束）。 */
export function lastNoteTime(notes: BeatNote[]): number {
  return notes.reduce((m, n) => Math.max(m, n.time), 0);
}
