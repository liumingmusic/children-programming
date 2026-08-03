import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GamePlayer from "@/games/components/GamePlayer";
import { GAMES, GAME_SLUGS, getGameMeta } from "@/games/registry";

// 静态导出必须预知所有动态段：从注册表生成。
export function generateStaticParams() {
  return GAME_SLUGS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGameMeta(slug);
  return {
    title: g ? `${g.title} - 星球游乐场 - 造物星球` : "星球游乐场 - 造物星球",
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGameMeta(slug);
  if (!g) notFound();
  return <GamePlayer slug={slug} />;
}
