/*
 * Заставки з новим артом (PixelLab): фони 200×130 і герої ×2 на полотні 400×260 — одна піксельна сітка.
 * Бенкет на Олімпі (шестеро богів) і звірі біля діжі — ×1, інакше не вміщаються.
 * Старі сцени з sprites.js лишаються запасними: якщо арт не завантажився — малюються вони.
 * Персонажі стоять статично; рухається те, що є подією сцени (бенкет, вітри, розлам Писанки, лис стрибає
 * в діжу, Вовк ковтає уламок, Микита падає з неба, корабель пливе). Хто говорить — у кадрі «говорить».
 */
import { still, stillFur, artImage, mirror, animFrames, eneiFrames, foxFrames, crewFrames, CREW_ART, worldBg, type ArtSprite } from './art.ts';
import { px, hash, RAINBOW, fxLayer, pixelGlow, ALL_WORLDS } from './sprites.js';
import { COLD_WORLDS } from './scenes.ts';
import { drawBgFx } from './bgfx.ts';

const CW = 400, CH = 260;
/** Лінія ступнів: верх бруківки на нових фонах. */
const FEET = 248;

export interface CutArt {
  /** Новий фон (ключ у assets/art); без нього — старий фон сцени. */
  bg?: string;
  /** Напівпрозора заливка поверх фону (палати Юнони — Олімп у фіолетовому присмерку). */
  tint?: string;
  fg: (ctx: CanvasRenderingContext2D, f: number, speaker: string | null) => void;
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Спрайт ступнями на лінії feet, по центру cx, у масштабі k. */
function stand(ctx: CanvasRenderingContext2D, s: ArtSprite | null, cx: number, feet = FEET, k = 2) {
  s?.draw(ctx, Math.round(cx - (s.w * k) / 2), Math.round(feet - s.h * k), k);
}
/** Дивиться в інший бік (Еол дме праворуч — на Юнону, на храми). */
const flip = (s: ArtSprite | null) => (s ? mirror(s) : null);
const enei = () => eneiFrames('idle')?.[0] ?? null;
const fox = (fur: string) => foxFrames(fur, 'idle')?.[0] ?? null;
/** Бог: говорить — кадр із піднятою рукою. */
const god = (who: string, speaker: string | null) => (speaker === who && still(`cut/${who}-talk`)) || still(`cut/${who}`);

export function paintArtBg(ctx: CanvasRenderingContext2D, img: HTMLImageElement, tint?: string) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, img.height - 130, 200, 130, 0, 0, CW, CH);
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, CW, CH); }
}

/** Анімація: кадр за часом, fps кадрів на секунду (f — такт заставки по 260 мс, з дробом); null — кадрів немає. */
const anim = (prefix: string, n: number, f: number, fps = 8) => { const fr = animFrames(prefix, n); return fr ? fr[Math.floor((f * 0.26) * fps) % fr.length] : null; };
/** Бог на бенкеті святкує (анімація), навіть коли говорить; без кадрів — статичний кадр. */
const FEAST_N: Record<string, number> = { zeus: 9, neptune: 7, bacchus: 9, apollo: 9, venus: 9 };
const feaster = (who: string, f: number) =>
  anim(`cut/feast-${who}`, FEAST_N[who], f, 5) || still(`cut/${who}`);

/** Уламки, що розлітаються з точки (cx, cy): p — час від вибуху (0..1+), з гравітацією. */
function burst(ctx: CanvasRenderingContext2D, cx: number, cy: number, p: number, n = 12) {
  const sh = still('cut/shard');
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + hash(i, 3), v = 90 + 80 * hash(i, 4);
    const x = cx + Math.cos(a) * v * p, y = cy + Math.sin(a) * v * p * 0.8 + p * p * 140;
    if (sh) { ctx.globalAlpha = clamp(1.6 - p); sh.draw(ctx, Math.round(x - sh.w / 2), Math.round(y - sh.h / 2), 1); ctx.globalAlpha = 1; }
  }
}

