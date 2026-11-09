/** Книга хитрощів: що відкривається за уламок кожного світу. */
export interface Trick {
  world: number;
  title: string;
  motif: string;
  when: string[];
  idea: string;
  template: string;
  complexity: string;
  problems: string[];
}

export const BOOK: Trick[] = [
  {
    world: 1,
    title: 'Хвилі: впорядкування на місці',
    motif: 'waves',
    when: ['Треба переставити елементи масиву без нового масиву.', 'Значень мало (0/1/2, «є/немає») — групи важливіші за порівняння.'],
    idea: 'Тримай межі груп індексами: куди писати наступний елемент кожної групи. Один прохід, обміни замість зсувів.',
    template: `let low = 0, mid = 0, high = n - 1;
while (mid <= high) {
  if (a[mid] === 0) swap(a, low++, mid++);
  else if (a[mid] === 1) mid++;
  else swap(a, mid, high--);
}`,
    complexity: 'Час O(n), пам\'ять O(1).',
    problems: ['75. Sort Colors', '283. Move Zeroes', '905. Sort Array By Parity'],
  },
  {
    world: 2,
    title: 'Два вказівники',
    motif: 'rhombs',
    when: ['Масив або рядок відсортований чи симетричний.', 'Шукаєш пару (суму, площу, збіг) серед усіх пар.', 'Треба прибрати або переставити елементи на місці.'],
    idea: 'Замість перебору всіх пар O(n²) тримай два індекси. Назустріч — з двох кінців (паліндром, Two Sum II, Задача Дидони). Повільний і швидкий — в один бік (дублікати). Кожен крок відкидає варіанти, які вже не можуть бути кращими.',
    template: `let l = 0, r = a.length - 1;
while (l < r) {
  // порівняй a[l] і a[r], онови відповідь
  if (/* лівий гірший */) l++;
  else r--;
}`,
    complexity: 'Час O(n), пам\'ять O(1).',
    problems: ['11. Container With Most Water', '125. Valid Palindrome', '167. Two Sum II', '26. Remove Duplicates', '15. 3Sum'],
  },
  {
    world: 3,
    title: 'Скриня з комірками: хеш-мапа',
    motif: 'chest',
    when: ['Постійно питаєш «чи вже бачив?» або «скільки разів?».', 'Шукаєш пару, але масив не відсортований.', 'Треба згрупувати елементи за спільною ознакою.'],
    idea: 'Не шукай заново — запам\'ятовуй. Set відповідає «чи бачив», Map тримає «ключ → значення» (лічильник, номер, групу). Кожна перевірка миттєва, тож один прохід замінює цикл у циклі.',
    template: `const seen = new Map();
for (const x of a) {
  if (seen.has(target - x)) { /* знайшли пару */ }
  seen.set(x, (seen.get(x) ?? 0) + 1);
}`,
    complexity: 'Час O(n), пам\'ять O(n).',
    problems: ['1. Two Sum', '217. Contains Duplicate', '242. Valid Anagram', '49. Group Anagrams', '347. Top K Frequent Elements'],
  },
  {
    world: 4,
    title: 'Вежа: стек',
    motif: 'tower',
    when: ['Важливе те, що прийшло останнім: дужки, скасування дій, вкладені структури.', 'Для кожного елемента треба знайти наступний більший (чи менший).', 'Вираз рахується крок за кроком, і кожна дія бере останні значення.'],
    idea: 'Тримай масив і працюй лише з його кінцем: push кладе нагору, pop знімає верхнього. Монотонний стек тримає тих, хто ще чекає відповіді; кожен новий відповідає всім слабшим на верхівці, тож кожен елемент кладеться й знімається лише раз.',
    template: `const stack = [];
for (let i = 0; i < a.length; i++) {
  while (stack.length && a[i] > a[stack[stack.length - 1]]) {
    const j = stack.pop(); // a[i] — відповідь для j
  }
  stack.push(i);
}`,
    complexity: 'Час O(n), пам\'ять O(n).',
    problems: ['20. Valid Parentheses', '155. Min Stack', '150. Evaluate Reverse Polish Notation', '739. Daily Temperatures', '496. Next Greater Element I'],
  },
  {
    world: 5,
    title: 'Ромб навпіл: бінарний пошук',
    motif: 'halved',
    when: ['Дані відсортовані або відповідь у якийсь момент змінюється з «ні» на «так».', 'Треба знайти місце, з якого щось починається: перша зіпсована, перший не менший.', 'Відповідь можна перевірити, і все, що більше за неї, теж підходить.'],
    idea: 'Тримай межі lo і hi, де відповідь ще може бути. Дивись у середину й відкидай половину, де її точно немає. Кожен погляд ділить діапазон навпіл: 10 000 елементів — 14 поглядів. Інколи навпіл ділять не масив, а можливі відповіді.',
    template: `let lo = 0, hi = n;          // відповідь у [lo, hi)
while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (ok(mid)) hi = mid;       // mid підходить — шукай лівіше
  else lo = mid + 1;           // ні — правіше
}
return lo;`,
    complexity: 'Час O(log n) (або O(n log max) при пошуку відповіді), пам\'ять O(1).',
    problems: ['704. Binary Search', '35. Search Insert Position', '278. First Bad Version', '33. Search in Rotated Sorted Array', '875. Koko Eating Bananas'],
  },
  {
    world: 6,
    title: 'Рамка: ковзне вікно й купа',
    motif: 'frame',
    when: ['Шукаєш найкращий відрізок підряд: суму, довжину, без повторів.', 'Сусідні вікна відрізняються лише краями.', 'На кожному кроці потрібен найбільший чи найменший, або k найкращих.'],
    idea: 'Не рахуй кожне вікно заново: посувай його — додай те, що зайшло справа, прибери те, що вийшло зліва. Вікно буває сталим, а буває гумовим. Коли щоразу потрібен найбільший чи найменший, тримай кандидатів у купі: покласти й забрати — log n.',
    template: `let left = 0;
for (let right = 0; right < a.length; right++) {
  // додай a[right] у вікно
  while (/* вікно порушує правило */) {
    // прибери a[left] з вікна
    left++;
  }
  // онови відповідь: right - left + 1
}`,
    complexity: 'Вікно: час O(n), пам\'ять O(1) або O(k). Купа: O(log n) на операцію.',
    problems: ['643. Maximum Average Subarray I', '121. Best Time to Buy and Sell Stock', '3. Longest Substring Without Repeating Characters', '1046. Last Stone Weight', '703. Kth Largest Element in a Stream'],
  },
  {
    world: 7,
    title: 'Ланцюжок: зв\'язний список',
    motif: 'chain',
    when: ['Дані — це вузли, і кожен знає лише наступного.', 'Треба розвернути, злити чи розрізати список без копіювання.', 'Потрібна середина чи цикл — за один прохід і без додаткової пам\'яті.'],
    idea: 'Ходи від голови через next, доки не прийде null. Перш ніж перечепити зачіпку, запам\'ятай, куди вона вела (prev, node, next). Фіктивна голова прибирає особливий випадок на початку. Повільний і швидкий вказівники знаходять середину й цикл: на колі вони неодмінно зустрінуться.',
    template: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) { /* коло */ }
}`,
    complexity: 'Час O(n), пам\'ять O(1).',
    problems: ['206. Reverse Linked List', '876. Middle of the Linked List', '21. Merge Two Sorted Lists', '141. Linked List Cycle', '19. Remove Nth Node From End of List'],
  },
  {
    world: 8,
    title: 'Спіраль: рекурсія й backtracking',
    motif: 'spiral',
    when: ['Задача розкладається на таку саму, тільки меншу.', 'Треба всі варіанти: набори, порядки, комбінації.', 'Відповідь будується крок за кроком, і хибний крок треба скасувати.'],
    idea: 'Рекурсивна функція — це базовий випадок і крок, що веде до нього. Що до виклику — по дорозі вниз, що після — на зворотному шляху. Backtracking обходить дерево рішень: зробив вибір, пішов глибше, повернувся й скасував. У відповідь клади копію шляху. Індекс start не дає порахувати той самий набір двічі.',
    template: `const out = [], path = [];
