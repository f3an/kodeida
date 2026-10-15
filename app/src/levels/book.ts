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
];