/** Хмарки-клубочки подиху: вилітають з точки (x, y) через age секунд після видиху й розлітаються віялом до краю екрана. */
function windPuffs(ctx: CanvasRenderingContext2D, x: number, y: number, age: number) {
  for (let k = 0; k < 22; k++) {
    // кожна хмарка вилітає трохи пізніше й летить своєю швидкістю аж за край екрана
    const a = age - hash(k, 82) * 0.4, px_ = x + a * (140 + hash(k, 83) * 120);
    if (a < 0 || px_ > CW + 8) continue;
    const ph = Math.min(1, (px_ - x) / (CW - x)), py = y + (hash(k, 84) - 0.5) * (14 + ph * 110);
    const r = 1 + Math.round(hash(k, 85) * 3 * (1 - ph * 0.5));
    ctx.globalAlpha = Math.max(0.25, 1 - ph * 0.75);
    ctx.fillStyle = k % 3 ? '#e8f4ff' : '#a7d6e6';
    ctx.fillRect(Math.round(px_ - r), Math.round(py - r), r * 2, r * 2);
    if (r > 2) { ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(px_ - r + 1), Math.round(py - r + 1), 2, 2); }
  }
  ctx.globalAlpha = 1;
}

const SCENES: Record<number, CutArt> = {
  /* Олімп: боги бенкетують за столом під Писанкою; Юнона осторонь і не святкує */
  0: {
    bg: 'bg/olympus',
    fg: (ctx, f, sp) => {
      const egg = still('cut/pysanka');
      if (egg) {
        // Писанка ×2 — головна річ сцени
        pixelGlow(ctx, 200, 66, 78, '255,243,196', 0.35 + 0.08 * (Math.floor(f) % 2));
        egg.draw(ctx, 200 - egg.w, 10, 2);
      }
      // за столом: ноги сховані, видно від пояса
      const row = 238;
      stand(ctx, feaster('apollo', f), 96, row, 1); stand(ctx, feaster('bacchus', f + 3), 146, row, 1);
      stand(ctx, feaster('zeus', f + 1), 200, row, 1); stand(ctx, feaster('neptune', f + 5), 254, row, 1);
      stand(ctx, feaster('venus', f + 2), 304, row, 1);
      const table = still('cut/feast-table');
      if (table) table.draw(ctx, 200 - Math.round(table.w / 2), FEET - table.h, 1);
      stand(ctx, (sp === 'juno' && still('cut/juno-talk')) || still('cut/juno-SW') || still('cut/juno'), 370, FEET, 1);
      for (let i = 0; i < 34; i++) {
        const x = (hash(i, 70) * CW + Math.sin((f + i) * 0.2) * 6) % CW, y = (hash(i, 71) * CH + f * (1 + (i % 2))) % CH;
        ctx.fillStyle = RAINBOW[i % 6]; ctx.fillRect(Math.round(x), Math.round(y), i % 3 ? 3 : 2, i % 2 ? 3 : 2);
      }
    },
  },
  /* Змова: Юнона в своїх палатах пропонує Еолові мішок золота */
  // Еол тут ще не дме — звичайний, сидить на хмарі й слухає Юнону
  1: { bg: 'bg/juno-palace', fg: (ctx) => { stand(ctx, flip(still('cast/eol')) ?? flip(still('cut/eol')), 100, 240); stand(ctx, still('cut/juno-gold') ?? still('cut/juno-SW'), 300); } },
  /* Мішок вітрів: Еол дме (кадри анімації туди й назад), а вітри-пориви летять від нього над Олімпом */
  2: {
    bg: 'bg/olympus', tint: 'rgba(14,30,64,.62)',
    fg: (ctx, f) => {
      const T = f * 0.26, ex = 90, feet = 200;
      // Еол: дме, видихає — і знову (кадри туди й назад)
      const fr = animFrames('cut/eol-blow', 9);
      const n = fr ? fr.length : 0, i = n ? Math.floor(T * 8) % (2 * n - 2) : 0, fi = i < n ? i : 2 * n - 2 - i;
      const eol = fr ? fr[fi] : still('cut/eol');
      // край кадру, де обрізано його подих, і висота рота (дзеркально: дме праворуч)
      const edge = eol ? ex + eol.w : ex + 60, mouthY = eol ? feet - eol.h * 2 + Math.round(eol.h * 0.9) : 120;
      const gust = anim('cut/wind', 9, f, 10) ?? still('cut/wind');
      stand(ctx, flip(eol), ex, feet);
      if (!eol || !gust || !n) return;
      // кожен видих (раз на цикл анімації) випускає зграю: великий порив, два малі й хмарки-клубочки.
      // Вони народжуються біля рота (лівіше зрізу подиху, тож зріз схований) і летять до краю екрана
      const P = (2 * n - 2) / 8, mouthX = edge - 34;
      for (let e = Math.floor(T / P) - 2; e <= Math.floor(T / P) + 1; e++) {
        const age = T - (e * P - 3 / 8);
        if (age < 0) continue;
        const flock: [number, number, number, number][] = [[0, 0, 2, 170], [-24, 0.12, 1, 210], [22, 0.22, 1, 190]];
        for (const [dy, delay, k, speed] of flock) {
          // поки Еол видихає (~0,8 с), порив «витікає» з рота повільно й ховає зріз, потім летить до краю
          const a = age - delay, hold = 0.8 - delay, x = mouthX + 30 * Math.min(a, hold) + speed * Math.max(0, a - hold);
          if (a < 0 || x - 12 > CW) continue;
          const fr2 = anim('cut/wind', 9, f + e * 2 + delay * 20, 10 + k) ?? gust;
          // хвіст пориву біля рота, голова летить уперед
          fr2.draw(ctx, Math.round(x - 12), Math.round(mouthY + dy + Math.sin(a * 3 + e) * 8 * Math.min(1, a) - fr2.h * k / 2), k);
        }
        windPuffs(ctx, mouthX, mouthY, age);
      }
    },
  },
  /* Шторм: Писанка тремтить, тріскається і розлітається уламками; дощ і блискавки */
  3: {
    bg: 'bg/storm',
    fg: (ctx, f) => {
      ctx.fillStyle = 'rgba(159,190,220,.7)';
      for (let i = 0; i < 40; i++) { const x = (hash(i, 40) * CW + f * 12) % CW, y = (hash(i, 41) * CH + f * 22) % CH; ctx.fillRect(Math.round(x), Math.round(y), 2, 8); }
      const egg = still('cut/pysanka'), ex = 280, ey = 70, BREAK = 11;
      if (egg && f < BREAK) {
        const shake = f > 4 ? Math.round(Math.sin(f * 3) * (f - 4) * 0.6) : 0;
        egg.draw(ctx, ex - egg.w + shake, ey - egg.h, 2);
        // тріщини ростуть від центру
        if (f > 5) {
          ctx.fillStyle = '#fff6c8'; const len = (f - 5) * 7;
          for (let r = 0; r < 5; r++) { const a = r * 1.3 + 0.4; for (let k = 0; k < len; k += 2) px(ctx, Math.round(ex + shake + Math.cos(a) * k + Math.sin(k * 0.6) * 2), Math.round(ey + Math.sin(a) * k * 1.2), 2, '#fff6c8'); }
        }
      }
      if (f >= BREAK) {
        const p = (f - BREAK) / 10;
        if (p < 0.25) { ctx.fillStyle = `rgba(255,250,220,${0.8 - p * 3})`; ctx.fillRect(0, 0, CW, CH); }
        burst(ctx, ex, ey, p, 14);
      } else if (f % 9 < 1) { ctx.fillStyle = 'rgba(255,250,220,.35)'; ctx.fillRect(0, 0, CW, CH); }
    },
  },
  /* Уламки по книжках: уламки падають у корінці */
  4: {
    bg: 'bg/library',
    fg: (ctx, f) => {
      const sh = still('cut/shard');
      for (let k = 0; k < 13; k++) {
        const ph = ((f + k * 2) % 26) / 26;
        if (ph > 0.7 || !sh) continue;
        const x = 30 + ((k * 29) % 340), y = lerp(-20, 140, ph / 0.7);
        sh.draw(ctx, Math.round(x - sh.w / 2), Math.round(y), 1);
      }
    },
  },
  /* Прохання Венери: Зевс із рушником на голові; між ними розгортається мапа уламків; наприкінці — Сивілла */
  5: {
    bg: 'bg/olympus', tint: 'rgba(40,24,90,.42)',
    fg: (ctx, f, sp) => {
      stand(ctx, god('venus', sp), 80);
      stand(ctx, still('cut/zeus-hungover') ?? god('zeus', sp), 320);
      if (f > 20) { ctx.globalAlpha = Math.min(1, (f - 20) / 6); stand(ctx, still('cut/sibyl-SW'), 200); ctx.globalAlpha = 1; }
      // сувій розгортається від центру, мітки уламків поблимують
      const map = still('cut/map-scroll');
      if (map) {
        const p = easeOut(Math.min(1, f / 8)), w = map.w * 2, h = map.h * 2, x = 200 - w / 2, y = 6;
        const vis = Math.max(8, Math.round(w * p));
        ctx.save(); ctx.beginPath(); ctx.rect(200 - vis / 2, y, vis, h); ctx.clip(); map.draw(ctx, x, y, 2); ctx.restore();
        if (p >= 1) for (let k = 0; k < 13; k++) if ((Math.floor(f) + k) % 5 === 0) { ctx.fillStyle = 'rgba(255,246,200,.85)'; ctx.fillRect(Math.round(x + 30 + hash(k, 21) * (w - 60)), Math.round(y + 24 + hash(k, 22) * (h - 48)), 4, 4); }
      }
    },
  },
  /* Ліс Франка: лис стрибає дугою в чарівну діжу — веселковий вир, спалах, і лиса нема */
  6: {
    bg: 'bg/franko-forest',
    fg: (ctx, f) => {
      const t = f * 0.15, FX = still('cut/foxWild-E'), bar = still('cut/barrel');
      if (!bar) return;
      const bw = bar.w * 2, bh = bar.h * 2, bx = 230 - bw / 2, by = FEET - bh, rim = by + Math.round(bh * 0.2), cx = bx + bw / 2;
      // вир у діжі крутиться швидше, коли лис пірнає
      const spin = performance.now() / (t > 2.0 && t < 3.6 ? 60 : 180);
      if (FX) {
        let x = 0, y = 0, show = true, spr: ArtSprite = FX;
        const sx = 60, sy = FEET - FX.h, top = rim - FX.h - 6;
        // підходить ходою, стрибає (кадри стрибка за ходом дуги) і пірнає
        if (t < 0.8) { x = lerp(-FX.w, sx, t / 0.8); y = sy; spr = anim('cut/foxWild-walk', 8, f, 10) ?? FX; }
        else if (t < 2.0) {
          const p = easeInOut(prog(t, 0.8, 2.0)), jf = animFrames('cut/foxWild-jump', 9);
          x = lerp(sx, cx - FX.w / 2, p); y = lerp(sy, top, p) - Math.sin(p * Math.PI) * 70;
          if (jf) spr = jf[Math.min(jf.length - 1, 2 + Math.floor(p * (jf.length - 3)))];
        }
        else if (t < 2.9) { const p = prog(t, 2.0, 2.9) ** 2; x = cx - FX.w / 2; y = lerp(top, rim + 6, p); }
        else show = false;
        bar.draw(ctx, bx, by, 2);
        if (show) { ctx.save(); if (t >= 2.0) { ctx.beginPath(); ctx.rect(0, 0, CW, rim + 2); ctx.clip(); } spr.draw(ctx, Math.round(x - (spr.w - FX.w) / 2), Math.round(y - (spr.h - FX.h)), 1); ctx.restore(); }
      } else bar.draw(ctx, bx, by, 2);
      // телепорт: веселкова спіраль над діжею і спалах
      if (t > 2.0 && t < 4.0) {
        const p = prog(t, 2.0, 4.0);
        for (let i = 0; i < 40; i++) {
          const a = i * 0.5 + spin, r = 6 + i * 1.6 * (0.4 + p);
          ctx.globalAlpha = 1 - p; px(ctx, Math.round(cx + Math.cos(a) * r), Math.round(rim - 4 - i * 2.2 * p + Math.sin(a) * r * 0.35), 3, RAINBOW[i % RAINBOW.length]);
        }
        ctx.globalAlpha = 1;
      }
      if (t > 2.9 && t < 3.6) { ctx.fillStyle = `rgba(255,250,230,${(1 - prog(t, 2.9, 3.6)) * 0.8})`; ctx.fillRect(0, 0, CW, CH); }
    },
  },
  /* Вовк знаходить уламок, ковтає і гикає (кадри анімації), а тоді зникає в спалаху. Слова — лише в чаті. */
  7: {
    bg: 'bg/franko-forest',
    fg: (ctx, f) => {
      const t = f * 0.15, W_ = still('cut/wolfWild-E'), sh = still('cut/shard'), sx = 300;
      const gulpAt = 2.0, frames = animFrames('cut/wolf-gulp', 13), gf = Math.floor((t - gulpAt) / 0.15);
      const eaten = t > gulpAt + 0.75;
      if (sh && !eaten) {
        const g = 0.5 + 0.5 * Math.sin(t * 8);
        ctx.globalAlpha = 0.35 + g * 0.35; ctx.fillStyle = '#f7e3a1'; ctx.fillRect(sx - 18, FEET - 40, 36, 36); ctx.globalAlpha = 1;
        sh.draw(ctx, sx - sh.w / 2, FEET - sh.h - 6, 1);
      }
      if (!W_) return;
      const end = sx - W_.w + 6;
      // іде ходою до уламка, тоді ковтає й гикає
      const wx = t < gulpAt ? lerp(-W_.w, end, prog(t, 0, gulpAt)) : end;
      const alpha = t > 4.2 ? 1 - prog(t, 4.2, 4.8) : 1;
      const fr = t >= gulpAt && frames ? frames[Math.min(frames.length - 1, gf)] : t < gulpAt ? anim('cut/wolfWild-walk', 8, f, 10) ?? W_ : W_;
      if (t < 4.8) { ctx.globalAlpha = alpha; fr.draw(ctx, Math.round(wx - (fr.w - W_.w) / 2), FEET - fr.h, 1); ctx.globalAlpha = 1; }
      if (t > 4.1 && t < 5.4) {
        const p = prog(t, 4.1, 5.4), r = p * 120;
        ctx.fillStyle = `rgba(255,246,210,${1 - p})`;
        for (let a = 0; a < 36; a++) { const an = (a / 36) * 6.28; ctx.fillRect(Math.round(wx + W_.w / 2 + Math.cos(an) * r), Math.round(FEET - W_.h / 2 + Math.sin(an) * r * 0.6), 4, 4); }
        ctx.fillStyle = `rgba(255,250,235,${(1 - p) * 0.7})`; ctx.fillRect(0, 0, CW, CH);
      }
    },
  },
  /* Присяга: олюднений Вовк у палатах Юнони */
  8: { bg: 'bg/juno-palace', fg: (ctx) => { stand(ctx, still('cut/wolf-oath') ?? still('cast/wolf-SE'), 110); stand(ctx, still('cut/juno-SW'), 300); } },
  /* Попелище Трої: Микита (попелястий) падає з неба поруч з Енеєм */
  9: {
    bg: 'bg/world-00',
    fg: (ctx, f) => {
      stand(ctx, enei(), 90);
      const p = easeOut(Math.min(1, f / 8)), fx = p < 1 ? stillFur('cut/fox-falling', '#8d8780') ?? fox('#8d8780') : fox('#8d8780');
      if (!fx) return;
      // летить з неба руками догори, приземлився — стоїть
      const drop = (1 - p) * (FEET + 20);
      stand(ctx, fx, 300, FEET - drop);
      if (p < 1) for (let k = 0; k < 3; k++) { ctx.fillStyle = '#e9e1cc'; ctx.fillRect(284 + k * 12, Math.round(FEET - drop - fx.h * 2 - 10 - k * 6), 2, 10); }
    },
  },
  /* Перший крок (сцена-інтерактив, артбук і сайт): редактор з enei.move(), «Запустити» пульсує — Еней робить крок до Микити */
  10: {
    bg: 'bg/world-00',
    fg: (ctx, f) => {
      const t = (f % 16) / 16, step = easeInOut(prog(t, 0.45, 0.75));
      stand(ctx, enei(), 90 + step * 48); stand(ctx, fox('#8d8780'), 300);
      ctx.fillStyle = 'rgba(20,27,23,.92)'; ctx.fillRect(236, 14, 150, 66);
      ctx.font = '600 15px "Fira Code", monospace'; ctx.fillStyle = '#e7e0cf';
      const typed = 'enei.move();'; ctx.fillText(typed.slice(0, Math.round(typed.length * prog(t, 0.05, 0.35))), 250, 40);
      const pulse = t < 0.42 ? Math.sin(f * 2) * 0.5 + 0.5 : 0;
      ctx.fillStyle = t > 0.4 && t < 0.46 ? '#b85a1f' : '#e2702b'; ctx.fillRect(250, 52, 64 + pulse * 4, 20);
      ctx.fillStyle = '#1a120b'; ctx.fillText('▶ Run', 256, 67);
    },
  },
  /* Сивілла (тур): у бібліотеці слів довкола неї ширяють дужки — Еней слухає */
  11: {
    bg: 'bg/library',
    fg: (ctx, f) => {
      ctx.font = 'bold 26px "Fira Code", monospace';
      [['{', 140, 70], ['}', 300, 64], ['(', 200, 40], [')', 248, 92]].forEach(([g, x, y], i) => {
        ctx.fillStyle = i % 2 ? '#9fe3ff' : '#f2d27a'; ctx.fillText(g as string, x as number, (y as number) + Math.round(Math.sin(f * 0.5 + i * 1.7) * 4));
      });
      stand(ctx, enei(), 100); stand(ctx, still('cut/sibyl-SW'), 300);
    },
  },
  /* Збори ватаги: Еней іде вулицею, троянці стають за ним */
  12: {
    bg: 'bg/world-00',
    fg: (ctx, f) => {
      const n = Math.min(4, Math.floor((f % 20) / 4)), walking = f % 20 < 18;
      for (let k = n - 1; k >= 0; k--) {
        const fr = crewFrames(CREW_ART[k], walking), s = fr ? fr[Math.floor(f * 2.6 + k) % fr.length] : null;
        stand(ctx, s, 300 - (k + 1) * 56, FEET);
      }
      const e = walking ? eneiFrames('walk')?.[Math.floor(f * 2.6) % 8] ?? enei() : enei();
      stand(ctx, e, 330, FEET);
    },
  },
  /* Відплиття: корабель з ватагою пливе до тріщини між світами; Микита на борту вже морський */
  13: {
    bg: 'bg/departure',
    fg: (ctx, f) => {
      const ship = stillFur('cut/ship-calm', '#3f7fd0');
      if (!ship) return;
      // пливе до тріщини між світами і спиняється перед нею
      const x = Math.min(250 - ship.w, -60 + f * 4), bob = f % 4 < 2 ? 0 : 1;
      ship.draw(ctx, Math.round(x), 214 - ship.h + bob, 1);
    },
  },
  /* «Ніч перед бурею» і «Заграва»: Сивілла приходить до Енея */
  100: { bg: 'bg/troy-night', fg: (ctx) => { stand(ctx, enei(), 100); stand(ctx, still('cut/sibyl-SW'), 300); } },
  101: { bg: 'bg/troy-dawn', fg: (ctx) => { stand(ctx, enei(), 100); stand(ctx, still('cut/sibyl-SW'), 300); } },
};

