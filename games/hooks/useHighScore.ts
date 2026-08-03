"use client";

import { useCallback, useEffect, useState } from "react";

// 游戏最高分（localStorage，沿用 lib/db.ts 的降级写法：SSR / 隐私模式安全）。
const PREFIX = "gp:hs:";

function read(key: string): number {
  try {
    if (typeof window === "undefined") return 0;
    const v = window.localStorage.getItem(PREFIX + key);
    return v ? Number(v) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * 读取并持久化某个游戏的最高分。
 * @param key 游戏唯一标识（通常等于 slug）
 */
export function useHighScore(key: string) {
  const [high, setHigh] = useState<number>(0);

  useEffect(() => {
    setHigh(read(key));
  }, [key]);

  const submit = useCallback(
    (score: number) => {
      setHigh((prev) => {
        if (score > prev) {
          try {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(PREFIX + key, String(score));
            }
          } catch {
            /* 隐私模式 / 配额满：忽略 */
          }
          return score;
        }
        return prev;
      });
    },
    [key]
  );

  return { high, submit };
}
