// 站点部署在 GitHub Pages 子路径：/children-programming（与 next.config.ts 的 basePath 保持一致）。
// 本项目用 output:'export' 静态导出，此版本 Next 不会自动为 <img src> 与 metadata.icons 的资源链接补 basePath，
// 故所有指向 public/ 资源的引用必须手动拼接该前缀。改 basePath 时务必同步此处。
export const BASE_PATH = "/children-programming";
