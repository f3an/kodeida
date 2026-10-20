/*
 * Новий піксель-арт (PixelLab): герої, ватага, анімації й фони світів — PNG з src/assets/art.
 * Картинки вантажаться один раз на старті (preloadArt). Поки їх немає або вони не завантажились,
 * сцени малюють старі спрайти з sprites.js — тож гра працює і без цього модуля.
 */

/** Те саме, що вміють спрайти з sprites.js: розмір і draw з масштабом. */
export interface ArtSprite { w: number; h: number; draw: (ctx: CanvasRenderingContext2D, x: number, y: number, s: number) => void }

const urls = import.meta.glob('../assets/art/**/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const images = new Map<string, HTMLImageElement>();
let ready = false;

/** Ключ картинки — шлях відносно assets/art без .png: 'enei/walk-SE/3', 'bg/world-07'. */
const keyOf = (path: string) => path.replace(/^.*assets\/art\//, '').replace(/\.png$/, '');

export function preloadArt(timeoutMs = 4000): Promise<void> {
  const jobs = Object.entries(urls).map(([path, url]) => new Promise<void>((res) => {
    const img = new Image();
    img.onload = () => { images.set(keyOf(path), img); res(); };
    img.onerror = () => res();
    img.src = url;
  }));
  const all = Promise.all(jobs).then(() => { ready = true; });
  return Promise.race([all, new Promise<void>((res) => setTimeout(res, timeoutMs))]);
}

export const artReady = () => ready;

/* ---------- кадри: обрізка по спільній рамці, щоб ступні не стрибали ---------- */

type Box = { x0: number; y0: number; x1: number; y1: number };

function canvasOf(img: HTMLImageElement | HTMLCanvasElement) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  return c;
}

function bboxOf(c: HTMLCanvasElement): Box | null {
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    if (d[(y * c.width + x) * 4 + 3] === 0) continue;
    if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
  }
  return x1 < 0 ? null : { x0, y0, x1: x1 + 1, y1: y1 + 1 };
}

function spriteOf(src: HTMLCanvasElement, b: Box): ArtSprite {
  const w = b.x1 - b.x0, h = b.y1 - b.y0;
  return {
    w, h,
    draw(ctx, x, y, s) {
      const smooth = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(src, b.x0, b.y0, w, h, Math.round(x), Math.round(y), w * s, h * s);
      ctx.imageSmoothingEnabled = smooth;
    },
  };
}

/** Кадри анімації (або один статичний), обрізані по спільній рамці. */
function framesOf(keys: string[], tint?: (c: HTMLCanvasElement) => void): ArtSprite[] | null {
  const imgs = keys.map((k) => images.get(k));
  if (imgs.some((i) => !i)) return null;
  const cs = (imgs as HTMLImageElement[]).map((i) => { const c = canvasOf(i); tint?.(c); return c; });
  const boxes = cs.map(bboxOf).filter((b): b is Box => !!b);
  if (!boxes.length) return null;
  const u: Box = { x0: Math.min(...boxes.map((b) => b.x0)), y0: Math.min(...boxes.map((b) => b.y0)), x1: Math.max(...boxes.map((b) => b.x1)), y1: Math.max(...boxes.map((b) => b.y1)) };
  return cs.map((c) => spriteOf(c, u));
}

