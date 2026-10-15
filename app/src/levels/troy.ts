import { rng, type Level, type World } from '../engine/level.ts';
import type { StreetCell, TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

/*
 * Світ 0 — основи для тих, хто тільки вчить JS. Правило: одна нова річ на вправу, і спершу людина
 * відчуває, навіщо вона (15 однакових рядків → цикл; різні вулиці → параметр; невідома довжина → while).
 */

// Підпис — геттер: перекладається на момент показу, а не завантаження модуля.
const street = (cells: StreetCell[], uk: string, en: string): TestCase => ({ args: [{ $actor: 'enei', setup: { cells } }], get label() { return L(uk, en); } });
const road = (n: number, end: StreetCell = 'well'): StreetCell[] => ['empty', ...Array<StreetCell>(n - 1).fill('empty'), end];
const sacks = (n: number) => street(['empty', ...Array<StreetCell>(n).fill('sack')], ukN(n, 'мішок', 'мішки', 'мішків'), enN(n, 'sack', 'sacks'));
const ENEI = ['enei', 'Enei'] as [string, string];
/** Українська множина: 1 мішок, 3 мішки, 5 мішків. */
const ukN = (n: number, one: string, few: string, many: string) => {
  const d = n % 10, h = n % 100;
  return `${n} ${d === 1 && h !== 11 ? one : d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many}`;
};
const enN = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
/** Вулиця з n мішків і саме n як другий аргумент; геттер підпису зберігається. */
const withN = (n: number): TestCase => { const t = sacks(n); return { args: [...t.args, n], get label() { return t.label; } }; };
const atWell = (_tc: TestCase, r: { street?: { cells: StreetCell[]; pos: number } }) => {
  const s = r.street!, well = s.cells.length - 1;
  return s.pos === well ? true : L(`Еней зупинився на клітинці ${s.pos}, а криниця на ${well}`, `Aeneas stopped on cell ${s.pos}, the well is on ${well}`);
};

const firstStep: Level = {
  id: 'troy.step', world: 0, title: 'Перший крок', topic: 'команда',
  brief: '<b>Перший крок.</b> Микита стоїть поруч. Скажи слово — і Еней зробить крок.',
  statement: [
    'Еней стоїть на попелищі, а за крок від нього — Микита, що щойно впав з неба.',
    'Код уже написано: <code>enei.move()</code> — один крок уперед. Натисни «Запустити» (або ⌘↵).',
    'Так виглядає слово ладу, тобто код: світ робить рівно те, що написано, і нічого більше.',
  ],
  tool: {
    name: 'команда',
    text: [
      '<code>enei</code> — це Еней, а <code>.move()</code> — команда, яку він виконує. Крапка означає «у Енея є така дія».',
      'Дужки <code>()</code> — це наказ «виконай зараз». Без них команда просто згадана, але не віддана.',
      'Крапка з комою <code>;</code> в кінці — як крапка в реченні.',
    ],
    code: 'enei.move();   // Еней робить один крок уперед',
  },
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
    'Один <code>enei.move()</code> — один крок. Напиши стільки кроків, скільки треба.',
    'Якщо Еней пройде повз криницю, дороги далі немає, і він спіткнеться.',
  ],
  tool: {
    name: 'кілька команд',
    text: [
      'Команди виконуються по черзі, <b>зверху вниз</b>, кожна з нового рядка.',
      'Світ не вгадує, чого ти хотів: скільки кроків написано, стільки Еней і зробить.',
    ],
    code: 'enei.move();   // перший крок\nenei.move();   // другий крок',
  },
  entry: 'toWell', observe: [null],
  starter: starter('toWell', [ENEI], 'void', ['До криниці', 'Криниця за 4 кроки. enei.move() — крок уперед.']),
  examples: [street(road(4), 'криниця на 4', 'well on 4')],
  hidden: [],
  check: atWell,
  hints: ['Скільки клітинок між Енеєм і криницею?', 'Кожен рядок enei.move(); — один крок. Потрібно чотири.', 'enei.move(); ×4'],
  solution: 'function toWell(enei: Enei): void {\n  enei.move();\n  enei.move();\n  enei.move();\n  enei.move();\n}',
  lesson: 'Команди виконуються по черзі, зверху вниз.',
  scene: { type: 'street' },
};

