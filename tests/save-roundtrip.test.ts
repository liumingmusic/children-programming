import { describe, it, expect } from "vitest";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { saveProject, loadProject } from "@/lib/db";
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

// 复刻 BlocklyEditor.getXml
function getXml(ws: Blockly.WorkspaceSvg): string {
  return Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(ws));
}
// 复刻 BlocklyEditor.loadXml（含解析失败保护）
function loadXml(ws: Blockly.WorkspaceSvg, xml: string) {
  ws.clear();
  if (!xml) return;
  const dom = Blockly.utils.xml.textToDom(xml);
  Blockly.Xml.domToWorkspace(dom, ws);
}

describe("保存往返（复刻线上 getXml/loadXml + Dexie）", () => {
  it("defaultXml 经 getXml→save→load→loadXml 能完整还原积木", async () => {
    const slug = "flag";
    const project = getProject(slug)!;
    expect(project.defaultXml).toBeTruthy();

    const ws = injectWs();
    loadXml(ws, project.defaultXml!);
    const blocksBefore = ws.getAllBlocks().length;
    expect(blocksBefore).toBeGreaterThan(0);

    const xml = getXml(ws);
    expect(xml.length).toBeGreaterThan(0);
    await saveProject(slug, project.title, "6-8 岁", xml);

    const loaded = await loadProject(slug);
    expect(loaded).not.toBeNull();

    const ws2 = injectWs();
    loadXml(ws2, loaded ?? "");
    const blocksAfter = ws2.getAllBlocks().length;
    expect(blocksAfter).toBe(blocksBefore);

    ws.dispose();
    ws2.dispose();
  });
});
