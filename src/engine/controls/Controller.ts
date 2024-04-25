import { vec2 } from 'gl-matrix';
import { Bindings } from './Bindings';

type ControllerMouseMoveEvent = {
  previousPosition: vec2;
  currentPosition: vec2;
  event: MouseEvent;
};

type ControllerMouseClickEvent = {
  mousePosition: vec2;
  event: MouseEvent;
};

type ControllerMouseWheelEvent = {
  dy: number;
  event: WheelEvent;
};

type ControllerKeyDownEvent = {
  key: string;
  event: KeyboardEvent;
};

type ControllerKeyUpEvent = {
  key: string;
  event: KeyboardEvent;
};

type ControllerPointerLockChangeEvent = {
  canvas: HTMLCanvasElement;
  event: Event;
};

type ControllerEvents = {
  mousemove: (e: ControllerMouseMoveEvent) => void;
  click: (e: ControllerMouseClickEvent) => void;
  wheel: (e: ControllerMouseWheelEvent) => void;
  keydown: (e: ControllerKeyDownEvent) => void;
  keyup: (e: ControllerKeyUpEvent) => void;
  pointerlockchange: (e: ControllerPointerLockChangeEvent) => void;
};
type ControllerEventName = keyof ControllerEvents;

type ControllerEventHandlers = {
  mousemove: Array<(e: ControllerMouseMoveEvent) => void>;
  click: Array<(e: ControllerMouseClickEvent) => void>;
  wheel: Array<(e: ControllerMouseWheelEvent) => void>;
  keydown: Array<(e: ControllerKeyDownEvent) => void>;
  keyup: Array<(e: ControllerKeyUpEvent) => void>;
  pointerlockchange: Array<(e: ControllerPointerLockChangeEvent) => void>;
};

export class Controller {
  private canvas?: HTMLCanvasElement;

  private handlers: ControllerEventHandlers = {
    mousemove: [],
    click: [],
    wheel: [],
    keydown: [],
    keyup: [],
    pointerlockchange: [],
  };

  private keys: Map<string, number> = new Map(); // keyCode: startTime
  private lastKey = '';
  private combos: Array<string> = [];
  private comboThresholdMS = 250;
  private comboExact = false;
  private timeSinceLastKeyPress = Infinity;
  private curMousePosition: vec2 = [0, 0];
  private prevMousePosition: vec2 | null = null;

  private bindings?: Bindings;

  protected enabled = false;

  constructor(comboThresholdMS = 250, comboExact = false) {
    this.comboThresholdMS = comboThresholdMS;
    this.comboExact = comboExact;
  }

  public addEventListener<T extends ControllerEventName>(
    event: T,
    handler: ControllerEvents[T],
  ) {
    const handlers = this.handlers[event] as ControllerEvents[T][];
    handlers.push(handler as ControllerEvents[T]);
  }

  public requestPointerLock() {
    this.canvas?.addEventListener('click', () => {
      this.canvas?.requestPointerLock();
    });
  }

  public requestFullscreen() {
    this.canvas?.requestPointerLock();
  }

  public registerForCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.addEventListener('mousemove', (evt) => {
      if (!this.enabled) return;
      evt.preventDefault();
      const rect = canvas.getBoundingClientRect();
      this.curMousePosition[0] = evt.clientX - rect.left;
      this.curMousePosition[1] = evt.clientY - rect.top;
      if (!this.prevMousePosition) {
        this.prevMousePosition = [
          evt.clientX - rect.left,
          evt.clientY - rect.top,
        ];
      } else if (this.handlers.mousemove.length > 0) {
        for (const handler of this.handlers.mousemove) {
          handler({
            previousPosition: this.prevMousePosition,
            currentPosition: this.curMousePosition,
            event: evt,
          });
        }
      }
      this.prevMousePosition[0] = this.curMousePosition[0];
      this.prevMousePosition[1] = this.curMousePosition[1];
    });

