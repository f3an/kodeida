import type { CallResult, TestCase } from './types.ts';

/** Як світ показує рівень. */
export type SceneSpec =
  | { type: 'street' }                                                     // світ 0: команди Енея
  | { type: 'array'; skin: 'sack' | 'ship' | 'sail' | 'post' | 'letter' | 'stone'; mode: 'scan' | 'pointers' | 'area' };

export interface Level {
  id: string;
  world: number;
  title: string;
  /** Фінальна задача світу чи підвідна вправа. */
  final?: boolean;
  /** Чого вчить: «цикл», «два вказівники»… */
  topic: string;
  leetcode?: { n: number; title: string; slug: string };
  /** Короткий опис над редактором (дозволено <b> і <code>). */
  brief: string;
  /** Умова: абзаци, дозволено <b> і <code>. */
  statement: string[];
  /** Новий інструмент вправи: назва, пояснення простими словами й мініприклад (не відповідь). */
  tool?: Tool;
  /** Розмова на вході у вправу: репліки йдуть по черзі, поки вправу не пройдено. */
  talk?: Line[];
  /** Репліка після першої перемоги: жарт або слово того, хто приєднався до ватаги. */
  quip?: Line;
  entry: string;
  /** Назви аргументів-масивів і рядків, за якими стежить світ (null — не стежити). */
  observe: (string | null)[];
  starter: { ts: string; js: string };
  examples: TestCase[];
  hidden: TestCase[];
  big?: { n: number; make: (n: number) => unknown[]; readBudget: (n: number) => number };
  /** Еталон для очікуваних відповідей (якщо в тесті немає expected). */
  reference?: (...args: never[]) => unknown;
  /** Масив-аргумент, який треба змінити на місці; тоді порівнюється він, а не відповідь. */
  inPlace?: number;
  /** Власна перевірка: true або пояснення, що не так. */
  check?: (tc: TestCase, r: CallResult) => true | string;
  forbid?: string[];
  /** Світ 3: показувати «скриню» з тим, що код кладе в Map і Set. */
  memory?: boolean;
  /** Вовк: скільки читань робить перебір і як він виглядає. */
  wolf?: { reads: (n: number) => number; code: string };
  hints: [string, string, string];
  /** Лисяче рішення — для самоперевірки (scripts/selftest.mjs). */
  solution: string;
  /** Що сказати після розв'язку: суть хитрощі одним реченням. */
  lesson: string;
  scene: SceneSpec;
}

/** Хто говорить у діалогах вправ. */
export type Voice = 'enei' | 'fox' | 'sibyl' | 'anchises' | 'warrior' | 'sailor' | 'woman' | 'eol' | 'dido' | 'juno' | 'wolf' | 'lion';
export interface Line { who: Voice; text: string }

export interface Tool {
  name: string;
  /** Пояснення, дозволено <b> і <code>. */
  text: string[];
  code: string;
}

export interface World {
  n: number;
  name: string;
  song: string;
  topic: string;
  /** Колір Микити в цьому світі. */
  fox: string;
  /** Хто зустрічає героїв і що каже на початку. */
  host: { who: string; line: string };
  /** Візерунок на вишиванці й запис у Книзі хитрощів після фінальної задачі. */
  motif?: string;
  trick?: string;
  levels: Level[];
}

/** Детермінований генератор для великих тестів. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
