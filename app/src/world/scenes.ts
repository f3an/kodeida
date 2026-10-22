/*
 * Сцени світів. Програють лог подій, зібраний у пісочниці:
 *  - ArrayScene — масив як ряд предметів (стовпи, мішки, кораблі, камені, літери); читання підсвічує предмет,
 *    запис змінює його, герої стають біля останніх прочитаних індексів;
 *  - StreetScene — вулиця світу 0, де Еней виконує команди move / jump / take.
 */
import type { SceneSpec } from '../engine/level.ts';
import type { StreetCell, WorldEvent } from '../engine/types.ts';
import { L } from '../i18n.ts';
import { paintTroyNight } from '../ui/story.ts';
import { drawBgFx } from './bgfx.ts';
import { eneiFrames, foxFrames, crewFrames, CREW_ART, worldBg, still, mirror, artImage, TALE_ART, TALE_BG, type ArtSprite } from './art.ts';
import { makeSibyl, makeDido, makeEnei, makeFox, makeWolf, makeEol, makeAnchises, Spr, hash, ruins, sky, sea, drawSack, TROJANS, artOf, fxLayer, pixelGlow, walkCycle, breathCycle, makeRipka, makeKotyhoroshko, makeGoat, makeStrawBull, makeKotsky, makeVixen, makeIvasyk } from './sprites.js';

export const W = 600, H = 390;
/** Світи, де холодно: Еней у жупані (Рукавичка). */
export const COLD_WORLDS = [4];

export type Actor = 'heroes' | 'wolf';

export interface SceneState {
  step: number;
  total: number;
  done: boolean;
  playing: boolean;
  /** Число в куті сцени: «найкраще», «поглядів», «мішків». */
  badge: { label: string; value: string };
}

type Sprite = { w: number; h: number; draw: (...a: unknown[]) => void };
interface Walker { x: number; tx: number; y: number; ty: number; face: 1 | -1 }

const ENEI = makeEnei(1), ENEI_BLINK = makeEnei(1, { blink: true });
const WOLF = makeWolf({ drool: 2 });
const SIBYL = makeSibyl();
/** Герої казок «Абетки», по одному на розділ (розділ 1 — Колобок, він котиться окремо). */
/** Хто з'являється в задачах розділу «Абетки», за вправами (індекс — номер вправи в розділі). */
const TALE_CAST: Record<string, string[][]> = {
  kolobok: [[], [], ['zayets', 'wolf', 'vedmid'], ['zayets', 'wolf', 'vedmid', 'fox']],
  ripka: [['babka'], ['babka', 'onuchka', 'zhuchka'], ['babka', 'onuchka', 'zhuchka', 'kishka', 'myshka'], ['babka', 'onuchka', 'zhuchka', 'kishka', 'myshka']],
  horoshko: [[], ['zmiy'], ['zmiy'], ['zmiy']],
  koza: [[], ['zayets', 'wolf', 'rak'], ['zayets', 'wolf', 'vedmid'], ['zayets', 'rak']],
  bychok: [[], ['vedmid'], ['did', 'babka'], ['vedmid', 'wolf', 'zayets']],
  kotsky: [['wolf', 'kaban', 'zayets'], ['wolf', 'vedmid', 'zayets'], ['wolf', 'kaban', 'zayets'], ['wolf', 'vedmid', 'kaban']],
  lysychka: [['komora'], ['komora'], ['komora'], ['wolf', 'zayets']],
  telesyk: [['mama'], ['mama'], ['mama', 'vidma'], ['mama', 'vidma', 'gusy']],
};
/** Імена в рядках виводу → персонаж: «Привіт, Заєць!» приводить зайця, а не наступного в списку. */
const CAST_NAMES: [RegExp, string][] = [
  [/за[єй]ц|зайчик|hare|bunny/i, 'zayets'], [/вовк|wolf/i, 'wolf'], [/ведмід|ведмед|bear/i, 'vedmid'], [/лис|fox/i, 'fox'],
  [/баб|grandma/i, 'babka'], [/онук|внучк|granddaughter/i, 'onuchka'], [/жучк|dog/i, 'zhuchka'], [/кішк|кіт|cat/i, 'kishka'],
  [/мишк|mouse/i, 'myshka'], [/змі[йя]|dragon/i, 'zmiy'], [/кабан|boar/i, 'kaban'], [/\bрак|crayfish|crab/i, 'rak'],
  [/мам|мати|mother|mom/i, 'mama'], [/відьм|witch/i, 'vidma'], [/гус|geese|goose/i, 'gusy'], [/\bдід|grandpa/i, 'did'],
];
/** Хто вийшов на сцену: по одному на кожен рядок сувою — названий у рядку (лише з героїв цієї казки), інакше наступний зі списку вправи. */
function castFor(list: string[], tale: string[], lines: string[]): string[] {
  const out: string[] = [];
  for (const line of lines) {
    const named = CAST_NAMES.find(([re, who]) => tale.includes(who) && re.test(line) && !out.includes(who))?.[1];
    const next = named ?? list.find((who) => !out.includes(who));
    if (next) out.push(next);
  }
  return out;
}
/** Звір чи персонаж казки дивиться ліворуч — на героя; дикі вовк і лис намальовані праворуч, тож дзеркалимо. */
function castSprite(who: string): ArtSprite | null {
  if (who === 'wolf' || who === 'fox') { const s = still(`cut/${who}Wild-E`); return s ? mirror(s) : null; }
  return still(`tales/${who}`);
}

const TALE_HEROES: (() => Sprite)[] = [makeRipka, makeKotyhoroshko, makeGoat, makeStrawBull, makeKotsky, makeVixen, makeIvasyk];
const CREW = TROJANS.map((trojan, i) => i === 2 ? makeAnchises() : trojan);
const foxes = new Map<string, [Sprite, Sprite]>();
const foxOf = (c: string) => { if (!foxes.has(c)) foxes.set(c, [makeFox(c), makeFox(c, { cursorOff: true })]); return foxes.get(c)!; };
const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Спільне: canvas, цикл кадрів, програвання подій з потрібною швидкістю, крок і «до кінця». */
abstract class SceneBase {
  protected ctx: CanvasRenderingContext2D;
  protected bg: HTMLCanvasElement;
  protected events: WorldEvent[] = [];
  protected k = 0;
  protected playing = false;
  protected speed = 1;
  protected reduced = reducedMotion();
  /** Збори ватаги (світ 0): скільки троянців іде за Енеєм. */
  protected crew = 0;
  /** Світ, чиї частинки й світло живуть поверх фону (як на мапі світів); -1 — без них. */
  protected ambient = -1;
  /** Живі ефекти нового фону (bgfx.ts): ключ фону, напр. 'world-05'; без нього — старі ефекти світу. */
  protected fxKey: string | null = null;
  /** Передній шар ефектів поверх сцени; false — усе за сценою (Абетка: сніг не має сипатися на текст сувою). */
  protected fxOnTop = true;
  /** Кадр Енея, що перекриває ходу й спокій (підбирає мішок тощо). */
  protected eneiPose: ArtSprite | null = null;
  /** Холодний світ: Еней у жупані. */
  protected cold = false;
  /** Реакція на вердикт: помилка — червоний спалах і тремтіння, перемога — стрибок та іскри. */
  private fx: { kind: 'fail' | 'win'; at: number } | null = null;
  private acc = 0;
  private last = 0;
  private raf = 0;

