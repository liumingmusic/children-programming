export interface Point {
  x: number;
  y: number;
}

export interface PenPath {
  points: Point[];
  color: string;
  width: number;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

/** 舞台上的危险/交互标记（障碍 / 坏人），参与运行时碰撞判定。 */
export interface Hazard {
  x: number;
  y: number;
  /** 判定半径（舞台坐标单位），角色中心进入此半径即视为碰到。 */
  r: number;
  /** 种类，用于区分不同检测，如 "obstacle" / "badguy"。 */
  kind: string;
}

/** 会缓慢飘动的乌云（躲避类游戏用），由运行时按 vx/vy 持续移动并反弹于边界。 */
export interface Cloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface ActorState {
  x: number;
  y: number;
  angle: number; // degrees, 0 points right
  message: string | null;
  messageUntil: number;
  /** 角色大小倍数，默认 1。点击变大/变小时改变，渲染时乘到角色尺寸上。 */
  size: number;
  /** 角色表情，用于「变表情」类项目；渲染时切换脸型。 */
  expression?: "normal" | "happy" | "angry" | "surprised" | "sleepy";
}

export interface StageState {
  width: number;
  height: number;
  actor: ActorState;
  penPaths: PenPath[];
  currentPath: PenPath | null;
  penColor: number; // hue 0-360
  penSize: number; // 画笔粗细（屏幕像素）
  penDown: boolean;
  stars: Star[];
  /** 当前乌云位置（会动），用于躲避类项目渲染与碰撞判定。 */
  clouds?: { x: number; y: number; r: number }[];
  running: boolean;
  log: string[];
}

// 画笔默认粗细（屏幕像素）。项目里未放「设置画笔粗细」积木时使用此值。
const DEFAULT_PEN_SIZE = 3;

// ---- 音频合成（Web Audio）----
// 站点为纯前端静态站，仅在浏览器内用 Web Audio 实时合成音效，无需任何音频资源文件。
// SSR 守卫：服务端（含 jsdom 测试）没有 AudioContext，getAudioContext 返回 null，
// 所有音频方法退化为「静音但按节拍推进队列」，既不会报错，也能在测试里被真实执行。
const NOTE_FREQ: Record<string, number> = {
  do: 261.63, // C4
  re: 293.66, // D4
  mi: 329.63, // E4
  fa: 349.23, // F4
  sol: 392.0, // G4
  la: 440.0, // A4
  ti: 493.88, // B4
  do2: 523.25, // C5（高音 do）
};
const SCALE: number[] = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
const BEAT_MS = 400; // 一拍时长（毫秒），与「拍数」积木对应

let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
    } catch {
      audioCtx = null;
    }
  }
  return audioCtx;
}

/** 单个音符：正弦波 + 短暂淡出。返回是否真正出声（无音频上下文时为 false）。 */
function playToneAt(ctx: AudioContext, freq: number, durationMs: number, gainPeak = 0.18): boolean {
  const now = ctx.currentTime;
  const dur = durationMs / 1000;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.03);
  return true;
}

