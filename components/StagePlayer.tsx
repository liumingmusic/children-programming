"use client";

import { useEffect, useRef } from "react";
import type { StageState } from "@/lib/runtime";

interface StagePlayerProps {
  state: StageState;
}

export default function StagePlayer({ state }: StagePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; alpha: number; twinkle: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Lazy-init twinkling stars background
    if (starsRef.current.length === 0) {
      const count = 40;
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0B1C3F");
    gradient.addColorStop(1, "#162B55");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(performance.now() / 800 + star.twinkle) * 0.2 + star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, twinkle)})`;
      ctx.fill();
    });

    // Draw subtle grid
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Draw crosshair at origin
    ctx.save();
    ctx.strokeStyle = "rgba(93, 202, 165, 0.25)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.restore();

    // Draw stage label
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    ctx.fillText("舞台中心", centerX + 6, centerY - 6);

    // Draw pen paths (under actor)
    const toCanvasPoint = (p: { x: number; y: number }) => ({
      x: centerX + p.x,
      y: centerY - p.y,
    });

    const drawPath = (path: { points: { x: number; y: number }[]; color: string }, lineWidth = 3) => {
      if (path.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = path.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const start = toCanvasPoint(path.points[0]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < path.points.length; i++) {
        const pt = toCanvasPoint(path.points[i]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    state.penPaths.forEach((path) => drawPath(path));
    if (state.currentPath) drawPath(state.currentPath);

    // Draw stars
    state.stars.forEach((star) => {
      if (star.collected) return;
      const sx = centerX + star.x;
      const sy = centerY - star.y;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = "#FFD93D";
      ctx.shadowColor = "#FFD93D";
      ctx.shadowBlur = 12;
      drawStarShape(ctx, 0, 0, 5, 14, 7);
      ctx.fill();
      ctx.restore();
    });

    // Actor coordinates
    const actorX = centerX + state.actor.x;
    const actorY = centerY - state.actor.y;
    const angleRad = ((state.actor.angle - 90) * Math.PI) / 180;

    // Draw speech bubble first so it can be above actor
    if (state.actor.message) {
      drawSpeechBubble(ctx, actorX, actorY, state.actor.message, width, height);
    }

    // Draw actor (ErLing the parrot)
    ctx.save();
    ctx.translate(actorX, actorY);
    ctx.rotate(angleRad);

    // Tail feathers
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(-12, 52);
    ctx.lineTo(0, 44);
    ctx.lineTo(12, 52);
    ctx.closePath();
    ctx.fill();

    // Wings
    ctx.fillStyle = "#EF9F27";
    ctx.beginPath();
    ctx.ellipse(24, 4, 13, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(-24, 4, 13, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly highlight
    ctx.fillStyle = "#FADBD1";
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.arc(0, -28, 20, 0, Math.PI * 2);
    ctx.fill();

    // Head crest (parrot tuft)
    ctx.fillStyle = "#EF9F27";
    ctx.beginPath();
    ctx.moveTo(-6, -44);
    ctx.quadraticCurveTo(0, -56, 6, -44);
    ctx.lineTo(2, -38);
    ctx.lineTo(-2, -38);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, -32, 5, 0, Math.PI * 2);
    ctx.arc(8, -32, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-6, -34, 1.8, 0, Math.PI * 2);
    ctx.arc(10, -34, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-9, -16);
    ctx.lineTo(9, -16);
    ctx.closePath();
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#D85A30";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, -20, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-lg"
      aria-label="舞台预览区"
    />
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

function drawStarShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
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
