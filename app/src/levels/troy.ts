import { rng, type Level, type World } from '../engine/level.ts';
import type { StreetCell, TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

// Підпис — геттер: перекладається на момент показу, а не завантаження модуля.
const street = (cells: StreetCell[], uk: string, en: string): TestCase => ({ args: [{ $actor: 'enei', setup: { cells } }], get label() { return L(uk, en); } });
const sacks = (n: number) => street(['empty', ...Array<StreetCell>(n).fill('sack')], `${n} мішків`, `${n} sacks`);
const ENEI = ['enei', 'Enei'] as [string, string];
/** Вулиця з n мішків і саме n як другий аргумент; геттер підпису зберігається. */
const withN = (n: number): TestCase => { const t = sacks(n); return { args: [...t.args, n], get label() { return t.label; } }; };

const firstStep: Level = {
  id: 'troy.step', world: 0, title: 'Перший крок', topic: 'команда',
  brief: '<b>Перший крок.</b> Микита стоїть поруч. Скажи слово — і Еней зробить крок.',
  statement: [
    'Еней стоїть на попелищі, а за крок від нього — Микита, що щойно впав з неба.',
    'Код уже написано: <code>enei.move()</code> — один крок уперед. Натисни «Запустити» (або ⌘↵).',
    'Так виглядає слово ладу: світ робить рівно те, що написано, і нічого більше.',
  ],
  entry: 'firstStep', observe: [null],
  starter: starter('firstStep', [ENEI], 'void', ['Перший крок', 'enei.move() — крок уперед.'], '  enei.move();\n'),
  examples: [street(['empty', 'empty'], 'Микита за 1 крок', 'Mykyta 1 step away')],
  hidden: [],
  check: (_tc, r) => (r.street!.pos === 1 ? true : L(`Еней на клітинці ${r.street!.pos}, а Микита на 1`, `Aeneas is on cell ${r.street!.pos}, Mykyta is on 1`)),
  hints: ['Код уже готовий — просто запусти його.', 'Кнопка «Запустити» праворуч угорі або ⌘↵.', 'enei.move();'],
  solution: 'function firstStep(enei: Enei): void {\n  enei.move();\n}',
  lesson: 'Слово ладу — це послідовність команд. Світ виконує їх по черзі.',
  scene: { type: 'street' },
};

const toWell: Level = {
  id: 'troy.well', world: 0, title: 'До криниці', topic: 'послідовність команд',
  brief: '<b>До криниці.</b> Криниця за чотири кроки. Доведи Енея до неї.',
  statement: [
    'Троянцям потрібна вода. Криниця стоїть за чотири клітинки від Енея.',
    'Кожен <code>enei.move()</code> — один крок. Команди виконуються зверху вниз.',
    'Якщо Еней пройде криницю — дороги далі немає, і він спіткнеться.',
  ],
  entry: 'toWell', observe: [null],
  starter: starter('toWell', [ENEI], 'void', ['До криниці', 'Криниця за 4 кроки. enei.move() — крок уперед.']),
  examples: [street(['empty', 'empty', 'empty', 'empty', 'well'], 'криниця на 4', 'well on 4')],
  hidden: [],
  check: (_tc, r) => (r.street!.cells[r.street!.pos] === 'well' ? true : L(`Еней зупинився на клітинці ${r.street!.pos}, а криниця на 4`, `Aeneas stopped on cell ${r.street!.pos}, the well is on 4`)),
  hints: ['Скільки кроків до криниці?', 'Кожен рядок enei.move(); — один крок. Потрібно чотири.', 'enei.move(); ×4'],
  solution: 'function toWell(enei: Enei): void {\n  enei.move();\n  enei.move();\n  enei.move();\n  enei.move();\n}',
  lesson: 'Команди виконуються по черзі, зверху вниз.',
  scene: { type: 'street' },
};

const gather: Level = {
  id: 'troy.gather', world: 0, title: 'Зерно вздовж вулиці', topic: 'цикл',
  brief: '<b>Зерно вздовж вулиці.</b> На кожній з <code>n</code> клітинок попереду лежить мішок. Збери всі.',
  statement: [
    'Уздовж вулиці лежать мішки з зерном — по одному на кожній з <code>n</code> клітинок попереду Енея.',
    '<code>enei.move()</code> — крок, <code>enei.take()</code> — підняти мішок там, де стоїш.',
    'Тести мають різне <code>n</code> (3, 5, 8, 12), тож вписати команди вручну не вийде — потрібен <b>цикл</b>: <code>for (let i = 0; i &lt; n; i++) { … }</code>.',
  ],
  entry: 'gather', observe: [null, null],
  starter: starter('gather', [ENEI, ['n', 'number']], 'void', ['Зерно вздовж вулиці', 'На кожній з n клітинок попереду — мішок.', 'enei.move() — крок, enei.take() — підняти мішок.']),
  examples: [withN(3)],
  hidden: [5, 8, 12].map(withN),
  check: (tc, r) => { const n = tc.args[1] as number; return r.street!.bag === n ? true : L(`зібрано ${r.street!.bag} з ${n} мішків`, `collected ${r.street!.bag} of ${n} sacks`); },
  hints: ['Що повторюється для кожного мішка?', 'Для кожного мішка: крок і підняти. Повтори це n разів.', 'for (let i = 0; i < n; i++) { enei.move(); enei.take(); }'],
  solution: 'function gather(enei: Enei, n: number): void {\n  for (let i = 0; i < n; i++) {\n    enei.move();\n    enei.take();\n  }\n}',
  lesson: 'Цикл повторює однакові кроки стільки разів, скільки треба, — хоч 3, хоч 3000.',
  scene: { type: 'street' },
};

const cross: Level = {
  id: 'troy.fire', world: 0, title: 'Обійти вогонь', topic: 'умова',
  brief: '<b>Обійти вогонь.</b> Дійди до кінця вулиці. Де попереду горить — перестрибни.',
  statement: [
    'Вулицею ще тліють завали. Дійди до криниці в кінці вулиці й не обпечися.',
    '<code>enei.fireAhead()</code> — чи горить на наступній клітинці; <code>enei.jump()</code> — стрибок через одну клітинку; <code>enei.atEnd()</code> — чи Еней уже в кінці.',
    'Вогонь у кожному тесті в іншому місці. Потрібна <b>умова</b>: <code>if (…) { … } else { … }</code>, а довжину вулиці дізнайся через <code>while (!enei.atEnd())</code>.',
  ],
  entry: 'crossAshes', observe: [null],
  starter: starter('crossAshes', [ENEI], 'void', ['Обійти вогонь', 'enei.fireAhead() — чи горить попереду; enei.jump() — перестрибнути;', 'enei.move() — крок; enei.atEnd() — чи це кінець вулиці.']),
  examples: [street(['empty', 'empty', 'fire', 'empty', 'empty', 'well'], 'вогонь на 2', 'fire on 2')],
  hidden: [
    street(['empty', 'fire', 'empty', 'fire', 'empty', 'empty', 'well'], 'вогонь на 1 і 3', 'fire on 1 and 3'),
    street(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'well'], 'без вогню', 'no fire'),
    street(['empty', 'empty', 'fire', 'empty', 'empty', 'fire', 'empty', 'empty', 'fire', 'empty', 'well'], 'три вогнища', 'three fires'),
  ],
  check: (_tc, r) => { const s = r.street!; return s.pos === s.cells.length - 1 ? true : L(`Еней зупинився на ${s.pos}, а криниця на ${s.cells.length - 1}`, `Aeneas stopped on ${s.pos}, the well is on ${s.cells.length - 1}`); },
  hints: ['Перед кожним кроком подивись, що попереду.', 'Поки не кінець вулиці: якщо попереду вогонь — стрибай, інакше крокуй.', 'while (!enei.atEnd()) { if (enei.fireAhead()) enei.jump(); else enei.move(); }'],
  solution: 'function crossAshes(enei: Enei): void {\n  while (!enei.atEnd()) {\n    if (enei.fireAhead()) enei.jump();\n    else enei.move();\n  }\n}',
  lesson: 'Умова вибирає дію за станом світу, а цикл while іде, доки не досягнуто мети.',
  scene: { type: 'street' },
};

