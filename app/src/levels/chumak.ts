import { type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L } from '../i18n.ts';

/*
 * Світ 7 — Чумацький шлях, зв'язні списки (за чумацькими піснями).
 * Валка возів: кожен віз (ListNode) знає лише наступного (next). Світ рахує кожен погляд на віз
 * (val чи next), а сцена показує зачіпки — і як код їх переписує.
 */

/** Тест зі списком: значення возів і, якщо треба, куди замикається хвіст. */
const list = (a: number[], pos = -1) => ({ $list: a, ...(pos >= 0 ? { pos } : {}) });
const label = (a: number[], pos = -1) => `${JSON.stringify(a)}${pos >= 0 ? ` ↻ ${pos}` : ''}`;
const one = (a: number[], pos = -1): TestCase => ({ args: [list(a, pos)], label: label(a, pos) });
const vals = (a: unknown) => (a as { $list: number[] }).$list;
const HEAD: [string, string] = ['head', 'ListNode | null'];

/** Список у відповіді вже перетворено на масив значень; null — це порожня валка. */
const listCheck = (tc: TestCase, r: CallResult): true | string => {
  // null у JS і None у Python — однаково порожня валка
  const got = r.value ?? [];
  return JSON.stringify(got) === JSON.stringify(tc.expected) || L(`очікували валку ${JSON.stringify(tc.expected)}, отримали ${JSON.stringify(got)}`, `expected the train ${JSON.stringify(tc.expected)}, got ${JSON.stringify(got)}`);
};

/* 1. Обхід списку */
const walk: Level = {
  id: 'chumak.walk', world: 7, title: 'Скільки солі у валці', topic: 'прохід списком',
  brief: '<b>Скільки солі у валці.</b> Вози зачеплені один за одного. Пройди валку від першого воза до останнього й порахуй сіль.',
  statement: [
    'Чумаки везуть сіль із Криму. Валка — це вози, і кожен зачеплений за наступного. Такий ланцюжок називають <b>зв\'язаним списком</b>. У кожного воза <code>node.val</code> — скільки на ньому мішків солі, а <code>node.next</code> — наступний віз, або <code>null</code>, якщо цей останній.',
    'Тобі дають лише перший віз — <code>head</code>. Поверни, скільки солі в усій валці. Для валки 5 → 3 → 8 це <code>16</code>. Якщо валки немає (<code>head</code> дорівнює <code>null</code>), поверни <code>0</code>.',
    'Номерів, як у масиві, тут немає: до п\'ятого воза доходиш, лише пройшовши чотири перед ним. Тож іди так: «поки віз є — додай його сіль і перейди на <code>next</code>».',
  ],
  tool: {
    name: 'зв\'язний список',
    text: [
      'Кожен вузол знає лише своє значення <code>val</code> і наступного <code>next</code>. Щоб пройти список, тримай змінну <code>node</code> і переходь далі: <code>node = node.next</code>.',
      'Коли <code>node</code> стане <code>null</code>, вози скінчились. Звідси й умова циклу: <code>while (node)</code>.',
    ],
    code: 'let node = head;\nwhile (node) {\n  console.log(node.val);   // що на цьому возі\n  node = node.next;        // до наступного\n}',
  },
  talk: [
    { who: 'ox', text: 'Мууу. Третю ніч ходимо степом, а скільки солі везем — ніхто не знає. Кожен віз пам\'ятає лише того, що попереду.' },
    { who: 'fox', text: 'То й не треба більше. Від першого воза до наступного, від наступного — далі, доки вози не скінчаться.' },
  ],
  quip: { who: 'ox', text: 'Стільки солі! Тепер хоч знаю, за що мені так важко.' },
  entry: 'totalSalt', observe: ['head'],
  starter: starter('totalSalt', [HEAD], 'number', ['Скільки солі у валці', 'node.val — сіль на возі, node.next — наступний віз або null.', 'Поверни суму на всіх возах.'], '  let total = 0;\n  // Слово ладу пиши тут\n\n  return total;\n'),
  examples: [one([5, 3, 8])],
  hidden: [one([]), one([7]), one([1, 2, 3, 4, 5]), one([10, 0, 10])],
  reference: (a: unknown) => vals(a).reduce((s, x) => s + x, 0),
  hints: ['Як дістатися від першого воза до другого?', 'node = head; поки node не null: додай node.val і перейди до node.next.', 'for (let node = head; node; node = node.next) total += node.val;'],
  solution: 'function totalSalt(head: ListNode | null): number {\n  let total = 0;\n  for (let node = head; node; node = node.next) total += node.val;\n  return total;\n}',
  lesson: 'Зв\'язний список проходять від голови, крок за кроком через next, доки не прийде null.',
  scene: { type: 'array', skin: 'sack', mode: 'scan' },
};