const farWell: Level = {
  id: 'troy.far', world: 0, title: 'Далека криниця', topic: 'цикл for',
  brief: '<b>Далека криниця.</b> Ця криниця вже за 15 кроків. Можна написати 15 рядків… або одне хитре слово.',
  statement: [
    'Ближня криниця пересохла. Наступна — аж у кінці вулиці, за 15 клітинок.',
    'Можна написати <code>enei.move()</code> п\'ятнадцять разів, і це спрацює. А якщо криниця буде за сотню кроків? За тисячу?',
    'Коли треба повторити те саме багато разів, програмісти пишуть <b>цикл</b>. Подивись на новий інструмент нижче.',
  ],
  tool: {
    name: 'цикл for',
    text: [
      '<code>for</code> повторює все, що між <code>{</code> і <code>}</code>, стільки разів, скільки скажеш.',
      '<code>let i = 0</code> — лічильник починає з нуля. <code>i &lt; 3</code> — повторюй, поки лічильник менший за 3. <code>i++</code> — після кожного повтору додай до лічильника 1.',
      'Тож лічильник пройде 0, 1, 2 — це три повтори. Щоб повторити 10 разів, пиши <code>i &lt; 10</code>.',
    ],
    code: 'for (let i = 0; i < 3; i++) {\n  enei.move();   // виконається 3 рази\n}',
  },
  entry: 'farWell', observe: [null],
  starter: starter('farWell', [ENEI], 'void', ['Далека криниця', 'Криниця за 15 кроків. enei.move() — крок уперед.', 'Спробуй цикл for: він повторює команду стільки разів, скільки скажеш.']),
  examples: [street(road(15), 'криниця на 15', 'well on 15')],
  hidden: [],
  check: atWell,
  hints: ['П\'ятнадцять однакових рядків… А що, як повторити один рядок 15 разів?', 'У циклі for число в умові i < … — це скільки разів повторити.', 'for (let i = 0; i < 15; i++) { enei.move(); }'],
  solution: 'function farWell(enei: Enei): void {\n  for (let i = 0; i < 15; i++) {\n    enei.move();\n  }\n}',
  lesson: 'Цикл замінює багато однакових рядків одним: змінюєш число — змінюється кількість повторів.',
  scene: { type: 'street' },
};

const gateSacks: Level = {
  id: 'troy.sacks', world: 0, title: 'Мішки біля брами', topic: 'кілька команд у циклі',
  brief: '<b>Мішки біля брами.</b> На п\'яти клітинках попереду лежить по мішку. Збери всі п\'ять.',
  statement: [
    'Біля брами лежать мішки з зерном — по одному на кожній з п\'яти клітинок попереду Енея.',
    'Нова команда: <code>enei.take()</code> — підняти мішок там, де Еней стоїть. Щоб узяти мішок, треба спершу до нього дійти.',
    'Для кожного мішка потрібні дві дії: крок і підняти. Цикл уміє повторювати не одну команду, а цілу групу.',
  ],
  tool: {
    name: 'тіло циклу',
    text: [
      'Усе, що стоїть між <code>{</code> і <code>}</code>, називається <b>тілом циклу</b>. Тіло виконується повністю, від першого рядка до останнього, і лише потім починається наступний повтор.',
      'У прикладі нижче за кожен повтор Еней робить два кроки, тож за 3 повтори — шість.',
    ],
    code: 'for (let i = 0; i < 3; i++) {\n  enei.move();\n  enei.move();\n}',
  },
  entry: 'gateSacks', observe: [null],
  starter: starter('gateSacks', [ENEI], 'void', ['Мішки біля брами', 'На кожній з 5 клітинок попереду — мішок.', 'enei.move() — крок, enei.take() — підняти мішок.']),
  examples: [sacks(5)],
  hidden: [],
  check: (_tc, r) => (r.street!.bag === 5 ? true : L(`зібрано ${r.street!.bag} з 5 мішків`, `collected ${r.street!.bag} of 5 sacks`)),
  hints: ['Що треба зробити для одного мішка?', 'Для кожного мішка: крок, потім підняти. І так 5 разів.', 'for (let i = 0; i < 5; i++) { enei.move(); enei.take(); }'],
  solution: 'function gateSacks(enei: Enei): void {\n  for (let i = 0; i < 5; i++) {\n    enei.move();\n    enei.take();\n  }\n}',
  lesson: 'Тіло циклу — це група команд, яка повторюється цілком: крок, підняти, крок, підняти…',
  scene: { type: 'street' },
};

