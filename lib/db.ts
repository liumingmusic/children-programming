// 本地作品 / 进度 / 时长存储。
//
// 曾用 Dexie + IndexedDB。但数据库版本从 1 升到 2 时未保留 version(1) 的 schema 定义，
// 导致任何「早先访问过本站点、浏览器里残留旧库」的客户端在升级阶段 open 失败，
// 进而 saveProject / loadProject / markProgress 全部 reject —— 表现为「保存没成功、刷新全是空白」。
// 该失败还被自动保存的 .catch 静默吞掉，肉眼极难发现。
//
// 单机儿童编程项目根本不需要 IndexedDB：改用 localStorage，零升级陷阱、隐私模式下也更稳；
// 单个 blockly XML 仅几 KB，5MB 配额绰绰有余。所有操作都 try/catch 包裹，SSR / 无 storage 环境安全降级。

const NS = "mp";
const K_XML = (slug: string) => `${NS}:xml:${slug}`;
const K_META = (slug: string) => `${NS}:meta:${slug}`;
const K_PROG = (slug: string) => `${NS}:prog:${slug}`;
const K_TIME = (slug: string, date: string) => `${NS}:time:${slug}:${date}`;

function ls(): Storage | null {
  try {
    return typeof window !== "undefined" && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

function get(key: string): string | null {
  const s = ls();
  if (!s) return null;
  try {
    return s.getItem(key);
  } catch {
    return null;
  }
}

function set(key: string, val: string): void {
  const s = ls();
  if (!s) return;
  try {
    s.setItem(key, val);
  } catch (e) {
    // 隐私模式 / 配额满等：记录但不抛，避免阻断 UI
    console.warn("[store] 写入本地存储失败（可能是隐私模式或空间不足）：", e);
  }
}

function del(key: string): void {
  const s = ls();
  if (!s) return;
  try {
    s.removeItem(key);
  } catch {
    /* noop */
  }
}

// 兼容旧调用（部分测试曾引用 db 实例），置空以表明已无 Dexie 实例
export const db: null = null;

export interface Project {
  id?: number;
  slug: string;
  title: string;
  ageGroup: string;
  blocklyXml: string;
  updatedAt: Date;
}

export interface Progress {
  slug: string;
  completed: boolean;
  completedAt?: Date;
  stars: number;
}

export interface TimeLog {
  slug: string;
  date: string;
  seconds: number;
}

export interface TimeStats {
  totalSeconds: number;
  todaySeconds: number;
  byProject: Record<string, number>;
  last7Days: { date: string; seconds: number }[];
}

export async function saveProject(slug: string, title: string, ageGroup: string, blocklyXml: string): Promise<void> {
  set(K_XML(slug), blocklyXml);
  set(K_META(slug), JSON.stringify({ title, ageGroup, updatedAt: new Date().toISOString() }));
}

export async function loadProject(slug: string): Promise<string | null> {
  return get(K_XML(slug));
}

export async function markProgress(slug: string, completed: boolean, stars: number): Promise<void> {
  set(
    K_PROG(slug),
    JSON.stringify({ completed, stars, completedAt: completed ? new Date().toISOString() : null })
  );
}

export async function getProgress(slug: string): Promise<Progress | null> {
  const raw = get(K_PROG(slug));
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    return {
      slug,
      completed: !!o.completed,
      stars: Number(o.stars) || 0,
      completedAt: o.completedAt ? new Date(o.completedAt) : undefined,
    };
  } catch {
    return null;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const s = ls();
  if (!s) return [];
  const out: Project[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k || !k.startsWith(`${NS}:xml:`)) continue;
    const slug = k.slice(`${NS}:xml:`.length);
    const metaRaw = get(K_META(slug));
    const meta = metaRaw ? JSON.parse(metaRaw) : {};
    out.push({
      slug,
      title: meta.title ?? slug,
      ageGroup: meta.ageGroup ?? "",
      blocklyXml: get(k) ?? "",
      updatedAt: meta.updatedAt ? new Date(meta.updatedAt) : new Date(),
    });
  }
  return out;
}

export async function getAllProgress(): Promise<Progress[]> {
  const s = ls();
  if (!s) return [];
  const out: Progress[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k || !k.startsWith(`${NS}:prog:`)) continue;
    const slug = k.slice(`${NS}:prog:`.length);
    const p = await getProgress(slug);
    if (p) out.push(p);
  }
  return out;
}

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function recordSessionTime(slug: string, seconds: number): Promise<void> {
  if (seconds <= 0) return;
  const date = fmtDate(new Date());
  const k = K_TIME(slug, date);
  const prev = Number(get(k) ?? "0") || 0;
  set(k, String(prev + seconds));
}

