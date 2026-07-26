export interface Point {
  x: number;
  y: number;
}

export interface PenPath {
  points: Point[];
  color: string;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export interface ActorState {
  x: number;
  y: number;
  angle: number; // degrees, 0 points right
  message: string | null;
  messageUntil: number;
}

export interface StageState {
  width: number;
  height: number;
  actor: ActorState;
  penPaths: PenPath[];
  currentPath: PenPath | null;
  penColor: number; // hue 0-360
  penDown: boolean;
  stars: Star[];
  running: boolean;
  log: string[];
}

type Action =
  | { type: "move"; steps: number; duration: number }
  | { type: "turn"; degrees: number; duration: number }
  | { type: "goto"; x: number; y: number; duration: number }
  | { type: "gotoStar"; index: number; duration: number }
  | { type: "say"; text: string; duration: number }
  | { type: "wait"; seconds: number };

const DEFAULT_STARS: Star[] = [
  { id: 1, x: -120, y: 80, collected: false },
  { id: 2, x: 140, y: -60, collected: false },
  { id: 3, x: 80, y: 110, collected: false },
];

export class Runtime {
  private actions: Action[] = [];
  private onChange: (state: StageState) => void;
  private width: number;
  private height: number;
  private state: StageState;

  constructor(
    width: number,
    height: number,
    onChange: (state: StageState) => void
  ) {
    this.width = width;
    this.height = height;
    this.onChange = onChange;
    this.state = {
      width,
      height,
      actor: {
        x: 0,
        y: 0,
        angle: 90,
        message: null,
        messageUntil: 0,
      },
      penPaths: [],
      currentPath: null,
      penColor: 0,
      penDown: false,
      stars: DEFAULT_STARS.map((s) => ({ ...s })),
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
      angle: 90,
      message: null,
      messageUntil: 0,
    };
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penColor = 0;
    this.state.penDown = false;
    this.state.stars = DEFAULT_STARS.map((s) => ({ ...s }));
    this.state.running = false;
    this.state.log = [];
    this.emit();
  }

  setStageSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.state.width = width;
    this.state.height = height;
    this.emit();
  }

  log(message: string) {
    this.state.log.push(message);
    if (this.state.log.length > 50) {
      this.state.log.shift();
    }
    this.emit();
  }

  // --- Pen state (immediate, not queued) ---
  penDown() {
    this.state.penDown = true;
    this.state.currentPath = {
      points: [{ x: this.state.actor.x, y: this.state.actor.y }],
      color: `hsl(${this.state.penColor % 360}, 80%, 60%)`,
    };
    this.log("[系统] 画笔落下");
  }

  penUp() {
    this.state.penDown = false;
    if (this.state.currentPath) {
      this.state.penPaths.push(this.state.currentPath);
      this.state.currentPath = null;
    }
    this.emit();
  }

  setPenColor(hue: number) {
    this.commitCurrentPath();
    this.state.penColor = hue % 360;
    this.startCurrentPath();
    this.log("[系统] 画笔颜色设置");
  }

  changePenColor(delta: number) {
    this.commitCurrentPath();
    this.state.penColor = (this.state.penColor + delta) % 360;
    this.startCurrentPath();
    this.log("[系统] 画笔颜色改变");
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

  gotoStar(index: number) {
    this.actions.push({ type: "gotoStar", index, duration: 600 });
  }

  say(text: string, seconds: number) {
    this.actions.push({ type: "say", text, duration: seconds * 1000 });
  }

  wait(seconds: number) {
    this.actions.push({ type: "wait", seconds: seconds * 1000 });
  }

  start() {
    this.actions = [];
    this.state.penPaths = [];
    this.state.currentPath = null;
    this.state.penDown = false;
    this.state.stars = DEFAULT_STARS.map((s) => ({ ...s }));
  }

  end() {
    this.runActions();
  }

  async runActions() {
    if (this.state.running) return;
    this.state.running = true;
    this.state.log = [];
    this.log("[系统] 开始执行程序");
    this.emit();

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
    this.emit();
  }

  private commitCurrentPath() {
    if (this.state.currentPath) {
      this.state.penPaths.push(this.state.currentPath);
      this.state.currentPath = null;
    }
  }

  private startCurrentPath() {
    if (this.state.penDown) {
      this.state.currentPath = {
        points: [{ x: this.state.actor.x, y: this.state.actor.y }],
        color: `hsl(${this.state.penColor % 360}, 80%, 60%)`,
      };
    }
  }

  private recordPenPosition() {
    if (this.state.penDown && this.state.currentPath) {
      this.state.currentPath.points.push({ x: this.state.actor.x, y: this.state.actor.y });
    }
  }

  private collectStar(index: number) {
    const star = this.state.stars[index];
    if (star && !star.collected) {
      star.collected = true;
      this.log(`[系统] 收集到星星 ${index + 1} 号！`);
      this.emit();
    }
  }

  private performAction(action: Action): Promise<void> {
    return new Promise((resolve) => {
      switch (action.type) {
        case "move": {
          this.log("[系统] 二零开始移动");
          const rad = (this.state.actor.angle * Math.PI) / 180;
          const dx = action.steps * Math.cos(rad);
          const dy = action.steps * Math.sin(rad);
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
            resolve
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
      }
    });
  }

  private collectNearbyStars() {
    this.state.stars.forEach((star, index) => {
      if (!star.collected) {
        const dx = this.state.actor.x - star.x;
        const dy = this.state.actor.y - star.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          this.collectStar(index);
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
