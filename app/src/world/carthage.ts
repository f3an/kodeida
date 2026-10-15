/*
 * Світ 2 · Карфаген Дидони. Програє лог подій: кожне читання height[i] — герой іде до стовпа i.
 * Дві останні різні позиції читання — це кінці ділянки; між ними набирається вода.
 */
import type { WorldEvent } from '../engine/types.ts';
import { makeDido, makeEnei, makeFox, makeWolf, hash } from './sprites.js';

export const W = 640, H = 400;
const FOX_PURPLE = '#9b3a87';
const BASE = 286;           // земля під стовпами
const PATH_Y = 392;         // стежка, по якій ходять герої
const X0 = 172, X1 = 566;   // межі ряду стовпів
const MAX_POST = 190;

const ENEI = makeEnei(0), ENEI_BLINK = makeEnei(0, { blink: true });
const FOX = makeFox(FOX_PURPLE), FOX_BLINK = makeFox(FOX_PURPLE, { cursorOff: true });
const WOLF = makeWolf({ drool: 2 });
const DIDO = makeDido();

export type Actor = 'heroes' | 'wolf';

export interface SceneState {
  step: number;
  total: number;
  /** Кінці поточної ділянки (за читаннями) і її площа. */
  pair: [number, number] | null;
  area: number;
  /** Найбільша площа серед показаних ділянок. */
  best: number;
  reads: number;
  done: boolean;
  playing: boolean;
}

interface Walker { x: number; tx: number; face: 1 | -1 }

