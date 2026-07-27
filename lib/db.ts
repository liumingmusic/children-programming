import Dexie from "dexie";

export interface Project {
  id?: number;
  slug: string;
  title: string;
  ageGroup: string;
  blocklyXml: string;
  updatedAt: Date;
}

export interface Progress {
  id?: number;
  slug: string;
  completed: boolean;
  completedAt?: Date;
  stars: number;
}

export interface TimeLog {
  id?: number;
  slug: string;
  date: string; // YYYY-MM-DD
  seconds: number;
}

export interface TimeStats {
  totalSeconds: number;
  todaySeconds: number;
  byProject: Record<string, number>;
  last7Days: { date: string; seconds: number }[];
}

class MakerDatabase extends Dexie {
  projects!: Dexie.Table<Project, number>;
  progress!: Dexie.Table<Progress, number>;
  timeLogs!: Dexie.Table<TimeLog, number>;

  constructor() {
    super("MakerPlanet");
    this.version(2).stores({
      projects: "++id, slug, updatedAt",
      progress: "++id, slug",
      timeLogs: "++id, [slug+date], date",
    });
  }
}

export const db = typeof window === "undefined" ? null : new MakerDatabase();

export async function saveProject(slug: string, title: string, ageGroup: string, blocklyXml: string) {
  if (!db) return;
  const existing = await db.projects.where("slug").equals(slug).first();
  if (existing) {
    await db.projects.update(existing.id!, { blocklyXml, updatedAt: new Date() });
  } else {
    await db.projects.add({ slug, title, ageGroup, blocklyXml, updatedAt: new Date() });
  }
}

export async function loadProject(slug: string): Promise<string | null> {
  if (!db) return null;
  const project = await db.projects.where("slug").equals(slug).first();
  return project?.blocklyXml || null;
}

export async function markProgress(slug: string, completed: boolean, stars: number) {
  if (!db) return;
  const existing = await db.progress.where("slug").equals(slug).first();
  if (existing) {
    await db.progress.update(existing.id!, {
      completed,
      completedAt: completed ? new Date() : existing.completedAt,
      stars,
    });
  } else {
    await db.progress.add({
      slug,
      completed,
      completedAt: completed ? new Date() : undefined,
      stars,
    });
  }
}

export async function getProgress(slug: string): Promise<Progress | null> {
  if (!db) return null;
  return (await db.progress.where("slug").equals(slug).first()) || null;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!db) return [];
  return await db.projects.toArray();
}

export async function getAllProgress(): Promise<Progress[]> {
  if (!db) return [];
  return await db.progress.toArray();
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function recordSessionTime(slug: string, seconds: number) {
  if (!db || seconds <= 0) return;
  const date = today();
  const existing = await db.timeLogs.where({ slug, date }).first();
  if (existing) {
    await db.timeLogs.update(existing.id!, { seconds: existing.seconds + seconds });
  } else {
    await db.timeLogs.add({ slug, date, seconds });
  }
}

export async function getTimeStats(): Promise<TimeStats> {
  if (!db) {
    return { totalSeconds: 0, todaySeconds: 0, byProject: {}, last7Days: [] };
  }
  const logs = await db.timeLogs.toArray();
  const totalSeconds = logs.reduce((sum, log) => sum + log.seconds, 0);
  const date = today();
  const todaySeconds = logs.filter((log) => log.date === date).reduce((sum, log) => sum + log.seconds, 0);
  const byProject: Record<string, number> = {};
  for (const log of logs) {
    byProject[log.slug] = (byProject[log.slug] || 0) + log.seconds;
  }

  const last7Days: { date: string; seconds: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const seconds = logs.filter((log) => log.date === ds).reduce((sum, log) => sum + log.seconds, 0);
    last7Days.push({ date: ds, seconds });
  }

  return { totalSeconds, todaySeconds, byProject, last7Days };
}
