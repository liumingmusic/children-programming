import { describe, it, expect, beforeEach } from "vitest";
import * as Blockly from "blockly";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { saveProject, loadProject, clearStore } from "@/lib/db";
import { getProject } from "@/courses";

function injectWs() {
  registerCustomBlocks();
  const div = document.createElement("div");
  document.body.appendChild(div);
  return Blockly.inject(div, {
    toolbox: TOOLBOX,
    grid: { spacing: 20, length: 3, colour: "#eee", snap: true },
    zoom: { controls: true, wheel: true, startScale: 0.85 },
    trashcan: true,
    theme: Blockly.Themes.Classic,
  });
}
function getXml(ws: Blockly.WorkspaceSvg) {
  return Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(ws));
}
function loadXml(ws: Blockly.WorkspaceSvg, xml: string) {
  ws.clear();
  if (!xml) return;
  const dom = Blockly.utils.xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(dom, ws);
}

describe("两次注入+加载（模拟退出再进入）", () => {
  beforeEach(async () => { await clearStore(); });
  it("cycle1 save, cycle2 reload 还原", async () => {
    const slug = "hello";
    const project = getProject(slug)!;

    const ws1 = injectWs();
    loadXml(ws1, project.defaultXml!);
    expect(ws1.getAllBlocks().length).toBeGreaterThan(0);
    const xml = getXml(ws1);
    await saveProject(slug, project.title, "6-8 岁", xml);
    ws1.dispose();

    const loaded = await loadProject(slug);
    expect(loaded).toBeTruthy();

    const ws2 = injectWs();
    // 关键：ws2 是不是 headless？渲染块会不会抛错？
    let threw = "";
    try {
      loadXml(ws2, loaded ?? "");
    } catch (e) {
      threw = e instanceof Error ? e.message : String(e);
    }
    console.log("[DIAG2] ws2.rendered=", (ws2 as unknown as { rendered: boolean }).rendered, "blocks=", ws2.getAllBlocks().length, "threw=", threw);
    expect(threw).toBe("");
    expect(ws2.getAllBlocks().length).toBeGreaterThan(0);
    ws2.dispose();
  });
});