  constructor(canvas: HTMLCanvasElement, protected onState: (s: SceneState) => void, protected fox: string) {
    const dpr = Math.min(devicePixelRatio || 1, 3);
    canvas.width = W * dpr; canvas.height = H * dpr;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.bg = document.createElement('canvas');
    this.bg.width = W; this.bg.height = H;
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() { cancelAnimationFrame(this.raf); }
  play() { if (this.k >= this.events.length) this.reset(); this.playing = this.events.length > 0; this.emit(); }
  pause() { this.playing = false; this.emit(); }
  setSpeed(s: number) { this.speed = s; }
  setCrew(n: number) { this.crew = n; }
  flash(kind: 'fail' | 'win') { this.fx = { kind, at: performance.now() }; }
  step() { this.playing = false; this.advance(false); }
  finish() { this.playing = false; while (this.k < this.events.length) this.advance(true); this.snap(); this.emit(); }

  abstract reset(): void;
  protected abstract apply(e: WorldEvent, silent: boolean): void;
  protected abstract badge(): SceneState['badge'];
  protected abstract walkers(): Walker[];
  protected abstract draw(now: number): void;
  protected ended() {}

  protected advance(silent: boolean) {
    if (this.k >= this.events.length) return;
    this.apply(this.events[this.k++], silent);
    if (this.k >= this.events.length) { this.playing = false; this.ended(); }
    if (!silent) this.emit();
  }
  protected snap() { for (const w of this.walkers()) { w.x = w.tx; w.y = w.ty; } }
  protected emit() {
    this.onState({ step: this.k, total: this.events.length, done: this.events.length > 0 && this.k >= this.events.length, playing: this.playing, badge: this.badge() });
  }
  /** Тривалість однієї події: довгий лог (Вовк) прискорюється сам, щоб перегляд не тягнувся хвилинами. */
  protected stepMs() { return 380 / this.speed / Math.max(1, Math.sqrt(this.events.length / 40)); }

  private tick = (now: number) => {
    const dt = Math.min(100, now - (this.last || now));
    this.last = now;
    if (this.playing) {
      const per = this.stepMs();
      this.acc += dt;
      while (this.acc >= per && this.playing) { this.acc -= per; this.advance(false); }
    } else this.acc = 0;
    for (const w of this.walkers()) {
      const dx = w.tx - w.x, dy = w.ty - w.y;
      if (Math.abs(dx) > 0.5) { w.face = dx > 0 ? 1 : -1; w.x += this.reduced ? dx : dx * Math.min(1, dt / 90); } else w.x = w.tx;
      if (Math.abs(dy) > 0.5) w.y += this.reduced ? dy : dy * Math.min(1, dt / 90); else w.y = w.ty;
    }
    this.ctx.clearRect(0, 0, W, H);
    this.ctx.drawImage(this.bg, 0, 0);
    this.ambientLayer(now, 'back');
    this.draw(now);
    this.ambientLayer(now, 'front');
    this.drawFx(now);
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Частинки й світло світу. Ефекти описано для полотна 400×260, тож масштабуємо до сцени. */
  private ambientLayer(now: number, which: 'back' | 'front') {
    if (this.ambient < 0 && !this.fxKey) return;
    const c = this.ctx, t = this.reduced ? 0 : now / 1000;
    c.save(); c.scale(W / 400, H / 260);
    // новий фон має свої живі ефекти (під його місяць, вогнища, воду); старий — ефекти світу з sprites.js
    const layers: ('back' | 'front')[] = this.fxOnTop ? [which] : which === 'back' ? ['back', 'front'] : [];
    for (const l of layers) if (!(this.fxKey && worldBg(0) && drawBgFx(c, this.fxKey, t, l)) && this.ambient >= 0) fxLayer(c, this.ambient, t, l, true);
    c.restore();
  }

  /** Фаза ефекту 0..1 (або -1, якщо ефекту немає). */
  private fxPhase(now: number, kind: 'fail' | 'win', dur: number) {
    if (!this.fx || this.fx.kind !== kind) return -1;
    const p = (now - this.fx.at) / dur;
    return p >= 0 && p < 1 ? p : -1;
  }

  private drawFx(now: number) {
    const c = this.ctx;
    const f = this.fxPhase(now, 'fail', 900);
    if (f >= 0) {
      // червоні піксельні краї, що згасають
      const a = (1 - f) * 0.55;
      for (let k = 0; k < 5; k++) {
        c.fillStyle = `rgba(179,32,42,${a * (1 - k / 5)})`;
        const d = k * 6;
        c.fillRect(d, d, W - 2 * d, 6); c.fillRect(d, H - d - 6, W - 2 * d, 6);
        c.fillRect(d, d, 6, H - 2 * d); c.fillRect(W - d - 6, d, 6, H - 2 * d);
      }
    }
    const g = this.fxPhase(now, 'win', 1400);
    if (g >= 0 && !this.reduced) {
      // золоті іскри з центру
      for (let i = 0; i < 36; i++) {
        const an = (i / 36) * Math.PI * 2 + hash(i, 3), sp = 120 + hash(i, 4) * 180;
        const x = W / 2 + Math.cos(an) * sp * g, y = H * 0.45 + Math.sin(an) * sp * g * 0.7 + g * g * 120;
        c.fillStyle = i % 3 ? `rgba(242,210,122,${1 - g})` : `rgba(255,250,230,${1 - g})`;
        c.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, 4, 4);
      }
    }
  }

  protected drawHeroes(now: number, enei: Walker, fox: Walker | null, wolf = false) {
    const c = this.ctx, t = this.reduced ? 0 : now / 1000;
    // помилка: Еней тремтить і над ним «!»; перемога: Еней підстрибує
    const fail = this.fxPhase(now, 'fail', 900), win = this.fxPhase(now, 'win', 900);
    const moving = (w: Walker) => !this.reduced && Math.abs(w.tx - w.x) > 1;
    /* новий арт: кадр анімації за часом; стрибок перемоги — за фазою ефекту (у кадрах уже є підскок) */
    const at = (fr: ArtSprite[] | null, fps: number) => (fr ? fr[this.reduced ? 0 : Math.floor(t * fps) % fr.length] : null);
    const jump = win >= 0 && !this.reduced ? eneiFrames('jump', false, this.cold) : null;
    const eneiArt = this.eneiPose ?? (jump ? jump[Math.min(jump.length - 1, Math.floor(win * jump.length))]
      : at(eneiFrames(moving(enei) ? 'walk' : 'idle', false, this.cold), moving(enei) ? 10 : 2.5));
    if (fail >= 0 || win >= 0) {
      enei = { ...enei };
      if (fail >= 0 && !this.reduced) enei.x += Math.round(Math.sin(fail * 40) * 5 * (1 - fail));
      if (win >= 0 && !this.reduced && !jump) enei.y -= Math.round(Math.abs(Math.sin(win * Math.PI * 2)) * 18);
    }
    if (fail >= 0 && !wolf) {
      const bx = Math.round(enei.x - 8), by = Math.round(enei.y - (eneiArt ?? ENEI).h * 2 - 34 - Math.sin(fail * Math.PI) * 6);
      c.fillStyle = '#1f1b16'; c.fillRect(bx - 2, by - 2, 24, 28);
      c.fillStyle = '#b3202a'; c.fillRect(bx, by, 20, 24);
      c.fillStyle = '#ffffff'; c.fillRect(bx + 8, by + 4, 4, 10); c.fillRect(bx + 8, by + 17, 4, 4);
    }
    const bob = (w: Walker) => (Math.abs(w.tx - w.x) > 1 ? (Math.floor(t * 4) % 2) * 2 : 0);
    /* хода: 4 кадри (≈8 за секунду), поки йде; у спокої — повільний вдих */
    const pose = (w: Walker, spr: Sprite, hip: number, mid: number): [Sprite, number] => {
      if (this.reduced) return [spr, 0];
      if (Math.abs(w.tx - w.x) > 1) { const [s, dy] = (walkCycle(spr, hip, mid) as [Sprite, number][])[Math.floor(t * 8) % 4]; return [s, dy * 2]; }
      return [(breathCycle(spr, hip) as Sprite[])[Math.floor(t / 1.1) % 2], 0];
    };
    if (wolf) { const wf = (still('cast/wolf-SE') ?? WOLF) as Sprite; drawFacing(c, wf, enei.x - wf.w, enei.y - wf.h * 2 - bob(enei), enei.face); return; }
    // ватага йде слідом за Енеєм
    for (let k = this.crew - 1; k >= 0; k--) {
      const art = at(crewFrames(CREW_ART[k], moving(enei)), 10 + k);
      const tj = (art ?? CREW[k]) as Sprite, x = Math.max(tj.w * 2 + 4 + (this.crew - 1 - k) * 34, enei.x - (eneiArt ?? ENEI).w - 28 - k * 40);
      // у спокої стоять статично
      tj.draw(c, Math.round(x - tj.w * 2), Math.round(enei.y - tj.h * 2), 2);
    }
    if (eneiArt) drawFacing(c, eneiArt as unknown as Sprite, enei.x - eneiArt.w, enei.y - eneiArt.h * 2, 1);
    else {
      const blink = Math.floor(t * 10) % 37 === 0;
      const [es, edy] = pose(enei, blink ? ENEI_BLINK : ENEI, 50, 23);
      drawFacing(c, es, enei.x - ENEI.w, enei.y - ENEI.h * 2 + edy, 1);
    }
    if (fox) {
      const fa = at(foxFrames(this.fox, moving(fox) ? 'walk' : 'idle'), moving(fox) ? 10 : 2.5);
      if (fa) drawFacing(c, fa as unknown as Sprite, fox.x - fa.w, fox.y - fa.h * 2, 1);
      else { const [a, b] = foxOf(this.fox); const [fs, fdy] = pose(fox, Math.floor(t) % 2 ? b : a, 44, 18); drawFacing(c, fs, fox.x - a.w, fox.y - a.h * 2 + fdy, 1); }
    }
  }

  protected crewLabel() {
    if (this.crew > 0) this.label(`${L('ватага', 'crew')} = ${this.crew} / 4`, 70, H - 26, true);
  }

  protected label(text: string, x: number, y: number, gold = false) {
    const c = this.ctx;
    c.font = '600 12px "Fira Code", monospace';
    const tw = c.measureText(text).width + 12;
    const lx = Math.round(Math.min(W - tw - 4, Math.max(4, x - tw / 2))), ly = Math.round(y);
    c.fillStyle = 'rgba(20,27,23,.86)'; c.fillRect(lx, ly, tw, 18);
    c.fillStyle = gold ? '#f2d27a' : '#e7e0cf';
    c.fillText(text, lx + 6, ly + 13);
  }
}

function drawFacing(c: CanvasRenderingContext2D, spr: Sprite, x: number, y: number, face: 1 | -1) {
  if (face === 1) { spr.draw(c, Math.round(x), Math.round(y), 2); return; }
  c.save(); c.translate(Math.round(x) + spr.w * 2, 0); c.scale(-1, 1); spr.draw(c, 0, Math.round(y), 2); c.restore();
}

/* ============================== масив ============================== */

type Skin = Extract<SceneSpec, { type: 'array' }>['skin'];
type Mode = Extract<SceneSpec, { type: 'array' }>['mode'];

export class ArrayScene extends SceneBase {
  private values: unknown[] = [];
  private initial: unknown[] = [];
  private arrName = '';
  private reads: number[] = [];
  private nReads = 0;
  private glow = new Map<number, { at: number; write: boolean }>();
  private best = 0;
  private bestPair: [number, number] | null = null;
  private actor: Actor = 'heroes';
  private result: string | null = null;
  private enei: Walker = { x: 0, tx: 0, y: 0, ty: 0, face: 1 };
  private foxW: Walker = { x: 0, tx: 0, y: 0, ty: 0, face: -1 };
  private x0 = 150; private x1 = W - 44;
  private base = 280; private path = 384;
  /** «Скриня» світу 3: що код гравця поклав у Map чи Set. */
  private mem = new Map<string, string>();
  /** Світ 7: зачіпки валки — для кожного воза номер наступного (-1 — кінець). null — звичайний масив. */
  private links0: number[] | null = null;
  private links: number[] | null = null;
  private memTouch: { k: string; at: number; ok: boolean } | null = null;

