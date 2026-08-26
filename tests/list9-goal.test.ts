// 分类 G·列表与数据（9-12）共 8 个「看示范」项目，全部依赖「列表」运行时基石
// （setList / listAppend / listItem / listLength / listRemoveAt / listSetItem / getList）。
// 与本阶段其它分类（FN/VAR/MATH/STORY9/MUSIC9）同一套严格验证：
//   1) 真实 codegen 含正确列表标记（setList / listAppend / list reporter）；
//   2) 注入执行无异常、三步进度全部完成（孩子点运行/看示范后弹「完成」）；
//   3) 看示范真的产出列表内容（购物清单念出苹果、成绩统计算出 450 等）；
//   4) 空程序守卫：只「新建列表」而无填充/展示时，step1 之后必不通过、isGoalAchieved 必 false——
//      杜绝「随便搭积木也能通过校验」。
import { describe, it, expect } from "vitest";
import { runDemo, genCode } from "./exec-helpers";
import { computeSteps, isGoalAchieved } from "@/lib/steps";
import { getProject } from "@/courses";
import { Runtime, type StageState } from "@/lib/runtime";

// 每个 slug 期望在运行日志里至少出现的内容（验证「看示范」真把列表展示了出来）
const EXPECT_SAID: Record<string, string[]> = {
  list_shopping: ["苹果", "面包"], // 说 列表 购物清单 → 苹果,香蕉,牛奶,面包
  list_rollcall: ["小明", "小红", "小刚", "小丽", "小华"], // 随机抽到其一
  list_ranking: ["95", "100"], // 说 列表 分数 → 95,88,100,76,60
  list_lottery: ["一等奖", "二等奖", "三等奖", "谢谢参与"], // 随机抽到其一
  list_todo: ["写作业", "看书"], // 说 列表 待办 → 写作业,练琴,运动,看书
  list_words: ["apple", "elephant"], // 说 列表 单词 → apple,banana,cat,dog,elephant
  list_scores: ["450"], // 循环累加 90+85+95+80+100 = 450
  list_queue: ["小猫", "小熊"], // 初始小猫…小狗…小兔；末尾加入小熊
};

const LIST9_SLUGS = Object.keys(EXPECT_SAID);

async function runCustom(xml: string) {
  const code = genCode(xml);
  const logs: string[] = [];
  const rt = new Runtime(480, 360, (s: StageState) => {
    logs.push(...s.log);
  });
  rt.setScripts({ whenStart: code, whenStageClicked: "" });
  await rt.handleRunStart();
  return { code, state: rt.getState(), logs };
}

describe("分类G·列表与数据·端到端真实运行（看示范必须真能跑完且三步全亮）", () => {
  for (const slug of LIST9_SLUGS) {
    it(`${slug}：看示范能真实生成列表代码、无异常、三步全亮`, async () => {
      const { code, logs, steps } = await runDemo(slug);
      // 1) codegen 含核心列表标记
      expect(code).toContain("__runtime.setList(");
      expect(code).toContain("__runtime.listAppend(");
      // 列表 reporter：getList（整表）/ listItem（取项）/ listLength（长度）任一即可，
      // 与 computeSteps 的 hasListReporter 保持一致（点名器/抽奖用 listItem 取随机项，不整表展示）。
      expect(code).toMatch(/__runtime\.(getList|listItem|listLength)\(/);
      // 2) 三步进度全部完成
      expect(steps.length).toBe(3);
      expect(steps.every((s) => s.done)).toBe(true);
      // 3) 运行无崩溃（handleRunStart 内部吞掉异常也会留痕，这里主要靠状态正确 + 下一步断言）
      const joined = logs.join("\n");
      // 4) 看示范真的展示了列表内容
      const expected = EXPECT_SAID[slug];
      expect(expected.some((e) => joined.includes(e))).toBe(true);
    });
  }

  it("list_scores：循环累加真的算出总分 450", async () => {
    const { logs } = await runDemo("list_scores");
    const joined = logs.join("\n");
    expect(joined).toContain("450");
  });

  it("list_queue：末尾加入的小熊真的出现在队伍里", async () => {
    const { logs } = await runDemo("list_queue");
    const joined = logs.join("\n");
    expect(joined).toContain("小熊");
  });

  it("空程序守卫：只「新建列表」而无填充/展示时，判定必不通过", async () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_list_create"><field name="NAME">空表</field></block>
        </statement>
      </block></xml>`;
    const { code, state, logs } = await runCustom(xml);
    const project = getProject("list_shopping")!;
    const steps = computeSteps(project, code, logs);
    // step2（填充列表）必不通过 → 三步并非全亮
    expect(steps.every((s) => s.done)).toBe(false);
    // isGoalAchieved 因无「非空列表」直接返回 false
    expect(isGoalAchieved(project, state, logs)).toBe(false);
  });

  it("半程序守卫：新建并填充列表但不展示，isGoalAchieved 仍不通过", async () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_list_create">
            <field name="NAME">半表</field>
            <next><block type="maker_list_add">
              <field name="NAME">半表</field>
              <value name="VALUE"><shadow type="text"><field name="TEXT">苹果</field></shadow></value>
            </block></next>
          </block>
        </statement>
      </block></xml>`;
    const { state, logs } = await runCustom(xml);
    const project = getProject("list_shopping")!;
    // 列表非空（满足第一项），但未展示 → goal.saidIncludes（苹果）虽命中？
    // 注意：此处并未「说」任何内容，日志不含「苹果」，故 saidIncludes 不命中 → false。
    expect(isGoalAchieved(project, state, logs)).toBe(false);
  });
});
