// 记忆翻牌 · 纯函数工具（洗牌与牌组生成）。

export const PAIR_EMOJIS = ["🌟", "🌙", "🪐", "🚀", "☄️", "🌍", "🔭", "👽"];

export interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成 pairs 对（2*pairs 张）打乱后的牌组。 */
export function buildDeck(pairs = 6): Card[] {
  const chosen = PAIR_EMOJIS.slice(0, pairs);
  const deck: Card[] = [];
  let id = 0;
  for (const emoji of chosen) {
    deck.push({ id: id++, emoji, flipped: false, matched: false });
    deck.push({ id: id++, emoji, flipped: false, matched: false });
  }
  return shuffle(deck);
}
