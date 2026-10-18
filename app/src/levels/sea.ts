import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

const arr = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });
const SHIPS: [string, string] = ['ships', 'number[]'];
const NUMS: [string, string] = ['nums', 'number[]'];

const largest: Level = {
  id: 'sea.max', world: 1, title: 'Найбільший корабель', topic: 'максимум у масиві',
  brief: '<b>Найбільший корабель.</b> Знайди корабель, у якого найбільше весел.',
  statement: [
    'Шторм Еола розкидав флот. Микита з щогли бачить колону кораблів: <code>ships[i]</code> — скільки весел у корабля номер <code>i</code>.',
    'Поверни найбільше число в масиві. Для <code>[12, 30, 8, 22]</code> це <code>30</code>.',
    'Готову команду <code>Math.max(...ships)</code> не бери: пройди колону сам. Змінна <code>best</code> пам\'ятає найбільший корабель, який ти вже бачив; трапився більший — запам\'ятай його.',
  ],
  tool: {
    name: 'змінна «найкраще поки що»',
    text: [
      'Щоб знайти найбільше, не треба пам\'ятати всі кораблі: досить одного — найкращого з тих, що вже бачив.',
      'Починаєш з першого. Кожен наступний порівнюєш з найкращим через <code>&gt;</code>; якщо новий більший — тепер найкращий він.',
    ],
    code: 'let tallest = heights[0];\nfor (let i = 1; i < heights.length; i++) {\n  if (heights[i] > tallest) tallest = heights[i];\n}',
  },
  talk: [
    { who: 'eol', text: 'Ха! Мої вітри розкидали ваш флот. Спробуй-но знайти серед цих тріски бодай один пристойний корабель!' },
    { who: 'fox', text: 'Я на щоглі. Бачу всіх, але пам\'ятати буду лише найкращого. Більше лисові й не треба.' },
  ],
  quip: { who: 'sailor', text: 'Оце корабель! На ньому й попливемо попереду. Я навіть весла перелічив — щоб ти не сумнівався.' },
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

function swapEndsRef(ships: number[]) { const t = ships[0]; ships[0] = ships[ships.length - 1]; ships[ships.length - 1] = t; }

const swapEnds: Level = {
  id: 'sea.swap', world: 1, title: 'Обмін на флангах', topic: 'обмін двох елементів',
  brief: '<b>Обмін на флангах.</b> Поміняй місцями перший і останній корабель колони.',
  statement: [
    'Вітер переставив кораблі: флагман пливе останнім, а найменший човен — першим.',
    'Поміняй місцями <code>ships[0]</code> і останній корабель. Роби це <b>на місці</b>: змінюй сам масив <code>ships</code>, а не створюй новий, і нічого не повертай. Для <code>[2, 7, 5, 9]</code> стане <code>[9, 7, 5, 2]</code>.',
    'Колони різної довжини, тож номер останнього корабля обчисли: <code>ships.length - 1</code>. А щоб не загубити значення під час обміну, спершу збережи одне з них у тимчасову змінну.',
  ],
  tool: {
    name: 'обмін через тимчасову змінну',
    text: [
      'Щоб поміняти місцями два значення, одне з них треба спершу <b>відкласти вбік</b>. Інакше, записавши друге на місце першого, перше ти втратиш.',
      'Як з двома чашками: щоб поміняти в них чай і каву, потрібна третя, порожня чашка.',
    ],
    code: 'const cup = a[0];   // відклали перше\na[0] = a[1];        // на його місце — друге\na[1] = cup;         // а друге місце займає відкладене',
  },
  talk: [
    { who: 'eol', text: 'Флагман опинився в хвості, а найменший човен — на чолі! Ось вам і порядок.' },
    { who: 'fox', text: 'Поміняй їх місцями. Тільки обережно: якщо просто переписати одного на місце іншого, перший корабель пропаде в хвилях.' },
  ],
  quip: { who: 'sailor', text: 'Флагман знову попереду! А я вже думав, що доведеться веслувати задом наперед.' },
  entry: 'swapEnds', observe: ['ships'], inPlace: 0,
  starter: starter('swapEnds', [SHIPS], 'void', ['Обмін на флангах', 'Поміняй місцями перший і останній корабель ships (на місці).']),
  examples: [arr([2, 7, 5, 9])],
  hidden: [arr([1, 2]), arr([4]), arr([8, 1, 1, 1, 3]), arr([0, 5, 5, 0, 6])],
  reference: swapEndsRef,
  hints: ['Що станеться з першим кораблем, якщо одразу записати на його місце останній?', 'Відклади перший корабель у змінну, потім переставляй.', 'const t = ships[0]; ships[0] = ships[ships.length - 1]; ships[ships.length - 1] = t;'],
  solution: 'function swapEnds(ships: number[]): void {\n  const last = ships.length - 1;\n  const t = ships[0];\n  ships[0] = ships[last];\n  ships[last] = t;\n}',
  lesson: 'Щоб обміняти два значення, одне спершу відклади: тимчасова змінна — як третя чашка.',
  scene: { type: 'array', skin: 'ship', mode: 'pointers' },
};

const reverse: Level = {
  id: 'sea.reverse', world: 1, title: 'Колона навпаки', topic: 'розворот на місці',
  leetcode: lc(344, 'Reverse String'),
  brief: '<b>Колона навпаки.</b> Розверни колону кораблів на місці, без нового масиву.',
  statement: [
    'Еол розвернув вітер, і колона має йти у зворотному порядку.',
    'Зміни масив <code>ships</code> <b>на місці</b>: перший корабель стає останнім, другий — передостаннім і так далі. Для <code>[1, 2, 3, 4, 5]</code> стане <code>[5, 4, 3, 2, 1]</code>. Нічого не повертай.',
    'Готову команду <code>reverse()</code> тут заборонено. Міняй кораблі парами: перший з останнім, другий з передостаннім… аж до середини.',
  ],
  tool: {
    name: 'два вказівники назустріч',
    text: [
      'Тримай два номери: <code>i</code> з початку і <code>j</code> з кінця. Обміняй <code>ships[i]</code> і <code>ships[j]</code>, потім зсунь <code>i</code> вперед, а <code>j</code> назад.',
      'Зупинитися треба посередині, коли <code>i</code> і <code>j</code> зустрінуться. Інакше пари поміняються ще раз і повернуться на свої місця.',
    ],
    code: 'let i = 0, j = a.length - 1;\nwhile (i < j) {\n  // тут — обмін a[i] і a[j]\n  i++;\n  j--;\n}',
  },
  talk: [
    { who: 'eol', text: 'Я розвернув вітер! Тепер ваша колона пливе задом наперед.' },
    { who: 'fox', text: 'То розвернімо й колону. Першого міняємо з останнім, другого — з передостаннім… Обмін ти вже вмієш, лишилось іти з двох кінців.' },
  ],
  quip: { who: 'fox', text: 'Бачиш? Обмін плюс два кінці назустріч — і колона розвернулася без жодного зайвого корабля.' },
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
  brief: '<b>Розбиті в кінець.</b> Відсунь розбиті кораблі (<code>0</code>) у кінець колони, а цілі залиш у тому самому порядку.',
  statement: [
    'Після шторму частина кораблів розбита. У масиві <code>nums</code> розбитий корабель — це <code>0</code>.',
    'Перенеси всі нулі в кінець <b>на місці</b>, а цілі кораблі залиш у тому ж порядку, що й були. Для <code>[0, 1, 0, 3, 12]</code> стане <code>[1, 3, 12, 0, 0]</code>.',
    'Кораблів буває до 10 000. Якщо після кожного нуля зсувати весь хвіст колони, вийде дуже повільно. Хитріше тримати місце, куди стане наступний цілий корабель.',
  ],
  tool: {
    name: 'індекс «куди писати»',
    text: [
      'Дві змінні з різними ролями: <code>i</code> читає масив по черзі, а <code>k</code> показує, <b>куди записати</b> наступне потрібне значення.',
      '<code>k</code> росте тільки тоді, коли знайдено те, що треба зберегти. Тож усе потрібне збирається на початку масиву, а решту місця потім можна заповнити.',
    ],
    code: 'let k = 0;\nfor (let i = 0; i < words.length; i++) {\n  if (words[i] !== "") words[k++] = words[i];\n}\n// перші k місць — непорожні слова',
  },
  talk: [
    { who: 'sailor', text: 'Половину кораблів розбило! Вони ж тільки заважають колоні.' },
    { who: 'fox', text: 'Не викидаймо їх, а відсуньмо в кінець. Цілі хай пливуть попереду в тому ж порядку. Один йде читати, інший — записувати.' },
  ],
  quip: { who: 'sailor', text: 'Цілі — попереду, розбиті — в хвості. Як на параді, тільки мокро.' },
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
  brief: '<b>Шикування за розміром.</b> Впорядкуй кораблі від найменшого до найбільшого, міняючи сусідів місцями.',
  statement: [
    'Еней шикує флот: менші кораблі попереду, більші позаду.',
    'Відсортуй <code>ships</code> за зростанням <b>на місці</b>. Для <code>[5, 2, 9, 1, 6]</code> стане <code>[1, 2, 5, 6, 9]</code>. Готовий <code>sort()</code> Еол забрав, тож сортування доведеться написати самому.',
    'Найпростіший спосіб — <b>бульбашка</b>: іди колоною й міняй двох сусідів, якщо лівий більший за правого. Після одного проходу найбільший опиниться в кінці. Повторюй проходи, поки є що міняти.',
  ],
  tool: {
    name: 'вкладений цикл',
    text: [
      'Цикл усередині циклу: на кожен крок зовнішнього внутрішній проходить повністю.',
      'У бульбашці внутрішній цикл міняє неправильних сусідів і виштовхує найбільший корабель у кінець. Зовнішній повторює це, доки всі не стануть на місця.',
    ],
    code: 'for (let round = 0; round < 3; round++) {\n  for (let j = 0; j < 2; j++) {\n    console.log(round, j);  // 6 рядків: 3 × 2\n  }\n}',
  },
  talk: [
    { who: 'eol', text: 'Великі, малі — всі впереміш! Мої вітри знають толк у безладі.' },
    { who: 'fox', text: 'Міняй сусідів, якщо лівий більший. Один прохід — і найбільший корабель уже в хвості. А тепер повтори.' },
    { who: 'wolf', text: 'Хе-хе. Порівнювати кожного з кожним — це по-моєму. Смачно й довго.' },
  ],
  quip: { who: 'wolf', text: 'Бачили? Кожен з кожним! Так і я рахую. Ну, та подивимося, як ти впораєшся без мене у фіналі.' },
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
    'Щоб Еол затих, флот має йти ладом: спершу всі червоні вітрила, потім білі, потім сині.',
    'Масив <code>nums</code> містить лише <code>0</code> (червоне), <code>1</code> (біле) і <code>2</code> (синє). Впорядкуй його <b>на місці</b>: <code>[2, 0, 2, 1, 1, 0]</code> має стати <code>[0, 0, 1, 1, 2, 2]</code>. <code>sort()</code> заборонено.',
    'Кораблів буває до 10 000. Вовк на хмарі Еола сортує бульбашкою, порівнюючи кожен корабель з кожним. Але кольорів лише три. Спробуй розкласти все за один прохід.',
  ],
  tool: {
    name: 'три межі',
    text: [
      'Коли значень лише три, кораблі можна не порівнювати між собою. Досить тримати межі груп.',
      '<code>low</code> — де закінчуються червоні, <code>high</code> — де починаються сині, <code>mid</code> — хто зараз на огляді. Кожен корабель на огляді відправляється у свою групу.',
    ],
    code: '// [ червоні | білі | ще не бачені | сині ]\n//          low     mid        high\n// 0 → обмін з low;   1 → залишити;   2 → обмін з high',
  },
  talk: [
    { who: 'eol', text: 'Останнє випробування! Червоні, білі й сині вітрила — всі вперемішку. І Вовк уже на моїй хмарі порівнює кожного з кожним.' },
    { who: 'wolf', text: 'Кожен з кожним, кожен з кожним… поки шторм не скінчиться. Або поки я не зголоднію.' },
    { who: 'fox', text: 'А ми не порівнюватимемо. Кольорів лише три — тримай три межі, і за один прохід усе стане на місця.' },
  ],
  quip: { who: 'eol', text: 'Ну… гаразд. Флот ладний, вітри мої вгамувались. Пливіть до Карфагену, хитруни.' },
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
  levels: [largest, swapEnds, reverse, moveZeroes, sortFleet, sortColors],
};
