import { type Level, type World } from '../engine/level.ts';
import type { CallResult, TestCase } from '../engine/types.ts';
import { buildTree, lc, starter, tree, treeArray, type T } from './util.ts';
import { L } from '../i18n.ts';

/*
 * Світ 9 — Родовід Анхіза (Елісій): двійкові дерева.
 * Анхіз показує Енеєві нащадків. Кожен вузол — нащадок (TreeNode: val, left, right),
 * дерево в тесті задано масивом по рівнях, як на LeetCode. Світ рахує кожен погляд на вузол.
 */

const arr = (v: (number | null)[]) => JSON.stringify(v).replace(/,/g, ', ');
const one = (v: (number | null)[]): TestCase => ({ args: [tree(v)], label: arr(v) });
const two = (a: (number | null)[], b: (number | null)[]): TestCase => ({ args: [tree(a), tree(b)], label: `${arr(a)} · ${arr(b)}` });
const ROOT: [string, string] = ['root', 'TreeNode | null'];
/** Дерево у відповіді рушій уже перетворив на масив по рівнях; null — порожнє дерево. */
const treeCheck = (tc: TestCase, r: CallResult): true | string => {
  const got = r.value ?? [];
  return JSON.stringify(got) === JSON.stringify(tc.expected) || L(`очікували дерево ${arr(tc.expected as [])}, отримали ${arr(got as [])}`, `expected the tree ${arr(tc.expected as [])}, got ${arr(got as [])}`);
};

