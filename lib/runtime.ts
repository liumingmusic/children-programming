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

export type Species = "erling" | "sanqi";

export interface ActorState {
  id: string;
  species: Species;
  name: string;
  x: number;
  y: number;
  angle: number; // degrees, 0 points right
  message: string | null;
  messageUntil: number;
  /** 角色大小倍数，默认 1。点击变大/变小时改变，渲染时乘到角色尺寸上。 */
  size: number;
  /** 角色表情，用于「变表情」类项目；渲染时切换脸型。 */
  expression?: "normal" | "happy" | "angry" | "surprised" | "sleepy";
  /** 是否可见（「显示/隐藏角色」积木控制；变魔术项目用）。 */
  visible: boolean;
}

/** 舞台场景（多场景切换，分类7·故事「一天的生活」用）。仅作背景区分，不影响坐标。 */
export interface SceneDef {
  id: string;
  label: string;
  /** 背景渐变（CSS），由 StagePlayer 渲染。 */
  bg: string;
}

// ============ 时间轴 / 粒子 / 颜色（分类 10 · 科学）============
// 时间轴是「时钟驱动状态场」模型，与现有「事件→动作队列」模型互斥，
// 故做成 Runtime 内嵌的独立 TimelineEngine 子系统，由 CourseProject.timeline 标志切换，
// 旧 101 项目（action 队列模式）完全不受影响。

/** 单个粒子（雨滴 / 雪花 / 火山岩浆点）。世界坐标，每帧按 dt*speed 推进。 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 渲染颜色（css）。 */
  color: string;
  /** 渲染半径（屏幕像素）。 */
  r: number;
  /** 形状：雨=细长线（用 vx/vy 决定朝向）、雪=圆点、岩浆=发光圆点。 */
  kind: "rain" | "snow" | "lava";
  /** 已存活时间（秒），用于火山粒子淡出。 */
  age: number;
  /** 寿命（秒）；到寿命即从数组移除（火山用）。 */
  life: number;
}

/** 角色可随时间的属性（Tween 轨道作用对象）。 */
export type TweenTarget =
  | { kind: "actorY"; actorId: string }
  | { kind: "actorX"; actorId: string }
  | { kind: "actorSize"; actorId: string }
  | { kind: "actorAngle"; actorId: string }
  | { kind: "actorAlpha"; actorId: string } // 0=隐 1=显（渐隐/渐显）
  | { kind: "bgHue"; } // 背景色相（昼夜/四季用），0-360
  | { kind: "actorHue"; actorId: string }; // 角色整体染色（月相等）

/** 时间轴轨道：在 [t0,t1] 秒之间把某属性从 a 线性插值到 b。 */
export interface TweenTrack {
  type: "tween";
  target: TweenTarget;
  t0: number;
  t1: number;
  a: number;
  b: number;
}

/** 时间轴轨道：当播放时间第一次到达 t 秒时，触发一次性动作（say/setScene/setExpression/show/hide）。 */
export interface WhenAtTrack {
  type: "whenAt";
  t: number;
  action:
    | { kind: "say"; actorId: string; text: string; seconds: number }
    | { kind: "setScene"; sceneId: string }
    | { kind: "setExpression"; actorId: string; expr: string }
    | { kind: "show"; actorId: string }
    | { kind: "hide"; actorId: string };
  /** 运行时：已经完成过则不再重复触发（拖动进度条回到已触发时刻时）。 */
  fired?: boolean;
}

/** 时间轴轨道：在某时刻起持续发射粒子（雨/雪/火山）。 */
export interface ParticleTrack {
  type: "particles";
  kind: "rain" | "snow" | "lava";
  /** 开始发射的时间（秒）。 */
  tStart: number;
  /** 结束时间（秒）；到时停止新增粒子（已存在粒子继续运动直到出界/寿命到）。 */
  tEnd: number;
  /** 每秒发射数量。 */
  rate: number;
  /** 累计已发射数量（用于限速）。 */
  emitted?: number;
  /** 速度范围（用于随机化初速）。 */
  speedMin: number;
  speedMax: number;
  /** 颜色（css）；火山可多色。 */
  color: string;
}

/** 时间轴轨道：让某角色绕指定中心做椭圆公转（N 圈），用于日地月系统演示。 */
export interface OrbitTrack {
  type: "orbit";
  actorId: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  t0: number;
  t1: number;
  loops: number;
}

export type TimelineTrack = TweenTrack | WhenAtTrack | ParticleTrack | OrbitTrack;

/** 时间轴对外暴露（只读）的运行时状态，供 StagePlayer 渲染控件与进度。 */
export interface TimelineState {
  duration: number; // 总时长（秒）
  time: number; // 当前播放时间（秒）
  speed: number; // 速度倍率 0.5 | 1 | 2
  playing: boolean; // 是否正在播放
}

