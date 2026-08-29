import { describe, it, expect } from "vitest";
import { getProject, type CourseProject } from "@/courses";
import { Runtime } from "@/lib/runtime";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { withInstantRaf } from "./exec-helpers";

/**
 * 13-16 · P·网页 / 小游戏（Phase 2e 六项）。
 * 验证：① 数据字段齐备（codeMode + defaultCode + category=web）；
 * ② 默认示范代码运行后通过完成门禁（computeSteps 全绿 + isGoalAchieved 为真）；
 * ③ 空代码 / 缺核心标记不能通过（杜绝随便写几行就过关）；
 * ④ 计算器做「真实 DOM 面板交互」验证：输入算式→点按钮→结果写回。
 * 执行用 withInstantRaf 塌缩动画 / 游戏循环，避免真实播放时长拖慢测试。
 */
async function runCode(code: string) {
  const rt = new Runtime(480, 360, () => {}, undefined, {});
  await withInstantRaf(() => rt.runUserCode(code));
  return rt;
}

const WEB_SLUGS = [
  "web_calculator",
  "web_todo",
  "web_memory",
  "web_typing",
  "web_platformer",
  "web_chatbot",
];

describe("13-16 网页 / 小游戏 · Phase 2e 六项", () => {
  for (const slug of WEB_SLUGS) {
    const project = getProject(slug) as CourseProject | undefined;
    expect(project, `缺少项目 ${slug}`).toBeTruthy();
    if (!project) continue;

    it(`${slug}：数据字段齐备（codeMode + defaultCode + category=web）`, () => {
      expect(project.codeMode).toBe(true);
      expect(typeof project.defaultCode).toBe("string");
      expect(project.defaultCode!.length).toBeGreaterThan(0);
      expect(project.category).toBe("web");
    });

    it(`${slug}：默认示范代码运行后通过完成门禁`, async () => {
      const rt = await runCode(project.defaultCode!);
      const state = rt.getState();
      expect(state.log).toContain("[系统] 程序执行完毕");

      const steps = computeSteps(project, project.defaultCode!, state.log);
      const undone = steps.filter((s) => !s.done).map((s) => s.title);
      expect(undone, `${slug} 未完成的步骤：${undone.join("、")}`).toEqual([]);
      expect(isGoalAchieved(project, state, state.log, project.defaultCode!)).toBe(true);
      rt.stopLoop();
    });

    it(`${slug}：空代码不能通过完成门禁`, async () => {
      const rt = await runCode("");
      expect(isGoalAchieved(project, rt.getState(), rt.getState().log, "")).toBe(false);
      rt.stopLoop();
    });
  }

  // 定向拦截：证明门禁真的在查「对应概念」，而不是跑完就算过
  it("web_calculator：只写注释没输入框不能通过（必须有 input）", async () => {
    const code = "// 我只写了注释，什么也没做\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("web_calculator")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("web_todo：只声明列表不重渲染不能通过（必须 push + clear 重画）", async () => {
    const code = "const tasks = [];\ntasks.push('hi');\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("web_todo")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  it("web_chatbot：只放输入框不写规则不能通过（必须 push + if 关键词）", async () => {
    const code =
      "__runtime.ui.heading('小鹦鹉聊天');\n" +
      "const input = __runtime.ui.input({ placeholder: '说点什么…' });\n" +
      "__runtime.ui.button('发送', { onClick: function () { const m = __runtime.ui.value(input); } });\n";
    const rt = await runCode(code);
    expect(isGoalAchieved(getProject("web_chatbot")!, rt.getState(), rt.getState().log, code)).toBe(false);
    rt.stopLoop();
  });

  // 真实 DOM 面板交互：计算器真的能算
  it("web_calculator：输入 3 + 5 → 点「计算」→ 结果显示 8", async () => {
    const project = getProject("web_calculator")!;
    const rt = await runCode(project.defaultCode!);
    const state = rt.getState();
    const inputEl = state.ui.find((e) => e.kind === "input");
    const btnEl = state.ui.find((e) => e.kind === "button");
    expect(inputEl, "应有输入框").toBeTruthy();
    expect(btnEl, "应有按钮").toBeTruthy();

    // 模拟用户在输入框里打字（uiChange 写回 store，供 __runtime.ui.value 读取）
    rt.uiChange(inputEl!.id, "3 + 5");
    // 模拟点击「计算」按钮（派发 onClick）
    rt.handleUiClick(btnEl!.id);

    const after = rt.getState().ui.find((e) => e.id === inputEl!.id);
    expect(after?.value).toBe("3 + 5 = 8");
    rt.stopLoop();
  });

  // 真实 DOM 面板交互：待办真的能加一条
  it("web_todo：输入任务 → 点「添加」→ 列表出现一条", async () => {
    const project = getProject("web_todo")!;
    const rt = await runCode(project.defaultCode!);
    const state = rt.getState();
    const inputEl = state.ui.find((e) => e.kind === "input");
    const btnEl = state.ui.find((e) => e.kind === "button");
    expect(inputEl).toBeTruthy();
    expect(btnEl).toBeTruthy();

    rt.uiChange(inputEl!.id, "写代码");
    rt.handleUiClick(btnEl!.id);

    const texts = rt.getState().ui.filter((e) => e.kind === "text").map((e) => e.text ?? "");
    expect(texts.some((t) => t.includes("1. 写代码"))).toBe(true);
    rt.stopLoop();
  });

  // 平台跳跃：确认「安全 DOM 面板」与「游戏循环 + 坐标」都真的生效
  it("web_platformer：启动循环并真的把角色落到地面坐标", async () => {
    const project = getProject("web_platformer")!;
    const rt = await runCode(project.defaultCode!);
    const state = rt.getState();
    // 默认代码先 setPos(0, ground=-150)；跑完后角色应在地面附近
    const pos = rt.getPos();
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(-150);
    // 面板里有操作说明（heading + text），证明 DOM 面板被渲染
    expect(state.ui.some((e) => e.kind === "heading")).toBe(true);
    rt.stopLoop();
  });
});