const go = (start) => {
  if (/* шлях повний */) { out.push([...path]); return; }
  for (let i = start; i < a.length; i++) {
    path.push(a[i]);
    go(i + 1);       // або go(i), якщо можна повторювати
    path.pop();
  }
};
go(0);`,
    complexity: 'Підмножини O(2ⁿ · n), перестановки O(n! · n): стільки відповідей і є.',
    problems: ['78. Subsets', '46. Permutations', '39. Combination Sum', '881. Boats to Save People', '17. Letter Combinations of a Phone Number'],
  },
  {
    world: 9,
    title: 'Дерево життя: двійкові дерева',
    motif: 'tree',
    when: ['Дані — вузли з двома дітьми: родовід, ієрархія, турнірна сітка.', 'Відповідь для вузла складається з відповідей для гілок: глибина, сума, «чи є тут?».', 'Треба пройти дерево рівень за рівнем.'],
    idea: 'Рекурсія вглиб: розв\'яжи для лівої гілки, для правої, а у вузлі склади; базовий випадок — null. Обхід ушир: тримай поточний рівень і збирай з нього наступний. Відповідь може підніматися знизу: гілка повертає, що знайшла, а де зійшлися дві знахідки — там предок.',
    template: `function solve(node) {
  if (!node) return /* відповідь для порожньої гілки */;
  const l = solve(node.left);
  const r = solve(node.right);
  return /* відповідь для вузла з l і r */;
}`,
    complexity: 'Час O(n): кожен вузол один раз. Пам\'ять O(h) на рекурсію (h — висота) або O(ширини) на рівень.',
    problems: ['104. Maximum Depth of Binary Tree', '226. Invert Binary Tree', '102. Binary Tree Level Order Traversal', '100. Same Tree', '236. Lowest Common Ancestor of a Binary Tree'],
  },
  {
    world: 10,
    title: 'Барвінок: дерево пошуку',
    motif: 'periwinkle',
    when: ['Дані — дерево, де все ліворуч менше, а все праворуч більше.', 'Треба знайти, вставити чи перевірити значення, не обходячи всього.', 'Потрібні значення по порядку: k-те найменше, наступне, діапазон.'],
    idea: 'Кожне порівняння каже, в яку гілку йти, тож пошук і вставка займають стільки кроків, скільки в дереві поверхів. Новий вузол завжди стає листком. Перевірка порядку потребує меж, що звужуються згори, а не лише порівняння батька з дитиною. Обхід inorder (ліво, вузол, право) видає значення за зростанням.',
    template: `let node = root;
