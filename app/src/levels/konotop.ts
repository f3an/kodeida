import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

/*
 * Світ 5 — Конотоп, бінарний пошук (за «Конотопською відьмою» Квітки-Основ'яненка).
 * Головна думка: замість перевіряти всіх по черзі, щоразу дивись у середину й відкидай половину.
 * Великі тести тут вимірюють не O(n) проти O(n²), а log n проти n: бюджет — кілька десятків поглядів на 10 000.
 */

const pair = (a: unknown[], t: number): TestCase => ({ args: [a, t], label: `${JSON.stringify(a)}, ${t}` });
const one = (a: unknown[]): TestCase => ({ args: [a], label: JSON.stringify(a) });
/** Бюджет бінарного пошуку: кілька поглядів на кожне ділення навпіл. */
const logBudget = (per: number) => (n: number) => per * Math.ceil(Math.log2(n)) + 10;
const sortedDistinct = (n: number, seed: number) => { const r = rng(seed); let v = -5000; return Array.from({ length: n }, () => (v += 1 + Math.floor(r() * 5))); };

/* 1. Binary Search */
function searchRef(a: number[], t: number) { return a.indexOf(t); }
const search: Level = {
  id: 'konotop.search', world: 5, title: 'Хата сотника', topic: 'ділити навпіл',
  leetcode: lc(704, 'Binary Search'),
  brief: '<b>Хата сотника.</b> Номери хат записано за зростанням. Знайди хату з номером <code>target</code>, не обходячи всі.',
  statement: [
    'У Конотопі засуха, і сотник Забрьоха шукає винних, перевіряючи всіх по черзі. Почнемо з малого: у реєстрі <code>nums</code> номери хат ідуть <b>за зростанням</b>, без повторів.',
    'Поверни, на якому місці в реєстрі стоїть номер <code>target</code>, рахуючи з нуля, або <code>-1</code>, якщо такого немає. Для <code>[-1, 0, 3, 5, 9, 12]</code> і <code>9</code> — це <code>4</code>.',
    'Хат буває до 10 000, а світ дозволяє лише кілька десятків поглядів. Подивись у середину: якщо там число менше за <code>target</code>, ліва половина вже не потрібна, і навпаки. Так щоразу відпадає половина. Це <b>бінарний пошук</b>.',
  ],
  tool: {
    name: 'ділення навпіл',
    text: [
      'Тримай межі <code>lo</code> і <code>hi</code> — де ще може бути відповідь. Дивись на середину <code>mid = Math.floor((lo + hi) / 2)</code>.',
      'Якщо там менше, ніж шукаєш, — відповідь правіше: <code>lo = mid + 1</code>. Якщо більше — лівіше: <code>hi = mid - 1</code>. Щоразу половина відпадає, тож на 10 000 хат вистачає 14 поглядів.',
    ],
    code: '// шукаємо 9 у [1, 3, 5, 7, 9, 11]\n// lo=0 hi=5 mid=2 → 5 < 9 → lo = 3\n// lo=3 hi=5 mid=4 → 9 — знайшли!',
  },
  talk: [
    { who: 'sotnyk', text: 'Засуха — значить, відьми! Перевіряти будемо всіх по черзі, від першої хати до останньої.' },
    { who: 'fox', text: 'Пане сотнику, реєстр же впорядкований. Глянемо в середину — і половину хат уже можна не чіпати.' },
    { who: 'sotnyk', text: 'Що значить «ділити навпіл»? Ну, спробуй.' },
  ],
  quip: { who: 'sotnyk', text: 'Чотирнадцять поглядів на весь Конотоп? Хм. А я вже весь став наготував.' },
  entry: 'search', observe: ['nums', null],
  starter: starter('search', [['nums', 'number[]'], ['target', 'number']], 'number', ['Хата сотника', 'nums відсортовано за зростанням. Поверни місце target або -1.'], '  let lo = 0, hi = nums.length - 1;\n  // Слово ладу пиши тут\n\n  return -1;\n'),
  examples: [pair([-1, 0, 3, 5, 9, 12], 9), pair([-1, 0, 3, 5, 9, 12], 2)],
  hidden: [pair([5], 5), pair([5], -5), pair([1, 3, 5, 7, 9, 11, 13], 1), pair([1, 3, 5, 7, 9, 11, 13], 13), pair([2, 4], 3)],
  big: { n: 10000, make: (n) => { const a = sortedDistinct(n, 704); return [a, a[Math.floor(n * 0.83)]]; }, readBudget: logBudget(3) },
  reference: searchRef,
  wolf: { reads: (n) => Math.round(0.83 * n), code: 'function search(nums, target) {\n  for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;\n  return -1;\n}' },
  hints: ['Подивись у середину. Що це каже про ліву й праву половини?', 'Поки lo ≤ hi: mid — середина; знайшов — поверни; менше — lo = mid + 1; більше — hi = mid − 1.', 'while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); if (nums[mid] === target) return mid; if (nums[mid] < target) lo = mid + 1; else hi = mid - 1; }'],
  solution: 'function search(nums: number[], target: number): number {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    const v = nums[mid];\n    if (v === target) return mid;\n    if (v < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
  lesson: 'На впорядкованому ряді один погляд у середину відкидає половину: 10 000 хат — 14 поглядів.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Search Insert Position */
function insertRef(a: number[], t: number) { let i = 0; while (i < a.length && a[i] < t) i++; return i; }
const insert: Level = {
  id: 'konotop.insert', world: 5, title: 'Місце в шерезі', topic: 'де б він стояв',
  leetcode: lc(35, 'Search Insert Position'),
  brief: '<b>Місце в шерезі.</b> Козаки стоять за зростом. Куди стати новому, щоб шерега лишилася рівною?',
  statement: [
    'Сотник шикує козаків за зростом: <code>nums</code> — зрости за зростанням, без повторів.',
    'Якщо козак зі зростом <code>target</code> уже стоїть у шерезі, поверни його місце. Якщо ні — місце, куди йому стати, щоб порядок не зламався. Для <code>[1, 3, 5, 6]</code>: <code>5</code> → <code>2</code>, а <code>2</code> → <code>1</code> (між 1 і 3).',
    'Це той самий бінарний пошук, тільки відповідь є завжди: де пошук зупинився, там і місце.',
  ],
  tool: {
    name: 'межа, де зупинився пошук',
    text: [
      'Шукай <b>перше місце</b>, де зріст не менший за <code>target</code>. Межі: <code>lo = 0</code>, <code>hi = n</code> (за кінцем шереги теж можна стати).',
      'Якщо в середині менше — відповідь правіше: <code>lo = mid + 1</code>. Інакше вона тут або лівіше: <code>hi = mid</code>. Коли <code>lo</code> і <code>hi</code> зійдуться — це і є місце.',
    ],
    code: '// [10, 20, 30, 40], новий — 25\n// lo=0 hi=4 mid=2 → 30 ≥ 25 → hi = 2\n// lo=0 hi=2 mid=1 → 20 < 25 → lo = 2\n// lo = hi = 2: ставай на місце 2',
  },
  talk: [
    { who: 'sotnyk', text: 'Новий козак прийшов! Ставай… ну, кудись туди. Ні, не туди!' },
    { who: 'fox', text: 'Навіть якщо такого зросту в шерезі немає, поділ навпіл зупиниться саме там, де йому місце.' },
  ],
  quip: { who: 'sotnyk', text: 'Рівненько стоять. Аж шкода в став кидати.' },
  entry: 'searchInsert', observe: ['nums', null],
  starter: starter('searchInsert', [['nums', 'number[]'], ['target', 'number']], 'number', ['Місце в шерезі', 'nums відсортовано. Поверни місце target або місце, куди його вставити.'], '  let lo = 0, hi = nums.length;\n  // Слово ладу пиши тут\n\n  return lo;\n'),
  examples: [pair([1, 3, 5, 6], 5), pair([1, 3, 5, 6], 2)],
  hidden: [pair([1, 3, 5, 6], 7), pair([1, 3, 5, 6], 0), pair([1], 1), pair([2, 4, 6, 8, 10], 9)],
  big: { n: 10000, make: (n) => { const a = sortedDistinct(n, 35); return [a, a[Math.floor(n * 0.9)] + 1]; }, readBudget: logBudget(3) },
  reference: insertRef,
  wolf: { reads: (n) => Math.round(0.9 * n), code: 'function searchInsert(nums, target) {\n  let i = 0;\n  while (i < nums.length && nums[i] < target) i++;\n  return i;\n}' },
  hints: ['Що, як шукати перше місце, де зріст уже не менший за target?', 'lo = 0, hi = n. Поки lo < hi: менше в середині — lo = mid + 1, інакше hi = mid. Відповідь — lo.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (nums[mid] < target) lo = mid + 1; else hi = mid; } return lo;'],
  solution: 'function searchInsert(nums: number[], target: number): number {\n  let lo = 0, hi = nums.length;\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid;\n  }\n  return lo;\n}',
  lesson: 'Поділ навпіл знаходить не лише «чи є», а й «де межа»: місце, з якого починається все, що не менше.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. First Bad Version через масив діжок */
function firstBadRef(a: boolean[]) { return a.indexOf(true); }
const barrel: Level = {
  id: 'konotop.barrel', world: 5, title: 'Перша зіпсована діжка', topic: 'перша «так»',
  leetcode: lc(278, 'First Bad Version'),
  brief: '<b>Перша зіпсована діжка.</b> У льоху діжки стоять у ряд: спочатку добрі, потім зіпсовані. Знайди першу зіпсовану.',
  statement: [
    'Відьма наврочила сотникові льох: з якоїсь діжки капуста скисла, і всі діжки після неї теж зіпсовані. <code>barrels[i]</code> — <code>true</code>, якщо діжка <code>i</code> зіпсована, і <code>false</code>, якщо добра.',
    'Поверни номер першої зіпсованої діжки, рахуючи з нуля. Для <code>[false, false, false, true, true]</code> — <code>3</code>. Хоча б одна зіпсована є завжди.',
    'Ряд завжди виглядає як «ні, ні, …, так, так». Межу між «ні» і «так» знаходить той самий бінарний пошук: глянув у середину — і знаєш, у якій половині межа.',
  ],
  tool: {
    name: 'пошук межі «ні → так»',
    text: [
      'Якщо діжка в середині зіпсована, перша зіпсована — тут або лівіше: <code>hi = mid</code>. Якщо добра — точно правіше: <code>lo = mid + 1</code>.',
      'Поки <code>lo &lt; hi</code>, межі сходяться. Коли зійшлися, <code>lo</code> показує першу «так».',
    ],
    code: '// [F, F, F, T, T]\n// lo=0 hi=4 mid=2 → F → lo = 3\n// lo=3 hi=4 mid=3 → T → hi = 3\n// lo = hi = 3',
  },
  talk: [
    { who: 'sotnyk', text: 'Капуста скисла! Відкриваймо всі діжки по черзі й нюхаймо кожну!' },
    { who: 'fox', text: 'Мій ніс у вашому льоху довго не витримає. Відкриймо середню: якщо скисла — далі всі такі, і шукаємо лівіше.' },
  ],
  quip: { who: 'fox', text: 'Знайшли за кілька відкритих діжок. Ніс уцілів, хоч і трохи пахне капустою.' },
  entry: 'firstBad', observe: ['barrels'],
  starter: starter('firstBad', [['barrels', 'boolean[]']], 'number', ['Перша зіпсована діжка', 'barrels[i] — true, якщо діжка зіпсована. Усі після першої зіпсованої — теж.', 'Поверни номер першої зіпсованої.'], '  let lo = 0, hi = barrels.length - 1;\n  // Слово ладу пиши тут\n\n  return lo;\n'),
  examples: [one([false, false, false, true, true])],
  hidden: [one([true]), one([false, true]), one([false, false, false, false, false, false, true]), one([true, true, true]), one([false, true, true, true, true])],
  big: { n: 10000, make: (n) => { const k = Math.floor(n * 0.73); return [Array.from({ length: n }, (_, i) => i >= k)]; }, readBudget: logBudget(3) },
  reference: firstBadRef,
  wolf: { reads: (n) => Math.round(0.73 * n), code: 'function firstBad(barrels) {\n  for (let i = 0; i < barrels.length; i++) if (barrels[i]) return i;\n  return -1;\n}' },
  hints: ['Що каже зіпсована діжка посередині про діжки праворуч від неї?', 'Поки lo < hi: середня зіпсована — hi = mid, добра — lo = mid + 1. Відповідь — lo.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (barrels[mid]) hi = mid; else lo = mid + 1; } return lo;'],
  solution: 'function firstBad(barrels: boolean[]): number {\n  let lo = 0, hi = barrels.length - 1;\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (barrels[mid]) hi = mid;\n    else lo = mid + 1;\n  }\n  return lo;\n}',
  lesson: 'Будь-яке «спочатку ні, потім так» шукається навпіл: межа знаходиться за log n поглядів.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Search in Rotated Sorted Array */
const rotate = (a: number[], k: number) => [...a.slice(k), ...a.slice(0, k)];
const rotated: Level = {
  id: 'konotop.rotated', world: 5, title: 'Зсунутий реєстр', topic: 'навпіл у зсунутому ряду',
  leetcode: lc(33, 'Search in Rotated Sorted Array'),
  brief: '<b>Зсунутий реєстр.</b> Відьма перекрутила реєстр: упорядкований ряд зсунули по колу. Знайди хату <code>target</code>.',
  statement: [
    'Реєстр знову впорядкований, але відьма відрізала від нього шматок і переставила на початок: з <code>[0, 1, 2, 4, 5, 6, 7]</code> вийшло <code>[4, 5, 6, 7, 0, 1, 2]</code>.',
    'Поверни місце <code>target</code> або <code>-1</code>, якщо його немає. Номери не повторюються. Для цього ряду і <code>0</code> — відповідь <code>4</code>.',
    'Хоч ряд і зсунутий, якщо розділити його навпіл, <b>одна з половин завжди впорядкована</b>. Перевір, чи <code>target</code> потрапляє в неї, і відкинь ту половину, де його точно немає.',
  ],
  tool: {
    name: 'яка половина рівна',
    text: [
      'Якщо <code>nums[lo] &lt;= nums[mid]</code>, ліва половина впорядкована. Тоді, якщо <code>target</code> між <code>nums[lo]</code> і <code>nums[mid]</code>, — шукай ліворуч, інакше праворуч.',
      'Інакше впорядкована права половина — і так само перевіряєш, чи <code>target</code> між <code>nums[mid]</code> і <code>nums[hi]</code>.',
    ],
    code: '// [4, 5, 6, 7, 0, 1, 2], шукаємо 0\n// mid = 3 (7): ліва [4..7] рівна, 0 не в ній → праворуч\n// lo = 4: [0, 1, 2] — звичайний поділ навпіл',
  },
  talk: [
    { who: 'sotnyk', text: 'Реєстр зіпсовано! Половина хат на початку, половина в кінці. Тепер точно доведеться перевіряти всіх.' },
    { who: 'wolf', text: 'О, мій метод! По черзі! Кожного! У став!' },
    { who: 'fox', text: 'Не так швидко. Розріж ряд навпіл: хоча б одна половина рівна. Подивись, чи шукане в ній, — і знову відкинеш половину.' },
  ],
  quip: { who: 'wolf', text: 'Ну от. А я вже шапку зняв, щоб пірнати.' },
  entry: 'searchRotated', observe: ['nums', null],
  starter: starter('searchRotated', [['nums', 'number[]'], ['target', 'number']], 'number', ['Зсунутий реєстр', 'nums — впорядкований ряд, зсунутий по колу. Поверни місце target або -1.'], '  let lo = 0, hi = nums.length - 1;\n  // Слово ладу пиши тут\n\n  return -1;\n'),
  examples: [pair([4, 5, 6, 7, 0, 1, 2], 0), pair([4, 5, 6, 7, 0, 1, 2], 3)],
  hidden: [pair([1], 0), pair([1], 1), pair([3, 1], 1), pair([5, 1, 3], 5), pair([6, 7, 8, 1, 2, 3, 4, 5], 8), pair([1, 2, 3, 4, 5], 4)],
  big: { n: 10000, make: (n) => { const a = rotate(sortedDistinct(n, 33), Math.floor(n * 0.37)); return [a, a[Math.floor(n * 0.88)]]; }, readBudget: logBudget(6) },
  reference: searchRef,
  wolf: { reads: (n) => Math.round(0.88 * n), code: 'function searchRotated(nums, target) {\n  for (let i = 0; i < nums.length; i++) if (nums[i] === target) return i;\n  return -1;\n}' },
  hints: ['Розріж ряд у середині. Яка з двох половин точно без зсуву?', 'Якщо nums[lo] ≤ nums[mid] — ліва рівна: target у [nums[lo], nums[mid]) → hi = mid − 1, інакше lo = mid + 1. Інакше рівна права — аналогічно.', 'if (nums[lo] <= nums[mid]) { if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1; } else { if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1; }'],
  solution: 'function searchRotated(nums: number[], target: number): number {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    const m = nums[mid];\n    if (m === target) return mid;\n    const l = nums[lo], h = nums[hi];\n    if (l <= m) {\n      if (l <= target && target < m) hi = mid - 1;\n      else lo = mid + 1;\n    } else {\n      if (m < target && target <= h) lo = mid + 1;\n      else hi = mid - 1;\n    }\n  }\n  return -1;\n}',
  lesson: 'Поділ навпіл працює, доки можна сказати, в якій половині відповідь. Навіть у зсунутому ряду одна половина завжди рівна.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Koko Eating Bananas */
const koko = (p: number[], h: number): TestCase => ({ args: [p, h], label: `${JSON.stringify(p)}, ${h}` });
function hoursAt(p: number[], k: number) { let s = 0; for (const x of p) s += Math.ceil(x / k); return s; }
function kokoRef(p: number[], h: number) { let lo = 1, hi = Math.max(...p); while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (hoursAt(p, mid) <= h) hi = mid; else lo = mid + 1; } return lo; }
const pies: Level = {
  id: 'konotop.pies', world: 5, final: true, title: 'Вовк і пироги', topic: 'навпіл по відповіді',
  leetcode: lc(875, 'Koko Eating Bananas'),
  brief: '<b>Вовк і пироги.</b> З якою найменшою швидкістю Вовк з\'їсть усі пироги, поки сотник не повернувся?',
  statement: [
    'Поки сотник ганяє відьом, Вовк дістався до його комори. <code>piles[i]</code> — скільки пирогів у мисці <code>i</code>. Сотник повернеться за <code>h</code> годин.',
    'За годину Вовк з\'їдає не більше <code>k</code> пирогів, і тільки з однієї миски. Якщо в мисці менше, він доїдає її й решту години відпочиває. Поверни найменше <code>k</code>, з яким він устигне все за <code>h</code> годин. Для <code>[3, 6, 7, 11]</code> і <code>h = 8</code> — <code>4</code>.',
    'Перебирати <code>k</code> = 1, 2, 3… довго. Але помітиш: з малою швидкістю Вовк не встигає, з великою встигає. Знову «спочатку ні, потім так», тож бінарним пошуком можна шукати <b>саму відповідь</b>.',
  ],
  tool: {
    name: 'поділ навпіл по відповіді',
    text: [
      'Іноді навпіл ділять не масив, а <b>можливі відповіді</b>. Швидкість — від 1 до найбільшої миски. Для середньої швидкості рахуєш години: <code>Math.ceil(p / k)</code> для кожної миски.',
      'Встигає — пробуй повільніше (<code>hi = mid</code>), не встигає — швидше (<code>lo = mid + 1</code>). Кожна перевірка — один прохід по мисках, а перевірок лише log(max).',
    ],
    code: '// piles = [3, 6, 7, 11], h = 8\n// k = 6: 1 + 1 + 2 + 2 = 6 год ≤ 8 → повільніше\n// k = 3: 1 + 2 + 3 + 4 = 10 год > 8 → швидше\n// k = 4: 1 + 2 + 2 + 3 = 8 год — найменше',
  },
  talk: [
    { who: 'wolf', text: 'Пироги! Ціла комора! Сотник повернеться за кілька годин — встигну, якщо їстиму як слід.' },
    { who: 'fox', text: 'А як «як слід»? З якою найменшою швидкістю ти встигнеш? Бо швидше — живіт заболить.' },
    { who: 'wolf', text: 'Перевірю! Швидкість один, два, три, чотири… поки не вийде.' },
    { who: 'fox', text: 'Енею, а ми поділимо навпіл саму швидкість. «Встигає чи ні» — це ж та сама межа «ні → так».' },
  ],
  quip: { who: 'wolf', text: 'Рівно стільки, скільки треба, і ні пиріжком більше. Обидно, але ситно.' },
  entry: 'minEatingSpeed', observe: ['piles', null],
  starter: starter('minEatingSpeed', [['piles', 'number[]'], ['h', 'number']], 'number', ['Вовк і пироги', 'piles[i] — пироги в мисці i, h — години. Поверни найменшу швидкість k,', 'з якою Вовк з\'їсть усе за h годин (за годину — до k з однієї миски).'], '  let lo = 1, hi = 1;\n  // Слово ладу пиши тут\n\n  return lo;\n'),
  examples: [koko([3, 6, 7, 11], 8), koko([30, 11, 23, 4, 20], 5)],
  hidden: [koko([30, 11, 23, 4, 20], 6), koko([1], 1), koko([312884470], 968709470), koko([1, 1, 1, 1], 4), koko([10], 3)],
  big: {
    n: 10000,
    make: (n) => { const r = rng(875); const p = Array.from({ length: n }, () => 1 + Math.floor(r() * 1000000)); return [p, 2 * n]; },
    readBudget: (n) => 40 * n,
  },
  reference: kokoRef,
  wolf: { reads: (n) => n * 250000, code: 'function minEatingSpeed(piles, h) {\n  for (let k = 1; ; k++) {\n    let hours = 0;\n    for (let i = 0; i < piles.length; i++) hours += Math.ceil(piles[i] / k);\n    if (hours <= h) return k;\n  }\n}' },
  hints: ['Якщо Вовк встигає зі швидкістю k, чи встигне він із k + 1?', 'lo = 1, hi = найбільша миска. Поки lo < hi: mid; години = сума Math.ceil(p / mid); встигає — hi = mid, ні — lo = mid + 1.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); let hours = 0; for (p of piles) hours += Math.ceil(p / mid); if (hours <= h) hi = mid; else lo = mid + 1; }'],
  solution: 'function minEatingSpeed(piles: number[], h: number): number {\n  let lo = 1, hi = 1;\n  for (let i = 0; i < piles.length; i++) hi = Math.max(hi, piles[i]);\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    let hours = 0;\n    for (let i = 0; i < piles.length; i++) hours += Math.ceil(piles[i] / mid);\n    if (hours <= h) hi = mid;\n    else lo = mid + 1;\n  }\n  return lo;\n}',
  lesson: 'Якщо відповідь можна перевірити і «підходить» іде після «не підходить», шукай навпіл саму відповідь.',
  scene: { type: 'array', skin: 'sack', mode: 'scan' },
};

export const konotop: World = {
  n: 5, name: 'Конотоп', song: 'Пісня III · Випробування', topic: 'Binary Search', fox: '#a68ae6',
  host: { who: 'Сотник Забрьоха', line: 'Кидаємо в став кожну по черзі! Що значить «ділити навпіл»? Ну, спробуй.' },
  motif: 'halved', trick: 'Ромб навпіл: бінарний пошук',
  levels: [search, insert, barrel, rotated, pies],
};