  constructor(canvas: HTMLCanvasElement, onState: (s: SceneState) => void, fox: string, private world: number, private skin: Skin, private mode: Mode) {
    super(canvas, onState, fox);
    paintBackground(this.bg.getContext('2d')!, world, skin);
    this.ambient = world;
    this.fxKey = skin === 'post' ? 'carthage' : `world-${String(world).padStart(2, '0')}`;
    this.cold = COLD_WORLDS.includes(world);
    // Микита стоїть праворуч від останнього предмета — лишаємо йому місце
    if (mode !== 'scan') this.x1 = W - 80;
    if (world === 1) { this.base = 300; this.path = 386; }
    // світ 0: ліворуч іде ватага, тож ряд починається правіше, а Микита чекає праворуч
    if (world === 0) { this.base = 330; this.x0 = 230; this.x1 = W - 90; }
    // світи 3+: ряд над головами героїв, щоб числа не ховались за Енеєм і Микитою
    if (world >= 3) { this.base = 226; this.x0 = 110; }
  }

  load(values: unknown[] | string, arrName: string, events: WorldEvent[], actor: Actor, result: string | null = null, links: number[] | null = null) {
    this.links0 = links;
    this.initial = typeof values === 'string' ? [...values] : values.slice();
    this.arrName = arrName;
    this.events = events.filter((e) => ((e.t === 'read' || e.t === 'write') && e.arr === arrName) || e.t === 'mem');
    this.actor = actor;
    this.result = result;
    this.reset();
  }

  reset() {
    this.values = this.initial.slice();
    this.k = 0; this.playing = false; this.reads = []; this.nReads = 0; this.glow.clear(); this.best = 0; this.bestPair = null; this.mem.clear(); this.memTouch = null; this.links = this.links0 ? this.links0.slice() : null;
    const n = this.values.length;
    this.enei = { x: this.ix(0) - 30, tx: this.ix(0) - 30, y: this.path, ty: this.path, face: 1 };
    const fx = this.mode === 'scan' ? W - 30 : this.ix(Math.max(0, n - 1)) + 28;
    this.foxW = { x: fx, tx: fx, y: this.path, ty: this.path, face: -1 };
    if (this.mode === 'scan') this.enei = { ...this.enei, x: this.ix(0), tx: this.ix(0) };
    this.emit();
  }

  private ix(i: number) {
    const n = Math.max(this.values.length, 2);
    return Math.round(this.x0 + (i * (this.x1 - this.x0)) / (n - 1));
  }
  private num(v: unknown) { return typeof v === 'number' ? v : Number(v) || 0; }
  private maxV() { return Math.max(1, ...this.values.map((v) => Math.abs(this.num(v)))); }

  private pair(): [number, number] | null {
    const r = this.reads;
    if (!r.length) return null;
    const a = r[r.length - 1];
    for (let j = r.length - 2; j >= 0; j--) if (r[j] !== a) return a < r[j] ? [a, r[j]] : [r[j], a];
    return null;
  }
  private shown() { return this.mode === 'area' && this.k >= this.events.length && this.events.length && this.bestPair ? this.bestPair : this.pair(); }
  private areaOf(p: [number, number] | null) { return p ? (p[1] - p[0]) * Math.min(this.num(this.values[p[0]]), this.num(this.values[p[1]])) : 0; }