const seq = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}/${i}`);
const cache = new Map<string, ArtSprite[] | null>();
const memo = (key: string, make: () => ArtSprite[] | null) => {
  if (!ready) return null;
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key)!;
};

/* ---------- хутро Микити в колір світу (як у кадрах-зразках: тон хутра міняється, тіні й відблиски лишаються) ---------- */

const RAINBOW = ['#b3202a', '#e2702b', '#d9a521', '#4f9d4a', '#2f6db5', '#6b3fa0'];
const REF = [23 / 360, 0.85, 0.91];

function rgb2hsv(r: number, g: number, b: number): [number, number, number] {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = ((h / 6) % 1 + 1) % 1;
  return [h, mx ? d / mx : 0, mx];
}
function hsv2rgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  const [r, g, b] = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][((i % 6) + 6) % 6];
  return [r, g, b];
}
const hexHsv = (hex: string) => rgb2hsv(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);

function furTint(fur: string) {
  return (c: HTMLCanvasElement) => {
    if (fur === '#e2702b') return; // рудий — рідний колір кадрів
    const g = c.getContext('2d')!, im = g.getImageData(0, 0, c.width, c.height), d = im.data;
    for (let i = 0; i < d.length; i += 4) {
      if (!d[i + 3]) continue;
      const [h, s, v] = rgb2hsv(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255), hd = h * 360;
      // третя умова — світліше хутро портретів (#e2702a, s≈0.81); темні бурі (пояс, жилет) мають v < 0.6
      const isFur = (hd >= 17 && hd <= 26 && s >= 0.85 && v >= 0.4) || (hd >= 23 && hd <= 32 && s >= 0.45 && s < 0.85 && v > 0.85) || (hd >= 17 && hd <= 26 && s >= 0.78 && v >= 0.6);
      if (!isFur) continue;
      const px = (i / 4) % c.width, py = Math.floor(i / 4 / c.width);
      const [th, ts, tv] = fur === 'rainbow' ? hexHsv(RAINBOW[Math.floor((py + px / 2) / 5) % RAINBOW.length]) : hexHsv(fur);
      const [r, gg, b] = hsv2rgb((th + (h - REF[0]) * 0.5 + 1) % 1, Math.min(1, s * ts / REF[1]), Math.min(1, v * tv / REF[2]));
      d[i] = Math.round(r * 255); d[i + 1] = Math.round(gg * 255); d[i + 2] = Math.round(b * 255);
    }
    g.putImageData(im, 0, 0);
  };
}

/* ---------- що бачать сцени ---------- */

export type Pose = 'walk' | 'idle' | 'jump' | 'pickup';

/** Еней у ракурсі SE: хода (8 кадрів), стрибок (7); у спокої — один статичний кадр (front — анфас). */
export function eneiFrames(pose: Pose, front = false, coat = false) {
  // coat — червоний жупан для холодних світів (є статика, хода й стрибок)
  const who = coat ? 'enei-coat' : 'enei';
  if (pose === 'idle') return memo(`${who}:static-${front ? 'S' : 'SE'}`, () => framesOf([`${who}/static-${front ? 'S' : 'SE'}`]));
  if (pose === 'pickup') return memo('enei:pickup-SE', () => framesOf(seq('enei/pickup-SE', 5)));
  const name = pose === 'walk' ? 'walk-SE' : 'jump-SE';
  return memo(`${who}:${name}`, () => framesOf(seq(`${who}/${name}`, pose === 'walk' ? 8 : 7)));
}

/** Лис Микита дивиться ліворуч (SW), хутро — колір світу; у спокої — статичний кадр (front — анфас). */
export function foxFrames(fur: string, pose: Pose, front = false) {
  if (pose !== 'walk') return memo(`fox:${fur}:static-${front ? 'S' : 'SW'}`, () => framesOf([`fox/static-${front ? 'S' : 'SW'}`], furTint(fur)));
  const name = pose === 'walk' ? 'walk-SW' : front ? 'idle-S' : 'idle-SW';
  return memo(`fox:${fur}:${name}`, () => framesOf(seq(`fox/${name}`, pose === 'walk' ? 8 : 4), furTint(fur)));
}

/** Портрет мовця в діалозі: [звичайний, «говорить»]; у Микити — [хвіст світиться, хвіст погас], хутро в колір світу. */
export function portraitFrames(who: string, fur = '#e2702b') {
  return memo(`portrait:${who}:${who === 'fox' ? fur : ''}`, () => framesOf([`portraits/${who}/0`, `portraits/${who}/1`], who === 'fox' ? furTint(fur) : undefined));
}

/** Один статичний кадр за ключем: 'tales/ripka', 'cast/sibyl'. */
export function still(key: string) {
  return memo(`still:${key}`, () => framesOf([key]))?.[0] ?? null;
}

/** Статичний кадр із хутром Микити в кольорі fur (сам Микита, корабель з ним на борту). */
export function stillFur(key: string, fur: string) {
  return memo(`stillfur:${key}:${fur}`, () => framesOf([key], furTint(fur)))?.[0] ?? null;
}

/** Кадри анімації заставки за префіксом: 'cut/zeus-toast' → cut/zeus-toast/0..n-1. */
export function animFrames(prefix: string, n: number) {
  return memo(`anim:${prefix}`, () => framesOf(seq(prefix, n)));
}

/** Дзеркальна копія спрайта: персонаж дивиться в інший бік. */
export function mirror(s: ArtSprite): ArtSprite {
  return {
    w: s.w, h: s.h,
    draw(ctx, x, y, k) { ctx.save(); ctx.translate(Math.round(x) + s.w * k, 0); ctx.scale(-1, 1); s.draw(ctx, 0, y, k); ctx.restore(); },
  };
}

/** Еней анфас у вишиванці: рівень вишивки 0–2 (екран «Вишиванка»). */
export function shirtStill(level: 0 | 1 | 2) {
  return still(`enei/shirt-${level}`);
}

/** Ціла картинка без обрізки (фони заставок): 'bg/olympus'. */
export function artImage(key: string): HTMLImageElement | null {
  return ready ? images.get(key) ?? null : null;
}

/** Герої казок «Абетки» за розділами 1–7 (розділ 0 — Колобок котиться окремо). */
export const TALE_ART = ['ripka', 'kotyhoroshko', 'goat', 'strawBull', 'kotsky', 'vixen', 'ivasyk'];
/** Фон розділу «Абетки» за ключем розділу; якщо свого немає — нічна Троя. */
export const TALE_BG = ['kolobok', 'ripka', 'horoshko', 'koza', 'bychok', 'kotsky', 'lysychka', 'telesyk'];

/** Статичний кадр анфас (головний екран): Еней і рудий Микита. */
export function frontStill(who: 'enei' | 'fox') {
  return memo(`${who}:static-S`, () => framesOf([`${who}/static-S`]))?.[0] ?? null;
}

/** Ватага в тому ж порядку, що CREW у сценах: воїн, моряк, Анхіз, жінка. */
export const CREW_ART = ['warrior', 'sailor', 'anchises', 'woman'] as const;
export function crewFrames(who: (typeof CREW_ART)[number], walking: boolean) {
  return memo(`crew:${who}:${walking}`, () => walking ? framesOf(seq(`crew/${who}/walk-SE`, 8)) : framesOf([`crew/${who}/static-SE`]));
}

/** Фон світу 200×136 (обрізаємо до 200×130 зверху, бо земля для героїв — унизу). */
export function worldBg(world: number): HTMLImageElement | null {
  if (!ready) return null;
  return images.get(`bg/world-${String(world).padStart(2, '0')}`) ?? null;
}
