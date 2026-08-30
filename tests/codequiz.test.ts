import { describe, it, expect } from "vitest";
import { getProject, getStageProjects, getStageCategories, CATEGORIES } from "@/courses";

const QUIZ_SLUGS = ["read_loops", "read_vars"];

describe("读代码（component=codequiz）项目", () => {
  it("两个项目都已注册，且标记为 codequiz 组件、属于 code 分类", () => {
    for (const slug of QUIZ_SLUGS) {
      const p = getProject(slug);
      expect(p, `${slug} 应存在`).toBeTruthy();
      expect(p!.component).toBe("codequiz");
      expect(p!.ageGroup).toBe("9-12 岁");
      expect(p!.category).toBe("code");
    }
    const slugs = getStageProjects("stage-9-12").map((p) => p.slug);
    for (const slug of QUIZ_SLUGS) expect(slugs).toContain(slug);
  });

  it("题目数量与步骤数量一致（一步一题，答对即点亮该步）", () => {
    for (const slug of QUIZ_SLUGS) {
      const p = getProject(slug)!;
      expect(p.quiz, `${slug} 应有题库`).toBeTruthy();
      expect(p.quiz!.length).toBe(p.steps.length);
    }
  });

  it("每道题数据完整：有代码、有问题、选项≥2、答案下标合法、有解析", () => {
    for (const slug of QUIZ_SLUGS) {
      const p = getProject(slug)!;
      p.quiz!.forEach((q, i) => {
        const tag = `${slug} 第 ${i + 1} 题`;
        expect(q.code.trim(), `${tag} 缺代码`).not.toBe("");
        expect(q.question.trim(), `${tag} 缺问题`).not.toBe("");
        expect(q.options.length, `${tag} 选项太少`).toBeGreaterThanOrEqual(2);
        expect(q.answer, `${tag} 答案下标越界`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${tag} 答案下标越界`).toBeLessThan(q.options.length);
        expect(q.explain.trim(), `${tag} 缺解析`).not.toBe("");
        // 选项不能为空、也不能重复，否则孩子根本无法区分
        expect(q.options.every((o) => o.trim() !== ""), `${tag} 存在空选项`).toBe(true);
        expect(new Set(q.options).size, `${tag} 选项重复`).toBe(q.options.length);
      });
    }
  });

  it("题干是真正的 JavaScript，且与 13-16 手写代码用同一套 __runtime API", () => {
    for (const slug of QUIZ_SLUGS) {
      const p = getProject(slug)!;
      for (const q of p.quiz!) {
        expect(q.code, `${slug} 题干应含 __runtime 调用`).toContain("__runtime.");
      }
    }
  });

  it("读代码项目不走积木/代码编辑器（无 defaultXml、非 codeMode）", () => {
    for (const slug of QUIZ_SLUGS) {
      const p = getProject(slug)!;
      expect(p.defaultXml).toBeUndefined();
      expect(p.codeMode).toBeUndefined();
    }
  });
});

describe("9-12 新增 code 分类的注册位置", () => {
  it("code 分类排在所有结构化分类之后、自由创作（pbl）之前", () => {
    const ids = CATEGORIES["stage-9-12"].map((c) => c.id);
    expect(ids).toContain("code");
    expect(ids.indexOf("code")).toBeGreaterThan(ids.indexOf("science"));
    expect(ids.indexOf("code")).toBeLessThan(ids.indexOf("pbl"));
  });

  it("code 分类非空（含 2 个读代码项目），会出现在按分类分组结果里", () => {
    const cats = getStageCategories("stage-9-12");
    const code = cats.find((c) => c.id === "code");
    expect(code).toBeTruthy();
    expect(code!.projects.map((p) => p.slug)).toEqual(["read_loops", "read_vars"]);
  });

  it("读代码项目排在 9-12 学习路径的最后（之前是 game 收尾）", () => {
    const slugs = getStageProjects("stage-9-12").map((p) => p.slug);
    expect(slugs.slice(-2)).toEqual(["read_loops", "read_vars"]);
  });
});