export interface StageState {
  width: number;
  height: number;
  /** 主角色（二零）的便捷引用，向后兼容现有 81 项目与渲染层。= actors[0]。 */
  actor: ActorState;
  /** 全部角色（含二零与伙伴）。多角色项目（分类7）会含 三七。 */
  actors: ActorState[];
  /** 当前激活的场景（切换场景积木设置）。 */
  scene?: SceneDef;
  penPaths: PenPath[];
  currentPath: PenPath | null;
  penColor: number; // hue 0-360
  penSize: number; // 画笔粗细（屏幕像素）
  penDown: boolean;
  stars: Star[];
  /** 当前乌云位置（会动），用于躲避类项目渲染与碰撞判定。 */
  clouds?: { x: number; y: number; r: number }[];
  /** 时间轴子系统状态（分类10·科学）。仅当项目为 timeline 模式时存在。 */
  timeline?: TimelineState;
  /** 当前活跃粒子（分类10·科学：雨/雪/火山）。 */
  particles?: Particle[];
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

// 每个动作在「入队（eval 期间）」时就捕获当时「当前控制角色」的 id，
// 否则 controlActor 在 eval 阶段同步切换 currentActorId，而 await 动作（say/move…）
// 在 eval 之后才逐条执行，全部会看到 eval 结束时的 currentActorId，导致多角色项目里
// 「后用三七说的 / 走的」全错绑到二零身上（见 two_talk 的真实运行日志）。
type Action = { actorId?: string } & (
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
  | { type: "playChord"; notes: string[] }
  | { type: "broadcast"; message: string }
);

export type Script = {
  whenStart: string;
  whenStageClicked: string;
  whenKeyPressed: { key: string; code: string }[];
  /** 广播接收脚本（多角色消息传递）：消息名 → 该消息触发时执行的 JS 片段。 */
  whenReceived?: { message: string; code: string }[];
};

const DEFAULT_STARS: Star[] = [
  { id: 1, x: 120, y: 80, collected: false },
  { id: 2, x: -140, y: -60, collected: false },
  { id: 3, x: -80, y: 110, collected: false },
];

/** 多场景背景（分类7·故事「一天的生活」切换场景用）。键即切换场景积木的参数。 */
export const SCENES: Record<string, SceneDef> = {
  day: { id: "day", label: "白天·操场", bg: "linear-gradient(#1B3A6B, #2E5C9E)" },
  bedroom: { id: "bedroom", label: "卧室", bg: "linear-gradient(#2A2350, #4A3A7A)" },
  school: { id: "school", label: "学校", bg: "linear-gradient(#143B3A, #2C6B63)" },
  park: { id: "park", label: "公园", bg: "linear-gradient(#173A2A, #2E6B4A)" },
  night: { id: "night", label: "夜晚·星空", bg: "linear-gradient(#0B1C3F, #162B55)" },
};

/** 构造一个角色初始状态。 */
function makeActor(id: string, species: Species, name: string, x = 0, y = 0, angle = 270): ActorState {
  return {
    id,
    species,
    name,
    x,
    y,
    angle,
    message: null,
    messageUntil: 0,
    size: 1,
    expression: "normal",
    visible: true,
  };
}

/** 颜色名 → RGB（分类10·颜色混合积木用）。保留七色 + 白/黑/橙。 */
const COLOR_RGB: Record<string, [number, number, number]> = {
  红: [239, 68, 68],
  橙: [249, 115, 22],
  黄: [250, 204, 21],
  绿: [34, 197, 94],
  蓝: [59, 130, 246],
  紫: [168, 85, 247],
  粉: [244, 114, 182],
  白: [255, 255, 255],
  黑: [30, 30, 30],
  棕: [146, 94, 60],
};

/** 两个颜色按 t(0..1) 线性插值，返回 css rgb 字符串。t=0→c1，t=1→c2。 */
export function mixColor(c1: string, c2: string, t: number): string {
  const a = COLOR_RGB[c1] ?? COLOR_RGB["红"];
  const b = COLOR_RGB[c2] ?? COLOR_RGB["蓝"];
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * k);
  const g = Math.round(a[1] + (b[1] - a[1]) * k);
  const bl = Math.round(a[2] + (b[2] - a[2]) * k);
  return `rgb(${r},${g},${bl})`;
}

/** 两个原色混合的「结果色名」（分类10·颜色混合积木用）。等比例混合的常识映射。 */
const MIX_NAME: Record<string, string> = {
  "红+黄": "橙", "黄+红": "橙",
  "黄+蓝": "绿", "蓝+黄": "绿",
  "红+蓝": "紫", "蓝+红": "紫",
  "红+白": "粉", "白+红": "粉",
  "蓝+白": "浅蓝", "白+蓝": "浅蓝",
  "黄+白": "浅黄", "白+黄": "浅黄",
};
export function mixColorName(c1: string, c2: string): string {
  return MIX_NAME[`${c1}+${c2}`] ?? "新颜色";
}