/* 1. Maximum Depth */
const depthOf = (n: T | null): number => (n ? 1 + Math.max(depthOf(n.left), depthOf(n.right)) : 0);
const depth: Level = {
  id: 'anc.depth', world: 9, title: 'Скільки поколінь', topic: 'дерево: рекурсія вглиб',
  leetcode: lc(104, 'Maximum Depth of Binary Tree'),
  brief: '<b>Скільки поколінь.</b> Анхіз розгортає родовід. Порахуй, скільки в ньому поколінь.',
  statement: [
    'В Елісії Анхіз показує Енеєві його нащадків. Родовід — це <b>двійкове дерево</b>: у кожного вузла <code>node.val</code> — ім\'я-число нащадка, а <code>node.left</code> і <code>node.right</code> — двоє його дітей (або <code>null</code>, якщо дитини немає).',
    'Тобі дають корінь — <code>root</code>, самого Енея. Поверни, скільки поколінь у найдовшій гілці: від кореня до найдальшого нащадка. Для дерева <code>[3, 9, 20, null, null, 15, 7]</code> це <code>3</code>. Порожнє дерево — <code>0</code>.',
    'Дерево зручно проходити рекурсією, як кола пекла: глибина вузла — це 1 плюс глибша з глибин його дітей.',
  ],
  tool: {
    name: 'двійкове дерево',
    text: [
      'Кожен вузол знає своє значення <code>val</code> і двох дітей: <code>left</code> і <code>right</code>. Вузол без дітей називають <b>листком</b>.',
      'Майже кожна задача на дереві — рекурсія: розв\'яжи її для лівої гілки, для правої, а тоді склади відповідь для самого вузла. Базовий випадок — <code>null</code>: порожня гілка.',
    ],
    code: '//      3\n//     / \\\n//    9   20\n//       /  \\\n//      15   7\n// масив по рівнях: [3, 9, 20, null, null, 15, 7]',
  },
  talk: [
    { who: 'anchises', text: 'Сину, ось твій рід. Від тебе — діти, від них — онуки… Гілки переплелися, і я вже не пам\'ятаю, скільки там поколінь.' },
    { who: 'fox', text: 'Спитай кожну гілку, яка вона глибока. Яка глибша — до неї додай себе.' },
  ],
  quip: { who: 'anchises', text: 'Стільки поколінь! І всі — від тебе. Ну, і трохи від мене.' },
  entry: 'maxDepth', observe: ['root'],
  starter: starter('maxDepth', [ROOT], 'number', ['Скільки поколінь', 'node.val — нащадок, node.left і node.right — його діти або null.', 'Поверни кількість поколінь у найдовшій гілці.'], '  // Слово ладу пиши тут\n  return 0;\n'),
  examples: [one([3, 9, 20, null, null, 15, 7])],
  hidden: [one([]), one([1]), one([1, null, 2]), one([1, 2, 3, 4, null, null, 5, 6]), one([5, 4, null, 3, null, 2, null, 1])],
  reference: (a: unknown) => depthOf(buildTree(a)),
  hints: ['Яка глибина в порожньої гілки?', 'Якщо root дорівнює null — 0. Інакше 1 + більша з глибин root.left і root.right.', 'if (!root) return 0; return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));'],
  solution: 'function maxDepth(root: TreeNode | null): number {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}',
  lesson: 'Відповідь для вузла складається з відповідей для його дітей. Базовий випадок — порожня гілка.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Invert Binary Tree */
const mirror = (n: T | null): T | null => (n ? { val: n.val, left: mirror(n.right), right: mirror(n.left) } : null);
const invert: Level = {
  id: 'anc.invert', world: 9, title: 'Родовід у дзеркалі', topic: 'дерево: обмін дітей',
  leetcode: lc(226, 'Invert Binary Tree'),
  brief: '<b>Родовід у дзеркалі.</b> Уламок віддзеркалив родовід. Віддзеркаль його назад.',
  statement: [
    'Уламок перевернув родовід, наче в дзеркалі: хто мав бути ліворуч, опинився праворуч. Треба віддзеркалити його ще раз, щоб усе стало на місце.',
    'Для кожного вузла поміняй місцями лівого й правого нащадка — і так для всього дерева. Поверни корінь. З <code>[4, 2, 7, 1, 3, 6, 9]</code> має вийти <code>[4, 7, 2, 9, 6, 3, 1]</code>.',
    'Нових вузлів не створюй, тільки переставляй дітей.',
  ],
  tool: {
    name: 'обмін через змінну',
    text: [
      'Щоб поміняти місцями дві речі, одну треба спершу запам\'ятати: <code>const t = node.left; node.left = node.right; node.right = t;</code>',
      'Поміняй дітей у вузлі, а тоді віддзеркаль кожну з гілок тією ж функцією.',
    ],
    code: '//    2         2\n//   / \\   →   / \\\n//  1   3      3   1',
  },
  talk: [
    { who: 'anchises', text: 'Дивлюся на родовід — і все навпаки. Мій молодший онук чомусь старший за брата.' },
    { who: 'fox', text: 'Це уламок пограв у дзеркало. Міняймо лівих з правими в кожному вузлі — і родовід стане як був.' },
  ],
  quip: { who: 'fox', text: 'Віддзеркалили двічі — і все як було. Дзеркала мене завжди трохи лякали.' },
  entry: 'invertTree', observe: ['root'],
  starter: starter('invertTree', [ROOT], 'TreeNode | null', ['Родовід у дзеркалі', 'Поміняй місцями left і right у кожному вузлі. Поверни корінь.'], '  // Слово ладу пиши тут\n  return root;\n'),
  examples: [one([4, 2, 7, 1, 3, 6, 9])],
  hidden: [one([2, 1, 3]), one([]), one([1]), one([1, 2]), one([5, 3, 8, 1, null, 7, 9, null, 2])],
  reference: (a: unknown) => treeArray(mirror(buildTree(a))),
  check: treeCheck,
  hints: ['Що треба зробити з самим вузлом, а що — з його гілками?', 'Якщо root дорівнює null — поверни null. Поміняй root.left і root.right, а тоді виклич invertTree для обох.', 'if (!root) return null; const t = root.left; root.left = root.right; root.right = t; invertTree(root.left); invertTree(root.right); return root;'],
  solution: 'function invertTree(root: TreeNode | null): TreeNode | null {\n  if (!root) return null;\n  const t = root.left;\n  root.left = root.right;\n  root.right = t;\n  invertTree(root.left);\n  invertTree(root.right);\n  return root;\n}',
  lesson: 'Дзеркало дерева = обмін дітей у кожному вузлі. Рекурсія обходить усі вузли рівно один раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Level Order Traversal */
function levelsRef(a: unknown) { const out: number[][] = []; let q = [buildTree(a)].filter(Boolean) as T[]; while (q.length) { out.push(q.map((n) => n.val)); q = q.flatMap((n) => [n.left, n.right].filter(Boolean) as T[]); } return out; }
const levelOrder: Level = {
  id: 'anc.levels', world: 9, title: 'Покоління за поколінням', topic: 'дерево: обхід ушир (черга)',
  leetcode: lc(102, 'Binary Tree Level Order Traversal'),
  brief: '<b>Покоління за поколінням.</b> Перелічи нащадків по поколіннях: спершу діти, потім онуки, потім правнуки.',
  statement: [
    'Анхіз хоче записати родовід у книгу: кожне покоління — окремим рядком, зліва направо.',
    'Поверни масив поколінь: у кожному — значення вузлів цього рівня по порядку. Для <code>[3, 9, 20, null, null, 15, 7]</code> вийде <code>[[3], [9, 20], [15, 7]]</code>.',
    'Тут рекурсія вглиб незручна: вона біжить до самого низу однієї гілки. Краще йти <b>ушир</b>: тримай усіх нащадків поточного покоління, а з них збирай наступне.',
  ],
  tool: {
    name: 'обхід ушир',
    text: [
      'Тримай масив <code>level</code> — вузли поточного покоління. Запиши їхні значення, а тоді збери їхніх дітей у новий масив <code>next</code> — це наступне покоління.',
      'Коли поточне покоління порожнє, дерево пройдено.',
    ],
    code: 'let level = [root];\nwhile (level.length) {\n  // level — одне покоління\n  const next = [];\n  for (const node of level) {\n    if (node.left) next.push(node.left);\n    if (node.right) next.push(node.right);\n  }\n  level = next;\n}',
  },
  talk: [
    { who: 'anchises', text: 'Запишімо рід у книгу. Не гілку за гілкою, а покоління за поколінням: так його читатимуть нащадки.' },
    { who: 'fox', text: 'Беремо всіх дітей разом, потім усіх онуків разом. Як черга до Харона, тільки весела.' },
  ],
  quip: { who: 'anchises', text: 'Тепер родовід читається, як літопис. Рядок за рядком.' },
  entry: 'levelOrder', observe: ['root'],
  starter: starter('levelOrder', [ROOT], 'number[][]', ['Покоління за поколінням', 'Поверни значення вузлів по рівнях: [[корінь], [діти], [онуки], …].'], '  const out = [];\n  if (!root) return out;\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [one([3, 9, 20, null, null, 15, 7])],
  hidden: [one([1]), one([]), one([1, 2, 3, 4, 5, 6, 7]), one([1, 2, null, 3, null, 4]), one([8, 4, 12, 2, 6, null, 14, null, 3])],
  reference: levelsRef,
  hints: ['Як із поточного покоління отримати наступне?', 'level = [root]. Поки level не порожній: out.push(значення level); зібрати дітей усіх вузлів у next; level = next.', 'let level = [root]; while (level.length) { out.push(level.map((n) => n.val)); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; }'],
  solution: 'function levelOrder(root: TreeNode | null): number[][] {\n  const out: number[][] = [];\n  if (!root) return out;\n  let level: TreeNode[] = [root];\n  while (level.length) {\n    out.push(level.map((n) => n.val));\n    const next: TreeNode[] = [];\n    for (const n of level) {\n      if (n.left) next.push(n.left);\n      if (n.right) next.push(n.right);\n    }\n    level = next;\n  }\n  return out;\n}',
  lesson: 'Обхід ушир іде рівнями: з поточного рівня збираєш наступний. Так дерево читається покоління за поколінням.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Same Tree */
const sameRef = (a: T | null, b: T | null): boolean => (!a || !b ? a === b : a.val === b.val && sameRef(a.left, b.left) && sameRef(a.right, b.right));
const same: Level = {
  id: 'anc.same', world: 9, title: 'Дві однакові гілки', topic: 'дерево: дві рекурсії разом',
  leetcode: lc(100, 'Same Tree'),
  brief: '<b>Дві однакові гілки.</b> Анхіз знайшов два записи родоводу. Чи це той самий рід?',
  statement: [
    'В Елісії лежать два сувої з родоводом. Анхіз підозрює, що уламок підробив один із них.',
    'Поверни <code>true</code>, якщо дерева <code>p</code> і <code>q</code> однакові: та сама форма й ті самі значення в тих самих місцях. Інакше — <code>false</code>. <code>[1, 2, 3]</code> і <code>[1, 2, 3]</code> — однакові, а <code>[1, 2]</code> і <code>[1, null, 2]</code> — ні: двійка з різного боку.',
    'Іди обома деревами водночас: порівняй корені, а тоді лівих дітей між собою і правих між собою.',
  ],
  tool: {
    name: 'рекурсія на двох деревах',
    text: [
      'Функція отримує по вузлу з кожного дерева. Якщо обидва <code>null</code> — однакові. Якщо лише один — ні. Інакше значення мають збігатися, і гілки теж.',
    ],
    code: '//  1     1\n// /       \\\n// 2       2     різні: двійка з різних боків',
  },
  talk: [
    { who: 'anchises', text: 'Два сувої, а рід один. Чи ні? Уламок уміє підробляти почерк.' },
    { who: 'fox', text: 'Порівнюймо вузол із вузлом, гілку з гілкою. Хоч одна розбіжність — і підробку викрито.' },
    { who: 'wolf', text: '(з-за брами Елісію) Я тут, я не підслуховую! Мене не пустили, то я хоч послухаю.' },
  ],
  quip: { who: 'anchises', text: 'Справжній сувій лишаємо, підробку — в Лету.' },
  entry: 'isSameTree', observe: ['p', 'q'],
  starter: starter('isSameTree', [['p', 'TreeNode | null'], ['q', 'TreeNode | null']], 'boolean', ['Дві однакові гілки', 'true, якщо дерева p і q однакові за формою і значеннями.'], '  // Слово ладу пиши тут\n  return false;\n'),
  examples: [two([1, 2, 3], [1, 2, 3]), two([1, 2], [1, null, 2])],
  hidden: [two([], []), two([1], []), two([1, 2, 1], [1, 1, 2]), two([5, 3, 8, 1, 4], [5, 3, 8, 1, 4]), two([5, 3, 8, 1, 4], [5, 3, 8, 1, 6])],
  reference: (a: unknown, b: unknown) => sameRef(buildTree(a), buildTree(b)),
  hints: ['Коли два порожні вузли однакові, а коли — ні?', 'Обидва null — true. Один null — false. Інакше p.val === q.val і однакові ліві й праві гілки.', 'if (!p || !q) return p === q; return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);'],
  solution: 'function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n  if (!p || !q) return p === q;\n  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}',
  lesson: 'Два дерева порівнюють паралельною рекурсією: корені, потім ліві гілки, потім праві.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Lowest Common Ancestor */
function lcaRef(a: unknown, p: number, q: number) {
  const go = (n: T | null): T | null => { if (!n || n.val === p || n.val === q) return n; const l = go(n.left), r = go(n.right); return l && r ? n : l ?? r; };
  return go(buildTree(a))?.val ?? null;
}
/** Можна повернути і сам вузол (рушій покаже його гілку масивом), і його значення. */
const lcaCheck = (tc: TestCase, r: CallResult): true | string => {
  const got = Array.isArray(r.value) ? r.value[0] : r.value;
  return got === tc.expected || L(`очікували предка ${tc.expected}, отримали ${JSON.stringify(got)}`, `expected the ancestor ${tc.expected}, got ${JSON.stringify(got)}`);
};
const three = (v: (number | null)[], p: number, q: number): TestCase => ({ args: [tree(v), p, q], label: `${arr(v)}, ${p}, ${q}` });
const FAMILY = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];
const lca: Level = {
  id: 'anc.lca', world: 9, final: true, title: 'Спільний предок', topic: 'дерево: відповідь знизу вгору',
  leetcode: lc(236, 'Lowest Common Ancestor of a Binary Tree'),
  brief: '<b>Спільний предок.</b> Двоє нащадків сперечаються, хто кому рідня. Знайди їхнього найближчого спільного предка.',
  statement: [
    'Двоє нащадків, <code>p</code> і <code>q</code>, зустрілися в Елісії й не можуть з\'ясувати, ким доводяться одне одному. Відповідь — їхній <b>найближчий спільний предок</b>: найнижчий вузол, у гілці якого є обидва.',
    'Значення в дереві різні, і <code>p</code> та <code>q</code> у ньому точно є. Поверни вузол-предка (або його значення). Вузол може бути предком сам собі: для <code>p = 5</code> і <code>q = 4</code> у дереві <code>[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]</code> відповідь — <code>5</code>.',
    'Спитай кожну гілку: «чи є в тобі <code>p</code> або <code>q</code>?» Якщо знайшлося і ліворуч, і праворуч — предок саме тут. Якщо лише з одного боку — відповідь там.',
  ],
  tool: {
    name: 'відповідь піднімається знизу',
    text: [
      'Функція повертає знайдений вузол або <code>null</code>. Натрапила на <code>p</code> чи <code>q</code> — одразу повертає його: глибше шукати не треба.',
      'У вузлі дивимось, що принесли діти. Обидві гілки щось принесли — цей вузол і є спільний предок. Принесла одна — передаємо її знахідку вгору.',
    ],
    code: '//        3\n//      /   \\\n//     5     1      p = 6, q = 4\n//    / \\          6 ліворуч від 5, 4 — праворуч\n//   6   2         → предок 5\n//      / \\\n//     7   4',
  },
  talk: [
    { who: 'anchises', text: 'Ось двоє моїх нащадків. Сперечаються, хто з них старший рід. А відповідь — у спільному предкові.' },
    { who: 'fox', text: 'Хай кожна гілка скаже, кого в ній знайшла. Де зійдуться обидві відповіді — там і предок.' },
    { who: 'wolf', text: '(за брамою) Спільний предок… А в мене спільний предок з лисом є? Ні? От і добре.' },
  ],
  quip: { who: 'anchises', text: 'Рід знову цілий. Іди, сину. Твої нащадки збудують Рим — а я подивлюся звідси.' },
  entry: 'lowestCommonAncestor', observe: ['root', null, null],
  starter: starter('lowestCommonAncestor', [ROOT, ['p', 'number'], ['q', 'number']], 'TreeNode | null', ['Спільний предок', 'p і q — значення двох вузлів дерева.', 'Поверни їхнього найближчого спільного предка (вузол або значення).'], '  // Слово ладу пиши тут\n  return null;\n'),
  examples: [three(FAMILY, 5, 1), three(FAMILY, 5, 4)],
  hidden: [three([1, 2], 1, 2), three(FAMILY, 6, 4), three(FAMILY, 7, 8), three(FAMILY, 0, 8), three([1, 2, 3, null, 4, 5, 6, 7], 7, 6)],
  reference: lcaRef,
  check: lcaCheck,
  hints: ['Що має повернути функція, якщо вузол — це сам p або q?', 'Якщо root дорівнює null, p або q — поверни root. Інакше шукай ліворуч і праворуч: обидві знахідки є — поверни root, інакше ту, що є.', 'if (!root || root.val === p || root.val === q) return root; const l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q); return l && r ? root : l ?? r;'],
  solution: 'function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): TreeNode | null {\n  if (!root || root.val === p || root.val === q) return root;\n  const l = lowestCommonAncestor(root.left, p, q);\n  const r = lowestCommonAncestor(root.right, p, q);\n  return l && r ? root : l ?? r;\n}',
  lesson: 'Гілки приносять знахідки вгору; де зустрілися дві — там спільний предок. Один обхід, O(n).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const elysium: World = {
  n: 9, name: 'Родовід Анхіза', song: 'Пісня IV · Пекло', topic: 'Дерева', fox: '#e7b843',
  host: { who: 'Анхіз', line: 'Ось твій рід, сину. Гілки переплутались — допоможи мені їх розплести.' },
  motif: 'tree', trick: 'Дерево життя: двійкові дерева',
  levels: [depth, invert, levelOrder, same, lca],
};
