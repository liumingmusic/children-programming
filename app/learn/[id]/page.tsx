import { notFound } from "next/navigation";
import LearnPageClient from "@/components/LearnPageClient";
import { getProject } from "@/courses";

export function generateStaticParams() {
  return [{ id: "hello" }, { id: "rainbow" }, { id: "stars" }];
}

interface LearnPageProps {
  params: Promise<{ id: string }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) {
    notFound();
  }
  return <LearnPageClient project={project} />;
}
