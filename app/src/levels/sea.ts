import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

const arr = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });
const SHIPS: [string, string] = ['ships', 'number[]'];
const NUMS: [string, string] = ['nums', 'number[]'];

const largest: Level = {
  id: 'sea.max', world: 1, title: 'Найбільший корабель', topic: 'максимум у масиві',
  brief: '<b>Найбільший корабель.</b> Знайди корабель з найбільшою кількістю весел.',
  statement: [
    'Шторм Еола розкидав флот. Микита з щогли бачить колону: <code>ships[i]</code> — скільки весел у корабля <code>i</code>.',
    'Поверни найбільше число в масиві. Без <code>Math.max(...ships)</code> — пройди колону сам і пам\'ятай найкращий корабель.',
  ],
  entry: 'largest', observe: ['ships'],
  starter: starter('largest', [SHIPS], 'number', ['Найбільший корабель', 'ships[i] — кількість весел корабля i (масив не порожній).', 'Поверни найбільшу.'], '  let best = ships[0];\n  // Слово ладу пиши тут\n\n  return best;\n'),
  examples: [arr([12, 30, 8, 22, 30, 5])],
  hidden: [arr([7]), arr([-3, -1, -7]), arr([1, 2, 3, 4, 5]), arr([9, 8, 7, 1])],
  reference: (ships: number[]) => ships.reduce((a, b) => Math.max(a, b)),
  hints: ['Що треба пам\'ятати, поки йдеш колоною?', 'best = перший корабель; для кожного наступного: якщо більший — він новий best.', 'for (let i = 1; i < ships.length; i++) if (ships[i] > best) best = ships[i];'],
  solution: 'function largest(ships: number[]): number {\n  let best = ships[0];\n  for (let i = 1; i < ships.length; i++) if (ships[i] > best) best = ships[i];\n  return best;\n}',
  lesson: 'Один прохід і одна змінна «найкраще поки що» — так шукають максимум.',
  scene: { type: 'array', skin: 'ship', mode: 'scan' },
};

const reverse: Level = {
  id: 'sea.reverse', world: 1, title: 'Колона навпаки', topic: 'розворот на місці',
  leetcode: lc(344, 'Reverse String'),
  brief: '<b>Колона навпаки.</b> Розверни колону кораблів на місці, без нового масиву.',
  statement: [
    'Еол розвернув вітер, і колона має йти у зворотному порядку.',
    'Зміни масив <code>ships</code> <b>на місці</b>: перший корабель стає останнім, другий — передостаннім… Нічого не повертай.',
    'Метод <code>reverse()</code> у цій вправі заборонено. Обмінюй кораблі парами.',
  ],
  entry: 'reverse', observe: ['ships'], inPlace: 0, forbid: ['reverse', 'toReversed'],
  starter: starter('reverse', [SHIPS], 'void', ['Колона навпаки', 'Розверни ships на місці. reverse() заборонено.']),
  examples: [arr([1, 2, 3, 4, 5])],
  hidden: [arr([7]), arr([1, 2]), arr([4, 3, 2, 1, 0, 9])],
  reference: (ships: number[]) => { ships.splice(0, ships.length, ...ships.slice().reverse()); },
  hints: ['Хто з ким має помінятися місцями?', 'Перший з останнім, другий з передостаннім… доки не зустрінуться посередині.', 'let i = 0, j = n − 1; while (i < j) { обміняй ships[i] і ships[j]; i++; j--; }'],
  solution: 'function reverse(ships: number[]): void {\n  let i = 0, j = ships.length - 1;\n  while (i < j) {\n    const t = ships[i]; ships[i] = ships[j]; ships[j] = t;\n    i++; j--;\n  }\n}',
  lesson: 'Два кінці назустріч і обмін — масив розвернуто без жодної копії.',
  scene: { type: 'array', skin: 'ship', mode: 'pointers' },
};

function moveZeroesRef(nums: number[]) { let k = 0; for (const x of nums) if (x !== 0) nums[k++] = x; while (k < nums.length) nums[k++] = 0; }

