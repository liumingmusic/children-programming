import { describe, it, expect } from "vitest";
import { diagnoseRuntimeError, precheckSyntax } from "@/lib/steps";

describe("diagnoseRuntimeError", () => {
  it("把语法错误翻译成友好的配对提示", () => {
    const out = diagnoseRuntimeError("[系统] 程序出错：SyntaxError: Unexpected token }");
    expect(out).toContain("括号");
    expect(out).toContain("引号");
  });

  it("把未定义引用翻译成名字拼写提示", () => {
    const out = diagnoseRuntimeError("[系统] 程序出错：ReferenceError: foo is not defined");
    expect(out).toContain("不认识的名字");
    expect(out).toContain("let");
  });

  it("把类型错误翻译成函数名/参数提示", () => {
    const out = diagnoseRuntimeError("[系统] 程序出错：TypeError: bar is not a function");
    expect(out).toContain("用法不太对");
    expect(out).toContain("函数名");
  });

  it("把范围错误翻译成循环次数提示", () => {
    const out = diagnoseRuntimeError("[系统] 程序出错：RangeError: Maximum call stack size exceeded");
    expect(out).toContain("范围");
    expect(out).toContain("循环");
  });

  it("未知错误给出兜底提示而非崩溃", () => {
    const out = diagnoseRuntimeError("[系统] 程序出错：SomeWeirdError: boom");
    expect(out.length).toBeGreaterThan(0);
  });
});

describe("precheckSyntax", () => {
  it("合法代码返回 null", () => {
    expect(precheckSyntax("let a = 1;\n__runtime.move(a);")).toBeNull();
  });

  it("括号不配对能抓出并给出行号提示", () => {
    const out = precheckSyntax("function f() {\n  __runtime.move(10);\n");
    expect(out).not.toBeNull();
    expect(out!).toContain("语法小问题");
  });

  it("引号不闭合能抓出", () => {
    const out = precheckSyntax("__runtime.say('hello);");
    expect(out).not.toBeNull();
    expect(out!).toContain("引号");
  });
});
