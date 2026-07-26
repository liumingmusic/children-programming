export type Action =
  | { type: "move"; steps: number; duration: number }
  | { type: "turn"; degrees: number; duration: number }
  | { type: "goto"; x: number; y: number; duration: number }
  | { type: "say"; text: string; duration: number }
  | { type: "wait"; seconds: number }
  | { type: "reset" };

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
  running: boolean;
  log: string[];
}

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
        angle: 90, // face up by default
        message: null,
        messageUntil: 0,
      },
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

  // Called by generated Blockly code to queue actions
  move(steps: number) {
    this.actions.push({ type: "move", steps, duration: Math.abs(steps) * 4 });
  }

  turn(degrees: number) {
    this.actions.push({ type: "turn", degrees, duration: Math.abs(degrees) * 4 });
  }

  goto(x: number, y: number) {
    this.actions.push({ type: "goto", x, y, duration: 500 });
  }

  say(text: string, seconds: number) {
    this.actions.push({ type: "say", text, duration: seconds * 1000 });
  }

  wait(seconds: number) {
    this.actions.push({ type: "wait", seconds: seconds * 1000 });
  }

  start() {
    this.actions = [];
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

    this.log("[系统] 程序执行完毕");
    this.state.running = false;
    this.emit();
  }

  private performAction(action: Action): Promise<void> {
    return new Promise((resolve) => {
      switch (action.type) {
        case "move": {
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
              this.emit();
            },
            resolve
          );
          break;
        }
        case "turn": {
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
          this.animateValue(
            { x: this.state.actor.x, y: this.state.actor.y },
            { x: action.x, y: action.y },
            action.duration,
            (v) => {
              this.state.actor.x = v.x;
              this.state.actor.y = v.y;
              this.emit();
            },
            resolve
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
        case "reset": {
          this.reset();
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