const moveZeroes: Level = {
  id: 'sea.zeroes', world: 1, title: 'Розбиті в кінець', topic: 'два індекси',
  leetcode: lc(283, 'Move Zeroes'),
  brief: '<b>Розбиті в кінець.</b> Відсунь розбиті кораблі (<code>0</code>) у кінець колони, зберігши порядок цілих.',
  statement: [
    'Після шторму частина кораблів розбита — у масиві це <code>0</code>.',
    'Перенеси всі нулі в кінець <b>на місці</b>, а цілі кораблі залиш у тому ж порядку.',
    'Обмеження: <code>n ≤ 10⁴</code>. Якщо після кожного нуля зсувати весь хвіст колони, шторм скінчиться раніше.',
  ],
  entry: 'moveZeroes', observe: ['nums'], inPlace: 0,
  starter: starter('moveZeroes', [NUMS], 'void', ['Розбиті в кінець', '0 — розбитий корабель. Перенеси нулі в кінець на місці,', 'зберігши порядок інших.']),
  examples: [arr([0, 1, 0, 3, 12])],
  hidden: [arr([0]), arr([1, 2, 3]), arr([0, 0, 1]), arr([4, 0, 5, 0, 0, 6, 7])],
  big: { n: 10000, make: (n) => { const r = rng(283); return [Array.from({ length: n }, () => (r() < 0.5 ? 0 : 1 + Math.floor(r() * 9)))]; }, readBudget: (n) => 10 * n },
  reference: moveZeroesRef,
  wolf: { reads: (n) => Math.round((n * n) / 4), code: 'function moveZeroes(nums) {\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) continue;\n    let j = i;\n    while (j + 1 < nums.length && nums[j + 1] === 0) j++;\n    if (j + 1 >= nums.length) break;\n    for (let k = i; k + 1 < nums.length; k++) nums[k] = nums[k + 1];\n    nums[nums.length - 1] = 0;\n    i--;\n  }\n}' },
  hints: ['А якщо записувати цілі кораблі одразу на їхнє місце?', 'Тримай індекс k — куди ставити наступний цілий корабель. Наприкінці заповни хвіст нулями.', 'k = 0; для кожного x ≠ 0: nums[k++] = x; поки k < n: nums[k++] = 0.'],
  solution: 'function moveZeroes(nums: number[]): void {\n  let k = 0;\n  for (let i = 0; i < nums.length; i++) if (nums[i] !== 0) nums[k++] = nums[i];\n  while (k < nums.length) nums[k++] = 0;\n}',
  lesson: 'Повільний індекс «куди писати» і швидкий «що читати» — масив упорядковано за один прохід.',
  scene: { type: 'array', skin: 'ship', mode: 'pointers' },
};

const sortFleet: Level = {
  id: 'sea.sort', world: 1, title: 'Шикування за розміром', topic: 'проста сортировка',
  brief: '<b>Шикування за розміром.</b> Впорядкуй кораблі від найменшого до найбільшого, обмінюючи сусідів.',
  statement: [
    'Еней шикує флот: менші кораблі попереду, більші позаду.',
    'Відсортуй <code>ships</code> за зростанням <b>на місці</b>. Метод <code>sort()</code> Еол забрав — напиши сортування сам.',
    'Найпростіше — бульбашкою: проходь колону й міняй сусідів, якщо лівий більший; повторюй, доки є обміни.',
  ],
  entry: 'sortFleet', observe: ['ships'], inPlace: 0, forbid: ['sort', 'toSorted'],
  starter: starter('sortFleet', [SHIPS], 'void', ['Шикування за розміром', 'Відсортуй ships за зростанням на місці. sort() заборонено.']),
  examples: [arr([5, 2, 9, 1, 6])],
  hidden: [arr([1]), arr([2, 1]), arr([3, 3, 1, 2]), arr([9, 8, 7, 6, 5, 4, 3, 2, 1])],
  reference: (ships: number[]) => { const s = ships.slice().sort((a, b) => a - b); ships.splice(0, ships.length, ...s); },
  hints: ['Якщо два сусіди стоять не так — що з ними зробити?', 'Прохід колоною з обміном неправильних сусідів виштовхує найбільший корабель у кінець. Повтори n разів.', 'for (i < n) for (j < n−1−i) if (ships[j] > ships[j+1]) обміняй.'],
  solution: 'function sortFleet(ships: number[]): void {\n  for (let i = 0; i < ships.length; i++)\n    for (let j = 0; j + 1 < ships.length - i; j++)\n      if (ships[j] > ships[j + 1]) { const t = ships[j]; ships[j] = ships[j + 1]; ships[j + 1] = t; }\n}',
  lesson: 'Бульбашка проста, але порівнює кожен корабель з кожним — O(n²). Для фінальної задачі знадобиться хитрість.',
  scene: { type: 'array', skin: 'ship', mode: 'pointers' },
};

