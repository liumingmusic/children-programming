import { useRef, useCallback } from "react";

/**
 * 解决 canvas 组件在 SSR/静态导出后延迟渲染导致尺寸设置失效的问题。
 * 组件首次 mount 时 canvas 可能还不存在（例如 idle 态无 canvas），
 * 因此把尺寸设置放到 draw 调用里惰性执行，确保 canvas 真实出现在 DOM 后再设 width/height/dpr。
 */
export function useCanvasRef(W: number, H: number) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ensuredRef = useRef(false);

  const ensureSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const expectedW = Math.floor(W * dpr);
    const expectedH = Math.floor(H * dpr);
    if (canvas.width !== expectedW || canvas.height !== expectedH) {
      canvas.width = expectedW;
      canvas.height = expectedH;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    }
    ensuredRef.current = true;
    return true;
  }, [W, H]);

  return { canvasRef, ensureSize };
}