  protected apply(e: WorldEvent, silent: boolean) {
    if (e.t === 'mem') {
      if (e.op === 'set' || e.op === 'add') this.mem.set(e.k, e.v ?? '');
      else if (e.op === 'delete') this.mem.delete(e.k);
      if (!silent) this.memTouch = { k: e.k, at: performance.now(), ok: e.op === 'set' || e.op === 'add' || !!e.hit };
      return;
    }
    if ((e.t !== 'read' && e.t !== 'write') || e.i < 0 || e.i >= this.values.length) return;
    const nextOf = e.t === 'write' && e.v && typeof e.v === 'object' && 'next' in (e.v as object) ? (e.v as { next: number }).next : null;
    if (nextOf !== null) { if (this.links) this.links[e.i] = nextOf; }
    else if (e.t === 'write') this.values[e.i] = e.v;
    else this.nReads++;
    this.reads.push(e.i);
    if (!silent) this.glow.set(e.i, { at: performance.now(), write: e.t === 'write' });
    const p = this.pair();
    if (this.mode === 'area' && p && this.areaOf(p) > this.best) { this.best = this.areaOf(p); this.bestPair = p; }
    this.aim(e.i, p);
  }
  protected ended() { if (this.mode === 'area' && this.bestPair && this.actor === 'heroes') this.aimPair(this.bestPair); }

  private aimPair(p: [number, number]) { this.enei.tx = this.ix(p[0]) - 30; this.foxW.tx = this.ix(p[1]) + 28; }
  private aim(i: number, p: [number, number] | null) {
    if (this.actor === 'wolf' || this.mode === 'scan') { this.enei.tx = this.ix(i) - (this.actor === 'wolf' ? 20 : 0); return; }
    if (p) this.aimPair(p);
    else if (i <= (this.values.length - 1) / 2) this.enei.tx = this.ix(i) - 30;
    else this.foxW.tx = this.ix(i) + 28;
  }

  protected walkers() { return [this.enei, this.foxW]; }
  protected badge() {
    if (this.mode === 'area') return { label: L('найкраще', 'best'), value: String(this.best) };
    return { label: L('поглядів', 'looks'), value: String(this.nReads) };
  }

  protected draw(now: number) {
    const c = this.ctx, t = this.reduced ? 0 : now / 1000, n = this.values.length;
    const p = this.shown();
    let overlay: (() => void) | null = null;

    if (this.mode === 'area' && p) {
      const xl = this.ix(p[0]) + 4, xr = this.ix(p[1]);
      const lvl = this.postH(Math.min(this.num(this.values[p[0]]), this.num(this.values[p[1]])));
      const top = this.base - lvl, wolf = this.actor === 'wolf';
      c.fillStyle = wolf ? 'rgba(138,143,150,.55)' : 'rgba(63,127,208,.55)';
      c.fillRect(xl, top, xr - xl, lvl);
      c.fillStyle = wolf ? 'rgba(200,204,210,.7)' : 'rgba(170,215,245,.85)';
      for (let x = xl; x < xr; x += 2) if (((x >> 1) + Math.floor(t * 6)) % 8 < 3) c.fillRect(x, top, 2, 2);
      const a = this.areaOf(p);
      const text = `${p[1] - p[0]} × ${Math.min(this.num(this.values[p[0]]), this.num(this.values[p[1]]))} = ${a}`;
      overlay = () => this.label(text, (xl + xr) / 2, Math.max(8, top - 26), a === this.best && a > 0);
    } else if (this.mode === 'pointers' && p && this.actor === 'heroes') {
      // дуга між кінцями — пара, яку зараз порівнює код
      const xl = this.ix(p[0]), xr = this.ix(p[1]), y = this.itemTop() - 14;
      c.fillStyle = 'rgba(242,210,122,.85)';
      for (let x = xl; x <= xr; x += 6) { const k = (x - xl) / Math.max(1, xr - xl); c.fillRect(x, Math.round(y - Math.sin(k * Math.PI) * 12), 3, 2); }
    }

    if (this.links) this.drawLinks();
    for (let i = 0; i < n; i++) {
      const f = this.glow.get(i);
      const glow = f ? Math.max(0, 1 - (now - f.at) / 520) : 0;
      this.drawItem(i, this.values[i], glow, f?.write ?? false, t);
    }
    overlay?.();

    if (this.world === 2) { const d = (still('cast/dido') ?? makeDidoOnce()) as Sprite; d.draw(c, 4, this.path - d.h * 2, 2); }
    if (this.world >= 3) {
      // мешканець світу: новий арт ×2 (стоїть ліворуч, тож дивиться праворуч — на сцену), інакше старий спрайт
      const art = still(`npc/w${this.world}`);
      if (art) mirror(art).draw(c, 6, this.path - art.h * 2, 2);
      else { const a = artOf(this.world); if (a.npc) { const k = a.npc.w > 60 ? 1 : 2; a.npc.draw(c, 6, this.path - a.npc.h * k, k); } }
    }
    if (this.mem.size || this.memTouch) this.drawChest(now);
    // Еол сидить на хмарі ліворуч і дивиться на море
    if (this.world === 1) { const art = still('cast/eol'); const e = (art ? mirror(art) : makeEolOnce()) as Sprite; e.draw(c, 18, 26, 2); }
    this.drawHeroes(now, this.enei, this.actor === 'wolf' ? null : this.foxW, this.actor === 'wolf');

    if (this.result && this.k >= this.events.length) {
      // довга відповідь не має налазити на кнопки швидкості й лічильник
      const r = this.result.length > 34 ? this.result.slice(0, 33) + '…' : this.result;
      this.label(`${L('повернуто', 'returned')}: ${r}`, W / 2 + 20, 10, true);
    }
    this.crewLabel();
    if (this.world === 2 && !this.reduced) {
      c.fillStyle = 'rgba(246,228,184,.7)';
      for (let i = 0; i < 14; i++) {
        const x = (hash(i, 1) * W + t * (8 + i)) % W, y = 120 + ((hash(i, 2) * 250 + Math.sin(t + i) * 10) % 250);
        c.fillRect(Math.round(x / 2) * 2, Math.round(y / 2) * 2, 2, 2);
      }
    }
  }

  /** Зачіпки валки: стрілка від воза до наступного; назад або через кілька — дугою над валкою. */
  private drawLinks() {
    const c = this.ctx, y = this.base - 13;
    this.links!.forEach((j, i) => {
      if (j < 0) return;
      const x1 = this.ix(i) + 3, x2 = this.ix(j) + 3;
      c.fillStyle = '#e9e1cc';
      if (j === i + 1) {
        for (let x = x1 + 20; x < x2 - 22; x += 2) c.fillRect(x, y, 2, 2);
        c.fillRect(x2 - 26, y - 2, 2, 6); c.fillRect(x2 - 24, y - 1, 2, 4);
        return;
      }
      // дуга: над валкою, вища для дальших зачіпок; назад — жовта, бо це підозра на коло
      const h = 24 + Math.min(70, Math.abs(j - i) * 10);
      c.fillStyle = j <= i ? '#f2d27a' : '#e9e1cc';
      for (let k = 0; k <= 40; k++) {
        const t = k / 40, x = x1 + (x2 - x1) * t, yy = y - 30 - Math.sin(t * Math.PI) * h;
        c.fillRect(Math.round(x), Math.round(yy), 2, 2);
      }
      c.fillRect(x2 - 1, y - 32, 4, 4);
    });
  }

  /** Скриня з комірками: кожна комірка — ключ і значення з пам'яті гравця. */
  private drawChest(now: number) {
    const c = this.ctx, cols = 6, cw = 92, ch = 30, x0 = 24, y0 = 92;
    const keys = [...this.mem.keys()];
    const shown = keys.length > cols * 2 ? keys.slice(keys.length - cols * 2 + 1) : keys;
    const rows = Math.max(1, Math.ceil((shown.length + (keys.length > shown.length ? 1 : 0)) / cols));
    c.fillStyle = 'rgba(58,36,20,.92)'; c.fillRect(x0 - 8, y0 - 22, cols * cw + 10, rows * ch + 30);
    c.fillStyle = '#c8962e'; c.fillRect(x0 - 8, y0 - 22, cols * cw + 10, 3);
    c.font = '600 11px "Fira Code", monospace'; c.fillStyle = '#f2d27a';
    c.fillText(`${L('скриня', 'chest')}: ${this.mem.size}`, x0, y0 - 8);
    const cells = keys.length > shown.length ? ['…', ...shown] : shown;
    const glow = this.memTouch ? Math.max(0, 1 - (now - this.memTouch.at) / 700) : 0;
    cells.forEach((k, i) => {
      const x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * ch;
      const hit = this.memTouch && this.memTouch.k === k && glow > 0;
      c.fillStyle = hit ? (this.memTouch!.ok ? `rgba(120,200,110,${0.5 + glow / 2})` : `rgba(220,90,80,${0.5 + glow / 2})`) : '#6b4420';
      c.fillRect(x, y, cw - 6, ch - 6);
      c.fillStyle = '#efe2c0';
      const v = this.mem.get(k);
      const text = k === '…' ? '…' : v ? `${k}: ${v}` : k;
      c.fillText(text.length > 12 ? text.slice(0, 11) + '…' : text, x + 5, y + 16);
    });
    // промах: ключа немає у скрині — коротко показуємо його червоним під скринею
    if (this.memTouch && !this.memTouch.ok && glow > 0 && !this.mem.has(this.memTouch.k)) this.label(`${L('немає', 'missing')}: ${this.memTouch.k}`, x0 + 60, y0 + rows * ch + 6);
  }