/** Новий арт заставки i або null — тоді малюється стара сцена. */
export function cutsceneArt(i: number): CutArt | null {
  const a = SCENES[i];
  if (!a || !enei()) return null;
  if (a.bg && !artImage(a.bg)) return null;
  return a;
}

/** Малює заставку i новим артом (фон і передній план); false — арту немає, тоді малюють стару сцену. */
export function paintCutscene(ctx: CanvasRenderingContext2D, i: number, f: number, speaker: string | null, oldBg?: () => void): boolean {
  const a = cutsceneArt(i);
  if (!a) return false;
  const img = a.bg ? artImage(a.bg) : null, key = img && a.bg ? a.bg.replace('bg/', '') : '', t = f * 0.26;
  if (img) paintArtBg(ctx, img, a.tint); else oldBg?.();
  // живий фон: back — під героями, front — поверх
  if (key) drawBgFx(ctx, key, t, 'back');
  a.fg(ctx, f, speaker);
  if (key) drawBgFx(ctx, key, t, 'front');
  return true;
}

/* ---------- сцена світу (картка мапи, дорога між світами, dev): новий фон, Еней, Микита і мешканець ---------- */

const W = ALL_WORLDS as { n: number; fox: string }[];

/**
 * Малює світ n новим артом; false — арту немає, тоді кличуть старий paintWorldArt.
 * foxFrom — колір Микити з попереднього світу: він перетікає в колір цього за p (0..1).
 */