const gather: Level = {
  id: 'troy.gather', world: 0, title: 'Зерно вздовж вулиці', topic: 'параметр n',
  brief: '<b>Зерно вздовж вулиці.</b> Тепер вулиці різні: десь 3 мішки, десь 12. Скільки — підкаже <code>n</code>.',
  statement: [
    'Троянці знайшли ще кілька вулиць з мішками. На кожній мішки лежать підряд, по одному на клітинці, але їх кількість різна.',
    'Твій код запускатиметься на чотирьох вулицях: з <b>3, 5, 8 і 12</b> мішками. Якщо вписати в цикл число 3, на інших вулицях Еней зупиниться раніше.',
    'Тому функція отримує <code>n</code> — кількість мішків на поточній вулиці. Використай його замість конкретного числа.',
  ],
  tool: {
    name: 'параметр',
    text: [
      '<b>Параметр</b> — це значення, яке функція отримує ззовні, у дужках після назви. Хто викликає функцію, той і вирішує, чому воно дорівнює.',
      'Код один, а результат залежить від того, що передали. Саме тому одна функція працює для всіх вулиць.',
    ],
    code: 'function clap(times) {\n  for (let i = 0; i < times; i++) console.log("хлоп!");\n}\nclap(2);    // хлоп! хлоп!\nclap(5);    // п\'ять разів',
  },
  entry: 'gather', observe: [null, null],
  starter: starter('gather', [ENEI, ['n', 'number']], 'void', ['Зерно вздовж вулиці', 'На кожній з n клітинок попереду — мішок. n буває 3, 5, 8 або 12.', 'enei.move() — крок, enei.take() — підняти мішок.']),
  examples: [withN(3)],
  hidden: [5, 8, 12].map(withN),
  check: (tc, r) => { const n = tc.args[1] as number; return r.street!.bag === n ? true : L(`зібрано ${r.street!.bag} з ${n} мішків`, `collected ${r.street!.bag} of ${n} sacks`); },
  hints: ['Чим відрізняються вулиці в тестах? І що з цього знає функція?', 'Візьми цикл з минулої вправи, але замість числа 5 постав n.', 'for (let i = 0; i < n; i++) { enei.move(); enei.take(); }'],
  solution: 'function gather(enei: Enei, n: number): void {\n  for (let i = 0; i < n; i++) {\n    enei.move();\n    enei.take();\n  }\n}',
  lesson: 'Не вписуй число в код, якщо воно може змінитися: бери його з параметра, і код працюватиме для будь-якої вулиці.',
  scene: { type: 'street' },
};

