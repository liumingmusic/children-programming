"use client";

import { useEffect, useRef, useState } from "react";
import type { StageState } from "@/lib/runtime";
import type { ProjectScene } from "@/courses";

interface StagePlayerProps {
  state: StageState;
  scene?: ProjectScene;
  onStageClick?: (x: number, y: number) => void;
  /** 时间轴控件回调（仅当 state.timeline 存在时由上层传入并显示控件）。 */
  onTimeline?: {
    onPlayPause: () => void;
    onSeek: (t: number) => void;
    onSpeed: (s: number) => void;
  };
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

/** 根据角色表情绘制不同的脸（在已 translate/rotate 到角色本体的局部坐标系内调用）。 */
function drawFace(ctx: CanvasRenderingContext2D, expr: string | undefined) {
  const eyeY = -32;
  ctx.lineCap = "round";
  if (expr === "happy") {
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-8, eyeY + 2, 5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(8, eyeY + 2, 5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.arc(0, -19, 9, 0.1, Math.PI - 0.1);
    ctx.fill();
    ctx.fillStyle = "rgba(216,90,48,0.35)";
    ctx.beginPath();
    ctx.arc(-14, -20, 4, 0, Math.PI * 2);
    ctx.arc(14, -20, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (expr === "angry") {
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-13, eyeY - 4); ctx.lineTo(-3, eyeY + 1);
    ctx.moveTo(13, eyeY - 4); ctx.lineTo(3, eyeY + 1);
    ctx.stroke();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, eyeY + 3, 4, 0, Math.PI * 2);
    ctx.arc(8, eyeY + 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -13, 7, Math.PI + 0.2, -0.2);
    ctx.stroke();
  } else if (expr === "surprised") {
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, eyeY, 6, 0, Math.PI * 2);
    ctx.arc(8, eyeY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-6, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.arc(10, eyeY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.ellipse(0, -17, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (expr === "sleepy") {
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-13, eyeY); ctx.lineTo(-3, eyeY);
    ctx.moveTo(3, eyeY); ctx.lineTo(13, eyeY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -17, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, eyeY, 5, 0, Math.PI * 2);
    ctx.arc(8, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-6, eyeY - 2, 1.8, 0, Math.PI * 2);
    ctx.arc(10, eyeY - 2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-9, -16);
    ctx.lineTo(9, -16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#D85A30";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -20, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

/** 画二零（小太阳鹦鹉）的本体（不含脸，脸由 drawFace 统一画）。局部坐标：本体朝「上」(-y)。 */
function drawErlingBody(ctx: CanvasRenderingContext2D) {
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
}

/** 画三七（玄凤鹦鹉 cockatiel）的本体：灰蓝身 + 奶黄尖冠 + 橙脸颊点 + 长尾，与二零同家族但明显区分。 */
function drawSanqiBody(ctx: CanvasRenderingContext2D) {
  // 长尾（灰）
  ctx.fillStyle = "#64748B";
  ctx.beginPath();
  ctx.moveTo(0, 24);
  ctx.lineTo(-8, 62);
  ctx.lineTo(0, 52);
  ctx.lineTo(8, 62);
  ctx.closePath();
  ctx.fill();

  // 翅膀（略深灰）
  ctx.fillStyle = "#475569";
  ctx.beginPath();
  ctx.ellipse(22, 4, 12, 9, -0.3, 0, Math.PI * 2);
  ctx.ellipse(-22, 4, 12, 9, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 身体（灰蓝）
  ctx.fillStyle = "#64748B";
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // 肚皮（浅灰）
  ctx.fillStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.ellipse(0, 8, 15, 19, 0, 0, Math.PI * 2);
  ctx.fill();

  // 头（灰）
  ctx.fillStyle = "#64748B";
  ctx.beginPath();
  ctx.arc(0, -26, 19, 0, Math.PI * 2);
  ctx.fill();

  // 黄色尖冠（向后上方）
  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  ctx.moveTo(-4, -42);
  ctx.quadraticCurveTo(0, -58, 4, -42);
  ctx.lineTo(2, -36);
  ctx.lineTo(-2, -36);
  ctx.closePath();
  ctx.fill();

  // 橙脸颊点（玄凤标志）
  ctx.fillStyle = "#F97316";
  ctx.beginPath();
  ctx.arc(13, -22, 5, 0, Math.PI * 2);
  ctx.arc(-13, -22, 5, 0, Math.PI * 2);
  ctx.fill();
}

interface View {
  scale: number;
  /** 内容包围盒中心（世界坐标） */
  cx: number;
  cy: number;
}

export default function StagePlayer({ state, scene, onStageClick, onTimeline }: StagePlayerProps) {
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

    // Background gradient（支持「切换场景」与「时间轴背景色相 bgHue」）
    const gradient = ctx.createLinearGradient(0, 0, 0, ch);
    // 时间轴科学项目：用 bgHue（0=白昼浅蓝 → 240=夜晚深蓝）实时插值背景，呈现昼夜/四季渐变
    const bgHue = (state as unknown as { bgHue?: number }).bgHue;
    if (typeof bgHue === "number") {
      const k = Math.max(0, Math.min(1, bgHue / 240));
      const topL = 62 - k * 38;
      const botL = 46 - k * 36;
      gradient.addColorStop(0, `hsl(${bgHue}, 58%, ${topL}%)`);
      gradient.addColorStop(1, `hsl(${bgHue}, 64%, ${botL}%)`);
    } else if (state.scene?.bg) {
      const m = state.scene.bg.match(/linear-gradient\(([^)]+)\)/);
      const cols = m ? m[1].split(",").map((s) => s.trim()).filter(Boolean) : null;
      if (cols && cols.length >= 2) {
        gradient.addColorStop(0, cols[0]);
        gradient.addColorStop(1, cols[1]);
      } else {
        gradient.addColorStop(0, "#0B1C3F");
        gradient.addColorStop(1, "#162B55");
      }
    } else {
      gradient.addColorStop(0, "#0B1C3F");
      gradient.addColorStop(1, "#162B55");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cw, ch);

    // 场景标签（左上角，切场景后提示当前场景）
    if (state.scene?.label) {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`📍 ${state.scene.label}`, 10, 10);
      ctx.restore();
    }

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

    // ---- 固定参考系镜头：仅依据「静态场景（星星/标记/墙）+ 默认舞台范围」计算，运行期间恒定 ----
    // 关键修复：原先每帧用「角色当前位置 + 实时笔迹」的包围盒重算 scale/cx/cy，
    // 导致运行时画面突然缩放一下、且参考系随角色漂移——视觉上就像「倒着走 / 方向错乱」。
    // 现在镜头只看静态布景 + 一个固定默认舞台范围，跑动时绝不重新取景，方向也就真实可信了。
    const pad = 24;
    // 默认舞台范围取舞台自身半宽高（480×360 → ±240×±180），保证绝大多数内容可见且比例正确。
    const defaultHalfW = state.width / 2;
    const defaultHalfH = state.height / 2;
    let minX = -defaultHalfW;
    let maxX = defaultHalfW;
    let minY = -defaultHalfH;
    let maxY = defaultHalfH;
    const add = (x: number, y: number) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    };
    state.stars.forEach((s) => add(s.x, s.y));
    if (scene?.marks) scene.marks.forEach((m) => add(m.x, m.y));
    if (scene?.walls) scene.walls.forEach((w) => { add(w.x1, w.y1); add(w.x2, w.y2); });
    // 角色起始位置 (0,0) 已在默认盒内，无需额外 add；实时笔迹/角色当前位置故意不纳入，保证镜头稳定。
    const contentW = Math.max(maxX - minX, 1);
    const contentH = Math.max(maxY - minY, 1);
    const fit = Math.min((cw - pad * 2) / contentW, (ch - pad * 2) / contentH);
    const scale = Math.max(0.12, Math.min(fit * zoom, 6));
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

    // 乌云（会动，躲避类项目）：半透明灰色云团，随运行时飘移实时重绘
    if (state.clouds && state.clouds.length) {
      state.clouds.forEach((c) => {
        const p = toScreen(c.x, c.y);
        const r = Math.max(14, c.r * scale);
        ctx.save();
        ctx.fillStyle = "rgba(120, 130, 145, 0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.arc(p.x - r * 0.7, p.y + 4 * scale, r * 0.7, 0, Math.PI * 2);
        ctx.arc(p.x + r * 0.7, p.y + 4 * scale, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = `${Math.max(12, 16 * scale)}px -apple-system, BlinkMacSystemFont, "PingFang SC", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("☁", p.x, p.y);
        ctx.restore();
      });
    }

    // 苹果（会下落，接苹果 / 反应力游戏用）：红苹果 emoji，随运行时实时重绘
    if (state.apples && state.apples.length) {
      state.apples.forEach((a) => {
        const p = toScreen(a.x, a.y);
        const r = Math.max(12, a.r * scale);
        ctx.save();
        ctx.font = `${Math.max(16, 22 * scale)}px -apple-system, BlinkMacSystemFont, "PingFang SC", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🍎", p.x, p.y);
        ctx.restore();
      });
    }

    // 每个角色：先画说话气泡（位于角色之上），再按物种画角色本体
    for (const act of state.actors) {
      if (!act.visible) continue;
      if (act.message) {
        const a = toScreen(act.x, act.y);
        drawSpeechBubble(ctx, a.x, a.y, act.message, cw, ch);
      }
    }
    for (const act of state.actors) {
      if (!act.visible) continue;
      const a = toScreen(act.x, act.y);
      const angleRad = ((act.angle + 90) * Math.PI) / 180;
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.scale(ACTOR_SCALE * (act.size ?? 1), ACTOR_SCALE * (act.size ?? 1));
      ctx.rotate(angleRad);
      if (act.species === "sanqi") drawSanqiBody(ctx);
      else drawErlingBody(ctx);
      drawFace(ctx, act.expression);
      ctx.restore();
    }

    // 粒子层（分类10·科学：雨 / 雪 / 火山岩浆）。世界坐标 -> 屏幕坐标绘制。
    const parts = state.particles;
    if (parts && parts.length) {
      ctx.save();
      for (const p of parts) {
        const sp = toScreen(p.x, p.y);
        if (p.kind === "rain") {
          // 雨：细长斜线，方向由速度决定
          const dx = (p.vx / Math.max(1, Math.abs(p.vy))) * 8;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y);
          ctx.lineTo(sp.x + dx, sp.y + 8);
          ctx.stroke();
        } else if (p.kind === "snow") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 火山岩浆：发光圆点，随 age 淡出
          const fade = Math.max(0.2, 1 - p.age / p.life);
          ctx.globalAlpha = fade;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();
    }
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

      {/* 时间轴控件（分类10·科学）：播放/暂停 + 变速 + 可拖动进度条 + 当前/总时长 */}
      {(() => {
        const tl = state.timeline;
        if (!tl || !onTimeline) return null;
        return (
          <div
            className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded-xl bg-black/45 px-3 py-2 text-white backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onTimeline.onPlayPause}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-[#04342C] hover:bg-white"
              aria-label={tl.playing ? "暂停" : "播放"}
            >
              {tl.playing ? "⏸" : "▶"}
            </button>
            <span className="shrink-0 font-mono text-xs tabular-nums">
              {tl.time.toFixed(1)}/{tl.duration.toFixed(1)}s
            </span>
            <input
              type="range"
              min={0}
              max={tl.duration}
              step={0.1}
              value={tl.time}
              onChange={(e) => onTimeline.onSeek(parseFloat(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/30 accent-emerald-400"
              aria-label="时间轴进度"
            />
            <div className="flex shrink-0 items-center gap-1">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onTimeline.onSpeed(s)}
                  className={`h-7 rounded-md px-2 text-xs font-medium ${
                    tl.speed === s ? "bg-emerald-400 text-[#04342C]" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  aria-label={`${s}倍速`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        );
      })()}
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
