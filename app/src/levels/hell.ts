import { rng, type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

/*
 * Світ 8 — Пекло (Енеїда, частина 3): рекурсія й backtracking.
 * Кожен рівень пекла — рекурсивний виклик, Анхіз на дні — базовий випадок, а дорога назад — розгортання стеку.
 * У backtracking-вправах порядок відповідей неважливий: перевірка впорядковує їх сама.
 */

const one = (a: unknown): TestCase => ({ args: [a], label: JSON.stringify(a) });
const pair = (a: unknown, b: unknown): TestCase => ({ args: [a, b], label: `${JSON.stringify(a)}, ${b}` });

// Кола пекла мовою інтерфейсу.
const CIRCLE_EN: Record<string, string> = { 'Брама': 'Gate', 'Лімб': 'Limbo', 'Болото': 'Swamp', 'Вогонь': 'Fire', 'Лід': 'Ice', 'Котли': 'Cauldrons' };
const circles = (a: string[]): TestCase => ({
  get args() { return [uiLang() === 'en' ? a.map((x) => CIRCLE_EN[x] ?? x) : a]; },
  get label() { return JSON.stringify(uiLang() === 'en' ? a.map((x) => CIRCLE_EN[x] ?? x) : a); },
});

/** Набір наборів без огляду на порядок: впорядкувати кожен набір, а потім увесь список. */
const canon = (v: unknown) => (Array.isArray(v) ? v.map((x) => (Array.isArray(x) ? JSON.stringify([...x].sort((a, b) => a - b)) : JSON.stringify(x))).sort() : null);
const setCheck = (tc: TestCase, r: CallResult): true | string => {
  const want = canon(tc.expected), got = canon(r.value);
  if (got && JSON.stringify(got) === JSON.stringify(want)) return true;
  const n = Array.isArray(r.value) ? r.value.length : 0, m = (tc.expected as unknown[]).length;
  return L(`очікували ${m} наборів (порядок неважливий), отримали ${n}: ${JSON.stringify(r.value).slice(0, 80)}`, `expected ${m} sets (any order), got ${n}: ${JSON.stringify(r.value).slice(0, 80)}`);
};
/** Перестановки: порядок усередині важливий, а порядок самих перестановок — ні. */
const permCheck = (tc: TestCase, r: CallResult): true | string => {
  const norm = (v: unknown) => (Array.isArray(v) ? v.map((x) => JSON.stringify(x)).sort() : null);
  const got = norm(r.value), want = norm(tc.expected);
  if (got && JSON.stringify(got) === JSON.stringify(want)) return true;
  const n = Array.isArray(r.value) ? r.value.length : 0, m = (tc.expected as unknown[]).length;
  return L(`очікували ${m} порядків, отримали ${n}: ${JSON.stringify(r.value).slice(0, 80)}`, `expected ${m} orders, got ${n}: ${JSON.stringify(r.value).slice(0, 80)}`);
};

/* 1. Рекурсія: вниз і назад */
function descentRef(a: string[]) { return [...a, ...a.slice().reverse()]; }
const descent: Level = {
  id: 'hell.descent', world: 8, title: 'Вниз і назад', topic: 'рекурсія: базовий випадок',
  brief: '<b>Вниз і назад.</b> Спустися всіма колами пекла до Анхіза і повернися тим самим шляхом. Запиши дорогу.',
  statement: [
    'Сивілла веде Енея до батька. <code>circles</code> — кола пекла згори донизу. На дні — Анхіз.',
    'Поверни дорогу: кола вниз по черзі, а потім ті самі кола назад угору. Для <code>["Лімб", "Вогонь"]</code> — <code>["Лімб", "Вогонь", "Вогонь", "Лімб"]</code>.',
    'Напиши це <b>рекурсією</b>: функція, що спускається на одне коло й кличе саму себе для решти. Дорога назад вийде сама — коли виклики повертатимуться.',
  ],
  tool: {
    name: 'рекурсія',
    text: [
      'Рекурсивна функція кличе саму себе для меншої задачі. Обов\'язково потрібен <b>базовий випадок</b> — коли далі кликати не треба (дно пекла). Без нього виклики не закінчаться.',
      'Що написано <b>до</b> виклику, стається на шляху вниз; що <b>після</b> — на шляху назад, коли глибші виклики вже повернулися.',
    ],
    code: 'function count(n) {\n  if (n === 0) return [];          // дно: базовий випадок\n  return [n, ...count(n - 1), n];  // вниз — і назад\n}\ncount(2);  // [2, 1, 1, 2]',
  },
  talk: [
    { who: 'sibyl', text: 'Пекло — як колодязь: кожне коло веде до наступного, а на дні чекає твій батько. Спускатимемося по одному колу.' },
    { who: 'fox', text: 'А назад? Я дорогу не запам\'ятовую, у мене лапи.' },
    { who: 'sibyl', text: 'Назад пам\'ятатиме сам спуск. Кожен крок униз чекає, доки повернеться глибший, — і веде нас угору.' },
  ],
  quip: { who: 'anchises', text: 'Сину! Ти дійшов до самого дна — і знаєш дорогу назад. Так і рекурсія: головне — знати, де зупинитися.' },
  entry: 'descent', observe: ['circles'],
  starter: starter('descent', [['circles', 'string[]']], 'string[]', ['Вниз і назад', 'Поверни кола вниз, а потім ті самі кола назад угору.'], '  const go = (i) => {\n    // Слово ладу пиши тут\n    return [];\n  };\n  return go(0);\n'),
  examples: [circles(['Лімб', 'Болото', 'Вогонь'])],
  hidden: [circles([]), circles(['Брама']), circles(['Лімб', 'Болото', 'Вогонь', 'Лід', 'Котли'])],
  reference: descentRef,
  hints: ['Що повернути, коли кіл більше немає?', 'go(i): якщо i — кінець, поверни []. Інакше [коло i, …go(i + 1), коло i].', 'const go = (i) => (i === circles.length ? [] : [circles[i], ...go(i + 1), circles[i]]);'],
  solution: 'function descent(circles: string[]): string[] {\n  const go = (i: number): string[] => {\n    if (i === circles.length) return [];\n    return [circles[i], ...go(i + 1), circles[i]];\n  };\n  return go(0);\n}',
  lesson: 'Рекурсія = базовий випадок + крок, що зводить задачу до меншої. Що до виклику — по дорозі вниз, що після — на зворотному шляху.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Boats to Save People */
function boatsRef(p: number[], limit: number) { const a = p.slice().sort((x, y) => x - y); let i = 0, j = a.length - 1, n = 0; while (i <= j) { if (a[i] + a[j] <= limit) i++; j--; n++; } return n; }
const boats: Level = {
  id: 'hell.boats', world: 8, title: 'Човен Харона', topic: 'жадібно: найважчий із найлегшим',
  leetcode: lc(881, 'Boats to Save People'),
  brief: '<b>Човен Харона.</b> Човен бере щонайбільше двох душ і має обмеження ваги. Скільки найменше рейсів?',
  statement: [
    'Харон перевозить душі через Стікс. <code>people[i]</code> — вага душі <code>i</code>, <code>limit</code> — скільки витримує човен. За раз — щонайбільше двоє.',
    'Поверни найменшу кількість рейсів, щоб перевезти всіх. Кожна душа окремо вміщається в човен.',
    'Обмеження: <code>n ≤ 10⁴</code>. Хитрість з Карфагена: впорядкуй за вагою й саджай найважчого з найлегшим, якщо вміщаються.',
  ],
  tool: {
    name: 'сортування + два вказівники',
    text: [
      'Відсортуй <code>people</code>. Найважча душа <code>people[j]</code> пливе в кожному разі; питання лише, чи візьме вона з собою найлегшу <code>people[i]</code>.',
      'Вміщаються разом — обидва вказівники рухаються. Ні — найважча пливе сама. Рейс зараховано в обох випадках.',
    ],
    code: '// [1, 2, 2, 3], limit = 3\n// 3 + 1 > 3 → 3 сама        (рейс 1)\n// 2 + 1 ≤ 3 → 2 і 1 разом   (рейс 2)\n// 2 сама                    (рейс 3)',
  },
  talk: [
    { who: 'charon', text: 'Човен на двох, і вага обмежена. Хто з ким пливе — вирішуй сам. Тільки швидше, черга до Аїду не зменшується.' },
    { who: 'fox', text: 'Найважчий пливе завжди. Саджаймо до нього найлегшого, якщо човен витримає. Це ж Карфагенська хитрість, тільки в пеклі.' },
  ],
  quip: { who: 'charon', text: 'Жодного зайвого рейсу. Хм. А плату ти мені, троянцю, однаково винен.' },
  entry: 'numRescueBoats', observe: ['people', null],
  starter: starter('numRescueBoats', [['people', 'number[]'], ['limit', 'number']], 'number', ['Човен Харона', 'people[i] — вага, limit — вантажність човна (до двох душ). Поверни найменше рейсів.'], '  let boats = 0;\n  // Слово ладу пиши тут\n\n  return boats;\n'),
  examples: [pair([1, 2], 3), pair([3, 2, 2, 1], 3)],
  hidden: [pair([3, 5, 3, 4], 5), pair([5], 5), pair([1, 1, 1, 1], 2), pair([2, 4, 1, 3], 5), pair([5, 1, 4, 2], 6)],
  big: { n: 10000, make: (n) => { const r = rng(881); return [Array.from({ length: n }, () => 1 + Math.floor(r() * 100)), 100]; }, readBudget: (n) => 40 * n },
  reference: boatsRef,
  wolf: { reads: (n) => Math.round((n * n) / 2), code: 'function numRescueBoats(people, limit) {\n  const used = new Array(people.length).fill(false);\n  let boats = 0;\n  for (let k = 0; k < people.length; k++) {\n    let h = -1;\n    for (let i = 0; i < people.length; i++) if (!used[i] && (h < 0 || people[i] > people[h])) h = i;\n    if (h < 0) break;\n    used[h] = true;\n    let best = -1;\n    for (let i = 0; i < people.length; i++) if (!used[i] && people[h] + people[i] <= limit && (best < 0 || people[i] > people[best])) best = i;\n    if (best >= 0) used[best] = true;\n    boats++;\n  }\n  return boats;\n}' },
  hints: ['Хто пливе в кожному разі — найлегший чи найважчий?', 'Відсортуй. i — найлегший, j — найважчий. Поки i ≤ j: якщо people[i] + people[j] ≤ limit — i++; завжди j-- і boats++.', 'people.sort((a, b) => a - b); let i = 0, j = people.length - 1; while (i <= j) { if (people[i] + people[j] <= limit) i++; j--; boats++; }'],
  solution: 'function numRescueBoats(people: number[], limit: number): number {\n  const a = people.slice().sort((x, y) => x - y);\n  let i = 0, j = a.length - 1, boats = 0;\n  while (i <= j) {\n    if (a[i] + a[j] <= limit) i++;\n    j--;\n    boats++;\n  }\n  return boats;\n}',
  lesson: 'Жадібний крок плюс два вказівники: найважчий пливе завжди, а з собою бере найлегшого, якщо вміщаються.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Subsets */
function subsetsRef(a: number[]) { const out: number[][] = [[]]; for (const x of a) { const n = out.length; for (let i = 0; i < n; i++) out.push([...out[i], x]); } return out; }
const subsets: Level = {
  id: 'hell.subsets', world: 8, title: 'Усі набори для котла', topic: 'backtracking: брати чи ні',
  leetcode: lc(78, 'Subsets'),
  brief: '<b>Усі набори для котла.</b> Перебери всі можливі набори грішників з даних — від порожнього до всіх разом.',
  statement: [
    'Уламок порозкидав грішників по чужих котлах, і чорти хочуть перебрати всі можливі набори, щоб розсадити їх як слід. <code>nums</code> — номери грішників, усі різні.',
    'Поверни <b>всі</b> підмножини: порожню, по одному, по двоє… і всіх разом. Порядок наборів і всередині наборів неважливий.',
    'Для кожного грішника рішення лише два: <b>брати</b> або <b>не брати</b>. Пройди ці рішення рекурсією й повертайся, щоб спробувати інше.',
  ],
  tool: {
    name: 'backtracking: зробив вибір — повернувся',
    text: [
      'Тримай <code>path</code> — поточний набір. Функція <code>go(i)</code> вирішує долю грішника <code>i</code>: спершу без нього <code>go(i + 1)</code>, потім з ним — <code>path.push</code>, <code>go(i + 1)</code>, <code>path.pop()</code>.',
      'Коли рішення ухвалено для всіх, поклади <b>копію</b> <code>[...path]</code> у відповідь: сам <code>path</code> ще змінюватиметься.',
    ],
    code: '// nums = [1, 2]\n// go(0): без 1 → go(1): без 2 → []      з 2 → [2]\n//        з 1  → go(1): без 2 → [1]     з 2 → [1, 2]',
  },
  talk: [
    { who: 'sibyl', text: 'Тут чорти перебирають набори для котлів. Усі можливі. І їм потрібна допомога, бо Вовк уже там застряг.' },
    { who: 'wolf', text: 'Я пішов коридором «брати першого»… а потім «брати другого»… і тепер не знаю, як вийти назад!' },
    { who: 'fox', text: 'Бо ти не повертаєшся. Зробив вибір — пройди до кінця, а тоді скасуй його й спробуй інший. Це і є backtracking.' },
  ],
  quip: { who: 'wolf', text: 'Так от як виходити з глухих кутів. Повертатися! А я завжди тільки вперед…' },
  entry: 'subsets', observe: ['nums'],
  starter: starter('subsets', [['nums', 'number[]']], 'number[][]', ['Усі набори для котла', 'Поверни всі підмножини nums (порядок неважливий).'], '  const out = [];\n  const path = [];\n  const go = (i) => {\n    // Слово ладу пиши тут\n  };\n  go(0);\n  return out;\n'),
  examples: [one([1, 2, 3])],
  hidden: [one([0]), one([]), one([4, 7]), one([1, 2, 3, 4])],
  reference: subsetsRef,
  check: setCheck,
  hints: ['Яке рішення треба ухвалити для кожного грішника?', 'go(i): якщо i === n — поклади копію path. Інакше go(i + 1) без nums[i]; потім push(nums[i]), go(i + 1), pop().', 'const go = (i) => { if (i === nums.length) { out.push([...path]); return; } go(i + 1); path.push(nums[i]); go(i + 1); path.pop(); };'],
  solution: 'function subsets(nums: number[]): number[][] {\n  const out: number[][] = [];\n  const path: number[] = [];\n  const go = (i: number) => {\n    if (i === nums.length) { out.push([...path]); return; }\n    go(i + 1);\n    path.push(nums[i]);\n    go(i + 1);\n    path.pop();\n  };\n  go(0);\n  return out;\n}',
  lesson: 'Backtracking — це дерево рішень: зробив вибір, пройшов глибше, повернувся й скасував. Кожен лист дерева — одна відповідь.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Permutations */
function permRef(a: number[]): number[][] { if (a.length <= 1) return [a.slice()]; const out: number[][] = []; a.forEach((x, i) => { for (const p of permRef([...a.slice(0, i), ...a.slice(i + 1)])) out.push([x, ...p]); }); return out; }
const perms: Level = {
  id: 'hell.perms', world: 8, title: 'Порядок брам', topic: 'backtracking: хто вже пройшов',
  leetcode: lc(46, 'Permutations'),
  brief: '<b>Порядок брам.</b> До Анхіза ведуть кілька брам, і пройти можна в будь-якому порядку. Перелічи всі порядки.',
  statement: [
    'На останньому колі — брами з номерами <code>nums</code> (усі різні). Пройти треба всі, по одному разу, в будь-якому порядку.',
    'Поверни <b>всі</b> можливі порядки. Порядок самих відповідей неважливий, а всередині кожної — важливий.',
    'Тепер вибір інший: не «брати чи ні», а «яку браму наступною». І треба пам\'ятати, які вже пройдено.',
  ],
  tool: {
    name: 'позначка «вже пройдено»',
    text: [
      'Тримай масив <code>used</code>: <code>used[i]</code> — чи брама <code>i</code> вже в поточному шляху. На кожному кроці пробуй усі ще не пройдені.',
      'Вибрав браму: познач <code>used[i] = true</code>, <code>path.push</code>, іди глибше. Повернувся: <code>path.pop()</code>, <code>used[i] = false</code>. Шлях повний — копію у відповідь.',
    ],
    code: '// nums = [1, 2, 3]\n// 1 → 2 → 3,  1 → 3 → 2\n// 2 → 1 → 3,  2 → 3 → 1\n// 3 → 1 → 2,  3 → 2 → 1   — 6 порядків',
  },
  talk: [
    { who: 'sibyl', text: 'Брами можна пройти в будь-якому порядку. Анхіз хоче знати всі шляхи, якими до нього можуть прийти нащадки.' },
    { who: 'fox', text: 'На кожному кроці — будь-яка ще не пройдена брама. Позначаємо, йдемо глибше, а повертаючись — знімаємо позначку.' },
  ],
  quip: { who: 'anchises', text: 'Шість шляхів до мене з трьох брам. А скільки ж їх буде в моїх онуків, якщо брам більше?' },
  entry: 'permute', observe: ['nums'],
  starter: starter('permute', [['nums', 'number[]']], 'number[][]', ['Порядок брам', 'Поверни всі перестановки nums (порядок відповідей неважливий).'], '  const out = [];\n  const path = [];\n  const used = new Array(nums.length).fill(false);\n  const go = () => {\n    // Слово ладу пиши тут\n  };\n  go();\n  return out;\n'),
  examples: [one([1, 2, 3])],
  hidden: [one([0, 1]), one([1]), one([5, 6, 7, 8])],
  reference: permRef,
  check: permCheck,
  hints: ['Що треба знати, щоб не пройти ту саму браму двічі?', 'go(): якщо path повний — копію в out. Інакше для кожного невикористаного i: used[i] = true, push, go(), pop, used[i] = false.', 'for (let i = 0; i < nums.length; i++) { if (used[i]) continue; used[i] = true; path.push(nums[i]); go(); path.pop(); used[i] = false; }'],
  solution: 'function permute(nums: number[]): number[][] {\n  const out: number[][] = [];\n  const path: number[] = [];\n  const used: boolean[] = new Array(nums.length).fill(false);\n  const go = () => {\n    if (path.length === nums.length) { out.push([...path]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      go();\n      path.pop();\n      used[i] = false;\n    }\n  };\n  go();\n  return out;\n}',
  lesson: 'У перестановках вибір — «хто наступний із ще не використаних»: познач, іди глибше, зніми позначку на зворотному шляху.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Combination Sum */
function combRef(c: number[], t: number) { const out: number[][] = []; const a = c.slice().sort((x, y) => x - y); const go = (s: number, left: number, p: number[]) => { if (left === 0) { out.push(p.slice()); return; } for (let i = s; i < a.length && a[i] <= left; i++) { p.push(a[i]); go(i, left - a[i], p); p.pop(); } }; go(0, t, []); return out; }
const coins: Level = {
  id: 'hell.coins', world: 8, final: true, title: 'Плата Харонові', topic: 'backtracking з повторами',
  leetcode: lc(39, 'Combination Sum'),
  brief: '<b>Плата Харонові.</b> Харон бере плату рівно <code>target</code>. Знайди всі способи скласти її з монет.',
  statement: [
    'Щоб вийти з пекла, треба заплатити Харонові рівно <code>target</code>. Монети бувають кількох вартостей: <code>candidates</code> (усі різні), і кожну можна брати скільки завгодно разів.',
    'Поверни всі <b>різні</b> набори монет, що разом дають <code>target</code>. Набори <code>[2, 3]</code> і <code>[3, 2]</code> — той самий набір, тож рахуй його один раз. Порядок відповідей неважливий.',
    'Це backtracking із двома хитрощами: монету можна повторити (тож лишайся на тій самій), а щоб не рахувати набір двічі, бери монети лише від поточної <b>і далі</b>.',
  ],
  tool: {
    name: 'start: лише вперед, але з повтором',
    text: [
      '<code>go(start, left, path)</code>: пробуй монети з номерами від <code>start</code> і далі. Узяв монету <code>i</code> — кличеш <code>go(i, left - c, …)</code>: та сама монета ще доступна, а попередні — вже ні.',
      'Базові випадки: <code>left === 0</code> — набір знайдено (копію у відповідь); <code>left &lt; 0</code> — перебрали, повертайся. Якщо монети відсортувати, перебір можна обірвати, щойно монета більша за <code>left</code>.',
    ],
    code: '// candidates = [2, 3], target = 7\n// 2 + 2 + 3 = 7 ✓\n// 2 + 3 + … — 3 + 2 вже не беремо: лише вперед\n// відповідь: [[2, 2, 3]]',
  },
  talk: [
    { who: 'charon', text: 'Плата рівно стільки, скільки сказав. Ні копійкою більше, ні менше. І я хочу знати всі способи — для бухгалтерії.' },
    { who: 'wolf', text: 'Я спробую всі послідовності монет! [2, 3], [3, 2], [2, 2, 3], [2, 3, 2], [3, 2, 2]… ой, це ж одне й те саме?' },
    { who: 'fox', text: 'Одне й те саме, тому бери монети лише вперед. А монету можна повторити — тож після неї лишайся на ній самій.' },
    { who: 'anchises', text: 'Микито, підійди. Ти чуєш уламки, бо сам носиш у собі частку Писанки. Тому й фарба на тобі змінюється. Юнона це знає.' },
  ],
  quip: { who: 'charon', text: 'Заплачено. Виходьте. І передайте Вовкові: в кредит не перевожу.' },
  entry: 'combinationSum', observe: ['candidates', null],
  starter: starter('combinationSum', [['candidates', 'number[]'], ['target', 'number']], 'number[][]', ['Плата Харонові', 'Поверни всі різні набори з candidates (з повторами), що дають target.'], '  const out = [];\n  const path = [];\n  const go = (start, left) => {\n    // Слово ладу пиши тут\n  };\n  go(0, target);\n  return out;\n'),
  examples: [pair([2, 3, 6, 7], 7), pair([2, 3, 5], 8)],
  hidden: [pair([2], 1), pair([1], 2), pair([3, 4, 5], 9), pair([7, 3, 2], 18), pair([8, 7, 4, 3], 11)],
  reference: combRef,
  check: setCheck,
  hints: ['Як зробити, щоб [2, 3] і [3, 2] не потрапили обидва?', 'go(start, left): left === 0 — копію path в out; left < 0 — назад. Для i від start: push, go(i, left − candidates[i]), pop.', 'const go = (start, left) => { if (left === 0) { out.push([...path]); return; } if (left < 0) return; for (let i = start; i < candidates.length; i++) { path.push(candidates[i]); go(i, left - candidates[i]); path.pop(); } };'],
  solution: 'function combinationSum(candidates: number[], target: number): number[][] {\n  const out: number[][] = [];\n  const path: number[] = [];\n  const go = (start: number, left: number) => {\n    if (left === 0) { out.push([...path]); return; }\n    if (left < 0) return;\n    for (let i = start; i < candidates.length; i++) {\n      path.push(candidates[i]);\n      go(i, left - candidates[i]);\n      path.pop();\n    }\n  };\n  go(0, target);\n  return out;\n}',
  lesson: 'start тримає порядок: монети лише вперед — і жоден набір не повториться, а go(i, …) дозволяє взяти ту саму монету ще раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const hell: World = {
  n: 8, name: 'Пекло', song: 'Пісня IV · Пекло', topic: 'Рекурсія, Backtracking', fox: '#c9302a',
  host: { who: 'Харон', line: 'Човен на двох, і вага обмежена. Хто з ким пливе, вирішуй сам.' },
  motif: 'spiral', trick: 'Спіраль: рекурсія й backtracking',
  levels: [descent, boats, subsets, perms, coins],
};
