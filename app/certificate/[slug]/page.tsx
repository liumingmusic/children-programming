import { notFound } from "next/navigation";
import CertificateClient from "@/components/CertificateClient";
import { getProject, projects } from "@/courses";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

interface CertificatePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { slug } = await params;
  if (!getProject(slug)) {
    notFound();
  }
  return <CertificateClient slug={slug} />;
}
