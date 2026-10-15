import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

const arr = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });

function meetRef(walls: number[]): number[] { const out: number[] = []; let i = 0, j = walls.length - 1; while (i < j) out.push(walls[i++] + walls[j--]); if (i === j) out.push(walls[i]); return out; }

const meet: Level = {
  id: 'carthage.meet', world: 2, title: 'Зустрітися посередині', topic: 'два вказівники назустріч',
  brief: '<b>Зустрітися посередині.</b> Еней іде з лівого кінця муру, Микита — з правого. Склади мірки пар, доки не зустрінуться.',
  statement: [
    'Дидона міряє мур. Еней стає на лівий край, Микита на правий, і кожен крок вони складають мірки двох каменів, на яких стоять.',
    'Поверни масив сум: <code>[walls[0] + walls[n−1], walls[1] + walls[n−2], …]</code>. Якщо камінь посередині один — додай його як є.',
    'Тут з\'являється пара, що йде <b>з двох кінців назустріч</b>, — головна хитрість Карфагена.',
  ],
  tool: {
    name: 'два вказівники в одному циклі',
    text: [
      'Два номери можна рухати в <b>одному</b> циклі: <code>left</code> іде вправо, <code>right</code> — вліво. Цикл триває, поки <code>left &lt; right</code>, тобто поки вони не зустрілися.',
      'Якщо елементів непарна кількість, після циклу посередині лишається один, без пари: <code>left === right</code>.',
    ],
    code: 'let left = 0, right = a.length - 1;\nwhile (left < right) {\n  console.log(a[left], a[right]);\n  left++;\n  right--;\n}\nif (left === right) console.log("посередині:", a[left]);',
  },
  talk: [
    { who: 'dido', text: 'Вітаю в Карфагені, троянці. Мені потрібні мірки муру — від двох кінців одночасно, бо часу обмаль.' },
    { who: 'enei', text: 'Я стану зліва, Микита — справа. Микито? Микито!' },
    { who: 'fox', text: 'Та тут я, тут. Просто придворні Дидони такі… уважні. Іду на свій кінець.' },
  ],
  quip: { who: 'dido', text: 'Мірки зійшлися. Ви ходите парою краще, ніж мої вартові.' },
  entry: 'meetSums', observe: ['walls'],
  starter: {
    ts: starter('meetSums', [['walls', 'number[]']], 'number[]', DOC_MEET(), '  const sums: number[] = [];\n  let left = 0, right = walls.length - 1;\n  // Слово ладу пиши тут\n\n  return sums;\n').ts,
    js: starter('meetSums', [['walls', 'number[]']], 'number[]', DOC_MEET(), '  const sums = [];\n  let left = 0, right = walls.length - 1;\n  // Слово ладу пиши тут\n\n  return sums;\n').js,
  },
  examples: [arr([3, 1, 4, 1, 5, 9])],
  hidden: [arr([7]), arr([1, 2]), arr([2, 7, 1, 8, 2]), arr([5, 5, 5, 5])],
  reference: meetRef,
  hints: ['Де стоять Еней і Микита після кожного кроку?', 'left іде вправо, right — вліво, доки left < right. Наприкінці перевір, чи не лишився камінь посередині.', 'while (left < right) sums.push(walls[left++] + walls[right--]); if (left === right) sums.push(walls[left]);'],
  solution: 'function meetSums(walls: number[]): number[] {\n  const sums: number[] = [];\n  let left = 0, right = walls.length - 1;\n  while (left < right) sums.push(walls[left++] + walls[right--]);\n  if (left === right) sums.push(walls[left]);\n  return sums;\n}',
  lesson: 'Два вказівники з різних кінців проходять масив разом лише раз.',
  scene: { type: 'array', skin: 'stone', mode: 'pointers' },
};
function DOC_MEET() { return ['Зустрітися посередині', 'Поверни [walls[0]+walls[n−1], walls[1]+walls[n−2], …];', 'камінь посередині (якщо є) — як є.']; }

function palRef(s: string): boolean { const t = s.toLowerCase().replace(/[^a-z0-9]/g, ''); return t === [...t].reverse().join(''); }
const str = (s: string): TestCase => ({ args: [s], label: JSON.stringify(s) });

