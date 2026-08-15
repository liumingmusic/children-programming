import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { Runtime } from "@/lib/runtime";
import { BLOCK_CATALOG } from "@/lib/block-catalog";
import { computeSteps } from "@/lib/steps";
import { getProject } from "@/courses";
import { genScripts } from "./exec-helpers";

/**
 * 9-12 分类 C（多角色）引擎能力：
 *  - P0-1 角色间空间交互（touchingActor/distanceTo）
 *  - P0-2 角色间消息广播（broadcast / when_receive）
 * 校验：运行时语义、积木→代码生成、编译器收集、catalog↔toolbox 对称。
 */

describe("P0-1 运行时 · 角色间空间查询", () => {
  it("touchingActor / distanceTo 以「当前控制角色」为基准，且随距离变化", () => {
    const rt = new Runtime(480, 360, () => {}, undefined, {
      companions: [{ id: "sanqi", species: "sanqi", name: "三七" }],
    });
    const s = (rt as unknown as { state: { actors: { id: string; x: number; y: number; size: number }[] } }).state;
    const erling = s.actors.find((a) => a.id === "erling")!;
    const sanqi = s.actors.find((a) => a.id === "sanqi")!;

    // 二者重合：距离为 0，应判定碰到
    erling.x = 0; erling.y = 0; sanqi.x = 0; sanqi.y = 0;
    expect(rt.distanceTo("sanqi")).toBeCloseTo(0, 5);
    expect(rt.touchingActor("sanqi")).toBe(true);

    // 拉开 100 单位：不再碰到，距离约 100
    sanqi.x = 100; sanqi.y = 0;
    expect(rt.distanceTo("sanqi")).toBeCloseTo(100, 5);
    expect(rt.touchingActor("sanqi")).toBe(false);

    // 自比较永不碰到
    expect(rt.touchingActor("erling")).toBe(false);
    // 不存在的角色：距离 Infinity、不碰到
    expect(rt.distanceTo("nobody")).toBe(Infinity);
    expect(rt.touchingActor("nobody")).toBe(false);
  });
});

describe("P0-1 积木 · 代码生成", () => {
  it("maker_touching_actor 生成 __runtime.touchingActor(...)", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const dom = Blockly.utils.xml.textToDom(
      `<xml><block type="maker_touching_actor"><field name="ACTOR">sanqi</field></block></xml>`
    );
    Blockly.Xml.domToWorkspace(dom, ws);
    const code = javascriptGenerator.workspaceToCode(ws).toString();
    expect(code).toContain(`__runtime.touchingActor("sanqi")`);
  });

  it("maker_distance_to 生成 __runtime.distanceTo(...)", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const dom = Blockly.utils.xml.textToDom(
      `<xml><block type="maker_distance_to"><field name="ACTOR">sanqi</field></block></xml>`
    );
    Blockly.Xml.domToWorkspace(dom, ws);
    const code = javascriptGenerator.workspaceToCode(ws).toString();
    expect(code).toContain(`__runtime.distanceTo("sanqi")`);
  });
});

describe("P0-1 catalog ↔ toolbox 对称", () => {
  it("两个新积木同时登记在 TOOLBOX 与 BLOCK_CATALOG", () => {
    const toolboxTypes = (TOOLBOX as unknown as { contents: { type: string }[] }).contents.map(
      (c) => c.type
    );
    const catalogIds = new Set(BLOCK_CATALOG.map((d) => d.id));
    for (const id of ["maker_touching_actor", "maker_distance_to"]) {
      expect(toolboxTypes, `TOOLBOX 漏登记 ${id}`).toContain(id);
      expect(catalogIds.has(id), `BLOCK_CATALOG 漏登记 ${id}`).toBe(true);
    }
    // 分类一致：两者都归在「侦测」
    const touching = BLOCK_CATALOG.find((d) => d.id === "maker_touching_actor")!;
    const dist = BLOCK_CATALOG.find((d) => d.id === "maker_distance_to")!;
    expect(touching.category).toBe("侦测");
    expect(dist.category).toBe("侦测");
    expect(touching.shape).toBe("boolean");
    expect(dist.shape).toBe("reporter");
  });
});

