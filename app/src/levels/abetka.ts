/*
 * «Абетка» — необов'язковий блок для дорослих, які вчать мову програмування з нуля.
 * Окрема доріжка для кожної мови (Python, JavaScript, TypeScript); розділи — українські казки.
 * Урок описано один раз, а з нього збираються три вправи — кожна своєю мовою: свій синтаксис,
 * свій стартовий код і рішення, свій очікуваний вивід (True чи true).
 */
import type { Level, World } from '../engine/level.ts';
import type { CallResult, Lang, TestCase } from '../engine/types.ts';
import { LEVELS_EN, type LevelEn } from './en.ts';
import { L } from '../i18n.ts';

/** Що відрізняє мови в текстах уроків. */
export interface Cx {
  lang: Lang;
  /** Назва мови. */
  name: string;
  /** Як вивести рядок: print("…") чи console.log("…"). */
  say: (s: string) => string;
  /** Python, JavaScript чи TypeScript. */
  py: boolean;
  ts: boolean;
}
const CX: Record<Lang, Cx> = {
  py: { lang: 'py', name: 'Python', say: (s) => `print(${s})`, py: true, ts: false },
  js: { lang: 'js', name: 'JavaScript', say: (s) => `console.log(${s})`, py: false, ts: false },
  ts: { lang: 'ts', name: 'TypeScript', say: (s) => `console.log(${s})`, py: false, ts: true },
};
const LANGS: Lang[] = ['py', 'js', 'ts'];

type Two = [string, string];
type Per<T> = (c: Cx) => T;

/** Один урок для трьох мов. Тексти — [укр, англ]; out — що програма має вивести для цих аргументів. */
interface Lesson {
  key: string;
  title: Two;
  topic: Two;
  brief: Per<Two>;
  statement: Per<[string[], string[]]>;
  tool: { name: Per<Two>; text: Per<[string[], string[]]>; code: Per<string> };
  entry: string;
  /** Параметри з типами TypeScript: [ім'я, тип]. */
  params: [string, string][];
  ret: string;
  /** Тіло стартового коду кожною мовою (без рядка оголошення функції). */
  body: Per<string>;
  /** Повне рішення кожною мовою. */
  solution: Per<string>;
  tests: unknown[][];
  out: (c: Cx, ...args: never[]) => string[];
  hints: Per<[[string, string, string], [string, string, string]]>;
  lesson: Per<Two>;
  talk?: Per<[string, string][]>;
  quip?: Per<Two>;
}

/** Порівняти те, що програма вивела, з очікуваним — рядок за рядком. */
function printedCheck(tc: TestCase, r: CallResult): true | string {
  const want = tc.expected as string[], got = r.logs;
  if (JSON.stringify(got) === JSON.stringify(want)) return true;
  const i = want.findIndex((w, k) => got[k] !== w);
  if (got.length === 0) return L('програма нічого не вивела', 'the program printed nothing');
  if (i < 0) return L(`зайві рядки: ${JSON.stringify(got.slice(want.length))}`, `extra lines: ${JSON.stringify(got.slice(want.length))}`);
  return L(`рядок ${i + 1}: очікували ${JSON.stringify(want[i])}, а вивело ${got[i] === undefined ? 'нічого' : JSON.stringify(got[i])}`, `line ${i + 1}: expected ${JSON.stringify(want[i])}, but printed ${got[i] === undefined ? 'nothing' : JSON.stringify(got[i])}`);
}

const tsParams = (p: [string, string][]) => p.map(([n, t]) => `${n}: ${t}`).join(', ');
const jsParams = (p: [string, string][]) => p.map(([n]) => n).join(', ');
const pyParams = (p: [string, string][]) => p.map(([n]) => n).join(', ');
const comment = (c: Cx, lines: string[]) => (c.py ? lines.map((l) => `# ${l}`).join('\n') : ['/**', ...lines.map((l) => ` * ${l}`), ' */'].join('\n'));
function header(c: Cx, s: Lesson) {
  if (c.py) return `def ${s.entry}(${pyParams(s.params)}):`;
  if (c.ts) return `function ${s.entry}(${tsParams(s.params)}): ${s.ret} {`;
  return `function ${s.entry}(${jsParams(s.params)}) {`;
}
function starterFor(c: Cx, s: Lesson, doc: string[]) {
  return `${comment(c, doc)}\n${header(c, s)}\n${s.body(c)}${c.py ? '' : '}\n'}`;
}