/**
 * 时间轴引擎（分类10·科学）。独立于 Runtime 的 action 队列，
 * 由「时钟驱动状态场」：每帧按 dt*speed 推进 time，重算所有轨道（Tween/WhenAt/Particle）。
 * 持有 Runtime 引用以读写 StageState（角色位置/大小/背景色相/粒子数组），并触发 onChange 渲染。
 */
export class TimelineEngine {
  private rt: Runtime;
  private tracks: TimelineTrack[] = [];
  private raf: number | null = null;
  private lastTs = 0;
  private acc = 0; // 粒子发射累加器（按秒计）
  duration = 10;
  time = 0;
  speed = 1;
  playing = false;
  /** 累计每帧增量（用于粒子发射限速），仅记录已用时间。 */
  private firedAt = new Set<number>();

  constructor(rt: Runtime) {
    this.rt = rt;
  }

  /** 清空并重设轨道（每次运行/重新生成积木时调用）。 */
  reset(duration = 10) {
    this.tracks = [];
    this.duration = duration;
    this.time = 0;
    this.speed = 1;
    this.playing = false;
    this.acc = 0;
    this.firedAt.clear();
    this.stopRaf();
    const st = this.rt.getState();
    st.particles = [];
    st.timeline = { duration: this.duration, time: 0, speed: 1, playing: false };
    this.rt.notify();
  }

  /** 添加轨道（积木生成代码时调用）。 */
  addTrack(t: TimelineTrack) {
    this.tracks.push(t);
    // 自动按轨道末端时间扩展总时长，避免时长写死导致轨道播不完
    let end = 0;
    if (t.type === "tween" || t.type === "orbit") end = Math.max(t.t0, t.t1);
    else if (t.type === "whenAt") end = t.t;
    else if (t.type === "particles") end = Math.max(t.tStart, t.tEnd);
    if (end > this.duration) this.duration = Math.ceil(end);
  }

  /** 设定总时长（取所有轨道的最大末端时间）。 */
  setDuration(d: number) {
    this.duration = Math.max(1, d);
  }

  /** 开始播放（从头或当前位置继续）。 */
  play() {
    if (this.playing) return;
    if (this.time >= this.duration) {
      // 已到结尾，重新播放：先复位到 0 并复位所有轨道触发标记
      this.time = 0;
      for (const t of this.tracks) {
        if (t.type === "whenAt") t.fired = false;
      }
      const st = this.rt.getState();
      st.particles = [];
    }
    this.playing = true;
    this.lastTs = performance.now();
    this.emit();
    this.loop();
  }

  /** 暂停。 */
  pause() {
    this.playing = false;
    this.stopRaf();
    this.emit();
  }

  togglePlay() {
    if (this.playing) this.pause();
    else this.play();
  }

  /** 设置速度（0.5 / 1 / 2）。 */
  setSpeed(s: number) {
    this.speed = s;
    this.emit();
  }

  /** 跳转到指定时间（秒），并重算该时刻的所有轨道状态（不播放，用于拖动进度条）。 */
  seek(t: number) {
    this.time = Math.max(0, Math.min(this.duration, t));
    this.applyAt(this.time);
    this.emit();
  }