function sortColorsRef(nums: number[]) { const c = [0, 0, 0]; for (const x of nums) c[x]++; let k = 0; for (let v = 0; v < 3; v++) for (let i = 0; i < c[v]; i++) nums[k++] = v; }

const sortColors: Level = {
  id: 'sea.colors', world: 1, final: true, title: 'Три вітрила', topic: 'три вказівники за один прохід',
  leetcode: lc(75, 'Sort Colors'),
  brief: '<b>Три вітрила.</b> Розстав кораблі за кольором вітрил: червоні (<code>0</code>), білі (<code>1</code>), сині (<code>2</code>).',
  statement: [
    'Щоб Еол затих, флот має йти ладом: спершу червоні вітрила, потім білі, потім сині.',
    'Масив <code>nums</code> містить лише <code>0</code>, <code>1</code> і <code>2</code>. Впорядкуй його <b>на місці</b>. <code>sort()</code> заборонено.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк на хмарі Еола сортує бульбашкою — порівнює кожен корабель з кожним. Спробуй за один прохід.',
  ],
  entry: 'sortColors', observe: ['nums'], inPlace: 0, forbid: ['sort', 'toSorted'],
  starter: starter('sortColors', [NUMS], 'void', ['Три вітрила', '0 — червоне, 1 — біле, 2 — синє. Впорядкуй nums на місці.', 'sort() заборонено.']),
  examples: [arr([2, 0, 2, 1, 1, 0])],
  hidden: [arr([2, 0, 1]), arr([0]), arr([1, 1, 1]), arr([2, 2, 0, 0]), arr([1, 2, 0, 2, 1, 0, 0, 2])],
  big: { n: 10000, make: (n) => { const r = rng(75); return [Array.from({ length: n }, () => Math.floor(r() * 3))]; }, readBudget: (n) => 10 * n },
  reference: sortColorsRef,
  wolf: { reads: (n) => n * (n - 1), code: 'function sortColors(nums) {\n  for (let i = 0; i < nums.length; i++)\n    for (let j = 0; j + 1 < nums.length - i; j++)\n      if (nums[j] > nums[j + 1]) { const t = nums[j]; nums[j] = nums[j + 1]; nums[j + 1] = t; }\n}' },
  hints: ['Кольорів лише три. Чи треба порівнювати кораблі між собою?', 'Три межі: low — куди ставити червоний, high — куди синій, mid — хто зараз на огляді.', 'low = mid = 0, high = n−1; поки mid ≤ high: 0 → обмін з low, low++, mid++; 1 → mid++; 2 → обмін з high, high--.'],
  solution: 'function sortColors(nums: number[]): void {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    const x = nums[mid];\n    if (x === 0) { nums[mid] = nums[low]; nums[low] = 0; low++; mid++; }\n    else if (x === 1) mid++;\n    else { nums[mid] = nums[high]; nums[high] = 2; high--; }\n  }\n}',
  lesson: 'Коли значень мало, межі між групами важливіші за порівняння: три вказівники — один прохід.',
  scene: { type: 'array', skin: 'sail', mode: 'pointers' },
};

export const sea: World = {
  n: 1, name: 'Море Еола', song: 'Пісня I · Шторм', topic: 'Масиви, сортування', fox: '#3f7fd0',
  host: { who: 'Еол', line: 'Ха! Мої вітри розкидали ваш флот. Спробуй-но його вишикувати!' },
  motif: 'waves', trick: 'Хвилі: впорядкування на місці',
  levels: [largest, reverse, moveZeroes, sortFleet, sortColors],
};
