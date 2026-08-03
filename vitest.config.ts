import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    // 音乐类端到端测试要真实播放音频（按拍 setTimeout 等待），loop_melody 约 4.8s，
    // 故把单测超时从默认 5s 放宽到 15s，避免真实音频等待被误判超时。
    testTimeout: 15000,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
