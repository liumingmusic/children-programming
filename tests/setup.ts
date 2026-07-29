import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";

// jsdom 没有这些 API，组件/库可能用到，统一打桩避免崩溃
if (!globalThis.requestAnimationFrame) {
  // 让动画一帧内“完成”，避免测试里真实等待 duration
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    cb(performance.now() + 1e9);
    return 0;
  }) as typeof requestAnimationFrame;
}
if (!globalThis.cancelAnimationFrame) {
  globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;
}

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

if (!(globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver) {
  (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Dexie 在测试里用 fake-indexeddb。清掉模块级单例，确保每次测试干净
afterEach(() => {
  // 可选的清理钩子
});