  private postH(v: number) { return Math.max(4, Math.round((Math.max(0, v) / this.maxV()) * 180)); }
  private itemTop() {
    if (this.skin === 'post') return this.base - 190;
    if (this.skin === 'ship' || this.skin === 'sail') return this.base - 90;
    return this.base - 70;
  }

  private drawItem(i: number, v: unknown, glow: number, write: boolean, t: number) {
    const c = this.ctx, x = this.ix(i), base = this.base;
    const hl = glow > 0 ? (write ? `rgba(255,139,126,${glow * 0.45})` : `rgba(255,236,150,${glow * 0.4})`) : null;
    // числа на темній підкладці: фони світів різнобарвні, без неї напис губиться
    const plated = (s: string, y: number, font: string, fg: string) => {
      c.font = font;
      const tw = Math.ceil(c.measureText(s).width), px = Math.round(x + 3 - tw / 2);
      c.fillStyle = 'rgba(20,27,23,.78)'; c.fillRect(px - 3, Math.round(y) - 11, tw + 6, 15);
      c.fillStyle = fg; c.fillText(s, px, y);
    };
    const caption = (s: string, y: number) => plated(s, y, '600 12px "Fira Code", monospace', '#efe6cf');
    const index = (y: number) => plated(String(i), y, '11px "Fira Code", monospace', '#c9b48a');
    switch (this.skin) {
      case 'post': {
        const h = this.postH(this.num(v));
        c.fillStyle = '#5e3a1c'; c.fillRect(x, base - h, 6, h);
        c.fillStyle = '#7a4a24'; c.fillRect(x, base - h, 4, h);
        c.fillStyle = '#9a6434'; c.fillRect(x, base - h, 2, h);
        c.fillStyle = glow > 0 ? `rgba(255,236,150,${0.4 + glow * 0.6})` : '#d9a521';
        c.fillRect(x - 2, base - h - 4, 10, 4);
        if (hl) { c.fillStyle = hl; c.fillRect(x - 6, base - h - 10, 18, h + 10); }
        caption(String(v), base + 14); index(base + 28);
        return;
      }
      case 'sack': {
        const s = 1 + Math.min(1, Math.abs(this.num(v)) / this.maxV()) * 0.6;
        c.save(); c.translate(x + 3, base); c.scale(s, s); drawSack(c, 0, 0); c.restore();
        if (hl) { c.fillStyle = hl; c.fillRect(x - 18, base - 40, 42, 46); }
        caption(String(v), base + 18); index(base + 32);
        return;
      }
      case 'ship': case 'sail': {
        const bobY = Math.round(Math.sin(t * 2 + i) * 2);
        const y = base + bobY;
        const size = this.skin === 'sail' ? 0.75 : 0.45 + 0.55 * Math.min(1, Math.abs(this.num(v)) / this.maxV());
        const w = Math.round(30 * size + 10), mast = Math.round(56 * size + 12);
        const sailC = this.skin === 'sail' ? (['#b3202a', '#efe7d4', '#2f55a0'][this.num(v)] ?? '#888') : '#efe7d4';
        const broken = this.skin === 'ship' && this.num(v) === 0;
        if (hl) { c.fillStyle = hl; c.fillRect(x - w / 2 - 6, y - mast - 8, w + 18, mast + 22); }
        c.fillStyle = '#3a2414'; c.fillRect(x + 2, y - mast, 2, mast);
        if (!broken) {
          c.fillStyle = sailC;
          for (let k = 0; k < mast - 8; k += 2) { const ww = Math.round((k / (mast - 8)) * (w / 2)); c.fillRect(x + 4, y - mast + 2 + k, ww, 2); }
          if (this.skin === 'ship') { c.fillStyle = '#b3202a'; c.fillRect(x + 4, y - Math.round(mast * 0.45), Math.round(w * 0.3), 2); }
        } else { c.fillStyle = '#6b6258'; c.fillRect(x + 4, y - 18, 8, 6); }
        c.fillStyle = broken ? '#4a3a2c' : '#5b3a20';
        c.fillRect(x - w / 2 + 3, y, w, 6);
        c.fillStyle = broken ? '#33281e' : '#3a2414';
        c.fillRect(x - w / 2 + 6, y + 6, w - 6, 4);
        if (this.skin === 'ship') caption(String(v), y + 26);
        index(y + (this.skin === 'ship' ? 40 : 26));
        return;
      }
      case 'letter': {
        const ch = String(v);
        const ok = /[a-z0-9]/i.test(ch);
        c.fillStyle = '#2a1e10'; c.fillRect(x - 11, base - 36, 28, 34);
        c.fillStyle = ok ? '#e9d9a6' : '#c9b88a'; c.fillRect(x - 9, base - 34, 24, 30);
        c.fillStyle = '#7a5a32'; c.fillRect(x - 9, base - 6, 24, 2);
        if (hl) { c.fillStyle = hl; c.fillRect(x - 13, base - 38, 32, 38); }
        c.font = '700 16px "Fira Code", monospace';
        c.fillStyle = ok ? '#3e2c16' : '#9a8a66';
        const s = ch === ' ' ? '·' : ch;
        c.fillText(s, x + 3 - c.measureText(s).width / 2, base - 13);
        index(base + 14);
        return;
      }
      case 'stone': default: {
        const word = typeof v === 'string';
        if (word && (v === 'троянець' || v === 'trojan')) { const tj = (crewFrames(CREW_ART[i % 4], false)?.[0] ?? TROJANS[i % TROJANS.length]) as Sprite; tj.draw(c, x + 3 - tj.w / 2, base - tj.h, 1); }
        else if (word && (v === 'мішок' || v === 'sack')) { drawSack(c, x + 3, base); }
        else if (word && (v === 'попіл' || v === 'ash')) { c.fillStyle = '#4a4440'; c.fillRect(x - 9, base - 8, 24, 8); c.fillStyle = '#6a625c'; c.fillRect(x - 5, base - 13, 16, 5); c.fillStyle = '#f08a2a'; if (Math.floor(t * 3 + i) % 2) c.fillRect(x + 1, base - 15, 2, 2); }
        else {
          // камінець завширшки як напис: назви кіл чи товарів не обрізаються
          c.font = '700 13px "Fira Code", monospace';
          const s = String(v), bw = Math.max(32, Math.ceil(c.measureText(s).width) + 10), bx = x + 3 - bw / 2;
          // темний контур відділяє камінець від пісочного тла
          c.fillStyle = '#2a1e10'; c.fillRect(bx - 2, base - 28, bw + 4, 30);
          c.fillStyle = '#b8a07a'; c.fillRect(bx, base - 26, bw, 26);
          c.fillStyle = '#d4bf96'; c.fillRect(bx, base - 26, bw, 4);
          c.fillStyle = '#8a7656'; c.fillRect(bx, base - 3, bw, 3);
          c.fillStyle = '#3e2c16';
          c.fillText(s, x + 3 - c.measureText(s).width / 2, base - 8);
        }
        if (hl) { c.fillStyle = hl; c.fillRect(x - 17, base - (word ? 70 : 30), 40, word ? 72 : 32); }
        index(base + 16);
      }
    }
  }
}

let didoS: Sprite | null = null, eolS: Sprite | null = null;
const makeDidoOnce = () => (didoS ??= makeDido());
const makeEolOnce = () => (eolS ??= makeEol());

/* ============================== вулиця ============================== */

export class StreetScene extends SceneBase {
  private cells0: StreetCell[] = [];
  private cells: StreetCell[] = [];
  private pos = 0;
  private bag = 0;
  private met = 0;
  private fail: { at: number; note: string } | null = null;
  private enei: Walker = { x: 0, tx: 0, y: 0, ty: 0, face: 1 };
  private foxW: Walker = { x: 0, tx: 0, y: 0, ty: 0, face: -1 };
  private jumpAt = 0;
  /** Коли Еней підняв мішок: грає анімація підбору. */
  private takeAt = 0;
  private x0 = 70; private x1 = W - 170;
  private ground = 360;