/** Слово мовою інтерфейсу: в англійській грі печатки англійські. */
const word2 = (uk: string, en: string): TestCase => ({ get args() { return [uiLang() === 'en' ? en : uk]; }, get label() { return JSON.stringify(uiLang() === 'en' ? en : uk); } });
function mirrorRef(word: string): boolean { return word === [...word].reverse().join(''); }

const mirror: Level = {
  id: 'carthage.mirror', world: 2, title: 'Ім\'я на печатці', topic: 'порівняння з двох кінців',
  brief: '<b>Ім\'я на печатці.</b> Чи читається ім\'я на печатці однаково зліва направо й справа наліво?',
  statement: [
    'Біля воріт Карфагена гості показують печатки. Справжня печатка — та, де ім\'я однаково читається з обох боків, як <code>"анна"</code> чи <code>"потоп"</code>.',
    'Поверни <code>true</code>, якщо слово <code>word</code> однакове з обох боків, і <code>false</code>, якщо ні. Тут лише малі літери, без пробілів і знаків.',
    'Порівнюй символи з двох кінців назустріч. Метод <code>reverse()</code> не знадобиться.',
  ],
  tool: {
    name: 'ранній return',
    text: [
      '<code>return</code> можна написати будь-де: функція одразу закінчується. Щойно знайшлася хоч одна розбіжність — відповідь уже відома, і далі перевіряти не треба.',
      'А якщо цикл пройшов до кінця й нічого не знайшов — після циклу повертаєш протилежне.',
    ],
    code: 'for (let i = 0; i < guests.length; i++) {\n  if (guests[i] === "Вовк") return false;  // далі можна не дивитися\n}\nreturn true;  // Вовка серед гостей немає',
  },
  talk: [
    { who: 'dido', text: 'Кожен знатний гість має печатку з іменем. Справжня — та, що читається однаково з обох боків.' },
    { who: 'fox', text: 'Порівнюй першу літеру з останньою, другу з передостанньою. Знайшов розбіжність — фальшивка, далі можна не дивитися.' },
  ],
  quip: { who: 'fox', text: 'Хе, моє ім\'я на печатці не вийде: «Микита» навпаки — «атиким». Звучить як заклинання.' },
  entry: 'isMirror', observe: ['word'],
  starter: starter('isMirror', [['word', 'string']], 'boolean', ['Ім\'я на печатці', 'true, якщо word читається однаково з обох боків.'], '  let left = 0, right = word.length - 1;\n  // Слово ладу пиши тут\n\n  return true;\n'),
  examples: [word2('потоп', 'level'), word2('печатка', 'stamp')],
  hidden: [word2('а', 'a'), word2('аа', 'aa'), word2('ab', 'ab'), word2('радар', 'radar'), word2('абба', 'abba'), word2('абвга', 'abcda')],
  reference: mirrorRef,
  hints: ['Яку літеру треба порівняти з першою?', 'Порівнюй word[left] і word[right], доки вони не зустрілися. Розбіжність — одразу false.', 'while (left < right) { if (word[left] !== word[right]) return false; left++; right--; } return true;'],
  solution: 'function isMirror(word: string): boolean {\n  let left = 0, right = word.length - 1;\n  while (left < right) {\n    if (word[left] !== word[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}',
  lesson: 'Дзеркало перевіряють з двох кінців: одна розбіжність — і відповідь уже відома.',
  scene: { type: 'array', skin: 'letter', mode: 'pointers' },
};