  private stopRaf() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  private loop = () => {
    if (!this.playing) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTs) / 1000); // 限制单帧步长，避免卡顿后跳变
    this.lastTs = now;
    this.time = Math.min(this.duration, this.time + dt * this.speed);
    this.applyAt(this.time);
    this.emit();
    if (this.time >= this.duration) {
      this.playing = false;
      this.stopRaf();
      this.emit();
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  /**
   * 计算 t 时刻的世界状态：插值 Tween、触发一次性 WhenAt、发射并推进粒子。
   * 这是时间轴的「状态场」函数：给定 t，决定一切。
   */
  private applyAt(t: number) {
    const st = this.rt.getState();
    // 1) Tween：先按各轨道把属性设到 t 时刻的插值
    for (const tr of this.tracks) {
      if (tr.type !== "tween") continue;
      const k = t <= tr.t0 ? 0 : t >= tr.t1 ? 1 : (t - tr.t0) / (tr.t1 - tr.t0);
      const val = tr.a + (tr.b - tr.a) * k;
      this.applyTarget(tr.target, val);
    }
    // 1.5) Orbit：角色绕中心做椭圆公转（按进度插值角度）
    for (const tr of this.tracks) {
      if (tr.type !== "orbit") continue;
      const k = t <= tr.t0 ? 0 : t >= tr.t1 ? 1 : (t - tr.t0) / (tr.t1 - tr.t0);
      const ang = -Math.PI / 2 + k * tr.loops * Math.PI * 2; // 从顶部开始转
      const a = st.actors.find((x) => x.id === tr.actorId);
      if (a) {
        a.x = tr.cx + Math.cos(ang) * tr.rx;
        a.y = tr.cy + Math.sin(ang) * tr.ry;
        // 朝向：切线前进方向，angle 以 0=右 / 270=上 计
        a.angle = (Math.atan2(Math.cos(ang) * tr.rx, Math.sin(ang) * tr.ry) * 180) / Math.PI + 90;
      }
    }
    // 2) WhenAt：当 t 越过触发时刻且尚未触发，则触发一次性动作
    for (const tr of this.tracks) {
      if (tr.type !== "whenAt") continue;
      if (!tr.fired && t >= tr.t) {
        tr.fired = true;
        this.fireWhenAt(tr);
      } else if (tr.fired && t < tr.t) {
        // 拖动回触发时刻之前 → 允许再次触发（重播语义）
        tr.fired = false;
      }
    }
    // 3) 粒子：发射 + 推进
    this.updateParticles(t);
  }

  private applyTarget(target: TweenTarget, val: number) {
    const st = this.rt.getState();
    switch (target.kind) {
      case "actorX": {
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) a.x = val;
        break;
      }
      case "actorY": {
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) a.y = val;
        break;
      }
      case "actorSize": {
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) a.size = val;
        break;
      }
      case "actorAngle": {
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) a.angle = val;
        break;
      }
      case "actorAlpha": {
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) a.visible = val >= 0.5; // alpha 0.5 以上视为可见
        break;
      }
      case "actorHue": {
        // 角色染色：存到 actors 上的临时字段（渲染层用 actor.tint 着色），无则用 penColor 复用逻辑
        const a = st.actors.find((x) => x.id === target.actorId);
        if (a) (a as unknown as { tint?: number }).tint = val;
        break;
      }
      case "bgHue": {
        (st as unknown as { bgHue?: number }).bgHue = val;
        break;
      }
    }
  }

  private fireWhenAt(tr: WhenAtTrack) {
    const st = this.rt.getState();
    const act = tr.action;
    switch (act.kind) {
      case "say": {
        const a = st.actors.find((x) => x.id === act.actorId);
        if (a) {
          a.message = act.text;
          a.messageUntil = Date.now() + act.seconds * 1000;
          this.rt.log(`[${a.name}] ${act.text}`);
          setTimeout(() => {
            a.message = null;
            this.rt.notify();
          }, act.seconds * 1000);
        }
        break;
      }
      case "setScene":
        this.rt.setScene(act.sceneId);
        break;
      case "setExpression": {
        const a = st.actors.find((x) => x.id === act.actorId);
        if (a) this.rt.setExpression((act.expr ?? "normal") as unknown as "normal" | "happy" | "angry" | "surprised" | "sleepy");
        break;
      }
      case "show":
        this.rt.showActor(act.actorId);
        break;
      case "hide":
        this.rt.hideActor(act.actorId);
        break;
    }
  }

  private updateParticles(t: number) {
    const st = this.rt.getState();
    const dt = 1 / 60;
    // 发射：遍历 particle 轨道，在 [tStart,tEnd] 内按 rate 累积发射
    for (const tr of this.tracks) {
      if (tr.type !== "particles") continue;
      const p = tr as ParticleTrack;
      if (t < p.tStart || t > p.tEnd) continue;
      p.emitted = (p.emitted ?? 0) + p.rate * dt * this.speed;
      while ((p.emitted ?? 0) >= 1) {
        p.emitted! -= 1;
        st.particles!.push(this.makeParticle(p));
      }
    }
    // 推进：按 dt*speed 更新每个粒子的位置/寿命，出界或到寿命则移除
    const step = dt * this.speed;
    const halfW = this.rt.getWidth() / 2 + 40;
    const halfH = this.rt.getHeight() / 2 + 40;
    const next: Particle[] = [];
    for (const part of st.particles ?? []) {
      part.age += step;
      part.x += part.vx * step;
      part.y += part.vy * step;
      if (part.kind === "rain") {
        part.vy -= 0; // 雨匀速下落（重力已被初速吸收，保持直线感）
      } else if (part.kind === "snow") {
        part.vx += Math.sin((part.age + part.x) * 3) * 6 * step; // 雪飘
      } else if (part.kind === "lava") {
        part.vy -= 60 * step; // 岩浆受重力
      }
      const out = Math.abs(part.x) > halfW || Math.abs(part.y) > halfH;
      const dead = part.kind === "lava" && part.age > part.life;
      if (!out && !dead) next.push(part);
    }
    st.particles = next;
  }

  private makeParticle(p: ParticleTrack): Particle {
    const halfW = this.rt.getWidth() / 2;
    if (p.kind === "rain") {
      const x = (Math.random() * 2 - 1) * halfW;
      const sp = p.speedMin + Math.random() * (p.speedMax - p.speedMin);
      return { x, y: this.rt.getHeight() / 2 + 20, vx: 0, vy: -sp, color: p.color, r: 2, kind: "rain", age: 0, life: 99 };
    }
    if (p.kind === "snow") {
      const x = (Math.random() * 2 - 1) * halfW;
      const sp = p.speedMin + Math.random() * (p.speedMax - p.speedMin);
      return { x, y: this.rt.getHeight() / 2 + 20, vx: (Math.random() * 2 - 1) * 20, vy: -sp, color: p.color, r: 2.5, kind: "snow", age: 0, life: 99 };
    }
    // lava：从底部中央喷发，抛物线
    const sp = p.speedMin + Math.random() * (p.speedMax - p.speedMin);
    const ang = -Math.PI / 2 + (Math.random() * 2 - 1) * 0.5; // 朝上、略散开
    return {
      x: (Math.random() * 2 - 1) * 20,
      y: -this.rt.getHeight() / 2 + 10,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      color: p.color,
      r: 3,
      kind: "lava",
      age: 0,
      life: 3,
    };
  }

  private emit() {
    const st = this.rt.getState();
    st.timeline = { duration: this.duration, time: this.time, speed: this.speed, playing: this.playing };
    this.rt.notify();
  }
}

