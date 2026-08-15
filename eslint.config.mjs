import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 静态导出产物目录：dist/ 是压缩后的打包文件，不应被 ESLint 扫描
    // （否则会产生数千条 no-unused-expressions 噪声与虚假错误）。
    "dist/**",
  ]),
  {
    // 本工程是动画/游戏密集平台，以下 react-hooks 规则会误报「固有写法」：
    // - react-hooks/refs：游戏循环常用 ref 存最新回调 / 读 ref 计算派生值（如 useGameLoop）。
    // - react-hooks/set-state-in-effect：从 localStorage 初始化状态是刻意的（SSR / 隐私模式安全降级）。
    // - react-hooks/immutability：游戏状态存于 ref 中按需可变，并非 React state。
    // 这些模式经测试覆盖且运行正常，故在项目范围关闭，避免噪声掩盖真实问题。
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