  constructor(canvas: HTMLCanvasElement, onState: (s: SceneState) => void, fox: string) {
    super(canvas, onState, fox);
    paintBackground(this.bg.getContext('2d')!, 0, 'street');
    this.ambient = 0;
    this.fxKey = 'world-00';
  }

  load(cells: StreetCell[], events: WorldEvent[]) {
    this.cells0 = cells.slice();
    this.events = events.filter((e) => e.t === 'act');
    this.reset();
  }

  reset() {
    this.cells = this.cells0.slice(); this.pos = 0; this.bag = 0; this.met = 0; this.fail = null;
    this.k = 0; this.playing = false;
    this.enei = { x: this.cx(0), tx: this.cx(0), y: this.ground, ty: this.ground, face: 1 };
    const fx = this.cx(this.cells.length - 1) + 110;
    this.foxW = { x: fx, tx: fx, y: this.ground, ty: this.ground, face: -1 };
    this.emit();
  }

  private cx(i: number) {
    const n = Math.max(this.cells.length, 2);
    return Math.round(this.x0 + (i * (this.x1 - this.x0)) / (n - 1));
  }

  protected stepMs() { return 520 / this.speed; }

  protected apply(e: WorldEvent, silent: boolean) {
    if (e.t !== 'act') return;
    if (!e.ok) { this.fail = { at: performance.now(), note: e.note ?? '' }; if (e.name === 'move' || e.name === 'jump') this.enei.tx = this.cx(this.pos) + 18; return; }
    if (e.name === 'move') this.pos++;
    if (e.name === 'jump') { this.pos += 2; if (!silent) this.jumpAt = performance.now(); }
    if (e.name === 'take' && this.cells[this.pos] === 'sack') { this.cells[this.pos] = 'empty'; this.bag++; if (!silent) this.takeAt = performance.now(); }
    if (this.cells[this.pos] === 'trojan') { this.cells[this.pos] = 'empty'; this.met++; }
    this.enei.tx = this.cx(this.pos);
  }
  protected ended() { if (!this.fail && this.pos >= this.cells.length - 2) this.foxW.tx = this.cx(this.cells.length - 1) + 96; }

  protected walkers() { return [this.enei, this.foxW]; }
  protected badge() {
    if (this.cells0.includes('sack')) return { label: L('мішків', 'sacks'), value: `${this.bag} / ${this.cells0.filter((c) => c === 'sack').length}` };
    return { label: L('кроків', 'moves'), value: String(this.k) };
  }