export class Runtime {
  private actions: Action[] = [];
  private onChange: (state: StageState) => void;
  private width: number;
  private height: number;
  private state: StageState;
  private scripts: Script = { whenStart: "", whenStageClicked: "", whenKeyPressed: [], whenReceived: [] };
  /** 当前正在执行（回放）的动作下标；broadcast 触发接收脚本时据此把新动作插到自身之后。 */
  private currentActionIndex = 0;
  private mouse: Point = { x: 0, y: 0 };
  private runningType: "start" | "click" | "key" | null = null;
  private initialStars: Star[];
  private hazards: Hazard[];
  private clouds: Cloud[];
  private initialClouds: Cloud[];
  private vars: Record<string, number> = {};
  private cloudRaf: number | null = null;
  /** 当前被「控制角色」积木选中的角色 id；默认二零，保证旧项目行为不变。 */
  private currentActorId: string = "erling";
  /** 当前处于「落笔」状态的角色 id（画笔路径归属于落笔的那位角色）。默认二零。 */
  private drawingActorId: string = "erling";
  /** 时间轴子系统（分类10·科学）。所有 timeline 能力都委托给它，与 action 队列完全隔离。 */
  public timeline: TimelineEngine;

  constructor(
    width: number,
    height: number,
    onChange: (state: StageState) => void,
    initialStars?: Star[],
    opts?: {
      hazards?: Hazard[];
      clouds?: Cloud[];
      /** 额外的伙伴角色（如 三七）；二零始终存在。 */
      companions?: { id: string; species: Species; name: string }[];
    }
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
    const actors: ActorState[] = [makeActor("erling", "erling", "二零")];
    for (const c of opts?.companions ?? []) {
      actors.push(makeActor(c.id, c.species, c.name));
    }
    this.state = {
      width,
      height,
      actor: actors[0],
      actors,
      penPaths: [],
      currentPath: null,
      penColor: 0,
      penSize: DEFAULT_PEN_SIZE,
      penDown: false,
      stars: this.initialStars.map((s) => ({ ...s })),
      clouds: this.initialClouds.map((c) => ({ x: c.x, y: c.y, r: c.r })),
      particles: [],
      running: false,
      log: [],
    };
    // 时间轴引擎：构造即初始化（与 action 队列完全隔离，旧项目不调用它的方法即无副作用）
    this.timeline = new TimelineEngine(this);
  }

  getState() {
    return this.state;
  }

  /** 供时间轴引擎触发渲染（emit 为 private，这里暴露一个安全的通知入口）。 */
  notify() {
    this.emit();
  }

  /** 供时间轴引擎读取舞台尺寸（width/height 为 private）。 */
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  /** 颜色混合（reporter）：返回结果色名字符串（如「橙」），供「说」展示科学结论。 */
  timelineMix(c1: string, c2: string): string {
    const name = mixColorName(c1, c2);
    this.log(`[科学] ${c1} + ${c2} = ${name}`);
    return name;
  }

