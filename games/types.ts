// 游戏模块类型定义（单一类型源）。
//
// 注意：registry.ts 只导出「元数据」(GameDefMeta)，不包含 React 组件，
// 以便服务端（generateStaticParams / generateMetadata）安全导入。
// 真正的组件映射放在客户端 games/components/GamePlayer.tsx。

export type GameCategory = "逻辑益智" | "音乐节奏" | "体育竞速" | "物理沙盒";

/** 游戏的静态元数据（无运行时代码，服务端/客户端通用）。 */
export interface GameDefMeta {
  /** 唯一 slug，同时是路由 /playground/[slug] 的段落 */
  slug: string;
  /** 展示标题 */
  title: string;
  /** 卡片/详情用的 emoji 图标 */
  emoji: string;
  /** 推荐年龄文案，如 "6+" / "9+" */
  ageGroup: string;
  /** 一句话简介（卡片与详情展示） */
  description: string;
  /** 分类（用于卡片标签与后续分组） */
  category: GameCategory;
}
