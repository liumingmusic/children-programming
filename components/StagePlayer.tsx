"use client";

import { useEffect, useRef } from "react";
import type { StageState } from "@/lib/runtime";

interface StagePlayerProps {
  state: StageState;
}

export default function StagePlayer({ state }: StagePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas size matches displayed size for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid background
    ctx.save();
    ctx.strokeStyle = "rgba(15, 110, 86, 0.08)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y <= rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Coordinate system: center of stage is (0, 0), actor state x/y are relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Draw crosshair at origin
    ctx.save();
    ctx.strokeStyle = "rgba(15, 110, 86, 0.2)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, rect.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(rect.width, centerY);
    ctx.stroke();
    ctx.restore();

    // Draw actor (ErLing the parrot)
    const actorX = centerX + state.actor.x;
    const actorY = centerY - state.actor.y; // Y is up in our model
    const angleRad = ((state.actor.angle - 90) * Math.PI) / 180; // 0 degrees points up in actor model, convert to canvas rotation

    ctx.save();
    ctx.translate(actorX, actorY);
    ctx.rotate(angleRad);

    // Body
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#F5C4B3";
    ctx.beginPath();
    ctx.arc(0, -26, 18, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(-8, -30, 4, 0, Math.PI * 2);
    ctx.arc(8, -30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#D85A30";
    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.lineTo(-8, -14);
    ctx.lineTo(8, -14);
    ctx.closePath();
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#D85A30";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, -18, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Wings
    ctx.fillStyle = "#EF9F27";
    ctx.beginPath();
    ctx.ellipse(22, 4, 12, 8, -0.3, 0, Math.PI * 2);
    ctx.ellipse(-22, 4, 12, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tail feathers
    ctx.fillStyle = "#0F6E56";
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(-10, 48);
    ctx.lineTo(0, 42);
    ctx.lineTo(10, 48);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw speech bubble
    if (state.actor.message) {
      ctx.save();
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
      const padding = 12;
      const maxWidth = 180;
      const lines = wrapText(ctx, state.actor.message, maxWidth);
      const lineHeight = 20;
      const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
      const bubbleWidth = textWidth + padding * 2;
      const bubbleHeight = lines.length * lineHeight + padding;
      let bubbleX = actorX + 30;
      let bubbleY = actorY - 60;
      if (bubbleX + bubbleWidth > rect.width) bubbleX = actorX - bubbleWidth - 30;
      if (bubbleY < 0) bubbleY = actorY + 40;

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#04342C";
      lines.forEach((line, index) => {
        ctx.fillText(line, bubbleX + padding, bubbleY + padding + 14 + index * lineHeight);
      });
      ctx.restore();
    }
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-lg bg-[#E6F1FB]"
      aria-label="舞台预览区"
    />
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split("");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [text];
}