  reset() {
    this.actions = [];
    for (const a of this.state.actors) {
      a.x = 0;
      a.y = 0;
      a.angle = 270;
      a.message = null;
      a.messageUntil = 0;
      a.size = 1;
      a.expression = "normal";
      a.visible = true;
    }
    this.currentActorId = "erling";
    this.drawingActorId = "erling";
    this.vars = {};
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penColor = 0;
    this.state.penSize = DEFAULT_PEN_SIZE;
    this.state.penDown = false;
    this.state.scene = undefined;
    this.state.stars = this.initialStars.map((s) => ({ ...s }));
    this.clouds = this.initialClouds.map((c) => ({ ...c }));
    this.state.clouds = this.initialClouds.map((c) => ({ x: c.x, y: c.y, r: c.r }));
    this.state.running = false;
    this.state.log = [];
    this.runningType = null;
    this.emit();
  }

  // --- 多角色支持（分类7·故事）：动作默认作用于「当前控制角色」，旧项目恒为二零 ---
  private currentActor(): ActorState {
    return this.state.actors.find((a) => a.id === this.currentActorId) ?? this.state.actors[0];
  }

  private findActor(id: string): ActorState | undefined {
    return this.state.actors.find((a) => a.id === id);
  }

  private actorName(id: string): string {
    return this.findActor(id)?.name ?? id;
  }

  /** 切换后续积木作用的角色（「控制角色」积木）。 */
  controlActor(id: string) {
    if (this.findActor(id)) {
      this.currentActorId = id;
      this.log(`[系统] 切换到控制角色 ${this.actorName(id)}`);
    }
    this.emit();
  }

  /** 显示一个角色（「显示角色」积木，变魔术用）。 */
  showActor(id: string) {
    const a = this.findActor(id);
    if (a) {
      a.visible = true;
      this.log(`[系统] ${a.name} 出现了`);
    }
    this.emit();
  }

  /** 隐藏一个角色（「隐藏角色」积木，变魔术用）。 */
  hideActor(id: string) {
    const a = this.findActor(id);
    if (a) {
      a.visible = false;
      this.log(`[系统] ${a.name} 藏起来了`);
    }
    this.emit();
  }

  /** 切换舞台场景（「切换场景」积木，一天的生活用）。 */
  setScene(sceneId: string) {
    const scene = SCENES[sceneId];
    if (scene) {
      this.state.scene = scene;
      this.log(`[系统] 场景切换到 ${scene.label}`);
    }
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
    this.actions.push({ type: "penDown", actorId: this.currentActorId });
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
    this.actions.push({ type: "setSize", size: s, actorId: this.currentActorId });
    this.log("[系统] 二零大小设置");
  }

  changeSize(delta: number) {
    this.actions.push({ type: "changeSize", delta, actorId: this.currentActorId });
    this.log("[系统] 二零大小改变");
  }

  // --- Queries used by generated scripts ---
  /** 角色是否碰到舞台边缘（距边界 30 单位内即视为碰到）。 */
  touchingEdge(): boolean {
    const margin = 30;
    return (
      Math.abs(this.currentActor().x) > this.width / 2 - margin ||
      Math.abs(this.currentActor().y) > this.height / 2 - margin
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
    return this.currentActor().size;
  }

  /** 设置角色表情（用于「变表情」类项目）。 */
  setExpression(name: "normal" | "happy" | "angry" | "surprised" | "sleepy") {
    this.currentActor().expression = name;
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

  /** 读取某个项目的最高分（本地保存，跨刷新保留）。没有记录时返回 0。 */
  getBest(key: string): number {
    if (typeof window === "undefined" || !window.localStorage) return 0;
    try {
      const raw = window.localStorage.getItem(`cp_best_${key}`);
      return raw ? Number(raw) || 0 : 0;
    } catch {
      return 0;
    }
  }

  /** 写入最高分（只有比已记录更高才更新）。返回更新后的最高分。 */
  setBest(key: string, value: number): number {
    const prev = this.getBest(key);
    if (value > prev) {
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          window.localStorage.setItem(`cp_best_${key}`, String(value));
        } catch {
          /* 忽略隐私模式等写入失败 */
        }
      }
      this.log(`[系统] 新纪录！最高分更新为 ${value}`);
      return value;
    }
    return prev;
  }

  // --- 算术（分类 9 · 数学启蒙）：同步计算并返回结果，同时记日志供步骤判定 ---
  // 与 getVar 一样是「即时计算」，不进 Action 队列（运算本身无需动画，结果由「说」展示）。
  add(a: number, b: number): number {
    const r = a + b;
    this.log(`[计算] ${a} + ${b} = ${r}`);
    return r;
  }
  sub(a: number, b: number): number {
    const r = a - b;
    this.log(`[计算] ${a} - ${b} = ${r}`);
    return r;
  }
  mul(a: number, b: number): number {
    const r = a * b;
    this.log(`[计算] ${a} × ${b} = ${r}`);
    return r;
  }
  div(a: number, b: number): number {
    const d = b === 0 ? 1 : b;
    const r = a / d;
    this.log(`[计算] ${a} ÷ ${b} = ${r}`);
    return r;
  }

