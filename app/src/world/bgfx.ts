/*
 * Живі фони: анімація поверх нових PNG-фонів (сяйво місяця й вогню, відблиски на воді, дим, зорі, сніг…).
 * Координати — у сітці картки 400×260 (фон 200×130 ×2); сцени рівнів масштабують полотно самі.
 * Кожен фон має свій список ефектів: back — за героями, front — поверх них.
 * Усе малюється кодом, без генерацій, пікселями 2×2 — як і сам фон.
 */
import { hash, pixelGlow } from './sprites.js';

type Pt = [number, number];
type Opts = Record<string, unknown> & { at?: Pt; pts?: Pt[]; n?: number; x?: [number, number]; y?: [number, number] };
type Fx = [string, Opts];
interface Cfg { back?: Fx[]; front?: Fx[] }

const W = 400, H = 260;
const sq = (c: CanvasRenderingContext2D, x: number, y: number, s = 2) => c.fillRect(Math.round(x), Math.round(y), s, s);
const range = (o: Opts, k: 'x' | 'y', d: [number, number]) => (o[k] as [number, number] | undefined) ?? d;

/* ---------- ефекти ---------- */
const FX: Record<string, (c: CanvasRenderingContext2D, t: number, o: Opts) => void> = {
  /** Сяйво джерела світла: рівне «дихання» (pulse) або мерехтіння вогню (flicker). */
  glow(c, t, o) {
    (o.pts ?? [o.at ?? [200, 130]]).forEach(([x, y], i) => {
      const a = (o.a as number) ?? 0.3, r = (o.r as number) ?? 40;
      const k = o.flicker ? 0.8 + 0.14 * Math.sin(t * 9 + i * 1.7) + 0.06 * Math.sin(t * 23 + i) : 0.88 + 0.12 * Math.sin(t * 0.9 + i);
      pixelGlow(c, x, y, r, (o.col as string) ?? '255,236,170', a * k);
    });
  },
  /** Відблиски на воді: короткі світлі риски то тут, то там. */
  glints(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), [y0, y1] = range(o, 'y', [150, 230]);
    c.fillStyle = (o.col as string) ?? 'rgba(255,255,255,.85)';
    for (let i = 0; i < (o.n ?? 18); i++) {
      const ph = (t * (0.6 + hash(i, 91) * 0.8) + hash(i, 92) * 5) % 2;
      if (ph > 0.7) continue;
      const w = 2 + Math.round(Math.sin((ph / 0.7) * Math.PI) * 6);
      c.fillRect(Math.round(x0 + hash(i, 93) * (x1 - x0)), Math.round(y0 + hash(i, 94) * (y1 - y0)), w, 2);
    }
  },
  /** Зорі: хрестик спалахує й гасне. */
  twinkle(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), [y0, y1] = range(o, 'y', [0, 90]);
    for (let i = 0; i < (o.n ?? 12); i++) {
      const ph = (t * (0.4 + hash(i, 61)) + hash(i, 62) * 7) % 3;
      if (ph > 0.8) continue;
      const x = x0 + hash(i, 63) * (x1 - x0), y = y0 + hash(i, 64) * (y1 - y0), a = Math.sin((ph / 0.8) * Math.PI);
      c.globalAlpha = a; c.fillStyle = '#fff8dc';
      sq(c, x, y); if (a > 0.6) { sq(c, x - 2, y); sq(c, x + 2, y); sq(c, x, y - 2); sq(c, x, y + 2); }
    }
    c.globalAlpha = 1;
  },
  /** Дим: клубочки піднімаються від джерела, розширюються й тануть. */
  smoke(c, t, o) {
    (o.pts ?? [o.at ?? [200, 100]]).forEach(([sx, sy], j) => {
      for (let i = 0; i < (o.n ?? 6); i++) {
        const age = (t * ((o.speed as number) ?? 0.22) + hash(i + j * 13, 32)) % 1;
        const x = sx + Math.sin(age * 5 + i) * 4 + age * ((o.drift as number) ?? 14), y = sy - age * ((o.rise as number) ?? 60), r = 2 + age * 6;
        c.globalAlpha = (1 - age) * ((o.a as number) ?? 0.4); c.fillStyle = (o.col as string) ?? '#9a948c';
        c.fillRect(Math.round(x - r), Math.round(y - r), Math.round(r * 2), Math.round(r * 2));
      }
    });
    c.globalAlpha = 1;
  },
  /** Язички полум'я на місці вогню з картинки: підсвічують його й «танцюють». */
  fire(c, t, o) {
    (o.pts ?? [o.at ?? [200, 200]]).forEach(([x, y], j) => {
      const w = (o.w as number) ?? 10;
      for (let k = -w / 2; k < w / 2; k += 2) {
        const h = 3 + ((Math.floor(t * 12) + k * 3 + j * 5) % 4 + 4) % 4 * 2;
        c.fillStyle = '#f7a54a'; c.fillRect(Math.round(x + k), Math.round(y - h), 2, h);
        c.fillStyle = '#ffe28a'; c.fillRect(Math.round(x + k), Math.round(y - h / 2), 2, Math.max(2, Math.round(h / 3)));
      }
    });
  },
  /** Жарини, що злітають угору. */
  embers(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), yb = (o.y0 as number) ?? H;
    for (let i = 0; i < (o.n ?? 16); i++) {
      const v = 18 + 26 * hash(i, 1), ph = (t * v + hash(i, 2) * yb) % yb, x = x0 + hash(i, 3) * (x1 - x0) + Math.sin(t * 2 + i) * 6;
      c.globalAlpha = 1 - ph / yb; c.fillStyle = i % 3 ? '#f08a2a' : '#ffd36a'; sq(c, x, yb - ph);
    }
    c.globalAlpha = 1;
  },
  /** Іскри з ковадла: віялом угору і вниз. */
  sparks(c, t, o) {
    (o.pts ?? [o.at ?? [200, 150]]).forEach(([sx, sy], j) => {
      for (let i = 0; i < (o.n ?? 14); i++) {
        const age = (t * 1.2 + hash(i + j * 7, 29)) % 1, vx = (hash(i, 30) - 0.5) * 70, vy = 40 + hash(i, 31) * 40;
        c.globalAlpha = 1 - age; c.fillStyle = i % 2 ? '#ffe28a' : '#f7a54a';
        sq(c, sx + vx * age, sy - vy * age + 60 * age * age);
      }
    });
    c.globalAlpha = 1;
  },
  /** Бульбашки в казані. */
  bubbles(c, t, o) {
    (o.pts ?? [o.at ?? [200, 150]]).forEach(([sx, sy], j) => {
      for (let i = 0; i < 6; i++) {
        const age = (t * 0.9 + hash(i + j * 5, 41)) % 1, x = sx + (hash(i, 42) - 0.5) * ((o.w as number) ?? 30), y = sy - age * 14;
        c.globalAlpha = 1 - age; c.fillStyle = '#ffd36a'; sq(c, x, y, age > 0.6 ? 2 : 4);
      }
    });
    c.globalAlpha = 1;
  },
  /** Мерехтіння лави чи вогню в смузі: світлі плями повільно пливуть. */
  shimmer(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), [y0, y1] = range(o, 'y', [150, 200]);
    c.fillStyle = (o.col as string) ?? 'rgba(255,220,120,.55)';
    for (let i = 0; i < (o.n ?? 14); i++) {
      const x = x0 + ((hash(i, 51) * (x1 - x0) + t * 10 * (hash(i, 52) - 0.3)) % (x1 - x0) + (x1 - x0)) % (x1 - x0), y = y0 + hash(i, 53) * (y1 - y0);
      c.globalAlpha = 0.5 + 0.5 * Math.sin(t * 3 + i); c.fillRect(Math.round(x), Math.round(y), 4, 2);
    }
    c.globalAlpha = 1;
  },
  /** Розлом між світами: стовп світла пульсує. */
  rift(c, t, o) {
    const [x0, x1] = range(o, 'x', [280, 296]), [y0, y1] = range(o, 'y', [0, 180]);
    c.globalAlpha = 0.18 + 0.12 * Math.sin(t * 4); c.fillStyle = '#e8f6ff'; c.fillRect(x0 - 4, y0, x1 - x0 + 8, y1 - y0);
    c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 7); c.fillStyle = '#ffffff'; c.fillRect(Math.round((x0 + x1) / 2) - 1, y0, 2, y1 - y0);
    c.globalAlpha = 1;
  },
  /** Сніг: дальні пластівці дрібні й повільні, ближні — більші. */
  snow(c, t, o) {
    c.fillStyle = '#ffffff';
    for (let i = 0; i < (o.n ?? 50); i++) {
      const near = hash(i, 7) < 0.25, v = near ? 30 : 12 + 10 * hash(i, 8), y = (t * v + hash(i, 9) * H) % H, x = (hash(i, 10) * W + Math.sin(t + i) * 10) % W;
      c.globalAlpha = near ? 0.95 : 0.65; sq(c, x, y, near ? 3 : 2);
    }
    c.globalAlpha = 1;
  },
  /** Дощ косими рисками. */
  rain(c, t, o) {
    c.fillStyle = 'rgba(190,214,240,.55)';
    for (let i = 0; i < (o.n ?? 50); i++) {
      const y = (t * 300 + hash(i, 11) * H) % H, x = (hash(i, 12) * W - y * 0.25 + W) % W;
      for (let k = 0; k < 4; k++) c.fillRect(Math.round(x - k), Math.round(y + k * 2), 2, 2);
    }
  },
  /** Бризки над гребенями хвиль. */
  spray(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), y = (o.at?.[1]) ?? 150;
    c.fillStyle = '#ffffff';
    for (let i = 0; i < (o.n ?? 14); i++) {
      const a = (t * 1.3 + hash(i, 13)) % 1, x = x0 + hash(i, 14) * (x1 - x0) + a * 8;
      c.globalAlpha = 1 - a; sq(c, x, y - Math.sin(a * Math.PI) * 14);
    }
    c.globalAlpha = 1;
  },
  /** Пилинки, що плавають у світлі. */
  motes(c, t, o) {
    const [y0, y1] = range(o, 'y', [0, H]);
    c.fillStyle = (o.col as string) ?? '#fff3cf';
    for (let i = 0; i < (o.n ?? 16); i++) {
      const x = (hash(i, 15) * W + t * (6 + 8 * hash(i, 16))) % W, y = y0 + hash(i, 17) * (y1 - y0) + Math.sin(t + i) * 6;
      c.globalAlpha = 0.35 + 0.35 * Math.sin(t * 2 + i); sq(c, x, y);
    }
    c.globalAlpha = 1;
  },
  /** Листя падає, погойдуючись. */
  leaves(c, t, o) {
    const cols = (o.col as string[]) ?? ['#e2702b', '#d9a521', '#c0392b', '#5f9a4a'];
    for (let i = 0; i < (o.n ?? 10); i++) {
      const v = 14 + 12 * hash(i, 18), y = (t * v + hash(i, 19) * H) % H, x = (hash(i, 20) * W + Math.sin(t * 1.4 + i) * 18 + t * 8) % W;
      c.fillStyle = cols[i % cols.length]; sq(c, x, y, 3); sq(c, x + 2, y + 2);
    }
  },
  /** Пелюстки. */
  petals(c, t, o) { FX.leaves(c, t, { ...o, col: ['#f4b6c2', '#ffffff', '#f7d6e0'] }); },
  /** Світлячки: зависають і блимають. */
  fireflies(c, t, o) {
    const [x0, x1] = range(o, 'x', [0, W]), [y0, y1] = range(o, 'y', [120, 240]);
    for (let i = 0; i < (o.n ?? 10); i++) {
      const x = x0 + hash(i, 24) * (x1 - x0) + Math.sin(t * 0.7 + i) * 12, y = y0 + hash(i, 25) * (y1 - y0) + Math.cos(t * 0.9 + i) * 8;
      const a = 0.5 + 0.5 * Math.sin(t * 3 + i * 2);
      c.globalAlpha = a; c.fillStyle = o.day ? '#fff6b0' : '#d8ff7a'; sq(c, x, y);
      c.globalAlpha = a * 0.3; c.fillRect(Math.round(x) - 2, Math.round(y) - 2, 6, 6);
    }
    c.globalAlpha = 1;
  },
  /** Метелики: пурхають над травою. */
  butterflies(c, t, o) {
    const [y0, y1] = range(o, 'y', [150, 220]), cols = ['#f2c230', '#ffffff', '#e2702b'];
    for (let i = 0; i < (o.n ?? 3); i++) {
      const x = (hash(i, 71) * W + t * (14 + 6 * hash(i, 72))) % (W + 20) - 10, y = y0 + hash(i, 73) * (y1 - y0) + Math.sin(t * 3 + i) * 8, up = Math.floor(t * 8 + i) % 2;
      c.fillStyle = cols[i % 3]; sq(c, x - 2, y - (up ? 2 : 0)); sq(c, x + 2, y - (up ? 2 : 0)); c.fillStyle = '#3a2a1a'; sq(c, x, y);
    }
  },
  /** Птахи-«галочки» летять небом. */
  birds(c, t, o) {
    const [y0, y1] = range(o, 'y', [20, 60]);
    c.fillStyle = (o.col as string) ?? '#2a2a30';
    for (let i = 0; i < (o.n ?? 3); i++) {
      const x = (t * (18 + 8 * hash(i, 34)) + hash(i, 35) * W) % (W + 40) - 20, y = y0 + hash(i, 36) * (y1 - y0) + Math.sin(t * 1.5 + i) * 4, flap = Math.floor(t * 6 + i) % 2;
      sq(c, x - 4, y + (flap ? 0 : -2)); sq(c, x - 2, y); sq(c, x, y + 2); sq(c, x + 2, y); sq(c, x + 4, y + (flap ? 0 : -2));
    }
  },
  /** Туман смугами, що повільно пливуть. */
  mist(c, t, o) {
    const y = (o.at?.[1]) ?? 120, a = (o.a as number) ?? 0.25;
    for (let b = 0; b < 3; b++) {
      c.globalAlpha = a * (1 - b * 0.3); c.fillStyle = '#f4f2ea';
      for (let x = -40 + ((t * (6 + b * 3)) % 40); x < W; x += 40) c.fillRect(Math.round(x), y + b * 6, 28, 2);
    }
    c.globalAlpha = 1;
  },
  /** Кола на воді. */
  ripples(c, t, o) {
    (o.pts ?? [o.at ?? [200, 200]]).forEach(([cx, cy], j) => {
      const p = (t * 0.5 + j * 0.37) % 1, rx = 4 + p * 26, ry = 1 + p * 4;
      c.globalAlpha = (1 - p) * 0.8; c.fillStyle = '#e8f6ff';
      for (let a = 0; a < 20; a++) { const an = (a / 20) * Math.PI * 2; sq(c, cx + Math.cos(an) * rx, cy + Math.sin(an) * ry); }
    });
    c.globalAlpha = 1;
  },
  /** Промені світла, що ледь дихають. */
  rays(c, t, o) {
    const x = (o.at?.[0]) ?? 300, col = (o.col as string) ?? '255,240,190';
    for (let k = 0; k < 5; k++) {
      c.fillStyle = `rgba(${col},${(0.05 + 0.03 * Math.sin(t * 0.8 + k)).toFixed(3)})`;
      c.beginPath(); c.moveTo(x - 10 + k * 8, 0); c.lineTo(x - 60 + k * 30, H); c.lineTo(x - 40 + k * 30, H); c.lineTo(x - 4 + k * 8, 0); c.fill();
    }
  },
  /** Падаюча зоря раз на кілька секунд. */
  shooting(c, t) {
    const per = 6, k = t % per;
    if (k > 0.9) return;
    const p = k / 0.9, x = 60 + p * 220, y = 20 + p * 50;
    for (let j = 0; j < 10; j++) { c.globalAlpha = (1 - j / 10) * (1 - p * 0.5); c.fillStyle = '#fff8dc'; sq(c, x - j * 4, y - j * 1.4); }
    c.globalAlpha = 1;
  },
  /** Спалах блискавки: рідко й коротко. */
  lightning(c, t) {
    const k = t % 5.5;
    if (k < 0.12 || (k > 0.2 && k < 0.26)) { c.fillStyle = 'rgba(225,238,255,.28)'; c.fillRect(0, 0, W, H); }
  },
};