const palindrome: Level = {
  id: 'carthage.palindrome', world: 2, title: 'Напис над воротами', topic: 'два вказівники на рядку',
  leetcode: lc(125, 'Valid Palindrome'),
  brief: '<b>Напис над воротами.</b> Чи читається напис однаково з обох боків, якщо не зважати на регістр, пробіли й розділові знаки?',
  statement: [
    'Над воротами Карфагена вибито напис. Кажуть, справжній — той, що однаково читається зліва направо й справа наліво.',
    'Поверни <code>true</code>, якщо рядок <code>s</code> — паліндром, враховуючи лише літери й цифри та не зважаючи на регістр.',
    'Допоміжне: <code>/[a-z0-9]/i.test(ch)</code> — чи це літера латиниці або цифра; <code>ch.toLowerCase()</code>.',
  ],
  tool: {
    name: 'пропуск зайвого і нижній регістр',
    text: [
      'Усередині великого циклу можна поставити маленькі цикли, що <b>пропускають</b> зайве: поки на лівому місці не літера — <code>left++</code>.',
      '<code>ch.toLowerCase()</code> робить літеру малою, тож «А» і «а» стануть однаковими. <code>/[a-z0-9]/i.test(ch)</code> перевіряє, чи це латинська літера або цифра.',
    ],
    code: 'let i = 0;\nwhile (i < s.length && s[i] === " ") i++;   // пропустили пробіли\nconsole.log(s[i].toLowerCase());',
  },
  talk: [
    { who: 'dido', text: 'А тепер напис над моїми воротами. Тут і великі літери, і коми, і пробіли.' },
    { who: 'fox', text: 'Те саме дзеркало, тільки зайве пропускай, а великі літери роби малими. Кома нам не свідок.' },
  ],
  quip: { who: 'dido', text: 'Справжній напис. Значить, і ворота справжні. Проходьте.' },
  entry: 'isPalindrome', observe: ['s'],
  starter: starter('isPalindrome', [['s', 'string']], 'boolean', ['Напис над воротами', 'true, якщо s — паліндром (лише літери й цифри, без регістру).']),
  examples: [str('A man, a plan, a canal: Panama'), str('race a car')],
  hidden: [str(' '), str('a.'), str('0P'), str('No lemon, no melon'), str('ab_a')],
  reference: palRef,
  hints: ['А що, як порівнювати символи з двох кінців?', 'left і right назустріч; пропускай символи, що не літери й не цифри; порівнюй у нижньому регістрі.', 'while (l < r) { пропусти зайве; якщо s[l] ≠ s[r] → false; l++; r--; } return true;'],
  solution: 'function isPalindrome(s: string): boolean {\n  const ok = (c: string) => /[a-z0-9]/i.test(c);\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    while (l < r && !ok(s[l])) l++;\n    while (l < r && !ok(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}',
  lesson: 'Два вказівники працюють і на рядках: порівнюєш кінці й сходишся до середини.',
  scene: { type: 'array', skin: 'letter', mode: 'pointers' },
};

function twoSumRef(numbers: number[], target: number): number[] { let l = 0, r = numbers.length - 1; while (l < r) { const s = numbers[l] + numbers[r]; if (s === target) return [l + 1, r + 1]; if (s < target) l++; else r--; } return []; }
const ts2 = (a: number[], t: number): TestCase => ({ args: [a, t], label: `${JSON.stringify(a)}, ${t}` });

