import { type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L } from '../i18n.ts';

/*
 * Світ 11 — Карпати (за «Тінями забутих предків»): графи, обхід ушир і вглиб.
 * Полонини — сітка клітинок (масив масивів); світ стежить за кожною клітинкою окремо
 * і показує їх одним рядом, рядок за рядком. Сигнал трембіти йде хвилями (BFS), мольфар — стежкою вглиб (DFS).
 */

type Grid = number[][];
const g = (a: Grid) => JSON.stringify(a).replace(/],\[/g, '], [').replace(/,(?=\d)/g, ', ');
const copy = (a: Grid) => a.map((r) => r.slice());
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/* 1. Flood Fill */
function fillRef(img: Grid, sr: number, sc: number, color: number) {
  const a = copy(img), old = a[sr][sc];
  if (old === color) return a;
  const st = [[sr, sc]];
  while (st.length) { const [r, c] = st.pop()!; if (r < 0 || c < 0 || r >= a.length || c >= a[0].length || a[r][c] !== old) continue; a[r][c] = color; for (const [dr, dc] of DIRS) st.push([r + dr, c + dc]); }
  return a;
}
const fillCase = (img: Grid, sr: number, sc: number, color: number): TestCase => ({ args: [img, sr, sc, color], label: `${g(img)}, ${sr}, ${sc}, ${color}` });
const fill: Level = {
  id: 'karp.fill', world: 11, title: 'Голос трембіти', topic: 'граф: заливка від клітинки',
  leetcode: lc(733, 'Flood Fill'),
  brief: '<b>Голос трембіти.</b> Трембіта озвалася на полонині. Пофарбуй усю ділянку, куди долетить її голос.',
  statement: [
    'Полонини оповив туман. Карта — сітка <code>image</code>: кожне число — колір ділянки. З клітинки <code>[sr, sc]</code> озивається трембіта, і її голос летить на сусідні ділянки того самого кольору: вгору, вниз, ліворуч і праворуч (не навскоси). А від них — далі.',
    'Пофарбуй у колір <code>color</code> усі клітинки, куди долетить голос, і поверни сітку. Для <code>[[1, 1, 1], [1, 1, 0], [1, 0, 1]]</code>, старту <code>[1, 1]</code> і кольору <code>2</code> вийде <code>[[2, 2, 2], [2, 2, 0], [2, 0, 1]]</code>: правий нижній кут відрізаний нулями.',
    'Клітинки з сусідами — це <b>граф</b>. Обійди його від старту: тримай стос клітинок, які ще треба відвідати, і фарбуй кожну, щойно дійдеш.',
  ],
  tool: {
    name: 'обхід сітки стосом',
    text: [
      'Поклади старт у стос. Поки стос не порожній: візьми клітинку; якщо вона поза сіткою або не того кольору — пропусти. Інакше пофарбуй і поклади в стос чотирьох сусідів.',
      'Пофарбована клітинка вже не того кольору, тож двічі її не обійдеш. Обережно лише з випадком, коли новий колір такий самий, як старий.',
    ],
    code: 'const stack = [[sr, sc]];\nwhile (stack.length) {\n  const [r, c] = stack.pop();\n  // перевір межі й колір, пофарбуй\n  stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);\n}',
  },
  talk: [
    { who: 'molfar', text: 'Туман такий, що гуцули не бачать сусідньої хати. Хай озветься трембіта — куди долетить голос, там і розвидниться.' },
    { who: 'fox', text: 'Від клітинки до сусідньої, від сусідньої — далі. Як чутка по селу.' },
  ],
  quip: { who: 'molfar', text: 'Чуєш, як відгукується? Там, куди долетіло, вже видно хати.' },
  entry: 'floodFill', observe: ['image', null, null, null],
  starter: starter('floodFill', [['image', 'number[][]'], ['sr', 'number'], ['sc', 'number'], ['color', 'number']], 'number[][]', ['Голос трембіти', 'Пофарбуй у color усі клітинки того самого кольору, що й [sr, sc], до яких можна дійти вгору, вниз, ліворуч чи праворуч.', 'Поверни сітку.'], '  const old = image[sr][sc];\n  if (old === color) return image;\n  // Слово ладу пиши тут\n\n  return image;\n'),
  examples: [fillCase([[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2)],
  hidden: [fillCase([[0, 0, 0], [0, 0, 0]], 0, 0, 0), fillCase([[5]], 0, 0, 3), fillCase([[1, 2, 1], [2, 1, 2], [1, 2, 1]], 1, 1, 7), fillCase([[3, 3, 3, 3], [3, 0, 0, 3], [3, 3, 3, 3]], 0, 0, 9)],
  reference: fillRef,
  hints: ['Звідки голос може полетіти з однієї клітинки?', 'stack = [[sr, sc]]. Поки є що брати: [r, c] = pop; якщо поза межами або image[r][c] !== old — continue; пофарбуй і поклади 4 сусідів.', 'while (stack.length) { const [r, c] = stack.pop(); if (r < 0 || c < 0 || r >= image.length || c >= image[0].length || image[r][c] !== old) continue; image[r][c] = color; stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]); }'],
  solution: 'function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {\n  const old = image[sr][sc];\n  if (old === color) return image;\n  const stack: number[][] = [[sr, sc]];\n  while (stack.length) {\n    const [r, c] = stack.pop()!;\n    if (r < 0 || c < 0 || r >= image.length || c >= image[0].length || image[r][c] !== old) continue;\n    image[r][c] = color;\n    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);\n  }\n  return image;\n}',
  lesson: 'Сітка — це граф: клітинка з\'єднана з чотирма сусідами. Обхід стосом заходить у кожну клітинку один раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Number of Islands */
function islandsRef(grid: Grid) {
  const a = copy(grid); let n = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < a[0].length; j++) if (a[i][j] === 1) { n++; const st = [[i, j]]; while (st.length) { const [r, c] = st.pop()!; if (r < 0 || c < 0 || r >= a.length || c >= a[0].length || a[r][c] !== 1) continue; a[r][c] = 0; for (const [dr, dc] of DIRS) st.push([r + dr, c + dc]); } }
  return n;
}
const gridCase = (a: Grid): TestCase => ({ args: [a], label: g(a) });
/** Велика полонина: майже суцільна земля, яку туман ділить смугами на кілька широких островів. */
function bigMeadow(cells: number) {
  const s = Math.round(Math.sqrt(cells));
  return Array.from({ length: s }, (_, r) => Array.from({ length: s }, (_, c) => (c % 10 === 9 || (r % 25 === 24 && c % 20 < 10) ? 0 : 1)));
}
const islands: Level = {
  id: 'karp.islands', world: 11, title: 'Острови полонин', topic: 'граф: компоненти зв\'язності',
  leetcode: lc(200, 'Number of Islands'),
  brief: '<b>Острови полонин.</b> Серед туману видно клаптики полонин. Порахуй, скільки окремих островів.',
  statement: [
    'Мольфар дивиться згори: <code>1</code> — полонина, <code>0</code> — туман. Сусідні полонини (вгору, вниз, ліворуч, праворуч) — це один острів, хоч би який він був звивистий.',
    'Поверни кількість островів. У <code>[[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1]]</code> їх <code>2</code>.',
    'Полонина бувають і 50 × 50 клітинок. Іди сіткою рядок за рядком. Натрапив на полонину — це новий острів: порахуй його й одразу «затопи» туманом увесь, щоб більше на нього не натрапити.',
  ],
  tool: {
    name: 'знайшов — затопи',
    text: [
      'Кожен острів має бути порахований рівно раз. Для цього, щойно знайшов першу клітинку острова, обійди його весь (як у «Голосі трембіти») і познач пройдене: <code>grid[r][c] = 0</code>.',
      'Тоді зовнішній цикл натрапляє лише на ще не бачені острови, а кожна клітинка відвідується сталу кількість разів.',
    ],
    code: 'for (let r = 0; r < grid.length; r++)\n  for (let c = 0; c < grid[0].length; c++)\n    if (grid[r][c] === 1) {\n      count++;\n      // затопи весь острів від [r, c]\n    }',
  },
  talk: [
    { who: 'molfar', text: 'Згори видно клаптики полонин. Скільки їх — стільки й громад, що не чують одна одну.' },
    { who: 'wolf', text: 'Я з кожної полонини обійду весь острів заново! І так для кожної. Я ж нічого не пропущу!' },
    { who: 'fox', text: 'Зате пройдеш кожен острів стільки разів, скільки в ньому клітинок. Знайшов острів — затопи його, і він більше не заважатиме.' },
  ],
  quip: { who: 'molfar', text: 'Стільки громад. Тепер знаємо, кому слати трембіту.' },
  entry: 'numIslands', observe: ['grid'],
  starter: starter('numIslands', [['grid', 'number[][]']], 'number', ['Острови полонин', '1 — полонина, 0 — туман. Поверни кількість островів.'], '  let count = 0;\n  // Слово ладу пиши тут\n\n  return count;\n'),
  examples: [gridCase([[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1]])],
  hidden: [gridCase([[0]]), gridCase([[1]]), gridCase([[1, 0, 1, 0, 1]]), gridCase([[1, 1, 1], [0, 1, 0], [1, 1, 1]]), gridCase([[1, 0, 1], [0, 1, 0], [1, 0, 1]]), gridCase([[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]])],
  big: { n: 2500, make: (n) => [bigMeadow(n)], readBudget: (n) => 12 * n },
  reference: islandsRef,
  wolf: { reads: (n) => n * 50, code: 'function numIslands(grid) {\n  const R = grid.length, C = grid[0].length;\n  let count = 0;\n  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {\n    if (grid[r][c] !== 1) continue;\n    // обійти весь острів заново й порахувати його лише з найпершої клітинки\n    const seen = new Set([r * C + c]);\n    const stack = [[r, c]];\n    let first = true;\n    while (stack.length) {\n      const [a, b] = stack.pop();\n      if (a * C + b < r * C + c) first = false;\n      for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) {\n        if (x < 0 || y < 0 || x >= R || y >= C || seen.has(x * C + y) || grid[x][y] !== 1) continue;\n        seen.add(x * C + y);\n        stack.push([x, y]);\n      }\n    }\n    if (first) count++;\n  }\n  return count;\n}' },
  hints: ['Як порахувати острів рівно раз, хоч у ньому багато клітинок?', 'Подвійний цикл по клітинках. Знайшов 1 — count++ і обійди острів стосом, ставлячи 0 на кожну пройдену клітинку.', 'if (grid[r][c] === 1) { count++; const st = [[r, c]]; while (st.length) { const [a, b] = st.pop(); if (a < 0 || b < 0 || a >= grid.length || b >= grid[0].length || grid[a][b] !== 1) continue; grid[a][b] = 0; st.push([a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]); } }'],
  solution: 'function numIslands(grid: number[][]): number {\n  let count = 0;\n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] !== 1) continue;\n      count++;\n      const st: number[][] = [[r, c]];\n      while (st.length) {\n        const [a, b] = st.pop()!;\n        if (a < 0 || b < 0 || a >= grid.length || b >= grid[0].length || grid[a][b] !== 1) continue;\n        grid[a][b] = 0;\n        st.push([a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]);\n      }\n    }\n  }\n  return count;\n}',
  lesson: 'Кількість островів — це кількість запусків обходу: знайшов нову клітинку — обійди й познач увесь острів. Разом O(клітинок).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Rotting Oranges → зіпсована бринза */
function rotRef(grid: Grid) {
  const a = copy(grid); let q: number[][] = [], fresh = 0, t = 0;
  a.forEach((row, r) => row.forEach((v, c) => { if (v === 2) q.push([r, c]); if (v === 1) fresh++; }));
  while (q.length && fresh) { const next: number[][] = []; for (const [r, c] of q) for (const [dr, dc] of DIRS) { const x = r + dr, y = c + dc; if (a[x]?.[y] === 1) { a[x][y] = 2; fresh--; next.push([x, y]); } } q = next; t++; }
  return fresh ? -1 : t;
}
const rot: Level = {
  id: 'karp.rot', world: 11, title: 'Зіпсована бринза', topic: 'граф: обхід ушир хвилями',
  leetcode: lc(994, 'Rotting Oranges'),
  brief: '<b>Зіпсована бринза.</b> У колибі на полиці зіпсувалася бринза. За скільки хвилин зіпсується вся?',
  statement: [
    'У колибі на полицях лежить бринза: <code>0</code> — порожньо, <code>1</code> — свіжа головка, <code>2</code> — зіпсована. Щохвилини зіпсована псує сусідні свіжі (вгору, вниз, ліворуч, праворуч).',
    'Поверни, за скільки хвилин не лишиться жодної свіжої головки. Якщо якась так і не зіпсується (до неї не дістатися) — <code>-1</code>. Якщо свіжої нема з самого початку — <code>0</code>. Для <code>[[2, 1, 1], [1, 1, 0], [0, 1, 1]]</code> — <code>4</code>.',
    'Псування йде <b>хвилями</b>, як голос трембіти: усі зіпсовані разом — перша хвиля, усі, кого вони зачепили, — друга. Це <b>обхід ушир</b> (BFS): тримай поточну хвилю і збирай з неї наступну.',
  ],
  tool: {
    name: 'обхід ушир по сітці',
    text: [
      'Спершу збери в <code>wave</code> усі зіпсовані головки й порахуй свіжі. Кожна хвилина: для кожної клітинки хвилі глянь на 4 сусідів; свіжу псуй, зменшуй лічильник свіжих і клади в <code>next</code>.',
      'Хвиля скінчилась — <code>wave = next</code>, хвилин +1. Зупиняйся, коли хвиля порожня або свіжих не лишилось.',
    ],
    code: '// хвилина 0:  2 1 1     хвилина 1:  2 2 1\n//             1 1 0                 2 1 0\n//             0 1 1                 0 1 1',
  },
  talk: [
    { who: 'molfar', text: 'Вівчарі пішли шукати одне одного в тумані, а бринзу лишили. Одна головка вже зіпсувалась…' },
    { who: 'fox', text: 'І псує сусідів хвилями. Рахуймо хвилі, а не головки — так буде швидше.' },
  ],
  quip: { who: 'fox', text: 'Тепер знаємо, скільки часу лишилось на вечерю. Я би поквапився.' },
  entry: 'orangesRotting', observe: ['grid'],
  starter: starter('orangesRotting', [['grid', 'number[][]']], 'number', ['Зіпсована бринза', '0 — порожньо, 1 — свіжа, 2 — зіпсована. Щохвилини зіпсована псує 4 сусідів.', 'Поверни, за скільки хвилин свіжих не лишиться, або -1.'], '  let wave = [], fresh = 0, minutes = 0;\n  // Слово ладу пиши тут\n\n  return fresh ? -1 : minutes;\n'),
  examples: [gridCase([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), gridCase([[2, 1, 1], [0, 1, 1], [1, 0, 1]])],
  hidden: [gridCase([[0, 2]]), gridCase([[1]]), gridCase([[2, 2], [1, 1]]), gridCase([[2, 1, 1, 1, 1]]), gridCase([[1, 1, 1], [1, 2, 1], [1, 1, 1]])],
  reference: rotRef,
  hints: ['Що робить кожна хвилина з усіма зіпсованими одночасно?', 'Збери всі 2 у wave, порахуй 1. Поки wave не порожній і fresh > 0: next = []; для кожної [r, c] у wave — 4 сусіди, свіжих псуй (= 2, fresh--, у next); wave = next; minutes++.', 'while (wave.length && fresh) { const next = []; for (const [r, c] of wave) for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && grid[x][y] === 1) { grid[x][y] = 2; fresh--; next.push([x, y]); } wave = next; minutes++; }'],
  solution: 'function orangesRotting(grid: number[][]): number {\n  let wave: number[][] = [], fresh = 0, minutes = 0;\n  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) {\n    if (grid[r][c] === 2) wave.push([r, c]);\n    if (grid[r][c] === 1) fresh++;\n  }\n  while (wave.length && fresh) {\n    const next: number[][] = [];\n    for (const [r, c] of wave) {\n      for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n        if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length || grid[x][y] !== 1) continue;\n        grid[x][y] = 2;\n        fresh--;\n        next.push([x, y]);\n      }\n    }\n    wave = next;\n    minutes++;\n  }\n  return fresh ? -1 : minutes;\n}',
  lesson: 'Обхід ушир іде хвилями від усіх джерел одразу: номер хвилі — це відстань, тобто хвилини.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Course Schedule */
function canRef(n: number, pre: Grid) {
  const indeg = new Array(n).fill(0), adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of pre) { adj[b].push(a); indeg[a]++; }
  const q = indeg.flatMap((d, i) => (d ? [] : [i])); let done = 0;
  while (q.length) { const x = q.pop()!; done++; for (const y of adj[x]) if (--indeg[y] === 0) q.push(y); }
  return done === n;
}
const crafts = (n: number, pre: Grid): TestCase => ({ args: [n, pre], label: `${n}, ${g(pre)}` });
const crafts_: Level = {
  id: 'karp.crafts', world: 11, title: 'Порядок ремесел', topic: 'граф: залежності без кола',
  leetcode: lc(207, 'Course Schedule'),
  brief: '<b>Порядок ремесел.</b> Щоб стати мольфаром, треба вивчити ремесла в правильному порядку. Чи це взагалі можливо?',
  statement: [
    'Учень мольфара має опанувати <code>numCourses</code> ремесел з номерами від 0. Пара <code>[a, b]</code> у <code>prerequisites</code> означає: щоб учити <code>a</code>, треба спершу вивчити <code>b</code>.',
    'Поверни <code>true</code>, якщо можна вивчити все. Уламок міг заплутати вимоги в коло: «різьба потрібна для писанок, писанки — для трембіти, а трембіта — для різьби». Тоді — <code>false</code>. Для <code>2</code> і <code>[[1, 0]]</code> — <code>true</code>; для <code>2</code> і <code>[[1, 0], [0, 1]]</code> — <code>false</code>.',
    'Починай з ремесел, яким нічого не треба. Вивчив ремесло — прибери його з вимог інших. Хто лишився без вимог — тепер теж можна вчити. Якщо так вивчиш усі — кола немає.',
  ],
  tool: {
    name: 'вхідний степінь і черга готових',
    text: [
      '<code>need[a]</code> — скільки ремесел ще треба вивчити перед <code>a</code>. <code>after[b]</code> — список ремесел, що чекають на <code>b</code>.',
      'У <code>ready</code> клади всі ремесла з <code>need = 0</code>. Береш звідти ремесло — рахуєш вивченим і кожному з <code>after</code> зменшуєш <code>need</code>; хто дійшов до нуля — у <code>ready</code>. Це <b>топологічне сортування</b>.',
    ],
    code: '// [[1, 0], [2, 1]]: 0 → 1 → 2\n// need = [0, 1, 1], ready = [0]\n// вивчили 0 → need[1] = 0 → ready = [1]\n// вивчили 1 → need[2] = 0 → ready = [2] → усе ✓',
  },
  talk: [
    { who: 'molfar', text: 'Ремесла в горах передаються по черзі: одне потрібне для іншого. Але уламок наплутав, і учні ходять по колу.' },
    { who: 'fox', text: 'Почнемо з того, що можна вчити одразу. Кожне вивчене ремесло відмикає наступні.' },
  ],
  quip: { who: 'molfar', text: 'Порядок є. Колись і ти, лисе, станеш мольфаром. Може.' },
  entry: 'canFinish', observe: [null, 'prerequisites'],
  starter: starter('canFinish', [['numCourses', 'number'], ['prerequisites', 'number[][]']], 'boolean', ['Порядок ремесел', '[a, b] — щоб учити a, треба спершу вивчити b.', 'true, якщо можна вивчити всі numCourses ремесел.'], '  const need = new Array(numCourses).fill(0);\n  const after = Array.from({ length: numCourses }, () => []);\n  // Слово ладу пиши тут\n\n  return false;\n'),
  examples: [crafts(2, [[1, 0]]), crafts(2, [[1, 0], [0, 1]])],
  hidden: [crafts(1, []), crafts(3, [[1, 0], [2, 1]]), crafts(3, [[0, 1], [1, 2], [2, 0]]), crafts(5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]]), crafts(4, [[1, 0], [2, 1], [3, 2], [1, 3]]), crafts(3, [[0, 0]])],
  reference: canRef,
  hints: ['З якого ремесла можна почати?', 'need[a]++ і after[b].push(a) для кожної пари. ready = ремесла з need 0. Поки ready не порожній: беремо x, done++, для кожного y з after[x]: якщо --need[y] === 0 — у ready. Відповідь: done === numCourses.', 'for (const [a, b] of prerequisites) { need[a]++; after[b].push(a); } const ready = []; for (let i = 0; i < numCourses; i++) if (!need[i]) ready.push(i); let done = 0; while (ready.length) { const x = ready.pop(); done++; for (const y of after[x]) if (--need[y] === 0) ready.push(y); } return done === numCourses;'],
  solution: 'function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  const need: number[] = new Array(numCourses).fill(0);\n  const after: number[][] = Array.from({ length: numCourses }, () => []);\n  for (const [a, b] of prerequisites) { need[a]++; after[b].push(a); }\n  const ready: number[] = [];\n  for (let i = 0; i < numCourses; i++) if (!need[i]) ready.push(i);\n  let done = 0;\n  while (ready.length) {\n    const x = ready.pop()!;\n    done++;\n    for (const y of after[x]) if (--need[y] === 0) ready.push(y);\n  }\n  return done === numCourses;\n}',
  lesson: 'Топологічне сортування: вчи те, що нічого не чекає, і відмикай наступне. Не вдалося вивчити всього — у вимогах коло.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Pacific Atlantic Water Flow → Черемош і Прут */
function flowRef(h: Grid) {
  const R = h.length, C = h[0].length;
  const reach = (starts: number[][]) => {
    const seen = new Set<number>(); const st = starts.slice();
    while (st.length) { const [r, c] = st.pop()!; if (seen.has(r * C + c)) continue; seen.add(r * C + c); for (const [dr, dc] of DIRS) { const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < R && y < C && h[x][y] >= h[r][c]) st.push([x, y]); } }
    return seen;
  };
  const cells = (f: (r: number, c: number) => boolean) => { const out: number[][] = []; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (f(r, c)) out.push([r, c]); return out; };
  const a = reach(cells((r, c) => r === 0 || c === 0)), b = reach(cells((r, c) => r === R - 1 || c === C - 1));
  return cells((r, c) => a.has(r * C + c) && b.has(r * C + c));
}
const pairsCheck = (tc: TestCase, r: CallResult): true | string => {
  const norm = (v: unknown) => (Array.isArray(v) ? v.map((x) => JSON.stringify(x)).sort() : null);
  const got = norm(r.value), want = norm(tc.expected);
  if (got && JSON.stringify(got) === JSON.stringify(want)) return true;
  return L(`очікували ${(tc.expected as unknown[]).length} клітинок (порядок неважливий): ${JSON.stringify(tc.expected).slice(0, 80)}, отримали ${JSON.stringify(r.value).slice(0, 80)}`, `expected ${(tc.expected as unknown[]).length} cells (any order): ${JSON.stringify(tc.expected).slice(0, 80)}, got ${JSON.stringify(r.value).slice(0, 80)}`);
};
const flow: Level = {
  id: 'karp.flow', world: 11, final: true, title: 'Черемош і Прут', topic: 'граф: обхід від берегів назад',
  leetcode: lc(417, 'Pacific Atlantic Water Flow'),
  brief: '<b>Черемош і Прут.</b> Дощ падає на гори. З яких вершин вода стече і в Черемош, і в Прут?',
  statement: [
    'Карта гір — сітка висот <code>heights</code>. Черемош тече вздовж <b>верхнього й лівого</b> краю карти, Прут — вздовж <b>нижнього й правого</b>. Вода з клітинки стікає до сусіда (вгору, вниз, ліворуч, праворуч), якщо він не вищий. З крайньої клітинки вода потрапляє в річку свого краю.',
    'Поверни всі клітинки <code>[r, c]</code>, звідки вода може дійти до <b>обох</b> річок. Порядок неважливий. Для <code>[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]</code> таких клітинок сім: <code>[0, 4]</code>, <code>[1, 3]</code>, <code>[1, 4]</code>, <code>[2, 2]</code>, <code>[3, 0]</code>, <code>[3, 1]</code>, <code>[4, 0]</code>.',
    'Пускати воду з кожної вершини — це Вовків шлях. Хитріше піти <b>назад</b>: від річки вгору, до сусідів, що не нижчі. Один обхід від берегів Черемошу, другий — від берегів Пруту. Клітинки, до яких дійшли обидва, — відповідь.',
  ],
  tool: {
    name: 'обхід від цілі назад',
    text: [
      'Замість «куди стече вода звідси?» питай «звідки вода могла прийти сюди?». Від берега піднімайся до сусіда, якщо він <b>не нижчий</b>.',
      'Збери множину досяжних клітинок для кожної річки окремо (як у «Голосі трембіти», тільки з умовою висоти). Відповідь — їхній перетин.',
    ],
    code: '// від Черемошу (верх і лівий край) — вгору схилами\n// від Пруту (низ і правий край)   — вгору схилами\n// обидва дійшли до клітинки → вода з неї тече в обидві річки',
  },
  talk: [
    { who: 'molfar', text: 'Коли туман зійде, піде дощ. Гуцули хочуть знати, з яких вершин вода дійде і до Черемошу, і до Пруту. Там ставитимуть трембіти.' },
    { who: 'wolf', text: 'Я пущу краплю з кожної вершини й піду за нею! Скрізь! Ой, я змок…' },
    { who: 'fox', text: 'А ми підемо від річок угору. Двічі — і зустрінемося на вершинах, що треба.' },
  ],
  quip: { who: 'molfar', text: 'Трембіти озвалися з кожної вершини. Чуєш? Полонини знову розмовляють.' },
  entry: 'pacificAtlantic', observe: ['heights'],
  starter: starter('pacificAtlantic', [['heights', 'number[][]']], 'number[][]', ['Черемош і Прут', 'Черемош — верхній і лівий край, Прут — нижній і правий. Вода тече до сусіда, що не вищий.', 'Поверни клітинки [r, c], звідки вода дійде до обох річок.'], '  const R = heights.length, C = heights[0].length;\n  // Слово ладу пиши тут\n\n  return [];\n'),
  examples: [gridCase([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]])],
  hidden: [gridCase([[1]]), gridCase([[1, 1], [1, 1]]), gridCase([[3, 3, 3], [3, 1, 3], [3, 3, 3]]), gridCase([[1, 2, 3], [8, 9, 4], [7, 6, 5]]), gridCase([[10, 1, 10], [1, 1, 1], [10, 1, 10]])],
  reference: flowRef,
  check: pairsCheck,
  hints: ['Звідки вода могла прийти до берега Черемошу?', 'reach(starts): обхід стосом від клітинок краю; йди до сусіда, якщо heights[сусід] ≥ heights[поточна]; пам\'ятай відвідані. Зроби для двох країв і візьми клітинки, відвідані обома.', 'const reach = (starts) => { const seen = new Set(), st = starts; while (st.length) { const [r, c] = st.pop(); if (seen.has(r * C + c)) continue; seen.add(r * C + c); for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < R && y < C && heights[x][y] >= heights[r][c]) st.push([x, y]); } return seen; };'],
  solution: 'function pacificAtlantic(heights: number[][]): number[][] {\n  const R = heights.length, C = heights[0].length;\n  const reach = (starts: number[][]) => {\n    const seen = new Set<number>();\n    const st = starts;\n    while (st.length) {\n      const [r, c] = st.pop()!;\n      if (seen.has(r * C + c)) continue;\n      seen.add(r * C + c);\n      for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n        if (x >= 0 && y >= 0 && x < R && y < C && heights[x][y] >= heights[r][c]) st.push([x, y]);\n      }\n    }\n    return seen;\n  };\n  const top: number[][] = [], bottom: number[][] = [];\n  for (let r = 0; r < R; r++) { top.push([r, 0]); bottom.push([r, C - 1]); }\n  for (let c = 0; c < C; c++) { top.push([0, c]); bottom.push([R - 1, c]); }\n  const a = reach(top), b = reach(bottom);\n  const out: number[][] = [];\n  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (a.has(r * C + c) && b.has(r * C + c)) out.push([r, c]);\n  return out;\n}',
  lesson: 'Коли джерел багато, а цілей мало — обходь від цілей назад. Два обходи від берегів замінюють обхід від кожної вершини.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const carpathians: World = {
  n: 11, name: 'Карпати', song: 'Пісня V · Ліси й гори', topic: 'Графи, BFS / DFS', fox: '#1f8a5b',
  host: { who: 'Мольфар', line: 'Туман оповив полонини, і трембіти мовчать. Поверни горам голос.' },
  motif: 'rose', trick: 'Розетка: обхід графа',
  levels: [fill, islands, rot, crafts_, flow],
};