    canvas.addEventListener('mousedown', (evt) => {
      if (!this.enabled) return;
      const rect = canvas.getBoundingClientRect();
      const curMouse: vec2 = [evt.clientX - rect.left, evt.clientY - rect.top];
      if (this.handlers.click.length > 0) {
        for (const handler of this.handlers.click) {
          handler({ mousePosition: curMouse, event: evt });
        }
      }
    });

    canvas.addEventListener('wheel', (evt) => {
      if (!this.enabled) return;
      evt.preventDefault();
      if (this.handlers.wheel.length > 0) {
        for (const handler of this.handlers.wheel) {
          handler({ dy: -evt.deltaY, event: evt });
        }
      }
    });

    canvas.oncontextmenu = function (evt: Event) {
      evt.preventDefault();
    };

    document.addEventListener('keydown', (e) => {
      if (
        this.bindings &&
        this.bindings.getBindingByKey([...this.combos, e.key])
      ) {
        e.preventDefault();
      }
      if (!this.enabled) return;
      const key = e.key;
      const entry = this.keys.get(key);
      if (entry) return;

      const time = Date.now();
      const deltaTime = time - this.timeSinceLastKeyPress;
      this.timeSinceLastKeyPress = time;
      if (deltaTime < this.comboThresholdMS || this.combos.length === 0) {
        this.combos.push(key);
      } else {
        this.combos = [key];
      }

      this.lastKey = key;
      this.keys.set(key, time);

      // handle bindings
      if (this.bindings) {
        const bound = this.bindings.getBindingByKey(
          Array.from(this.keys.keys()),
        );
        if (bound) {
          e.preventDefault();
          bound.onKeyDown(time);
        }
      }

      // handle handlers
      if (this.handlers.keydown.length > 0) {
        for (const handler of this.handlers.keydown) {
          handler({ key: e.key, event: e });
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      const key = e.key;

      if (this.lastKey === key) {
        this.lastKey = Array.from(this.keys.keys()).pop() || '';
      }
      const entry = this.keys.get(key);
      if (!entry) return;

      // handle bindings
      if (this.bindings) {
        const bound = this.bindings.getBindingByKey(
          Array.from(this.keys.keys()),
        );
        if (bound) {
          e.preventDefault();
          bound.onKeyUp(entry);
        }
      }

      // handle handlers
      if (this.handlers.keyup.length > 0) {
        for (const handler of this.handlers.keyup) {
          handler({ key: e.key, event: e });
        }
      }

      this.keys.delete(key);
    });

    document.addEventListener('pointerlockchange', (e: Event) => {
      if (!this.enabled) return;
      if (this.handlers.pointerlockchange.length > 0 && this.canvas) {
        for (const handler of this.handlers.pointerlockchange) {
          handler({ canvas: this.canvas, event: e });
        }
      }
    });
  }

  public registerBindings(bindings: Bindings) {
    if (this.bindings) return;
    this.bindings = bindings;
  }

  public get keyList(): Array<string> {
    return Array.from(this.keys.keys());
  }

  public get comboList(): Array<string> {
    return this.combos;
  }

  public lastKeyPressed(): string | null {
    if (this.lastKey === '') return null;
    return this.lastKey;
  }

  public keyIsPressed(key: string): boolean {
    return this.keys.has(key);
  }

  public keysArePressed(keys: string[]): boolean {
    return keys.every((k) => this.keyIsPressed(k));
  }

  public checkCombo(combo: string[]): boolean {
    if (this.comboExact) {
      return this.combos.join('') === combo.join('');
    }
    if (this.combos.join('') === '') return false;
    return this.combos.join('').endsWith(combo.join(''));
  }

  public checkCombos(comboList: string[][]): boolean[] {
    return comboList.map(this.checkCombo);
  }

  public clearCombos() {
    this.combos = [];
  }

  public get mouse(): vec2 {
    return this.curMousePosition;
  }

  public get mouseDelta(): vec2 {
    return [
      this.curMousePosition[0] - (this.prevMousePosition?.[0] || 0),
      this.curMousePosition[1] - (this.prevMousePosition?.[1] || 0),
    ];
  }

  public disable() {
    this.enabled = false;
  }

  public enable() {
    this.enabled = true;
  }
}