const twoSum: Level = {
  id: 'carthage.twosum', world: 2, title: 'Два купці', topic: 'два вказівники на відсортованому',
  leetcode: lc(167, 'Two Sum II - Input Array Is Sorted'),
  brief: '<b>Два купці.</b> Купці стоять у ряд за ціною. Знайди двох, чий товар разом коштує рівно <code>target</code>.',
  statement: [
    'На карфагенському ринку купці стоять за зростанням ціни: <code>numbers</code> відсортовано.',
    'Знайди двох різних купців, чиї ціни разом дають <code>target</code>, і поверни їхні номери <b>з одиниці</b>: <code>[i + 1, j + 1]</code>, де <code>i &lt; j</code>. Відповідь завжди одна.',
    'Обмеження: <code>n ≤ 10⁴</code>. Вовк питає кожну пару купців — ринок закриється раніше.',
  ],
  tool: {
    name: 'відсортований ряд підказує напрям',
    text: [
      'На відсортованому ряді сума лівого й правого підказує, куди йти. Замала — лівий зсувається вправо до дорожчих. Завелика — правий зсувається вліво до дешевших.',
      'Кожен крок відкидає цілого купця, якому вже точно немає пари. Тому всі пари перебирати не треба.',
    ],
    code: '// ціни: [2, 5, 9, 14], треба 14\n// 2 + 14 = 16 → завелика → правий вліво\n// 2 + 9  = 11 → замала  → лівий вправо\n// 5 + 9  = 14 → знайшли!',
  },
  talk: [
    { who: 'dido', text: 'На ринку купець продає товар, якщо хтось інший докладе решту до ціни. Ряд стоїть за ціною, від дешевих до дорогих.' },
    { who: 'wolf', text: 'А я спитаю кожну пару! Кожного з кожним! Ринок довгий, а я нікуди не поспішаю.' },
    { who: 'fox', text: 'Ринок закриють раніше, ніж ти дійдеш до середини. Ряд відсортований — він сам підкаже, кого відпустити.' },
  ],
  quip: { who: 'wolf', text: 'Як? Уже? Я ще й першого купця не допитав…' },
  entry: 'twoSum', observe: ['numbers', null],
  starter: starter('twoSum', [['numbers', 'number[]'], ['target', 'number']], 'number[]', ['Два купці', 'numbers відсортовано за зростанням. Поверни [i + 1, j + 1],', 'де numbers[i] + numbers[j] === target.'], '  // Слово ладу пиши тут\n\n  return [];\n'),
  examples: [ts2([2, 7, 11, 15], 9), ts2([2, 3, 4], 6)],
  hidden: [ts2([-1, 0], -1), ts2([1, 2, 3, 4, 4, 9, 56, 90], 8), ts2([5, 25, 75], 100), ts2([1, 3, 5, 7, 9, 11], 20)],
  big: {
    n: 10000,
    // Усі ціни парні, крім однієї: пара з непарною сумою єдина, і стоїть далеко від початку ряду.
    make: (n) => {
      const r = rng(167);
      const a = Array.from({ length: n }, (_, i) => 2 * (i * 3 + Math.floor(r() * 3)));
      const p = Math.floor(n * 0.9), q = Math.floor(n * 0.95);
      a[q] += 1;
      return [a, a[p] + a[q]];
    },
    readBudget: (n) => 10 * n,
  },
  reference: twoSumRef,
  // Пар з потрібною сумою може бути кілька — приймаємо будь-яку правильну.
  check: (tc, r) => {
    const [a, t] = tc.args as [number[], number];
    const v = r.value as number[];
    if (!Array.isArray(v) || v.length !== 2) return L(`очікували пару номерів, отримали ${JSON.stringify(v)}`, `expected a pair of numbers, got ${JSON.stringify(v)}`);
    const [i, j] = v;
    if (!(Number.isInteger(i) && Number.isInteger(j) && 1 <= i && i < j && j <= a.length)) return L(`номери мають бути з одиниці й i < j, отримали ${JSON.stringify(v)}`, `numbers must start from one with i < j, got ${JSON.stringify(v)}`);
    return a[i - 1] + a[j - 1] === t || `${a[i - 1]} + ${a[j - 1]} ≠ ${t}`;
  },
  wolf: { reads: (n) => Math.round(0.99 * n * n), code: 'function twoSum(numbers, target) {\n  for (let i = 0; i < numbers.length; i++)\n    for (let j = i + 1; j < numbers.length; j++)\n      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];\n  return [];\n}' },
  hints: ['Ряд відсортований. Що станеться із сумою, якщо зсунути лівого купця вправо?', 'Почни з найдешевшого й найдорожчого. Сума замала — лівий іде вправо; завелика — правий вліво.', 'l = 0, r = n − 1; поки l < r: s = a[l] + a[r]; s === t → [l+1, r+1]; s < t → l++; інакше r--.'],
  solution: 'function twoSum(numbers: number[], target: number): number[] {\n  let l = 0, r = numbers.length - 1;\n  while (l < r) {\n    const s = numbers[l] + numbers[r];\n    if (s === target) return [l + 1, r + 1];\n    if (s < target) l++; else r--;\n  }\n  return [];\n}',
  lesson: 'На відсортованому ряді кожне порівняння відкидає цілого купця: два вказівники замість усіх пар.',
  scene: { type: 'array', skin: 'stone', mode: 'pointers' },
};

function removeDupRef(nums: number[]): number { if (!nums.length) return 0; let k = 1; for (let i = 1; i < nums.length; i++) if (nums[i] !== nums[k - 1]) nums[k++] = nums[i]; return k; }

