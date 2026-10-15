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
];
