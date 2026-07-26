import * as Blockly from "blockly";
import { javascriptGenerator, Order } from "blockly/javascript";

export const TOOLBOX = {
  kind: "flyoutToolbox" as const,
  contents: [
    { kind: "block" as const, type: "maker_when_start" },
    { kind: "block" as const, type: "maker_move", inputs: { STEPS: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
    { kind: "block" as const, type: "maker_turn", inputs: { DEGREES: { shadow: { type: "math_number", fields: { NUM: 15 } } } } },
    { kind: "block" as const, type: "maker_goto", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 0 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_say", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "你好！我是二零" } } }, SECONDS: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_wait", inputs: { SECONDS: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
  ],
} as unknown as Blockly.utils.toolbox.ToolboxDefinition;

export function registerCustomBlocks() {
  Blockly.common.defineBlocks({
    maker_when_start: {
      init() {
        this.appendDummyInput().appendField("当开始运行");
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(160);
        this.setTooltip("程序开始运行时执行这里的积木");
        this.setHelpUrl("");
        this.setNextStatement(false);
        this.setPreviousStatement(false);
      },
    },
    maker_move: {
      init() {
        this.appendValueInput("STEPS").setCheck("Number").appendField("移动");
        this.appendDummyInput().appendField("步");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零向前移动指定步数");
        this.setHelpUrl("");
      },
    },
    maker_turn: {
      init() {
        this.appendValueInput("DEGREES").setCheck("Number").appendField("右转");
        this.appendDummyInput().appendField("度");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零向右转指定度数");
        this.setHelpUrl("");
      },
    },
    maker_goto: {
      init() {
        this.appendValueInput("X").setCheck("Number").appendField("移到 x:");
        this.appendValueInput("Y").setCheck("Number").appendField("y:");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零直接移动到指定位置");
        this.setHelpUrl("");
      },
    },
    maker_say: {
      init() {
        this.appendValueInput("TEXT").setCheck("String").appendField("说");
        this.appendValueInput("SECONDS").setCheck("Number").appendField("持续");
        this.appendDummyInput().appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("让二零说出一段话");
        this.setHelpUrl("");
      },
    },
    maker_wait: {
      init() {
        this.appendValueInput("SECONDS").setCheck("Number").appendField("等待");
        this.appendDummyInput().appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip("等待指定秒数");
        this.setHelpUrl("");
      },
    },
  });

  // Hat block: when start runs the stack and then ends
  javascriptGenerator.forBlock["maker_when_start"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    return `__runtime.start();\n${stack}__runtime.end();\n`;
  };

  javascriptGenerator.forBlock["maker_move"] = (block, generator) => {
    const value = generator.valueToCode(block, "STEPS", Order.ATOMIC) || "0";
    return `__runtime.move(${value});\n`;
  };

  javascriptGenerator.forBlock["maker_turn"] = (block, generator) => {
    const value = generator.valueToCode(block, "DEGREES", Order.ATOMIC) || "0";
    return `__runtime.turn(${value});\n`;
  };

  javascriptGenerator.forBlock["maker_goto"] = (block, generator) => {
    const x = generator.valueToCode(block, "X", Order.ATOMIC) || "0";
    const y = generator.valueToCode(block, "Y", Order.ATOMIC) || "0";
    return `__runtime.goto(${x}, ${y});\n`;
  };

  javascriptGenerator.forBlock["maker_say"] = (block, generator) => {
    const text = generator.valueToCode(block, "TEXT", Order.ATOMIC) || '""';
    const seconds = generator.valueToCode(block, "SECONDS", Order.ATOMIC) || "2";
    return `__runtime.say(${text}, ${seconds});\n`;
  };

  javascriptGenerator.forBlock["maker_wait"] = (block, generator) => {
    const seconds = generator.valueToCode(block, "SECONDS", Order.ATOMIC) || "1";
    return `__runtime.wait(${seconds});\n`;
  };
}
