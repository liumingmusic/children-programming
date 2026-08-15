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
    { kind: "block" as const, type: "maker_touching_actor", fields: { ACTOR: "sanqi" } },
    { kind: "block" as const, type: "maker_distance_to", fields: { ACTOR: "sanqi" } },
    { kind: "block" as const, type: "maker_touching_apple" },
    { kind: "block" as const, type: "maker_when_receive", fields: { MSG: "出发" } },
    { kind: "block" as const, type: "maker_broadcast", fields: { MSG: "出发" } },
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
    // ---- 故事与角色（分类 7）----
    { kind: "block" as const, type: "maker_control_actor", fields: { ACTOR: "erling" } },
    { kind: "block" as const, type: "maker_show_actor", fields: { ACTOR: "sanqi" } },
    { kind: "block" as const, type: "maker_hide_actor", fields: { ACTOR: "sanqi" } },
    { kind: "block" as const, type: "maker_set_scene", fields: { SCENE: "day" } },
    // ---- 科学探究（分类 10）· 时间轴 / 粒子 / 颜色 ----
    { kind: "block" as const, type: "maker_when_start_tl" },
    { kind: "block" as const, type: "maker_tween_prop", fields: { ACTOR: "erling", PROP: "y", A: "0", B: "-100", T0: "0", T1: "5" } },
    { kind: "block" as const, type: "maker_orbit", fields: { ACTOR: "erling", LOOPS: "1", T0: "0", T1: "6" } },
    { kind: "block" as const, type: "maker_when_at_say", fields: { ACTOR: "erling", T: "3", TEXT: "看，变化发生了！", SECONDS: "2" } },
    { kind: "block" as const, type: "maker_when_at_scene", fields: { T: "4", SCENE: "day" } },
    { kind: "block" as const, type: "maker_emit_rain", fields: { T0: "0", T1: "8", RATE: "20", SMIN: "120", SMAX: "200" } },
    { kind: "block" as const, type: "maker_emit_snow", fields: { T0: "0", T1: "8", RATE: "15", SMIN: "40", SMAX: "80" } },
    { kind: "block" as const, type: "maker_emit_lava", fields: { T0: "0", T1: "8", RATE: "25", SMIN: "120", SMAX: "200" } },
    { kind: "block" as const, type: "maker_mix_color", fields: { C1: "红", C2: "黄" } },
    // ---- 9-12 阶段 · 函数与自定义积木（分类 A）----
    { kind: "block" as const, type: "maker_func_def", fields: { NAME: "我的积木" }, inputs: { DO: {} } },
    { kind: "block" as const, type: "maker_func_call", fields: { NAME: "我的积木" } },
    // ---- 9-12 阶段 · 变量与状态进阶（分类 B）：计时器 / 最高分 ----
    { kind: "block" as const, type: "maker_now" },
    { kind: "block" as const, type: "maker_best_get", fields: { KEY: "得分" } },
    { kind: "block" as const, type: "maker_best_set", fields: { KEY: "得分" }, inputs: { VALUE: { shadow: { type: "math_number", fields: { NUM: 0 } } } } },
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
              ["A · 哆", "a"],
              ["S · 来", "s"],
              ["D · 米", "d"],
              ["F · 发", "f"],
              ["G · 索", "g"],
              ["H · 拉", "h"],
              ["J · 西", "j"],
              ["K · 哆↑", "k"],
            ]),
            "KEY"
          );
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(160);
        this.setTooltip("当按下指定方向键（或字母键 A S D F G H J K 弹琴）时，执行这里的积木");
        this.setHelpUrl("");
        this.setNextStatement(false);
        this.setPreviousStatement(false);
      },
    },
    maker_when_receive: {
      init() {
        this.appendDummyInput()
          .appendField("当接收到")
          .appendField(
            new Blockly.FieldDropdown([
              ["出发", "出发"],
              ["集合", "集合"],
              ["接力", "接力"],
              ["过独木桥", "过独木桥"],
              ["完成任务", "完成任务"],
            ]),
            "MSG"
          );
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(160);
        this.setTooltip("当别的角色用「广播 消息」发出同一条消息（如「出发」），这里接的积木立刻执行。多角色间传递消息、协调动作的核心事件帽。");
        this.setHelpUrl("");
        this.setNextStatement(false);
        this.setPreviousStatement(false);
      },
    },
    maker_broadcast: {
      init() {
        this.appendDummyInput()
          .appendField("广播")
          .appendField(
            new Blockly.FieldDropdown([
              ["出发", "出发"],
              ["集合", "集合"],
              ["接力", "接力"],
              ["过独木桥", "过独木桥"],
              ["完成任务", "完成任务"],
            ]),
            "MSG"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("向所有角色广播一条消息（如「出发」）。任何「当接收到 这条消息」的角色会立刻做出反应，实现角色之间的消息传递与协作。");
        this.setHelpUrl("");
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
    maker_touching_actor: {
      init() {
        this.appendDummyInput()
          .appendField("碰到角色")
          .appendField(
            new Blockly.FieldDropdown([
              ["三七", "sanqi"],
              ["二零", "erling"],
            ]),
            "ACTOR"
          );
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip(
          "如果当前控制的角色（如二零）碰到了选中的另一个角色（如三七）返回真。多角色游戏猫追老鼠、守护与躲避、双人对战的核心条件。"
        );
        this.setHelpUrl("");
      },
    },
    maker_distance_to: {
      init() {
        this.appendDummyInput()
          .appendField("到角色")
          .appendField(
            new Blockly.FieldDropdown([
              ["三七", "sanqi"],
              ["二零", "erling"],
            ]),
            "ACTOR"
          )
          .appendField("的距离");
        this.setOutput(true, "Number");
        this.setColour(210);
        this.setTooltip(
          "返回当前控制的角色到选中的另一个角色的距离（数字，越小越近）。常放进「如果 距离 < 50 那么…」做接力赛交接、排队间距判断，也能直接「说」出来。"
        );
        this.setHelpUrl("");
      },
    },
    maker_touching_apple: {
      init() {
        this.appendDummyInput().appendField("碰到苹果");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("如果当前控制的角色碰到了下落的苹果返回真。接苹果 / 反应力游戏的核心条件：放进「如果 碰到苹果 那么…」接住它、加分数。");
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
    // ---- 故事与角色（分类 7）：多角色 / 显隐 / 多场景 ----
    maker_control_actor: {
      init() {
        this.appendDummyInput()
          .appendField("控制角色")
          .appendField(
            new Blockly.FieldDropdown([
              ["二零", "erling"],
              ["三七", "sanqi"],
            ]),
            "ACTOR"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("让后面的积木作用于指定的角色（二零或三七）。");
        this.setHelpUrl("");
      },
    },
    maker_show_actor: {
      init() {
        this.appendDummyInput()
          .appendField("显示角色")
          .appendField(
            new Blockly.FieldDropdown([
              ["二零", "erling"],
              ["三七", "sanqi"],
            ]),
            "ACTOR"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("让一个角色出现在舞台上（变魔术等用）。");
        this.setHelpUrl("");
      },
    },
    maker_hide_actor: {
      init() {
        this.appendDummyInput()
          .appendField("隐藏角色")
          .appendField(
            new Blockly.FieldDropdown([
              ["二零", "erling"],
              ["三七", "sanqi"],
            ]),
            "ACTOR"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("让一个角色从舞台上消失（变魔术等用）。");
        this.setHelpUrl("");
      },
    },
    maker_set_scene: {
      init() {
        this.appendDummyInput()
          .appendField("切换场景")
          .appendField(
            new Blockly.FieldDropdown([
              ["白天·操场", "day"],
              ["卧室", "bedroom"],
              ["学校", "school"],
              ["公园", "park"],
              ["夜晚·星空", "night"],
            ]),
            "SCENE"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("把舞台背景切换成不同的场景。");
        this.setHelpUrl("");
      },
    },

    // ---- 科学探究（分类 10）· 时间轴 / 粒子 / 颜色 ----
    // 时间轴模型：所有科学积木生成一个「轨道」加到 __runtime.timeline，
    // 由时钟统一推进，与旧的动作队列（move/say…）完全隔离。
    maker_when_start_tl: {
      init() {
        this.appendDummyInput().appendField("当开始运行（时间轴）");
        this.appendStatementInput("STACK").setCheck(null);
        this.setColour(20);
        this.setTooltip("科学模拟的开始事件。把时间轴积木（属性变化 / 发射粒子 / 定时说话）放进这里。");
        this.setHelpUrl("");
        this.setNextStatement(false);
        this.setPreviousStatement(false);
      },
    },
    maker_tween_prop: {
      init() {
        this.appendDummyInput()
          .appendField("让")
          .appendField(new Blockly.FieldDropdown([["二零", "erling"], ["三七", "sanqi"]]), "ACTOR")
          .appendField("的")
          .appendField(
            new Blockly.FieldDropdown([
              ["上下位置", "y"],
              ["左右位置", "x"],
              ["大小", "size"],
              ["朝向", "angle"],
              ["显示程度", "alpha"],
              ["角色染色", "actorHue"],
              ["背景明暗", "bgHue"],
            ]),
            "PROP"
          )
          .appendField("从")
          .appendField(new Blockly.FieldNumber(0, -400, 400, 0.01), "A")
          .appendField("到")
          .appendField(new Blockly.FieldNumber(0, -400, 400, 0.01), "B");
        this.appendDummyInput()
          .appendField("在")
          .appendField(new Blockly.FieldNumber(0, 0, 60, 0.5), "T0")
          .appendField("~")
          .appendField(new Blockly.FieldNumber(5, 0, 60, 0.5), "T1")
          .appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("在时间轴上，让某角色的某个属性平滑地从 A 变到 B。用于生长、移动、变色等。");
        this.setHelpUrl("");
      },
    },
    maker_orbit: {
      init() {
        this.appendDummyInput()
          .appendField("让")
          .appendField(new Blockly.FieldDropdown([["二零", "erling"], ["三七", "sanqi"]]), "ACTOR")
          .appendField("绕舞台中心转")
          .appendField(new Blockly.FieldNumber(1, 0.25, 8, 0.25), "LOOPS")
          .appendField("圈");
        this.appendDummyInput()
          .appendField("在")
          .appendField(new Blockly.FieldNumber(0, 0, 60, 0.5), "T0")
          .appendField("~")
          .appendField(new Blockly.FieldNumber(6, 0, 60, 0.5), "T1")
          .appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("让角色绕舞台中心做椭圆公转，模拟地球绕太阳等天体运动。");
        this.setHelpUrl("");
      },
    },
    maker_when_at_say: {
      init() {
        this.appendDummyInput()
          .appendField("当时间到达")
          .appendField(new Blockly.FieldNumber(3, 0, 60, 0.5), "T")
          .appendField("秒，让")
          .appendField(new Blockly.FieldDropdown([["二零", "erling"], ["三七", "sanqi"]]), "ACTOR")
          .appendField("说");
        this.appendValueInput("TEXT").setCheck("String").appendField("");
        this.appendDummyInput()
          .appendField("持续")
          .appendField(new Blockly.FieldNumber(2, 0.5, 10, 0.5), "SECONDS")
          .appendField("秒");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("到某个时刻，让角色冒出一句话做解说。用于科学现象旁白。");
        this.setHelpUrl("");
      },
    },
    maker_when_at_scene: {
      init() {
        this.appendDummyInput()
          .appendField("当时间到达")
          .appendField(new Blockly.FieldNumber(4, 0, 60, 0.5), "T")
          .appendField("秒，切换场景")
          .appendField(
            new Blockly.FieldDropdown([
              ["白天·操场", "day"],
              ["卧室", "bedroom"],
              ["学校", "school"],
              ["公园", "park"],
              ["夜晚·星空", "night"],
            ]),
            "SCENE"
          );
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("到某个时刻，把舞台背景切换成另一个场景。");
        this.setHelpUrl("");
      },
    },
    maker_emit_rain: {
      init() {
        this.appendDummyInput().appendField("开始下雨（雨滴下落）");
        this.appendDummyInput()
          .appendField("从")
          .appendField(new Blockly.FieldNumber(0, 0, 60, 0.5), "T0")
          .appendField("到")
          .appendField(new Blockly.FieldNumber(8, 0, 60, 0.5), "T1")
          .appendField("秒，每秒")
          .appendField(new Blockly.FieldNumber(20, 1, 100, 1), "RATE")
          .appendField("滴，速度")
          .appendField(new Blockly.FieldNumber(160, 40, 400, 10), "SMIN")
          .appendField("~")
          .appendField(new Blockly.FieldNumber(220, 40, 400, 10), "SMAX");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("在一段时间里持续从天上落下雨滴（粒子系统）。");
        this.setHelpUrl("");
      },
    },
    maker_emit_snow: {
      init() {
        this.appendDummyInput().appendField("开始下雪（雪花飘落）");
        this.appendDummyInput()
          .appendField("从")
          .appendField(new Blockly.FieldNumber(0, 0, 60, 0.5), "T0")
          .appendField("到")
          .appendField(new Blockly.FieldNumber(8, 0, 60, 0.5), "T1")
          .appendField("秒，每秒")
          .appendField(new Blockly.FieldNumber(15, 1, 100, 1), "RATE")
          .appendField("片，速度")
          .appendField(new Blockly.FieldNumber(40, 10, 200, 10), "SMIN")
          .appendField("~")
          .appendField(new Blockly.FieldNumber(80, 10, 200, 10), "SMAX");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("在一段时间里持续飘落雪花（粒子系统）。");
        this.setHelpUrl("");
      },
    },
    maker_emit_lava: {
      init() {
        this.appendDummyInput().appendField("火山喷发（岩浆喷出）");
        this.appendDummyInput()
          .appendField("从")
          .appendField(new Blockly.FieldNumber(0, 0, 60, 0.5), "T0")
          .appendField("到")
          .appendField(new Blockly.FieldNumber(8, 0, 60, 0.5), "T1")
          .appendField("秒，每秒")
          .appendField(new Blockly.FieldNumber(25, 1, 100, 1), "RATE")
          .appendField("颗，速度")
          .appendField(new Blockly.FieldNumber(120, 40, 400, 10), "SMIN")
          .appendField("~")
          .appendField(new Blockly.FieldNumber(220, 40, 400, 10), "SMAX");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("在一段时间里从底部中央喷出岩浆粒子，模拟火山喷发。");
        this.setHelpUrl("");
      },
    },
    maker_mix_color: {
      init() {
        this.appendDummyInput()
          .appendField("混合颜色")
          .appendField(
            new Blockly.FieldDropdown([
              ["红", "红"], ["橙", "橙"], ["黄", "黄"], ["绿", "绿"],
              ["蓝", "蓝"], ["紫", "紫"], ["粉", "粉"], ["白", "白"],
            ]),
            "C1"
          )
          .appendField("与")
          .appendField(
            new Blockly.FieldDropdown([
              ["红", "红"], ["橙", "橙"], ["黄", "黄"], ["绿", "绿"],
              ["蓝", "蓝"], ["紫", "紫"], ["粉", "粉"], ["白", "白"],
            ]),
            "C2"
          );
        this.setInputsInline(true);
        this.setOutput(true, "String");
        this.setColour(60);
        this.setTooltip("把两种颜色混合，得到一个新颜色名（如红+黄=橙）。可接进「说」展示。");
        this.setHelpUrl("");
      },
    },
    // ---- 9-12 阶段 · 函数与自定义积木（分类 A）----
    maker_func_def: {
      init() {
        this.appendDummyInput()
          .appendField("定义积木")
          .appendField(new Blockly.FieldTextInput("我的积木"), "NAME");
        this.appendStatementInput("DO").setCheck(null);
        this.setColour(255);
        this.setTooltip("把一串积木打包成你自己的积木。名字要和「调用我的积木」保持一致。函数里还能调用自己（递归）。");
        this.setHelpUrl("");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
      },
    },
    maker_func_call: {
      init() {
        this.appendDummyInput()
          .appendField("调用我的积木")
          .appendField(new Blockly.FieldTextInput("我的积木"), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(255);
        this.setTooltip("运行一次你定义的积木。名字要一模一样（区分大小写）。可以调用很多次，也能自己调用自己做递归。");
        this.setHelpUrl("");
      },
    },
    // ---- 9-12 阶段 · 变量与状态进阶（分类 B）：计时器 / 最高分 ----
    maker_now: {
      init() {
        this.appendDummyInput().appendField("当前时间(毫秒)");
        this.setOutput(true, "Number");
        this.setColour(330);
        this.setTooltip("返回此刻的时间（毫秒）。存进变量后两次相减，就能算出用了多少毫秒，做计时挑战。");
        this.setHelpUrl("");
      },
    },
    maker_best_get: {
      init() {
        this.appendDummyInput()
          .appendField("最高分")
          .appendField(new Blockly.FieldTextInput("得分"), "KEY");
        this.setOutput(true, "Number");
        this.setColour(330);
        this.setTooltip("读出某个游戏的历史最高分（本地保存）。没有记录时返回 0。记录名要和「写入最高分」一致。");
        this.setHelpUrl("");
      },
    },
    maker_best_set: {
      init() {
        this.appendDummyInput()
          .appendField("把最高分")
          .appendField(new Blockly.FieldTextInput("得分"), "KEY")
          .appendField("设为");
        this.appendValueInput("VALUE").setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("把本次得分记下来：只有比已保存的最高分更高才会更新（自动比较，不会越记越低）。");
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

  javascriptGenerator.forBlock["maker_when_receive"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    return stack;
  };

  javascriptGenerator.forBlock["maker_broadcast"] = (block) => {
    const msg = JSON.stringify(block.getFieldValue("MSG"));
    return `__runtime.broadcast(${msg});\n`;
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

  javascriptGenerator.forBlock["maker_touching_actor"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    return [`__runtime.touchingActor(${actor})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_distance_to"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    return [`__runtime.distanceTo(${actor})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_touching_apple"] = () => {
    return [`__runtime.touchingApple()`, Order.FUNCTION_CALL];
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
  javascriptGenerator.forBlock["maker_control_actor"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    return `__runtime.controlActor(${actor});\n`;
  };
  javascriptGenerator.forBlock["maker_show_actor"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    return `__runtime.showActor(${actor});\n`;
  };
  javascriptGenerator.forBlock["maker_hide_actor"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    return `__runtime.hideActor(${actor});\n`;
  };
  javascriptGenerator.forBlock["maker_set_scene"] = (block) => {
    const scene = JSON.stringify(block.getFieldValue("SCENE"));
    return `__runtime.setScene(${scene});\n`;
  };

  // ---- 科学探究（分类 10）· 时间轴 / 粒子 / 颜色 生成器 ----
  javascriptGenerator.forBlock["maker_when_start_tl"] = (block, generator) => {
    const stack = generator.statementToCode(block, "STACK");
    // reset 必须在所有 addTrack 之前，先清轨道与时长，再让 STACK 里的轨道积木补回来
    return `__runtime.timeline.reset(10);\n${stack}`;
  };

  javascriptGenerator.forBlock["maker_tween_prop"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    const prop = block.getFieldValue("PROP");
    const a = block.getFieldValue("A");
    const b = block.getFieldValue("B");
    const t0 = block.getFieldValue("T0");
    const t1 = block.getFieldValue("T1");
    const targetKind =
      prop === "y" ? "actorY"
      : prop === "x" ? "actorX"
      : prop === "size" ? "actorSize"
      : prop === "angle" ? "actorAngle"
      : prop === "alpha" ? "actorAlpha"
      : prop === "bgHue" ? "bgHue"
      : "actorHue";
    return `__runtime.timeline.addTrack({ type: "tween", target: { kind: "${targetKind}", actorId: ${actor} }, t0: ${t0}, t1: ${t1}, a: ${a}, b: ${b} });\n`;
  };

  javascriptGenerator.forBlock["maker_orbit"] = (block) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    const loops = block.getFieldValue("LOOPS");
    const t0 = block.getFieldValue("T0");
    const t1 = block.getFieldValue("T1");
    // 绕舞台中心（0,0）做椭圆公转，rx=160 ry=110 给一个明显的轨道
    return `__runtime.timeline.addTrack({ type: "orbit", actorId: ${actor}, cx: 0, cy: 0, rx: 160, ry: 110, t0: ${t0}, t1: ${t1}, loops: ${loops} });\n`;
  };

  javascriptGenerator.forBlock["maker_when_at_say"] = (block, generator) => {
    const actor = JSON.stringify(block.getFieldValue("ACTOR"));
    const t = block.getFieldValue("T");
    const seconds = block.getFieldValue("SECONDS");
    const text = generator.valueToCode(block, "TEXT", Order.ATOMIC) || '""';
    return `__runtime.timeline.addTrack({ type: "whenAt", t: ${t}, action: { kind: "say", actorId: ${actor}, text: ${text}, seconds: ${seconds} } });\n`;
  };

  javascriptGenerator.forBlock["maker_when_at_scene"] = (block) => {
    const t = block.getFieldValue("T");
    const scene = JSON.stringify(block.getFieldValue("SCENE"));
    return `__runtime.timeline.addTrack({ type: "whenAt", t: ${t}, action: { kind: "setScene", sceneId: ${scene} } });\n`;
  };

  javascriptGenerator.forBlock["maker_emit_rain"] = (block) => {
    const t0 = block.getFieldValue("T0");
    const t1 = block.getFieldValue("T1");
    const rate = block.getFieldValue("RATE");
    const smin = block.getFieldValue("SMIN");
    const smax = block.getFieldValue("SMAX");
    return `__runtime.timeline.addTrack({ type: "particles", kind: "rain", tStart: ${t0}, tEnd: ${t1}, rate: ${rate}, speedMin: ${smin}, speedMax: ${smax}, color: "rgba(120,170,255,0.9)" });\n`;
  };

  javascriptGenerator.forBlock["maker_emit_snow"] = (block) => {
    const t0 = block.getFieldValue("T0");
    const t1 = block.getFieldValue("T1");
    const rate = block.getFieldValue("RATE");
    const smin = block.getFieldValue("SMIN");
    const smax = block.getFieldValue("SMAX");
    return `__runtime.timeline.addTrack({ type: "particles", kind: "snow", tStart: ${t0}, tEnd: ${t1}, rate: ${rate}, speedMin: ${smin}, speedMax: ${smax}, color: "rgba(255,255,255,0.95)" });\n`;
  };

  javascriptGenerator.forBlock["maker_emit_lava"] = (block) => {
    const t0 = block.getFieldValue("T0");
    const t1 = block.getFieldValue("T1");
    const rate = block.getFieldValue("RATE");
    const smin = block.getFieldValue("SMIN");
    const smax = block.getFieldValue("SMAX");
    return `__runtime.timeline.addTrack({ type: "particles", kind: "lava", tStart: ${t0}, tEnd: ${t1}, rate: ${rate}, speedMin: ${smin}, speedMax: ${smax}, color: "rgba(255,120,40,0.95)" });\n`;
  };

  javascriptGenerator.forBlock["maker_mix_color"] = (block) => {
    const c1 = JSON.stringify(block.getFieldValue("C1"));
    const c2 = JSON.stringify(block.getFieldValue("C2"));
    return [`__runtime.timelineMix(${c1}, ${c2})`, Order.FUNCTION_CALL];
  };

  // ---- 9-12 阶段 · 函数与自定义积木（分类 A）----
  // 关键点：运行时是「积木动作先入队、再由动画循环回放」，因此普通 function 声明
  // + 调用就完全正确，无需 async/await；function 声明会 hoist，调用可出现在定义之前，
  // 递归（函数体内调用自己）也因此天然成立。
  const sanitizeFnName = (raw: string): string => {
    const cleaned = (raw || "我的积木").replace(/[^\w\u4e00-\u9fff$]/g, "");
    return cleaned || "myBlock";
  };

  javascriptGenerator.forBlock["maker_func_def"] = (block, generator) => {
    const fn = sanitizeFnName(block.getFieldValue("NAME"));
    const body = generator.statementToCode(block, "DO");
    return `function ${fn}() {\n${body}}\n`;
  };

  javascriptGenerator.forBlock["maker_func_call"] = (block) => {
    const fn = sanitizeFnName(block.getFieldValue("NAME"));
    return `${fn}();\n`;
  };

  // ---- 9-12 阶段 · 变量与状态进阶（分类 B）：计时器 / 最高分 ----
  javascriptGenerator.forBlock["maker_now"] = () => {
    return ["Date.now()", Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_best_get"] = (block) => {
    const key = JSON.stringify(block.getFieldValue("KEY"));
    return [`__runtime.getBest(${key})`, Order.FUNCTION_CALL];
  };

  javascriptGenerator.forBlock["maker_best_set"] = (block, generator) => {
    const key = JSON.stringify(block.getFieldValue("KEY"));
    const value = generator.valueToCode(block, "VALUE", Order.ATOMIC) || "0";
    return `__runtime.setBest(${key}, ${value});\n`;
  };
}