  protected draw(now: number) {
    const c = this.ctx, t = this.reduced ? 0 : now / 1000;
    for (let i = 0; i < this.cells.length; i++) {
      const x = this.cx(i), g = this.ground;
      c.fillStyle = i % 2 ? '#625a54' : '#5a524c'; c.fillRect(x - 22, g - 4, 44, 8);
      c.fillStyle = '#3e3834'; c.fillRect(x - 22, g + 4, 44, 2);
      c.font = '11px "Fira Code", monospace';
      const iw = Math.ceil(c.measureText(String(i)).width), ix = Math.round(x - iw / 2);
      c.fillStyle = 'rgba(20,27,23,.78)'; c.fillRect(ix - 3, g + 9, iw + 6, 15);
      c.fillStyle = '#cfc4b8'; c.fillText(String(i), ix, g + 20);
      const cell = this.cells[i];
      if (cell === 'sack') { const sk = still('obj/sack'); if (sk) sk.draw(c, x - sk.w, g - 4 - sk.h * 2, 2); else drawSack(c, x, g - 4); }
      if (cell === 'trojan') { const tj = (crewFrames(CREW_ART[i % 4], false)?.[0] ?? TROJANS[i % TROJANS.length]) as Sprite; tj.draw(c, x - tj.w / 2, g - 4 - tj.h, 1); }
      if (cell === 'well') {
        c.fillStyle = '#7d7670'; c.fillRect(x - 16, g - 26, 32, 22);
        c.fillStyle = '#9a928a'; c.fillRect(x - 16, g - 26, 32, 4);
        c.fillStyle = '#2a4a6a'; c.fillRect(x - 12, g - 22, 24, 4);
        c.fillStyle = '#5b3a20'; c.fillRect(x - 15, g - 50, 3, 26); c.fillRect(x + 12, g - 50, 3, 26); c.fillRect(x - 15, g - 52, 30, 3);
      }
      if (cell === 'fire') {
        for (let k = 0; k < 9; k++) {
          const fx = x - 14 + k * 3.5, h = 10 + Math.round((Math.sin(t * 9 + k * 1.7) * 0.5 + 0.5) * 18) + (k % 3) * 3;
          c.fillStyle = '#b3202a'; c.fillRect(Math.round(fx), g - 4 - h, 3, h);
          c.fillStyle = '#f08a2a'; c.fillRect(Math.round(fx), g - 4 - Math.round(h * 0.65), 3, Math.round(h * 0.65));
          c.fillStyle = '#f7d26a'; c.fillRect(Math.round(fx), g - 4 - Math.round(h * 0.3), 3, Math.round(h * 0.3));
        }
      }
    }
    // стрибок: дуга над вогнем
    const jp = this.jumpAt ? (now - this.jumpAt) / Math.min(500, this.stepMs()) : 1;
    this.enei.y = this.ground - 4 - (jp < 1 ? Math.round(Math.sin(jp * Math.PI) * 46) : 0);
    this.enei.ty = this.enei.y;
    this.foxW.y = this.foxW.ty = this.ground - 4;
    // зсув на 26 px — і для цілі теж, інакше moving() бачить різницю і Еней «іде» на місці
    // підбір мішка: кадри нахилу за час кроку
    const pick = eneiFrames('pickup'), since = now - this.takeAt, dur = Math.min(700, this.stepMs());
    this.eneiPose = pick && this.takeAt && since < dur && !this.reduced ? pick[Math.min(pick.length - 1, Math.floor((since / dur) * pick.length))] : null;
    this.drawHeroes(now, { ...this.enei, x: this.enei.x + 26, tx: this.enei.tx + 26 }, this.foxW);

    this.crewLabel();
    if (this.fail) {
      const a = Math.max(0, 1 - (now - this.fail.at) / 900);
      if (a > 0) { c.fillStyle = `rgba(179,32,42,${a * 0.35})`; c.fillRect(0, 0, W, H); }
      this.label(this.fail.note.length > 70 ? this.fail.note.slice(0, 69) + '…' : this.fail.note, W / 2, 12);
    } else if (this.events.length && this.k >= this.events.length) {
      const atWell = this.cells0[this.pos] === 'well' || this.pos === this.cells.length - 1;
      if (atWell) this.label(L('Еней на місці!', 'Aeneas made it!'), W / 2, 12, true);
    }
  }
}

/* ============================== фони ============================== */


function paintBackground(c: CanvasRenderingContext2D, world: number, skin: Skin | 'street') {
  // новий фон світу (200×136): верхні 6 рядків неба зайві, земля для героїв лишається внизу; Карфаген зі стовпами — свій
  const art = skin === 'post' ? artImage('bg/carthage') : worldBg(world);
  if (art) { c.imageSmoothingEnabled = false; c.drawImage(art, 0, art.height - 130, 200, 130, 0, 0, W, H); return; }
  if (world === 2) return paintCarthage(c, skin === 'post');
  // світи 3+: фон тієї ж сцени, що на мапі й сайті (200×130), збільшений утричі
  if (world >= 3) { const sp = new Spr(200, 130); artOf(world).bg(sp, 0); sp.draw(c, 0, 0, 3); return; }
  // Фони світів 0 і 1 — із сайту (сітка 200×130), збільшені втричі.
  const sp = new Spr(200, 130);
  if (world === 0) ruins(sp, 0);
  else { sky(sp, ['#0b1626', '#152a45', '#22405f', '#2c4a6e'], 0, 74); sea(sp, 0, 72, '#1a446b', '#123251', '#7fb6d9'); }
  sp.draw(c, 0, 0, 3);
  if (world === 1) {
    // причал, на якому стоять герої
    for (let x = 0; x < W; x += 4) { c.fillStyle = (x >> 2) % 6 === 0 ? '#3a2414' : '#6b4a2a'; c.fillRect(x, 352, 4, 38); }
    c.fillStyle = '#8a6438'; c.fillRect(0, 352, W, 4);
    for (let x = 20; x < W; x += 90) { c.fillStyle = '#3a2414'; c.fillRect(x, 340, 8, 50); }
  }
}

/** Небо, море, мури Карфагена, пісок. Палітра як на сайті. */
function paintCarthage(c: CanvasRenderingContext2D, posts: boolean) {
  const U = 2;
  const put = (x: number, y: number, col: string) => { c.fillStyle = col; c.fillRect(x * U, y * U, U, U); };
  const GW = W / U, GH = H / U;
  const skyC = ['#6fb6e3', '#9fd0ee', '#d4eaf5'];
  for (let y = 0; y < 110; y++) for (let x = 0; x < GW; x++) {
    const tt = (y / 110) * (skyC.length - 1), i = Math.floor(tt), f = tt - i;
    put(x, y, f > 0.66 || (f > 0.33 && (x + y) % 2 === 0) ? skyC[Math.min(i + 1, 2)] : skyC[i]);
  }
  for (let y = -10; y <= 10; y++) for (let x = -10; x <= 10; x++) if (x * x + y * y <= 100) put(128 + x, 22 + y, '#fff1b8');
  const cloud = (cx: number, cy: number, w: number) => {
    for (let y = -6; y <= 6; y++) for (let x = -w; x <= w; x++) {
      const d = (x / w) ** 2 + (y / 6) ** 2 + Math.sin(x * 0.7) * 0.08;
      if (d <= 1 && y <= 3) put(cx + x, cy + y, y > 1 ? '#c9e2f1' : d > 0.7 ? '#e9f4fb' : '#ffffff');
    }
  };
  cloud(40, 24, 22); cloud(240, 30, 16);
  for (let y = 96; y < 112; y++) for (let x = 0; x < GW; x++) put(x, y, x % 12 === 0 && y === 100 ? '#9fd0ee' : '#2f7fb8');
  for (let x = 100; x < GW; x++) for (let y = 64; y < 118; y++) {
    const top = x % 10 < 6 ? 64 : 68;
    if (y >= top) put(x, y, x % 22 === 3 && y > 80 && y < 88 ? '#7a5a32' : x > 250 ? '#c9a466' : '#d9b77a');
  }
  for (let x = 196; x < 216; x++) for (let y = 48; y < 118; y++) put(x, y, '#c9a466');
  for (let x = 196; x < 216; x += 5) for (let y = 43; y < 48; y++) { put(x, y, '#c9a466'); put(x + 1, y, '#c9a466'); }
  for (let x = 203; x < 209; x++) for (let y = 60; y < 70; y++) put(x, y, '#7a5a32');
  for (let y = 118; y < GH; y++) for (let x = 0; x < GW; x++) put(x, y, (x * 7 + y * 3) % 11 === 0 ? '#d4b073' : '#e3c58e');
  for (let x = 0; x < GW; x++) put(x, Math.round(143 + Math.sin(x * 0.06) * 1.5), '#d4b073');
  for (let y = 182; y < GH; y++) for (let x = 0; x < GW; x++) put(x, y, (x + y * 3) % 9 === 0 ? '#c9a466' : '#d9b77a');
  if (!posts) return;
  for (let i = 0; i < 40; i++) { const y = 142 - i, x = Math.round(48 + Math.sin(i * 0.08) * 3); put(x, y, '#7a5a32'); put(x + 1, y, '#5e4424'); }
  [[-16, -4], [16, -5], [-12, 6], [13, 7], [0, -9]].forEach(([dx, dy]) => {
    for (let s = 0; s <= 16; s++) { const x = Math.round(49 + (dx * s) / 16), y = Math.round(102 + (dy * s) / 16 + (s * s) / 60); put(x, y, '#3f7a3a'); put(x, y + 1, '#2f5f2c'); }
  });
}

/* ============================== сувій «Абетки» ============================== */

/** «Абетка»: ніч у ще цілій Трої, Сивілла й сувій із казкою. Кожен рядок, який виводить програма, дописується на сувій. */
export class ScrollScene extends SceneBase {
  private lines: string[] = [];
  private shownAt: number[] = [];
  private foxW: Walker = { x: W - 52, tx: W - 52, y: H - 8, ty: H - 8, face: -1 };
  private dummy: Walker = { x: 0, tx: 0, y: 0, ty: 0, face: 1 };
  /** Колобок котиться низом сцени (розділ 1). */
  private bun: boolean;
  /** Герой казки інших розділів: стоїть унизу ліворуч і підстрибує на кожен новий рядок. */
  private hero: Sprite | null;
  private chapter: number;

  /** Номер вправи в розділі: у «Ріпці» за дідом шикується щоразу більше помічників. */
  private lesson: number;

  constructor(canvas: HTMLCanvasElement, onState: (s: SceneState) => void, fox: string, chapter: number, lesson = 0) {
    super(canvas, onState, fox);
    this.bun = chapter === 0;
    this.chapter = chapter;
    this.lesson = lesson;
    this.fxKey = `abc-${TALE_BG[chapter]}`;
    this.fxOnTop = false;
    this.hero = chapter > 0 && TALE_HEROES[chapter - 1] ? TALE_HEROES[chapter - 1]() : null;
    const c = this.bg.getContext('2d')!;
    // фон казки розділу (новий арт), інакше нічна Троя; трохи притемнений, щоб сувій читався
    const art = artImage(`bg/abc-${TALE_BG[chapter]}`) ?? artImage('bg/troy-night');
    if (art) { c.imageSmoothingEnabled = false; c.drawImage(art, 0, art.height - 130, 200, 130, 0, 0, W, H); }
    else { const sp = new Spr(200, 130); paintTroyNight(sp, 0); sp.draw(c, 0, 0, 3); }
    c.fillStyle = 'rgba(8,10,20,.25)'; c.fillRect(0, 0, W, H);
  }

  load(events: WorldEvent[]) {
    this.events = events.filter((e) => e.t === 'log');
    this.reset();
  }

  reset() { this.lines = []; this.shownAt = []; this.k = 0; this.playing = false; this.emit(); }

  protected stepMs() { return 650 / this.speed; }
  protected apply(e: WorldEvent, silent: boolean) {
    if (e.t !== 'log') return;
    this.lines.push(e.text);
    this.shownAt.push(silent ? 0 : performance.now());
  }
  protected walkers() { return [this.foxW, this.dummy]; }
  protected badge() { return { label: L('рядків', 'lines'), value: String(this.lines.length) }; }

