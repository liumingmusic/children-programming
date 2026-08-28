import type { Runtime } from "@/lib/runtime";

/**
 * 学习页编辑器统一句柄：积木编辑器（BlocklyEditor）与代码编辑器（CodeEditor）都实现它，
 * 使 LearnPageClient 一套逻辑兼容「拖积木」与「写 JavaScript」两种模式，无需大量分支。
 */
export interface ProjectEditorHandle {
  /** 取当前生成的 JavaScript（积木模式=由积木生成的代码；代码模式=学生写的文本）。 */
  getCode(): string;
  /** 取可持久化内容（积木模式=XML；代码模式=代码文本）。供自动保存 / 还原复用，payload 语义随模式不同。 */
  getXml(): string;
  /** 还原已保存内容（积木模式=注入 XML；代码模式=填充代码文本）。 */
  loadXml(xml: string): void;
  /** 在给定运行时上运行当前作品。 */
  run(runtime: Runtime): Promise<void>;
  /** 清空工作区（积木模式=清空画布；代码模式=清空代码）。 */
  resetWorkspace(): void;
  /** 标记当前内容已落盘，避免退出时重复 flush。 */
  markSaved(): void;
  /** 由外部工具箱调用：把某个积木添加到画布（仅积木模式实现）。 */
  addBlock?: (type: string, entry?: unknown) => void;
}