const walkOn: Level = {
  id: 'troy.walk', world: 0, title: 'Криниця десь там', topic: 'цикл while',
  brief: '<b>Криниця десь там.</b> Криниця в кінці вулиці, але скільки до неї кроків — невідомо.',
  statement: [
    'Ніч, дим, нічого не видно. Криниця точно в кінці вулиці, але вулиці різної довжини, а <code>n</code> цього разу ніхто не дає.',
    'Зате Еней може перевірити, чи він уже прийшов: <code>enei.atEnd()</code> повертає <code>true</code>, якщо Еней у кінці вулиці, і <code>false</code>, якщо ні.',
    'Коли не знаєш, скільки разів повторювати, але знаєш, <b>до якого моменту</b>, — потрібен цикл <code>while</code>.',
  ],
  tool: {
    name: 'цикл while і знак !',
    text: [
      '<code>while (умова) { … }</code> повторює тіло, <b>поки</b> умова правдива. Перед кожним повтором умова перевіряється знову.',
      'Знак <code>!</code> означає «не»: <code>!true</code> — це <code>false</code>, і навпаки. Тож <code>!enei.atEnd()</code> читається як «Еней ще не в кінці».',
    ],
    code: 'let water = 0;\nwhile (water < 3) {\n  water++;   // повториться, поки water менше 3\n}',
  },
  entry: 'walkOn', observe: [null],
  starter: starter('walkOn', [ENEI], 'void', ['Криниця десь там', 'Криниця в кінці вулиці, довжина невідома.', 'enei.move() — крок; enei.atEnd() — чи Еней уже в кінці.']),
  examples: [street(road(6), 'криниця на 6', 'well on 6')],
  hidden: [street(road(2), 'криниця на 2', 'well on 2'), street(road(9), 'криниця на 9', 'well on 9'), street(road(14), 'криниця на 14', 'well on 14')],
  check: atWell,
  hints: ['До якого моменту Енеєві треба йти?', 'Поки Еней не в кінці вулиці — робимо крок.', 'while (!enei.atEnd()) { enei.move(); }'],
  solution: 'function walkOn(enei: Enei): void {\n  while (!enei.atEnd()) {\n    enei.move();\n  }\n}',
  lesson: 'for — коли знаєш, скільки разів. while — коли знаєш, до якого моменту.',
  scene: { type: 'street' },
};

