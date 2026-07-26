import { notFound } from "next/navigation";
import CertificateClient from "@/components/CertificateClient";
import { getProject } from "@/courses";

export function generateStaticParams() {
  return [{ slug: "hello" }, { slug: "rainbow" }, { slug: "stars" }];
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
