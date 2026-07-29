"use client";

import { useEffect, useRef, useState } from "react";
import type { StageState } from "@/lib/runtime";
import type { ProjectScene } from "@/courses";

interface StagePlayerProps {
  state: StageState;
  scene?: ProjectScene;
  onStageClick?: (x: number, y: number) => void;
}

// 二零在画布中的固定屏幕尺寸（不再跟随相机自适应缩放 scale，避免小图形时被放大到 300px+ 盖住笔迹）。
// 这是「全局统一」的二零大小开关：调小此值可全局缩小二零，调大则放大。建议范围 0.3 ~ 0.55。
// 二零本体在世界坐标下约 108×74 单位，乘此系数即屏幕上像素尺寸（0.4 ≈ 高 43px / 宽 30px）。
const ACTOR_SCALE = 0.4;

// 画笔迹的固定屏幕尺寸（不再乘相机 scale，避免小图形时线被放大到 9px+ 显得很粗）。
// 全局统一开关：调小=更细，调大=更粗。建议范围 2 ~ 4。
const PEN_WIDTH = 3;
// 笔迹发光光晕半径（像素）。过大也会让线显得粗，收一点更清爽。
const PEN_GLOW = 4;

interface View {
  scale: number;
  /** 内容包围盒中心（世界坐标） */
  cx: number;
  cy: number;
}