describe("P0-2 积木 · 代码生成与编译器收集", () => {
  it("maker_broadcast 生成 __runtime.broadcast(\"出发\")", () => {
    registerCustomBlocks();
    const ws = new Blockly.Workspace();
    const dom = Blockly.utils.xml.textToDom(
      `<xml><block type="maker_broadcast"><field name="MSG">出发</field></block></xml>`
    );
    Blockly.Xml.domToWorkspace(dom, ws);
    const code = javascriptGenerator.workspaceToCode(ws).toString();
    expect(code).toContain(`__runtime.broadcast("出发")`);
  });

  it("编译器把 maker_when_receive 帽收集进 whenReceived（消息名匹配广播）", () => {
    const xml = `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="maker_when_start" x="40" y="40">
        <statement name="STACK">
          <block type="maker_broadcast"><field name="MSG">出发</field></block>
        </statement>
      </block>
      <block type="maker_when_receive" x="40" y="200">
        <field name="MSG">出发</field>
        <statement name="STACK">
          <block type="maker_say">
            <value name="TEXT"><shadow type="text"><field name="TEXT">收到</field></shadow></value>
            <value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value>
          </block>
        </statement>
      </block>
    </xml>`;
    const { whenStart, whenReceived } = genScripts(xml);
    expect(whenStart).toContain(`__runtime.broadcast("出发")`);
    expect(whenReceived.length).toBe(1);
    expect(whenReceived[0].message).toBe("出发");
    expect(whenReceived[0].code).toContain("__runtime.say(");
    expect(whenReceived[0].code).toContain("收到");
  });
});

describe("P0-2 运行时 · 广播触发接收脚本", () => {
  it("broadcast 让接收角色在广播瞬间立即响应（动作被插到广播之后）", async () => {
    const logs: string[] = [];
    const rt = new Runtime(
      480,
      360,
      (s) => logs.push(...s.log),
      undefined,
      { companions: [{ id: "sanqi", species: "sanqi", name: "三七" }] }
    );
    rt.setScripts({
      whenStart: '__runtime.controlActor("erling"); __runtime.broadcast("出发");',
      whenStageClicked: "",
      whenKeyPressed: [],
      whenReceived: [
        { message: "出发", code: '__runtime.controlActor("sanqi"); __runtime.say("收到啦", 0.01);' },
      ],
    });
    await rt.handleRunStart();
    // 广播动作已执行
    expect(logs.some((l) => l.includes("广播消息"))).toBe(true);
    // 接收脚本确实被触发
    expect(logs.some((l) => l.includes("接收到消息"))).toBe(true);
    // 接收角色（三七）确实说出了内容
    expect(logs.some((l) => l.includes("收到啦"))).toBe(true);
  });
});

describe("P0-2 catalog ↔ toolbox 对称", () => {
  it("maker_broadcast / maker_when_receive 同时登记在 TOOLBOX 与 BLOCK_CATALOG", () => {
    const toolboxTypes = (TOOLBOX as unknown as { contents: { type: string }[] }).contents.map(
      (c) => c.type
    );
    const catalogIds = new Set(BLOCK_CATALOG.map((d) => d.id));
    for (const id of ["maker_broadcast", "maker_when_receive"]) {
      expect(toolboxTypes, `TOOLBOX 漏登记 ${id}`).toContain(id);
      expect(catalogIds.has(id), `BLOCK_CATALOG 漏登记 ${id}`).toBe(true);
    }
    const broadcast = BLOCK_CATALOG.find((d) => d.id === "maker_broadcast")!;
    const receive = BLOCK_CATALOG.find((d) => d.id === "maker_when_receive")!;
    expect(broadcast.category).toBe("事件");
    expect(receive.category).toBe("事件");
    expect(broadcast.shape).toBe("statement");
    expect(receive.shape).toBe("hat");
  });
});

