// 构建后扫描 dist/ 实际产物生成 sitemap.xml。
// 原因：项目有 243 个项目页 + 几十个静态路由，且站点是「在 GitHub Pages
// 子路径下、含 basePath」，手写或 Next.js 内置 sitemap 都容易数错/路径错；
// 直接扫 dist/ 保证与产物逐一对齐。

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist";
const BASE = "https://liumingmusic.github.io/children-programming";
// 主页 / missions / parent / studio / gallery / certificate 优先级更高
const HIGH = new Set(["index.html", "missions/index.html", "parent/index.html", "studio/index.html", "gallery/index.html", "certificate/index.html"]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(relative(DIST, p));
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error("[gen-sitemap] dist/ 不存在，请先 npm run build");
  process.exit(1);
}

const files = walk(DIST).filter((f) => {
  // 不收录：Next.js 自动生成的错误页、内部页（搜索引擎抓到会报错）
  if (f === "404.html" || f === "_not-found.html") return false;
  if (f.startsWith("_")) return false;
  return true;
});
const urls = files.map((f) => {
  // dist/index.html → /；dist/missions/stage-6-8/index.html → /missions/stage-6-8
  let urlPath = "/" + f.split(sep).join("/").replace(/\.html$/, "").replace(/\/index$/, "");
  if (urlPath === "/index") urlPath = "/";
  const pri = HIGH.has(f) ? "1.0" : "0.7";
  return { loc: `${BASE}${urlPath}`, pri };
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, pri }) => `  <url>\n    <loc>${loc}</loc>\n    <priority>${pri}</priority>\n  </url>`).join("\n")}
</urlset>
`;

writeFileSync(join(DIST, "sitemap.xml"), xml, "utf-8");
console.log(`[gen-sitemap] 已生成 sitemap.xml，共 ${urls.length} 条 URL（高优先级 ${HIGH.size} 条）`);