export default function StagePlayer({ state, scene, onStageClick }: StagePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; alpha: number; twinkle: number }[]>([]);
  const sizeRef = useRef({ w: 480, h: 360 });
  const viewRef = useRef<View>({ scale: 1, cx: 0, cy: 0 });
  // 用户缩放系数（在自动适配的基础上再放大/缩小）
  const [zoom, setZoom] = useState(1);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onStageClick) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const { scale, cx, cy } = viewRef.current;
    // 屏幕坐标 -> 世界坐标（反向变换）
    const wx = (px - cw / 2) / scale + cx;
    const wy = (ch / 2 - py) / scale + cy;
    onStageClick(wx, wy);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;
    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w: cw, h: ch };

    // Lazy-init twinkling stars background (screen space)
    if (starsRef.current.length === 0) {
      const count = 40;
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, ch);
    gradient.addColorStop(0, "#0B1C3F");
    gradient.addColorStop(1, "#162B55");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cw, ch);

    // Draw stars
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(performance.now() / 800 + star.twinkle) * 0.2 + star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, twinkle)})`;
      ctx.fill();
    });

    // Draw subtle grid (screen space, decorative)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= cw; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }
    for (let y = 0; y <= ch; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }
    ctx.restore();

    // ---- 计算自适应镜头：让所有内容（画笔轨迹/角色/星星）都落在画面内 ----
    const pad = 36;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const add = (x: number, y: number) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    };
    add(state.actor.x, state.actor.y);
    state.stars.forEach((s) => add(s.x, s.y));
    if (scene?.marks) scene.marks.forEach((m) => add(m.x, m.y));
    if (scene?.walls) scene.walls.forEach((w) => { add(w.x1, w.y1); add(w.x2, w.y2); });
    state.penPaths.forEach((p) => p.points.forEach((pt) => add(pt.x, pt.y)));
    if (state.currentPath) state.currentPath.points.forEach((pt) => add(pt.x, pt.y));
    if (!isFinite(minX)) {
      minX = -10;
      minY = -10;
      maxX = 10;
      maxY = 10;
    }
    const contentW = Math.max(maxX - minX, 1);
    const contentH = Math.max(maxY - minY, 1);
    const fit = Math.min((cw - pad * 2) / contentW, (ch - pad * 2) / contentH);
    const scale = Math.max(0.12, Math.min(fit * zoom, 3));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    viewRef.current = { scale, cx, cy };
    const toScreen = (wx: number, wy: number) => ({
      x: cw / 2 + (wx - cx) * scale,
      y: ch / 2 - (wy - cy) * scale,
    });

    // 舞台中心（世界原点）标记
    const o = toScreen(0, 0);
    ctx.save();
    ctx.strokeStyle = "rgba(93, 202, 165, 0.5)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(o.x, o.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText("舞台中心", o.x + 8, o.y - 8);
    ctx.restore();

    // 画笔轨迹（在变换后的位置绘制；线宽/光晕用固定屏幕像素，不随相机放大变粗）
    const drawPath = (path: { points: { x: number; y: number }[]; color: string; width?: number }) => {
      if (path.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width ?? PEN_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = path.color;
      ctx.shadowBlur = PEN_GLOW;
      ctx.beginPath();
      const start = toScreen(path.points[0].x, path.points[0].y);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < path.points.length; i++) {
        const pt = toScreen(path.points[i].x, path.points[i].y);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.restore();
    };
    state.penPaths.forEach((path) => drawPath(path));
    if (state.currentPath) drawPath(state.currentPath);

    // 场景装饰：目标点 emoji / 障碍 / 迷宫墙（纯展示，位于画笔轨迹之上、角色之下）
    if (scene?.walls) {
      scene.walls.forEach((w) => {
        const a = toScreen(w.x1, w.y1);
        const b = toScreen(w.x2, w.y2);
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
      });
    }
    if (scene?.marks) {
      scene.marks.forEach((m) => {
        const p = toScreen(m.x, m.y);
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = '30px -apple-system, BlinkMacSystemFont, "PingFang SC", "Segoe UI Emoji", sans-serif';
        ctx.fillText(m.emoji, p.x, p.y);
        if (m.label) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = '12px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
          ctx.fillText(m.label, p.x, p.y + 22);
        }
        ctx.restore();
      });
    }

    // 星星（按 scale 缩放大小，位置用变换）
    state.stars.forEach((star) => {
      if (star.collected) return;
      const s = toScreen(star.x, star.y);
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.scale(scale, scale);
      ctx.fillStyle = "#FFD93D";
      ctx.shadowColor = "#FFD93D";
      ctx.shadowBlur = 12;
      drawStarShape(ctx, 0, 0, 5, 14, 7);
      ctx.fill();
      ctx.restore();
    });

    // 说话气泡（先画，位于角色之上）
    if (state.actor.message) {
      const a = toScreen(state.actor.x, state.actor.y);
      drawSpeechBubble(ctx, a.x, a.y, state.actor.message, cw, ch);
    }

    // 角色「二零」（位置用变换 + 自身旋转；尺寸用固定 ACTOR_SCALE，不随相机缩放，避免盖住笔迹）
    const actor = toScreen(state.actor.x, state.actor.y);
    const angleRad = ((state.actor.angle - 90) * Math.PI) / 180;
    ctx.save();
    ctx.translate(actor.x, actor.y);
    ctx.scale(ACTOR_SCALE * (state.actor.size ?? 1), ACTOR_SCALE * (state.actor.size ?? 1));
    ctx.rotate(angleRad);

    // 尾羽
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(-12, 52);
    ctx.lineTo(0, 44);
    ctx.lineTo(12, 52);
    ctx.closePath();
    ctx.fill();

    // 翅膀
    ctx.fillStyle = "#EF9F27";
    ctx.beginPath();
    ctx.ellipse(24, 4, 13, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(-24, 4, 13, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 身体
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // 肚皮
    ctx.fillStyle = "#FADBD1";
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 头
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.arc(0, -28, 20, 0, Math.PI * 2);
    ctx.fill();

    // 头冠
    ctx.fillStyle = "#EF9F27";
    ctx.beginPath();
    ctx.moveTo(-6, -44);
    ctx.quadraticCurveTo(0, -56, 6, -44);
    ctx.lineTo(2, -38);
    ctx.lineTo(-2, -38);
    ctx.closePath();
    ctx.fill();

    // 眼睛
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, -32, 5, 0, Math.PI * 2);
    ctx.arc(8, -32, 5, 0, Math.PI * 2);
    ctx.fill();

    // 眼神光
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-6, -34, 1.8, 0, Math.PI * 2);
    ctx.arc(10, -34, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 嘴
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-9, -16);
    ctx.lineTo(9, -16);
    ctx.closePath();
    ctx.fill();

    // 微笑
    ctx.strokeStyle = "#D85A30";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, -20, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }, [state, zoom, scene]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative h-full w-full rounded-lg ${onStageClick ? "cursor-pointer" : ""}`}
      aria-label="舞台预览区"
    >
      <canvas ref={canvasRef} className="h-full w-full rounded-lg" aria-label="舞台预览区" />

      {/* 缩放控件 */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)));
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-lg font-medium text-[#04342C] shadow-sm hover:bg-white"
          aria-label="缩小"
        >
          －
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-lg font-medium text-[#04342C] shadow-sm hover:bg-white"
          aria-label="放大"
        >
          ＋
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(1);
          }}
          className="h-8 rounded-lg bg-white/85 px-2 text-xs font-medium text-[#04342C] shadow-sm hover:bg-white"
          aria-label="适应画面"
        >
          适应
        </button>
      </div>
    </div>
  );
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  actorX: number,
  actorY: number,
  text: string,
  stageWidth: number,
  stageHeight: number
) {
  ctx.save();
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  const padding = 14;
  const maxWidth = 200;
  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = 22;
  const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
  const bubbleWidth = textWidth + padding * 2;
  const bubbleHeight = lines.length * lineHeight + padding;

  let bubbleX = actorX + 34;
  let bubbleY = actorY - 70;
  if (bubbleX + bubbleWidth > stageWidth - 10) bubbleX = actorX - bubbleWidth - 34;
  if (bubbleY < 10) bubbleY = actorY + 50;
  bubbleX = Math.max(10, Math.min(bubbleX, stageWidth - bubbleWidth - 10));

  // Bubble shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  roundRect(ctx, bubbleX + 2, bubbleY + 2, bubbleWidth, bubbleHeight, 14);
  ctx.fill();

  // Bubble body
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 14);
  ctx.fill();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 14);
  ctx.stroke();

  ctx.fillStyle = "#04342C";
  lines.forEach((line, index) => {
    ctx.fillText(line, bubbleX + padding, bubbleY + padding + 16 + index * lineHeight);
  });
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const chars = text.split("");
  const lines: string[] = [];
  let currentLine = "";
  for (const char of chars) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [text];
}

function drawStarShape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