/** 鼓点：按种类用不同合成方式模拟（鼓 / 镲 / 木鱼）。 */
function playDrumAt(ctx: AudioContext | null, kind: string) {
  if (!ctx) return;
  const now = ctx.currentTime;
  if (kind === "kick" || kind === "鼓") {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    g.gain.setValueAtTime(0.4, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (kind === "hat" || kind === "镲") {
    const bufferSize = Math.floor(ctx.sampleRate * 0.1);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    noise.connect(hp);
    hp.connect(g);
    g.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.1);
  } else {
    // 木鱼：短促方波
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 800;
    g.gain.setValueAtTime(0.2, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

/** 把舞台横向坐标 x 映射到音阶音高（点击 / 移动位置越靠右音越高）。 */
function pitchFromX(x: number, width: number): number {
  const t = (x + width / 2) / width; // 0..1（左 → 右）
  const idx = Math.max(0, Math.min(SCALE.length - 1, Math.round(t * (SCALE.length - 1))));
  return SCALE[idx];
}

type Action =
  | { type: "move"; steps: number; duration: number }
  | { type: "turn"; degrees: number; duration: number }
  | { type: "goto"; x: number; y: number; duration: number }
  | { type: "gotoMouse"; duration: number }
  | { type: "gotoStar"; index: number; duration: number }
  | { type: "say"; text: string; duration: number }
  | { type: "wait"; seconds: number }
  | { type: "penDown" }
  | { type: "penUp" }
  | { type: "penSetColor"; hue: number }
  | { type: "penChangeColor"; delta: number }
  | { type: "penSetSize"; size: number }
  | { type: "setSize"; size: number }
  | { type: "changeSize"; delta: number }
  | { type: "playNote"; note: string; beats: number }
  | { type: "playDrum"; kind: string }
  | { type: "playRandomNote" }
  | { type: "playToneByMouseX" }
  | { type: "playToneByActorX" }
  | { type: "playChord"; notes: string[] };

export type Script = {
  whenStart: string;
  whenStageClicked: string;
  whenKeyPressed: { key: string; code: string }[];
};

const DEFAULT_STARS: Star[] = [
  { id: 1, x: 120, y: 80, collected: false },
  { id: 2, x: -140, y: -60, collected: false },
  { id: 3, x: -80, y: 110, collected: false },
];

export class Runtime {
  private actions: Action[] = [];
  private onChange: (state: StageState) => void;
  private width: number;
  private height: number;
  private state: StageState;
  private scripts: Script = { whenStart: "", whenStageClicked: "", whenKeyPressed: [] };
  private mouse: Point = { x: 0, y: 0 };
  private runningType: "start" | "click" | "key" | null = null;
  private initialStars: Star[];
  private hazards: Hazard[];
  private clouds: Cloud[];
  private initialClouds: Cloud[];
  private vars: Record<string, number> = {};
  private cloudRaf: number | null = null;

  constructor(
    width: number,
    height: number,
    onChange: (state: StageState) => void,
    initialStars?: Star[],
    opts?: { hazards?: Hazard[]; clouds?: Cloud[] }
  ) {
    this.width = width;
    this.height = height;
    this.onChange = onChange;
    this.initialStars = initialStars
      ? initialStars.map((s) => ({ ...s }))
      : DEFAULT_STARS.map((s) => ({ ...s }));
    this.hazards = opts?.hazards ? opts.hazards.map((h) => ({ ...h })) : [];
    this.initialClouds = opts?.clouds ? opts.clouds.map((c) => ({ ...c })) : [];
    this.clouds = this.initialClouds.map((c) => ({ ...c }));
    this.state = {
      width,
      height,
      actor: {
        x: 0,
        y: 0,
        angle: 270,
        message: null,
        messageUntil: 0,
        size: 1,
        expression: "normal",
      },
      penPaths: [],
      currentPath: null,
      penColor: 0,
      penSize: DEFAULT_PEN_SIZE,
      penDown: false,
      stars: this.initialStars.map((s) => ({ ...s })),
      clouds: this.initialClouds.map((c) => ({ x: c.x, y: c.y, r: c.r })),
      running: false,
      log: [],
    };
  }

  getState() {
    return this.state;
  }

  reset() {
    this.actions = [];
    this.state.actor = {
      x: 0,
      y: 0,
      angle: 270,
      message: null,
      messageUntil: 0,
      size: 1,
      expression: "normal",
    };
    this.vars = {};
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penColor = 0;
    this.state.penSize = DEFAULT_PEN_SIZE;
    this.state.penDown = false;
    this.state.stars = this.initialStars.map((s) => ({ ...s }));
    this.clouds = this.initialClouds.map((c) => ({ ...c }));
    this.state.clouds = this.initialClouds.map((c) => ({ x: c.x, y: c.y, r: c.r }));
    this.state.running = false;
    this.state.log = [];
    this.runningType = null;
    this.emit();
  }

  setStageSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.state.width = width;
    this.state.height = height;
    this.emit();
  }

  setMouse(x: number, y: number) {
    this.mouse = { x, y };
  }

  log(message: string) {
    this.state.log.push(message);
    if (this.state.log.length > 200) {
      this.state.log.shift();
    }
    this.emit();
  }

  // --- Pen state: queued as actions, executed in order during playback ---
  // 关键：不能在执行生成代码（eval）时立刻改状态，否则 penUp 会在 move
  // 真正播放前把笔画提交、抬起画笔，导致一条线都画不出来。
  penDown() {
    this.actions.push({ type: "penDown" });
    this.log("[系统] 画笔落下");
  }

  penUp() {
    this.actions.push({ type: "penUp" });
    this.log("[系统] 抬笔");
  }

  setPenColor(hue: number) {
    this.actions.push({ type: "penSetColor", hue: hue % 360 });
    this.log("[系统] 画笔颜色设置");
  }

  changePenColor(delta: number) {
    this.actions.push({ type: "penChangeColor", delta });
    this.log("[系统] 画笔颜色改变");
  }

  setPenSize(size: number) {
    const s = Math.max(1, Math.min(50, Math.round(size)));
    this.actions.push({ type: "penSetSize", size: s });
    this.log("[系统] 画笔粗细设置");
  }

  // --- Size (actor scale) ---
  setSize(size: number) {
    const s = Math.max(0.2, Math.min(5, size));
    this.actions.push({ type: "setSize", size: s });
    this.log("[系统] 二零大小设置");
  }

  changeSize(delta: number) {
    this.actions.push({ type: "changeSize", delta });
    this.log("[系统] 二零大小改变");
  }

  // --- Queries used by generated scripts ---
  /** 角色是否碰到舞台边缘（距边界 30 单位内即视为碰到）。 */
  touchingEdge(): boolean {
    const margin = 30;
    return (
      Math.abs(this.state.actor.x) > this.width / 2 - margin ||
      Math.abs(this.state.actor.y) > this.height / 2 - margin
    );
  }

  /** 当前画笔是否为红色（色相 0 / 360 即红）。 */
  penIsRed(): boolean {
    return this.state.penColor % 360 === 0;
  }

  /** 最近一次（点击）的鼠标 x 坐标，用于判断点了左半边还是右半边。 */
  mouseX(): number {
    return this.mouse.x;
  }

  /** 当前角色大小倍数（用于「阈值 / 大小」类条件判断）。 */
  getSize(): number {
    return this.state.actor.size;
  }

  /** 设置角色表情（用于「变表情」类项目）。 */
  setExpression(name: "normal" | "happy" | "angry" | "surprised" | "sleepy") {
    this.state.actor.expression = name;
    this.log("[系统] 二零换上了新表情");
    this.emit();
  }

  /** 设置变量（用于奇偶 / 计数类逻辑）。 */
  setVar(name: string, value: number) {
    this.vars[name] = value;
    this.log(`[系统] 变量 ${name} = ${value}`);
  }

  /** 修改变量（按 delta 增减）。 */
  changeVar(name: string, delta: number) {
    this.vars[name] = (this.vars[name] ?? 0) + delta;
  }

  /** 读取变量当前值（默认 0）。 */
  getVar(name: string): number {
    return this.vars[name] ?? 0;
  }

  /** 角色是否碰到指定种类的危险标记（障碍 / 坏人）。 */
  touchingMark(kind: string): boolean {
    return this.hazards.some((h) => {
      if (h.kind !== kind) return false;
      const dx = this.state.actor.x - h.x;
      const dy = this.state.actor.y - h.y;
      return Math.sqrt(dx * dx + dy * dy) < h.r + 30;
    });
  }

  /** 角色是否碰到任意一朵乌云。 */
  touchingCloud(): boolean {
    return this.clouds.some((c) => {
      const dx = this.state.actor.x - c.x;
      const dy = this.state.actor.y - c.y;
      return Math.sqrt(dx * dx + dy * dy) < c.r + 25;
    });
  }

  /** 启动乌云飘移动画（仅在存在乌云时）。 */
  private startClouds() {
    if (this.cloudRaf !== null || this.clouds.length === 0) return;
    const step = () => {
      const margin = 40;
      for (const c of this.clouds) {
        c.x += c.vx;
        c.y += c.vy;
        if (c.x < -this.width / 2 + margin || c.x > this.width / 2 - margin) c.vx = -c.vx;
        if (c.y < -this.height / 2 + margin || c.y > this.height / 2 - margin) c.vy = -c.vy;
      }
      this.state.clouds = this.clouds.map((c) => ({ x: c.x, y: c.y, r: c.r }));
      this.emit();
      this.cloudRaf = requestAnimationFrame(step);
    };
    this.cloudRaf = requestAnimationFrame(step);
  }

  /** 停止乌云飘移动画。 */
  private stopClouds() {
    if (this.cloudRaf !== null) {
      cancelAnimationFrame(this.cloudRaf);
      this.cloudRaf = null;
    }
  }

  // --- Queued actions ---
  move(steps: number) {
    this.actions.push({ type: "move", steps, duration: Math.abs(steps) * 4 });
  }

  turn(degrees: number) {
    this.actions.push({ type: "turn", degrees, duration: Math.abs(degrees) * 4 });
  }

  goto(x: number, y: number) {
    this.actions.push({ type: "goto", x, y, duration: 500 });
  }

  gotoMouse() {
    this.actions.push({ type: "gotoMouse", duration: 600 });
  }

  gotoStar(index: number) {
    this.actions.push({ type: "gotoStar", index, duration: 600 });
  }

  say(text: string, seconds: number) {
    this.actions.push({ type: "say", text, duration: seconds * 1000 });
  }

  wait(seconds: number) {
    this.actions.push({ type: "wait", seconds: seconds * 1000 });
  }

  // --- 音频（Web Audio 实时合成，排队播放，使旋律按顺序发声）---
  playNote(note: string, beats = 1) {
    this.actions.push({ type: "playNote", note, beats: Math.max(0.25, beats) });
    this.log(`[音频] 弹奏 ${note} 音`);
  }

  playDrum(kind: string) {
    this.actions.push({ type: "playDrum", kind });
    this.log(`[音频] 敲响${kind}`);
  }

  playRandomNote() {
    this.actions.push({ type: "playRandomNote" });
    this.log("[音频] 随机弹奏一个音符");
  }

  playToneByMouseX() {
    this.actions.push({ type: "playToneByMouseX" });
    this.log("[音频] 按点击位置弹音");
  }

  playToneByActorX() {
    this.actions.push({ type: "playToneByActorX" });
    this.log("[音频] 按二零位置弹音");
  }

  playChord(notes: string[]) {
    this.actions.push({ type: "playChord", notes });
    this.log(`[音频] 弹奏和弦 ${notes.join("+")}`);
  }

  // --- Touching detection used by generated scripts ---
  touchingStar(): boolean {
    return this.state.stars.some((star) => {
      if (star.collected) return false;
      const dx = this.state.actor.x - star.x;
      const dy = this.state.actor.y - star.y;
      return Math.sqrt(dx * dx + dy * dy) < 35;
    });
  }

  collectNearbyStars() {
    this.state.stars.forEach((star, index) => {
      if (!star.collected) {
        const dx = this.state.actor.x - star.x;
        const dy = this.state.actor.y - star.y;
        if (Math.sqrt(dx * dx + dy * dy) < 35) {
          this.collectStar(index);
        }
      }
    });
  }

  private collectStar(index: number) {
    const star = this.state.stars[index];
    if (star && !star.collected) {
      star.collected = true;
      this.log(`[系统] 收集到星星 ${star.id} 号！`);
      this.emit();
    }
  }

  // --- Script registration ---
  setScripts(scripts: Script) {
    this.scripts = scripts;
  }

  start() {
    this.actions = [];
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penDown = false;
    this.state.actor.size = 1;
    this.state.stars = this.initialStars.map((s) => ({ ...s }));
  }

  async handleStageClick(x: number, y: number) {
    if (this.state.running || !this.scripts.whenStageClicked) return;
    this.setMouse(x, y);
    this.runningType = "click";
    await this.runScript(this.scripts.whenStageClicked, "click");
  }

  async handleRunStart() {
    if (this.state.running || !this.scripts.whenStart) return;
    this.runningType = "start";
    await this.runScript(this.scripts.whenStart, "start");
  }

  async handleKeyPressed(key: string) {
    if (this.state.running) return;
    const match = this.scripts.whenKeyPressed.find((k) => k.key === key);
    if (!match || !match.code) return;
    this.runningType = "key";
    await this.runScript(match.code, "key");
  }

  private async runScript(code: string, type: "start" | "click" | "key") {
    this.actions = [];
    this.state.log = [];
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penDown = false;
    this.state.running = true;
    this.runningType = type;
    this.startClouds();
    // 在用户手势内恢复 / 创建音频上下文，满足浏览器自动播放策略（首次发声前必须已 resume）
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    this.log(
      type === "start"
        ? "[系统] 开始执行程序"
        : type === "click"
        ? "[系统] 舞台被点击，执行事件"
        : "[系统] 按下按键，执行事件"
    );
    this.emit();

    try {
      const wrapped = `(function(__runtime) {\n${code}\n})(__runtimeArg);`;
      (window as unknown as Record<string, unknown>).__runtimeArg = this;
      // eslint-disable-next-line no-eval
      eval(wrapped);
    } catch (e) {
      this.log(`[系统] 程序出错：${e}`);
    } finally {
      this.stopClouds();
      delete (window as unknown as Record<string, unknown>).__runtimeArg;
    }

    for (const action of this.actions) {
      await this.performAction(action);
    }

    this.commitCurrentPath();
    const allCollected = this.state.stars.every((s) => s.collected);
    if (allCollected) {
      this.log("[系统] 恭喜！所有星星都收集完了");
    }
    this.log("[系统] 程序执行完毕");
    this.state.running = false;
    this.runningType = null;
    this.emit();
  }

  /** 播放一个音符并在其时长后 resolve，使音频动作在队列里「按拍等待」，旋律依次发声。 */
  private playAndWait(freq: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      const ctx = getAudioContext();
      if (ctx) {
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        playToneAt(ctx, freq, durationMs);
      }
      this.emit();
      setTimeout(resolve, durationMs);
    });
  }

  private commitCurrentPath() {
    // 跳过不足 2 个点的退化笔画（如「落笔后未移动就改色」产生的单点段），
    // 避免画布上出现无意义空路径，也保证 penPaths 里都是可绘制的线段。
    if (this.state.currentPath && this.state.currentPath.points.length >= 2) {
      this.state.penPaths.push(this.state.currentPath);
    }
    this.state.currentPath = null;
  }

  private startCurrentPath() {
    if (this.state.penDown) {
      this.state.currentPath = {
        points: [{ x: this.state.actor.x, y: this.state.actor.y }],
        color: `hsl(${this.state.penColor % 360}, 80%, 60%)`,
        width: this.state.penSize,
      };
    }
  }

  private recordPenPosition() {
    if (this.state.penDown && this.state.currentPath) {
      this.state.currentPath.points.push({ x: this.state.actor.x, y: this.state.actor.y });
    }
  }

  private performAction(action: Action): Promise<void> {
    return new Promise((resolve) => {
      switch (action.type) {
        case "move": {
          this.log("[系统] 二零开始移动");
          const rad = (this.state.actor.angle * Math.PI) / 180;
          // 渲染坐标世界 Y 轴朝上（toScreen 用 ch/2 - wy），故世界位移的 Y 分量取负，
          // 使「脸朝的方向 == 移动方向」：angle=270(朝上) 时 dy=-sin(270)*steps=+steps → 世界 Y 增大=向上。
          const dx = action.steps * Math.cos(rad);
          const dy = -action.steps * Math.sin(rad);
          this.animateValue(
            { x: this.state.actor.x, y: this.state.actor.y },
            { x: this.state.actor.x + dx, y: this.state.actor.y + dy },
            action.duration,
            (v) => {
              this.state.actor.x = v.x;
              this.state.actor.y = v.y;
              this.recordPenPosition();
              this.emit();
            },
            () => {
              this.collectNearbyStars();
              resolve();
            }
          );
          break;
        }
        case "turn": {
          this.log("[系统] 二零开始转向");
          const startAngle = this.state.actor.angle;
          this.animateValue(
            { a: startAngle },
            { a: startAngle + action.degrees },
            action.duration,
            (v) => {
              this.state.actor.angle = v.a;
              this.emit();
            },
            resolve
          );
          break;
        }
        case "goto": {
          this.log("[系统] 二零移动到指定位置");
          this.animateValue(
            { x: this.state.actor.x, y: this.state.actor.y },
            { x: action.x, y: action.y },
            action.duration,
            (v) => {
              this.state.actor.x = v.x;
              this.state.actor.y = v.y;
              this.recordPenPosition();
              this.emit();
            },
            () => {
              this.collectNearbyStars();
              resolve();
            }
          );
          break;
        }
        case "gotoMouse": {
          this.log("[系统] 二零飞向鼠标位置");
          this.animateValue(
            { x: this.state.actor.x, y: this.state.actor.y },
            { x: this.mouse.x, y: this.mouse.y },
            action.duration,
            (v) => {
              this.state.actor.x = v.x;
              this.state.actor.y = v.y;
              this.recordPenPosition();
              this.emit();
            },
            () => {
              this.collectNearbyStars();
              resolve();
            }
          );
          break;
        }
        case "gotoStar": {
          const star = this.state.stars[action.index];
          if (!star || star.collected) {
            resolve();
            break;
          }
          this.log("[系统] 二零飞向星星");
          this.animateValue(
            { x: this.state.actor.x, y: this.state.actor.y },
            { x: star.x, y: star.y },
            action.duration,
            (v) => {
              this.state.actor.x = v.x;
              this.state.actor.y = v.y;
              this.recordPenPosition();
              this.emit();
            },
            () => {
              this.collectStar(action.index);
              resolve();
            }
          );
          break;
        }
        case "say": {
          this.state.actor.message = action.text;
          this.state.actor.messageUntil = Date.now() + action.duration;
          this.log(`[二零] ${action.text}`);
          this.emit();
          setTimeout(() => {
            this.state.actor.message = null;
            this.emit();
            resolve();
          }, action.duration);
          break;
        }
        case "wait": {
          setTimeout(resolve, action.seconds);
          break;
        }
        case "playNote": {
          const freq = NOTE_FREQ[action.note] ?? 440;
          const dur = action.beats * BEAT_MS;
          this.playAndWait(freq, dur).then(() => resolve());
          break;
        }
        case "playRandomNote": {
          const scaleNotes = ["do", "re", "mi", "fa", "sol", "la", "ti"];
          const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
          const freq = NOTE_FREQ[note] ?? 440;
          this.playAndWait(freq, BEAT_MS).then(() => resolve());
          break;
        }
        case "playDrum": {
          playDrumAt(getAudioContext(), action.kind);
          this.emit();
          setTimeout(() => resolve(), 200);
          break;
        }
        case "playToneByMouseX": {
          const freq = pitchFromX(this.mouse.x, this.width);
          this.playAndWait(freq, BEAT_MS).then(() => resolve());
          break;
        }
        case "playToneByActorX": {
          const freq = pitchFromX(this.state.actor.x, this.width);
          this.playAndWait(freq, BEAT_MS).then(() => resolve());
          break;
        }
        case "playChord": {
          const ctx = getAudioContext();
          const chosen = action.notes.filter((n) => NOTE_FREQ[n] != null);
          const dur = BEAT_MS * 2;
          if (ctx) {
            if (ctx.state === "suspended") ctx.resume().catch(() => {});
            chosen.forEach((n) => playToneAt(ctx, NOTE_FREQ[n], dur, 0.12));
          }
          this.emit();
          setTimeout(() => resolve(), dur);
          break;
        }
        case "penDown": {
          this.state.penDown = true;
          this.state.currentPath = {
            points: [{ x: this.state.actor.x, y: this.state.actor.y }],
            color: `hsl(${this.state.penColor % 360}, 80%, 60%)`,
            width: this.state.penSize,
          };
          this.emit();
          resolve();
          break;
        }
        case "penUp": {
          this.commitCurrentPath();
          this.state.penDown = false;
          this.emit();
          resolve();
          break;
        }
        case "penSetColor": {
          this.commitCurrentPath();
          this.state.penColor = action.hue % 360;
          this.startCurrentPath();
          this.emit();
          resolve();
          break;
        }
        case "penChangeColor": {
          this.commitCurrentPath();
          this.state.penColor = (this.state.penColor + action.delta) % 360;
          this.startCurrentPath();
          this.emit();
          resolve();
          break;
        }
        case "penSetSize": {
          this.commitCurrentPath();
          this.state.penSize = action.size;
          this.startCurrentPath();
          this.emit();
          resolve();
          break;
        }
        case "setSize": {
          this.state.actor.size = action.size;
          this.emit();
          resolve();
          break;
        }
        case "changeSize": {
          this.state.actor.size = Math.max(0.2, Math.min(5, this.state.actor.size + action.delta));
          this.emit();
          resolve();
          break;
        }
      }
    });
  }

  private animateValue(
    from: Record<string, number>,
    to: Record<string, number>,
    duration: number,
    onUpdate: (v: Record<string, number>) => void,
    onComplete: () => void
  ) {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t * (2 - t); // easeOutQuad
      const current: Record<string, number> = {};
      for (const key of Object.keys(from)) {
        current[key] = from[key] + (to[key] - from[key]) * eased;
      }
      onUpdate(current);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete();
      }
    };
    requestAnimationFrame(step);
  }

  private emit() {
    this.onChange({ ...this.state });
  }
}
