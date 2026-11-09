import { rng, type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { buildTree, lc, starter, tree, type T } from './util.ts';
import { L } from '../i18n.ts';

/*
 * Світ 15 — Двобій з Турном: фінал, режим «співбесіди».
 * Кожна вправа — раунд двобою: незнайома задача без назви теми й без нового інструмента.
 * Гравець сам упізнає прийом; Микита лише підбадьорює, а перша підказка вже називає хитрість.
 */

const s = (a: unknown) => JSON.stringify(a).replace(/,/g, ', ');
const one = (a: number[]): TestCase => ({ args: [a], label: s(a) });
const TOPIC = 'співбесіда: впізнай прийом сам';

/* 1. Product of Array Except Self */
function productRef(a: number[]) { const n = a.length, out = new Array(n).fill(1); let p = 1; for (let i = 0; i < n; i++) { out[i] = p; p *= a[i]; } p = 1; for (let i = n - 1; i >= 0; i--) { out[i] *= p; p *= a[i]; } return out.map((x) => x + 0); }
const strength: Level = {
  id: 'duel.product', world: 15, title: 'Сила ватаги', topic: TOPIC,
  leetcode: lc(238, 'Product of Array Except Self'),
  brief: '<b>Сила ватаги.</b> Раунд перший. Для кожного воїна порахуй силу всієї ватаги без нього.',
  statement: [
    'Перед двобоєм Турн вимагає показати силу троянців. <code>nums[i]</code> — сила воїна <code>i</code>. Сила ватаги — <b>добуток</b> сил.',
    'Поверни масив, де на місці <code>i</code> стоїть добуток усіх <code>nums</code>, крім <code>nums[i]</code>. Ділити не можна: сили бувають нульові. Для <code>[1, 2, 3, 4]</code> — <code>[24, 12, 8, 6]</code>.',
    'Воїнів буває до 10 000. Яку хитрість застосувати — вирішуй сам.',
  ],
  talk: [
    { who: 'turn', text: 'Покажи, троянцю, чого варта твоя ватага. І без ділення — я чесний воїн.' },
    { who: 'fox', text: 'Ти вже знаєш усі хитрощі. Я тільки тримаю кулаки. Усі чотири лапи.' },
  ],
  quip: { who: 'turn', text: 'Хм. Рахувати ти вмієш. Побачимо, що буде далі.' },
  entry: 'productExceptSelf', observe: ['nums'],
  starter: starter('productExceptSelf', [['nums', 'number[]']], 'number[]', ['Сила ватаги', 'Поверни масив: на місці i — добуток усіх nums, крім nums[i]. Без ділення.'], '  const out = new Array(nums.length).fill(1);\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [one([1, 2, 3, 4]), one([-1, 1, 0, -3, 3])],
  hidden: [one([2, 3]), one([0, 0]), one([5, 0, 2]), one([1, 1, 1, 1, 1]), one([2, -2, 3, -3])],
  big: { n: 10000, make: (n) => { const r = rng(238); return [Array.from({ length: n }, () => (r() < 0.5 ? -1 : 1))]; }, readBudget: (n) => 4 * n },
  reference: productRef,
  // -0 і 0 — те саме: множення на від'ємне дає «мінус нуль», і гравець не має про це думати
  check: (tc, r) => JSON.stringify(r.value) === JSON.stringify(tc.expected) || L(`очікували ${s(tc.expected)}, отримали ${s(r.value)}`, `expected ${s(tc.expected)}, got ${s(r.value)}`),
  wolf: { reads: (n) => n * n, code: 'function productExceptSelf(nums) {\n  return nums.map((_, i) => {\n    let p = 1;\n    for (let j = 0; j < nums.length; j++) if (j !== i) p *= nums[j];\n    return p;\n  });\n}' },
  hints: ['Хитрість — префікси: добуток усіх ліворуч від i, помножений на добуток усіх праворуч.', 'Перший прохід зліва: out[i] = добуток усіх до i. Другий справа: тримай p — добуток праворуч, out[i] *= p.', 'let p = 1; for (let i = 0; i < nums.length; i++) { out[i] = p; p *= nums[i]; } p = 1; for (let i = nums.length - 1; i >= 0; i--) { out[i] *= p; p *= nums[i]; }'],
  solution: 'function productExceptSelf(nums: number[]): number[] {\n  const out: number[] = new Array(nums.length).fill(1);\n  let p = 1;\n  for (let i = 0; i < nums.length; i++) { out[i] = p; p *= nums[i]; }\n  p = 1;\n  for (let i = nums.length - 1; i >= 0; i--) { out[i] *= p; p *= nums[i]; }\n  return out;\n}',
  lesson: 'Префікси й суфікси: «усе, крім i» = «усе ліворуч» × «усе праворуч». Два проходи, O(n).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Find Minimum in Rotated Sorted Array */
const shield: Level = {
  id: 'duel.rotated', world: 15, title: 'Слабке місце щита', topic: TOPIC,
  leetcode: lc(153, 'Find Minimum in Rotated Sorted Array'),
  brief: '<b>Слабке місце щита.</b> Раунд другий. Щит Турна обертається. Знайди його найтоншу пластину.',
  statement: [
    'Щит Турна складено з пластин, товщини яких ішли за зростанням. Але щит обертається, тож рядок <code>nums</code> зсунуто по колу: <code>[3, 4, 5, 1, 2]</code> — це <code>[1, 2, 3, 4, 5]</code>, зсунутий на три. Усі товщини різні.',
    'Поверни найменшу товщину — туди й бити. Для <code>[4, 5, 6, 7, 0, 1, 2]</code> — <code>0</code>.',
    'Пластин буває до 10 000, а щит обертається швидко: на всі не подивишся. Яку хитрість застосувати — вирішуй сам.',
  ],
  talk: [
    { who: 'turn', text: 'Мій щит кував сам Вулкан… для мене. Бий, якщо знайдеш, куди.' },
    { who: 'fox', text: 'Ти бачив таке в Конотопі. Ну, майже таке. Я мовчу, мовчу!' },
  ],
  quip: { who: 'turn', text: 'Влучив! У найтоншу! Хто тебе вчив, троянцю?' },
  entry: 'findMin', observe: ['nums'],
  starter: starter('findMin', [['nums', 'number[]']], 'number', ['Слабке місце щита', 'nums — зростаючий ряд, зсунутий по колу. Поверни найменше значення.'], '  let lo = 0, hi = nums.length - 1;\n  // Слово ладу пиши тут\n\n  return nums[lo];\n'),
  examples: [one([3, 4, 5, 1, 2]), one([4, 5, 6, 7, 0, 1, 2])],
  hidden: [one([11, 13, 15, 17]), one([1]), one([2, 1]), one([5, 1, 2, 3, 4]), one([2, 3, 4, 5, 1])],
  big: { n: 10000, make: (n) => [Array.from({ length: n }, (_, i) => ((i + 6173) % n) * 3)], readBudget: () => 60 },
  reference: (a: number[]) => Math.min(...a),
  wolf: { reads: (n) => n, code: 'function findMin(nums) {\n  let best = nums[0];\n  for (let i = 1; i < nums.length; i++) if (nums[i] < best) best = nums[i];\n  return best;\n}' },
  hints: ['Хитрість — пошук навпіл: порівняй середину з правим краєм, і стане ясно, в якій половині злам.', 'Поки lo < hi: mid = (lo + hi) >> 1. Якщо nums[mid] > nums[hi] — злам праворуч: lo = mid + 1. Інакше hi = mid.', 'while (lo < hi) { const mid = (lo + hi) >> 1; if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid; }'],
  solution: 'function findMin(nums: number[]): number {\n  let lo = 0, hi = nums.length - 1;\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] > nums[hi]) lo = mid + 1;\n    else hi = mid;\n  }\n  return nums[lo];\n}',
  lesson: 'Пошук навпіл працює й на зсунутому ряді: порівняння з правим краєм каже, в якій половині злам.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Longest Consecutive Sequence */
function streakRef(a: number[]) { const set = new Set(a); let best = 0; for (const x of set) if (!set.has(x - 1)) { let y = x; while (set.has(y + 1)) y++; best = Math.max(best, y - x + 1); } return best; }
const ranks: Level = {
  id: 'duel.streak', world: 15, title: 'Найдовший стрій', topic: TOPIC,
  leetcode: lc(128, 'Longest Consecutive Sequence'),
  brief: '<b>Найдовший стрій.</b> Раунд третій. Із розкиданих номерів воїнів склади найдовший стрій поспіль.',
  statement: [
    'Військо Турна розбіглося, а на щитах у воїнів — номери. <code>nums</code> — номери в тому порядку, як їх побачили (можуть повторюватись).',
    'Поверни довжину найдовшого ряду номерів, що йдуть <b>поспіль</b>: x, x + 1, x + 2… Порядок у <code>nums</code> неважливий. Для <code>[100, 4, 200, 1, 3, 2]</code> — <code>4</code> (1, 2, 3, 4).',
    'Номерів буває до 10 000, і сортувати не можна — на це немає часу (і в цій вправі <code>sort</code> заборонено). Яку хитрість застосувати — вирішуй сам.',
  ],
  talk: [
    { who: 'turn', text: 'Мої воїни розбіглися? Байдуже, я зберу найдовший стрій і без них… тобто з них.' },
    { who: 'wolf', text: 'Енею! Пст! Я… я подумав. Юнона так і не дала мені лісу. А в Котляревського, кажуть, бенкет. Я за тебе!' },
    { who: 'fox', text: 'Вовк на нашому боці? Добре. Але задачу розв\'язуєш ти.' },
  ],
  quip: { who: 'wolf', text: 'А я б кожен номер шукав по всьому війську. Як завжди. Добре, що я тепер з вами.' },
  entry: 'longestConsecutive', observe: ['nums'],
  forbid: ['sort', 'toSorted'],
  memory: true,
  starter: starter('longestConsecutive', [['nums', 'number[]']], 'number', ['Найдовший стрій', 'Поверни довжину найдовшого ряду чисел поспіль (x, x + 1, …) з nums. Без сортування.'], '  let best = 0;\n  // Слово ладу пиши тут\n\n  return best;\n'),
  examples: [one([100, 4, 200, 1, 3, 2]), one([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])],
  hidden: [one([]), one([1]), one([1, 2, 0, 1]), one([9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]), one([10, 30, 20])],
  big: { n: 10000, make: (n) => { const r = rng(128); const a = Array.from({ length: n }, (_, i) => i * 2); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } a[0] = 1; a[1] = 3; return [a]; }, readBudget: (n) => 6 * n },
  reference: streakRef,
  wolf: { reads: (n) => n * n, code: 'function longestConsecutive(nums) {\n  let best = 0;\n  for (const x of nums) {\n    let len = 1;\n    // шукати x + 1, x + 2, … перебором усього масиву\n    while (nums.includes(x + len)) len++;\n    best = Math.max(best, len);\n  }\n  return best;\n}' },
  hints: ['Хитрість — скриня (Set): «чи є x + 1?» відповідає миттєво.', 'Поклади все в Set. Для кожного x, у якого немає x − 1 (початок ряду), лічи вгору, поки є x + 1, x + 2…', 'const set = new Set(nums); for (const x of set) if (!set.has(x - 1)) { let y = x; while (set.has(y + 1)) y++; best = Math.max(best, y - x + 1); }'],
  solution: 'function longestConsecutive(nums: number[]): number {\n  const set = new Set(nums);\n  let best = 0;\n  for (const x of set) {\n    if (set.has(x - 1)) continue;\n    let y = x;\n    while (set.has(y + 1)) y++;\n    best = Math.max(best, y - x + 1);\n  }\n  return best;\n}',
  lesson: 'Set відповідає «чи є?» миттєво, а лічба лише від початків рядів робить усе за O(n).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Binary Tree Right Side View */
function rightRef(a: unknown) { const out: number[] = []; let q = [buildTree(a)].filter(Boolean) as T[]; while (q.length) { out.push(q[q.length - 1].val); q = q.flatMap((n) => [n.left, n.right].filter(Boolean) as T[]); } return out; }
const view: Level = {
  id: 'duel.view', world: 15, title: 'Погляд з правого флангу', topic: TOPIC,
  leetcode: lc(199, 'Binary Tree Right Side View'),
  brief: '<b>Погляд з правого флангу.</b> Раунд четвертий. Військо Турна стоїть деревом. Кого видно з правого боку?',
  statement: [
    'Турн вишикував військо, як родовід: <code>root</code> — сам Турн, у кожного командира щонайбільше двоє підлеглих, <code>left</code> і <code>right</code>.',
    'Еней дивиться на військо з правого флангу: на кожному рівні він бачить лише крайнього праворуч. Поверни значення, які він бачить, згори вниз. Для <code>[1, 2, 3, null, 5, null, 4]</code> — <code>[1, 3, 4]</code>; для <code>[1, 2, 3, 4]</code> — <code>[1, 3, 4]</code>: на третьому рівні є лише 4.',
    'Яку хитрість застосувати — вирішуй сам.',
  ],
  talk: [
    { who: 'turn', text: 'Моє військо — як дерево: я корінь, а далі — гілки. Ну ж бо, порахуй, кого бачиш.' },
    { who: 'fox', text: 'Ти вже бачив такі дерева. В Елісії. Я ж кажу, я тільки вболіваю!' },
  ],
  quip: { who: 'turn', text: 'Бачиш усіх, хто стоїть з краю. Ти небезпечний, троянцю.' },
  entry: 'rightSideView', observe: ['root'],
  starter: starter('rightSideView', [['root', 'TreeNode | null']], 'number[]', ['Погляд з правого флангу', 'Поверни значення крайніх правих вузлів на кожному рівні, згори вниз.'], '  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [{ args: [tree([1, 2, 3, null, 5, null, 4])], label: '[1, 2, 3, null, 5, null, 4]' }, { args: [tree([1, 2, 3, 4])], label: '[1, 2, 3, 4]' }],
  hidden: [{ args: [tree([])], label: '[]' }, { args: [tree([1, null, 3])], label: '[1, null, 3]' }, { args: [tree([1, 2, 3, 4, 5, 6, 7, 8])], label: '[1, 2, 3, 4, 5, 6, 7, 8]' }, { args: [tree([5, 4, null, 3, null, 2])], label: '[5, 4, null, 3, null, 2]' }],
  reference: rightRef,
  hints: ['Хитрість — обхід ушир рівнями, як в Елісії: з кожного рівня бери останнього.', 'level = [root]. Поки рівень не порожній: out.push(останній у level), а тоді збери дітей у next.', 'let level = root ? [root] : []; while (level.length) { out.push(level[level.length - 1].val); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; }'],
  solution: 'function rightSideView(root: TreeNode | null): number[] {\n  const out: number[] = [];\n  let level: TreeNode[] = root ? [root] : [];\n  while (level.length) {\n    out.push(level[level.length - 1].val);\n    const next: TreeNode[] = [];\n    for (const n of level) {\n      if (n.left) next.push(n.left);\n      if (n.right) next.push(n.right);\n    }\n    level = next;\n  }\n  return out;\n}',
  lesson: 'Обхід ушир рівнями: останній вузол кожного рівня — це той, кого видно справа.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. 3Sum */
function threeRef(a: number[]) {
  const n = a.slice().sort((x, y) => x - y), out: number[][] = [];
  for (let i = 0; i < n.length; i++) {
    if (i && n[i] === n[i - 1]) continue;
    let l = i + 1, r = n.length - 1;
    while (l < r) { const sum = n[i] + n[l] + n[r]; if (sum < 0) l++; else if (sum > 0) r--; else { out.push([n[i], n[l], n[r]]); while (l < r && n[l] === n[l + 1]) l++; l++; r--; } }
  }
  return out;
}
const tripleCheck = (tc: TestCase, r: CallResult): true | string => {
  const canon = (v: unknown) => (Array.isArray(v) ? v.map((t) => (Array.isArray(t) ? JSON.stringify([...t].sort((x, y) => x - y)) : JSON.stringify(t))).sort() : null);
  const got = canon(r.value), want = canon(tc.expected);
  if (got && JSON.stringify(got) === JSON.stringify(want)) return true;
  const n = Array.isArray(r.value) ? r.value.length : 0, m = (tc.expected as unknown[]).length;
  return L(`очікували ${m} різних трійок (порядок неважливий), отримали ${n}: ${JSON.stringify(r.value).slice(0, 80)}`, `expected ${m} different triples (any order), got ${n}: ${JSON.stringify(r.value).slice(0, 80)}`);
};
const finale: Level = {
  id: 'duel.three', world: 15, final: true, title: 'Останній удар', topic: TOPIC,
  leetcode: lc(15, '3Sum'),
  brief: '<b>Останній удар.</b> Фінальний раунд. Знайди всі трійки ударів, що разом дають рівновагу.',
  statement: [
    'Турн б\'ється з Енеєм сам на сам. <code>nums</code> — сили ударів: додатні — Енеєві, від\'ємні — Турнові. Щоб вибити з рук Турна уламок-оберіг, треба три удари, що разом дають рівно <code>0</code>.',
    'Поверни всі <b>різні</b> трійки <code>[a, b, c]</code> з різних місць <code>nums</code>, де <code>a + b + c = 0</code>. Трійки з тими самими числами вважаються однією. Порядок неважливий. Для <code>[-1, 0, 1, 2, -1, -4]</code> — <code>[[-1, -1, 2], [-1, 0, 1]]</code>.',
    'Ударів буває до 500, і перебирати всі трійки — це сто з гаком тисяч… на кожну секунду двобою. Яку хитрість застосувати — вирішуй сам.',
  ],
  talk: [
    { who: 'turn', text: 'Ну що ж, троянцю. Сам на сам. Оберіг Юнони зі мною — спробуй його вибити.' },
    { who: 'wolf', text: 'Енею, я тримаю Юнону! Тобто… я на неї дивлюся. Грізно. Бий!' },
    { who: 'fox', text: 'Усе, що треба, ти вже знаєш. Карфаген, Конотоп, скриня… Вибирай. Я вірю в тебе.' },
  ],
  quip: { who: 'turn', text: 'Здаюся… Оберіг твій. Юноно, ти обіцяла, що він не впорається!' },
  entry: 'threeSum', observe: ['nums'],
  starter: starter('threeSum', [['nums', 'number[]']], 'number[][]', ['Останній удар', 'Поверни всі різні трійки чисел з nums із сумою 0 (порядок неважливий).'], '  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [one([-1, 0, 1, 2, -1, -4]), one([0, 1, 1])],
  hidden: [one([0, 0, 0]), one([0, 0, 0, 0]), one([-2, 0, 1, 1, 2]), one([3, -2, 1, 0]), one([-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6])],
  big: { n: 500, make: (n) => { const r = rng(15); return [Array.from({ length: n }, () => Math.floor(r() * 2001) - 1000)]; }, readBudget: (n) => 3 * n * n },
  reference: threeRef,
  check: tripleCheck,
  wolf: { reads: (n) => Math.round((n * n * n) / 2), code: 'function threeSum(nums) {\n  const seen = new Set(), out = [];\n  for (let i = 0; i < nums.length; i++)\n    for (let j = i + 1; j < nums.length; j++)\n      for (let k = j + 1; k < nums.length; k++)\n        if (nums[i] + nums[j] + nums[k] === 0) {\n          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);\n          if (!seen.has(t.join())) { seen.add(t.join()); out.push(t); }\n        }\n  return out;\n}' },
  hints: ['Хитрість — Карфагенська: впорядкуй удари й для кожного першого шукай пару двома вказівниками назустріч.', 'Відсортуй копію. Для кожного i (пропускаючи однакові поспіль): l = i + 1, r = кінець; сума < 0 — l++, > 0 — r--, 0 — запиши й пропусти однакові.', 'for (let i = 0; i < a.length; i++) { if (i && a[i] === a[i - 1]) continue; let l = i + 1, r = a.length - 1; while (l < r) { const s = a[i] + a[l] + a[r]; if (s < 0) l++; else if (s > 0) r--; else { out.push([a[i], a[l], a[r]]); while (l < r && a[l] === a[l + 1]) l++; l++; r--; } } }'],
  solution: 'function threeSum(nums: number[]): number[][] {\n  const a = nums.slice().sort((x, y) => x - y);\n  const out: number[][] = [];\n  for (let i = 0; i < a.length; i++) {\n    if (i && a[i] === a[i - 1]) continue;\n    let l = i + 1, r = a.length - 1;\n    while (l < r) {\n      const sum = a[i] + a[l] + a[r];\n      if (sum < 0) l++;\n      else if (sum > 0) r--;\n      else {\n        out.push([a[i], a[l], a[r]]);\n        while (l < r && a[l] === a[l + 1]) l++;\n        l++;\n        r--;\n      }\n    }\n  }\n  return out;\n}',
  lesson: 'Сортування + два вказівники перетворюють перебір трійок O(n³) на O(n²). На співбесіді головне — впізнати знайомий прийом у новій задачі.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const duel: World = {
  n: 15, name: 'Двобій з Турном', song: 'Пісня VI · Лаціум', topic: 'Фінал: усі хитрощі', fox: 'rainbow',
  host: { who: 'Турн', line: 'Останній уламок у мене, троянцю. Юнона дала мені його як оберіг. Здобудь — якщо зможеш.' },
  motif: 'egg', trick: 'Писанка: як упізнати прийом',
  levels: [strength, shield, ranks, view, finale],
};