  /** 角色是否碰到指定种类的危险标记（障碍 / 坏人）。 */
  touchingMark(kind: string): boolean {
    return this.hazards.some((h) => {
      if (h.kind !== kind) return false;
      const dx = this.currentActor().x - h.x;
      const dy = this.currentActor().y - h.y;
      return Math.sqrt(dx * dx + dy * dy) < h.r + 30;
    });
  }

  /** 角色是否碰到任意一朵乌云。 */
  touchingCloud(): boolean {
    return this.clouds.some((c) => {
      const dx = this.currentActor().x - c.x;
      const dy = this.currentActor().y - c.y;
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
    this.actions.push({ type: "move", steps, duration: Math.abs(steps) * 4, actorId: this.currentActorId });
  }

  turn(degrees: number) {
    this.actions.push({ type: "turn", degrees, duration: Math.abs(degrees) * 4, actorId: this.currentActorId });
  }

  goto(x: number, y: number) {
    this.actions.push({ type: "goto", x, y, duration: 500, actorId: this.currentActorId });
  }

  gotoMouse() {
    this.actions.push({ type: "gotoMouse", duration: 600, actorId: this.currentActorId });
  }

  gotoStar(index: number) {
    this.actions.push({ type: "gotoStar", index, duration: 600, actorId: this.currentActorId });
  }

  say(text: string | number, seconds: number) {
    const t = text == null ? "" : String(text);
    this.actions.push({ type: "say", text: t, duration: seconds * 1000, actorId: this.currentActorId });
  }

  wait(seconds: number) {
    this.actions.push({ type: "wait", seconds: seconds * 1000 });
  }

  /**
   * 广播一条消息（多角色协作）。它仅把一个 broadcast 动作入队；真正执行到该动作时，
   * 会触发所有「当接收到 这条消息」的脚本，并把它们的动作插到当前动作之后，
   * 使接收角色在广播的"瞬间"立即响应（近似 Scratch 的并行广播语义）。
   */
  broadcast(message: string) {
    this.actions.push({ type: "broadcast", message, actorId: this.currentActorId });
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
    this.actions.push({ type: "playToneByActorX", actorId: this.currentActorId });
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
      const dx = this.currentActor().x - star.x;
      const dy = this.currentActor().y - star.y;
      return Math.sqrt(dx * dx + dy * dy) < 35;
    });
  }

