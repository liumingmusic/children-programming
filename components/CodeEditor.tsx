"use client";

import { useEffect, useMemo, useRef, useImperativeHandle, forwardRef, useState } from "react";
import dynamic from "next/dynamic";
import { javascript } from "@codemirror/lang-javascript";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ProjectEditorHandle } from "@/components/editorHandle";
import type { Runtime } from "@/lib/runtime";

// 代码编辑器依赖浏览器 DOM（CodeMirror），必须用 ssr:false 动态加载，
// 避免 Next 静态导出在服务器渲染该客户端组件时访问 window/document 崩溃。
const CodeMirror = dynamic<ReactCodeMirrorProps>(
  () => import("@uiw/react-codemirror"),
  { ssr: false }
);

interface CodeEditorProps {
  onChange?: (code: string) => void;
  /** 真实用户改动（非程序化加载）时回调当前代码，供上层做自动保存。 */
  onAutoSave?: (code: string) => void;
  /** 进入编辑器时拉取「已保存的作品」用于还原。无存档时回退到 initialCode。 */
  bootstrapXml?: () => Promise<string | null>;
  /** 退出（卸载）时若有未落盘的改动，用最新代码立即落盘。 */
  onFlush?: (code: string) => void;
  /** 无存档时的初始代码（通常取项目的 defaultCode），给学生一个起点。 */
  initialCode?: string;
  /**
   * 把对外暴露的 handle 通过回调交给父组件。
   * 存在理由同 BlocklyEditor：上层用 next/dynamic 懒加载时 ref 可能透传不进来
   * （ref 为 null 时 useImperativeHandle 的工厂不会被调用），用回调可绕开该问题，
   * 避免「点了保存 / 运行没反应」这类不报错的静默故障。
   */
  onReady?: (handle: ProjectEditorHandle | null) => void;
}

const CodeEditor = forwardRef<ProjectEditorHandle, CodeEditorProps>(
  function CodeEditor({ onChange, onAutoSave, bootstrapXml, onFlush, initialCode, onReady }, ref) {
    const [value, setValue] = useState("");
    // 注入初始化 / 程序化 loadXml 期间抑制自动保存，避免把「刚加载的存档」误存成学生作品
    const suppressRef = useRef(false);
    const latestRef = useRef("");
    const dirtyRef = useRef(false);

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onAutoSaveRef = useRef(onAutoSave);
    onAutoSaveRef.current = onAutoSave;
    const bootstrapRef = useRef(bootstrapXml);
    bootstrapRef.current = bootstrapXml;
    const onFlushRef = useRef(onFlush);
    onFlushRef.current = onFlush;

    useEffect(() => {
      const apply = (saved: string | null) => {
        const initial = saved && saved.trim() ? saved : initialCode ?? "";
        setValue(initial);
        latestRef.current = initial;
        dirtyRef.current = false;
        suppressRef.current = false;
      };
      const boot = bootstrapRef.current;
      if (boot) {
        boot()
          .then((s) => apply(s))
          .catch(() => apply(null));
      } else {
        apply(null);
      }
      return () => {
        // 退出前 flush 未落盘的改动（与 BlocklyEditor 同理，但以「有改动」为准）
        if (dirtyRef.current && latestRef.current.trim()) {
          onFlushRef.current?.(latestRef.current);
        }
      };
      // 仅在挂载时执行一次
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (val: string) => {
      setValue(val);
      latestRef.current = val;
      if (suppressRef.current) return;
      dirtyRef.current = true;
      onChangeRef.current?.(val);
      onAutoSaveRef.current?.(val);
    };

    // 抽成 useMemo 而非直接写在 useImperativeHandle 里：保证 handle 一定会生成，
    // 即使 ref 透传失败（懒加载场景）也能通过 onReady 交给父组件。
    const handle = useMemo<ProjectEditorHandle>(
      () => ({
        getCode: () => latestRef.current,
        // 持久化层复用：代码模式下「xml」payload 即代码文本
        getXml: () => latestRef.current,
        loadXml: (xml: string) => {
          suppressRef.current = true;
          setValue(xml);
          latestRef.current = xml;
          dirtyRef.current = false;
          setTimeout(() => {
            suppressRef.current = false;
          }, 0);
        },
        run: async (runtime: Runtime) => {
          await runtime.runUserCode(latestRef.current);
        },
        resetWorkspace: () => {
          setValue("");
          latestRef.current = "";
          dirtyRef.current = true;
        },
        markSaved: () => {
          dirtyRef.current = false;
        },
      }),
      []
    );

    useImperativeHandle(ref, () => handle, [handle]);

    // 懒加载时 ref 可能透传不进来，用回调兜底把 handle 交给父组件
    const onReadyRef = useRef(onReady);
    useEffect(() => {
      onReadyRef.current = onReady;
    }, [onReady]);
    useEffect(() => {
      onReadyRef.current?.(handle);
      return () => onReadyRef.current?.(null);
    }, [handle]);

    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-black/10 bg-white">
        <CodeMirror
          value={value}
          height="100%"
          theme="light"
          extensions={[javascript()]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
            autocompletion: false,
          }}
          className="h-full text-[13px]"
          style={{ height: "100%" }}
        />
      </div>
    );
  }
);

export default CodeEditor;