// В англійському інтерфейсі вулиця теж говорить англійською: trojan / sack / ash.
const WORD_EN: Record<string, string> = { 'троянець': 'trojan', 'мішок': 'sack', 'попіл': 'ash' };
const TROJAN = new Set(['троянець', 'trojan']);
function countCrewRef(street: string[]): number { let c = 0; for (const x of street) if (TROJAN.has(x)) c++; return c; }
const crewCase = (a: string[]): TestCase => ({
  get args() { return [uiLang() === 'en' ? a.map((x) => WORD_EN[x] ?? x) : a]; },
  get label() { return L(`${a.length} клітинок`, `${a.length} cells`); },
});

const countCrew: Level = {
  id: 'troy.count', world: 0, title: 'Порахувати троянців', topic: 'змінна-лічильник',
  brief: '<b>Порахувати троянців.</b> Скільки вцілілих стоїть на вулиці?',
  statement: [
    'Еней збирає ватагу. На вулиці — троянці, мішки й попіл: масив рядків <code>street</code>.',
    'Поверни, скільки в ньому <code>"троянець"</code>.',
    'Заведи <b>змінну-лічильник</b>: <code>let count = 0</code>, пройди масив і додавай 1, коли зустрінеш троянця.',
  ],
  entry: 'countCrew', observe: ['street'],
  starter: starter('countCrew', [['street', 'string[]']], 'number', ['Порахувати троянців', 'street[i] — "троянець", "мішок" або "попіл".', 'Поверни кількість троянців.'], '  let count = 0;\n  // Слово ладу пиши тут\n\n  return count;\n'),
  examples: [crewCase(['мішок', 'троянець', 'попіл', 'троянець', 'мішок', 'троянець'])],
  hidden: [
    crewCase(['попіл', 'попіл']),
    crewCase(['троянець']),
    crewCase(['троянець', 'троянець', 'мішок', 'троянець', 'попіл', 'попіл', 'троянець', 'мішок']),
  ],
  reference: countCrewRef,
  hints: ['Потрібне число, яке росте, поки ти йдеш вулицею.', 'let count = 0; для кожного елемента: якщо це троянець — count++.', 'for (const x of street) if (x === "троянець") count++;'],
  solution: 'function countCrew(street: string[]): number {\n  let count = 0;\n  for (let i = 0; i < street.length; i++) if (street[i] === "троянець") count++;\n  return count;\n}',
  lesson: 'Змінна пам\'ятає те, що ти вже порахував, поки цикл іде далі.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

function runningSumRef(nums: number[]): number[] { const out: number[] = []; let s = 0; for (const x of nums) { s += x; out.push(s); } return out; }
const SUM_DOC = ['Припаси', 'nums[i] — зерно в мішку i.', 'Поверни наростаючі суми: [nums[0], nums[0]+nums[1], …].'];
const nums = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });

