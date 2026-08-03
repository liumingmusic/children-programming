"use client";

import { useEffect, useRef } from "react";

/**
 * requestAnimationFrame 游戏主循环（canvas / DOM 动画通用）。
 * @param callback 每帧调用，参数为 dt(秒) 与 t(毫秒时间戳)
 * @param running  是否运行（false 时停止循环，节省电量）
 */
export function useGameLoop(
  callback: (dt: number, t: number) => void,
  running = true
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      cbRef.current(dt, now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}
