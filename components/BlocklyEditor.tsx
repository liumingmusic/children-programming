"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { registerCustomBlocks, TOOLBOX } from "@/lib/blockly-blocks";
import { buildFlyoutToolbox } from "@/lib/toolbox-category";
import { collectScripts } from "@/lib/scripts";
import type { ToolboxEntry } from "@/lib/toolbox-category";
import type { Runtime } from "@/lib/runtime";

export interface BlocklyEditorHandle {
  getXml: () => string;
  loadXml: (xml: string) => void;
  getCode: () => string;
  run: (runtime: Runtime) => Promise<void>;
  resetWorkspace: () => void;
  /** 标记当前内容已落盘，避免退出时重复 flush。 */
  markSaved: () => void;
  /**
   * 由外部手风琴工具箱调用：把某个积木（含默认 fields / shadow inputs）添加到画布。
   * 直接用 Blockly 序列化 API 复刻 flyout 拖出的效果，并放到当前可视区域左上角附近。
   */
  addBlock: (type: string, entry?: ToolboxEntry) => void;
}

interface BlocklyEditorProps {
  onChange?: (code: string) => void;
  /** 真实用户改动（非程序化加载）时回调当前积木 XML，供上层做自动保存。 */
  onAutoSave?: (xml: string) => void;
  /**
   * 进入编辑器时拉取「已保存的作品」用于还原画布。
   * 由本组件在 Blockly 注入完成、workspace 一定就绪后调用，
   * 彻底消除「加载早于注入」「editorRef 尚未就绪」两类竞态导致的空白画布。
   */
  bootstrapXml?: () => Promise<string | null>;
  /** 退出（卸载）时若有未落盘的改动，用最新 XML 立即落盘，避免「拖完就走」丢作品。 */
  onFlush?: (xml: string) => void;
  /**
   * 是否关闭 Blockly 自带的 flyout（扁平工具箱）。
   * 默认 true：改用外部自定义「手风琴」工具箱（点击添加）。
   * 设为 false 则保留原生 flyout（如只读演示/回放视图）。
   */
  disableNativeFlyout?: boolean;
  /**
   * 原生「分类 flyout」要展示的分类（可拖拽积木，替代外部手风琴）。
   * 传入该数组时，会自动关闭外部手风琴（disableNativeFlyout 置 false）、
   * 用 buildFlyoutToolbox(categories) 注入带分类与配色的可拖拽工具箱。
   * 不传则维持现状（外部手风琴或只读视图），互不影响。
   */
  toolboxCategories?: string[];
}

