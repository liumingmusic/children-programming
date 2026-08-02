import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import * as Blockly from "blockly";
import BlocklyEditor from "@/components/BlocklyEditor";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { getProject } from "@/courses";
import { clearStore, saveProject, loadProject } from "@/lib/db";

beforeEach(async () => {
  await clearStore();
  registerCustomBlocks();
});

describe("BlocklyEditor 还原与退出落盘（真实组件）", () => {
  // 注意：本文件只放「单实例」测试，避免 jsdom 下 Blockly 的 mainWorkspace 跨注入串台。
  // flush 测试放最前，确保它运行前没有任何其他 inject，getMainWorkspace 才指向本组件的工作区。

  it("退出（卸载）时若有未落盘改动，onFlush 用最新 XML 立即落盘", async () => {
    const onFlush = vi.fn();
    render(<BlocklyEditor bootstrapXml={() => Promise.resolve(null)} onFlush={onFlush} />);

    await waitFor(() => expect(Blockly.getMainWorkspace()).not.toBeNull(), { timeout: 6000 });
    const ws = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;

    // 等 bootstrap 的 release（setTimeout 0）放开 suppress，使后续改动能被标记为 dirty
    await new Promise((r) => setTimeout(r, 50));

    // 模拟「拖入积木」：直接往工作区载入参考答案，触发真实 change → dirty
    const project = getProject("hello")!;
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(project.defaultXml!), ws);
    expect(ws.getAllBlocks().length).toBeGreaterThan(0);

    // 退出：应触发 flush（有改动且非空）
    cleanup();
    expect(onFlush).toHaveBeenCalledTimes(1);
    const arg = onFlush.mock.calls[0][0] as string;
    expect(arg.length).toBeGreaterThan(10);
    expect(arg).toContain("<block");
    cleanup();
  }, 15000);

  it("bootstrapXml 返回的已存作品会在注入后通过 domToWorkspace 还原", async () => {
    const slug = "hello";
    const project = getProject(slug)!;

    // 把参考答案当作「学生已保存作品」写进去
    const div = document.createElement("div");
    document.body.appendChild(div);
    const setup = Blockly.inject(div, {
      toolbox: TOOLBOX,
      grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
      zoom: { controls: true, wheel: true, startScale: 0.85 },
      trashcan: true,
      theme: Blockly.Themes.Classic,
    });
    Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(project.defaultXml!), setup);
    const savedXml = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(setup));
    await saveProject(slug, project.title, "6-8 岁", savedXml);
    setup.dispose();
    document.body.removeChild(div);

    const domSpy = vi.spyOn(Blockly.Xml, "domToWorkspace");
    render(<BlocklyEditor bootstrapXml={() => loadProject(slug)} />);

    // bootstrap 拿到已存作品后应调用 domToWorkspace 还原到画布
    await waitFor(() => expect(domSpy).toHaveBeenCalled(), { timeout: 6000 });
    cleanup();
  }, 15000);
});