const cross: Level = {
  id: 'troy.fire', world: 0, title: 'Обійти вогонь', topic: 'умова if / else',
  brief: '<b>Обійти вогонь.</b> Дійди до криниці в кінці вулиці. Де попереду горить — перестрибни.',
  statement: [
    'Вулицею ще тліють завали. Дійди до криниці в кінці вулиці й не обпечися.',
    '<code>enei.fireAhead()</code> — чи горить на наступній клітинці (<code>true</code> або <code>false</code>). <code>enei.jump()</code> — стрибок через одну клітинку.',
    'Вогонь у кожному тесті в іншому місці, тож перед кожним кроком треба <b>вирішувати</b>, що робити: крокувати чи стрибати. Іти до кінця ти вже вмієш.',
  ],
  tool: {
    name: 'умова if / else',
    text: [
      '<code>if (умова) { … }</code> виконує дію, тільки якщо умова правдива. <code>else { … }</code> — що робити інакше.',
      'Так код вибирає одну з двох дій залежно від того, що відбувається у світі.',
    ],
    code: 'if (raining) {\n  takeUmbrella();   // якщо дощ\n} else {\n  takeCap();        // якщо ні\n}',
  },
  entry: 'crossAshes', observe: [null],
  starter: starter('crossAshes', [ENEI], 'void', ['Обійти вогонь', 'enei.fireAhead() — чи горить попереду; enei.jump() — перестрибнути;', 'enei.move() — крок; enei.atEnd() — чи це кінець вулиці.']),
  examples: [street(['empty', 'empty', 'fire', 'empty', 'empty', 'well'], 'вогонь на 2', 'fire on 2')],
  hidden: [
    street(['empty', 'fire', 'empty', 'fire', 'empty', 'empty', 'well'], 'вогонь на 1 і 3', 'fire on 1 and 3'),
    street(['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'well'], 'без вогню', 'no fire'),
    street(['empty', 'empty', 'fire', 'empty', 'empty', 'fire', 'empty', 'empty', 'fire', 'empty', 'well'], 'три вогнища', 'three fires'),
  ],
  check: atWell,
  hints: ['Візьми цикл з минулої вправи. Що змінилося на вулиці?', 'Поки не кінець вулиці: якщо попереду вогонь — стрибай, інакше крокуй.', 'while (!enei.atEnd()) { if (enei.fireAhead()) enei.jump(); else enei.move(); }'],
  solution: 'function crossAshes(enei: Enei): void {\n  while (!enei.atEnd()) {\n    if (enei.fireAhead()) enei.jump();\n    else enei.move();\n  }\n}',
  lesson: 'Умова вибирає дію за станом світу, а цикл повторює цей вибір на кожному кроці.',
  scene: { type: 'street' },
};

// В англійському інтерфейсі вулиця теж говорить англійською: trojan / sack / ash / well.
const WORD_EN: Record<string, string> = { 'троянець': 'trojan', 'мішок': 'sack', 'попіл': 'ash', 'криниця': 'well' };
const TROJAN = new Set(['троянець', 'trojan']);
function countCrewRef(street: string[]): number { let c = 0; for (const x of street) if (TROJAN.has(x)) c++; return c; }
const crewCase = (a: string[]): TestCase => ({
  get args() { return [uiLang() === 'en' ? a.map((x) => WORD_EN[x] ?? x) : a]; },
  get label() { return L(ukN(a.length, 'клітинка', 'клітинки', 'клітинок'), enN(a.length, 'cell', 'cells')); },
});

const lastCell: Level = {
  id: 'troy.last', world: 0, title: 'Що в кінці вулиці', topic: 'масив і індекс',
  brief: '<b>Що в кінці вулиці.</b> Тепер вулиця — це список. Поверни, що лежить на останній клітинці.',
  statement: [
    'Микита склав опис вулиці: що лежить на кожній клітинці, по черзі. У програмуванні такий список називається <b>масивом</b>: <code>street</code>.',
    'Поверни, що лежить на <b>останній</b> клітинці. Вулиці в тестах різної довжини, тож номер останньої клітинки доведеться обчислити.',
    'Щоб віддати відповідь, пиши <code>return</code> і значення.',
  ],
  tool: {
    name: 'масив, індекс, length, return',
    text: [
      'Елементи масиву нумеруються <b>з нуля</b>: перший — <code>days[0]</code>, другий — <code>days[1]</code>. Номер елемента називають індексом.',
      '<code>days.length</code> — скільки елементів у масиві. Оскільки рахуємо з нуля, останній елемент має індекс <code>length - 1</code>.',
      '<code>return</code> завершує функцію й віддає значення тому, хто її викликав.',
    ],
    code: 'const days = ["пн", "вт", "ср"];\ndays[0];        // "пн"\ndays.length;    // 3\nreturn days[1]; // поверне "вт"',
  },
  entry: 'lastCell', observe: ['street'],
  starter: starter('lastCell', [['street', 'string[]']], 'string', ['Що в кінці вулиці', 'street[i] — що лежить на клітинці i.', 'Поверни, що лежить на останній клітинці.'], '  // Слово ладу пиши тут\n\n'),
  examples: [crewCase(['попіл', 'мішок', 'троянець', 'криниця'])],
  hidden: [crewCase(['мішок']), crewCase(['троянець', 'попіл']), crewCase(['попіл', 'попіл', 'мішок', 'троянець', 'мішок', 'попіл', 'криниця'])],
  reference: (s: string[]) => s[s.length - 1],
  hints: ['Якщо у вулиці 4 клітинки, який номер у останньої? Пам\'ятай, рахуємо з нуля.', 'Номер останньої клітинки — street.length - 1.', 'return street[street.length - 1];'],
  solution: 'function lastCell(street: string[]): string {\n  return street[street.length - 1];\n}',
  lesson: 'Масив рахує з нуля: перший елемент — [0], останній — [length - 1].',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

const countCrew: Level = {
  id: 'troy.count', world: 0, title: 'Порахувати троянців', topic: 'змінна-лічильник',
  brief: '<b>Порахувати троянців.</b> Скільки вцілілих стоїть на вулиці?',
  statement: [
    'Еней збирає ватагу. Масив <code>street</code> — це вулиця: троянці, мішки й попіл.',
    'Поверни, скільки в ньому <code>"троянець"</code>. Для цього треба пройти всю вулицю й рахувати.',
    'Щоб пройти масив, бери цикл <code>for</code> від <code>0</code> до <code>street.length</code>, а щоб рахувати — змінну, яка пам\'ятає, скільки вже знайдено.',
  ],
  tool: {
    name: 'змінна-лічильник і ===',
    text: [
      '<code>let count = 0</code> створює змінну, яка пам\'ятає число. <code>count++</code> додає до неї 1.',
      '<code>===</code> перевіряє, чи два значення однакові. Не плутай з <code>=</code>, яке записує значення в змінну.',
    ],
    code: 'const fruits = ["яблуко", "груша", "яблуко"];\nlet apples = 0;\nfor (let i = 0; i < fruits.length; i++) {\n  if (fruits[i] === "яблуко") apples++;\n}\n// apples === 2',
  },
  entry: 'countCrew', observe: ['street'],
  starter: starter('countCrew', [['street', 'string[]']], 'number', ['Порахувати троянців', 'street[i] — "троянець", "мішок" або "попіл".', 'Поверни кількість троянців.'], '  let count = 0;\n  // Слово ладу пиши тут\n\n  return count;\n'),
  examples: [crewCase(['мішок', 'троянець', 'попіл', 'троянець', 'мішок', 'троянець'])],
  hidden: [
    crewCase(['попіл', 'попіл']),
    crewCase(['троянець']),
    crewCase(['троянець', 'троянець', 'мішок', 'троянець', 'попіл', 'попіл', 'троянець', 'мішок']),
  ],
  reference: countCrewRef,
  hints: ['Потрібне число, яке росте, поки ти йдеш вулицею.', 'Пройди street циклом; якщо street[i] — троянець, додай до count одиницю.', 'for (let i = 0; i < street.length; i++) if (street[i] === "троянець") count++;'],
  solution: 'function countCrew(street: string[]): number {\n  let count = 0;\n  for (let i = 0; i < street.length; i++) if (street[i] === "троянець") count++;\n  return count;\n}',
  lesson: 'Змінна пам\'ятає те, що ти вже порахував, поки цикл іде далі.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

function totalRef(nums: number[]): number { let s = 0; for (const x of nums) s += x; return s; }
const nums = (a: number[]): TestCase => ({ args: [a], label: JSON.stringify(a) });

const allGrain: Level = {
  id: 'troy.total', world: 0, title: 'Усе зерно', topic: 'сума',
  brief: '<b>Усе зерно.</b> Мішки різні. Скільки зерна в усіх разом?',
  statement: [
    'Перед відплиттям Анхіз хоче знати, скільки зерна в припасах. <code>nums[i]</code> — скільки зерна в мішку <code>i</code>.',
    'Поверни суму всіх чисел у масиві.',
    'Це майже те саме, що лічильник троянців, тільки додаєш не 1, а вміст мішка.',
  ],
  tool: {
    name: 'накопичення суми, +=',
    text: [
      '<code>total += x</code> — те саме, що <code>total = total + x</code>: узяти те, що вже є, і додати нове.',
      'Змінна, в яку крок за кроком додають значення, називається <b>акумулятором</b>. Починає вона з нуля.',
    ],
    code: 'const coins = [5, 10, 2];\nlet money = 0;\nfor (let i = 0; i < coins.length; i++) money += coins[i];\n// money === 17',
  },
  entry: 'totalGrain', observe: ['nums'],
  starter: starter('totalGrain', [['nums', 'number[]']], 'number', ['Усе зерно', 'nums[i] — зерно в мішку i.', 'Поверни, скільки зерна в усіх мішках разом.'], '  let total = 0;\n  // Слово ладу пиши тут\n\n  return total;\n'),
  examples: [nums([3, 1, 4, 2]), nums([10, 20])],
  hidden: [nums([7]), nums([0, 0, 0]), nums([5, 5, 5, 5, 5, 5]), nums([-2, 8, -1])],
  reference: totalRef,
  hints: ['Що змінюється в змінній з кожним мішком?', 'Пройди масив циклом і додавай nums[i] до total.', 'for (let i = 0; i < nums.length; i++) total += nums[i];'],
  solution: 'function totalGrain(nums: number[]): number {\n  let total = 0;\n  for (let i = 0; i < nums.length; i++) total += nums[i];\n  return total;\n}',
  lesson: 'Акумулятор збирає відповідь по шматочку: кожен мішок додається до того, що вже пораховано.',
  scene: { type: 'array', skin: 'sack', mode: 'scan' },
};

function runningSumRef(nums: number[]): number[] { const out: number[] = []; let s = 0; for (const x of nums) { s += x; out.push(s); } return out; }
const SUM_DOC = ['Припаси', 'nums[i] — зерно в мішку i.', 'Поверни наростаючі суми: [nums[0], nums[0]+nums[1], …].'];

const runningSum: Level = {
  id: 'troy.sum', world: 0, final: true, title: 'Припаси', topic: 'наростаючий підсумок',
  leetcode: lc(1480, 'Running Sum of 1d Array'),
  brief: '<b>Припаси.</b> Мішки стоять у ряд. Для кожного порахуй, скільки зерна в ньому й у всіх попередніх.',
  statement: [
    'Троянці вантажать припаси на корабель і після кожного мішка записують, скільки вже завантажено. <code>nums[i]</code> — скільки зерна в мішку <code>i</code>.',
    'Поверни масив, де на місці <code>i</code> стоїть сума <code>nums[0] + … + nums[i]</code>. Наприклад, для <code>[1, 2, 3, 4]</code> — <code>[1, 3, 6, 10]</code>.',
    'Обмеження: <code>1 ≤ n ≤ 10⁴</code>. Світ рахує, скільки разів код дивиться на мішки: якщо для кожного мішка рахувати все спочатку, Вовк би пишався.',
  ],
  tool: {
    name: 'push',
    text: [
      '<code>result.push(x)</code> дописує значення <code>x</code> у кінець масиву <code>result</code>.',
      'Суму ти вже вмієш накопичувати. Тепер записуй її в результат після кожного кроку, а не лише в кінці.',
    ],
    code: 'const log = [];\nlog.push("ранок");\nlog.push("вечір");\n// log — ["ранок", "вечір"]',
  },
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
  hints: ['Візьми «Усе зерно»: сума там уже накопичується. Чого бракує?', 'Після кожного додавання до sum запиши sum у result.', 'let sum = 0; for (…) { sum += nums[i]; result.push(sum); }'],
  solution: 'function runningSum(nums: number[]): number[] {\n  const result: number[] = [];\n  let sum = 0;\n  for (let i = 0; i < nums.length; i++) { sum += nums[i]; result.push(sum); }\n  return result;\n}',
  lesson: 'Не рахуй заново те, що вже знаєш: попередня сума — готова половина відповіді.',
  scene: { type: 'array', skin: 'sack', mode: 'scan' },
};

export const troy: World = {
  n: 0, name: 'Попелище Трої', song: 'Пісня I · Шторм', topic: 'Основи: команди, цикли, умови, змінні', fox: '#8d8780',
  host: { who: 'Микита', line: 'Тут ще повно своїх і зерна. Можна збирати руками кожен мішок… але цикл хитріший.' },
  levels: [firstStep, toWell, farWell, gateSacks, gather, walkOn, cross, lastCell, countCrew, allGrain, runningSum],
};
