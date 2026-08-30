import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearnPageClient from "@/components/LearnPageClient";
import { getProject, projects, getCategoryLabel } from "@/courses";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

interface LearnPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 每个项目页自己的 title / description。
 *
 * 此前没有这个导出，243 个学习页全部继承 layout 的全局 title，
 * 全站「唯一 title 数量 = 1」——对搜索引擎就是一片重复内容。
 * 而自然搜索是免费产品唯一的流量入口，等于 243 页白做。
 * 标题带上学段与分类短标签（如「9-12 岁·函数」），可覆盖更多长尾词。
 */
export async function generateMetadata({ params }: LearnPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return { title: "项目不存在" };

  const cat = getCategoryLabel(project.category);
  return {
    title: `${project.title}（${project.ageGroup}·${cat}）`,
    description: project.description,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) {
    notFound();
  }
  return <LearnPageClient project={project} />;
}