const runningSum: Level = {
  id: 'troy.sum', world: 0, final: true, title: 'Припаси', topic: 'наростаючий підсумок',
  leetcode: lc(1480, 'Running Sum of 1d Array'),
  brief: '<b>Припаси.</b> Мішки стоять у ряд. Для кожного порахуй, скільки зерна в ньому й у всіх попередніх.',
  statement: [
    'Троянці складають припаси на корабель. <code>nums[i]</code> — скільки зерна в мішку <code>i</code>.',
    'Поверни масив, де на місці <code>i</code> стоїть сума <code>nums[0] + … + nums[i]</code>.',
    'Обмеження: <code>1 ≤ n ≤ 10⁴</code>. Світ рахує, скільки разів код дивиться на мішки: якщо для кожного мішка рахувати все спочатку, Вовк би пишався.',
  ],
  entry: 'runningSum', observe: ['nums'],
  starter: {
    ts: starter('runningSum', [['nums', 'number[]']], 'number[]', SUM_DOC, '  const result: number[] = [];\n  // Слово ладу пиши тут\n\n  return result;\n').ts,
    js: starter('runningSum', [['nums', 'number[]']], 'number[]', SUM_DOC, '  const result = [];\n  // Слово ладу пиши тут\n\n  return result;\n').js,
  },
  examples: [nums([1, 2, 3, 4]), nums([3, 1, 2, 10, 1])],
  hidden: [nums([1, 1, 1, 1, 1]), nums([5]), nums([0, 0, 7]), nums([-1, 2, -3, 4])],
  big: { n: 10000, make: (n) => { const r = rng(1480); return [Array.from({ length: n }, () => Math.floor(r() * 100))]; }, readBudget: (n) => 10 * n },
  reference: runningSumRef,
  wolf: { reads: (n) => (n * (n + 1)) / 2, code: 'function runningSum(nums) {\n  const result = [];\n  for (let i = 0; i < nums.length; i++) {\n    let s = 0;\n    for (let j = 0; j <= i; j++) s += nums[j];\n    result.push(s);\n  }\n  return result;\n}' },
  hints: ['Сума до мішка i — це сума до мішка i−1 плюс сам мішок i.', 'Тримай змінну sum і додавай до неї кожен наступний мішок.', 'let sum = 0; for (x of nums) { sum += x; result.push(sum); }'],
  solution: 'function runningSum(nums: number[]): number[] {\n  const result: number[] = [];\n  let sum = 0;\n  for (let i = 0; i < nums.length; i++) { sum += nums[i]; result.push(sum); }\n  return result;\n}',
  lesson: 'Не рахуй заново те, що вже знаєш: попередня сума — готова половина відповіді.',
  scene: { type: 'array', skin: 'sack', mode: 'scan' },
};

export const troy: World = {
  n: 0, name: 'Попелище Трої', song: 'Пісня I · Шторм', topic: 'Основи: команди, цикли, умови, змінні', fox: '#8d8780',
  host: { who: 'Микита', line: 'Тут ще повно своїх і зерна. Можна збирати руками кожен мішок… але цикл хитріший.' },
  levels: [firstStep, toWell, gather, cross, countCrew, runningSum],
};