const BlocklyEditor = forwardRef<BlocklyEditorHandle, BlocklyEditorProps>(
  function BlocklyEditor(
    { onChange, onAutoSave, bootstrapXml, onFlush, disableNativeFlyout = true, toolboxCategories },
    ref
  ) {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    // 注入初始化 / 程序化 loadXml 期间抑制自动保存，避免把「刚加载的存档」或「看示范」误存成学生作品
    const suppressRef = useRef(false);
    // 用 ref 持有最新回调，保证 inject effect 依赖稳定（[onChange, doLoadXml]），不会因回调变化反复重注入
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onAutoSaveRef = useRef(onAutoSave);
    onAutoSaveRef.current = onAutoSave;
    const bootstrapRef = useRef(bootstrapXml);
    bootstrapRef.current = bootstrapXml;
    const onFlushRef = useRef(onFlush);
    onFlushRef.current = onFlush;

    // 最新一份 XML 与「是否有未保存改动」——供退出时 flush 使用
    const latestXmlRef = useRef("");
    const dirtyRef = useRef(false);

    // 真正的载入逻辑（抽取出来，bootstrap 与命令式 loadXml 共用）
    const doLoadXml = useCallback((xml: string) => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      if (!xml) {
        suppressRef.current = true;
        workspace.clear();
        dirtyRef.current = false;
        latestXmlRef.current = "";
        setTimeout(() => {
          suppressRef.current = false;
        }, 0);
        return;
      }
      let dom: Element | null = null;
      try {
        dom = Blockly.utils.xml.textToDom(xml);
      } catch (e) {
        console.error("Failed to parse Blockly XML, keep current blocks", e);
        return;
      }
      suppressRef.current = true;
      workspace.clear();
      try {
        Blockly.Xml.domToWorkspace(dom, workspace);
      } catch (e) {
        console.error("Failed to load Blockly XML", e);
      }
      latestXmlRef.current = xml;
      dirtyRef.current = false; // 还原的是「已保存内容」，不算脏
      setTimeout(() => {
        suppressRef.current = false;
      }, 0);
    }, []);

    useEffect(() => {
      if (!blocklyDiv.current || workspaceRef.current) return;

      registerCustomBlocks();
      suppressRef.current = true;

      const injectOptions: Blockly.BlocklyOptions = {
        grid: {
          spacing: 20,
          length: 3,
          colour: "#e5e7eb",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 0.85,
        },
        trashcan: true,
        theme: Blockly.Themes.Classic,
      };
      // 不传 toolbox → 不创建原生 flyout，画布占满整块区域，
      // 由外部手风琴面板负责「点击添加积木」。
      // 若传入 toolboxCategories，则注入「分类 flyout」（可拖拽），优先于 disableNativeFlyout 的扁平回退。
      if (toolboxCategories) {
        injectOptions.toolbox = buildFlyoutToolbox(toolboxCategories);
      } else if (!disableNativeFlyout) {
        injectOptions.toolbox = TOOLBOX;
      }

      const workspace = Blockly.inject(blocklyDiv.current, injectOptions);

      workspaceRef.current = workspace;

      const handleChange = () => {
        const code = javascriptGenerator.workspaceToCode(workspace);
        onChangeRef.current?.(code);
        if (!suppressRef.current) {
          const xml = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(workspace));
          latestXmlRef.current = xml;
          dirtyRef.current = true; // 真实改动 → 标记为脏，供退出时 flush
          onAutoSaveRef.current?.(xml);
        }
      };

      workspace.addChangeListener(handleChange);
      handleChange(); // 初始化时 workspace 为空且 suppress 为 true，不会触发自动保存

      // 注入完成后立即还原「已保存作品」：此刻 workspace 一定已就绪，
      // 不再依赖外层 editorRef 异步就绪，从根上消除重进空白画布。
      const boot = bootstrapRef.current;
      if (boot) {
        boot()
          .then((xml) => doLoadXml(xml || ""))
          .catch(() => doLoadXml(""));
      } else {
        setTimeout(() => {
          suppressRef.current = false;
        }, 0);
      }

      return () => {
        workspace.removeChangeListener(handleChange);
        // 退出前 flush 未落盘的改动：必须「确有改动」且「工作区里真有积木」才落盘。
        // 注意不能只判断 xml 字符串非空——空工作区序列化出来是 `<xml .../>`（非空字符串），
        // 那样会把用户已存的作品覆盖成空白画布。故以「实时积木数 > 0」为准。
        const liveWs = workspaceRef.current;
        if (liveWs && dirtyRef.current && liveWs.getAllBlocks().length > 0) {
          try {
            onFlushRef.current?.(
              Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(liveWs))
            );
          } catch {
            /* 落盘失败不阻塞卸载 */
          }
        }
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, [onChange, doLoadXml]);

    useImperativeHandle(ref, () => ({
      getXml: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return "";
        const xml = Blockly.utils.xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        latestXmlRef.current = xml;
        return xml;
      },
      getCode: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return "";
        return javascriptGenerator.workspaceToCode(workspace).toString();
      },
      loadXml: (xml: string) => doLoadXml(xml),
      markSaved: () => {
        dirtyRef.current = false;
      },
      resetWorkspace: () => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        workspace.clear();
        dirtyRef.current = true; // 清空也是改动，退出时会被 flush（若用户未另存）
      },
      addBlock: (type: string, entry?: ToolboxEntry) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        const state: Record<string, unknown> = { type };
        if (entry?.fields && Object.keys(entry.fields).length) {
          state.fields = entry.fields;
        }
        if (entry?.inputs && Object.keys(entry.inputs).length) {
          state.inputs = entry.inputs;
        }
        let block: Blockly.BlockSvg | null = null;
        try {
          block = Blockly.serialization.blocks.append(
            state as unknown as Parameters<typeof Blockly.serialization.blocks.append>[0],
            workspace
          ) as Blockly.BlockSvg | null;
        } catch (e) {
          console.error("addBlock failed", e);
          return;
        }
        if (!block) return;
        // 放到当前可视区域左上角附近（带轻微随机偏移，避免连续添加叠在一起）。
        const metrics = workspace.getMetrics();
        const baseX = (metrics && metrics.viewLeft != null ? metrics.viewLeft : 0) + 40;
        const baseY = (metrics && metrics.viewTop != null ? metrics.viewTop : 0) + 40;
        block.moveBy(baseX + Math.random() * 24, baseY + Math.random() * 24);
        block.select();
      },
      run: async (runtime: Runtime) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;
        // 用 collectScripts 收集事件脚本：会自动把顶层「定义积木」的函数声明
        // 前置到每个事件脚本（修复「函数已定义却被丢弃 → ReferenceError」的 bug）。
        const { whenStart, whenStageClicked, whenKeyPressed, whenReceived } = collectScripts(workspace);
        runtime.setScripts({ whenStart, whenStageClicked, whenKeyPressed, whenReceived });
        await runtime.handleRunStart();
        // 演示用自动触发：有「当舞台被点击」脚本时，自动模拟一次舞台点击（无论是否同时有
        // 「当开始运行」，便于「两个事件组合」类项目在「看示范」时也能把点击分支跑出来）；
        // 否则若有「按下按键」脚本、且没有点击事件，自动模拟一次按键，让键盘操控项目也有可见演示。
        if (whenStageClicked) {
          await runtime.handleStageClick(0, 0);
        } else if (whenKeyPressed.length) {
          await runtime.handleKeyPressed(whenKeyPressed[0].key);
        }
      },
    }));

    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-black/10 bg-white">
        <div ref={blocklyDiv} className="h-full w-full" />
      </div>
    );
  }
);

export default BlocklyEditor;
