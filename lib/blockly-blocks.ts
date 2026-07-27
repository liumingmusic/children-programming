import * as Blockly from "blockly";
import { javascriptGenerator, Order } from "blockly/javascript";

export const TOOLBOX = {
  kind: "flyoutToolbox" as const,
  contents: [
    { kind: "block" as const, type: "maker_when_start" },
    { kind: "block" as const, type: "maker_when_stage_clicked" },
    { kind: "block" as const, type: "controls_repeat_ext", inputs: { TIMES: { shadow: { type: "math_number", fields: { NUM: 10 } } } } },
    { kind: "block" as const, type: "controls_if" },
    { kind: "block" as const, type: "maker_move", inputs: { STEPS: { shadow: { type: "math_number", fields: { NUM: 100 } } } } },
    { kind: "block" as const, type: "maker_turn", inputs: { DEGREES: { shadow: { type: "math_number", fields: { NUM: 15 } } } } },
    { kind: "block" as const, type: "maker_goto", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 0 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_goto_mouse" },
    { kind: "block" as const, type: "maker_goto_star", inputs: { INDEX: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_say", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "你好！我是二零" } } }, SECONDS: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_wait", inputs: { SECONDS: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_pen_down" },
    { kind: "block" as const, type: "maker_pen_up" },
    { kind: "block" as const, type: "maker_pen_set_color", inputs: { HUE: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_pen_change_color", inputs: { DELTA: { shadow: { type: "math_number", fields: { NUM: 10 } } } } },
    { kind: "block" as const, type: "maker_touching_star" },
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
    maker_when_stage_clicked: {
      init() {
        this.appendDummyInput().appendField("当舞台被点击");
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(170);
        this.setTooltip("点击舞台时执行这里的积木");
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
    maker_goto_mouse: {
      init() {
        this.appendDummyInput().appendField("移到鼠标位置");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零飞到鼠标点击的位置");
        this.setHelpUrl("");
      },
    },
    maker_goto_star: {
      init() {
        this.appendValueInput("INDEX").setCheck("Number").appendField("飞向星星");
        this.appendDummyInput().appendField("号");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零飞向指定编号的星星并收集它");
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
    maker_pen_down: {
      init() {
        this.appendDummyInput().appendField("落笔");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("开始画画");
        this.setHelpUrl("");
      },
    },
    maker_pen_up: {
      init() {
        this.appendDummyInput().appendField("抬笔");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("停止画画");
        this.setHelpUrl("");
      },
    },
    maker_pen_set_color: {
      init() {
        this.appendValueInput("HUE").setCheck("Number").appendField("设置画笔颜色为");
        this.appendDummyInput().appendField("(0-360)");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("设置画笔颜色，数字 0-360 代表色相");
        this.setHelpUrl("");
      },
    },
    maker_pen_change_color: {
      init() {
        this.appendValueInput("DELTA").setCheck("Number").appendField("画笔颜色增加");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("让画笔颜色增加指定数值");
        this.setHelpUrl("");
      },
    },
    maker_touching_star: {
      init() {
        this.appendDummyInput().appendField("碰到星星");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果二零正在碰到星星，返回真");
        this.setHelpUrl("");
      },
    },
  });

  // Hat block: when start runs the stack and then ends
  javascriptGenerator.forBlock["maker_when_start"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    return stack;
  };

  javascriptGenerator.forBlock["maker_when_stage_clicked"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    return stack;
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

  javascriptGenerator.forBlock["maker_goto_mouse"] = () => {
    return `__runtime.gotoMouse();\n`;
  };

  javascriptGenerator.forBlock["maker_goto_star"] = (block, generator) => {
    const index = generator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    return `__runtime.gotoStar(${index} - 1);\n`;
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

  javascriptGenerator.forBlock["maker_pen_down"] = () => {
    return "__runtime.penDown();\n";
  };

  javascriptGenerator.forBlock["maker_pen_up"] = () => {
    return "__runtime.penUp();\n";
  };

  javascriptGenerator.forBlock["maker_pen_set_color"] = (block, generator) => {
    const hue = generator.valueToCode(block, "HUE", Order.ATOMIC) || "0";
    return `__runtime.setPenColor(${hue});\n`;
  };

  javascriptGenerator.forBlock["maker_pen_change_color"] = (block, generator) => {
    const delta = generator.valueToCode(block, "DELTA", Order.ATOMIC) || "10";
    return `__runtime.changePenColor(${delta});\n`;
  };

  javascriptGenerator.forBlock["maker_touching_star"] = () => {
    return ["__runtime.touchingStar()", Order.FUNCTION_CALL];
  };
}
