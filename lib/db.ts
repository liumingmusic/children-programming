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
