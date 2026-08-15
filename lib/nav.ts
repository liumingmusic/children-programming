export interface NavItem {
  label: string;
  href: string;
}

/** 全站导航项（单一数据源）。新增模块只需在此追加一项，所有页面的导航自动更新。 */
export const NAV_ITEMS: NavItem[] = [
  { label: "星球任务", href: "/missions" },
  { label: "平台指南", href: "/guide" },
  { label: "星球游乐场", href: "/playground" },
  { label: "造物工坊", href: "/studio" },
  { label: "组件库", href: "/toolbox" },
  { label: "作品花园", href: "/gallery" },
  { label: "家长入口", href: "/parent" },
];
