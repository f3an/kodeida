/*
 * Сцени, що вшивають «Абетку» в сюжет. Хронологія:
 *   Олімп → Зевс дає Енеєві в провідниці Сивіллу (сцени 0–5)
 *   → «Ніч перед бурею»: Сивілла приходить до Енея в ще цілу Трою й починає вчити його абетки слова ладу
 *   → «Абетка» (казки на сувої)
 *   → «Заграва»: уламки Писанки падають, Троя горить → Микита, Вовк, попелище (сцени 6–9) → світ 0.
 * Хто обрав «трохи вмію» чи «хочу задач», абетку вже знає: Сивілла вчила Енея за кадром.
 */
import { Spr, sky, rect, ell, poly, hash, SW, SH_, makeSibyl, makeEnei } from '../world/sprites.js';

export interface StoryScene {
  kind: string;
  title: string;
  narr: string;
  lines: [string, string][];
  en: { title: string; narr: string; lines: [string, string][] };
  bg: (sp: InstanceType<typeof Spr>, f: number) => void;
  fg?: (ctx: CanvasRenderingContext2D, f: number, s: number) => void;
}

/** Троя вночі, ще ціла. dawn — заграва пожежі на світанку (0..1). */
export function paintTroyNight(sp: InstanceType<typeof Spr>, f: number, dawn = 0) {
  sky(sp, dawn ? ['#2a1420', '#5a2228', '#a8442a', '#e07a2a'] : ['#0b1024', '#141c38', '#1e2a4a', '#2a3658'], 0, 96);
  if (!dawn) for (let i = 0; i < 46; i++) {
    const x = Math.floor(hash(i, 7) * SW), y = Math.floor(hash(i, 8) * 70);
    if ((f + i) % 9 !== 0) sp.set(x, y, i % 4 ? '#c9d6e4' : '#fff6d0');
  }
  // місяць або дим
  if (!dawn) sp.fill(ell(182, 40, 7, 7), '#f3ecd0');
  else for (let k = 0; k < 6; k++) sp.fill(ell(40 + k * 26, 30 + Math.sin(f * 0.2 + k) * 3, 14, 6), k % 2 ? '#4a2a2a' : '#5a3434');
  // мури й вежі
  const wall = dawn ? '#5a3a30' : '#3a3a4e', wallS = dawn ? '#43281f' : '#2a2a3a';
  sp.fill(rect(0, 70, SW, 26), (x: number) => (x % 12 < 2 ? wallS : wall));
  for (let x = 0; x < SW; x += 8) sp.fill(rect(x, 66, 5, 4), wall);
  for (const [tx, th] of [[18, 34], [70, 44], [128, 38], [176, 30]]) {
    sp.fill(rect(tx, 70 - th + 26, 16, th), wall);
    sp.fill(poly([[tx - 2, 70 - th + 26], [tx + 18, 70 - th + 26], [tx + 8, 70 - th + 12]]), dawn ? '#7a2a20' : '#6a3a3a');
    // вікна: тепле світло; на світанку деякі вже палають
    for (let k = 0; k < 3; k++) {
      const lit = dawn ? (f + k + tx) % 4 < 2 : (k + tx) % 3 !== 0;
      if (lit) sp.fill(rect(tx + 4 + (k % 2) * 6, 70 - th + 32 + k * 8, 2, 3), dawn ? '#ffb040' : '#f7d26a');
    }
  }
  // земля
  for (let y = 96; y < SH_; y++) for (let x = 0; x < SW; x++) sp.set(x, y, (x * 7 + y * 3) % 13 === 0 ? (dawn ? '#3a2a22' : '#232a24') : (dawn ? '#4a3428' : '#2c342c'));
  // світанкові іскри
  if (dawn) for (let i = 0; i < 18; i++) {
    const x = Math.floor(hash(i, 30) * SW), y = Math.floor(((hash(i, 31) * 90) - f * 1.5 - i * 3) % 90 + 90) % 90;
    sp.set(x, y, i % 3 ? '#f08a2a' : '#f7d26a');
  }
}

const SIBYL = makeSibyl();
const ENEI = makeEnei(2);

const pair = (ctx: CanvasRenderingContext2D, f: number, s: number) => {
  ENEI.draw(ctx, 30 * s, (SH_ - 74) * s, s);
  SIBYL.draw(ctx, 128 * s, (SH_ - 72 + Math.round(Math.sin(f * 0.5))) * s, s);
};

export const STORY: Record<number, StoryScene> = {
  100: {
    kind: 'заставка', title: 'Ніч перед бурею',
    narr: 'Троя ще спить і нічого не знає про шторм на Олімпі. До Енея приходить Сивілла — провідниця, яку обіцяв Зевс.',
    lines: [
      ['Сивілла', 'Енею, прокинься. Скоро тобі знадобиться слово ладу — точне слово, якого слухає світ.'],
      ['Еней', 'Я воїн, а не писар. Яке ще слово?'],
      ['Сивілла', 'Почнемо з абетки. А вчитимемось на казках: у них лад найпростіший.'],
      ['Еней', 'На казках? Ну, хай буде. Аби до ранку встигли.'],
    ],
    en: {
      title: 'The night before the storm',
      narr: 'Troy is still asleep and knows nothing of the storm on Olympus. The Sibyl comes to Aeneas — the guide Zeus promised.',
      lines: [
        ['Sibyl', 'Wake up, Aeneas. Soon you will need the word of order — the exact word the world obeys.'],
        ['Aeneas', 'I’m a warrior, not a scribe. What word?'],
        ['Sibyl', 'We start with the ABC. And we’ll learn on fairy tales: their order is the simplest.'],
        ['Aeneas', 'Fairy tales? Fine. As long as we finish by morning.'],
      ],
    },
    bg: (sp, f) => paintTroyNight(sp, f),
    fg: pair,
  },
  101: {
    kind: 'заставка', title: 'Заграва',
    narr: 'Абетку вивчено. А на світанку над Троєю здіймається заграва: уламки Писанки вже падають на землю.',
    lines: [
      ['Сивілла', 'Чуєш? Почалося. Тепер слово ладу — твоя зброя.'],
      ['Еней', 'А ти?'],
      ['Сивілла', 'Я буду поруч. Покличеш — підкажу.'],
    ],
    en: {
      title: 'The glow',
      narr: 'The ABC is learned. But at dawn a glow rises over Troy: shards of the Pysanka are already falling to the ground.',
      lines: [
        ['Sibyl', 'Do you hear it? It has begun. Now the word of order is your weapon.'],
        ['Aeneas', 'And you?'],
        ['Sibyl', 'I’ll be near. Call me, and I’ll give you a hint.'],
      ],
    },
    bg: (sp, f) => paintTroyNight(sp, f, 1),
    fg: pair,
  },
};

/** Вступ шляхом «з нуля»: Олімп → «Ніч перед бурею» → Абетка. */
export const ABC_INTRO = [0, 1, 2, 3, 4, 5, 100];
/** Після Абетки — до Трої: «Заграва» → Микита, Вовк, попелище → світ 0. */
export const ABC_TO_TROY = [101, 6, 7, 8, 9];
/** «Хочу задач»: увесь вступ, а тоді одразу «Відплиття» до світу 1. */
export const ALGO_INTRO = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13];