while (node && node.val !== target) {
  node = target < node.val ? node.left : node.right;
}
// inorder: visit(left); робота з node; visit(right)`,
    complexity: 'Пошук і вставка O(h): O(log n) у збалансованому дереві. Inorder O(n).',
    problems: ['700. Search in a Binary Search Tree', '701. Insert into a Binary Search Tree', '98. Validate Binary Search Tree', '230. Kth Smallest Element in a BST', '235. Lowest Common Ancestor of a BST'],
  },
  {
    world: 11,
    title: 'Розетка: обхід графа',
    motif: 'rose',
    when: ['Речі з\'єднані між собою: клітинки сітки, села й дороги, ремесла та їхні вимоги.', 'Треба все, до чого можна дійти від точки, або кількість окремих груп.', 'Треба відстань у кроках або порядок без кіл.'],
    idea: 'Обхід вглиб (стос або рекурсія) заходить у все досяжне; познач відвідане, щоб не ходити колами. Обхід ушир іде хвилями, і номер хвилі — це відстань. Обхід від кожної клітинки часто можна замінити одним — від цілей назад. Топологічне сортування: бери те, що нічого не чекає, і відмикай наступне; що лишилось — коло.',
    template: `const seen = new Set([start]);
let wave = [start], steps = 0;
while (wave.length) {
  const next = [];
  for (const v of wave)
    for (const u of neighbours(v))
      if (!seen.has(u)) { seen.add(u); next.push(u); }
  wave = next; steps++;
}`,
    complexity: 'Час O(V + E): кожна клітинка чи вершина і кожен зв\'язок один раз. Пам\'ять O(V).',
    problems: ['733. Flood Fill', '200. Number of Islands', '994. Rotting Oranges', '207. Course Schedule', '417. Pacific Atlantic Water Flow'],
  },
];
