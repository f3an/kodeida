import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';
import { L, uiLang } from '../i18n.ts';

/*
 * Світ 4 — Рукавичка, стек. Головна думка: хто заліз останнім, вилазить першим.
 * Стек — звичайний масив, з якого беруть лише з кінця: push кладе нагору, pop знімає верхнього.
 */

// Мешканці рукавички мовою інтерфейсу.
const BEAST_EN: Record<string, string> = { 'Мишка': 'Mouse', 'Жабка': 'Frog', 'Зайчик': 'Bunny', 'Лисичка': 'Vixen', 'Вовчик': 'Wolfie', 'Кабан': 'Boar', 'Ведмідь': 'Bear' };
const beasts = (a: string[]): TestCase => ({
  get args() { return [uiLang() === 'en' ? a.map((x) => BEAST_EN[x] ?? x) : a]; },
  get label() { return JSON.stringify(uiLang() === 'en' ? a.map((x) => BEAST_EN[x] ?? x) : a); },
});
const one = <T,>(a: T): TestCase => ({ args: [a], label: JSON.stringify(a) });

/* 1. push / pop */
function orderRef(ops: string[]) { const st: string[] = [], out: string[] = []; for (const o of ops) { if (o === '-') out.push(st.pop()!); else st.push(o); } return out; }
const order: Level = {
  id: 'mitten.order', world: 4, title: 'Хто вилазить першим', topic: 'стек: push і pop',
  brief: '<b>Хто вилазить першим.</b> Звірі залазять у рукавичку й вилазять. Запиши, в якому порядку вони виходили.',
  statement: [
    'У рукавичці тісно: вилізти може лише той, хто біля входу, тобто той, хто заліз <b>останнім</b>. Так працює <b>стек</b>, як стос тарілок: беруть завжди верхню.',
    'Масив <code>ops</code> — що відбувалося по черзі: ім\'я звіра означає «заліз», а <code>"-"</code> — «хтось виліз». Поверни імена в тому порядку, в якому звірі вилазили.',
    'Для <code>["Мишка", "Жабка", "-", "Зайчик", "-", "-"]</code> вийде <code>["Жабка", "Зайчик", "Мишка"]</code>. З порожньої рукавички в тестах ніхто не вилазить.',
  ],
  tool: {
    name: 'стек: push і pop',
    text: [
      '<b>Стек</b> — це звичайний масив, з яким працюють лише з одного кінця. <code>stack.push(x)</code> кладе нагору, <code>stack.pop()</code> знімає верхнього й повертає його.',
      'Тож останній покладений знімається першим. Так і в рукавичці.',
    ],
    code: 'const plates = [];\nplates.push("синя");\nplates.push("червона");\nplates.pop();   // "червона" — поклали останньою\nplates.pop();   // "синя"',
  },
  talk: [
    { who: 'mitten', text: 'Рятуйте! Лізуть хто куди, а виходити не дають! Рукавичка от-от трісне!' },
    { who: 'fox', text: 'Я перший заліз… і тепер на самому дні. Холодно, тісно і хтось сидить мені на хвості.' },
    { who: 'enei', text: 'Спокійно. Хто заліз останнім, той і виходить першим. Запишімо, як воно було.' },
  ],
  quip: { who: 'mitten', text: 'Ох, легше стало! Принаймні тепер ясно, хто за ким.' },
  entry: 'exitOrder', observe: ['ops'],
  starter: starter('exitOrder', [['ops', 'string[]']], 'string[]', ['Хто вилазить першим', 'ops[i] — ім\'я (заліз) або "-" (хтось виліз).', 'Поверни імена в порядку виходу.'], '  const stack = [];\n  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [beasts(['Мишка', 'Жабка', '-', 'Зайчик', '-', '-'])],
  hidden: [beasts(['Кабан', '-']), beasts(['Мишка', 'Жабка', 'Зайчик', 'Лисичка', '-', '-', '-', '-']), beasts(['Ведмідь', '-', 'Вовчик', '-', 'Мишка', '-']), beasts(['Жабка', 'Мишка'])],
  reference: orderRef,
  hints: ['Хто стоїть біля входу в рукавичку?', 'Тримай stack: ім\'я — push, «-» — pop, і те, що знято, додавай у out.', 'for (op of ops) { if (op === "-") out.push(stack.pop()); else stack.push(op); }'],
  solution: 'function exitOrder(ops: string[]): string[] {\n  const stack: string[] = [];\n  const out: string[] = [];\n  for (let i = 0; i < ops.length; i++) {\n    if (ops[i] === "-") out.push(stack.pop()!);\n    else stack.push(ops[i]);\n  }\n  return out;\n}',
  lesson: 'Стек — масив, з яким працюєш лише з кінця: останній покладений знімається першим.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. Valid Parentheses */
function parensRef(s: string) { const st: string[] = [], pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' }; for (const ch of s) { if (ch in pair) { if (st.pop() !== pair[ch]) return false; } else st.push(ch); } return st.length === 0; }
const parens: Level = {
  id: 'mitten.parens', world: 4, title: 'Чи всі вийшли як слід', topic: 'стек: пари дужок',
  leetcode: lc(20, 'Valid Parentheses'),
  brief: '<b>Чи всі вийшли як слід.</b> Кожна дужка, що відкрилася, має закритися своєю, і в правильному порядку.',
  statement: [
    'Звірі записали свої ходи дужками: відкрита дужка — заліз, закрита — виліз. Різні звірі — різні дужки: <code>()</code>, <code>[]</code>, <code>{}</code>.',
    'Поверни <code>true</code>, якщо кожен, хто заліз, вийшов, і виходили в правильному порядку: закрита дужка має бути того самого виду, що й <b>остання</b> ще відкрита. Інакше — <code>false</code>.',
    'Наприклад, <code>"([])"</code> — так, а <code>"([)]"</code> — ні: кругла закрилася, поки квадратна всередині ще відкрита. Тримай відкриті дужки в стеку.',
  ],
  tool: {
    name: 'верхівка стеку',
    text: [
      'Верхній елемент стеку — <code>stack[stack.length - 1]</code>. А <code>stack.pop()</code> знімає його і повертає, тож можна одразу порівняти.',
      'Зручно мати пари під рукою: об\'єкт <code>{ ")": "(", "]": "[", "}": "{" }</code> каже, яка відкрита дужка потрібна для кожної закритої.',
    ],
    code: 'const pair = { ")": "(", "]": "[", "}": "{" };\nconst stack = ["(", "["];\nstack[stack.length - 1];   // "[" — верхівка\nstack.pop() === pair["]"]; // true',
  },
  talk: [
    { who: 'mitten', text: 'Хтось виліз раніше за того, хто сидів над ним! Як це взагалі можливо?!' },
    { who: 'fox', text: 'Неможливо, якщо все чесно. Перевіримо записи: кожен вихід має відповідати останньому, хто заліз і ще не вийшов.' },
  ],
  quip: { who: 'fox', text: 'Записи чесні. А той, хто «виліз раніше», просто сидів на мені. Я пам\'ятаю.' },
  entry: 'isValid', observe: ['s'],
  starter: starter('isValid', [['s', 'string']], 'boolean', ['Чи всі вийшли як слід', 'true, якщо кожна дужка закривається своєю й у правильному порядку.'], '  const stack = [];\n  // Слово ладу пиши тут\n\n  return true;\n'),
  examples: [one('([]){}'), one('([)]')],
  hidden: [one('()'), one('('), one(')'), one('{[()()]}'), one('(()'), one('[{]}'), one('{}[]()')],
  reference: parensRef,
  hints: ['Що треба знати в момент, коли приходить закрита дужка?', 'Відкриту клади в stack. Закрита має збігтися з тією, що на верхівці; інакше false. Наприкінці stack має бути порожнім.', 'for (ch of s) { if (ch in pair) { if (stack.pop() !== pair[ch]) return false; } else stack.push(ch); } return stack.length === 0;'],
  solution: 'function isValid(s: string): boolean {\n  const pair: Record<string, string> = { ")": "(", "]": "[", "}": "{" };\n  const stack: string[] = [];\n  for (let i = 0; i < s.length; i++) {\n    const ch = s[i];\n    if (ch in pair) {\n      if (stack.pop() !== pair[ch]) return false;\n    } else stack.push(ch);\n  }\n  return stack.length === 0;\n}',
  lesson: 'Стек пам\'ятає, хто відкрився останнім: кожне закриття перевіряєш лише з верхівкою.',
  scene: { type: 'array', skin: 'letter', mode: 'scan' },
};

/* 3. Min Stack у вигляді журналу */
function minRef(ops: string[]) { const st: number[] = [], mins: number[] = [], out: number[] = []; for (const o of ops) { if (o === '-') { st.pop(); mins.pop(); } else if (o === '?') out.push(mins[mins.length - 1]); else { const v = Number(o); st.push(v); mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v); } } return out; }
const minStack: Level = {
  id: 'mitten.min', world: 4, title: 'Найменший у рукавичці', topic: 'стек мінімумів',
  leetcode: lc(155, 'Min Stack'),
  brief: '<b>Найменший у рукавичці.</b> Звірі залазять і вилазять, а Ведмідь раз у раз питає, хто зараз найменший.',
  statement: [
    'Звірі мають різний зріст. <code>ops</code> — журнал подій: число означає «заліз звір такого зросту», <code>"-"</code> — «виліз той, що зверху», а <code>"?"</code> — питання «який найменший зріст зараз усередині?».',
    'Поверни відповіді на всі питання по черзі. Для <code>["5", "3", "?", "7", "?", "-", "-", "?"]</code> вийде <code>[3, 3, 5]</code>. Про порожню рукавичку ніхто не питає і з неї ніхто не вилазить.',
    'Перебирати всю рукавичку на кожне питання довго. Хитріше разом із кожним звіром запам\'ятати, який був найменший на той момент. Коли верхній вилазить, найменший серед решти вже записаний під ним.',
  ],
  tool: {
    name: 'другий стек — для мінімумів',
    text: [
      'Поруч зі стеком звірів тримай стек <code>mins</code>: на кожному рівні — найменший серед усіх, хто нижче або на цьому рівні.',
      'Коли звір залазить, у <code>mins</code> кладеш менше з двох: його зріст або попередній мінімум. Коли вилазить — знімаєш з обох стеків. Відповідь на питання — верхівка <code>mins</code>.',
    ],
    code: '// звірі:  [5, 3, 7]\n// mins:   [5, 3, 3]   ← на кожному рівні найменший нижче\n// виліз 7 → mins [5, 3]: найменший досі 3',
  },
  talk: [
    { who: 'mitten', text: 'Ведмідь хоче знати, хто тут найменший. Каже, щоб знати, на кого не сідати.' },
    { who: 'fox', text: 'Якщо щоразу перебирати всіх, Ведмідь засне. Пам\'ятаймо найменшого на кожному поверсі.' },
  ],
  quip: { who: 'mitten', text: 'Ведмідь задоволений і нікого не розчавив. День удався.' },
  entry: 'minAnswers', observe: ['ops'],
  starter: starter('minAnswers', [['ops', 'string[]']], 'number[]', ['Найменший у рукавичці', 'ops[i] — число (заліз), "-" (виліз верхній) або "?" (найменший зараз).', 'Поверни відповіді на всі "?".'], '  const stack = [];\n  const mins = [];\n  const out = [];\n  // Слово ладу пиши тут\n\n  return out;\n'),
  examples: [one(['5', '3', '?', '7', '?', '-', '-', '?'])],
  hidden: [one(['4', '?']), one(['2', '2', '-', '?']), one(['9', '8', '7', '?', '-', '?', '-', '?']), one(['1', '5', '?', '0', '?', '-', '?', '-', '?'])],
  reference: minRef,
  hints: ['Коли звір вилазить, як дізнатися найменшого серед решти, нікого не перебираючи?', 'mins тримає найменшого на кожному рівні: push(min(x, верхівка mins)); "-" — pop з обох; "?" — верхівка mins.', 'if (op === "?") out.push(mins[mins.length - 1]); else if (op === "-") { stack.pop(); mins.pop(); } else { const v = Number(op); stack.push(v); mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v); }'],
  solution: 'function minAnswers(ops: string[]): number[] {\n  const stack: number[] = [];\n  const mins: number[] = [];\n  const out: number[] = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i];\n    if (op === "?") out.push(mins[mins.length - 1]);\n    else if (op === "-") { stack.pop(); mins.pop(); }\n    else {\n      const v = Number(op);\n      stack.push(v);\n      mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v);\n    }\n  }\n  return out;\n}',
  lesson: 'Що можна порахувати заздалегідь для кожного рівня стеку, те не доведеться перебирати потім.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Evaluate Reverse Polish Notation */
function rpnRef(tokens: string[]) { const st: number[] = []; for (const t of tokens) { if ('+-*/'.includes(t) && t.length === 1) { const b = st.pop()!, a = st.pop()!; st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : Math.trunc(a / b)); } else st.push(Number(t)); } return st[0]; }
const rpn: Level = {
  id: 'mitten.rpn', world: 4, title: 'Рахунок Пана Коцького', topic: 'стек для обчислень',
  leetcode: lc(150, 'Evaluate Reverse Polish Notation'),
  brief: '<b>Рахунок Пана Коцького.</b> Кіт диктує вираз навпаки: спершу числа, потім дія. Порахуй.',
  statement: [
    'Пан Коцький диктує рахунок у польському записі: <code>["2", "1", "+", "3", "*"]</code> означає <code>(2 + 1) * 3 = 9</code>. Спершу два числа, потім дія над ними, і дужки не потрібні.',
    'Поверни результат. Дії: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>. Ділення ціле: дробову частину відкидай у бік нуля, тож 7 / 2 = 3, а −7 / 2 = −3. Як це записати, показано в інструменті.',
    'Коли приходить дія, вона бере два <b>останні</b> числа й кладе на їхнє місце результат. Звучить як стек: числа кладеш, дія знімає два верхні.',
  ],
  tool: {
    name: 'стек як чернетка',
    text: [
      'Числа кладеш у стек. Коли приходить дія, знімаєш два верхні: спершу <code>b</code>, потім <code>a</code> — і кладеш назад <code>a ⊕ b</code>.',
      'Порядок важливий для <code>-</code> і <code>/</code>: друге зняте число стоїть зліва. Наприкінці у стеку лишається одна відповідь.',
    ],
    code: '// ["4", "13", "5", "/", "+"]\n// 4 → [4];  13 → [4, 13];  5 → [4, 13, 5]\n// "/" → b = 5, a = 13 → [4, 2]\n// "+" → [6]',
  },
  talk: [
    { who: 'mitten', text: 'Пан Коцький рахує, скільки місця кому дісталося. Але диктує якось задом наперед.' },
    { who: 'fox', text: 'Це не задом наперед, це по-котячому. Кожна дія бере два останні числа. Стек нам у поміч.' },
  ],
  quip: { who: 'fox', text: 'Рахунок зійшовся. Кіт навіть муркнув — а коти даремно не муркають.' },
  entry: 'evalRpn', observe: ['tokens'],
  starter: starter('evalRpn', [['tokens', 'string[]']], 'number', ['Рахунок Пана Коцького', 'tokens — числа й дії + - * / у польському записі. Поверни результат.', 'Ділення ціле: Math.trunc(a / b).'], '  const stack = [];\n  // Слово ладу пиши тут\n\n  return 0;\n'),
  examples: [one(['2', '1', '+', '3', '*']), one(['4', '13', '5', '/', '+'])],
  hidden: [one(['7']), one(['3', '4', '-']), one(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']), one(['-7', '2', '/']), one(['5', '1', '2', '+', '4', '*', '+', '3', '-'])],
  reference: rpnRef,
  hints: ['Що робити з числом, а що — з дією?', 'Число — у стек. Дія — зняти b, потім a, покласти результат. Наприкінці відповідь — єдиний елемент стеку.', 'if ("+-*/".includes(t) && t.length === 1) { const b = stack.pop(), a = stack.pop(); stack.push(обчисли a t b); } else stack.push(Number(t));'],
  solution: 'function evalRpn(tokens: string[]): number {\n  const stack: number[] = [];\n  for (let i = 0; i < tokens.length; i++) {\n    const t = tokens[i];\n    if (t === "+" || t === "-" || t === "*" || t === "/") {\n      const b = stack.pop()!, a = stack.pop()!;\n      if (t === "+") stack.push(a + b);\n      else if (t === "-") stack.push(a - b);\n      else if (t === "*") stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else stack.push(Number(t));\n  }\n  return stack[0];\n}',
  lesson: 'Стек — чернетка для обчислень: дія завжди бере те, що поклали останнім.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 5. Daily Temperatures */
function tempsRef(t: number[]) { const ans = new Array(t.length).fill(0), st: number[] = []; for (let i = 0; i < t.length; i++) { while (st.length && t[i] > t[st[st.length - 1]]) { const j = st.pop()!; ans[j] = i - j; } st.push(i); } return ans; }
const temps: Level = {
  id: 'mitten.temps', world: 4, final: true, title: 'Коли потеплішає', topic: 'монотонний стек',
  leetcode: lc(739, 'Daily Temperatures'),
  brief: '<b>Коли потеплішає.</b> Для кожного дня дізнайся, скільки чекати до теплішого, щоб звірі могли покинути рукавичку.',
  statement: [
    'Зима. Звірі сидять у рукавичці й чекають тепла. <code>temperatures[i]</code> — температура дня <code>i</code>.',
    'Поверни масив, де на місці <code>i</code> стоїть, через скільки днів буде <b>тепліше</b>, ніж у день <code>i</code>. Якщо тепліше вже не буде — <code>0</code>. Для <code>[73, 74, 75, 71, 69, 72, 76, 73]</code> вийде <code>[1, 1, 4, 2, 1, 1, 0, 0]</code>.',
    'Днів буває до 10 000. Вовк для кожного дня дивиться вперед, поки не знайде теплий, а зима буває довгою. Хитріше тримати в стеку дні, які ще чекають тепла: щойно прийшов теплий день, він «відповідає» всім холоднішим зверху стеку.',
  ],
  tool: {
    name: 'монотонний стек',
    text: [
      'Тримай у стеку <b>номери днів, які ще чекають</b> тепла. Температури в стеку йдуть униз: кожен наступний день у стеку не тепліший за попередній.',
      'Коли приходить теплий день, він «відповідає» всім холоднішим на верхівці: знімаєш їх і записуєш, скільки вони чекали. Кожен день кладеться і знімається лише раз.',
    ],
    code: '// t = [73, 74, 75, 71, 69, 72]\n// день 3 (71), день 4 (69) чекають у стеку\n// день 5 (72): 72 > 69 → день 4 чекав 1\n//              72 > 71 → день 3 чекав 2',
  },
  talk: [
    { who: 'mitten', text: 'Коли ж нарешті потеплішає? Ми тут уже всі одне одному на голові сидимо!' },
    { who: 'wolf', text: 'А я пхатиму все підряд і для кожного дня дивитимусь у майбутнє, доки не знайду тепло! Ой… щось тріщить…' },
    { who: 'fox', text: 'То рукавичка тріщить від тебе. Енею, тримаймо в стеку дні, що ще чекають. Теплий день сам їх розбудить.' },
  ],
  quip: { who: 'mitten', text: 'Тепло прийшло! Вилазимо по одному — хто заліз останнім, той перший. Мишка, ти остання.' },
  entry: 'dailyTemperatures', observe: ['temperatures'],
  starter: starter('dailyTemperatures', [['temperatures', 'number[]']], 'number[]', ['Коли потеплішає', 'Для кожного дня — через скільки днів буде тепліше (або 0).'], '  const answer = new Array(temperatures.length).fill(0);\n  const stack = [];\n  // Слово ладу пиши тут\n\n  return answer;\n'),
  examples: [one([73, 74, 75, 71, 69, 72, 76, 73])],
  hidden: [one([30, 40, 50, 60]), one([30, 60, 90]), one([90, 80, 70]), one([50]), one([55, 38, 53, 81, 61, 93, 97, 32, 43, 78])],
  big: {
    n: 10000,
    // довга рівна зима з холодними просвітами й одним теплим днем наприкінці: Вовкові доводиться дивитися аж до кінця
    make: (n) => { const r = rng(739); const a = Array.from({ length: n }, () => (r() < 0.2 ? 30 + Math.floor(r() * 30) : 70)); a[n - 1] = 90; return [a]; },
    readBudget: (n) => 10 * n,
  },
  reference: tempsRef,
  wolf: { reads: (n) => Math.round((n * n) / 2), code: 'function dailyTemperatures(temperatures) {\n  const answer = new Array(temperatures.length).fill(0);\n  for (let i = 0; i < temperatures.length; i++)\n    for (let j = i + 1; j < temperatures.length; j++)\n      if (temperatures[j] > temperatures[i]) { answer[i] = j - i; break; }\n  return answer;\n}' },
  hints: ['Яким дням може «відповісти» сьогоднішній теплий день?', 'У стеку — номери днів без відповіді. Поки сьогодні тепліше, ніж день на верхівці, знімай його й записуй різницю номерів. Потім поклади сьогоднішній.', 'for (i) { while (stack.length && t[i] > t[stack[stack.length - 1]]) { const j = stack.pop(); answer[j] = i - j; } stack.push(i); }'],
  solution: 'function dailyTemperatures(temperatures: number[]): number[] {\n  const answer: number[] = new Array(temperatures.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    const today = temperatures[i];\n    while (stack.length && today > temperatures[stack[stack.length - 1]]) {\n      const j = stack.pop()!;\n      answer[j] = i - j;\n    }\n    stack.push(i);\n  }\n  return answer;\n}',
  lesson: 'Монотонний стек тримає тих, хто ще чекає відповіді: кожен новий елемент відповідає всім слабшим на верхівці, і кожен день проходить через стек лише раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const mitten: World = {
  n: 4, name: 'Рукавичка', song: 'Пісня II · Гостини', topic: 'Stack', fox: '#eef2f5',
  host: { who: 'Мешканці рукавички', line: 'Хто заліз останнім, той і вилазить першим. Інакше рукавичка лусне!' },
  motif: 'tower', trick: 'Вежа: стек',
  levels: [order, parens, minStack, rpn, temps],
};
