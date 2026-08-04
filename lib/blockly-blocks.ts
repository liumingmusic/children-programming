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
    { kind: "block" as const, type: "maker_turn_left", inputs: { DEGREES: { shadow: { type: "math_number", fields: { NUM: 15 } } } } },
    { kind: "block" as const, type: "maker_goto", inputs: { X: { shadow: { type: "math_number", fields: { NUM: 0 } } }, Y: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_goto_mouse" },
    { kind: "block" as const, type: "maker_goto_star", inputs: { INDEX: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_say", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "你好！我是二零" } } }, SECONDS: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_wait", inputs: { SECONDS: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_pen_down" },
    { kind: "block" as const, type: "maker_pen_up" },
    { kind: "block" as const, type: "maker_pen_set_color", inputs: { HUE: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_pen_change_color", inputs: { DELTA: { shadow: { type: "math_number", fields: { NUM: 10 } } } } },
    { kind: "block" as const, type: "maker_pen_set_size", inputs: { SIZE: { shadow: { type: "math_number", fields: { NUM: 3 } } } } },
    { kind: "block" as const, type: "maker_touching_star" },
    { kind: "block" as const, type: "maker_when_key_pressed" },
    { kind: "block" as const, type: "maker_touching_edge" },
    { kind: "block" as const, type: "maker_set_size", inputs: { SIZE: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_change_size", inputs: { DELTA: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_pen_is_red" },
    { kind: "block" as const, type: "maker_mouse_x" },
    { kind: "block" as const, type: "maker_mouse_left" },
    { kind: "block" as const, type: "maker_random_int", inputs: { MIN: { shadow: { type: "math_number", fields: { NUM: 1 } } }, MAX: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_set_var" },
    { kind: "block" as const, type: "maker_change_var" },
    { kind: "block" as const, type: "maker_get_var" },
    { kind: "block" as const, type: "maker_mod", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 7 } } }, B: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_compare", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 0 } } }, B: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
    { kind: "block" as const, type: "maker_get_size" },
    { kind: "block" as const, type: "maker_set_expression" },
    { kind: "block" as const, type: "maker_touching_mark" },
    { kind: "block" as const, type: "maker_touching_cloud" },
    // ---- 音乐与节奏分类（分类 8）----
    { kind: "block" as const, type: "maker_play_note", fields: { NOTE: "do" }, inputs: { BEATS: { shadow: { type: "math_number", fields: { NUM: 1 } } } } },
    { kind: "block" as const, type: "maker_play_drum", fields: { KIND: "kick" } },
    { kind: "block" as const, type: "maker_random_note" },
    { kind: "block" as const, type: "maker_play_by_mouse" },
    { kind: "block" as const, type: "maker_play_by_actor" },
    { kind: "block" as const, type: "maker_play_chord", fields: { N1: "do", N2: "mi", N3: "sol" } },
    // ---- 数学启蒙（分类 9）· 算术积木 ----
    { kind: "block" as const, type: "maker_add", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 3 } } }, B: { shadow: { type: "math_number", fields: { NUM: 5 } } } } },
    { kind: "block" as const, type: "maker_sub", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 8 } } }, B: { shadow: { type: "math_number", fields: { NUM: 2 } } } } },
    { kind: "block" as const, type: "maker_mul", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 3 } } }, B: { shadow: { type: "math_number", fields: { NUM: 4 } } } } },
    { kind: "block" as const, type: "maker_div", inputs: { A: { shadow: { type: "math_number", fields: { NUM: 12 } } }, B: { shadow: { type: "math_number", fields: { NUM: 3 } } } } },
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
    maker_turn_left: {
      init() {
        this.appendValueInput("DEGREES").setCheck("Number").appendField("左转");
        this.appendDummyInput().appendField("度");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零向左转指定度数");
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
        this.appendValueInput("TEXT").setCheck(null).appendField("说");
        this.appendValueInput("SECONDS").setCheck("Number").appendField("持续");
        this.appendDummyInput().appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("让二零说出一段话，也能直接把算式的结果（如 3+5）说出来。");
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
    maker_pen_set_size: {
      init() {
        this.appendValueInput("SIZE").setCheck("Number").appendField("设置画笔粗细为");
        this.appendDummyInput().appendField("像素");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("设置画笔线条的粗细，数字越大线条越粗（默认 3）");
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
    maker_when_key_pressed: {
      init() {
        this.appendDummyInput()
          .appendField("当按下")
          .appendField(
            new Blockly.FieldDropdown([
              ["↑ 上", "up"],
              ["↓ 下", "down"],
              ["← 左", "left"],
              ["→ 右", "right"],
            ]),
            "KEY"
          );
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(160);
        this.setTooltip("当按下指定方向键时，执行这里的积木");
        this.setHelpUrl("");
        this.setNextStatement(false);
        this.setPreviousStatement(false);
      },
    },
    maker_touching_edge: {
      init() {
        this.appendDummyInput().appendField("碰到边缘");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果二零正在碰到舞台边缘，返回真");
        this.setHelpUrl("");
      },
    },
    maker_set_size: {
      init() {
        this.appendValueInput("SIZE").setCheck("Number").appendField("将二零大小设为");
        this.appendDummyInput().appendField("倍");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("把二零整体放大或缩小到指定倍数（0.2~5）");
        this.setHelpUrl("");
      },
    },
    maker_change_size: {
      init() {
        this.appendValueInput("DELTA").setCheck("Number").appendField("二零大小增加");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("让二零变大或变小（正数变大，负数变小）");
        this.setHelpUrl("");
      },
    },
    maker_pen_is_red: {
      init() {
        this.appendDummyInput().appendField("画笔是红色");
        this.setOutput(true, "Boolean");
        this.setColour(120);
        this.setTooltip("如果当前画笔颜色是红色，返回真");
        this.setHelpUrl("");
      },
    },
    maker_mouse_x: {
      init() {
        this.appendDummyInput().appendField("鼠标 x 坐标");
        this.setOutput(true, "Number");
        this.setColour(210);
        this.setTooltip("返回最近一次点击鼠标位置的 x 坐标（用于判断点了左半边还是右半边）");
        this.setHelpUrl("");
      },
    },
    maker_mouse_left: {
      init() {
        this.appendDummyInput().appendField("点击在左半边");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果最近一次点击在舞台左半边（x < 0）返回真，否则返回假。常放进「如果…那么…否则」里做左右分支。");
        this.setHelpUrl("");
      },
    },
    maker_random_int: {
      init() {
        this.appendValueInput("MIN").setCheck("Number").appendField("随机整数，从");
        this.appendValueInput("MAX").setCheck("Number").appendField("到");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(60);
        this.setTooltip("随机生成一个在 MIN 到 MAX 之间的整数（含两端）。常放进「如果…那么」做随机选择。");
        this.setHelpUrl("");
      },
    },
    maker_set_var: {
      init() {
        this.appendDummyInput()
          .appendField("把变量")
          .appendField(new Blockly.FieldTextInput("n"), "NAME")
          .appendField("设为");
        this.appendValueInput("VALUE").setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("给一个变量赋值为某个数（变量名默认 n，可改成任意字母）。");
        this.setHelpUrl("");
      },
    },
    maker_change_var: {
      init() {
        this.appendDummyInput()
          .appendField("变量")
          .appendField(new Blockly.FieldTextInput("n"), "NAME")
          .appendField("增加");
        this.appendValueInput("DELTA").setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("让变量的值增加指定数量（负数就是减少）。常放在「重复执行」里做计数。");
        this.setHelpUrl("");
      },
    },
    maker_get_var: {
      init() {
        this.appendDummyInput()
          .appendField("变量")
          .appendField(new Blockly.FieldTextInput("n"), "NAME");
        this.setOutput(true, "Number");
        this.setColour(330);
        this.setTooltip("读取某个变量当前的值，可放进「如果…那么」或算式里。");
        this.setHelpUrl("");
      },
    },
    maker_mod: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("取余数：");
        this.appendValueInput("B").setCheck("Number").appendField("÷");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("求 A 除以 B 的余数（取模）。例如 7 ÷ 2 的余数是 1。常用来判断奇偶（余数是否等于 0）。");
        this.setHelpUrl("");
      },
    },
    maker_compare: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("比较");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["等于", "=="],
            ["小于", "<"],
            ["大于", ">"],
            ["不大于", "<="],
            ["不小于", ">="],
            ["不等于", "!="],
          ]),
          "OP"
        );
        this.appendValueInput("B").setCheck("Number").appendField("与");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("比较两个数字的大小关系，成立时返回真。常放进「如果…那么」的条件里。");
        this.setHelpUrl("");
      },
    },
    // ---- 数学启蒙（分类 9）· 算术积木（值积木，可嵌套、可接进「说」）----
    maker_add: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("");
        this.appendDummyInput().appendField("加");
        this.appendValueInput("B").setCheck("Number").appendField("");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(60);
        this.setTooltip("把两个数相加，得到它们的和。常放进「说」里把结果说出来。");
        this.setHelpUrl("");
      },
    },
    maker_sub: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("");
        this.appendDummyInput().appendField("减");
        this.appendValueInput("B").setCheck("Number").appendField("");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(60);
        this.setTooltip("用第一个数减第二个数，得到差。常放进「说」里把结果说出来。");
        this.setHelpUrl("");
      },
    },
    maker_mul: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("");
        this.appendDummyInput().appendField("乘");
        this.appendValueInput("B").setCheck("Number").appendField("");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(60);
        this.setTooltip("把两个数相乘，得到积。常放进「说」里把结果说出来。");
        this.setHelpUrl("");
      },
    },
    maker_div: {
      init() {
        this.appendValueInput("A").setCheck("Number").appendField("");
        this.appendDummyInput().appendField("除以");
        this.appendValueInput("B").setCheck("Number").appendField("");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setColour(60);
        this.setTooltip("用第一个数除以第二个数，得到商（除以 0 时按除以 1 处理，不会出错）。常放进「说」里把结果说出来。");
        this.setHelpUrl("");
      },
    },
    maker_get_size: {
      init() {
        this.appendDummyInput().appendField("二零当前大小");
        this.setOutput(true, "Number");
        this.setColour(230);
        this.setTooltip("返回二零当前的大小倍数，可放进「如果…那么」做阈值判断（如：如果大小 > 3 就停下）。");
        this.setHelpUrl("");
      },
    },
    maker_set_expression: {
      init() {
        this.appendDummyInput()
          .appendField("让二零表情变成")
          .appendField(
            new Blockly.FieldDropdown([
              ["普通", "normal"],
              ["开心", "happy"],
              ["生气", "angry"],
              ["惊讶", "surprised"],
              ["睡觉", "sleepy"],
            ]),
            "EXPR"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("让二零换上不同的表情（普通 / 开心 / 生气 / 惊讶 / 睡觉）。");
        this.setHelpUrl("");
      },
    },
    maker_touching_mark: {
      init() {
        this.appendDummyInput()
          .appendField("碰到")
          .appendField(
            new Blockly.FieldDropdown([
              ["障碍", "obstacle"],
              ["坏人", "badguy"],
            ]),
            "KIND"
          );
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果二零碰到了对应种类的标记（障碍 / 坏人）返回真。常放进「如果…那么」做躲避。");
        this.setHelpUrl("");
      },
    },
    maker_touching_cloud: {
      init() {
        this.appendDummyInput().appendField("碰到乌云");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果二零碰到了飘动的乌云返回真。常放进「如果…那么」做躲避。");
        this.setHelpUrl("");
      },
    },
    // ---- 音乐与节奏（分类 8）----
    maker_play_note: {
      init() {
        this.appendDummyInput()
          .appendField("弹奏")
          .appendField(
            new Blockly.FieldDropdown([
              ["do", "do"],
              ["re", "re"],
              ["mi", "mi"],
              ["fa", "fa"],
              ["sol", "sol"],
              ["la", "la"],
              ["ti", "ti"],
              ["高音do", "do2"],
            ]),
            "NOTE"
          )
          .appendField("持续");
        this.appendValueInput("BEATS").setCheck("Number").appendField("拍");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("弹奏一个音符（do~ti 或高音do），可设置持续几拍。把几个连起来就能弹出旋律。");
        this.setHelpUrl("");
      },
    },
    maker_play_drum: {
      init() {
        this.appendDummyInput()
          .appendField("敲响")
          .appendField(
            new Blockly.FieldDropdown([
              ["鼓", "kick"],
              ["镲", "hat"],
              ["木鱼", "wood"],
            ]),
            "KIND"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("敲一下鼓 / 镲 / 木鱼，做出节奏。常放进「重复执行」里循环敲击。");
        this.setHelpUrl("");
      },
    },
    maker_random_note: {
      init() {
        this.appendDummyInput().appendField("随机弹一个音");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("让二零从 do~ti 里随机挑一个音弹出来，每次都不一样。");
        this.setHelpUrl("");
      },
    },
    maker_play_by_mouse: {
      init() {
        this.appendDummyInput().appendField("按点击位置弹音（越靠右越高）");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("根据最近一次点击的位置发出不同音高：越靠右声音越高。常放进「当舞台被点击」里。");
        this.setHelpUrl("");
      },
    },
    maker_play_by_actor: {
      init() {
        this.appendDummyInput().appendField("按二零位置弹音（越靠右越高）");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("根据二零当前的位置发出不同音高：越靠右声音越高。常放进「移动」循环里，边走边奏。");
        this.setHelpUrl("");
      },
    },
    maker_play_chord: {
      init() {
        this.appendDummyInput()
          .appendField("弹和弦")
          .appendField(
            new Blockly.FieldDropdown([
              ["do", "do"],
              ["re", "re"],
              ["mi", "mi"],
              ["fa", "fa"],
              ["sol", "sol"],
              ["la", "la"],
              ["ti", "ti"],
              ["高音do", "do2"],
            ]),
            "N1"
          )
          .appendField("+")
          .appendField(
            new Blockly.FieldDropdown([
              ["do", "do"],
              ["re", "re"],
              ["mi", "mi"],
              ["fa", "fa"],
              ["sol", "sol"],
              ["la", "la"],
              ["ti", "ti"],
              ["高音do", "do2"],
            ]),
            "N2"
          )
          .appendField("+")
          .appendField(
            new Blockly.FieldDropdown([
              ["do", "do"],
              ["re", "re"],
              ["mi", "mi"],
              ["fa", "fa"],
              ["sol", "sol"],
              ["la", "la"],
              ["ti", "ti"],
              ["高音do", "do2"],
            ]),
            "N3"
          );
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("同时弹出 3 个音，组成好听的和弦。");
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

  javascriptGenerator.forBlock["maker_turn_left"] = (block, generator) => {
    const value = generator.valueToCode(block, "DEGREES", Order.ATOMIC) || "0";
    return `__runtime.turn(-${value});\n`;
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

  javascriptGenerator.forBlock["maker_pen_set_size"] = (block, generator) => {
    const size = generator.valueToCode(block, "SIZE", Order.ATOMIC) || "3";
    return `__runtime.setPenSize(${size});\n`;
  };

  javascriptGenerator.forBlock["maker_touching_star"] = () => {
    return ["__runtime.touchingStar()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_when_key_pressed"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    return stack;
  };

  javascriptGenerator.forBlock["maker_touching_edge"] = () => {
    return ["__runtime.touchingEdge()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_set_size"] = (block, generator) => {
    const size = generator.valueToCode(block, "SIZE", Order.ATOMIC) || "1";
    return `__runtime.setSize(${size});\n`;
  };

  javascriptGenerator.forBlock["maker_change_size"] = (block, generator) => {
    const delta = generator.valueToCode(block, "DELTA", Order.ATOMIC) || "1";
    return `__runtime.changeSize(${delta});\n`;
  };

  javascriptGenerator.forBlock["maker_pen_is_red"] = () => {
    return ["__runtime.penIsRed()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_mouse_x"] = () => {
    return ["__runtime.mouseX()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_mouse_left"] = () => {
    return ["__runtime.mouseX() < 0", Order.RELATIONAL];
  };

  javascriptGenerator.forBlock["maker_random_int"] = (block, generator) => {
    const min = generator.valueToCode(block, "MIN", Order.ATOMIC) || "1";
    const max = generator.valueToCode(block, "MAX", Order.ATOMIC) || "1";
    return [`(Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min})`, Order.ATOMIC];
  };

  javascriptGenerator.forBlock["maker_set_var"] = (block, generator) => {
    const name = JSON.stringify(block.getFieldValue("NAME"));
    const value = generator.valueToCode(block, "VALUE", Order.ATOMIC) || "0";
    return `__runtime.setVar(${name}, ${value});\n`;
  };

  javascriptGenerator.forBlock["maker_change_var"] = (block, generator) => {
    const name = JSON.stringify(block.getFieldValue("NAME"));
    const delta = generator.valueToCode(block, "DELTA", Order.ATOMIC) || "1";
    return `__runtime.changeVar(${name}, ${delta});\n`;
  };

  javascriptGenerator.forBlock["maker_get_var"] = (block) => {
    const name = JSON.stringify(block.getFieldValue("NAME"));
    return [`__runtime.getVar(${name})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_mod"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "1";
    return [`(${a} % ${b})`, Order.ATOMIC];
  };

  javascriptGenerator.forBlock["maker_compare"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    const op = block.getFieldValue("OP");
    return [`(${a} ${op} ${b})`, Order.RELATIONAL];
  };

  // ---- 数学启蒙（分类 9）· 算术积木生成器 ----
  javascriptGenerator.forBlock["maker_add"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    return [`__runtime.add(${a}, ${b})`, Order.FUNCTION_CALL];
  };
  javascriptGenerator.forBlock["maker_sub"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    return [`__runtime.sub(${a}, ${b})`, Order.FUNCTION_CALL];
  };
  javascriptGenerator.forBlock["maker_mul"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    return [`__runtime.mul(${a}, ${b})`, Order.FUNCTION_CALL];
  };
  javascriptGenerator.forBlock["maker_div"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.ATOMIC) || "0";
    const b = generator.valueToCode(block, "B", Order.ATOMIC) || "0";
    return [`__runtime.div(${a}, ${b})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_get_size"] = () => {
    return ["__runtime.getSize()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_set_expression"] = (block) => {
    const expr = JSON.stringify(block.getFieldValue("EXPR"));
    return `__runtime.setExpression(${expr});\n`;
  };

  javascriptGenerator.forBlock["maker_touching_mark"] = (block) => {
    const kind = JSON.stringify(block.getFieldValue("KIND"));
    return [`__runtime.touchingMark(${kind})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_touching_cloud"] = () => {
    return ["__runtime.touchingCloud()", Order.FUNCTION_CALL];
  };

  // ---- 音乐与节奏（分类 8）----
  javascriptGenerator.forBlock["maker_play_note"] = (block, generator) => {
    const note = JSON.stringify(block.getFieldValue("NOTE"));
    const beats = generator.valueToCode(block, "BEATS", Order.ATOMIC) || "1";
    return `__runtime.playNote(${note}, ${beats});\n`;
  };

  javascriptGenerator.forBlock["maker_play_drum"] = (block) => {
    const kind = JSON.stringify(block.getFieldValue("KIND"));
    return `__runtime.playDrum(${kind});\n`;
  };

  javascriptGenerator.forBlock["maker_random_note"] = () => {
    return "__runtime.playRandomNote();\n";
  };

  javascriptGenerator.forBlock["maker_play_by_mouse"] = () => {
    return "__runtime.playToneByMouseX();\n";
  };

  javascriptGenerator.forBlock["maker_play_by_actor"] = () => {
    return "__runtime.playToneByActorX();\n";
  };

  javascriptGenerator.forBlock["maker_play_chord"] = (block) => {
    const n1 = JSON.stringify(block.getFieldValue("N1"));
    const n2 = JSON.stringify(block.getFieldValue("N2"));
    const n3 = JSON.stringify(block.getFieldValue("N3"));
    return `__runtime.playChord([${n1}, ${n2}, ${n3}]);\n`;
  };
}