const removeDup: Level = {
  id: 'carthage.dups', world: 2, title: 'Мірки без повторів', topic: 'повільний і швидкий вказівники',
  leetcode: lc(26, 'Remove Duplicates from Sorted Array'),
  brief: '<b>Мірки без повторів.</b> На відсортованій стрічці мірок прибери повтори на місці й поверни, скільки лишилось.',
  statement: [
    'Уламок заплутав мірки: на стрічці <code>nums</code> (відсортованій) деякі повторюються.',
    'Залиш кожну мірку один раз <b>на місці</b>: перші <code>k</code> елементів мають бути унікальними мірками в тому ж порядку. Поверни <code>k</code>. Що лишиться після <code>k</code> — неважливо.',
  ],
  tool: {
    name: 'повільний і швидкий вказівники',
    text: [
      'Це вже знайомий з моря індекс «куди писати». <code>k</code> — довжина чистої частини, <code>i</code> біжить уперед і шукає нову мірку.',
      'Масив відсортований, тож повтори стоять поруч: досить порівняти з останньою записаною міркою <code>nums[k - 1]</code>.',
    ],
    code: '// [1, 1, 2, 2, 3]\n//  k=1: чиста частина — [1]\n//  i бачить 2 ≠ 1 → пишемо на місце k, k = 2\n//  i бачить 3 ≠ 2 → k = 3',
  },
  talk: [
    { who: 'enei', text: 'Мірки на стрічці повторюються: одна й та сама по три рази.' },
    { who: 'fox', text: 'Пам\'ятаєш море? Один вказівник читає, інший пише. Тут те саме, тільки пишемо нову мірку, а повтори пропускаємо.' },
  ],
  quip: { who: 'dido', text: 'Тепер мірки чисті. Ще трохи — і мур зійдеться.' },
  entry: 'removeDuplicates', observe: ['nums'],
  starter: starter('removeDuplicates', [['nums', 'number[]']], 'number', ['Мірки без повторів', 'nums відсортовано. Перші k елементів — унікальні мірки; поверни k.'], '  let k = 0;\n  // Слово ладу пиши тут\n\n  return k;\n'),
  examples: [arr([1, 1, 2]), arr([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])],
  hidden: [arr([1]), arr([1, 2, 3]), arr([5, 5, 5, 5]), arr([-3, -3, -1, 0, 0, 0, 2])],
  big: { n: 10000, make: (n) => { const r = rng(26); let v = 0; return [Array.from({ length: n }, () => (v += r() < 0.4 ? 1 : 0))]; }, readBudget: (n) => 10 * n },
  reference: removeDupRef,
  check: (tc, r) => {
    const want = tc.expected as number;
    const nums = r.argsAfter?.[0] as number[] | undefined;
    if (r.value !== want) return L(`очікували k = ${want}, отримали ${JSON.stringify(r.value)}`, `expected k = ${want}, got ${JSON.stringify(r.value)}`);
    const uniq = [...new Set(tc.args[0] as number[])];
    const head = (nums ?? []).slice(0, want);
    return JSON.stringify(head) === JSON.stringify(uniq) || L(`перші ${want}: очікували ${JSON.stringify(uniq)}, отримали ${JSON.stringify(head)}`, `first ${want}: expected ${JSON.stringify(uniq)}, got ${JSON.stringify(head)}`);
  },
  wolf: { reads: (n) => Math.round((n * n) / 4), code: 'function removeDuplicates(nums) {\n  let n = nums.length;\n  for (let i = 1; i < n; i++) {\n    if (nums[i] === nums[i - 1]) {\n      for (let k = i; k + 1 < n; k++) nums[k] = nums[k + 1];\n      n--; i--;\n    }\n  }\n  return n;\n}' },
  hints: ['Повтори стоять поруч. Куди класти наступну нову мірку?', 'k — довжина вже чистої частини. Швидкий вказівник i шукає мірку, відмінну від nums[k−1].', 'k = 1; for (i = 1..n−1) if (nums[i] !== nums[k−1]) nums[k++] = nums[i]; return k.'],
  solution: 'function removeDuplicates(nums: number[]): number {\n  if (nums.length === 0) return 0;\n  let k = 1;\n  for (let i = 1; i < nums.length; i++) if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];\n  return k;\n}',
  lesson: 'Повільний вказівник тримає чисту частину, швидкий шукає нове — і жодних зсувів хвоста.',
  scene: { type: 'array', skin: 'stone', mode: 'pointers' },
};

function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) { const hl = height[l], hr = height[r]; best = Math.max(best, (r - l) * Math.min(hl, hr)); if (hl < hr) l++; else r--; }
  return best;
}

