import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

/*
 * Світ 13 — Табір Турна: рейд Низа й Евріала (Енеїда, частина 5). Найкоротший шлях.
 * Юнона з Вовком викрали Микиту, і Еней уперше діє без нього: Микита лише подає знаки з полону,
 * тож підказок у розмовах менше. Уламка тут немає — нагорода світу: звільнення Микити.
 */

type Grid = number[][];
const g = (a: unknown) => JSON.stringify(a).replace(/],\[/g, '], [').replace(/,(?=-?\d)/g, ', ');
const gridCase = (a: Grid): TestCase => ({ args: [a], label: g(a) });
const copy = (a: Grid) => a.map((r) => r.slice());
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/* 1. Shortest Path in Binary Matrix */
function pathRef(grid: Grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const dist = grid.map((r) => r.map(() => 0)); dist[0][0] = 1;
  let wave = [[0, 0]];
  while (wave.length) {
    const next: Grid = [];
    for (const [r, c] of wave) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < n && y < n && !grid[x][y] && !dist[x][y]) { dist[x][y] = dist[r][c] + 1; next.push([x, y]); } }
    wave = next;
  }
  return dist[n - 1][n - 1] || -1;
}
const sneak: Level = {
  id: 'camp.sneak', world: 13, title: 'Повз варту', topic: 'найкоротший шлях: обхід ушир',
  leetcode: lc(1091, 'Shortest Path in Binary Matrix'),
  brief: '<b>Повз варту.</b> Табір Турна вночі. Проберися з лівого верхнього кута в правий нижній найкоротшим шляхом.',
  statement: [
    'Микиту викрали й тримають у таборі Турна. Еней, Низ і Евріал крадуться вночі. Табір — квадратна сітка <code>grid</code>: <code>0</code> — тінь, де можна пройти, <code>1</code> — вогнище з вартою.',
    'Ходити можна у <b>вісім</b> боків: прямо й навскоси. Поверни, скільки клітинок у найкоротшому шляху від <code>[0, 0]</code> до правого нижнього кута (обидві кінцеві теж рахуються), або <code>-1</code>, якщо шляху немає. Для <code>[[0, 1], [1, 0]]</code> — <code>2</code>, навскоси.',
    'Найкоротший шлях у сітці, де кожен крок однаковий, шукають <b>обходом ушир</b>, як у Карпатах: хвиля за хвилею, і номер хвилі, що вперше торкнулася клітинки, — її відстань.',
  ],
  tool: {
    name: 'відстань = номер хвилі',
    text: [
      'Тримай <code>dist[r][c]</code> — довжину найкоротшого шляху до клітинки (0 — ще не дійшли). Стартова — 1.',
      'Для кожної клітинки хвилі глянь на 8 сусідів. Якщо сусід — тінь і ще без відстані, його відстань на 1 більша. Перший дотик — завжди найкоротший, тож переписувати не треба.',
    ],
    code: '// 0 0 0     1 2 3\n// 1 1 0  →  · · 3\n// 1 1 0     · · 4   → відповідь 4',
  },
  talk: [
    { who: 'warrior', text: 'Я Низ, а це Евріал. Ми знаємо табір: вогнища з вартою, а між ними — тіні. Іди за нами, Енею.' },
    { who: 'enei', text: 'Без Микити дивно. Ніхто не бурчить над вухом. Гаразд — хвилями, як у горах.' },
  ],
  quip: { who: 'warrior', text: 'Варта навіть не поворухнулась. Далі буде важче.' },
  entry: 'shortestPathBinaryMatrix', observe: ['grid'],
  starter: starter('shortestPathBinaryMatrix', [['grid', 'number[][]']], 'number', ['Повз варту', '0 — тінь, 1 — варта. Ходити можна у 8 боків.', 'Поверни кількість клітинок у найкоротшому шляху з [0, 0] у правий нижній кут або -1.'], '  const n = grid.length;\n  if (grid[0][0] || grid[n - 1][n - 1]) return -1;\n  // Слово ладу пиши тут\n\n  return -1;\n'),
  examples: [gridCase([[0, 1], [1, 0]]), gridCase([[0, 0, 0], [1, 1, 0], [1, 1, 0]])],
  hidden: [gridCase([[1, 0, 0], [1, 1, 0], [1, 1, 0]]), gridCase([[0]]), gridCase([[0, 1], [1, 1]]), gridCase([[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 1, 1, 1]]), gridCase([[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]])],
  reference: pathRef,
  hints: ['Яка хвиля першою торкнеться кінцевої клітинки?', 'dist = сітка нулів, dist[0][0] = 1, wave = [[0, 0]]. Поки хвиля є: для кожної клітинки й 8 сусідів — якщо тінь і dist 0, dist = +1 і в next. Відповідь: dist кінця або -1.', 'for (const [r, c] of wave) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < n && y < n && grid[x][y] === 0 && !dist[x][y]) { dist[x][y] = dist[r][c] + 1; next.push([x, y]); } }'],
  solution: 'function shortestPathBinaryMatrix(grid: number[][]): number {\n  const n = grid.length;\n  if (grid[0][0] || grid[n - 1][n - 1]) return -1;\n  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));\n  dist[0][0] = 1;\n  let wave: number[][] = [[0, 0]];\n  while (wave.length) {\n    const next: number[][] = [];\n    for (const [r, c] of wave) {\n      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {\n        const x = r + dr, y = c + dc;\n        if (x < 0 || y < 0 || x >= n || y >= n || grid[x][y] !== 0 || dist[x][y]) continue;\n        dist[x][y] = dist[r][c] + 1;\n        next.push([x, y]);\n      }\n    }\n    wave = next;\n  }\n  return dist[n - 1][n - 1] || -1;\n}',
  lesson: 'Коли всі кроки однакові, найкоротший шлях дає обхід ушир: перший дотик до клітинки — найкоротший.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Network Delay Time */
function delayRef(times: Grid, n: number, k: number) {
  const dist = new Array(n + 1).fill(Infinity); dist[k] = 0;
  for (let i = 0; i < n; i++) for (const [u, v, w] of times) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  const m = Math.max(...dist.slice(1));
  return m === Infinity ? -1 : m;
}
const net = (times: Grid, n: number, k: number): TestCase => ({ args: [times, n, k], label: `${g(times)}, ${n}, ${k}` });
const signal: Level = {
  id: 'camp.signal', world: 13, title: 'Звістка дозорами', topic: 'найкоротший шлях: Дейкстра з купою',
  leetcode: lc(743, 'Network Delay Time'),
  brief: '<b>Звістка дозорами.</b> Якщо варта підніме тривогу, за скільки вона обійде всі дозори табору?',
  statement: [
    'У таборі <code>n</code> дозорів із номерами від 1 до <code>n</code>. <code>times[i] = [u, v, w]</code>: гонець від дозору <code>u</code> до дозору <code>v</code> біжить <code>w</code> хвилин (лише в цей бік). Тривогу здіймають у дозорі <code>k</code>.',
    'Поверни, за скільки хвилин звістка дійде до <b>всіх</b> дозорів, або <code>-1</code>, якщо до якогось не дійде ніколи. Для <code>[[2, 1, 1], [2, 3, 1], [3, 4, 1]]</code>, <code>n = 4</code>, <code>k = 2</code> — <code>2</code>.',
    'Тепер кроки різної довжини, тож хвилі не допоможуть. Допоможе <b>алгоритм Дейкстри</b>: завжди розглядай найближчий ще не розглянутий дозор. Найближчого зручно діставати з <b>купи</b> — як на іграх Ацеста.',
  ],
  tool: {
    name: 'Дейкстра',
    text: [
      'Збери для кожного дозору список гінців: <code>adj[u] = [[v, w], …]</code>. У купу <code>new MinPriorityQueue((x) =&gt; x[0])</code> поклади <code>[0, k]</code>: «до k — 0 хвилин».',
      'Дістаєш з купи найближчий <code>[d, u]</code>. Якщо <code>u</code> вже розглянуто — пропусти. Інакше запам\'ятай його час і поклади в купу <code>[d + w, v]</code> для кожного гінця з <code>u</code>.',
    ],
    code: 'const heap = new MinPriorityQueue((x) => x[0]);\nheap.enqueue([0, k]);\nwhile (heap.size()) {\n  const [d, u] = heap.dequeue();   // найближчий\n  // уже бачили u? — далі\n  // інакше: його час d, і сусідів у купу\n}',
  },
  talk: [
    { who: 'warrior', text: 'Тут дозори передають тривогу гінцями. Якщо нас помітять — за скільки знатиме весь табір?' },
    { who: 'fox', text: '(здалеку, ледь чутно) …найближчого — першим… з купи…' },
    { who: 'enei', text: 'Це Микита! Чуєш? Він подає знаки.' },
  ],
  quip: { who: 'enei', text: 'Тепер знаємо, скільки в нас часу. Небагато.' },
  entry: 'networkDelayTime', observe: ['times', null, null],
  starter: starter('networkDelayTime', [['times', 'number[][]'], ['n', 'number'], ['k', 'number']], 'number', ['Звістка дозорами', 'times[i] = [u, v, w] — гонець від u до v за w хвилин. Дозори від 1 до n, тривога в k.', 'Поверни, коли звістка дійде до всіх, або -1.'], '  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const done = new Map();\n  // Слово ладу пиши тут\n\n  return -1;\n'),
  examples: [net([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), net([[1, 2, 1]], 2, 2)],
  hidden: [net([[1, 2, 1]], 2, 1), net([], 1, 1), net([[1, 2, 5], [1, 3, 1], [3, 2, 1]], 3, 1), net([[1, 2, 1], [2, 3, 2], [1, 3, 4], [3, 4, 1], [4, 5, 7], [2, 5, 9]], 5, 1), net([[1, 2, 1], [2, 1, 1]], 3, 1)],
  reference: delayRef,
  hints: ['Чий час можна вважати остаточним, коли дістаєш його з купи?', 'heap.enqueue([0, k]). Поки купа не порожня: [d, u] = dequeue; якщо done має u — continue; done.set(u, d); для [v, w] з adj[u] — enqueue([d + w, v]). Якщо done.size < n — -1, інакше найбільший час.', 'while (heap.size()) { const [d, u] = heap.dequeue(); if (done.has(u)) continue; done.set(u, d); for (const [v, w] of adj[u]) if (!done.has(v)) heap.enqueue([d + w, v]); } return done.size === n ? Math.max(...done.values()) : -1;'],
  solution: 'function networkDelayTime(times: number[][], n: number, k: number): number {\n  const adj: number[][][] = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const done = new Map<number, number>();\n  const heap = new MinPriorityQueue<number[]>((x) => x[0]);\n  heap.enqueue([0, k]);\n  while (heap.size()) {\n    const [d, u] = heap.dequeue()!;\n    if (done.has(u)) continue;\n    done.set(u, d);\n    for (const [v, w] of adj[u]) if (!done.has(v)) heap.enqueue([d + w, v]);\n  }\n  return done.size === n ? Math.max(...done.values()) : -1;\n}',
  lesson: 'Дейкстра: найближчий із купи вже має остаточну відстань. Кроки різної довжини — купа замість хвиль.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. 01 Matrix */
function matRef(mat: Grid) {
  const d = mat.map((r) => r.map((v) => (v ? Infinity : 0)));
  let wave: Grid = []; mat.forEach((r, i) => r.forEach((v, j) => { if (!v) wave.push([i, j]); }));
  while (wave.length) { const next: Grid = []; for (const [r, c] of wave) for (const [dr, dc] of D4) { const x = r + dr, y = c + dc; if (d[x]?.[y] === Infinity) { d[x][y] = d[r][c] + 1; next.push([x, y]); } } wave = next; }
  return d;
}
const exits: Level = {
  id: 'camp.exits', world: 13, title: 'До найближчого виходу', topic: 'обхід ушир від багатьох джерел',
  leetcode: lc(542, '01 Matrix'),
  brief: '<b>До найближчого виходу.</b> Для кожного намету знайди, скільки кроків до найближчого виходу з табору.',
  statement: [
    'Низ малює мапу відступу. <code>mat</code> — сітка табору: <code>0</code> — вихід (прохід у частоколі), <code>1</code> — намет. Ходити — вгору, вниз, ліворуч, праворуч.',
    'Поверни сітку того ж розміру: для кожної клітинки — скільки кроків до <b>найближчого</b> нуля. У нулів — 0. Для <code>[[0, 0, 0], [0, 1, 0], [1, 1, 1]]</code> вийде <code>[[0, 0, 0], [0, 1, 0], [1, 2, 1]]</code>.',
    'Шукати вихід окремо з кожного намету — довго. Пусти хвилі <b>з усіх виходів одночасно</b>: перша хвиля — сусіди виходів (1 крок), друга — їхні сусіди (2 кроки), і так далі. Згадай зіпсовану бринзу.',
  ],
  tool: {
    name: 'хвилі з багатьох джерел',
    text: [
      'Почни з усіх нулів у першій хвилі; для решти відстань поки невідома (<code>Infinity</code>).',
      'Хвиля за хвилею: сусід з невідомою відстанню отримує відстань поточної клітинки + 1 і йде в наступну хвилю.',
    ],
    code: '// 0 0 0      0 0 0\n// 0 1 0  →   0 1 0\n// 1 1 1      1 2 1',
  },
  talk: [
    { who: 'warrior', text: 'Коли звільнимо лиса, тікати доведеться швидко. З кожного намету — до найближчого проходу.' },
    { who: 'enei', text: 'Пустимо хвилі від усіх проходів разом. Як бринза в Карпатах, тільки навпаки — рятує.' },
  ],
  quip: { who: 'warrior', text: 'Мапа відступу готова. Евріале, запам\'ятовуй.' },
  entry: 'updateMatrix', observe: ['mat'],
  starter: starter('updateMatrix', [['mat', 'number[][]']], 'number[][]', ['До найближчого виходу', '0 — вихід, 1 — намет. Поверни сітку відстаней до найближчого 0 (кроки в 4 боки).'], '  const dist = mat.map((row) => row.map((v) => (v === 0 ? 0 : Infinity)));\n  let wave = [];\n  // Слово ладу пиши тут\n\n  return dist;\n'),
  examples: [gridCase([[0, 0, 0], [0, 1, 0], [1, 1, 1]])],
  hidden: [gridCase([[0]]), gridCase([[0, 1, 1, 1]]), gridCase([[1, 1, 1], [1, 0, 1], [1, 1, 1]]), gridCase([[1, 0, 1, 1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 0, 1, 0, 1, 1]]), gridCase([[1, 1], [1, 1], [0, 1]])],
  reference: (m: Grid) => matRef(copy(m)),
  hints: ['Звідки почати хвилі, щоб кожна клітинка одразу отримала відстань до найближчого виходу?', 'wave = усі клітинки з 0. Поки хвиля є: для кожної [r, c] і 4 сусідів — якщо dist сусіда Infinity, він = dist[r][c] + 1 і в next.', 'for (const [r, c] of wave) for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < mat.length && y < mat[0].length && dist[x][y] === Infinity) { dist[x][y] = dist[r][c] + 1; next.push([x, y]); }'],
  solution: 'function updateMatrix(mat: number[][]): number[][] {\n  const dist = mat.map((row) => row.map((v) => (v === 0 ? 0 : Infinity)));\n  let wave: number[][] = [];\n  for (let r = 0; r < mat.length; r++) for (let c = 0; c < mat[0].length; c++) if (dist[r][c] === 0) wave.push([r, c]);\n  while (wave.length) {\n    const next: number[][] = [];\n    for (const [r, c] of wave) {\n      for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n        if (x < 0 || y < 0 || x >= mat.length || y >= mat[0].length || dist[x][y] !== Infinity) continue;\n        dist[x][y] = dist[r][c] + 1;\n        next.push([x, y]);\n      }\n    }\n    wave = next;\n  }\n  return dist;\n}',
  lesson: 'Відстань до найближчого з багатьох джерел — один обхід ушир, що стартує з усіх джерел одразу.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Path With Minimum Effort */
function effortRef(h: Grid) {
  const R = h.length, C = h[0].length;
  const ok = (e: number) => { const seen = new Set([0]), st = [[0, 0]]; while (st.length) { const [r, c] = st.pop()!; if (r === R - 1 && c === C - 1) return true; for (const [dr, dc] of D4) { const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < R && y < C && !seen.has(x * C + y) && Math.abs(h[x][y] - h[r][c]) <= e) { seen.add(x * C + y); st.push([x, y]); } } } return false; };
  let lo = 0, hi = 1e6;
  while (lo < hi) { const m = (lo + hi) >> 1; if (ok(m)) hi = m; else lo = m + 1; }
  return lo;
}
/** Табір 50 × 50: висоти пагорбів від 1 до 1000. */
function bigCamp(cells: number) { const s = Math.round(Math.sqrt(cells)), r = rng(1631); return Array.from({ length: s }, () => Array.from({ length: s }, () => 1 + Math.floor(r() * 1000))); }
const effort: Level = {
  id: 'camp.effort', world: 13, final: true, title: 'Найлегший шлях до Микити', topic: 'Дейкстра на сітці',
  leetcode: lc(1631, 'Path With Minimum Effort'),
  brief: '<b>Найлегший шлях до Микити.</b> Табір на пагорбах. Знайди шлях до полоненого, на якому найкрутіший підйом чи спуск — якомога пологіший.',
  statement: [
    'Микиту тримають у правому нижньому куті табору. <code>heights[r][c]</code> — висота пагорба. Ходити — вгору, вниз, ліворуч, праворуч. <b>Зусилля</b> шляху — найбільша різниця висот між двома сусідніми клітинками на ньому: саме на найкрутішому місці й можна зірватися й зашуміти.',
    'Поверни найменше можливе зусилля шляху від <code>[0, 0]</code> до правого нижнього кута. Для <code>[[1, 2, 2], [3, 8, 2], [5, 3, 5]]</code> — <code>2</code>: шлях 1 → 3 → 5 → 3 → 5 ніде не стрибає більше ніж на 2.',
    'Табір буває 50 × 50. Це знову Дейкстра, але «відстань» тепер не сума кроків, а <b>найбільший</b> крок на шляху. Дістаєш з купи клітинку з найменшим зусиллям — для неї воно вже остаточне.',
  ],
  tool: {
    name: 'Дейкстра з максимумом',
    text: [
      '<code>best[r][c]</code> — найменше відоме зусилля, з яким можна дійти до клітинки. У купі — <code>[зусилля, r, c]</code>, найменше нагорі.',
      'Перехід до сусіда коштує <code>max(зусилля, |різниця висот|)</code>. Якщо це менше за <code>best</code> сусіда — онови й поклади в купу. Дістав кінцеву клітинку — відповідь.',
    ],
    code: 'const heap = new MinPriorityQueue((x) => x[0]);\nheap.enqueue([0, 0, 0]);\n// [e, r, c] = heap.dequeue()\n// до сусіда: Math.max(e, Math.abs(h[x][y] - h[r][c]))',
  },
  talk: [
    { who: 'turn', text: 'Лиса шукаєте? Він у мене. Та табір на пагорбах: один необережний крок — і вся варта на ногах.' },
    { who: 'wolf', text: 'Я стережу лиса! Я ходжу всіма стежками одразу… і нічого не встигаю. Хто там?' },
    { who: 'fox', text: '(з полону) Енею! Не найкоротший — найпологіший! Найкрутіше місце вирішує все!' },
  ],
  quip: { who: 'fox', text: 'Енею! Я знав, що ти прийдеш. Ну, сподівався. Дивись — я знову всіх кольорів!' },
  entry: 'minimumEffortPath', observe: ['heights'],
  starter: starter('minimumEffortPath', [['heights', 'number[][]']], 'number', ['Найлегший шлях до Микити', 'Зусилля шляху — найбільша різниця висот між сусідніми клітинками.', 'Поверни найменше зусилля шляху з [0, 0] у правий нижній кут.'], '  const R = heights.length, C = heights[0].length;\n  const best = heights.map((row) => row.map(() => Infinity));\n  const heap = new MinPriorityQueue((x) => x[0]);\n  best[0][0] = 0;\n  heap.enqueue([0, 0, 0]);\n  // Слово ладу пиши тут\n\n  return 0;\n'),
  examples: [gridCase([[1, 2, 2], [3, 8, 2], [5, 3, 5]]), gridCase([[1, 2, 3], [3, 8, 4], [5, 3, 5]])],
  hidden: [gridCase([[7]]), gridCase([[1, 10, 6, 7, 9, 10, 4, 9]]), gridCase([[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]), gridCase([[3], [1], [9], [4]]), gridCase([[10, 8], [10, 8], [1, 2], [10, 3], [1, 3], [6, 3], [5, 2]])],
  big: { n: 2500, make: (n) => [bigCamp(n)], readBudget: (n) => 40 * n },
  reference: effortRef,
  wolf: { reads: (n) => n * 80, code: 'function minimumEffortPath(heights) {\n  const R = heights.length, C = heights[0].length;\n  const best = heights.map((row) => row.map(() => Infinity));\n  best[0][0] = 0;\n  // обходити весь табір знову і знову, доки хоч щось покращується\n  for (let changed = true; changed; ) {\n    changed = false;\n    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++)\n      for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n        if (x < 0 || y < 0 || x >= R || y >= C) continue;\n        const e = Math.max(best[x][y], Math.abs(heights[x][y] - heights[r][c]));\n        if (e < best[r][c]) { best[r][c] = e; changed = true; }\n      }\n  }\n  return best[R - 1][C - 1];\n}' },
  hints: ['Що означає «відстань» до клітинки, якщо рахуємо найкрутіший крок, а не суму?', 'Поки купа не порожня: [e, r, c] = dequeue; якщо це кінець — поверни e; якщо e > best[r][c] — пропусти. Для 4 сусідів: ne = max(e, |різниця|); якщо ne < best — онови й enqueue.', 'while (heap.size()) { const [e, r, c] = heap.dequeue(); if (r === R - 1 && c === C - 1) return e; if (e > best[r][c]) continue; for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) { if (x < 0 || y < 0 || x >= R || y >= C) continue; const ne = Math.max(e, Math.abs(heights[x][y] - heights[r][c])); if (ne < best[x][y]) { best[x][y] = ne; heap.enqueue([ne, x, y]); } } }'],
  solution: 'function minimumEffortPath(heights: number[][]): number {\n  const R = heights.length, C = heights[0].length;\n  const best = heights.map((row) => row.map(() => Infinity));\n  const heap = new MinPriorityQueue<number[]>((x) => x[0]);\n  best[0][0] = 0;\n  heap.enqueue([0, 0, 0]);\n  while (heap.size()) {\n    const [e, r, c] = heap.dequeue()!;\n    if (r === R - 1 && c === C - 1) return e;\n    if (e > best[r][c]) continue;\n    for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {\n      if (x < 0 || y < 0 || x >= R || y >= C) continue;\n      const ne = Math.max(e, Math.abs(heights[x][y] - heights[r][c]));\n      if (ne < best[x][y]) { best[x][y] = ne; heap.enqueue([ne, x, y]); }\n    }\n  }\n  return 0;\n}',
  lesson: 'Дейкстра працює з будь-якою «вартістю», що не зменшується вздовж шляху: сумою, а тут — максимумом кроку.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const camp: World = {
  n: 13, name: 'Табір Турна', song: 'Пісня VI · Лаціум', topic: 'Найкоротший шлях', fox: '#33467a',
  host: { who: 'Турн', line: 'Лис у мене, троянцю. Шукай його вночі, серед моєї варти, — якщо знайдеш дорогу.' },
  levels: [sneak, signal, exits, effort],
};
