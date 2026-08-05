import type { Metadata } from "next";
import StudioClient from "@/components/StudioClient";

export const metadata: Metadata = {
  title: "造物工坊 - 造物星球",
  description:
    "自由创作你的作品：拖拽积木让二零和三七动起来、画画、做音乐、讲故事，保存到浏览器本地，随时回看展示。",
};

export default function StudioPage() {
  return <StudioClient />;
}
