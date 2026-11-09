import { type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { buildTree, lc, starter, tree, treeArray, type T } from './util.ts';
import { L } from '../i18n.ts';

/*
 * Світ 10 — Лісова пісня (за Лесею Українкою): двійкові дерева пошуку.
 * У лісі Мавки кожне дерево має своє місце: ліворуч молодші, праворуч старші.
 * Хто тримає цей порядок, той шукає за висотою дерева, а не перебирає весь ліс, як Вовк.
 */

const arr = (v: unknown) => JSON.stringify(v).replace(/,/g, ', ');
const ROOT: [string, string] = ['root', 'TreeNode | null'];
const withN = (v: (number | null)[], n: number): TestCase => ({ args: [tree(v), n], label: `${arr(v)}, ${n}` });
const one = (v: (number | null)[]): TestCase => ({ args: [tree(v)], label: arr(v) });
const treeCheck = (tc: TestCase, r: CallResult): true | string => {
  const got = r.value ?? [];
  return JSON.stringify(got) === JSON.stringify(tc.expected) || L(`очікували дерево ${arr(tc.expected)}, отримали ${arr(got)}`, `expected the tree ${arr(tc.expected)}, got ${arr(got)}`);
};
/** Збалансований ліс із віків 1..n — для великого тесту. */
function balanced(lo: number, hi: number): T | null {
  if (lo > hi) return null;
  const m = (lo + hi) >> 1;
  return { val: m, left: balanced(lo, m - 1), right: balanced(m + 1, hi) };
}
const FOREST = [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7];

/* 1. Search in a BST */
function findRef(a: unknown, v: number) { let n = buildTree(a); while (n && n.val !== v) n = v < n.val ? n.left : n.right; return treeArray(n); }
const search: Level = {
  id: 'song.search', world: 10, title: 'Дерево потрібного віку', topic: 'BST: ліворуч менше, праворуч більше',
  leetcode: lc(700, 'Search in a Binary Search Tree'),
  brief: '<b>Дерево потрібного віку.</b> Ліс упорядкований: молодші ліворуч, старші праворуч. Знайди дерево, якому рівно <code>val</code> років.',
  statement: [
    'У лісі Мавки кожне дерево знає своє місце. Це <b>двійкове дерево пошуку</b>: у кожного вузла всі в лівій гілці молодші за нього, а всі в правій — старші. <code>node.val</code> — вік дерева.',
    'Знайди вузол, у якого <code>val</code> дорівнює шуканому віку, і поверни його (рушій покаже його гілку). Якщо такого дерева немає — поверни <code>null</code>. Для лісу <code>[4, 2, 7, 1, 3]</code> і <code>val = 2</code> відповідь — гілка <code>[2, 1, 3]</code>.',
    'Дерев буває до 10 000. Не обходь увесь ліс: порівняй вік із поточним деревом і йди лише в той бік, де шукане може бути. Так, як у Конотопі: кожен погляд відкидає пів лісу.',
  ],
  tool: {
    name: 'дерево пошуку',
    text: [
      'Правило BST: ліва гілка &lt; вузол &lt; права гілка — і так у кожному вузлі.',
      'Шукане менше за вузол — іди ліворуч, більше — праворуч, дорівнює — знайшов. Дійшов до <code>null</code> — такого немає. Кроків стільки, скільки поверхів у дереві.',
    ],
    code: '//        8\n//      /   \\\n//     4     12      шукаємо 6:\n//    / \\           6 < 8 → ліворуч\n//   2   6          6 > 4 → праворуч → знайшли',
  },
  talk: [
    { who: 'mavka', text: 'Ліс засинає. Кожне дерево мало своє місце, а тепер ніхто не знайде навіть найстаршого граба.' },
    { who: 'fox', text: 'Але порядок ще тримається: молодші ліворуч, старші праворуч. То й шукаймо, як у Конотопі, — навпіл.' },
    { who: 'wolf', text: 'А я просто обійду кожне дерево. І кожне понюхаю. Ну, і трохи погризу.' },
  ],
  quip: { who: 'mavka', text: 'Знайшли за кілька кроків, і жодного дерева не зрубали. Ліс пам\'ятатиме.' },
  entry: 'searchBST', observe: ['root', null],
  starter: starter('searchBST', [ROOT, ['val', 'number']], 'TreeNode | null', ['Дерево потрібного віку', 'Ліворуч молодші, праворуч старші. Поверни вузол з віком val або null.'], '  let node = root;\n  // Слово ладу пиши тут\n\n  return node;\n'),
  examples: [withN([4, 2, 7, 1, 3], 2), withN([4, 2, 7, 1, 3], 5)],
  hidden: [withN([], 1), withN([5], 5), withN(FOREST, 7), withN(FOREST, 12), withN(FOREST, 9), withN([3, 1, 5, null, 2, 4, 6], 4)],
  big: { n: 10000, make: (n) => [tree(treeArray(balanced(1, n))), 7777], readBudget: () => 200 },
  reference: findRef,
  check: treeCheck,
  wolf: { reads: (n) => 3 * n, code: 'function searchBST(root, val) {\n  let found = null;\n  const visit = (node) => {\n    if (!node) return;\n    if (node.val === val) found = node;\n    visit(node.left);\n    visit(node.right);\n  };\n  visit(root);\n  return found;\n}' },
  hints: ['Як вирішити, ліворуч чи праворуч, лише поглянувши на одне дерево?', 'Поки node є і node.val !== val: якщо val < node.val — node = node.left, інакше node = node.right.', 'while (node && node.val !== val) node = val < node.val ? node.left : node.right;'],
  solution: 'function searchBST(root: TreeNode | null, val: number): TreeNode | null {\n  let node = root;\n  while (node && node.val !== val) node = val < node.val ? node.left : node.right;\n  return node;\n}',
  lesson: 'У дереві пошуку кожне порівняння відкидає цілу гілку: кроків стільки, скільки поверхів, а не дерев.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Insert into a BST */
function insertRef(a: unknown, v: number) {
  const root = buildTree(a), leaf: T = { val: v, left: null, right: null };
  if (!root) return treeArray(leaf);
  let n = root;
  for (;;) { const side = v < n.val ? 'left' : 'right'; if (!n[side]) { n[side] = leaf; break; } n = n[side]!; }
  return treeArray(root);
}
const insert: Level = {
  id: 'song.insert', world: 10, title: 'Нове деревце', topic: 'BST: вставка в листок',
  leetcode: lc(701, 'Insert into a Binary Search Tree'),
  brief: '<b>Нове деревце.</b> Лукаш приніс саджанець віком <code>val</code>. Посади його так, щоб ліс лишився впорядкованим.',
  statement: [
    'Лукаш виростив саджанець і хоче посадити його в ліс Мавки. Саджанцю <code>val</code> років, і такого віку в лісі ще немає.',
    'Знайди йому місце, як під час пошуку: менше — ліворуч, більше — праворуч, аж поки не натрапиш на порожнє місце. Там і посади новий вузол <code>new TreeNode(val)</code>. Поверни корінь лісу.',
    'Для лісу <code>[4, 2, 7, 1, 3]</code> і <code>val = 5</code> вийде <code>[4, 2, 7, 1, 3, 5]</code>: 5 більше за 4 — праворуч, менше за 7 — ліворуч від 7, а там порожньо. Якщо лісу немає зовсім, саджанець стає коренем.',
  ],
  tool: {
    name: 'новий вузол',
    text: [
      '<code>new TreeNode(val)</code> створює вузол без дітей. Щоб посадити його, причепи до батька: <code>node.left = …</code> або <code>node.right = …</code>.',
      'Іди вниз, як під час пошуку, але зупинись на кроці раніше: коли потрібна дитина — <code>null</code>.',
    ],
    code: 'const leaf = new TreeNode(5);\nnode.right = leaf;   // тепер 5 — права дитина node',
  },
  talk: [
    { who: 'mavka', text: 'Лукаш приніс деревце. Посадиш не там — і весь ліс знову переплутається.' },
    { who: 'fox', text: 'Підемо так, ніби шукаємо його. Де пошук упреться в порожнечу — там йому й рости.' },
  ],
  quip: { who: 'mavka', text: 'Прийнялося. Чуєш? Ліс трохи прокинувся.' },
  entry: 'insertIntoBST', observe: ['root', null],
  starter: starter('insertIntoBST', [ROOT, ['val', 'number']], 'TreeNode | null', ['Нове деревце', 'Посади вузол new TreeNode(val) так, щоб порядок не зламався. Поверни корінь.'], '  if (!root) return new TreeNode(val);\n  // Слово ладу пиши тут\n\n  return root;\n'),
  examples: [withN([4, 2, 7, 1, 3], 5)],
  hidden: [withN([], 5), withN([40, 20, 60, 10, 30, 50, 70], 25), withN([4, 2, 7, 1, 3], 0), withN([5, null, 9], 7), withN(FOREST, 13)],
  reference: insertRef,
  check: treeCheck,
  hints: ['Як знайти місце, де нового дерева ще немає?', 'node = root. Нескінченний цикл: side = val < node.val ? "left" : "right"; якщо node[side] порожній — посади й вийди, інакше node = node[side].', 'let node = root; for (;;) { if (val < node.val) { if (!node.left) { node.left = new TreeNode(val); break; } node = node.left; } else { if (!node.right) { node.right = new TreeNode(val); break; } node = node.right; } }'],
  solution: 'function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {\n  if (!root) return new TreeNode(val);\n  let node = root;\n  for (;;) {\n    if (val < node.val) {\n      if (!node.left) { node.left = new TreeNode(val); break; }\n      node = node.left;\n    } else {\n      if (!node.right) { node.right = new TreeNode(val); break; }\n      node = node.right;\n    }\n  }\n  return root;\n}',
  lesson: 'Вставка в BST — це пошук, який зупиняється на порожньому місці. Новий вузол завжди стає листком.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Validate BST */
function validRef(a: unknown) { const go = (n: T | null, lo: number, hi: number): boolean => !n || (n.val > lo && n.val < hi && go(n.left, lo, n.val) && go(n.right, n.val, hi)); return go(buildTree(a), -Infinity, Infinity); }
const validate: Level = {
  id: 'song.valid', world: 10, title: 'Чи ліс упорядкований', topic: 'BST: межі зверху й знизу',
  leetcode: lc(98, 'Validate Binary Search Tree'),
  brief: '<b>Чи ліс упорядкований.</b> Перевір, чи кожне дерево стоїть на своєму місці.',
  statement: [
    'Перш ніж Лукаш заграє на сопілці, треба переконатися, що ліс знову впорядкований. Поверни <code>true</code>, якщо дерево — справжнє дерево пошуку, і <code>false</code>, якщо ні.',
    'Пастка: мало перевірити, що ліва дитина менша за батька, а права — більша. Правило стосується <b>всієї</b> гілки. У <code>[5, 1, 4, null, null, 3, 6]</code> праворуч від 5 стоїть 3 (онук), і це вже зламаний ліс. Усі віки різні; рівні вважай порушенням.',
    'Спускайся з <b>межами</b>: кожне дерево має бути більшим за нижню межу й меншим за верхню. Ідучи ліворуч, верхньою межею стає батько; праворуч — нижньою.',
  ],
  tool: {
    name: 'межі lo і hi',
    text: [
      'Функція <code>ok(node, lo, hi)</code> перевіряє, що все в гілці лежить строго між <code>lo</code> і <code>hi</code>. Корінь перевіряють між <code>-Infinity</code> і <code>Infinity</code>.',
      'Ліва дитина: <code>ok(node.left, lo, node.val)</code>. Права: <code>ok(node.right, node.val, hi)</code>.',
    ],
    code: '//      5\n//     / \\\n//    1   4        4 < 5 — праворуч не може бути!\n//       / \\\n//      3   6',
  },
  talk: [
    { who: 'mavka', text: 'Здається, все стоїть як слід. Але уламок хитрий: міг сховати чуже дерево глибоко в гілці.' },
    { who: 'fox', text: 'Тоді кожному дереву дамо межі: не молодше за ось це і не старше за те. І так донизу.' },
  ],
  quip: { who: 'mavka', text: 'Тепер я певна. Лукашу, грай!' },
  entry: 'isValidBST', observe: ['root'],
  starter: starter('isValidBST', [ROOT], 'boolean', ['Чи ліс упорядкований', 'true, якщо в кожному вузлі вся ліва гілка менша, а вся права — більша.'], '  const ok = (node, lo, hi) => {\n    // Слово ладу пиши тут\n    return true;\n  };\n  return ok(root, -Infinity, Infinity);\n'),
  examples: [one([2, 1, 3]), one([5, 1, 4, null, null, 3, 6])],
  hidden: [one([]), one([1]), one([1, 1]), one([5, 4, 6, null, null, 3, 7]), one(FOREST), one([10, 5, 15, 1, 8, 12, 20, null, null, 6, 11])],
  reference: validRef,
  hints: ['Яким має бути кожен вузол у лівій гілці кореня? А в правій?', 'ok(node, lo, hi): порожній — true. Якщо node.val ≤ lo або ≥ hi — false. Інакше ok(left, lo, node.val) і ok(right, node.val, hi).', 'if (!node) return true; if (node.val <= lo || node.val >= hi) return false; return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);'],
  solution: 'function isValidBST(root: TreeNode | null): boolean {\n  const ok = (node: TreeNode | null, lo: number, hi: number): boolean => {\n    if (!node) return true;\n    if (node.val <= lo || node.val >= hi) return false;\n    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);\n  };\n  return ok(root, -Infinity, Infinity);\n}',
  lesson: 'Правило BST стосується всієї гілки, тож перевіряй межі, що звужуються згори вниз, а не лише сусідів.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Kth Smallest */
function kthRef(a: unknown, k: number) { const out: number[] = []; const go = (n: T | null) => { if (!n) return; go(n.left); out.push(n.val); go(n.right); }; go(buildTree(a)); return out[k - 1]; }
const kth: Level = {
  id: 'song.kth', world: 10, final: true, title: 'Пісня сопілки', topic: 'BST: обхід по порядку',
  leetcode: lc(230, 'Kth Smallest Element in a BST'),
  brief: '<b>Пісня сопілки.</b> Сопілка Лукаша будить дерева від наймолодшого. Яке дерево прокинеться <code>k</code>-тим?',
  statement: [
    'Лукаш грає, і ліс прокидається: спершу наймолодше дерево, потім старше, і так за віком. Мавка хоче знати, хто прокинеться <code>k</code>-тим.',
    'Поверни <code>k</code>-тий найменший вік у дереві пошуку (рахуючи з 1). Для <code>[3, 1, 4, null, 2]</code> і <code>k = 1</code> — це <code>1</code>; для <code>[5, 3, 6, 2, 4, null, null, 1]</code> і <code>k = 3</code> — <code>3</code>.',
    'У дереві пошуку є чарівний обхід: «ліва гілка, сам вузол, права гілка». Він видає віки точно за зростанням. Тож іди цим обходом і рахуй, доки не дорахуєш до <code>k</code>.',
  ],
  tool: {
    name: 'обхід по порядку (inorder)',
    text: [
      'Спершу вся ліва гілка, потім сам вузол, потім уся права. У BST так вузли виходять від найменшого до найбільшого.',
      'Тримай лічильник: щоразу, коли «відвідуєш» вузол, збільшуй його. Дійшов до <code>k</code> — запам\'ятай відповідь, далі можна не йти.',
    ],
    code: 'const visit = (node) => {\n  if (!node) return;\n  visit(node.left);\n  console.log(node.val);   // за зростанням!\n  visit(node.right);\n};',
  },
  talk: [
    { who: 'mavka', text: 'Слухай, як грає Лукаш. Дерева прокидаються по черзі, від наймолодшого.' },
    { who: 'wolf', text: 'А я зрубаю всі, складу в купу, відсортую й порахую! Ой… а Той, що в скалі сидить, уже дивиться на мене.' },
    { who: 'fox', text: 'Не руби нічого. Ліва гілка, вузол, права гілка — і вони самі вишикуються за віком.' },
  ],
  quip: { who: 'mavka', text: 'Ліс прокинувся. Ти почув, як я співаю? Тепер ця пісня і твоя.' },
  entry: 'kthSmallest', observe: ['root', null],
  starter: starter('kthSmallest', [ROOT, ['k', 'number']], 'number', ['Пісня сопілки', 'Поверни k-тий найменший вік у дереві пошуку (k рахується з 1).'], '  let count = 0, answer = -1;\n  const visit = (node) => {\n    // Слово ладу пиши тут\n  };\n  visit(root);\n  return answer;\n'),
  examples: [withN([3, 1, 4, null, 2], 1), withN([5, 3, 6, 2, 4, null, null, 1], 3)],
  hidden: [withN([1], 1), withN(FOREST, 11), withN(FOREST, 6), withN([2, 1, 3], 2), withN([10, 5, 15, 3, 7, 12, 20], 7)],
  reference: kthRef,
  hints: ['У якому порядку обійти дерево, щоб віки йшли за зростанням?', 'visit(node): якщо node порожній або відповідь уже є — назад. visit(left); count++; якщо count === k — answer = node.val; visit(right).', 'if (!node || count >= k) return; visit(node.left); if (++count === k) answer = node.val; visit(node.right);'],
  solution: 'function kthSmallest(root: TreeNode | null, k: number): number {\n  let count = 0, answer = -1;\n  const visit = (node: TreeNode | null) => {\n    if (!node || count >= k) return;\n    visit(node.left);\n    if (++count === k) answer = node.val;\n    visit(node.right);\n  };\n  visit(root);\n  return answer;\n}',
  lesson: 'Inorder-обхід BST видає значення за зростанням: k-те найменше — це k-тий відвіданий вузол.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const song: World = {
  n: 10, name: 'Лісова пісня', song: 'Пісня V · Ліси й гори', topic: 'Binary Search Tree', fox: '#86c95f',
  host: { who: 'Мавка', line: 'Кожне дерево мало своє місце: молодші ліворуч, старші праворуч. Поверни лісові лад — і він прокинеться.' },
  motif: 'periwinkle', trick: 'Барвінок: дерево пошуку',
  levels: [search, insert, validate, kth],
};