export class CarthageScene {
  private ctx: CanvasRenderingContext2D;
  private heights: number[] = [];
  private events: WorldEvent[] = [];
  private reads: { i: number; at: number }[] = [];
  private actor: Actor = 'heroes';
  private k = 0;                       // скільки подій уже програно
  private acc = 0;
  private playing = false;
  private speed = 1;
  private last = 0;
  private raf = 0;
  private flash = new Map<number, number>();
  private enei: Walker = { x: 0, tx: 0, face: 1 };
  private fox: Walker = { x: 0, tx: 0, face: -1 };
  private best = 0;
  private bestPair: [number, number] | null = null;
  private bg: HTMLCanvasElement;
  private onState: (s: SceneState) => void;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private canvas: HTMLCanvasElement, onState: (s: SceneState) => void) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.onState = onState;
    this.bg = document.createElement('canvas');
    this.bg.width = W; this.bg.height = H;
    paintBackground(this.bg.getContext('2d')!);
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() { cancelAnimationFrame(this.raf); }

  load(heights: number[], events: WorldEvent[], actor: Actor) {
    this.heights = heights.slice();
    this.events = events.filter((e) => e.t === 'read');
    this.actor = actor;
    this.reset();
  }

  reset() {
    this.k = 0; this.acc = 0; this.best = 0; this.bestPair = null; this.playing = false; this.reads = []; this.flash.clear();
    const n = this.heights.length;
    this.enei = { x: this.postX(0) - 34, tx: this.postX(0) - 34, face: 1 };
    this.fox = { x: this.postX(Math.max(0, n - 1)) + 30, tx: this.postX(Math.max(0, n - 1)) + 30, face: -1 };
    this.emit();
  }

  play() { if (this.k >= this.events.length) this.reset(); this.playing = this.events.length > 0; this.emit(); }
  pause() { this.playing = false; this.emit(); }
  setSpeed(s: number) { this.speed = s; }
  step() { this.playing = false; this.advance(); }
  /** Одразу до кінця (пропустити анімацію). */
  finish() { this.playing = false; while (this.k < this.events.length) this.advance(true); this.snap(); this.emit(); }

  private postX(i: number) {
    const n = Math.max(this.heights.length, 2);
    return Math.round(X0 + (i * (X1 - X0)) / (n - 1));
  }
  private postH(v: number) {
    const max = Math.max(1, ...this.heights);
    return Math.max(4, Math.round((v / max) * MAX_POST));
  }

  /** Показана ділянка: поточна, а після останньої події — найкраща. */
  private shown(): [number, number] | null {
    return this.k >= this.events.length && this.events.length > 0 && this.bestPair ? this.bestPair : this.pair();
  }

  private pair(): [number, number] | null {
    const r = this.reads;
    if (r.length === 0) return null;
    const a = r[r.length - 1].i;
    for (let j = r.length - 2; j >= 0; j--) if (r[j].i !== a) return a < r[j].i ? [a, r[j].i] : [r[j].i, a];
    return null;
  }
  private areaOf(p: [number, number] | null) {
    return p ? (p[1] - p[0]) * Math.min(this.heights[p[0]], this.heights[p[1]]) : 0;
  }

  private advance(silent = false) {
    if (this.k >= this.events.length) return;
    const e = this.events[this.k++];
    if (e.t === 'read' && e.i >= 0 && e.i < this.heights.length) {
      this.reads.push({ i: e.i, at: this.k });
      if (!silent) this.flash.set(e.i, performance.now());
      const p = this.pair();
      if (p && this.areaOf(p) > this.best) { this.best = this.areaOf(p); this.bestPair = p; }
      this.aim(e.i, p);
    }
    if (this.k >= this.events.length) {
      this.playing = false;
      // Наприкінці герої стають біля найкращої ділянки.
      if (this.bestPair && this.actor === 'heroes') this.aim(-1, this.bestPair);
    }
    if (!silent) this.emit();
  }

  /** Куди йдуть герої: Еней до лівого кінця, Микита до правого; Вовк — до щойно прочитаного стовпа. */
  private aim(i: number, p: [number, number] | null) {
    if (i < 0 && p) { this.enei.tx = this.postX(p[0]) - 34; this.fox.tx = this.postX(p[1]) + 30; return; }
    if (this.actor === 'wolf') { this.enei.tx = this.postX(i) - 24; return; }
    if (p) { this.enei.tx = this.postX(p[0]) - 34; this.fox.tx = this.postX(p[1]) + 30; }
    else if (i <= (this.heights.length - 1) / 2) this.enei.tx = this.postX(i) - 34;
    else this.fox.tx = this.postX(i) + 30;
  }
  private snap() { this.enei.x = this.enei.tx; this.fox.x = this.fox.tx; }

  private emit() {
    const p = this.shown();
    this.onState({
      step: this.k, total: this.events.length, pair: p, area: this.areaOf(p), best: this.best,
      reads: this.reads.length, done: this.events.length > 0 && this.k >= this.events.length, playing: this.playing,
    });
  }

  private tick = (now: number) => {
    const dt = Math.min(100, now - (this.last || now));
    this.last = now;
    if (this.playing) {
      // Довгий лог (Вовк) прискорюється сам, щоб перегляд не тягнувся хвилинами.
      const per = 380 / this.speed / Math.max(1, Math.sqrt(this.events.length / 40));
      this.acc += dt;
      while (this.acc >= per && this.playing) { this.acc -= per; this.advance(); }
    }
    for (const w of [this.enei, this.fox]) {
      const d = w.tx - w.x;
      if (Math.abs(d) > 0.5) { w.face = d > 0 ? 1 : -1; w.x += this.reduced ? d : d * Math.min(1, dt / 90); } else w.x = w.tx;
    }
    this.draw(now);
    this.raf = requestAnimationFrame(this.tick);
  };

  private draw(now: number) {
    const c = this.ctx;
    c.clearRect(0, 0, W, H);
    c.drawImage(this.bg, 0, 0);
    const t = this.reduced ? 0 : now / 1000;
    const n = this.heights.length;
    const p = this.shown();
    let label: (() => void) | null = null;

    // вода між кінцями ділянки
    if (p) {
      const xl = this.postX(p[0]) + 4, xr = this.postX(p[1]);
      const level = this.postH(Math.min(this.heights[p[0]], this.heights[p[1]]));
      const top = BASE - level;
      const wolf = this.actor === 'wolf';
      c.fillStyle = wolf ? 'rgba(138,143,150,.55)' : 'rgba(63,127,208,.55)';
      c.fillRect(xl, top, xr - xl, level);
      c.fillStyle = wolf ? 'rgba(200,204,210,.7)' : 'rgba(170,215,245,.85)';
      for (let x = xl; x < xr; x += 2) if (((x >> 1) + Math.floor(t * 6)) % 8 < 3) c.fillRect(x, top, 2, 2);
      const text = `${p[1] - p[0]} × ${Math.min(this.heights[p[0]], this.heights[p[1]])} = ${this.areaOf(p)}`;
      const gold = this.areaOf(p) === this.best && this.best > 0;
      label = () => {
        c.font = '600 12px "Fira Code", monospace';
        const tw = c.measureText(text).width + 12;
        const lx = Math.round((xl + xr) / 2 - tw / 2), ly = Math.max(8, top - 26);
        c.fillStyle = 'rgba(20,27,23,.86)'; c.fillRect(lx, ly, tw, 18);
        c.fillStyle = gold ? '#f2d27a' : '#e7e0cf';
        c.fillText(text, lx + 6, ly + 13);
      };
    }

    // стовпи
    for (let i = 0; i < n; i++) {
      const x = this.postX(i), h = this.postH(this.heights[i]);
      const f = this.flash.get(i);
      const glow = f ? Math.max(0, 1 - (now - f) / 500) : 0;
      c.fillStyle = '#5e3a1c'; c.fillRect(x, BASE - h, 6, h);
      c.fillStyle = '#7a4a24'; c.fillRect(x, BASE - h, 4, h);
      c.fillStyle = '#9a6434'; c.fillRect(x, BASE - h, 2, h);
      c.fillStyle = glow > 0 ? `rgba(255,236,150,${0.4 + glow * 0.6})` : '#d9a521';
      c.fillRect(x - 2, BASE - h - 4, 10, 4);
      if (glow > 0) { c.fillStyle = `rgba(255,236,150,${glow * 0.35})`; c.fillRect(x - 6, BASE - h - 10, 18, h + 10); }
      c.font = '600 12px "Fira Code", monospace';
      c.fillStyle = '#3e2c16';
      const s = String(this.heights[i]);
      c.fillText(s, x + 3 - c.measureText(s).width / 2, BASE + 14);
      c.fillStyle = '#8a6a40';
      c.fillText(String(i), x + 3 - c.measureText(String(i)).width / 2, BASE + 28);
    }

    label?.();

    // Дидона
    DIDO.draw(c, 4, PATH_Y - DIDO.h * 2, 2);

    // герої
    const blink = Math.floor(t * 10) % 37 === 0;
    const bob = (w: Walker) => (Math.abs(w.tx - w.x) > 1 ? (Math.floor(t * 8) % 2) * 2 : 0);
    if (this.actor === 'wolf') {
      drawFacing(c, WOLF, this.enei.x - WOLF.w, PATH_Y - WOLF.h * 2 - bob(this.enei), this.enei.face);
    } else {
      drawFacing(c, blink ? ENEI_BLINK : ENEI, this.enei.x - ENEI.w, PATH_Y - ENEI.h * 2 - bob(this.enei), 1);
      drawFacing(c, Math.floor(t * 2) % 2 ? FOX_BLINK : FOX, this.fox.x - FOX.w, PATH_Y - FOX.h * 2 - bob(this.fox), 1);
    }

    // пил
    if (!this.reduced) {
      c.fillStyle = 'rgba(246,228,184,.7)';
      for (let i = 0; i < 16; i++) {
        const x = (hash(i, 1) * W + t * (8 + i)) % W, y = 120 + ((hash(i, 2) * 260 + Math.sin(t + i) * 10) % 260);
        c.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, 2, 2);
      }
    }
  }
}