  collectNearbyStars() {
    this.state.stars.forEach((star, index) => {
      if (!star.collected) {
        const dx = this.currentActor().x - star.x;
        const dy = this.currentActor().y - star.y;
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

  /** 当前控制的角色是否碰到另一个角色（多角色游戏：猫追老鼠 / 守护与躲避 / 双人对战）。 */
  touchingActor(otherId: string): boolean {
    const self = this.currentActor();
    const other = this.findActor(otherId);
    if (!other || self.id === other.id) return false;
    const dx = self.x - other.x;
    const dy = self.y - other.y;
    const r = 28 * (self.size + other.size) / 2; // 碰撞半径随两者大小变化
    return Math.sqrt(dx * dx + dy * dy) < r;
  }

  /** 当前控制的角色到另一个角色的距离（接力赛交接 / 排队间距 / 距离判断）。 */
  distanceTo(otherId: string): number {
    const self = this.currentActor();
    const other = this.findActor(otherId);
    if (!other) return Infinity;
    const dx = self.x - other.x;
    const dy = self.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // --- Script registration ---
  setScripts(scripts: Script) {
    this.scripts = scripts;
  }

  /**
   * 时间轴模式运行：把生成的 JS（内含 __runtime.timeline.reset/addTrack）注入执行，
   * 再用时钟从头播放。与 action 队列的 runScript 完全隔离。
   */
  runTimelineCode(code: string) {
    if (this.state.running) return;
    this.state.running = true;
    this.state.log = [];
    this.emit();
    try {
      const wrapped = `(function(__runtime) {\n${code}\n})(__runtimeArg);`;
      (window as unknown as Record<string, unknown>).__runtimeArg = this;
      // eslint-disable-next-line no-eval
      eval(wrapped);
    } catch (e) {
      this.log(`[系统] 时间轴程序出错：${e}`);
    } finally {
      delete (window as unknown as Record<string, unknown>).__runtimeArg;
    }
    // 轨道已加好：确保处于 t=0 初始帧，然后开始播放
    this.timeline.seek(0);
    this.timeline.play();
    this.state.running = false;
    this.emit();
  }

  start() {
    this.actions = [];
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penDown = false;
    for (const a of this.state.actors) a.size = 1;
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

    for (this.currentActionIndex = 0; this.currentActionIndex < this.actions.length; this.currentActionIndex++) {
      await this.performAction(this.actions[this.currentActionIndex]);
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

  /**
   * 广播分发：把匹配 message 的「当接收到」脚本即时求值，生成动作，
   * 并插入到当前正在执行的动作（广播动作）之后，让接收角色立刻响应。
   */
  private _runReceiveHandlers(message: string) {
    const handlers = (this.scripts.whenReceived ?? []).filter((h) => h.message === message && h.code);
    if (!handlers.length) return;
    this.log(`[系统] 接收到消息「${message}」`);
    const before = this.actions.length;
    for (const h of handlers) {
      try {
        const wrapped = `(function(__runtime) {\n${h.code}\n})(__runtimeArg);`;
        (window as unknown as Record<string, unknown>).__runtimeArg = this;
        // eslint-disable-next-line no-eval
        eval(wrapped);
      } catch (e) {
        this.log(`[系统] 接收脚本出错：${e}`);
      } finally {
        delete (window as unknown as Record<string, unknown>).__runtimeArg;
      }
    }
    if (this.actions.length > before) {
      const added = this.actions.splice(before);
      this.actions.splice(this.currentActionIndex + 1, 0, ...added);
    }
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
      const d = this.findActor(this.drawingActorId) ?? this.currentActor();
      this.state.currentPath = {
        points: [{ x: d.x, y: d.y }],
        color: `hsl(${this.state.penColor % 360}, 80%, 60%)`,
        width: this.state.penSize,
      };
    }
  }

  private recordPenPosition() {
    if (this.state.penDown && this.state.currentPath) {
      const d = this.findActor(this.drawingActorId) ?? this.currentActor();
      this.state.currentPath.points.push({ x: d.x, y: d.y });
    }
  }

  private performAction(action: Action): Promise<void> {
    // 解析「动作所属角色」：优先用入队时捕获的 actorId，否则回退到当前控制角色。
    const actor = this.findActor(action.actorId ?? this.currentActorId) ?? this.currentActor();
    return new Promise((resolve) => {
      switch (action.type) {
        case "broadcast": {
          this.log(`[系统] 广播消息「${action.message}」`);
          this._runReceiveHandlers(action.message);
          resolve();
          break;
        }
        case "move": {
          this.log(`[系统] ${actor.name}开始移动`);
          const rad = (actor.angle * Math.PI) / 180;
          // 渲染坐标世界 Y 轴朝上（toScreen 用 ch/2 - wy），故世界位移的 Y 分量取负，
          // 使「脸朝的方向 == 移动方向」：angle=270(朝上) 时 dy=-sin(270)*steps=+steps → 世界 Y 增大=向上。
          const dx = action.steps * Math.cos(rad);
          const dy = -action.steps * Math.sin(rad);
          this.animateValue(
            { x: actor.x, y: actor.y },
            { x: actor.x + dx, y: actor.y + dy },
            action.duration,
            (v) => {
              actor.x = v.x;
              actor.y = v.y;
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
          this.log(`[系统] ${actor.name}开始转向`);
          const startAngle = actor.angle;
          this.animateValue(
            { a: startAngle },
            { a: startAngle + action.degrees },
            action.duration,
            (v) => {
              actor.angle = v.a;
              this.emit();
            },
            resolve
          );
          break;
        }
        case "goto": {
          this.log(`[系统] ${actor.name}移动到指定位置`);
          this.animateValue(
            { x: actor.x, y: actor.y },
            { x: action.x, y: action.y },
            action.duration,
            (v) => {
              actor.x = v.x;
              actor.y = v.y;
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
          this.log(`[系统] ${actor.name}飞向鼠标位置`);
          this.animateValue(
            { x: actor.x, y: actor.y },
            { x: this.mouse.x, y: this.mouse.y },
            action.duration,
            (v) => {
              actor.x = v.x;
              actor.y = v.y;
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
          this.log(`[系统] ${actor.name}飞向星星`);
          this.animateValue(
            { x: actor.x, y: actor.y },
            { x: star.x, y: star.y },
            action.duration,
            (v) => {
              actor.x = v.x;
              actor.y = v.y;
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
          actor.message = action.text;
          actor.messageUntil = Date.now() + action.duration;
          this.log(`[${actor.name}] ${action.text}`);
          this.emit();
          setTimeout(() => {
            actor.message = null;
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
          const freq = pitchFromX(actor.x, this.width);
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
          this.drawingActorId = action.actorId ?? this.currentActorId;
          this.state.penDown = true;
          const d = this.findActor(this.drawingActorId) ?? this.currentActor();
          this.state.currentPath = {
            points: [{ x: d.x, y: d.y }],
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
          actor.size = action.size;
          this.emit();
          resolve();
          break;
        }
        case "changeSize": {
          actor.size = Math.max(0.2, Math.min(5, actor.size + action.delta));
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