export async function getTimeStats(): Promise<TimeStats> {
  const s = ls();
  if (!s) return { totalSeconds: 0, todaySeconds: 0, byProject: {}, last7Days: [] };
  const byProject: Record<string, number> = {};
  let totalSeconds = 0;
  const logs: { slug: string; date: string; seconds: number }[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k || !k.startsWith(`${NS}:time:`)) continue;
    const rest = k.slice(`${NS}:time:`.length);
    const idx = rest.lastIndexOf(":");
    if (idx < 0) continue;
    const slug = rest.slice(0, idx);
    const date = rest.slice(idx + 1);
    const seconds = Number(get(k) ?? "0") || 0;
    totalSeconds += seconds;
    byProject[slug] = (byProject[slug] ?? 0) + seconds;
    logs.push({ slug, date, seconds });
  }
  const today = fmtDate(new Date());
  const todaySeconds = logs.filter((l) => l.date === today).reduce((a, l) => a + l.seconds, 0);
  const last7Days: { date: string; seconds: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = fmtDate(d);
    const sec = logs.filter((l) => l.date === ds).reduce((a, l) => a + l.seconds, 0);
    last7Days.push({ date: ds, seconds: sec });
  }
  return { totalSeconds, todaySeconds, byProject, last7Days };
}

/**
 * 计算连续学习天数（基于 mp:time:slug:date 键）。
 *
 * 友好规则：今天没学但昨天学了，仍把昨天的 streak 算上（避免「今天还没学就被算 0」挫败感）；
 * 哪天断了就清零，从更近的日期重新数。
 * @returns 连续天数；从未学习过则返回 0
 */
export async function getStreak(): Promise<number> {
  const s = ls();
  if (!s) return 0;
  const dates = new Set<string>();
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (!k || !k.startsWith(`${NS}:time:`)) continue;
    const rest = k.slice(`${NS}:time:`.length);
    const idx = rest.lastIndexOf(":");
    if (idx < 0) continue;
    const date = rest.slice(idx + 1);
    if (date) dates.add(date);
  }
  if (dates.size === 0) return 0;

  let cur = new Date();
  // 今天没学但昨天学了，streak 不归零
  if (!dates.has(fmtDate(cur))) {
    cur.setDate(cur.getDate() - 1);
    if (!dates.has(fmtDate(cur))) return 0;
  }
  let n = 0;
  while (dates.has(fmtDate(cur))) {
    n++;
    cur.setDate(cur.getDate() - 1);
  }
  return n;
}

// ---- 分类11·PBL 综合（造物工坊）：自由创作的本地存取 ----
// 自由创作作品以 `free:` 前缀的 slug 保存，与课程项目（slug 为课程 id）区分开，
// 避免污染「作品花园」的已保存课程进度，也便于在工坊内单独列出/删除。
export const FREE_PREFIX = "free:";
// 自动保存草稿槽：工坊当前画布实时防抖写入此槽，刷新/离开后再回来不丢工作；
// 它不算「作品」，getAllFreeProjects 会排除它。
export const FREE_DRAFT_SLUG = "free:draft";

