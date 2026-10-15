import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

/*
 * Світ 3 — Ліс Лиса Микити, хеш-мапа. Головна думка світу: не шукати щоразу заново, а запам'ятовувати.
 * У вправах із `memory` світ показує «скриню»: що код поклав у Map чи Set.
 */

const nums = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });
const NUMS: [string, string] = ['nums', 'number[]'];

// Товари ярмарку мовою інтерфейсу.
const GOODS_EN: Record<string, string> = { 'мед': 'honey', 'сир': 'cheese', 'гриби': 'mushrooms', 'горіхи': 'nuts', 'ягоди': 'berries', 'риба': 'fish' };
const goods = (a: string[]): TestCase => ({
  get args() { return [uiLang() === 'en' ? a.map((x) => GOODS_EN[x] ?? x) : a]; },
  get label() { return JSON.stringify(uiLang() === 'en' ? a.map((x) => GOODS_EN[x] ?? x) : a); },
});

/* 1. Contains Duplicate */
const dup: Level = {
  id: 'forest.dup', world: 3, title: 'Двоє однакових', topic: 'Set: чи вже бачив',
  leetcode: lc(217, 'Contains Duplicate'),
  brief: '<b>Двоє однакових.</b> Чи є на ярмарку два однакові товари?',
  statement: [
    'На звіриному ярмарку все переплуталось: кажуть, хтось продає те саме двічі. <code>nums[i]</code> — номер товару на прилавку <code>i</code>.',
    'Поверни <code>true</code>, якщо якийсь номер трапляється хоча б двічі, і <code>false</code>, якщо всі різні.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк для кожного товару обходить увесь ярмарок ще раз. Ти ж просто <b>запам\'ятовуй</b>, що вже бачив.',
  ],
  tool: {
    name: 'Set — множина',
    text: [
      '<code>Set</code> — це мішок, у якому кожне значення лежить лише раз. <code>seen.add(x)</code> кладе значення, <code>seen.has(x)</code> миттєво каже, чи воно вже там.',
      'Миттєво — це головне: <code>has</code> не перебирає вміст, як <code>includes</code> у масиві, а одразу знаходить потрібне місце.',
    ],
    code: 'const seen = new Set();\nseen.add("лис");\nseen.has("лис");   // true\nseen.has("вовк");  // false',
  },
  talk: [
    { who: 'fox', text: 'Мій ліс! Я вдома! І я знову рудий, без жодної фарби.' },
    { who: 'lion', text: 'Микито? Той самий Микита? Ну-ну. Ярмарок тепер — суцільна плутанина: хтось продає двічі те саме.' },
    { who: 'fox', text: 'Енею, не бігай щоразу ярмарком по колу. Запам\'ятовуй, що вже бачив. Для цього є Set.' },
  ],
  quip: { who: 'lion', text: 'Хм. Швидко. Може, з тебе, Микито, таки буде толк.' },
  entry: 'containsDuplicate', observe: ['nums'], memory: true,
  starter: starter('containsDuplicate', [NUMS], 'boolean', ['Двоє однакових', 'true, якщо якийсь номер у nums трапляється двічі.'], '  const seen = new Set();\n  // Слово ладу пиши тут\n\n  return false;\n'),
  examples: [nums([1, 2, 3, 1]), nums([1, 2, 3, 4])],
  hidden: [nums([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), nums([5]), nums([7, 8, 9, 10, 8]), nums([-1, 0, 1])],
  big: { n: 10000, make: (n) => { const r = rng(217); const a = Array.from({ length: n }, (_, i) => i * 7 + 1); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return [a]; }, readBudget: (n) => 10 * n },
  reference: (a: number[]) => new Set(a).size !== a.length,
  wolf: { reads: (n) => n * (n - 1), code: 'function containsDuplicate(nums) {\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      if (nums[i] === nums[j]) return true;\n  return false;\n}' },
  hints: ['Що треба пам\'ятати, ідучи прилавками?', 'Для кожного товару: якщо він уже є в seen — повтор знайдено; інакше поклади його в seen.', 'for (x of nums) { if (seen.has(x)) return true; seen.add(x); } return false;'],
  solution: 'function containsDuplicate(nums: number[]): boolean {\n  const seen = new Set<number>();\n  for (let i = 0; i < nums.length; i++) {\n    if (seen.has(nums[i])) return true;\n    seen.add(nums[i]);\n  }\n  return false;\n}',
  lesson: 'Запам\'ятовуй побачене в Set: перевірка «чи вже було» стає миттєвою, і ярмарок обходиш лише раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Найходовіший товар: лічильник у Map */
function mostRef(a: string[]): string { const m = new Map<string, number>(); let best = a[0], bc = 0; for (const x of a) { const c = (m.get(x) ?? 0) + 1; m.set(x, c); if (c > bc) { bc = c; best = x; } } return best; }
const most: Level = {
  id: 'forest.most', world: 3, title: 'Найходовіший товар', topic: 'Map: лічильник',
  brief: '<b>Найходовіший товар.</b> Який товар на ярмарку продають найчастіше?',
  statement: [
    'Цар Лев хоче знати, чого на ярмарку найбільше. <code>goods</code> — список проданого за ранок, по одному запису на продаж.',
    'Поверни товар, який трапляється найчастіше. У тестах такий товар завжди один.',
    'Для кожного товару треба пам\'ятати не просто «чи бачив», а <b>скільки разів</b>. Тут знадобиться <code>Map</code>.',
  ],
  tool: {
    name: 'Map — ключ і значення',
    text: [
      '<code>Map</code> зберігає пари «ключ → значення». <code>m.set(k, v)</code> записує, <code>m.get(k)</code> дістає значення за ключем.',
      'Якщо ключа ще немає, <code>get</code> повертає <code>undefined</code>. Тому лічильник пишуть так: <code>(m.get(x) ?? 0) + 1</code> — «що було, або 0, плюс один».',
    ],
    code: 'const votes = new Map();\nfor (const name of ["лис", "вовк", "лис"]) {\n  votes.set(name, (votes.get(name) ?? 0) + 1);\n}\nvotes.get("лис");  // 2',
  },
  talk: [
    { who: 'lion', text: 'Щоб відновити торгівлю, мені треба знати, що звірі купують найбільше.' },
    { who: 'fox', text: 'Тут мало пам\'ятати, чи бачив. Треба рахувати, скільки разів. Скриня з комірками: на кожній комірці — товар і число.' },
  ],
  quip: { who: 'lion', text: 'Ось воно що. А я думав, усі купують лише мою славу.' },
  entry: 'mostSold', observe: ['goods'], memory: true,
  starter: starter('mostSold', [['goods', 'string[]']], 'string', ['Найходовіший товар', 'goods[i] — проданий товар. Поверни той, що трапляється найчастіше.'], '  const count = new Map();\n  // Слово ладу пиши тут\n\n  return goods[0];\n'),
  examples: [goods(['сир', 'мед', 'мед', 'гриби', 'мед', 'сир'])],
  hidden: [goods(['риба']), goods(['горіхи', 'ягоди', 'ягоди']), goods(['сир', 'риба', 'риба', 'сир', 'риба', 'мед', 'гриби']), goods(['ягоди', 'мед', 'мед', 'гриби', 'гриби', 'гриби'])],
  reference: mostRef,
  hints: ['Для кожного товару треба знати число. Де його тримати?', 'Пройди goods і збільшуй count для кожного товару. Потім знайди ключ з найбільшим числом.', 'count.set(x, (count.get(x) ?? 0) + 1); далі for (const [k, c] of count) — шукай найбільше c.'],
  solution: 'function mostSold(goods: string[]): string {\n  const count = new Map<string, number>();\n  for (let i = 0; i < goods.length; i++) count.set(goods[i], (count.get(goods[i]) ?? 0) + 1);\n  let best = goods[0], bestCount = 0;\n  for (const [item, c] of count) if (c > bestCount) { best = item; bestCount = c; }\n  return best;\n}',
  lesson: 'Map рахує за один прохід: ключ — що побачив, значення — скільки разів.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Valid Anagram */
const str2 = (s: string, t: string): TestCase => ({ args: [s, t], label: `${JSON.stringify(s)}, ${JSON.stringify(t)}` });
function anagramRef(s: string, t: string) { return s.length === t.length && [...s].sort().join('') === [...t].sort().join(''); }
const anagram: Level = {
  id: 'forest.anagram', world: 3, title: 'Ті самі речі', topic: 'Map: рахувати вгору й униз',
  leetcode: lc(242, 'Valid Anagram'),
  brief: '<b>Ті самі речі.</b> Чи складено два вози з тих самих речей, тільки в іншому порядку?',
  statement: [
    'Два вози приїхали на ярмарок. Кожна річ позначена літерою: <code>s</code> — вміст першого воза, <code>t</code> — другого.',
    'Поверни <code>true</code>, якщо у возах ті самі речі в тій самій кількості (порядок неважливий), інакше <code>false</code>. Літери — малі латинські, як на LeetCode.',
    'Можна рахувати для першого воза вгору, а для другого — вниз. Якщо все зійшлося в нуль, вози однакові.',
  ],
  tool: {
    name: 'лічильник угору й униз',
    text: [
      'Одна <code>Map</code> може рахувати в обидва боки: за кожну річ першого воза <code>+1</code>, за кожну річ другого <code>-1</code>.',
      'Якщо наприкінці кожен лічильник дорівнює 0, речей порівну. А якщо довжини різні, відповідь відома ще до лічби.',
    ],
    code: 'const bal = new Map();\nbal.set("а", (bal.get("а") ?? 0) + 1);  // взяли\nbal.set("а", (bal.get("а") ?? 0) - 1);  // віддали\nbal.get("а");  // 0 — порівну',
  },
  talk: [
    { who: 'lion', text: 'Ведмідь каже, що борсук підмінив його віз. Борсук каже, що там те саме, лише складене інакше.' },
    { who: 'fox', text: 'Порахуймо. Першому возу — плюс, другому — мінус. Хто бреше, того видасть ненуль.' },
  ],
  quip: { who: 'fox', text: 'Борсук чесний. Ведмідь просто погано складає вози.' },
  entry: 'isAnagram', observe: ['s', 't'], memory: true,
  starter: starter('isAnagram', [['s', 'string'], ['t', 'string']], 'boolean', ['Ті самі речі', 'true, якщо t складено з тих самих літер, що й s.']),
  examples: [str2('anagram', 'nagaram'), str2('rat', 'car')],
  hidden: [str2('a', 'ab'), str2('ab', 'ba'), str2('aacc', 'ccac'), str2('listen', 'silent'), str2('x', 'x')],
  reference: anagramRef,
  hints: ['Що треба знати про кожну літеру в обох возах?', 'Різні довжини — одразу false. Інакше: +1 за літери s, −1 за літери t; усі нулі — true.', 'for (i < s.length) { m.set(s[i], (m.get(s[i]) ?? 0) + 1); m.set(t[i], (m.get(t[i]) ?? 0) - 1); } перевір, що всі значення 0.'],
  solution: 'function isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false;\n  const bal = new Map<string, number>();\n  for (let i = 0; i < s.length; i++) {\n    bal.set(s[i], (bal.get(s[i]) ?? 0) + 1);\n    bal.set(t[i], (bal.get(t[i]) ?? 0) - 1);\n  }\n  for (const v of bal.values()) if (v !== 0) return false;\n  return true;\n}',
  lesson: 'Порівнювати вміст можна без сортування: рахуєш одне вгору, друге вниз і дивишся, чи все зійшлося в нуль.',
  scene: { type: 'array', skin: 'letter', mode: 'scan' },
};

/* 4. Two Sum */
const ts1 = (a: number[], t: number): TestCase => ({ args: [a, t], label: `${JSON.stringify(a)}, ${t}` });
function twoSumRef(a: number[], t: number) { const m = new Map<number, number>(); for (let i = 0; i < a.length; i++) { if (m.has(t - a[i])) return [m.get(t - a[i])!, i]; m.set(a[i], i); } return []; }
const twoSum: Level = {
  id: 'forest.twosum', world: 3, title: 'Двоє звірів', topic: 'Map: значення → номер',
  leetcode: lc(1, 'Two Sum'),
  brief: '<b>Двоє звірів.</b> Знайди двох звірів, чий товар разом коштує рівно <code>target</code>. Ряд не відсортований.',
  statement: [
    'Звірі стоять уздовж дороги як прийдеться: <code>nums[i]</code> — ціна товару звіра <code>i</code>. Сортувати ряд не можна — звірі образяться.',
    'Поверни номери двох різних звірів <code>[i, j]</code> (з нуля, у будь-якому порядку), чиї ціни разом дають <code>target</code>. Відповідь завжди одна.',
    'Обмеження: <code>n ≤ 10⁴</code>. Два вказівники з Карфагена тут не допоможуть: ряд не відсортований. Зате можна пам\'ятати, хто вже стояв і де.',
  ],
  tool: {
    name: 'Map: що шукаю → де бачив',
    text: [
      'Для кожного звіра ти знаєш, якої ціни йому бракує: <code>target - nums[i]</code>. Питання лише в тому, чи такий звір уже траплявся.',
      'Тримай <code>Map</code> «ціна → номер» тих, кого вже пройшов. Спершу питаєш <code>has</code>, а вже потім кладеш поточного — тоді звір не стане парою сам собі.',
    ],
    code: 'const where = new Map();\nwhere.set(40, 0);       // ціна 40 стоїть на місці 0\nwhere.has(100 - 60);    // true: є пара для 60\nwhere.get(40);          // 0',
  },
  talk: [
    { who: 'lion', text: 'Покупець хоче рівно на свою суму — з двох прилавків. Звірі стоять хто де, і пересувати їх я не дозволю.' },
    { who: 'wolf', text: 'А я спитаю кожну пару! Кожного з кожним! Ой… а чого всі ховаються?' },
    { who: 'fox', text: 'Бо пам\'ятають, що ти Неситий. Енею, для кожного звіра знаємо, кого йому бракує. Лишилось пам\'ятати, кого ми вже бачили.' },
  ],
  quip: { who: 'wolf', text: 'Знов без мене впоралися. Піду хоч понюхаю ті прилавки.' },
  entry: 'twoSum', observe: ['nums', null], memory: true,
  starter: starter('twoSum', [NUMS, ['target', 'number']], 'number[]', ['Двоє звірів', 'Поверни [i, j] (з нуля), де nums[i] + nums[j] === target.'], '  const where = new Map();\n  // Слово ладу пиши тут\n\n  return [];\n'),
  examples: [ts1([2, 7, 11, 15], 9), ts1([3, 2, 4], 6)],
  hidden: [ts1([3, 3], 6), ts1([-1, -2, -3, -4, -5], -8), ts1([0, 4, 3, 0], 0), ts1([5, 75, 25], 100)],
  big: {
    n: 10000,
    // усі ціни парні, крім двох у кінці ряду: пара з непарною сумою єдина
    make: (n) => { const r = rng(1); const a = Array.from({ length: n }, (_, i) => 2 * i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } const p = n - 3, q = n - 1; a[p] = 2 * n + 1; a[q] = 2 * n + 2; return [a, a[p] + a[q]]; },
    readBudget: (n) => 10 * n,
  },
  reference: twoSumRef,
  check: (tc, r) => {
    const [a, t] = tc.args as [number[], number];
    const v = r.value as number[];
    if (!Array.isArray(v) || v.length !== 2) return L(`очікували пару номерів, отримали ${JSON.stringify(v)}`, `expected a pair of indices, got ${JSON.stringify(v)}`);
    const [i, j] = v;
    if (!(Number.isInteger(i) && Number.isInteger(j) && i !== j && i >= 0 && j >= 0 && i < a.length && j < a.length)) return L(`номери мають бути різними, з нуля, у межах масиву; отримали ${JSON.stringify(v)}`, `indices must be different, zero-based and inside the array; got ${JSON.stringify(v)}`);
    return a[i] + a[j] === t || `${a[i]} + ${a[j]} ≠ ${t}`;
  },
  wolf: { reads: (n) => Math.round(0.99 * n * n), code: 'function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      if (nums[i] + nums[j] === target) return [i, j];\n  return [];\n}' },
  hints: ['Для звіра з ціною x — якої ціни бракує до target?', 'Йди рядом; для кожного звіра перевір, чи в where уже є target − nums[i]. Якщо ні — поклади nums[i] → i.', 'for (i) { const need = target - nums[i]; if (where.has(need)) return [where.get(need), i]; where.set(nums[i], i); }'],
  solution: 'function twoSum(nums: number[], target: number): number[] {\n  const where = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (where.has(need)) return [where.get(need)!, i];\n    where.set(nums[i], i);\n  }\n  return [];\n}',
  lesson: 'Не шукай пару — запитай пам\'ять: для кожного знаєш, кого бракує, а Map миттєво каже, чи він уже був.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Group Anagrams */
const words = (a: string[]): TestCase => ({ args: [a], label: JSON.stringify(a) });
const norm = (g: unknown) => Array.isArray(g) ? g.map((x) => (Array.isArray(x) ? [...x].map(String).sort() : [String(x)])).map((x) => JSON.stringify(x)).sort() : null;
function groupRef(strs: string[]) { const m = new Map<string, string[]>(); for (const s of strs) { const k = [...s].sort().join(''); m.set(k, [...(m.get(k) ?? []), s]); } return [...m.values()]; }
const groups: Level = {
  id: 'forest.groups', world: 3, title: 'Родини звірів', topic: 'Map: ключ-підпис',
  leetcode: lc(49, 'Group Anagrams'),
  brief: '<b>Родини звірів.</b> Розклади слова на групи: в одній групі — слова з тих самих літер.',
  statement: [
    'На ярмарку звірі записуються родинами, але писар переплутав порядок літер у назвах. Слова з тих самих літер — одна родина.',
    'Поверни масив груп: кожна група — масив слів з однаковим набором літер. Порядок груп і слів у групі неважливий.',
    'Потрібен <b>підпис</b>, однаковий для всієї родини. Наприклад, літери слова, відсортовані за абеткою: <code>"eat"</code> і <code>"tea"</code> обидва дають <code>"aet"</code>.',
  ],
  tool: {
    name: 'ключ-підпис',
    text: [
      'Ключем у <code>Map</code> може бути будь-який рядок, навіть зроблений тобою. Якщо у всіх «своїх» він однаковий, Map сам збере їх разом.',
      '<code>[...word].sort().join("")</code> — розібрати слово на літери, впорядкувати й зібрати назад. Значенням зробимо масив слів родини.',
    ],
    code: 'const fam = new Map();\nconst key = [..."tea"].sort().join("");  // "aet"\nfam.set(key, [...(fam.get(key) ?? []), "tea"]);\n[...fam.values()];  // [["tea"]]',
  },
  talk: [
    { who: 'lion', text: 'Писар знову напартачив: «tea», «eat», «ate»… Хто з ким родич — не розбереш.' },
    { who: 'fox', text: 'У кожної родини той самий набір літер. Зробимо з нього підпис, а скриня сама розкладе всіх по комірках.' },
  ],
  quip: { who: 'lion', text: 'Родини разом, писар — на вихідний. Без права повернення.' },
  entry: 'groupAnagrams', observe: ['strs'], memory: true,
  starter: starter('groupAnagrams', [['strs', 'string[]']], 'string[][]', ['Родини звірів', 'Згрупуй слова з однаковим набором літер. Порядок неважливий.'], '  const fam = new Map();\n  // Слово ладу пиши тут\n\n  return [...fam.values()];\n'),
  examples: [words(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])],
  hidden: [words(['']), words(['a']), words(['ab', 'ba', 'abc', 'cab', 'bca', 'x']), words(['aa', 'a', 'aa'])],
  reference: groupRef,
  check: (tc, r) => {
    const want = norm(tc.expected), got = norm(r.value);
    return (got && JSON.stringify(got) === JSON.stringify(want)) || L(`очікували групи ${JSON.stringify(tc.expected)}, отримали ${JSON.stringify(r.value)}`, `expected the groups ${JSON.stringify(tc.expected)}, got ${JSON.stringify(r.value)}`);
  },
  hints: ['Що однакове у слів однієї родини?', 'Підпис слова — його літери за абеткою. Клади слово в Map за підписом.', 'for (w of strs) { const k = [...w].sort().join(""); fam.set(k, [...(fam.get(k) ?? []), w]); }'],
  solution: 'function groupAnagrams(strs: string[]): string[][] {\n  const fam = new Map<string, string[]>();\n  for (let i = 0; i < strs.length; i++) {\n    const key = [...strs[i]].sort().join("");\n    const group = fam.get(key) ?? [];\n    group.push(strs[i]);\n    fam.set(key, group);\n  }\n  return [...fam.values()];\n}',
  lesson: 'Придумай ключ, однаковий для всіх «своїх», — і Map згрупує їх сам.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 6. Top K Frequent Elements */
const tk = (a: number[], k: number): TestCase => ({ args: [a, k], label: `${JSON.stringify(a)}, ${k}` });
function topKRef(a: number[], k: number) { const m = new Map<number, number>(); for (const x of a) m.set(x, (m.get(x) ?? 0) + 1); return [...m].sort((p, q) => q[1] - p[1]).slice(0, k).map((p) => p[0]); }
const topK: Level = {
  id: 'forest.topk', world: 3, final: true, title: 'Ходовий товар', topic: 'Map і сортування підсумків',
  leetcode: lc(347, 'Top K Frequent Elements'),
  brief: '<b>Ходовий товар.</b> Знайди <code>k</code> товарів, які продають найчастіше, щоб Цар Лев відновив торгівлю.',
  statement: [
    'За день ярмарку записано продажі: <code>nums[i]</code> — номер проданого товару. Цар Лев хоче знати <code>k</code> найходовіших.',
    'Поверни <code>k</code> різних номерів, що трапляються найчастіше, у будь-якому порядку. Відповідь у тестах завжди однозначна.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк для кожного товару перераховує весь ярмарок заново. Тобі вистачить одного проходу й скрині.',
  ],
  tool: {
    name: 'сортувати підсумки, а не ярмарок',
    text: [
      'Спершу один прохід: <code>Map</code> «товар → скільки разів». Далі сортуєш уже не весь ярмарок, а короткий список підсумків.',
      '<code>[...count]</code> дає масив пар <code>[товар, число]</code>. <code>.sort((a, b) =&gt; b[1] - a[1])</code> ставить найчастіші першими, <code>.slice(0, k)</code> бере перші <code>k</code>.',
    ],
    code: 'const count = new Map([["мед", 3], ["сир", 5], ["риба", 1]]);\n[...count]\n  .sort((a, b) => b[1] - a[1])\n  .slice(0, 2)\n  .map((p) => p[0]);   // ["сир", "мед"]',
  },
  talk: [
    { who: 'lion', text: 'Останнє. Скажи мені, що звірі купують найчастіше, — і ярмарок знову запрацює. А тебе, Микито, на хвилину зроблю канцлером.' },
    { who: 'wolf', text: 'Для кожного товару пройду весь ярмарок! Порахую! Ще раз! І ще!' },
    { who: 'fox', text: 'Енею, один прохід — і скриня знатиме все. А сортуватимемо вже коротенький список підсумків, а не весь ліс.' },
  ],
  quip: { who: 'lion', text: 'Ярмарок працює. Микито, ти канцлер! …Хвилина минула. Але дякую.' },
  entry: 'topKFrequent', observe: ['nums', null], memory: true,
  starter: starter('topKFrequent', [NUMS, ['k', 'number']], 'number[]', ['Ходовий товар', 'Поверни k номерів, що трапляються в nums найчастіше (порядок неважливий).'], '  const count = new Map();\n  // Слово ладу пиши тут\n\n  return [];\n'),
  examples: [tk([1, 1, 1, 2, 2, 3], 2), tk([1], 1)],
  hidden: [tk([4, 4, 5, 5, 5, 6], 1), tk([7, 7, 8, 9, 9, 9, 8, 8, 8], 2), tk([-1, -1, 2], 1), tk([3, 0, 1, 0], 1), tk([5, 6, 7], 3)],
  big: {
    n: 10000,
    // десять ходових товарів з різною кількістю продажів, решта — по одному разу
    make: (n) => { const r = rng(347); const a: number[] = []; for (let t = 0; t < 10; t++) for (let c = 0; c < 400 - t * 30; c++) a.push(t); let u = 100; while (a.length < n) a.push(u++); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return [a, 5]; },
    readBudget: (n) => 10 * n,
  },
  reference: topKRef,
  check: (tc, r) => {
    const want = [...(tc.expected as number[])].sort((a, b) => a - b), got = Array.isArray(r.value) ? [...(r.value as number[])].sort((a, b) => a - b) : r.value;
    return JSON.stringify(got) === JSON.stringify(want) || L(`очікували ${JSON.stringify(want)} (порядок неважливий), отримали ${JSON.stringify(r.value)}`, `expected ${JSON.stringify(want)} (any order), got ${JSON.stringify(r.value)}`);
  },
  wolf: { reads: (n) => n * n, code: 'function topKFrequent(nums, k) {\n  const freq = [];\n  for (let i = 0; i < nums.length; i++) {\n    let c = 0;\n    for (let j = 0; j < nums.length; j++) if (nums[j] === nums[i]) c++;\n    if (!freq.some((p) => p[0] === nums[i])) freq.push([nums[i], c]);\n  }\n  return freq.sort((a, b) => b[1] - a[1]).slice(0, k).map((p) => p[0]);\n}' },
  hints: ['Що треба знати про кожен товар, щоб вибрати найходовіші?', 'Один прохід — Map «товар → скільки». Потім відсортуй пари з Map за числом і візьми перші k.', 'for (x of nums) count.set(x, (count.get(x) ?? 0) + 1); return [...count].sort((a, b) => b[1] - a[1]).slice(0, k).map((p) => p[0]);'],
  solution: 'function topKFrequent(nums: number[], k: number): number[] {\n  const count = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) count.set(nums[i], (count.get(nums[i]) ?? 0) + 1);\n  return [...count].sort((a, b) => b[1] - a[1]).slice(0, k).map((p) => p[0]);\n}',
  lesson: 'Спершу один прохід у пам\'ять, потім працюй з підсумками: так ярмарок на десять тисяч записів зводиться до короткого списку.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const forest: World = {
  n: 3, name: 'Ліс Лиса Микити', song: 'Пісня II · Гостини', topic: 'Hash Map, підрахунок', fox: '#e2702b',
  host: { who: 'Цар Лев', line: 'Хто що продає — ніхто не пам\'ятає. Наведи лад, і Микита знову буде канцлером. На хвилинку.' },
  motif: 'chest', trick: 'Скриня з комірками: хеш-мапа',
  levels: [dup, most, anagram, twoSum, groups, topK],
};