describe("分类 C · 剩余 4 项（对话 / 接力 / 合唱 / 排队）", () => {
  const NEW = ["two_actor_chat", "relay_race", "chorus", "animal_queue"];

  it("4 个 slug 都已注册且 defaultXml 含对应多角色积木", () => {
    for (const s of NEW) {
      const p = getProject(s);
      expect(p, `未注册 ${s}`).toBeTruthy();
      expect(p!.defaultXml, `${s} 缺 defaultXml`).toBeTruthy();
    }
    const xml = (s: string) => getProject(s)!.defaultXml!;
    expect(xml("two_actor_chat")).toContain("maker_control_actor");
    expect(xml("two_actor_chat")).toContain("maker_say");
    expect(xml("relay_race")).toContain("maker_broadcast");
    expect(xml("relay_race")).toContain("maker_when_receive");
    expect(xml("relay_race")).toContain("maker_move");
    expect(xml("chorus")).toContain("maker_play_note");
    expect(xml("chorus")).toContain("maker_play_chord");
    expect(xml("animal_queue")).toContain("maker_distance_to");
    expect(xml("animal_queue")).toContain("maker_move");
  });

  it("4 项 defaultXml 均能成功生成代码（无解析 / 生成错误）", () => {
    for (const s of NEW) {
      const { whenStart, whenReceived } = genScripts(getProject(s)!.defaultXml!);
      expect(whenStart.length).toBeGreaterThan(0);
      // relay_race 含「当接收到」帽子，其余只有 when_start
      if (s === "relay_race") expect(whenReceived.length).toBe(1);
    }
  });

  it("合唱团：maker_play_note / maker_play_chord 生成对应 __runtime 调用", () => {
    const { whenStart } = genScripts(getProject("chorus")!.defaultXml!);
    expect(whenStart).toContain("__runtime.playNote(");
    expect(whenStart).toContain("__runtime.playChord(");
  });

  it("排队的动物：defaultXml 代码生成含 distanceTo 与 move", () => {
    const { whenStart } = genScripts(getProject("animal_queue")!.defaultXml!);
    expect(whenStart).toContain('__runtime.distanceTo("erling")');
    expect(whenStart).toContain("__runtime.move(");
  });

  it("4 项 computeSteps 三步全绿（控制双角色 + 各自核心动作 + 跑完）", () => {
    const cases: Record<string, string> = {
      two_actor_chat:
        '__runtime.controlActor("erling"); __runtime.say("hi"); __runtime.controlActor("sanqi"); __runtime.say("yo");',
      relay_race:
        '__runtime.controlActor("erling"); __runtime.move(30); __runtime.broadcast("接棒"); __runtime.controlActor("sanqi"); __runtime.move(30);',
      chorus:
        '__runtime.controlActor("erling"); __runtime.playNote("do"); __runtime.controlActor("sanqi"); __runtime.playChord(["do","mi","sol"]);',
      animal_queue:
        '__runtime.controlActor("erling"); __runtime.move(20); __runtime.controlActor("sanqi"); __runtime.distanceTo("erling"); __runtime.move(20);',
    };
    const logs = ["[系统] 开始执行程序", "[系统] 程序执行完毕"];
    for (const [slug, code] of Object.entries(cases)) {
      const p = getProject(slug)!;
      expect(computeSteps(p, code, logs).map((s) => s.done), `${slug} 三步`).toEqual([
        true,
        true,
        true,
      ]);
    }
  });

  it("两个角色对话：缺三七控制时第 2 步不算完成", () => {
    const p = getProject("two_actor_chat")!;
    // 只有二零说话，没有控制三七
    const code = '__runtime.controlActor("erling"); __runtime.say("hi");';
    const logs = ["[系统] 开始执行程序", "[系统] 程序执行完毕"];
    const steps = computeSteps(p, code, logs);
    expect(steps[0].done).toBe(true);
    expect(steps[1].done).toBe(false);
    expect(steps[2].done).toBe(true);
  });
});