/* ---------- які ефекти на якому фоні ---------- */
const CFG: Record<string, Cfg> = {
  'world-00': { back: [['glow', { at: [265, 25], r: 50, col: '255,236,190', a: 0.22 }], ['smoke', { pts: [[58, 86], [118, 96]], col: '#3a342e', n: 7, a: 0.45 }], ['glints', { x: [200, 400], y: [108, 150], n: 14 }]], front: [['embers', { n: 12 }]] },
  'world-01': { back: [['glints', { x: [0, 400], y: [160, 228], n: 22 }], ['spray', { x: [0, 400], at: [0, 150], n: 16 }], ['lightning', {}]], front: [['rain', { n: 46 }]] },
  'world-02': { back: [['glints', { x: [210, 400], y: [100, 158], n: 16 }], ['birds', { n: 3, y: [20, 50] }]], front: [['motes', { n: 10, col: '#f6e4b8' }]] },
  'world-03': { back: [['rays', { at: [280, 0] }]], front: [['leaves', { n: 12 }], ['motes', { n: 8, y: [40, 200] }]] },
  'world-04': { back: [['mist', { at: [0, 150], a: 0.22 }]], front: [['snow', { n: 70 }]] },
  'world-05': { back: [['glow', { at: [316, 40], r: 48, col: '245,238,200', a: 0.3 }], ['twinkle', { x: [0, 400], y: [0, 100], n: 14 }], ['glow', { pts: [[56, 152], [104, 150], [168, 150], [204, 150], [364, 162]], r: 12, col: '255,200,110', a: 0.35, flicker: true }], ['fireflies', { y: [160, 235], n: 10 }]] },
  'world-06': { back: [['smoke', { at: [322, 16], col: '#e8e4dc', n: 8, rise: 40, drift: -30, a: 0.5 }], ['glints', { x: [220, 330], y: [68, 95], n: 10 }], ['birds', { n: 3, y: [30, 60] }]], front: [['motes', { n: 8, col: '#fff3cf' }]] },
  'world-07': { back: [['twinkle', { y: [0, 110], n: 18 }], ['shooting', {}], ['fireflies', { y: [160, 235], n: 10 }]] },
  'world-08': { back: [['glow', { pts: [[60, 95], [380, 126], [215, 172]], r: 40, col: '255,120,40', a: 0.4, flicker: true }], ['bubbles', { pts: [[60, 84], [380, 116]], w: 34 }], ['shimmer', { x: [150, 310], y: [150, 200], n: 16 }], ['smoke', { pts: [[60, 70], [380, 104]], col: '#2a1612', n: 5, a: 0.4 }]], front: [['embers', { n: 26 }]] },
  'world-09': { back: [['glow', { at: [130, 55], r: 100, col: '255,226,140', a: 0.28 }], ['glints', { x: [260, 392], y: [140, 172], n: 12 }]], front: [['motes', { n: 22, col: '#fff3cf' }]] },
  'world-10': { back: [['mist', { at: [0, 115], a: 0.3 }], ['ripples', { pts: [[150, 192], [262, 196]] }], ['glints', { x: [60, 320], y: [168, 212], n: 12 }]], front: [['petals', { n: 8 }], ['fireflies', { day: true, n: 6, y: [90, 220] }]] },
  'world-11': { back: [['glints', { x: [250, 400], y: [150, 236], n: 14 }], ['mist', { at: [0, 70], a: 0.2 }], ['smoke', { at: [92, 112], col: '#cfc8bc', n: 5, a: 0.35 }], ['birds', { n: 3, y: [20, 50] }]], front: [['leaves', { n: 6, col: ['#3f7a56', '#d9a521', '#5f9a4a'] }]] },
  'world-12': { back: [['glow', { at: [222, 72], r: 60, col: '255,214,140', a: 0.3 }], ['glints', { x: [50, 350], y: [130, 205], n: 16, col: 'rgba(255,230,170,.85)' }], ['birds', { n: 4, y: [20, 60] }]], front: [['motes', { n: 10, col: '#e2cc96' }]] },
  'world-13': { back: [['twinkle', { y: [0, 60], n: 10 }], ['glow', { pts: [[180, 188], [335, 203], [312, 48]], r: 30, col: '255,150,60', a: 0.45, flicker: true }], ['fire', { pts: [[180, 194], [335, 209]], w: 10 }], ['smoke', { pts: [[180, 176], [335, 190]], col: '#2a2420', n: 5, a: 0.35 }]], front: [['embers', { n: 18, x: [160, 360], y0: 210 }]] },
  'world-14': { back: [['glow', { pts: [[45, 135], [215, 120], [380, 110]], r: 44, col: '255,140,50', a: 0.42, flicker: true }], ['shimmer', { x: [200, 232], y: [70, 200], n: 10 }], ['sparks', { pts: [[100, 146], [330, 150]], n: 12 }]], front: [['embers', { n: 16 }]] },
  'world-15': { back: [['glow', { at: [232, 108], r: 90, col: '255,190,110', a: 0.32 }], ['rays', { at: [232, 0], col: '255,190,130' }]], front: [['motes', { n: 18, col: '#ecb890' }]] },
  carthage: { back: [['glow', { at: [340, 16], r: 40, col: '255,236,170', a: 0.28 }], ['glints', { x: [0, 170], y: [150, 186], n: 18 }], ['birds', { n: 4, y: [26, 64] }]] },
  storm: { back: [['lightning', {}], ['glow', { at: [120, 70], r: 50, col: '230,240,255', a: 0.18 }]], front: [['rain', { n: 70 }]] },
  olympus: { back: [['birds', { n: 2, y: [30, 70], col: '#fbf3e6' }]], front: [['motes', { n: 10, col: '#ffe9a8' }]] },
  'juno-palace': { back: [['glow', { pts: [[60, 62], [112, 112], [330, 42]], r: 22, col: '255,200,110', a: 0.38, flicker: true }], ['twinkle', { x: [112, 250], y: [20, 130], n: 8 }]], front: [['motes', { n: 8, col: '#ffe0a0' }]] },
  library: { back: [['glow', { pts: [[18, 62], [38, 68], [388, 72]], r: 16, col: '255,200,110', a: 0.45, flicker: true }], ['glow', { pts: [[68, 140], [205, 140], [348, 182]], r: 14, col: '170,230,255', a: 0.35 }], ['twinkle', { x: [230, 330], y: [4, 80], n: 8 }]], front: [['motes', { n: 10, col: '#ffe0a0' }]] },
  'franko-forest': { back: [['smoke', { at: [338, 52], col: '#e8e4dc', n: 5, a: 0.4 }], ['birds', { n: 2, y: [20, 50] }]], front: [['butterflies', { n: 3, y: [170, 220] }]] },
  departure: { back: [['glow', { at: [120, 142], r: 60, col: '255,214,150', a: 0.3 }], ['glints', { x: [0, 400], y: [190, 252], n: 22 }], ['rift', { x: [280, 296], y: [0, 180] }], ['twinkle', { x: [230, 350], y: [20, 250], n: 10 }]] },
  'troy-night': { back: [['glow', { at: [336, 32], r: 44, col: '245,238,200', a: 0.3 }], ['twinkle', { y: [0, 80], n: 14 }], ['glow', { pts: [[30, 106], [72, 110], [170, 92], [212, 100], [272, 106], [332, 112]], r: 10, col: '255,200,110', a: 0.35, flicker: true }]] },
  'troy-dawn': { back: [['glow', { pts: [[150, 126], [186, 130], [262, 150], [300, 148], [334, 140]], r: 24, col: '255,120,40', a: 0.4, flicker: true }], ['fire', { pts: [[150, 132], [262, 156], [334, 146]], w: 8 }], ['smoke', { pts: [[150, 116], [262, 140], [334, 130]], col: '#2a1c18', n: 6, a: 0.4 }]], front: [['embers', { n: 24 }]] },
  'abc-kolobok': { back: [['glow', { at: [62, 110], r: 18, col: '255,200,110', a: 0.4, flicker: true }]], front: [['leaves', { n: 6 }], ['motes', { n: 6 }]] },
  'abc-ripka': { back: [['birds', { n: 2, y: [20, 50] }]], front: [['butterflies', { n: 3, y: [160, 230] }]] },
  'abc-horoshko': { back: [['birds', { n: 3, y: [20, 60] }]], front: [['butterflies', { n: 4, y: [170, 235] }], ['petals', { n: 5 }]] },
  'abc-koza': { back: [['glow', { at: [210, 96], r: 40, col: '255,214,150', a: 0.3 }], ['smoke', { at: [340, 112], col: '#e8e4dc', n: 4, a: 0.35 }]], front: [['motes', { n: 8 }]] },
  'abc-bychok': { back: [['glow', { at: [372, 82], r: 44, col: '255,214,150', a: 0.3 }], ['glints', { x: [270, 400], y: [202, 236], n: 8 }], ['mist', { at: [0, 120], a: 0.18 }]], front: [['motes', { n: 6 }]] },
  'abc-kotsky': { back: [['rays', { at: [120, 0] }]], front: [['leaves', { n: 12 }], ['motes', { n: 8 }]] },
  'abc-lysychka': { back: [['twinkle', { y: [0, 60], n: 10 }], ['smoke', { pts: [[312, 34], [352, 30]], col: '#e8e4f0', n: 4, a: 0.4, rise: 40 }]], front: [['snow', { n: 36 }]] },
  'abc-telesyk': { back: [['glints', { x: [0, 120], y: [130, 230], n: 12 }], ['ripples', { pts: [[60, 200], [96, 170]] }], ['birds', { n: 2, y: [20, 50] }]], front: [['butterflies', { n: 3, y: [170, 230] }]] },
};

/** Усі фони з живими ефектами — для перегляду в dev-панелі. */
export const BG_FX_KEYS = Object.keys(CFG);

/** Чи є живі ефекти для фону (ключ без 'bg/': 'world-05', 'library'). */
export const hasBgFx = (key: string) => !!CFG[key];

/** Малює шар ефектів фону в сітці 400×260; t — секунди. false — для цього фону ефектів немає. */
export function drawBgFx(c: CanvasRenderingContext2D, key: string, t: number, which: 'back' | 'front'): boolean {
  const cfg = CFG[key];
  if (!cfg) return false;
  c.save();
  for (const [k, o] of cfg[which] ?? []) FX[k]?.(c, t, o);
  c.restore();
  return true;
}
