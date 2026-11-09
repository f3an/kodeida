import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

/*
 * Світ 12 — Змієві вали (легенда про Кирила Кожум'яку): інтервали й жадібні алгоритми.
 * Вал — це відрізок [start, end]. Хитрість світу: впорядкуй вали за початком або кінцем,
 * і тоді на кожному кроці досить дивитися лише на останній. Вовк порівнює кожен вал з кожним.
 */

type Iv = number[][];
const g = (a: unknown) => JSON.stringify(a).replace(/],\[/g, '], [').replace(/,(?=-?\d)/g, ', ');
const ivs = (a: Iv): TestCase => ({ args: [a], label: g(a) });
const copy = (a: Iv) => a.map((r) => r.slice());
/** Багато валів, що часто накладаються: для великого тесту. */
const randomWalls = (n: number, seed: number) => { const r = rng(seed); return Array.from({ length: n }, () => { const s = Math.floor(r() * n * 4); return [s, s + 1 + Math.floor(r() * 8)]; }); };

/* 1. Merge Intervals */
function mergeRef(a: Iv) { const s = copy(a).sort((x, y) => x[0] - y[0]); const out: Iv = []; for (const v of s) { const last = out[out.length - 1]; if (last && v[0] <= last[1]) last[1] = Math.max(last[1], v[1]); else out.push(v); } return out; }
const merge: Level = {
  id: 'val.merge', world: 12, title: 'Зшити вали', topic: 'інтервали: впорядкуй і зшивай',
  leetcode: lc(56, 'Merge Intervals'),
  brief: '<b>Зшити вали.</b> Уламок порізав Змієві вали на шматки, що налазять один на один. Зший їх у суцільні вали.',
  statement: [
    'Кирило Кожум\'яка колись заорав Змія й насипав вали. Тепер вали — це шматки <code>[start, end]</code>, що налазять один на один, і в них плутаються оборонці.',
    'Злий усі шматки, що перекриваються або торкаються, і поверни суцільні вали, впорядковані за початком. Для <code>[[1, 3], [2, 6], [8, 10], [15, 18]]</code> вийде <code>[[1, 6], [8, 10], [15, 18]]</code>; <code>[1, 4]</code> і <code>[4, 5]</code> торкаються, тож стають <code>[1, 5]</code>.',
    'Шматків буває до 10 000. Порівнювати кожен з кожним — довго. Впорядкуй шматки за початком: тоді новий шматок може налізти лише на <b>останній</b> зшитий вал.',
  ],
  tool: {
    name: 'сортування за початком',
    text: [
      '<code>intervals.sort((a, b) => a[0] - b[0])</code> шикує вали за початком. Після цього йди по них і тримай останній зшитий вал.',
      'Новий починається не пізніше, ніж кінчається останній? Тоді зшивай: кінець — більший з двох. Ні — це новий окремий вал.',
    ],
    code: '// після сортування: [1, 3] [2, 6] [8, 10]\n// [2, 6] починається до кінця [1, 3] → [1, 6]\n// [8, 10] — після 6 → новий вал',
  },
  talk: [
    { who: 'kozhumyaka', text: 'Я ці вали плугом орав, а Змій тягнув. Рівні були, суцільні! А тепер — клапті, та ще й один на одному.' },
    { who: 'fox', text: 'Пошикуймо клапті за початком. Тоді кожен новий або дошиваємо до останнього, або починаємо новий вал.' },
  ],
  quip: { who: 'kozhumyaka', text: 'Оце вал! Хоч знову Змія запрягай.' },
  entry: 'merge', observe: ['intervals'],
  starter: starter('merge', [['intervals', 'number[][]']], 'number[][]', ['Зшити вали', 'Злий вали [start, end], що перекриваються або торкаються.', 'Поверни суцільні вали за зростанням початку.'], '  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [ivs([[1, 3], [2, 6], [8, 10], [15, 18]]), ivs([[1, 4], [4, 5]])],
  hidden: [ivs([[1, 4]]), ivs([[1, 4], [0, 4]]), ivs([[1, 4], [2, 3]]), ivs([[5, 6], [1, 2], [3, 4]]), ivs([[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]])],
  big: { n: 10000, make: (n) => [randomWalls(n, 56)], readBudget: (n) => 60 * n },
  reference: mergeRef,
  wolf: { reads: (n) => n * n, code: 'function merge(intervals) {\n  // порівняти кожен вал з кожним і з\'єднати ті, що перекриваються\n  const root = intervals.map((_, i) => i);\n  const find = (x) => { while (root[x] !== x) x = root[x]; return x; };\n  for (let i = 0; i < intervals.length; i++)\n    for (let j = i + 1; j < intervals.length; j++)\n      if (intervals[i][0] <= intervals[j][1] && intervals[j][0] <= intervals[i][1]) root[find(i)] = find(j);\n  const walls = new Map();\n  for (let i = 0; i < intervals.length; i++) {\n    const r = find(i), w = walls.get(r) ?? [Infinity, -Infinity];\n    walls.set(r, [Math.min(w[0], intervals[i][0]), Math.max(w[1], intervals[i][1])]);\n  }\n  return [...walls.values()].sort((a, b) => a[0] - b[0]);\n}' },
  hints: ['Якщо вали впорядковані за початком, на який із уже зшитих може налізти новий?', 'Відсортуй за v[0]. Для кожного v: якщо out не порожній і v[0] ≤ кінець останнього — розшир кінець до max; інакше out.push([v[0], v[1]]).', 'intervals.sort((a, b) => a[0] - b[0]); for (const v of intervals) { const last = out[out.length - 1]; if (last && v[0] <= last[1]) last[1] = Math.max(last[1], v[1]); else out.push([v[0], v[1]]); }'],
  solution: 'function merge(intervals: number[][]): number[][] {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const out: number[][] = [];\n  for (const v of intervals) {\n    const last = out[out.length - 1];\n    if (last && v[0] <= last[1]) last[1] = Math.max(last[1], v[1]);\n    else out.push([v[0], v[1]]);\n  }\n  return out;\n}',
  lesson: 'Впорядковані за початком інтервали перекриваються лише з останнім зшитим: сортування O(n log n) і один прохід.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Insert Interval */
function insertRef(a: Iv, nv: number[]) { return mergeRef([...copy(a), nv.slice()]); }
const ins = (a: Iv, nv: number[]): TestCase => ({ args: [a, nv], label: `${g(a)}, ${g(nv)}` });
const insert: Level = {
  id: 'val.insert', world: 12, title: 'Новий вал', topic: 'інтервали: до, перетин, після',
  leetcode: lc(57, 'Insert Interval'),
  brief: '<b>Новий вал.</b> Вали вже зшиті й упорядковані. Кожум\'яка насипає ще один — встав його, не зламавши порядку.',
  statement: [
    '<code>intervals</code> — суцільні вали, що не перекриваються й ідуть за зростанням початку. Кожум\'яка насипає новий вал <code>newInterval</code>.',
    'Встав його і злий з тими, на які він налазить або які торкається. Поверни вали за зростанням. Для <code>[[1, 3], [6, 9]]</code> і <code>[2, 5]</code> вийде <code>[[1, 5], [6, 9]]</code>; для <code>[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]]</code> і <code>[4, 8]</code> — <code>[[1, 2], [3, 10], [12, 16]]</code>.',
    'Вали вже впорядковані, тож сортувати не треба. Пройди один раз: спершу ті, що повністю <b>до</b> нового, потім ті, що з ним <b>перетинаються</b> (їх зливаєш у новий), а потім усі, що <b>після</b>.',
  ],
  tool: {
    name: 'три частини одного проходу',
    text: [
      'До: вал кінчається раніше, ніж починається новий (<code>v[1] &lt; start</code>) — переписуй як є.',
      'Перетин: вал починається не пізніше за кінець нового — розширюй новий: початок — менший, кінець — більший. Решта — після: дописуй новий, а за ним усі, що лишились.',
    ],
    code: '// [[1, 2], [3, 5], [6, 7], [8, 10]] + [4, 8]\n// до:      [1, 2]\n// перетин: [3, 5] [6, 7] [8, 10] → [3, 10]\n// після:   —',
  },
  talk: [
    { who: 'kozhumyaka', text: 'Насиплю ще один вал. Тільки куди? Не хочу, щоб знову все переплуталось.' },
    { who: 'fox', text: 'Ті, що раніше, — не чіпаємо. Ті, що налазять, — зливаємо з новим. Ті, що далі, — просто дописуємо.' },
  ],
  quip: { who: 'kozhumyaka', text: 'Став як улитий. Плуг мені, плуг!' },
  entry: 'insert', observe: ['intervals', null],
  starter: starter('insert', [['intervals', 'number[][]'], ['newInterval', 'number[]']], 'number[][]', ['Новий вал', 'intervals — впорядковані вали без перекриттів. Встав newInterval і злий, що треба.'], '  const out = [];\n  let [start, end] = newInterval;\n  let i = 0;\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [ins([[1, 3], [6, 9]], [2, 5]), ins([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])],
  hidden: [ins([], [5, 7]), ins([[1, 5]], [2, 3]), ins([[1, 5]], [6, 8]), ins([[3, 5]], [1, 2]), ins([[1, 5]], [0, 0]), ins([[1, 2], [4, 5]], [2, 4])],
  reference: insertRef,
  hints: ['Які вали точно не зачепить новий?', 'Поки intervals[i][1] < start — у out як є. Поки intervals[i][0] ≤ end — start = min, end = max. Потім out.push([start, end]) і решту.', 'while (i < intervals.length && intervals[i][1] < start) out.push(intervals[i++]); while (i < intervals.length && intervals[i][0] <= end) { start = Math.min(start, intervals[i][0]); end = Math.max(end, intervals[i][1]); i++; } out.push([start, end]); while (i < intervals.length) out.push(intervals[i++]);'],
  solution: 'function insert(intervals: number[][], newInterval: number[]): number[][] {\n  const out: number[][] = [];\n  let [start, end] = newInterval;\n  let i = 0;\n  while (i < intervals.length && intervals[i][1] < start) out.push([intervals[i][0], intervals[i++][1]]);\n  while (i < intervals.length && intervals[i][0] <= end) {\n    start = Math.min(start, intervals[i][0]);\n    end = Math.max(end, intervals[i][1]);\n    i++;\n  }\n  out.push([start, end]);\n  while (i < intervals.length) out.push([intervals[i][0], intervals[i++][1]]);\n  return out;\n}',
  lesson: 'Упорядковані інтервали діляться на три частини — до, перетин, після — і вставка займає один прохід O(n).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Jump Game */
function jumpRef(a: number[]) { let far = 0; for (let i = 0; i < a.length && i <= far; i++) far = Math.max(far, i + a[i]); return far >= a.length - 1; }
const nums = (a: number[]): TestCase => ({ args: [a], label: g(a) });
const jump: Level = {
  id: 'val.jump', world: 12, title: 'Стрибки через рови', topic: 'жадібно: найдальша досяжна точка',
  leetcode: lc(55, 'Jump Game'),
  brief: '<b>Стрибки через рови.</b> Перед валами — рови з кладками. Чи дострибне Еней до останньої кладки?',
  statement: [
    'Перед валами викопано рови, а через них покладено кладки. <code>nums[i]</code> — на скільки кладок <b>щонайбільше</b> можна стрибнути вперед з кладки <code>i</code> (можна й менше). Еней стоїть на першій.',
    'Поверни <code>true</code>, якщо можна дістатися останньої кладки. <code>[2, 3, 1, 1, 4]</code> — <code>true</code> (1 → 2 → 5 або 1 → 3 → 4 → 5). <code>[3, 2, 1, 0, 4]</code> — <code>false</code>: усі шляхи впираються в кладку з нулем.',
    'Кладок буває до 10 000. Не перебирай усі шляхи. Іди зліва направо й тримай <b>найдальшу</b> кладку, до якої вже можна дострибнути. Якщо ти на кладці, куди дострибнути не можна, — далі шляху немає.',
  ],
  tool: {
    name: 'жадібний крок',
    text: [
      'Жадібний алгоритм на кожному кроці робить найкращий вибір зараз і ніколи не повертається. Тут найкращий вибір — пам\'ятати, як далеко можна дістати: <code>far = max(far, i + nums[i])</code>.',
      'Якщо <code>i &gt; far</code> — до кладки <code>i</code> не дістатися, і до решти теж.',
    ],
    code: '// [2, 3, 1, 1, 4]\n// i = 0: far = 2\n// i = 1: far = 4 — вже дістаємо останню!',
  },
  talk: [
    { who: 'kozhumyaka', text: 'Перед валами рови, а над ними кладки. Дехто стрибає далеко, а дехто — ні на крок.' },
    { who: 'wolf', text: 'Я спробую кожен стрибок з кожної кладки! А потім усі стрибки з тих, куди дострибнув…' },
    { who: 'fox', text: 'Досить знати, як далеко можна дістати. Іду кладка за кладкою й посуваю цю межу.' },
  ],
  quip: { who: 'enei', text: 'Перестрибнув і ноги не замочив. Майже.' },
  entry: 'canJump', observe: ['nums'],
  starter: starter('canJump', [['nums', 'number[]']], 'boolean', ['Стрибки через рови', 'nums[i] — найдовший стрибок з кладки i.', 'true, якщо з першої кладки можна дістатися останньої.'], '  let far = 0;\n  // Слово ладу пиши тут\n\n  return false;\n'),
  examples: [nums([2, 3, 1, 1, 4]), nums([3, 2, 1, 0, 4])],
  hidden: [nums([0]), nums([1, 0]), nums([0, 1]), nums([2, 0, 0]), nums([1, 1, 0, 1]), nums([5, 0, 0, 0, 0, 0, 1])],
  big: { n: 10000, make: (n) => { const r = rng(55); const a = Array.from({ length: n }, () => 1 + Math.floor(r() * 3)); a[n - 2] = 0; a[n - 3] = 1; return [a]; }, readBudget: (n) => 3 * n },
  reference: jumpRef,
  wolf: { reads: (n) => Math.round((n * n) / 4), code: 'function canJump(nums) {\n  const ok = new Array(nums.length).fill(false);\n  ok[0] = true;\n  for (let i = 1; i < nums.length; i++)\n    for (let j = 0; j < i; j++)\n      if (ok[j] && j + nums[j] >= i) { ok[i] = true; break; }\n  return ok[nums.length - 1];\n}' },
  hints: ['Що достатньо пам\'ятати про всі вже пройдені кладки?', 'Для кожного i: якщо i > far — false. Інакше far = max(far, i + nums[i]). Пройшов усе — true.', 'for (let i = 0; i < nums.length; i++) { if (i > far) return false; far = Math.max(far, i + nums[i]); } return true;'],
  solution: 'function canJump(nums: number[]): boolean {\n  let far = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > far) return false;\n    far = Math.max(far, i + nums[i]);\n  }\n  return true;\n}',
  lesson: 'Жадібно: тримай найдальшу досяжну точку. Один прохід O(n) замість перебору всіх шляхів.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Non-overlapping Intervals */
function eraseRef(a: Iv) { const s = copy(a).sort((x, y) => x[1] - y[1]); let end = -Infinity, keep = 0; for (const [l, r] of s) if (l >= end) { keep++; end = r; } return a.length - keep; }
const erase: Level = {
  id: 'val.erase', world: 12, title: 'Зайві вали', topic: 'жадібно: тримай той, що кінчається раніше',
  leetcode: lc(435, 'Non-overlapping Intervals'),
  brief: '<b>Зайві вали.</b> Деякі вали заважають один одному. Прибери найменше, щоб решта не перекривалась.',
  statement: [
    'Кожум\'яка хоче, щоб вали стояли поруч, але не налазили один на один: між ними має пройти оборонець. <code>intervals[i] = [start, end]</code>; вали, що лише торкаються (<code>[1, 2]</code> і <code>[2, 3]</code>), не заважають.',
    'Поверни, яку <b>найменшу</b> кількість валів треба прибрати. Для <code>[[1, 2], [2, 3], [3, 4], [1, 3]]</code> — <code>1</code> (прибрати <code>[1, 3]</code>); для <code>[[1, 2], [1, 2], [1, 2]]</code> — <code>2</code>.',
    'Хитрість — лишати якнайбільше валів. Впорядкуй за <b>кінцем</b> і бери вал щоразу, коли він починається не раніше, ніж кінчився останній узятий. Вал, що кінчається раніше, лишає більше місця решті.',
  ],
  tool: {
    name: 'сортування за кінцем',
    text: [
      '<code>intervals.sort((a, b) => a[1] - b[1])</code>. Тримай <code>end</code> — кінець останнього залишеного валу.',
      'Вал починається не раніше за <code>end</code> — лишай його й онови <code>end</code>. Інакше — він зайвий. Відповідь: скільки прибрали.',
    ],
    code: '// за кінцем: [1, 2] [2, 3] [1, 3] [3, 4]\n// [1, 2] ✓  [2, 3] ✓  [1, 3] ✗ (1 < 3)  [3, 4] ✓\n// прибрали 1',
  },
  talk: [
    { who: 'kozhumyaka', text: 'Насипав забагато — тепер вали один на одному, і між ними не пройти.' },
    { who: 'fox', text: 'Лишаймо той вал, що кінчається найраніше. Він лишає найбільше місця для інших.' },
  ],
  quip: { who: 'kozhumyaka', text: 'Тепер між валами й віз проїде. А Змій — ні.' },
  entry: 'eraseOverlapIntervals', observe: ['intervals'],
  starter: starter('eraseOverlapIntervals', [['intervals', 'number[][]']], 'number', ['Зайві вали', 'Поверни найменшу кількість валів, які треба прибрати, щоб решта не перекривалась.'], '  let end = -Infinity, removed = 0;\n  // Слово ладу пиши тут\n\n  return removed;\n'),
  examples: [ivs([[1, 2], [2, 3], [3, 4], [1, 3]]), ivs([[1, 2], [1, 2], [1, 2]])],
  hidden: [ivs([[1, 2], [2, 3]]), ivs([[1, 100], [11, 22], [1, 11], [2, 12]]), ivs([[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]), ivs([[5, 6]]), ivs([[-2, 1], [-1, 0], [0, 3], [2, 5]])],
  reference: eraseRef,
  hints: ['Який вал вигідніше лишити з двох, що перекриваються?', 'Відсортуй за кінцем. Для кожного [l, r]: якщо l ≥ end — end = r (лишаємо), інакше removed++.', 'intervals.sort((a, b) => a[1] - b[1]); for (const [l, r] of intervals) { if (l >= end) end = r; else removed++; }'],
  solution: 'function eraseOverlapIntervals(intervals: number[][]): number {\n  intervals.sort((a, b) => a[1] - b[1]);\n  let end = -Infinity, removed = 0;\n  for (const [l, r] of intervals) {\n    if (l >= end) end = r;\n    else removed++;\n  }\n  return removed;\n}',
  lesson: 'Щоб лишити найбільше інтервалів, бери щоразу той, що кінчається найраніше: сортування за кінцем і один прохід.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Minimum Number of Arrows */
function arrowsRef(a: Iv) { const s = copy(a).sort((x, y) => x[1] - y[1]); let n = 0, at = -Infinity; for (const [l, r] of s) if (l > at) { n++; at = r; } return n; }
const arrows: Level = {
  id: 'val.arrows', world: 12, final: true, title: 'Стріли на зміїв', topic: 'жадібно: стріляй у кінець',
  leetcode: lc(452, 'Minimum Number of Arrows to Burst Balloons'),
  brief: '<b>Стріли на зміїв.</b> Змії лізуть хвилями, кожен займає відрізок над валом. Скільки найменше стріл, щоб влучити в усіх?',
  statement: [
    'Через щілини у валах лізуть змії. Кожен змій тягнеться над валом від <code>points[i][0]</code> до <code>points[i][1]</code>. Стріла, пущена вертикально в точці <code>x</code>, влучає в усіх зміїв, у яких <code>start ≤ x ≤ end</code>.',
    'Поверни найменшу кількість стріл, щоб влучити в кожного змія. Для <code>[[10, 16], [2, 8], [1, 6], [7, 12]]</code> — <code>2</code>: стріла в 6 влучає в <code>[2, 8]</code> і <code>[1, 6]</code>, стріла в 12 — у <code>[10, 16]</code> і <code>[7, 12]</code>.',
    'Впорядкуй зміїв за <b>кінцем</b>. Перша стріла — в кінець першого змія: так вона зачепить якнайбільше інших. Наступна стріла потрібна лише тоді, коли змій починається правіше за останню стрілу.',
  ],
  tool: {
    name: 'стріла в найраніший кінець',
    text: [
      'Хтось мусить влучити в змія, що кінчається найраніше. Найвигідніше — стріляти саме в його кінець: правіше вже не можна, а лівіше — зачепиш менше.',
      'Тримай <code>at</code> — точку останньої стріли. Змій починається після <code>at</code>? Нова стріла в його кінець.',
    ],
    code: '// за кінцем: [1, 6] [2, 8] [7, 12] [10, 16]\n// стріла в 6: [1, 6] [2, 8]\n// 7 > 6 → стріла в 12: [7, 12] [10, 16]\n// 2 стріли',
  },
  talk: [
    { who: 'kozhumyaka', text: 'Лізуть! Хвиля за хвилею! Стріл у нас обмаль — кожна має влучити в якомога більше.' },
    { who: 'wolf', text: 'Я перепробую всі точки на валу й усі набори стріл! Ой, вони вже тут…' },
    { who: 'fox', text: 'Стріляй у кінець змія, що закінчується найраніше. Одна стріла — ціла зграя.' },
  ],
  quip: { who: 'kozhumyaka', text: 'Відбили! Тепер я їх знову в плуг запряжу.' },
  entry: 'findMinArrowShots', observe: ['points'],
  starter: starter('findMinArrowShots', [['points', 'number[][]']], 'number', ['Стріли на зміїв', 'points[i] = [start, end] — змій. Стріла в x влучає, якщо start ≤ x ≤ end.', 'Поверни найменшу кількість стріл.'], '  let arrows = 0, at = -Infinity;\n  // Слово ладу пиши тут\n\n  return arrows;\n'),
  examples: [ivs([[10, 16], [2, 8], [1, 6], [7, 12]]), ivs([[1, 2], [3, 4], [5, 6], [7, 8]])],
  hidden: [ivs([[1, 2], [2, 3], [3, 4], [4, 5]]), ivs([[1, 2]]), ivs([[2, 3], [2, 3]]), ivs([[-5, -1], [-3, 2], [0, 4], [3, 7]]), ivs([[9, 12], [1, 10], [4, 11], [8, 12], [3, 9], [6, 9], [6, 7]])],
  big: { n: 10000, make: (n) => [randomWalls(n, 452)], readBudget: (n) => 60 * n },
  reference: arrowsRef,
  wolf: { reads: (n) => Math.round((n * n) / 2), code: 'function findMinArrowShots(points) {\n  const hit = new Array(points.length).fill(false);\n  let arrows = 0;\n  for (;;) {\n    let first = -1;\n    for (let i = 0; i < points.length; i++) if (!hit[i] && (first < 0 || points[i][1] < points[first][1])) first = i;\n    if (first < 0) return arrows;\n    const x = points[first][1];\n    arrows++;\n    for (let i = 0; i < points.length; i++) if (points[i][0] <= x && x <= points[i][1]) hit[i] = true;\n  }\n}' },
  hints: ['Куди вигідніше за все пустити стрілу в змія, що кінчається найраніше?', 'Відсортуй за кінцем. Для кожного [l, r]: якщо l > at — arrows++, at = r.', 'points.sort((a, b) => a[1] - b[1]); for (const [l, r] of points) if (l > at) { arrows++; at = r; }'],
  solution: 'function findMinArrowShots(points: number[][]): number {\n  points.sort((a, b) => a[1] - b[1]);\n  let arrows = 0, at = -Infinity;\n  for (const [l, r] of points) {\n    if (l > at) { arrows++; at = r; }\n  }\n  return arrows;\n}',
  lesson: 'Стріляй у найраніший кінець: вона влучить у всіх, хто вже почався. Сортування за кінцем і один прохід.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const ramparts: World = {
  n: 12, name: 'Змієві вали', song: 'Пісня V · Ліси й гори', topic: 'Інтервали, Greedy', fox: '#c0623a',
  host: { who: 'Кирило Кожум\'яка', line: 'Я Змія в плуг запряг і вали проорав. А уламок їх посік на клапті!' },
  motif: 'zigzag', trick: 'Зигзаг: інтервали й жадібний вибір',
  levels: [merge, insert, jump, erase, arrows],
};