  protected draw(now: number) {
    const c = this.ctx, t = this.reduced ? 0 : now / 1000;
    // сувій: пергамент між двома валиками
    // сувій на 6 рядків: під ним стоять герої казки ×2
    const x0 = 36, x1 = W - 118, y0 = 44, rows = 6, lh = 25, y1 = y0 + 30 + rows * lh;
    c.fillStyle = '#1f1b16'; c.fillRect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4);
    c.fillStyle = '#efe2c0'; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.fillStyle = '#e2d1a6'; for (let y = y0 + 6; y < y1; y += 8) c.fillRect(x0 + ((y * 7) % 23), y, 3, 2);
    for (const y of [y0 - 8, y1 - 2]) {
      c.fillStyle = '#5b3a20'; c.fillRect(x0 - 14, y, x1 - x0 + 28, 10);
      c.fillStyle = '#8a5a30'; c.fillRect(x0 - 14, y, x1 - x0 + 28, 3);
      c.fillStyle = '#b3202a'; c.fillRect(x0 - 20, y - 1, 8, 12); c.fillRect(x1 + 12, y - 1, 8, 12);
    }
    c.font = '15px "Fira Code", monospace';
    const first = Math.max(0, this.lines.length - rows);
    if (!this.lines.length) {
      c.fillStyle = '#9c8a64';
      c.fillText(L('Сувій чекає: тут з\'явиться', 'The scroll waits: what the program'), x0 + 16, y0 + 34);
      c.fillText(L('те, що виведе програма.', 'prints appears here.'), x0 + 16, y0 + 34 + lh);
    }
    for (let i = first; i < this.lines.length; i++) {
      const y = y0 + 34 + (i - first) * lh, at = this.shownAt[i];
      const p = at ? Math.min(1, (now - at) / 300) : 1;
      let text = this.lines[i];
      const max = 38;
      if (text.length > max) text = text.slice(0, max - 1) + '…';
      // рядок «пишеться» зліва направо
      const shown = this.reduced ? text : text.slice(0, Math.ceil(text.length * p));
      c.fillStyle = '#8a6438'; c.fillText(`${i + 1}`.padStart(2, ' '), x0 + 10, y);
      c.fillStyle = i === this.lines.length - 1 && this.playing ? '#7a1f1f' : '#2b2118';
      c.fillText(shown, x0 + 44, y);
    }
    const last = this.shownAt[this.shownAt.length - 1] ?? 0, since = now - last;
    const hop = last && since < 360 && !this.reduced ? Math.sin((since / 360) * Math.PI) * 10 : 0;
    const tale = TALE_BG[this.chapter];
    // Івасик-Телесик пливе човником по воді фону (лівий нижній кут)
    const river = tale === 'telesyk' && !!still('tales/ivasyk');
    // герой казки стоїть, а коли з'являється рядок — підстрибує
    let x = 100;
    if (this.hero) {
      // новий арт резолвимо під час малювання: кеш у art.ts, а старий спрайт — запасний
      const hr = (still(`tales/${TALE_ART[this.chapter - 1]}`) ?? this.hero) as Sprite, k = hr === this.hero ? 1 : 2;
      // човен (з бризками) має лягти на найширшу смугу води фону: ліворуч, нижній край ~342 px
      const hx = river ? 10 : 40, bottom = river ? H - 48 : H - 8;
      hr.draw(c, hx, Math.round(bottom - hr.h * k - hop), k);
      x = hx + hr.w * k - 18;
    }
    // на березі, а не на воді
    if (river) x = Math.max(x, 200);
    // хто ще є в задачах розділу: спершу нікого, кожен новий рядок на сувої приводить ще одного
    // (у «Ріпці» за дідом шикується ланцюжок); новенький з'являється стрибком
    const cast = castFor(TALE_CAST[tale]?.[this.lesson] ?? [], (TALE_CAST[tale] ?? []).flat(), this.lines);
    for (const [k, who] of cast.entries()) {
      const s = castSprite(who);
      if (!s) continue;
      const at = this.shownAt[k] ?? 0, age = now - at;
      if (at && age < 360 && !this.reduced) { c.globalAlpha = Math.min(1, age / 200); }
      // гуси-лебеді летять над землею
      const lift = who === 'gusy' ? 34 + Math.round(Math.sin(t * 3) * 3) : 0;
      const pop = at && age < 360 && !this.reduced ? Math.sin((age / 360) * Math.PI) * 14 : 0;
      s.draw(c, Math.round(x), Math.round(H - 8 - s.h * 2 - pop - lift), 2);
      c.globalAlpha = 1;
      x += s.w * 2 - 10;
    }
    // Колобок котиться туди й назад — перед усіма
    if (this.bun) {
      const span = W - 300, ph = (t * 40) % (span * 2), bx = 70 + (ph < span ? ph : span * 2 - ph), by = H - 24;
      this.drawBun(bx, by, ph < span ? 1 : -1, t);
    }
    // місяць над Троєю світиться і повільно «дихає»
    pixelGlow(c, 547, 121, 66, '230,232,205', 0.2 * (0.88 + 0.12 * Math.sin(t * 0.7)));
    // Сивілла біля сувою
    const sy = (still('cast/sibyl') ?? SIBYL) as Sprite;
    sy.draw(c, Math.round(this.foxW.x - sy.w), Math.round(this.foxW.y - sy.h * 2), 2);
    if (this.events.length && this.k >= this.events.length && !this.playing) this.label(L('Вивід на сувої', 'Output on the scroll'), (x0 + x1) / 2, y1 + 16, true);
  }

  private drawBun(x: number, y: number, dir: number, t: number) {
    const c = this.ctx, r = 16;
    const kb = still('tales/kolobok');
    if (kb) {
      // новий Колобок (~45 px) — ×2, як і решта героїв казок; дивиться туди, куди котиться
      const s = 2, w = kb.w * s, h = kb.h * s, top = Math.round(y + r - h);
      if (dir === 1) kb.draw(c, Math.round(x - w / 2), top, s);
      else { c.save(); c.translate(Math.round(x + w / 2), 0); c.scale(-1, 1); kb.draw(c, 0, top, s); c.restore(); }
      c.fillStyle = 'rgba(255,250,230,.85)';
      const ny = Math.round(top - 10 - ((t * 16) % 14));
      c.fillRect(x + dir * 30, ny, 2, 8); c.fillRect(x + dir * 30 - 3, ny + 7, 4, 3);
      return;
    }
    for (let dy = -r; dy <= r; dy += 2) for (let dx = -r; dx <= r; dx += 2) {
      const d = dx * dx + dy * dy;
      if (d > r * r) continue;
      c.fillStyle = d > (r - 3) * (r - 3) ? '#a8641f' : dy < -4 && dx < 0 ? '#f6c25a' : '#e8a23a';
      c.fillRect(Math.round(x + dx), Math.round(y + dy), 2, 2);
    }
    // обличчя дивиться туди, куди котиться
    const fx = Math.round(x + dir * 5), blink = Math.floor(t * 3) % 9 === 0;
    c.fillStyle = '#2b1a0e';
    if (!blink) { c.fillRect(fx - 5, y - 5, 3, 3); c.fillRect(fx + 3, y - 5, 3, 3); } else { c.fillRect(fx - 5, y - 4, 3, 1); c.fillRect(fx + 3, y - 4, 3, 1); }
    c.fillStyle = '#b3202a'; c.fillRect(fx - 3, y + 4, 7, 2);
    // ноти пісеньки
    c.fillStyle = 'rgba(255,250,230,.85)';
    const ny = Math.round(y - 28 - ((t * 16) % 14));
    c.fillRect(x + dir * 14, ny, 2, 8); c.fillRect(x + dir * 14 - 3, ny + 7, 4, 3);
  }
}