function drawFacing(c: CanvasRenderingContext2D, spr: { w: number; draw: (...a: unknown[]) => void }, x: number, y: number, face: 1 | -1) {
  if (face === 1) { spr.draw(c, Math.round(x), Math.round(y), 2); return; }
  c.save();
  c.translate(Math.round(x) + spr.w * 2, 0);
  c.scale(-1, 1);
  spr.draw(c, 0, Math.round(y), 2);
  c.restore();
}

/** Небо, море, мури Карфагена, пісок — один раз у буфер. Палітра як на сайті. */
function paintBackground(c: CanvasRenderingContext2D) {
  const U = 2;
  const put = (x: number, y: number, col: string) => { c.fillStyle = col; c.fillRect(x * U, y * U, U, U); };
  const GW = W / U, GH = H / U;
  const sky = ['#6fb6e3', '#9fd0ee', '#d4eaf5'];
  for (let y = 0; y < 110; y++) for (let x = 0; x < GW; x++) {
    const tt = (y / 110) * (sky.length - 1), i = Math.floor(tt), f = tt - i;
    put(x, y, f > 0.66 || (f > 0.33 && (x + y) % 2 === 0) ? sky[Math.min(i + 1, 2)] : sky[i]);
  }
  for (let y = -10; y <= 10; y++) for (let x = -10; x <= 10; x++) if (x * x + y * y <= 100) put(128 + x, 22 + y, '#fff1b8');
  const cloud = (cx: number, cy: number, w: number) => {
    for (let y = -6; y <= 6; y++) for (let x = -w; x <= w; x++) {
      const d = (x / w) ** 2 + (y / 6) ** 2 + Math.sin(x * 0.7) * 0.08;
      if (d <= 1 && y <= 3) put(cx + x, cy + y, y > 1 ? '#c9e2f1' : d > 0.7 ? '#e9f4fb' : '#ffffff');
    }
  };
  cloud(40, 24, 22); cloud(250, 30, 16);
  for (let y = 96; y < 112; y++) for (let x = 0; x < GW; x++) put(x, y, x % 12 === 0 && y === 100 ? '#9fd0ee' : '#2f7fb8');
  // мури й вежі
  for (let x = 100; x < GW; x++) for (let y = 64; y < 118; y++) {
    const top = x % 10 < 6 ? 64 : 68;
    if (y >= top) put(x, y, x % 22 === 3 && y > 80 && y < 88 ? '#7a5a32' : x > 250 ? '#c9a466' : '#d9b77a');
  }
  for (let x = 196; x < 216; x++) for (let y = 48; y < 118; y++) put(x, y, '#c9a466');
  for (let x = 196; x < 216; x += 5) for (let y = 43; y < 48; y++) { put(x, y, '#c9a466'); put(x + 1, y, '#c9a466'); }
  for (let x = 203; x < 209; x++) for (let y = 60; y < 70; y++) put(x, y, '#7a5a32');
  // пісок
  for (let y = 118; y < GH; y++) for (let x = 0; x < GW; x++) put(x, y, (x * 7 + y * 3) % 11 === 0 ? '#d4b073' : '#e3c58e');
  for (let x = 0; x < GW; x++) { const y = Math.round(143 + Math.sin(x * 0.06) * 1.5); put(x, y, '#d4b073'); }
  // стежка
  for (let y = 182; y < GH; y++) for (let x = 0; x < GW; x++) put(x, y, (x + y * 3) % 9 === 0 ? '#c9a466' : '#d9b77a');
  // пальма
  for (let i = 0; i < 40; i++) { const y = 142 - i, x = Math.round(48 + Math.sin(i * 0.08) * 3); put(x, y, '#7a5a32'); put(x + 1, y, '#5e4424'); }
  [[-16, -4], [16, -5], [-12, 6], [13, 7], [0, -9]].forEach(([dx, dy]) => {
    for (let s = 0; s <= 16; s++) { const x = Math.round(49 + (dx * s) / 16), y = Math.round(102 + (dy * s) / 16 + (s * s) / 60); put(x, y, '#3f7a3a'); put(x, y + 1, '#2f5f2c'); }
  });
}
