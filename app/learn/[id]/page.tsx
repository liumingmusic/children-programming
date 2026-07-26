import LearnPageClient from "@/components/LearnPageClient";

export function generateStaticParams() {
  return [{ id: "hello" }, { id: "rainbow" }, { id: "stars" }];
}

export default function LearnPage() {
  return <LearnPageClient />;
}