/* 2. Reverse Linked List */
const reverse: Level = {
  id: 'chumak.reverse', world: 7, title: 'Назад до Криму', topic: 'перечепити зачіпки',
  leetcode: lc(206, 'Reverse Linked List'),
  brief: '<b>Назад до Криму.</b> Розверни валку: тепер кожен віз має бути зачеплений за того, хто був позаду.',
  statement: [
    'Чумаки забули в Криму кобзу й мусять повертатися. Валку треба розвернути: останній віз стане першим. З 1 → 2 → 3 → 4 → 5 має вийти 5 → 4 → 3 → 2 → 1.',
    'Перечепи <code>next</code> кожного воза на попереднього й поверни нову голову, тобто колишній останній віз. Нових возів не створюй, тільки перечіплюй.',
    'Небезпека одна: щойно перечепиш <code>next</code>, дорогу вперед загубиш. Тож спершу запам\'ятай у змінній, хто попереду, а потім перечіплюй.',
  ],
  tool: {
    name: 'три вказівники: prev, node, next',
    text: [
      '<code>prev</code> — вже розвернута частина, <code>node</code> — поточний віз. На кожному кроці: запам\'ятай <code>next = node.next</code>, перечепи <code>node.next = prev</code>, а тоді посунь обидва вперед.',
      'Коли <code>node</code> стане <code>null</code>, <code>prev</code> — нова голова.',
    ],
    code: '// 1 → 2 → 3          prev = null, node = 1\n// null ← 1   2 → 3   prev = 1,    node = 2\n// null ← 1 ← 2   3   prev = 2,    node = 3\n// null ← 1 ← 2 ← 3   prev = 3 — нова голова',
  },
  talk: [
    { who: 'ox', text: 'Мууу! Кобзу в Криму забули! Розвертайте валку, тільки обережно: вози зачеплені один за одного.' },
    { who: 'fox', text: 'Перечіплюй по одному. Але спершу запам\'ятай, хто попереду, — бо відчепиш — і пів валки загубиш.' },
  ],
  quip: { who: 'ox', text: 'Розвернулися й нікого не загубили. А кобза — от вона, на першому возі.' },
  entry: 'reverseList', observe: ['head'],
  starter: starter('reverseList', [HEAD], 'ListNode | null', ['Назад до Криму', 'Розверни список і поверни нову голову. Нових вузлів не створюй.'], '  let prev = null;\n  let node = head;\n  // Слово ладу пиши тут\n\n  return prev;\n'),
  examples: [one([1, 2, 3, 4, 5])],
  hidden: [one([]), one([1]), one([1, 2]), one([9, 8, 7, 6])],
  reference: (a: unknown) => vals(a).slice().reverse(),
  check: listCheck,
  hints: ['Що станеться з рештою валки, якщо одразу написати node.next = prev?', 'Поки node: next = node.next; node.next = prev; prev = node; node = next. Поверни prev.', 'while (node) { const next = node.next; node.next = prev; prev = node; node = next; } return prev;'],
  solution: 'function reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  let node = head;\n  while (node) {\n    const next = node.next;\n    node.next = prev;\n    prev = node;\n    node = next;\n  }\n  return prev;\n}',
  lesson: 'Перечіплюючи зачіпку, спершу запам\'ятай, куди вона вела: prev, node і next — і список розвернуто без жодного нового вузла.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Middle of the Linked List */
const middle: Level = {
  id: 'chumak.middle', world: 7, title: 'Середній віз', topic: 'повільний і швидкий',
  leetcode: lc(876, 'Middle of the Linked List'),
  brief: '<b>Середній віз.</b> Знайди віз посередині валки, не рахуючи її довжини заздалегідь.',
  statement: [
    'Отаман їде на середньому возі: звідти видно і голову, і хвіст валки. Але скільки возів у валці, ніхто не знає.',
    'Поверни середній віз. Для 1 → 2 → 3 → 4 → 5 це віз <code>3</code>. Якщо возів парна кількість, середніх два: поверни <b>другого</b>, для 1 → 2 → 3 → 4 → 5 → 6 це <code>4</code>.',
    'Можна спершу порахувати вози, а потім пройти половину. А можна за один прохід: віл іде по одному возу, лис — по два. Коли лис дійде до кінця, віл якраз буде посередині.',
  ],
  tool: {
    name: 'повільний і швидкий',
    text: [
      'Два вказівники стартують з голови: <code>slow</code> робить один крок (<code>slow.next</code>), <code>fast</code> — два (<code>fast.next.next</code>).',
      'Коли швидкий дійде до кінця, повільний пройде рівно половину. Цикл триває, поки <code>fast</code> і <code>fast.next</code> не <code>null</code>.',
    ],
    code: '// 1 → 2 → 3 → 4 → 5\n// slow: 1, 2, 3\n// fast: 1, 3, 5 — далі нікуди\n// slow на 3 — середина',
  },
  talk: [
    { who: 'ox', text: 'Отаман питає, де середина валки. А я ж повільний, мені до кінця й назад — до ранку.' },
    { who: 'fox', text: 'Ходімо разом: ти по одному возу, я по два. Коли я добіжу до хвоста, ти саме будеш посередині.' },
  ],
  quip: { who: 'ox', text: 'Повільний, а прийшов куди треба. Мууу — це я гордо.' },
  entry: 'middleNode', observe: ['head'],
  starter: starter('middleNode', [HEAD], 'ListNode | null', ['Середній віз', 'Поверни середній вузол (з двох середніх — другий).'], '  let slow = head, fast = head;\n  // Слово ладу пиши тут\n\n  return slow;\n'),
  examples: [one([1, 2, 3, 4, 5]), one([1, 2, 3, 4, 5, 6])],
  hidden: [one([1]), one([1, 2]), one([4, 7, 1, 9, 2, 6, 3])],
  reference: (a: unknown) => { const v = vals(a); return v.slice(Math.floor(v.length / 2)); },
  check: listCheck,
  hints: ['Якщо один іде вдвічі швидше, де буде другий, коли перший дійде до кінця?', 'Поки fast і fast.next: slow = slow.next; fast = fast.next.next. Поверни slow.', 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; } return slow;'],
  solution: 'function middleNode(head: ListNode | null): ListNode | null {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}',
  lesson: 'Повільний і швидкий вказівники знаходять середину за один прохід: коли швидкий у кінці, повільний посередині.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Merge Two Sorted Lists */
const two = (a: number[], b: number[]): TestCase => ({ args: [list(a), list(b)], label: `${JSON.stringify(a)}, ${JSON.stringify(b)}` });
const merge: Level = {
  id: 'chumak.merge', world: 7, title: 'Дві валки в одну', topic: 'фіктивна голова',
  leetcode: lc(21, 'Merge Two Sorted Lists'),
  brief: '<b>Дві валки в одну.</b> Злий дві валки, впорядковані за вагою, в одну, теж упорядковану.',
  statement: [
    'Біля переправи зустрілися дві валки, <code>list1</code> і <code>list2</code>. У кожній вози йдуть від легшого до важчого.',
    'Перечепи вози в одну валку, теж від легшого до важчого, і поверни її голову. Для 1 → 2 → 4 і 1 → 3 → 4 вийде 1 → 1 → 2 → 3 → 4 → 4. Нових возів не створюй, тільки перечіплюй.',
    'Щоразу порівнюй перші вози обох валок і чіпляй легший. Зручно почати з <b>фіктивного</b> воза: він тримає місце голови, а наприкінці його просто відчепити.',
  ],
  tool: {
    name: 'фіктивна голова',
    text: [
      'Створи порожній віз <code>new ListNode(0)</code> і змінну <code>tail</code>, що вказує на кінець уже зібраної валки.',
      'На кожному кроці вибери легший з двох передніх возів, причепи його до <code>tail</code> і посунь <code>tail</code>. Коли одна валка скінчиться, решту другої причепи цілком. Відповідь — <code>dummy.next</code>.',
    ],
    code: '// dummy → (порожньо)\n// list1: 1 → 4   list2: 2 → 3\n// dummy → 1 → 2 → 3 → 4\n// відповідь: dummy.next',
  },
  talk: [
    { who: 'ox', text: 'Дві валки на одній переправі! Хто перший? Хто важчий? Мууу, рогами зачепимося.' },
    { who: 'fox', text: 'Ставимо порожній віз на голову й щоразу чіпляємо легшого з двох передніх. Хвіст другої валки — одним махом.' },
  ],
  quip: { who: 'ox', text: 'Одна валка, від легшого до важчого. Переправа ще ніколи не була така спокійна.' },
  entry: 'mergeTwoLists', observe: ['list1', 'list2'],
  starter: starter('mergeTwoLists', [['list1', 'ListNode | null'], ['list2', 'ListNode | null']], 'ListNode | null', ['Дві валки в одну', 'list1 і list2 упорядковані. Злий їх в один упорядкований список.'], '  const dummy = new ListNode(0);\n  let tail = dummy;\n  // Слово ладу пиши тут\n\n  return dummy.next;\n'),
  examples: [two([1, 2, 4], [1, 3, 4])],
  hidden: [two([], []), two([], [0]), two([5], [1, 2, 3]), two([1, 1, 1], [1, 1]), two([2, 6, 9], [1, 7, 8, 10])],
  reference: (a: unknown, b: unknown) => [...vals(a), ...vals(b)].sort((x, y) => x - y),
  check: listCheck,
  hints: ['Який віз має стати наступним у зібраній валці?', 'Поки обидві валки є: причепи до tail легший з list1 і list2, посунь його валку й tail. Потім причепи залишок.', 'while (list1 && list2) { if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; } else { tail.next = list2; list2 = list2.next; } tail = tail.next; } tail.next = list1 ?? list2;'],
  solution: 'function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n  const dummy = new ListNode(0);\n  let tail = dummy;\n  while (list1 && list2) {\n    if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }\n    else { tail.next = list2; list2 = list2.next; }\n    tail = tail.next;\n  }\n  tail.next = list1 ?? list2;\n  return dummy.next;\n}',
  lesson: 'Фіктивна голова прибирає особливий випадок «а що на початку»: чіпляй до хвоста, а відповідь — dummy.next.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Linked List Cycle */
function hasCycleRef(a: unknown) { const p = (a as { pos?: number }).pos; return p !== undefined && p >= 0 && vals(a).length > 0; }
const cycle: Level = {
  id: 'chumak.cycle', world: 7, final: true, title: 'Валка по колу', topic: 'віл і лис: чи зустрінуться',
  leetcode: lc(141, 'Linked List Cycle'),
  brief: '<b>Валка по колу.</b> Доведи, що валка ходить по колу: хвіст зачеплено за один із возів попереду.',
  statement: [
    'Уламок переплутав зачіпки: останній віз, схоже, зачеплено за когось у середині, і валка третю ніч кружляє степом.',
    'Поверни <code>true</code>, якщо, йдучи по <code>next</code>, можна повернутися до воза, де вже був (тобто є коло). Поверни <code>false</code>, якщо валка закінчується і ти дійшов до <code>null</code>.',
    'Возів буває до 10 000. Вовк для кожного воза перевіряє, чи не бачив його раніше, проходячи все спочатку. Хитріше пустити в дорогу вола й лиса: лис іде вдвічі швидше. Якщо є коло, лис рано чи пізно наздожене вола ззаду.',
  ],
  tool: {
    name: 'віл і лис (алгоритм Флойда)',
    text: [
      'Повільний <code>slow</code> іде по одному возу, швидкий <code>fast</code> — по два. Якщо валка має кінець, швидкий дійде до <code>null</code>.',
      'Якщо ж валка по колу, швидкий наздожене повільного з іншого боку кола — і вони опиняться на тому самому возі: <code>slow === fast</code>.',
    ],
    code: '// 1 → 2 → 3 → 4 ┐\n//     └─────────┘   (4 зачеплено за 2)\n// slow: 1, 2, 3, 4\n// fast: 1, 3, 2, 4 — зустрілися на 4: коло!',
  },
  talk: [
    { who: 'ox', text: 'Мууу… Знову ця криниця. Чи це вже інша? Здається, ми ходимо по колу, але я не певен.' },
    { who: 'wolf', text: 'Я перевірю! Для кожного воза пройду валку від початку й подивлюся, чи не бачив його. Скоро скінчу. Ну, колись.' },
    { who: 'fox', text: 'Віле, ходімо: ти по одному возу, я по два. Якщо зустрінемося — значить, коло. Якщо я дійду до кінця — ні.' },
  ],
  quip: { who: 'ox', text: 'Зустрілися! Значить, коло. Тепер перечепимо хвоста — і додому, до Криму. Мууу!' },
  entry: 'hasCycle', observe: ['head'],
  starter: starter('hasCycle', [HEAD], 'boolean', ['Валка по колу', 'true, якщо в списку є цикл.'], '  let slow = head, fast = head;\n  // Слово ладу пиши тут\n\n  return false;\n'),
  examples: [one([3, 2, 0, -4], 1), one([1, 2, 3, 4, 5, 6])],
  hidden: [one([1, 2], 0), one([1]), one([]), one([1, 2, 3, 4, 5, 6], 5), one([7, 7, 7], 0), one([5, 5, 5, 5, 5])],
  big: { n: 10000, make: (n) => [list(Array.from({ length: n }, (_, i) => i % 97), Math.floor(n * 0.2))], readBudget: (n) => 10 * n },
  reference: hasCycleRef,
  wolf: { reads: (n) => Math.round((n * n) / 2), code: 'function hasCycle(head) {\n  let i = 0;\n  for (let node = head; node; node = node.next, i++) {\n    let p = head;\n    for (let j = 0; j < i; j++) { if (p === node) return true; p = p.next; }\n  }\n  return false;\n}' },
  hints: ['Що станеться з тим, хто йде вдвічі швидше, якщо дорога замкнена в коло?', 'slow — по одному, fast — по два. Поки fast і fast.next: зроби кроки; якщо slow === fast — true. Вийшли з циклу — false.', 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; } return false;'],
  solution: 'function hasCycle(head: ListNode | null): boolean {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow!.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
  lesson: 'Повільний і швидкий на колі неодмінно зустрінуться: цикл знайдено за O(n) кроків і без жодної пам\'яті про пройдене.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const chumak: World = {
  n: 7, name: 'Чумацький шлях', song: 'Пісня III · Випробування', topic: 'Linked List', fox: '#d3e0f7',
  host: { who: 'Віл Половий', line: 'Валка ходить по колу третю ніч. Я повільний, а лис швидкий — хай перевірять, чи зустрінемося.' },
  motif: 'chain', trick: 'Ланцюжок: зв\'язний список',
  levels: [walk, reverse, middle, merge, cycle],
};
