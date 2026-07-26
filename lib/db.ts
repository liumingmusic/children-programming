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

class MakerDatabase extends Dexie {
  projects!: Dexie.Table<Project, number>;
  progress!: Dexie.Table<Progress, number>;

  constructor() {
    super("MakerPlanet");
    this.version(1).stores({
      projects: "++id, slug, updatedAt",
      progress: "++id, slug",
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