export function paintWorldNew(ctx: CanvasRenderingContext2D, n: number, foxFrom: string | null, p = 1): boolean {
  const bg = worldBg(n), e = COLD_WORLDS.includes(n) ? eneiFrames('idle', false, true)?.[0] ?? enei() : enei();
  if (!bg || !e) return false;
  paintArtBg(ctx, bg);
  const T = performance.now() / 1000;
  if (!drawBgFx(ctx, `world-${String(n).padStart(2, '0')}`, T, 'back')) fxLayer(ctx, n, T, 'back');
  stand(ctx, e, 62);
  const to = fox(W[n].fox), from = foxFrom && foxFrom !== W[n].fox ? fox(foxFrom) : null;
  if (from && p < 1) { ctx.globalAlpha = 1 - p; stand(ctx, from, 172); ctx.globalAlpha = p; }
  stand(ctx, to, 172);
  ctx.globalAlpha = 1;
  // Еол висить у небі на хмарі, решта стоїть праворуч
  const npc = still(`npc/w${n}`);
  if (n === 1) stand(ctx, npc, 310, 130); else stand(ctx, npc, 322);
  if (!drawBgFx(ctx, `world-${String(n).padStart(2, '0')}`, T, 'front')) fxLayer(ctx, n, T, 'front');
  return true;
}