/** Розділ-казка: уроки, зібрані для кожної мови. */
interface Chapter { key: string; name: Two; topic: Two; fox: string; host: Two; lessons: Lesson[] }

const HERE_UK = 'Слово ладу пиши тут', HERE_EN = 'Your code here';

function build(chapters: Chapter[]): Record<Lang, World[]> {
  const out = { py: [], js: [], ts: [] } as Record<Lang, World[]>;
  for (const lang of LANGS) {
    const c = CX[lang];
    chapters.forEach((ch, n) => {
      const levels: Level[] = ch.lessons.map((s, i) => {
        const id = `abc.${lang}.${ch.key}.${s.key}`;
        const st = s.statement(c), tl = s.tool, hints = s.hints(c), brief = s.brief(c), lesson = s.lesson(c);
        const talk = s.talk?.(c), quip = s.quip?.(c);
        const docUk = [brief[0].replace(/<[^>]+>/g, '')];
        const docEn = [brief[1].replace(/<[^>]+>/g, '')];
        const code = starterFor(c, s, docUk).replace('{{here}}', HERE_UK);
        const tests: TestCase[] = s.tests.map((a) => ({ args: a, label: a.length ? a.map((x) => JSON.stringify(x)).join(', ') : L('без аргументів', 'no arguments') }));
        const en: LevelEn = {
          title: s.title[1], topic: s.topic[1], brief: brief[1], statement: st[1], hints: hints[1], lesson: lesson[1],
          doc: docEn, tool: { name: tl.name(c)[1], text: tl.text(c)[1], code: tl.code(c) },
          talk: talk?.map((t) => t[1]), quip: quip?.[1],
        };
        LEVELS_EN[id] = en;
        // англійський стартовий код: той самий, лише коментар і «пиши тут» англійською
        EN_STARTER[id] = starterFor(c, s, docEn).replace('{{here}}', HERE_EN);
        return {
          id, world: n, track: lang, title: s.title[0], topic: s.topic[0], final: i === ch.lessons.length - 1,
          brief: brief[0], statement: st[0],
          tool: { name: tl.name(c)[0], text: tl.text(c)[0], code: tl.code(c) },
          // у «Абетці» вчить Сивілла, а вчиться Еней: Микита ще в лісі Франка й про Трою не знає
          talk: talk?.map((t, k) => ({ who: k % 2 ? 'enei' : 'sibyl', text: t[0] })),
          quip: quip && { who: 'sibyl', text: quip[0] },
          entry: s.entry, observe: s.params.map(() => null),
          starter: { ts: lang === 'ts' ? code : '', js: lang === 'js' ? code : '', py: lang === 'py' ? code : undefined },
          examples: tests.slice(0, 1), hidden: tests.slice(1),
          reference: (...a: never[]) => s.out(c, ...a),
          check: printedCheck,
          hints: hints[0], solution: s.solution(c), lesson: lesson[0],
          scene: { type: 'scroll' },
        } satisfies Level;
      });
      out[lang].push({
        n, track: lang, name: ch.name[0], song: `Абетка · ${c.name}`, topic: ch.topic[0], fox: ch.fox,
        host: { who: 'Сивілла', line: ch.host[0] }, levels,
      });
      CHAPTERS_EN[`${lang}.${n}`] = { name: ch.name[1], topic: ch.topic[1], host: ch.host[1] };
    });
  }
  return out;
}

/** Англійський стартовий код уроків «Абетки» (text.ts бере звідси). */
export const EN_STARTER: Record<string, string> = {};
/** Англійські назви розділів. */
export const CHAPTERS_EN: Record<string, { name: string; topic: string; host: string }> = {};

/* ============================== Розділ 1. Колобок — перші слова ============================== */

