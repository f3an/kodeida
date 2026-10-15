import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

/*
 * Світ 6 — Сицилія, ігри Ацеста: ковзне вікно й купа.
 * Головна думка: не перераховуй усе для кожного вікна — посунь його, додавши нове й прибравши старе;
 * а коли щоразу треба найбільший чи найменший, тримай їх у купі (черзі з пріоритетом).
 */

const one = (a: unknown): TestCase => ({ args: [a], label: JSON.stringify(a) });

/* 1. Вікно фіксованої довжини */
const lapsCase = (a: number[], k: number): TestCase => ({ args: [a, k], label: `${JSON.stringify(a)}, ${k}` });
function lapsRef(a: number[], k: number) { let best = -Infinity; for (let i = 0; i + k <= a.length; i++) { let s = 0; for (let j = i; j < i + k; j++) s += a[j]; best = Math.max(best, s); } return best; }
const laps: Level = {
  id: 'sicily.laps', world: 6, title: 'Найкращі k кіл', topic: 'вікно фіксованої довжини',
  leetcode: lc(643, 'Maximum Average Subarray I'),
  brief: '<b>Найкращі k кіл.</b> Знайди найбільшу суму очок за <code>k</code> кіл перегонів поспіль.',
  statement: [
    'На іграх Ацеста колісниці мчать коло за колом. <code>laps[i]</code> — очки, здобуті на колі <code>i</code>. Табло зламалось, і треба знайти найкращий відрізок.',
    'Поверни найбільшу суму очок за <code>k</code> кіл <b>поспіль</b>. Завжди <code>1 ≤ k ≤ n</code>.',
    'Обмеження: <code>n ≤ 10⁴</code>, <code>k</code> може бути тисяча. Вовк для кожного відрізка заново складає всі <code>k</code> кіл. А сусідні відрізки відрізняються лише двома колами.',
  ],
  tool: {
    name: 'ковзне вікно',
    text: [
      'Порахуй суму першого вікна з <code>k</code> кіл. Далі <b>посувай</b> його на одне коло: додай коло, що зайшло справа, і відніми те, що вийшло зліва.',
      'Так кожне коло додається один раз і віднімається один раз, хоч би яким великим було вікно.',
    ],
    code: '// laps = [3, 1, 4, 1, 5], k = 3\n// [3 1 4] 1 5   сума 8\n// 3 [1 4 1] 5   8 - 3 + 1 = 6\n// 3 1 [4 1 5]   6 - 1 + 5 = 10',
  },
  talk: [
    { who: 'acestes', text: 'Ігри на честь Анхіза! Але табло зламалось. Хто ж показав найкращі кола?' },
    { who: 'fox', text: 'Я суддюю. Енею, не складай кожен відрізок з нуля: посунь рамку на одне коло — одне додай, одне відніми.' },
  ],
  quip: { who: 'acestes', text: 'Ось де мчали найшвидше! Тепер хоч знаємо, кому вінок.' },
  entry: 'bestLaps', observe: ['laps', null],
  starter: starter('bestLaps', [['laps', 'number[]'], ['k', 'number']], 'number', ['Найкращі k кіл', 'laps[i] — очки за коло i. Поверни найбільшу суму за k кіл поспіль.'], '  let sum = 0;\n  // Слово ладу пиши тут\n\n  return sum;\n'),
  examples: [lapsCase([3, 1, 4, 1, 5, 9, 2, 6], 3), lapsCase([5, -2, 7], 1)],
  hidden: [lapsCase([4], 1), lapsCase([1, 2, 3, 4, 5], 5), lapsCase([-1, -2, -3, -4], 2), lapsCase([10, 0, 0, 0, 10, 10], 2), lapsCase([2, 2, 2, 2], 3)],
  big: { n: 10000, make: (n) => { const r = rng(643); return [Array.from({ length: n }, () => Math.floor(r() * 100)), 1000]; }, readBudget: (n) => 10 * n },
  reference: lapsRef,
  wolf: { reads: (n) => Math.round(n * 1000 * 0.9), code: 'function bestLaps(laps, k) {\n  let best = -Infinity;\n  for (let i = 0; i + k <= laps.length; i++) {\n    let s = 0;\n    for (let j = i; j < i + k; j++) s += laps[j];\n    best = Math.max(best, s);\n  }\n  return best;\n}' },
  hints: ['Чим відрізняються два сусідні відрізки по k кіл?', 'Сума першого вікна; далі для кожного i від k: sum += laps[i] − laps[i − k], онови найкраще.', 'for (i < k) sum += laps[i]; let best = sum; for (i = k; i < n; i++) { sum += laps[i] - laps[i - k]; best = Math.max(best, sum); }'],
  solution: 'function bestLaps(laps: number[], k: number): number {\n  let sum = 0;\n  for (let i = 0; i < k; i++) sum += laps[i];\n  let best = sum;\n  for (let i = k; i < laps.length; i++) {\n    sum += laps[i] - laps[i - k];\n    best = Math.max(best, sum);\n  }\n  return best;\n}',
  lesson: 'Ковзне вікно не рахує заново: нове входить, старе виходить, а решта суми вже готова.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Best Time to Buy and Sell Stock */
function stockRef(p: number[]) { let best = 0; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) best = Math.max(best, p[j] - p[i]); return best; }
const boat: Level = {
  id: 'sicily.boat', world: 6, title: 'Човен на продаж', topic: 'найкраще досі',
  leetcode: lc(121, 'Best Time to Buy and Sell Stock'),
  brief: '<b>Човен на продаж.</b> Ціни на човни щодня різні. Коли купити й коли продати, щоб заробити найбільше?',
  statement: [
    'Микита вирішив заробити на перегонах човнів. <code>prices[i]</code> — ціна човна в день <code>i</code>.',
    'Купити можна один раз і продати один раз, <b>пізніше</b> за купівлю. Поверни найбільший заробіток; якщо заробити не вийде — <code>0</code>.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк перебирає всі пари днів. А досить пам\'ятати найдешевший день, який уже минув.',
  ],
  tool: {
    name: 'найкраще досі',
    text: [
      'Ідучи днями, тримай <code>minPrice</code> — найнижчу ціну серед уже минулих днів. Продати сьогодні вигідніше за все, якщо купив саме тоді.',
      'Тож для кожного дня: заробіток <code>price - minPrice</code>, онови найкращий, а потім онови <code>minPrice</code>. Один прохід.',
    ],
    code: '// prices = [7, 1, 5, 3, 6, 4]\n// день 1: min = 1\n// день 4: 6 - 1 = 5 — найкраще',
  },
  talk: [
    { who: 'fox', text: 'Човни щодня дешевшають і дорожчають. Хочу купити дешево, продати дорого. Лисяча справа!' },
    { who: 'wolf', text: 'А я перевірю кожну пару днів! Купити тут, продати там, і там, і там…' },
    { who: 'fox', text: 'Ти ще перший день не перебрав, а я вже знаю: досить пам\'ятати найдешевший день позаду.' },
  ],
  quip: { who: 'fox', text: 'Купив дешево, продав дорого. Ацест каже, що це не спорт. А я кажу — ще й який.' },
  entry: 'maxProfit', observe: ['prices'],
  starter: starter('maxProfit', [['prices', 'number[]']], 'number', ['Човен на продаж', 'prices[i] — ціна в день i. Поверни найбільший заробіток (купити раніше, продати пізніше) або 0.'], '  let best = 0;\n  // Слово ладу пиши тут\n\n  return best;\n'),
  examples: [one([7, 1, 5, 3, 6, 4]), one([7, 6, 4, 3, 1])],
  hidden: [one([1]), one([1, 2]), one([2, 1, 2, 1, 0, 1, 2]), one([3, 3, 5, 0, 0, 3, 1, 4]), one([2, 4, 1])],
  big: { n: 10000, make: (n) => { const r = rng(121); return [Array.from({ length: n }, (_, i) => 20000 - i + Math.floor(r() * 50))]; }, readBudget: (n) => 10 * n },
  reference: stockRef,
  wolf: { reads: (n) => n * (n - 1), code: 'function maxProfit(prices) {\n  let best = 0;\n  for (let i = 0; i < prices.length; i++)\n    for (let j = i + 1; j < prices.length; j++)\n      best = Math.max(best, prices[j] - prices[i]);\n  return best;\n}' },
  hints: ['Якщо продаєш сьогодні, коли найвигідніше було купити?', 'Тримай minPrice — найнижчу ціну до сьогодні. best = max(best, ціна − minPrice); потім онови minPrice.', 'let minPrice = Infinity; for (p of prices) { best = Math.max(best, p - minPrice); minPrice = Math.min(minPrice, p); }'],
  solution: 'function maxProfit(prices: number[]): number {\n  let best = 0, minPrice = Infinity;\n  for (let i = 0; i < prices.length; i++) {\n    const p = prices[i];\n    best = Math.max(best, p - minPrice);\n    minPrice = Math.min(minPrice, p);\n  }\n  return best;\n}',
  lesson: 'Найкращу пару не треба шукати серед усіх пар: досить пам\'ятати найкраще з того, що вже позаду.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Longest Substring Without Repeating Characters */
function songRef(s: string) { let best = 0; for (let i = 0; i < s.length; i++) { const seen = new Set<string>(); for (let j = i; j < s.length && !seen.has(s[j]); j++) { seen.add(s[j]); best = Math.max(best, j - i + 1); } } return best; }
const song: Level = {
  id: 'sicily.song', world: 6, title: 'Пісня без повторів', topic: 'вікно змінної довжини',
  leetcode: lc(3, 'Longest Substring Without Repeating Characters'),
  brief: '<b>Пісня без повторів.</b> Знайди найдовший відрізок пісні, де жодна нота не повторюється.',
  statement: [
    'Співці змагаються в імпровізації. Пісню записано нотами-літерами: <code>s</code>. Судді шукають найдовший відрізок <b>поспіль</b>, де всі ноти різні.',
    'Поверни довжину такого відрізка.',
    'Вікно тут гумове: праворуч додаєш ноту, а якщо вона вже є у вікні — зліва викидаєш, доки повтор не зникне.',
  ],
  tool: {
    name: 'вікно, що тягнеться і стискається',
    text: [
      'Дві межі: <code>left</code> і <code>right</code>. <code>right</code> щоразу йде на одну ноту вперед. Що є у вікні, тримай у <code>Set</code>.',
      'Якщо нова нота вже у вікні, посувай <code>left</code> і викидай ноти з <code>Set</code>, доки повтор не зникне. Довжина вікна — <code>right - left + 1</code>.',
    ],
    code: '// s = "abcabcbb"\n// [abc]abcbb       — 3, далі прийшла "a"\n// a[bca]bcbb       — викинули стару "a"\n// найдовше без повторів: 3',
  },
  talk: [
    { who: 'acestes', text: 'Співці співають без кінця, а судді сперечаються: чия пісня найдовше не повторювалась?' },
    { who: 'fox', text: 'Рамку можна не лише посувати, а й розтягувати та стискати. Нова нота — праворуч; повтор — викидаємо зліва.' },
  ],
  quip: { who: 'acestes', text: 'Переможець — той, хто не повторювався. Шкода, що до промов це правило не застосуєш.' },
  entry: 'longestUnique', observe: ['s'], memory: true,
  starter: starter('longestUnique', [['s', 'string']], 'number', ['Пісня без повторів', 'Поверни довжину найдовшого відрізка s поспіль, де всі символи різні.'], '  const inWindow = new Set();\n  let left = 0, best = 0;\n  // Слово ладу пиши тут\n\n  return best;\n'),
  examples: [one('abcabcbb'), one('bbbbb')],
  hidden: [one(''), one('a'), one('pwwkew'), one('abba'), one('dvdf'), one('abcdef')],
  reference: songRef,
  hints: ['Що робити, коли нота, що прийшла справа, вже є у вікні?', 'right іде вперед; поки s[right] у Set — видаляй s[left] і left++; потім додай s[right] і онови best.', 'for (right) { while (inWindow.has(s[right])) inWindow.delete(s[left++]); inWindow.add(s[right]); best = Math.max(best, right - left + 1); }'],
  solution: 'function longestUnique(s: string): number {\n  const inWindow = new Set<string>();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    while (inWindow.has(ch)) inWindow.delete(s[left++]);\n    inWindow.add(ch);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
  lesson: 'Гумове вікно: росте праворуч, стискається зліва, коли порушено правило. Кожна нота заходить і виходить лише раз.',
  scene: { type: 'array', skin: 'letter', mode: 'scan' },
};

/* 4. Last Stone Weight */
function stonesRef(a: number[]) { const s = a.slice(); while (s.length > 1) { s.sort((x, y) => y - x); const [x, y] = [s.shift()!, s.shift()!]; if (x !== y) s.push(x - y); } return s[0] ?? 0; }
const fight: Level = {
  id: 'sicily.fight', world: 6, title: 'Кулачний бій', topic: 'купа: найбільший першим',
  leetcode: lc(1046, 'Last Stone Weight'),
  brief: '<b>Кулачний бій.</b> Щоразу б\'ються двоє найсильніших. Хто лишиться наприкінці і з якою силою?',
  statement: [
    'Кулачний бій на іграх Ацеста. <code>stones[i]</code> — сила бійця <code>i</code>. Щоразу на арену виходять <b>двоє найсильніших</b>.',
    'Якщо сили рівні — обидва вибувають. Якщо ні — слабший вибуває, а сильніший лишається з силою, меншою на силу суперника. Поверни силу останнього бійця або <code>0</code>, якщо не лишилось нікого.',
    'Шукати двох найсильніших щоразу заново довго. Для цього є <b>купа</b>: вона завжди тримає найбільшого напоготові.',
  ],
  tool: {
    name: 'купа (черга з пріоритетом)',
    text: [
      '<code>MaxPriorityQueue</code> — купа: <code>enqueue(x)</code> кладе, <code>dequeue()</code> забирає <b>найбільший</b>, <code>size()</code> каже, скільки лишилось. Є й <code>MinPriorityQueue</code> — для найменшого.',
      'Покласти й забрати — це log n кроків, а не перебір усіх. Такі самі класи є на LeetCode для JavaScript і TypeScript.',
    ],
    code: 'const heap = new MaxPriorityQueue();\nheap.enqueue(4); heap.enqueue(9); heap.enqueue(2);\nheap.dequeue();   // 9\nheap.size();      // 2',
  },
  talk: [
    { who: 'acestes', text: 'Кулачний бій! За правилами щоразу б\'ються двоє найсильніших. Тільки хто вони зараз — ніхто не тямить.' },
    { who: 'wolf', text: 'А я щоразу оглядатиму всіх і шукатиму найсильніших. Довго? Зате чесно!' },
    { who: 'fox', text: 'Купа сама тримає найсильнішого нагорі. Забрав двох — і бій почався.' },
  ],
  quip: { who: 'wolf', text: 'Я б і сам вийшов на арену. Але там усі такі… найсильніші.' },
  entry: 'lastStone', observe: ['stones'],
  starter: starter('lastStone', [['stones', 'number[]']], 'number', ['Кулачний бій', 'Щоразу б\'ються двоє найсильніших. Поверни силу останнього або 0.'], '  const heap = new MaxPriorityQueue();\n  // Слово ладу пиши тут\n\n  return 0;\n'),
  examples: [one([2, 7, 4, 1, 8, 1])],
  hidden: [one([1]), one([3, 3]), one([10, 4]), one([1, 3]), one([5, 5, 5]), one([9, 3, 2, 10])],
  reference: stonesRef,
  hints: ['Що треба мати під рукою на кожному кроці бою?', 'Поклади всіх у MaxPriorityQueue. Поки бійців більше одного: забери двох, якщо різні — поверни різницю.', 'for (s of stones) heap.enqueue(s); while (heap.size() > 1) { const a = heap.dequeue(), b = heap.dequeue(); if (a !== b) heap.enqueue(a - b); } return heap.size() ? heap.dequeue() : 0;'],
  solution: 'function lastStone(stones: number[]): number {\n  const heap = new MaxPriorityQueue<number>();\n  for (let i = 0; i < stones.length; i++) heap.enqueue(stones[i]);\n  while (heap.size() > 1) {\n    const a = heap.dequeue()!, b = heap.dequeue()!;\n    if (a !== b) heap.enqueue(a - b);\n  }\n  return heap.size() ? heap.dequeue()! : 0;\n}',
  lesson: 'Купа завжди тримає найбільшого (чи найменшого) напоготові: покласти й забрати — log n, а не перебір.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Kth Largest Element in a Stream як журнал */
const boardCase = (k: number, nums: number[], adds: number[]): TestCase => ({ args: [k, nums, adds], label: `${k}, ${JSON.stringify(nums)}, ${JSON.stringify(adds)}` });
function boardRef(k: number, nums: number[], adds: number[]) { const all = nums.slice(), out: number[] = []; for (const x of adds) { all.push(x); const s = all.slice().sort((a, b) => b - a); out.push(s[k - 1]); } return out; }
const board: Level = {
  id: 'sicily.board', world: 6, final: true, title: 'Живе табло', topic: 'купа розміру k',
  leetcode: lc(703, 'Kth Largest Element in a Stream'),
  brief: '<b>Живе табло.</b> Після кожного нового результату табло показує <code>k</code>-й найкращий. Відроди табло Ацеста.',
  statement: [
    'Табло призерів: <code>nums</code> — результати, що вже є, <code>adds</code> — нові, що приходять по одному. Після кожного нового табло має показати <code>k</code>-й найбільший результат серед усіх на цей момент.',
    'Поверни масив цих чисел — по одному після кожного нового результату. На момент кожного показу результатів завжди не менше <code>k</code>.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк після кожного результату пересортовує всю таблицю. А тобі досить тримати лише <code>k</code> найкращих — у купі, де найменший з них нагорі.',
  ],
  tool: {
    name: 'купа з k найкращих',
    text: [
      'Тримай <code>MinPriorityQueue</code> рівно з <code>k</code> найкращих результатів. Нагорі в неї — найменший з найкращих, тобто якраз <code>k</code>-й найбільший.',
      'Новий результат: поклади його, і якщо в купі стало більше <code>k</code>, викинь найменшого. Відповідь — <code>heap.front()</code>.',
    ],
    code: '// k = 3, купа тримає [4, 5, 8]  → front = 4\n// прийшло 10 → [4, 5, 8, 10] → викинули 4\n// тепер [5, 8, 10]          → front = 5',
  },
  talk: [
    { who: 'acestes', text: 'Табло! Його відродити — і ігри знову матимуть переможців. Але результати все приходять і приходять.' },
    { who: 'wolf', text: 'Після кожного результату пересортую всю таблицю! Від найкращого до найгіршого! Ще раз! І ще!' },
    { who: 'fox', text: 'Навіщо всю? Табло показує k-й найкращий. Тримай лише k найкращих у купі — найменший з них і є відповідь.' },
  ],
  quip: { who: 'acestes', text: 'Табло ожило! Анхіз би пишався. А тобі, Микито, — вінок судді. Не ставок!' },
  entry: 'liveBoard', observe: [null, 'nums', 'adds'],
  starter: starter('liveBoard', [['k', 'number'], ['nums', 'number[]'], ['adds', 'number[]']], 'number[]', ['Живе табло', 'Після кожного числа з adds поверни k-й найбільший серед nums і вже доданих.'], '  const heap = new MinPriorityQueue();\n  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [boardCase(3, [4, 5, 8, 2], [3, 5, 10, 9, 4])],
  hidden: [boardCase(1, [], [-3, -2, -4, 0, 4]), boardCase(2, [0], [-1, 1, -2, -4, 3]), boardCase(3, [5, 6, 7], [1]), boardCase(2, [1, 1], [1, 1, 1])],
  big: {
    n: 10000,
    make: (n) => { const r = rng(703); return [100, Array.from({ length: n }, () => Math.floor(r() * 1e6)), Array.from({ length: 2000 }, () => Math.floor(r() * 1e6))]; },
    readBudget: (n) => 10 * n,
  },
  reference: boardRef,
  wolf: { reads: (n) => n * 2000, code: 'function liveBoard(k, nums, adds) {\n  const out = [];\n  for (let t = 0; t < adds.length; t++) {\n    const all = [];\n    for (let i = 0; i < nums.length; i++) all.push(nums[i]);\n    for (let i = 0; i <= t; i++) all.push(adds[i]);\n    all.sort((a, b) => b - a);\n    out.push(all[k - 1]);\n  }\n  return out;\n}' },
  hints: ['Скільки результатів насправді треба пам\'ятати, щоб знати k-й найкращий?', 'MinPriorityQueue з k найкращих: кладеш новий, і якщо size() > k — dequeue(). Відповідь — front().', 'const add = (x) => { heap.enqueue(x); if (heap.size() > k) heap.dequeue(); }; nums.forEach(add); for (x of adds) { add(x); out.push(heap.front()); }'],
  solution: 'function liveBoard(k: number, nums: number[], adds: number[]): number[] {\n  const heap = new MinPriorityQueue<number>();\n  const out: number[] = [];\n  const add = (x: number) => {\n    heap.enqueue(x);\n    if (heap.size() > k) heap.dequeue();\n  };\n  for (let i = 0; i < nums.length; i++) add(nums[i]);\n  for (let i = 0; i < adds.length; i++) {\n    add(adds[i]);\n    out.push(heap.front()!);\n  }\n  return out;\n}',
  lesson: 'Щоб знати k-й найкращий, не треба тримати всіх: купа з k найкращих віддає відповідь з верхівки.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const sicily: World = {
  n: 6, name: 'Сицилія: ігри Ацеста', song: 'Пісня III · Випробування', topic: 'Sliding Window, Heap', fox: '#d9a032',
  host: { who: 'Ацест', line: 'Ігри на честь Анхіза! Тільки табло зламалось. Хто ж переміг?' },
  motif: 'frame', trick: 'Рамка: ковзне вікно й купа',
  levels: [laps, boat, song, fight, board],
};