/** 取所有「自由创作」命名作品（造物工坊本地保存）。不含自动保存草稿。 */
export async function getAllFreeProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.slug.startsWith(FREE_PREFIX) && p.slug !== FREE_DRAFT_SLUG);
}

/** 删除单个作品（自由创作 / 课程项目通用）：移除 xml / meta / 进度三处 key。 */
export async function deleteProject(slug: string): Promise<void> {
  del(K_XML(slug));
  del(K_META(slug));
  del(K_PROG(slug));
}

// 测试用：清空本应用占用的所有本地存储 key
export async function clearStore(): Promise<void> {
  const s = ls();
  if (!s) return;
  const keys: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k && k.startsWith(`${NS}:`)) keys.push(k);
  }
  for (const k of keys) del(k);
}

// ---- 备份导出 / 导入（纯前端，全过程不经过任何服务器）----
//
// 为什么需要：作品、进度、学习时长**只存在浏览器本地**，清缓存 / 换设备 / 换浏览器就会全部丢失。
// 对孩子来说「辛苦搭的作品没了」是很实在的伤害。这里把本应用占用的全部 `mp:` 键导出成 JSON 文件，
// 家长自行保存；换设备时再导入恢复——不需要注册、不需要后端，也就不收集任何信息。
//
// 设计取舍：
// 1. 直接搬运 `mp:` 前缀的原始键值对，而不是逐个字段序列化。这样未来新增存储字段会自动被囊括，
//    不必回头改备份格式；也避免漏掉某一类数据导致「恢复了作品但进度没了」。
// 2. 只认 `mp:` 前缀：既不把浏览器里其他站点的数据卷进来，导入时也防御脏数据。
// 3. 导入采用「同名覆盖、不清空其他」，而不是「先清空再写入」——后者一旦选错文件，
//    会把现有作品一起抹掉；本地存储没有后端兜底，这个风险不值得冒。

export const BACKUP_FORMAT = "zaowu-backup";
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: string;
  version: number;
  exportedAt: string;
  /** 各类数据条目数，用于导出后给用户一个直观反馈 */
  counts: { projects: number; progress: number; timeLogs: number };
  /** 原始键值对（键均带 `mp:` 前缀） */
  entries: Record<string, string>;
}

/** 导出本应用的全部本地数据为备份对象。 */
export async function exportBackup(): Promise<BackupFile> {
  const s = ls();
  const entries: Record<string, string> = {};
  if (s) {
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i);
      if (!k || !k.startsWith(`${NS}:`)) continue;
      const v = s.getItem(k);
      if (v !== null) entries[k] = v;
    }
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    counts: {
      projects: Object.keys(entries).filter((k) => k.startsWith(`${NS}:xml:`)).length,
      progress: Object.keys(entries).filter((k) => k.startsWith(`${NS}:prog:`)).length,
      timeLogs: Object.keys(entries).filter((k) => k.startsWith(`${NS}:time:`)).length,
    },
    entries,
  };
}

/** 解析并校验备份文本；不是合法备份时返回 null（不抛错，便于 UI 友好提示）。 */
export function parseBackup(text: string): BackupFile | null {
  try {
    const o = JSON.parse(text) as unknown;
    if (!o || typeof o !== "object") return null;
    const b = o as Partial<BackupFile>;
    if (b.format !== BACKUP_FORMAT) return null;
    if (!b.entries || typeof b.entries !== "object") return null;
    return b as BackupFile;
  } catch {
    return null;
  }
}

/**
 * 导入备份：把备份里的键写回本地存储（同名键覆盖，不动其他数据）。
 * @returns 实际写入的条目数
 */
export async function importBackup(backup: BackupFile): Promise<number> {
  let n = 0;
  for (const [k, v] of Object.entries(backup.entries)) {
    if (!k.startsWith(`${NS}:`)) continue;
    if (typeof v !== "string") continue;
    set(k, v);
    n++;
  }
  return n;
}
