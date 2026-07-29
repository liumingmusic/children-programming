"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { CourseProject } from "@/courses";
import { getNextProject, getStageOfProject } from "@/courses";
import ErLingAvatar from "@/components/ErLingAvatar";

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  project: CourseProject;
}

/**
 * 任务完成后的庆祝弹窗。
 * - 点击 ✕ 或「返回星球任务」都会关闭（onClose）。
 * - 「查看证书」跳到 /certificate/[slug]。
 * - 若同阶段有下一个项目，提供「挑战下一个」直达。
 */
export default function CompletionModal({ open, onClose, project }: CompletionModalProps) {
  if (!open) return null;

  const nextProject = getNextProject(project.slug);
  const stage = getStageOfProject(project.slug);
  const backHref = stage ? `/missions/${stage.id}` : "/missions";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 rounded-full p-1 text-[#5F5E5A] hover:bg-[#F1EFE8]"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FAEEDA]">
          <ErLingAvatar className="h-14 w-14" />
        </div>
        <h3 className="mb-2 text-xl font-medium text-[#04342C]">任务完成！</h3>
        <p className="mb-6 text-sm text-[#5F5E5A]">
          太棒了！你帮二零完成了这个任务，获得了一颗「创意种子」。接下来想做什么呢？
        </p>
        <div className="flex flex-col gap-3">
          {nextProject && (
            <Link
              href={`/learn/${nextProject.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0F6E56] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#085041]"
            >
              挑战下一个：{nextProject.title}
            </Link>
          )}
          <div className="flex gap-3">
            <Link
              href={backHref}
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#0F6E56]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#0F6E56] hover:bg-[#E1F5EE]"
            >
              返回任务列表
            </Link>
            <Link
              href={`/certificate/${project.slug}`}
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#EF9F27]/30 bg-[#FAEEDA] px-4 py-2.5 text-sm font-medium text-[#412402] hover:bg-[#FAC775]"
            >
              查看证书
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