const dido: Level = {
  id: 'carthage.dido', world: 2, final: true, title: 'Задача Дидони', topic: 'два вказівники',
  leetcode: lc(11, 'Container With Most Water'),
  brief: '<b>Задача Дидони.</b> Стовпи стоять у ряд, висота кожного в масиві <code>height</code>. Обгороди двома стовпами ділянку, що вміщає найбільше води.',
  statement: [
    'Дидона може взяти стільки землі, скільки обгородить волячою шкурою. Уламок Писанки заплутав мірки, і стіни не сходяться. Стовпи вже стоять — обери два.',
    'Дано масив <code>height</code> довжини <code>n</code>. Стовп <code>i</code> має висоту <code>height[i]</code>. Два стовпи разом із землею утворюють ділянку: вода в ній стоїть до нижчого стовпа.',
    'Поверни найбільшу кількість води: <code>(j − i) · min(height[i], height[j])</code>.',
    'Обмеження: <code>2 ≤ n ≤ 10⁵</code>, <code>0 ≤ height[i] ≤ 10⁴</code>. Світ рахує, скільки разів код дивиться на стовпи: Вовк перебирає всі пари, а шкура тим часом висихає.',
  ],
  tool: {
    name: 'відкинути гіршого',
    text: [
      'Почни з найширшої ділянки: крайні стовпи. Вода стоїть до <b>нижчого</b> з них.',
      'Якщо зсунути вищий, ділянка звузиться, а вода вище не підніметься: її тримає той самий нижчий. Тож нижчий стовп уже дав найкраще, що міг, — його й відкидаємо.',
    ],
    code: '// [4, 8, 6, 3]  l = 0 (4), r = 3 (3)\n// площа = 3 × min(4, 3) = 9\n// нижчий — праворуч (3): зсуваємо r',
  },
  talk: [
    { who: 'dido', text: 'Скільки землі обгородиш шкурою, стільки й моя. Стовпи вже стоять — обери два, між якими вміститься найбільше води.' },
    { who: 'wolf', text: 'Кожна пара! Кожна! Я перерахую всі, а шкура тим часом… ой, висихає.' },
    { who: 'fox', text: 'Почнемо з крайніх. А далі щоразу відкидаємо гіршого — той, що нижчий. Чому саме його — подумай, поки я усміхаюся придворним.' },
  ],
  entry: 'maxArea', observe: ['height'],
  starter: starter('maxArea', [['height', 'number[]']], 'number', ['Задача Дидони', 'height[i] — висота i-го стовпа.', 'Поверни, скільки найбільше води вміщає ділянка між двома стовпами.'], '  let best = 0;\n  // Слово ладу пиши тут\n\n  return best;\n'),
  examples: [arr([1, 8, 6, 2, 5, 4, 8, 3, 7]), arr([1, 1])],
  hidden: [arr([4, 3, 2, 1, 4]), arr([1, 2, 1]), arr([0, 0]), arr([2, 3, 4, 5, 18, 17, 6]), arr([1, 8, 100, 2, 100, 4, 8, 3, 7]), arr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), arr([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]), arr([5, 5, 5, 5, 5, 5])],
  big: { n: 10000, make: (n) => { const r = rng(2026); return [Array.from({ length: n }, () => Math.floor(r() * 10001))]; }, readBudget: (n) => 10 * n },
  reference: maxArea,
  wolf: { reads: (n) => n * (n - 1), code: 'function maxArea(height) {\n  let best = 0;\n  for (let i = 0; i < height.length; i++)\n    for (let j = i + 1; j < height.length; j++)\n      best = Math.max(best, (j - i) * Math.min(height[i], height[j]));\n  return best;\n}' },
  hints: [
    'А що, як іти з обох кінців одночасно?',
    'Почни з найширшої ділянки: крайні стовпи. Вода стоїть до нижчого з них. Чи є сенс тримати нижчий стовп, якщо ділянка далі тільки звужується?',
    'l = 0, r = n − 1. Поки l < r: порахуй площу, онови найкраще, зсунь той вказівник, де стовп нижчий.',
  ],
  solution: 'function maxArea(height: number[]): number {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return best;\n}',
  lesson: 'Нижчий стовп уже дав найкраще, що міг: зсуваємо його, і за n кроків перевірено все потрібне.',
  scene: { type: 'array', skin: 'post', mode: 'area' },
};

export const carthage: World = {
  n: 2, name: 'Карфаген Дидони', song: 'Пісня II · Гостини', topic: 'Two Pointers', fox: '#9b3a87',
  host: { who: 'Дидона', line: 'Скільки землі обгородиш шкурою, стільки й моя. Стовпи вже стоять, обери два.' },
  motif: 'rhombs', trick: 'Два вказівники',
  levels: [meet, mirror, palindrome, twoSum, removeDup, dido],
};