const SONG = 'Я Колобок, Колобок!';
const SONG_EN = 'I am the Bun, the Bun!';
const kolobok: Chapter = {
  key: 'kolobok', name: ['Колобок', 'The Bun'], topic: ['вивід: перші слова', 'output: the first words'], fox: '#e2702b',
  host: ['Колобок котиться лісом і співає. Навчімо програму співати разом із ним.', 'The Bun rolls through the forest singing. Let’s teach the program to sing along.'],
  lessons: [
    {
      key: 'song', title: ['Пісенька Колобка', 'The Bun’s song'], topic: ['вивести рядок', 'printing a line'],
      brief: (c) => [`<b>Пісенька Колобка.</b> Виведи рядок <code>${SONG}</code> — рівно так, з комою й знаком оклику.`, `<b>The Bun’s song.</b> Print the line <code>${SONG}</code> — exactly so, with the comma and the exclamation mark.`],
      statement: (c) => [[
        'Програма спілкується зі світом через <b>вивід</b>: усе, що вона виводить, з\'являється на сувої праворуч.',
        `У ${c.name} вивести рядок можна так: <code>${c.say('"текст"')}</code>. Текст береться в лапки — так програма знає, де він починається й закінчується.`,
        `Напиши всередині функції один рядок, що виведе <code>${SONG}</code>. Регістр, пробіли й розділові знаки мають збігатися до символу.`,
      ], [
        'A program talks to the world through <b>output</b>: whatever it prints appears on the scroll to the right.',
        `In ${c.name} you print a line like this: <code>${c.say('"text"')}</code>. The text goes in quotes — that’s how the program knows where it starts and ends.`,
        `Write one line inside the function that prints <code>${SONG}</code>. Case, spaces and punctuation must match character for character.`,
      ]],
      tool: {
        name: (c) => [c.py ? 'print' : 'console.log', c.py ? 'print' : 'console.log'],
        text: (c) => [[
          `<code>${c.say('"Привіт"')}</code> виводить слово Привіт. Лапки можна брати подвійні <code>"…"</code> або одинарні <code>'…'</code>.`,
          c.py ? 'У Python відступ на початку рядка важливий: усе, що всередині функції, зсунуте на 4 пробіли.' : 'Кожна команда закінчується крапкою з комою <code>;</code> — як речення крапкою.',
        ], [
          `<code>${c.say('"Hello"')}</code> prints the word Hello. Quotes can be double <code>"…"</code> or single <code>'…'</code>.`,
          c.py ? 'In Python the indent at the start of a line matters: everything inside the function is shifted by 4 spaces.' : 'Every command ends with a semicolon <code>;</code> — like a sentence ends with a full stop.',
        ]],
        code: (c) => (c.py ? 'print("Привіт")   # виведе: Привіт' : 'console.log("Привіт");   // виведе: Привіт'),
      },
      entry: 'sing', params: [], ret: 'void',
      body: (c) => (c.py ? '    # {{here}}\n    pass\n' : '  // {{here}}\n'),
      solution: (c) => (c.py ? `def sing():\n    print("${SONG}")\n` : `function sing()${c.ts ? ': void' : ''} {\n  console.log("${SONG}");\n}\n`),
      tests: [[]],
      out: () => [SONG],
      hints: (c) => [
        ['Яка команда виводить рядок?', `${c.say('"…"')}, а всередині лапок — слова пісеньки.`, c.say(`"${SONG}"`)],
        ['Which command prints a line?', `${c.say('"…"')}, with the words of the song inside the quotes.`, c.say(`"${SONG}"`)],
      ],
      lesson: () => ['Вивід — голос програми: що виведеш, те й побачать.', 'Output is the program’s voice: whatever you print is what people see.'],
      talk: () => [
        ['Он котиться Колобок і співає. Хочеш, щоб і твоя програма заспівала?', 'Look, the Bun is rolling along and singing. Want your program to sing too?'],
        ['А програма вміє співати?', 'Can a program sing?'],
        ['Вона вміє виводити рядки. Для початку цього досить.', 'It can print lines. That’s enough for a start.'],
      ],
      quip: () => ['Перший рядок виведено! Колобок аж підстрибнув від радості.', 'The first line is printed! The Bun even bounced with joy.'],
    },
    {
      key: 'verse', title: ['Цілий куплет', 'A whole verse'], topic: ['кілька рядків по черзі', 'several lines in order'],
      brief: () => ['<b>Цілий куплет.</b> Виведи три рядки пісеньки по черзі, кожен окремою командою.', '<b>A whole verse.</b> Print three lines of the song in order, each with its own command.'],
      statement: (c) => [[
        'Колобок співає не один рядок, а цілий куплет. Кожна команда виводу друкує свій рядок, а виконуються вони <b>зверху вниз</b>.',
        `Виведи по черзі:<br><code>Я Колобок, Колобок!</code><br><code>Я по засіку метений,</code><br><code>Я від баби втік!</code>`,
        `Тобто три команди <code>${c.say('…')}</code> одна під одною.`,
      ], [
        'The Bun sings not one line but a whole verse. Each print command prints its own line, and they run <b>top to bottom</b>.',
        `Print in order:<br><code>Я Колобок, Колобок!</code><br><code>Я по засіку метений,</code><br><code>Я від баби втік!</code>`,
        `That is, three <code>${c.say('…')}</code> commands one below another.`,
      ]],
      tool: {
        name: () => ['кілька команд', 'several commands'],
        text: () => [['Команди виконуються по черзі, від першого рядка до останнього. Поміняєш рядки місцями — поміняється й вивід.'], ['Commands run in order, from the first line to the last. Swap the lines — and the output swaps too.']],
        code: (c) => (c.py ? 'print("Раз")\nprint("Два")   # спершу Раз, потім Два' : 'console.log("Раз");\nconsole.log("Два");   // спершу Раз, потім Два'),
      },
      entry: 'verse', params: [], ret: 'void',
      body: (c) => (c.py ? '    # {{here}}\n    pass\n' : '  // {{here}}\n'),
      solution: (c) => (c.py
        ? 'def verse():\n    print("Я Колобок, Колобок!")\n    print("Я по засіку метений,")\n    print("Я від баби втік!")\n'
        : `function verse()${c.ts ? ': void' : ''} {\n  console.log("Я Колобок, Колобок!");\n  console.log("Я по засіку метений,");\n  console.log("Я від баби втік!");\n}\n`),
      tests: [[]],
      out: () => ['Я Колобок, Колобок!', 'Я по засіку метений,', 'Я від баби втік!'],
      hints: (c) => [
        ['Скільки рядків — стільки й команд.', `Три рядки ${c.say('"…"')}, у тому самому порядку, що в умові.`, `${c.say('"Я Колобок, Колобок!"')}\n${c.say('"Я по засіку метений,"')}\n${c.say('"Я від баби втік!"')}`],
        ['As many lines as commands.', `Three ${c.say('"…"')} lines, in the same order as in the task.`, `${c.say('"Я Колобок, Колобок!"')}\n${c.say('"Я по засіку метений,"')}\n${c.say('"Я від баби втік!"')}`],
      ],
      lesson: () => ['Програма — це послідовність команд: вони виконуються по черзі, зверху вниз.', 'A program is a sequence of commands: they run one after another, top to bottom.'],
      quip: () => ['Куплет готовий. Лишилось навчити Колобка не попадатися лисиці. Але то вже інша казка.', 'The verse is ready. Now to teach the Bun not to get caught by the fox. But that’s another tale.'],
    },
    {
      key: 'numbers', title: ['Текст і числа', 'Text and numbers'], topic: ['рядок проти числа', 'a string versus a number'],
      brief: () => ['<b>Текст і числа.</b> Виведи, скільки разів Колобок утік: спершу вираз як текст, потім його результат.', '<b>Text and numbers.</b> Print how many times the Bun escaped: first the expression as text, then its result.'],
      statement: (c) => [[
        'Колобок утік від Зайця, Вовка й Ведмедя — це 3 рази. А ще від діда й баби — ще 2.',
        `Виведи два рядки: спершу текст <code>3 + 2</code> (у лапках — це просто символи), а потім саме <b>обчислення</b> <code>3 + 2</code> без лапок — програма порахує й виведе <code>5</code>.`,
        'Різниця між «текстом» і «числом» — одна з перших пасток у програмуванні.',
      ], [
        'The Bun escaped from the Hare, the Wolf and the Bear — that’s 3 times. And from grandpa and grandma — 2 more.',
        `Print two lines: first the text <code>3 + 2</code> (in quotes it’s just characters), then the <b>calculation</b> <code>3 + 2</code> itself without quotes — the program will compute it and print <code>5</code>.`,
        'The difference between “text” and “a number” is one of the first traps in programming.',
      ]],
      tool: {
        name: () => ['рядок і число', 'a string and a number'],
        text: (c) => [[
          `<code>${c.say('"3 + 2"')}</code> виводить символи 3 + 2, бо в лапках — текст (рядок).`,
          `<code>${c.say('3 + 2')}</code> без лапок спершу рахує й виводить 5. Так само працюють <code>-</code>, <code>*</code> (множення) і <code>/</code> (ділення).`,
        ], [
          `<code>${c.say('"3 + 2"')}</code> prints the characters 3 + 2, because in quotes it’s text (a string).`,
          `<code>${c.say('3 + 2')}</code> without quotes computes first and prints 5. <code>-</code>, <code>*</code> (multiply) and <code>/</code> (divide) work the same way.`,
        ]],
        code: (c) => (c.py ? 'print("10 * 2")   # 10 * 2\nprint(10 * 2)     # 20' : 'console.log("10 * 2");   // 10 * 2\nconsole.log(10 * 2);     // 20'),
      },
      entry: 'escapes', params: [], ret: 'void',
      body: (c) => (c.py ? '    # {{here}}\n    pass\n' : '  // {{here}}\n'),
      solution: (c) => (c.py ? 'def escapes():\n    print("3 + 2")\n    print(3 + 2)\n' : `function escapes()${c.ts ? ': void' : ''} {\n  console.log("3 + 2");\n  console.log(3 + 2);\n}\n`),
      tests: [[]],
      out: () => ['3 + 2', '5'],
      hints: (c) => [
        ['Що зміниться, якщо прибрати лапки?', 'Перший рядок — у лапках, другий — без них.', `${c.say('"3 + 2"')}\n${c.say('3 + 2')}`],
        ['What changes if you remove the quotes?', 'The first line — in quotes, the second — without.', `${c.say('"3 + 2"')}\n${c.say('3 + 2')}`],
      ],
      lesson: () => ['У лапках — текст, як є; без лапок — вираз, який програма спершу обчислює.', 'In quotes — text as it is; without quotes — an expression the program computes first.'],
      quip: () => ['П\'ять утеч! Рахувати Колобок не вмів, а програма вміє.', 'Five escapes! The Bun couldn’t count, but the program can.'],
    },
    {
      key: 'greet', title: ['Привіт кожному', 'Hello to everyone'], topic: ['параметр і склеювання рядків', 'a parameter and joining strings'],
      brief: () => ['<b>Привіт кожному.</b> Колобок вітається з тим, кого зустрів. Ім\'я приходить у змінній <code>name</code> і щоразу інше — виведи <code>Привіт, </code> + <code>name</code> + <code>!</code>.', '<b>Hello to everyone.</b> The Bun greets whoever he meets. The name arrives in the variable <code>name</code> and is different each time — print <code>Привіт, </code> + <code>name</code> + <code>!</code>.'],
      statement: (c) => [[
        'Колобок зустрічає по черзі Зайця, Вовка, Ведмедя й Лисичку-сестричку — і кожного вітає.',
        'Ім\'я того, кого зустріли, приходить у функцію в змінній <code>name</code>. Наперед воно невідоме: «Суд богів» викличе функцію чотири рази — з <code>"Заєць"</code>, <code>"Вовк"</code>, <code>"Ведмідь"</code> і <code>"Лисичка-сестричка"</code>.',
        'Виведи <code>Привіт, </code>, потім значення <code>name</code>, потім <code>!</code>. Для <code>"Заєць"</code> вийде <code>Привіт, Заєць!</code>, для <code>"Вовк"</code> — <code>Привіт, Вовк!</code>.',
        `Тому <code>${c.say('"Привіт, Заєць!"')}</code> не підійде: «Запустити» пройде, а суд — ні. Рядки треба <b>склеїти</b> зі змінною <code>name</code>.`,
      ], [
        'The Bun meets the Hare, the Wolf, the Bear and Sister Fox in turn — and greets each one.',
        'The name of whoever was met arrives in the function in the variable <code>name</code>. You don’t know it in advance: “Judgement” calls the function four times — with <code>"Заєць"</code>, <code>"Вовк"</code>, <code>"Ведмідь"</code> and <code>"Лисичка-сестричка"</code>.',
        'Print <code>Привіт, </code>, then the value of <code>name</code>, then <code>!</code>. For <code>"Заєць"</code> that’s <code>Привіт, Заєць!</code>, for <code>"Вовк"</code> — <code>Привіт, Вовк!</code>.',
        `So <code>${c.say('"Привіт, Заєць!"')}</code> won’t do: “Run” passes, but Judgement doesn’t. The strings have to be <b>joined</b> with the variable <code>name</code>.`,
      ]],
      tool: {
        name: () => ['склеювання рядків', 'joining strings'],
        text: () => [[
          'Знак <code>+</code> між рядками склеює їх в один: <code>"Добрий " + "день"</code> — це <code>"Добрий день"</code>.',
          '<code>name</code> — змінна: у ній лежить значення, яке функція отримала. Її пишуть без лапок, інакше вийде саме слово name.',
        ], [
          'A <code>+</code> between strings joins them into one: <code>"Добрий " + "день"</code> is <code>"Добрий день"</code>.',
          '<code>name</code> is a variable: it holds the value the function received. Write it without quotes, otherwise you get the word name itself.',
        ]],
        code: (c) => (c.py ? 'city = "Київ"\nprint("Я з міста " + city)   # Я з міста Київ' : 'const city = "Київ";\nconsole.log("Я з міста " + city);   // Я з міста Київ'),
      },
      entry: 'greet', params: [['name', 'string']], ret: 'void',
      body: (c) => (c.py ? '    # {{here}}\n    pass\n' : '  // {{here}}\n'),
      solution: (c) => (c.py ? 'def greet(name):\n    print("Привіт, " + name + "!")\n' : `function greet(name${c.ts ? ': string' : ''})${c.ts ? ': void' : ''} {\n  console.log("Привіт, " + name + "!");\n}\n`),
      tests: [['Заєць'], ['Вовк'], ['Ведмідь'], ['Лисичка-сестричка']],
      out: (_c, name: string) => [`Привіт, ${name}!`],
      hints: (c) => [
        ['Ім\'я не завжди «Заєць» — воно лежить у змінній name. З яких трьох шматків складається привітання?', '"Привіт, " + name + "!" — пробіл після коми теж частина тексту.', c.say('"Привіт, " + name + "!"')],
        ['The name isn’t always “Заєць” — it’s in the variable name. Which three pieces make up the greeting?', '"Привіт, " + name + "!" — the space after the comma is part of the text too.', c.say('"Привіт, " + name + "!"')],
      ],
      lesson: () => ['Змінна тримає значення, а + склеює рядки: так одна програма вітає будь-кого.', 'A variable holds a value, and + joins strings: that’s how one program greets anyone.'],
      quip: () => ['А Лисиці Колобок краще б не казав «привіт». Але програма ввічлива з усіма.', 'The Bun had better not say “hello” to the Fox. But the program is polite to everyone.'],
    },
  ],
};

export const tracks: Record<Lang, World[]> = build([kolobok]);
export const trackLevels: Level[] = LANGS.flatMap((l) => tracks[l].flatMap((w) => w.levels));

/** Розділи, які ще пишуться: показуємо на мапі «Абетки» як «скоро». */
export const PLANNED: { name: Two; topic: Two }[] = [
  { name: ['Ріпка', 'The Turnip'], topic: ['змінні й числа', 'variables and numbers'] },
  { name: ['Котигорошко', 'Kotyhoroshko'], topic: ['рядки', 'strings'] },
  { name: ['Коза-дереза', 'The Goat Dereza'], topic: ['умови', 'conditions'] },
  { name: ['Солом\'яний бичок', 'The Straw Bull'], topic: ['цикли', 'loops'] },
  { name: ['Пан Коцький', 'Lord Kotsky'], topic: ['списки', 'lists'] },
  { name: ['Лисичка-сестричка', 'Sister Fox'], topic: ['словники й об\'єкти', 'dictionaries and objects'] },
  { name: ['Івасик-Телесик', 'Ivasyk-Telesyk'], topic: ['функції', 'functions'] },
];
