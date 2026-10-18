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
  /** Допоміжна функція над головною (розділ «Івасик-Телесик»): у стартовому коді — заготовка. */
  pre?: Per<string>;
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
  return `${comment(c, doc)}\n${s.pre?.(c) ?? ''}${header(c, s)}\n${s.body(c)}${c.py ? '' : '}\n'}`;
}
/** Повне рішення: допоміжна функція (якщо є), заголовок і тіло головної. */
function full(c: Cx, entry: string, params: [string, string][], ret: string, body: string, pre = ''): string {
  return `${pre}${header(c, { entry, params, ret } as Lesson)}\n${body}${c.py ? '' : '}\n'}`;
}
/** Одне значення на кожну мову: Python, JavaScript і (якщо відрізняється) TypeScript. */
const pick = <T,>(c: Cx, py: T, js: T, ts: T = js): T => (c.py ? py : c.ts ? ts : js);
/** Порожнє тіло: «пиши тут» і нічого більше. */
const EMPTY = (c: Cx) => (c.py ? '    # {{here}}\n    pass\n' : '  // {{here}}\n');

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
        const code = starterFor(c, s, docUk).replaceAll('{{here}}', HERE_UK);
        const tests: TestCase[] = s.tests.map((a) => ({ args: a, label: a.length ? a.map((x) => JSON.stringify(x)).join(', ') : L('без аргументів', 'no arguments') }));
        const en: LevelEn = {
          title: s.title[1], topic: s.topic[1], brief: brief[1], statement: st[1], hints: hints[1], lesson: lesson[1],
          doc: docEn, tool: { name: tl.name(c)[1], text: tl.text(c)[1], code: tl.code(c) },
          talk: talk?.map((t) => t[1]), quip: quip?.[1],
        };
        LEVELS_EN[id] = en;
        // англійський стартовий код: той самий, лише коментар і «пиши тут» англійською
        EN_STARTER[id] = starterFor(c, s, docEn).replaceAll('{{here}}', HERE_EN);
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

/* ============================== Розділ 2. Ріпка — змінні й числа ============================== */

const ripka: Chapter = {
  key: 'ripka', name: ['Ріпка', 'The Turnip'], topic: ['змінні й числа', 'variables and numbers'], fox: '#d9a521',
  host: ['Посадив дід ріпку, а виросла велика-превелика. Сам не витягне. Порахуймо, скільки сили треба.', 'Grandpa planted a turnip, and it grew huge. He can’t pull it out alone. Let’s count how much strength it takes.'],
  lessons: [
    {
      key: 'who', title: ['Хто тягне', 'Who pulls'], topic: ['створити змінну', 'creating a variable'],
      brief: () => ['<b>Хто тягне.</b> Запиши вагу ріпки й ім\'я того, хто тягне, у змінні та виведи два рядки.', '<b>Who pulls.</b> Store the turnip’s weight and the name of who pulls in variables, then print two lines.'],
      statement: (c) => [[
        '<b>Змінна</b> — це коробка з наліпкою. На наліпці ім\'я, а всередині значення: число чи текст. Поклав раз, а далі звертаєшся за іменем.',
        `Створи змінну <code>weight</code> зі значенням <code>120</code> і змінну <code>who</code> з текстом <code>"дід"</code>. ${c.py ? 'У Python змінну створюють так: <code>weight = 120</code>.' : c.ts ? 'У TypeScript змінну створюють так: <code>let weight: number = 120;</code> Після двокрапки — тип: число чи рядок.' : 'У JavaScript змінну створюють так: <code>let weight = 120;</code>'}`,
        'Потім виведи два рядки:<br><code>Ріпка важить 120 кг</code><br><code>Тягне дід</code><br>Числа й імені не пиши вручну, підстав змінні.',
      ], [
        'A <b>variable</b> is a box with a label. The label is its name, and inside is a value: a number or text. Put it in once, then refer to it by name.',
        `Create a variable <code>weight</code> holding <code>120</code> and a variable <code>who</code> holding the text <code>"дід"</code>. ${c.py ? 'In Python you create a variable like this: <code>weight = 120</code>.' : c.ts ? 'In TypeScript you create a variable like this: <code>let weight: number = 120;</code> After the colon comes the type: a number or a string.' : 'In JavaScript you create a variable like this: <code>let weight = 120;</code>'}`,
        'Then print two lines:<br><code>Ріпка важить 120 кг</code><br><code>Тягне дід</code><br>Don’t type the number and the name by hand: use the variables.',
      ]],
      tool: {
        name: () => ['змінна', 'a variable'],
        text: (c) => [[
          `${c.say('"Ріпка важить", weight, "кг"')} виводить частини через пробіл: <code>Ріпка важить 120 кг</code>.`,
          'Ім\'я змінної пишуть без лапок. У лапках було б саме слово, а не те, що лежить у коробці.',
        ], [
          `${c.say('"Ріпка важить", weight, "кг"')} prints the parts separated by spaces: <code>Ріпка важить 120 кг</code>.`,
          'The variable’s name goes without quotes. In quotes you’d get the word itself, not what’s in the box.',
        ]],
        code: (c) => pick(c,
          'weight = 120\nprint("Ріпка важить", weight, "кг")',
          'let weight = 120;\nconsole.log("Ріпка важить", weight, "кг");',
          'let weight: number = 120;\nconsole.log("Ріпка важить", weight, "кг");'),
      },
      entry: 'turnip', params: [], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'turnip', [], 'void', pick(c,
        '    weight = 120\n    who = "дід"\n    print("Ріпка важить", weight, "кг")\n    print("Тягне", who)\n',
        '  let weight = 120;\n  let who = "дід";\n  console.log("Ріпка важить", weight, "кг");\n  console.log("Тягне", who);\n',
        '  let weight: number = 120;\n  let who: string = "дід";\n  console.log("Ріпка важить", weight, "кг");\n  console.log("Тягне", who);\n')),
      tests: [[]],
      out: () => ['Ріпка важить 120 кг', 'Тягне дід'],
      hints: (c) => [
        ['Спершу дві змінні, потім два виводи.', `${pick(c, 'weight = 120 і who = "дід"', 'let weight = 120; і let who = "дід";', 'let weight: number = 120; і let who: string = "дід";')}, а у виводі частини через кому.`, `${c.say('"Ріпка важить", weight, "кг"')}\n${c.say('"Тягне", who')}`],
        ['First two variables, then two prints.', `${pick(c, 'weight = 120 and who = "дід"', 'let weight = 120; and let who = "дід";', 'let weight: number = 120; and let who: string = "дід";')}, and in the print the parts go with commas.`, `${c.say('"Ріпка важить", weight, "кг"')}\n${c.say('"Тягне", who')}`],
      ],
      lesson: () => ['Змінна зберігає значення під іменем, і далі можна звертатися до нього скільки завгодно.', 'A variable keeps a value under a name, and you can refer to it as often as you like.'],
      talk: () => [
        ['Ріпка така велика, що дід сам не впорається. Почнемо з того, що запишемо: скільки вона важить і хто тягне.', 'The turnip is so big that grandpa can’t manage alone. Let’s start by writing down how much it weighs and who pulls.'],
        ['Записати? На папірці?', 'Write it down? On paper?'],
        ['У змінних. Це як скриньки з підписами: поклав, підписав, а потім дістаєш за назвою.', 'In variables. They’re like labelled boxes: put something in, label it, and later take it out by name.'],
      ],
      quip: () => ['Ріпку записано. Тягти будемо в наступному уроці.', 'The turnip is written down. We’ll pull in the next lesson.'],
    },
    {
      key: 'together', title: ['Разом сильніші', 'Stronger together'], topic: ['дії з числами', 'arithmetic'],
      brief: () => ['<b>Разом сильніші.</b> Сила діда й баби приходить у змінних. Виведи, яка в них сила разом.', '<b>Stronger together.</b> Grandpa’s and grandma’s strength arrive in variables. Print their strength together.'],
      statement: (c) => [[
        'Дід тягне-потягне, а витягти не може. Покликав бабу.',
        'Сила діда лежить у змінній <code>grandpa</code>, сила баби у <code>grandma</code>. Це числа, і щоразу інші: суд перевірить кілька пар.',
        'Виведи <code>Разом: </code> і суму двох сил. Наприклад, для <code>5</code> і <code>3</code> вийде <code>Разом: 8</code>.',
      ], [
        'Grandpa pulls and pulls, but can’t get it out. He calls grandma.',
        'Grandpa’s strength is in the variable <code>grandpa</code>, grandma’s in <code>grandma</code>. They’re numbers and change each time: Judgement checks several pairs.',
        'Print <code>Разом: </code> and the sum of the two. For example, for <code>5</code> and <code>3</code> that’s <code>Разом: 8</code>.',
      ]],
      tool: {
        name: () => ['дії з числами', 'arithmetic'],
        text: (c) => [[
          'Числа можна додавати <code>+</code>, віднімати <code>-</code> і множити <code>*</code>, так само як у зошиті.',
          `Обчислення можна писати прямо у виводі: <code>${c.say('"Разом:", 2 + 3')}</code> виведе <code>Разом: 5</code>.`,
        ], [
          'You can add numbers with <code>+</code>, subtract with <code>-</code> and multiply with <code>*</code>, just like in your notebook.',
          `You can calculate right inside the print: <code>${c.say('"Разом:", 2 + 3')}</code> prints <code>Разом: 5</code>.`,
        ]],
        code: (c) => pick(c, 'apples = 4\npears = 6\nprint("Фруктів:", apples + pears)   # Фруктів: 10', 'let apples = 4;\nlet pears = 6;\nconsole.log("Фруктів:", apples + pears);   // Фруктів: 10'),
      },
      entry: 'together', params: [['grandpa', 'number'], ['grandma', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'together', [['grandpa', 'number'], ['grandma', 'number']], 'void', pick(c,
        '    print("Разом:", grandpa + grandma)\n',
        '  console.log("Разом:", grandpa + grandma);\n')),
      tests: [[5, 3], [7, 4], [10, 10], [1, 2]],
      out: (_c, a: number, b: number) => [`Разом: ${a + b}`],
      hints: (c) => [
        ['Які дві змінні треба скласти?', 'grandpa + grandma, а перед ним текст "Разом:" через кому.', c.say('"Разом:", grandpa + grandma')],
        ['Which two variables do you add?', 'grandpa + grandma, with the text "Разом:" before it and a comma between.', c.say('"Разом:", grandpa + grandma')],
      ],
      lesson: () => ['Змінні з числами можна додавати, віднімати й множити, і програма порахує сама.', 'Variables holding numbers can be added, subtracted and multiplied, and the program does the maths.'],
      quip: () => ['Тягнуть-потягнуть… Ріпка ще тримається. Треба більше рук.', 'They pull and pull… the turnip is still holding on. More hands needed.'],
    },
    {
      key: 'mouse', title: ['Ще й мишка', 'And the mouse too'], topic: ['змінити змінну', 'changing a variable'],
      brief: () => ['<b>Ще й мишка.</b> Помічники підходять по черзі. Після кожного додай його силу до змінної й виведи, що вийшло.', '<b>And the mouse too.</b> Helpers come one by one. After each, add their strength to the variable and print the result.'],
      statement: (c) => [[
        'До діда з бабою підходять онука, Жучка, кішка й нарешті мишка. Кожен додає сили.',
        `Почни зі змінної <code>power</code>, у якій лежить <code>strength</code>: сила діда й баби. ${c.py ? '' : 'Створи її через <code>let</code>, бо вона мінятиметься. '}Потім по черзі додай: онука <code>+3</code>, Жучка <code>+2</code>, кішка <code>+1</code>, мишка <code>+1</code>.`,
        'Після кожного помічника виведи рядок. Для <code>strength = 10</code>:<br><code>Онука: 13</code><br><code>Жучка: 15</code><br><code>Кішка: 16</code><br><code>Мишка: 17</code>',
      ], [
        'Granddaughter, Zhuchka the dog, the cat and finally the mouse join grandpa and grandma. Each adds strength.',
        `Start with a variable <code>power</code> holding <code>strength</code>: grandpa’s and grandma’s strength. ${c.py ? '' : 'Create it with <code>let</code>, because it will change. '}Then add in turn: granddaughter <code>+3</code>, Zhuchka <code>+2</code>, the cat <code>+1</code>, the mouse <code>+1</code>.`,
        'After each helper print a line. For <code>strength = 10</code>:<br><code>Онука: 13</code><br><code>Жучка: 15</code><br><code>Кішка: 16</code><br><code>Мишка: 17</code>',
      ]],
      tool: {
        name: () => ['змінна змінюється', 'a variable changes'],
        text: (c) => [[
          '<code>power = power + 3</code> означає: візьми, що лежить у <code>power</code>, додай 3 і поклади назад. Коротше пишуть <code>power += 3</code>.',
          c.py ? 'Знак <code>=</code> тут не «дорівнює», а «поклади в коробку».' : 'Знак <code>=</code> тут не «дорівнює», а «поклади в коробку». Тому змінна має бути <code>let</code>: <code>const</code> міняти не можна.',
        ], [
          '<code>power = power + 3</code> means: take what’s in <code>power</code>, add 3 and put it back. The short form is <code>power += 3</code>.',
          c.py ? 'The <code>=</code> sign here doesn’t mean “equals” but “put into the box”.' : 'The <code>=</code> sign here doesn’t mean “equals” but “put into the box”. That’s why the variable must be <code>let</code>: a <code>const</code> can’t change.',
        ]],
        code: (c) => pick(c, 'coins = 5\ncoins += 2\nprint("Монет:", coins)   # Монет: 7', 'let coins = 5;\ncoins += 2;\nconsole.log("Монет:", coins);   // Монет: 7', 'let coins: number = 5;\ncoins += 2;\nconsole.log("Монет:", coins);   // Монет: 7'),
      },
      entry: 'mouse', params: [['strength', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'mouse', [['strength', 'number']], 'void', pick(c,
        '    power = strength\n    power += 3\n    print("Онука:", power)\n    power += 2\n    print("Жучка:", power)\n    power += 1\n    print("Кішка:", power)\n    power += 1\n    print("Мишка:", power)\n',
        '  let power = strength;\n  power += 3;\n  console.log("Онука:", power);\n  power += 2;\n  console.log("Жучка:", power);\n  power += 1;\n  console.log("Кішка:", power);\n  power += 1;\n  console.log("Мишка:", power);\n',
        '  let power: number = strength;\n  power += 3;\n  console.log("Онука:", power);\n  power += 2;\n  console.log("Жучка:", power);\n  power += 1;\n  console.log("Кішка:", power);\n  power += 1;\n  console.log("Мишка:", power);\n')),
      tests: [[10], [4], [20]],
      out: (_c, s: number) => [`Онука: ${s + 3}`, `Жучка: ${s + 5}`, `Кішка: ${s + 6}`, `Мишка: ${s + 7}`],
      hints: (c) => [
        ['Одна змінна, яку щоразу збільшуєш.', 'Додав, вивів, додав, вивів: чотири рази.', pick(c, 'power = strength\npower += 3\nprint("Онука:", power)', 'let power = strength;\npower += 3;\nconsole.log("Онука:", power);', 'let power: number = strength;\npower += 3;\nconsole.log("Онука:", power);')],
        ['One variable that you increase each time.', 'Add, print, add, print: four times.', pick(c, 'power = strength\npower += 3\nprint("Онука:", power)', 'let power = strength;\npower += 3;\nconsole.log("Онука:", power);', 'let power: number = strength;\npower += 3;\nconsole.log("Онука:", power);')],
      ],
      lesson: () => ['Змінну можна міняти: power += 3 бере старе значення й кладе нове.', 'A variable can change: power += 3 takes the old value and stores the new one.'],
      quip: () => ['Мишка додала лише одиничку, але саме її й бракувало. Ріпку витягли!', 'The mouse added just one, but that was exactly what was missing. The turnip is out!'],
    },
    {
      key: 'hands', title: ['Скільки рук', 'How many hands'], topic: ['множення й порядок дій', 'multiplication and order'],
      brief: () => ['<b>Скільки рук.</b> Порахуй руки людей і лапи звірів, що тягнули ріпку.', '<b>How many hands.</b> Count the hands of the people and the paws of the animals pulling the turnip.'],
      statement: () => [[
        'У кожної людини дві руки, у кожного звіра чотири лапи. Скільки всього тягнуло?',
        'Кількість людей лежить у <code>people</code>, кількість звірів у <code>animals</code>.',
        'Виведи три рядки. Для 3 людей і 3 звірів:<br><code>Рук: 6</code><br><code>Лап: 12</code><br><code>Разом: 18</code>',
      ], [
        'Each person has two hands, each animal four paws. How many pulled in total?',
        'The number of people is in <code>people</code>, the number of animals in <code>animals</code>.',
        'Print three lines. For 3 people and 3 animals:<br><code>Рук: 6</code><br><code>Лап: 12</code><br><code>Разом: 18</code>',
      ]],
      tool: {
        name: () => ['порядок дій', 'order of operations'],
        text: () => [[
          'Множення <code>*</code> виконується раніше за додавання, як у математиці: <code>2 * 3 + 4 * 1</code> — це 6 + 4 = 10.',
          'Можна спершу покласти результати в змінні, а потім скласти їх. Так читати легше.',
        ], [
          'Multiplication <code>*</code> happens before addition, as in maths: <code>2 * 3 + 4 * 1</code> is 6 + 4 = 10.',
          'You can first store the results in variables and then add them. That’s easier to read.',
        ]],
        code: (c) => pick(c, 'legs = 3 * 4\nprint("Ніг у трьох стільців:", legs)   # 12', 'let legs = 3 * 4;\nconsole.log("Ніг у трьох стільців:", legs);   // 12', 'let legs: number = 3 * 4;\nconsole.log("Ніг у трьох стільців:", legs);   // 12'),
      },
      entry: 'hands', params: [['people', 'number'], ['animals', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'hands', [['people', 'number'], ['animals', 'number']], 'void', pick(c,
        '    arms = people * 2\n    paws = animals * 4\n    print("Рук:", arms)\n    print("Лап:", paws)\n    print("Разом:", arms + paws)\n',
        '  const arms = people * 2;\n  const paws = animals * 4;\n  console.log("Рук:", arms);\n  console.log("Лап:", paws);\n  console.log("Разом:", arms + paws);\n',
        '  const arms: number = people * 2;\n  const paws: number = animals * 4;\n  console.log("Рук:", arms);\n  console.log("Лап:", paws);\n  console.log("Разом:", arms + paws);\n')),
      tests: [[3, 3], [1, 0], [2, 5]],
      out: (_c, p: number, a: number) => [`Рук: ${p * 2}`, `Лап: ${a * 4}`, `Разом: ${p * 2 + a * 4}`],
      hints: (c) => [
        ['Людей множ на 2, звірів на 4.', 'Збережи руки й лапи у змінні, а потім виведи їхню суму.', pick(c, 'arms = people * 2\npaws = animals * 4\nprint("Разом:", arms + paws)', 'const arms = people * 2;\nconst paws = animals * 4;\nconsole.log("Разом:", arms + paws);')],
        ['Multiply people by 2 and animals by 4.', 'Store hands and paws in variables, then print their sum.', pick(c, 'arms = people * 2\npaws = animals * 4\nprint("Разом:", arms + paws)', 'const arms = people * 2;\nconst paws = animals * 4;\nconsole.log("Разом:", arms + paws);')],
      ],
      lesson: () => ['Множення виконується раніше за додавання. Проміжні результати зручно тримати у змінних.', 'Multiplication comes before addition. Intermediate results are handy to keep in variables.'],
      quip: () => ['Стільки рук і лап, а ріпка одна. Буде борщ на всіх.', 'So many hands and paws, and just one turnip. There’ll be borscht for everyone.'],
    },
  ],
};

/* ============================== Розділ 3. Котигорошко — рядки ============================== */

const horoshko: Chapter = {
  key: 'horoshko', name: ['Котигорошко', 'Kotyhoroshko'], topic: ['рядки', 'strings'], fox: '#4f9d4a',
  host: ['Котигорошко виріс із горошини й став богатирем. Ім\'я довге, клич гучний. Попрацюймо з текстом.', 'Kotyhoroshko grew from a pea and became a hero. A long name, a loud war cry. Let’s work with text.'],
  lessons: [
    {
      key: 'length', title: ['Довжина імені', 'Name length'], topic: ['скільки символів у рядку', 'how many characters'],
      brief: (c) => [`<b>Довжина імені.</b> Ім'я приходить у змінній <code>name</code>. Виведи, скільки в ньому літер.`, `<b>Name length.</b> The name arrives in the variable <code>name</code>. Print how many letters it has.`],
      statement: (c) => [[
        'Текст у програмі називають <b>рядком</b>: це символи підряд, як намистинки на нитці.',
        `Довжину рядка дає ${c.py ? '<code>len(name)</code>' : '<code>name.length</code>'}. Для <code>"Котигорошко"</code> це <code>11</code>.`,
        'Виведи <code>Літер: </code> і довжину імені. Ім\'я щоразу інше.',
      ], [
        'Text in a program is called a <b>string</b>: characters in a row, like beads on a thread.',
        `${c.py ? '<code>len(name)</code>' : '<code>name.length</code>'} gives the length of a string. For <code>"Котигорошко"</code> it’s <code>11</code>.`,
        'Print <code>Літер: </code> and the name’s length. The name is different each time.',
      ]],
      tool: {
        name: (c) => [c.py ? 'len' : 'length', c.py ? 'len' : 'length'],
        text: (c) => [[
          c.py ? '<code>len("змій")</code> — це 4. Пробіли й розділові знаки теж рахуються.' : '<code>"змій".length</code> — це 4. Пробіли й розділові знаки теж рахуються.',
          'Довжина — звичайне число, тож її можна виводити, додавати, порівнювати.',
        ], [
          c.py ? '<code>len("змій")</code> is 4. Spaces and punctuation count too.' : '<code>"змій".length</code> is 4. Spaces and punctuation count too.',
          'The length is an ordinary number, so you can print, add and compare it.',
        ]],
        code: (c) => pick(c, 'word = "горошина"\nprint(len(word))   # 8', 'const word = "горошина";\nconsole.log(word.length);   // 8'),
      },
      entry: 'letters', params: [['name', 'string']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'letters', [['name', 'string']], 'void', pick(c, '    print("Літер:", len(name))\n', '  console.log("Літер:", name.length);\n')),
      tests: [['Котигорошко'], ['Змій'], ['Оленка']],
      out: (_c, n: string) => [`Літер: ${n.length}`],
      hints: (c) => [
        ['Яка команда дає довжину рядка?', c.py ? 'len(name), і перед ним текст через кому.' : 'name.length, і перед ним текст через кому.', c.say(c.py ? '"Літер:", len(name)' : '"Літер:", name.length')],
        ['Which command gives a string’s length?', c.py ? 'len(name), with the text before it and a comma.' : 'name.length, with the text before it and a comma.', c.say(c.py ? '"Літер:", len(name)' : '"Літер:", name.length')],
      ],
      lesson: () => ['Рядок — це символи підряд, і їх можна порахувати.', 'A string is characters in a row, and you can count them.'],
      talk: () => [
        ['Котигорошко ще малий, а ім\'я в нього вже довге. Порахуємо?', 'Kotyhoroshko is still small, but his name is already long. Shall we count?'],
        ['Пальцями?', 'On our fingers?'],
        ['Програмою. Для неї текст — це рядок символів, а рядок має довжину.', 'With the program. For it, text is a string of characters, and a string has a length.'],
      ],
      quip: () => ['Одинадцять літер! Довге ім\'я для такої маленької горошини.', 'Eleven letters! A long name for such a small pea.'],
    },
    {
      key: 'shout', title: ['Гучний клич', 'A loud cry'], topic: ['великі літери', 'capital letters'],
      brief: () => ['<b>Гучний клич.</b> Котигорошко кричить на Змія. Виведи слово великими літерами, а в кінці додай <code>!</code>.', '<b>A loud cry.</b> Kotyhoroshko shouts at the Dragon. Print the word in capital letters and add <code>!</code> at the end.'],
      statement: (c) => [[
        'Перед боєм богатир кричить так, що аж земля дрижить.',
        `Слово лежить у змінній <code>word</code>. Перетвори його на великі літери: ${c.py ? '<code>word.upper()</code>' : '<code>word.toUpperCase()</code>'}. Потім приклей <code>"!"</code>.`,
        'Для <code>"гей"</code> вийде <code>ГЕЙ!</code>, для <code>"до бою"</code> — <code>ДО БОЮ!</code>.',
      ], [
        'Before a fight the hero shouts so loud the ground shakes.',
        `The word is in the variable <code>word</code>. Turn it into capital letters: ${c.py ? '<code>word.upper()</code>' : '<code>word.toUpperCase()</code>'}. Then stick <code>"!"</code> on.`,
        'For <code>"гей"</code> that’s <code>ГЕЙ!</code>, for <code>"до бою"</code> — <code>ДО БОЮ!</code>.',
      ]],
      tool: {
        name: (c) => [c.py ? 'upper' : 'toUpperCase', c.py ? 'upper' : 'toUpperCase'],
        text: (c) => [[
          `У рядка є власні команди, їх пишуть через крапку: ${c.py ? '<code>word.upper()</code> — великими, <code>word.lower()</code> — малими' : '<code>word.toUpperCase()</code> — великими, <code>word.toLowerCase()</code> — малими'}.`,
          'Сам рядок від цього не змінюється. Команда повертає новий рядок, і його можна вивести чи склеїти з іншим.',
        ], [
          `A string has its own commands, written after a dot: ${c.py ? '<code>word.upper()</code> — capitals, <code>word.lower()</code> — small letters' : '<code>word.toUpperCase()</code> — capitals, <code>word.toLowerCase()</code> — small letters'}.`,
          'The string itself doesn’t change. The command returns a new string, which you can print or join with another.',
        ]],
        code: (c) => pick(c, 'print("тихо".upper())   # ТИХО', 'console.log("тихо".toUpperCase());   // ТИХО'),
      },
      entry: 'shout', params: [['word', 'string']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'shout', [['word', 'string']], 'void', pick(c, '    print(word.upper() + "!")\n', '  console.log(word.toUpperCase() + "!");\n')),
      tests: [['гей'], ['до бою'], ['котигорошко']],
      out: (_c, w: string) => [`${w.toUpperCase()}!`],
      hints: (c) => [
        ['Спершу великі літери, потім знак оклику.', c.py ? 'word.upper() + "!"' : 'word.toUpperCase() + "!"', c.say(c.py ? 'word.upper() + "!"' : 'word.toUpperCase() + "!"')],
        ['First capitals, then the exclamation mark.', c.py ? 'word.upper() + "!"' : 'word.toUpperCase() + "!"', c.say(c.py ? 'word.upper() + "!"' : 'word.toUpperCase() + "!"')],
      ],
      lesson: () => ['У рядків є свої команди через крапку. Вони повертають новий рядок.', 'Strings have their own commands after a dot. They return a new string.'],
      quip: () => ['Змій аж присів від такого крику.', 'The Dragon actually ducked at that shout.'],
    },
    {
      key: 'ends', title: ['Перша літера', 'The first letter'], topic: ['символ за номером', 'a character by its number'],
      brief: () => ['<b>Перша літера.</b> На булаві вибивають першу й останню літеру імені. Виведи їх.', '<b>The first letter.</b> The first and last letters of the name are carved on the mace. Print them.'],
      statement: (c) => [[
        'Кожен символ у рядку має свій номер. Рахують з нуля: перший символ — номер <code>0</code>, другий — <code>1</code>.',
        `Перший символ імені — <code>name[0]</code>. Останній — ${c.py ? '<code>name[-1]</code>: у Python мінус рахує з кінця' : '<code>name[name.length - 1]</code>: його номер на одиницю менший за довжину'}.`,
        'Для <code>"Котигорошко"</code> виведи:<br><code>Перша: К</code><br><code>Остання: о</code>',
      ], [
        'Every character in a string has its own number. Counting starts at zero: the first character is number <code>0</code>, the second <code>1</code>.',
        `The first character of the name is <code>name[0]</code>. The last is ${c.py ? '<code>name[-1]</code>: in Python a minus counts from the end' : '<code>name[name.length - 1]</code>: its number is one less than the length'}.`,
        'For <code>"Котигорошко"</code> print:<br><code>Перша: К</code><br><code>Остання: о</code>',
      ]],
      tool: {
        name: () => ['номер символу', 'character index'],
        text: (c) => [[
          'Номер символу пишуть у квадратних дужках: <code>"Змій"[1]</code> — це <code>м</code>.',
          c.py ? 'Від\'ємний номер рахує з кінця: <code>"Змій"[-1]</code> — це <code>й</code>.' : 'Останній символ: <code>word[word.length - 1]</code>. Бо довжина 4, а номери 0, 1, 2, 3.',
        ], [
          'You write a character’s number in square brackets: <code>"Змій"[1]</code> is <code>м</code>.',
          c.py ? 'A negative number counts from the end: <code>"Змій"[-1]</code> is <code>й</code>.' : 'The last character: <code>word[word.length - 1]</code>. Because the length is 4, but the numbers are 0, 1, 2, 3.',
        ]],
        code: (c) => pick(c, 'word = "булава"\nprint(word[0], word[-1])   # б а', 'const word = "булава";\nconsole.log(word[0], word[word.length - 1]);   // б а'),
      },
      entry: 'ends', params: [['name', 'string']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'ends', [['name', 'string']], 'void', pick(c,
        '    print("Перша:", name[0])\n    print("Остання:", name[-1])\n',
        '  console.log("Перша:", name[0]);\n  console.log("Остання:", name[name.length - 1]);\n')),
      tests: [['Котигорошко'], ['Змій'], ['Вернидуб']],
      out: (_c, n: string) => [`Перша: ${n[0]}`, `Остання: ${n[n.length - 1]}`],
      hints: (c) => [
        ['Номери починаються з нуля.', c.py ? 'name[0] — перша, name[-1] — остання.' : 'name[0] — перша, name[name.length - 1] — остання.', `${c.say('"Перша:", name[0]')}\n${c.say(c.py ? '"Остання:", name[-1]' : '"Остання:", name[name.length - 1]')}`],
        ['Numbers start at zero.', c.py ? 'name[0] is the first, name[-1] the last.' : 'name[0] is the first, name[name.length - 1] the last.', `${c.say('"Перша:", name[0]')}\n${c.say(c.py ? '"Остання:", name[-1]' : '"Остання:", name[name.length - 1]')}`],
      ],
      lesson: () => ['Символи рядка нумеруються з нуля, і кожен можна дістати за номером.', 'A string’s characters are numbered from zero, and you can get any of them by number.'],
      quip: () => ['К і о. Коваль вибив літери, булава готова.', 'К and о. The smith carved the letters, the mace is ready.'],
    },
    {
      key: 'boast', title: ['Шаблон', 'A template'], topic: ['підстановка в рядок', 'filling in a string'],
      brief: (c) => [`<b>Шаблон.</b> Склади хвалькуватий рядок про богатиря з двох змінних за допомогою ${c.py ? 'f-рядка' : 'шаблонного рядка'}.`, `<b>A template.</b> Build a boastful line about a hero from two variables using ${c.py ? 'an f-string' : 'a template string'}.`],
      statement: (c) => [[
        'Богатирі люблять похвалитися, хто яку булаву підняв.',
        'Ім\'я богатиря лежить у <code>hero</code>, вага булави в пудах у <code>weight</code>.',
        `Виведи один рядок: <code>Котигорошко підняв булаву вагою 12 пудів</code>, підставивши змінні. Склеювати через <code>+</code> незручно, бо <code>weight</code> — число. Зручніше ${c.py ? 'f-рядок: <code>f"{hero} підняв…"</code>' : 'шаблонний рядок у зворотних лапках: <code>`${hero} підняв…`</code>'}.`,
      ], [
        'Heroes love to boast about which mace they lifted.',
        'The hero’s name is in <code>hero</code>, the mace’s weight in pood in <code>weight</code>.',
        `Print one line: <code>Котигорошко підняв булаву вагою 12 пудів</code>, filling in the variables. Joining with <code>+</code> is awkward because <code>weight</code> is a number. ${c.py ? 'An f-string is handier: <code>f"{hero} підняв…"</code>' : 'A template string in backticks is handier: <code>`${hero} підняв…`</code>'}.`,
      ]],
      tool: {
        name: (c) => [c.py ? 'f-рядок' : 'шаблонний рядок', c.py ? 'f-string' : 'template string'],
        text: (c) => [[
          c.py ? 'Літера <code>f</code> перед лапками вмикає підстановку: усе у фігурних дужках <code>{…}</code> замінюється значенням.' : 'Зворотні лапки <code>`…`</code> вмикають підстановку: усе в <code>${…}</code> замінюється значенням.',
          'Числа підставляються самі, перетворювати їх на текст не треба.',
        ], [
          c.py ? 'The letter <code>f</code> before the quotes turns on filling in: anything in curly braces <code>{…}</code> is replaced by its value.' : 'Backticks <code>`…`</code> turn on filling in: anything in <code>${…}</code> is replaced by its value.',
          'Numbers are filled in automatically, no need to turn them into text.',
        ]],
        code: (c) => pick(c, 'age = 7\nprint(f"Мені {age} років")   # Мені 7 років', 'const age = 7;\nconsole.log(`Мені ${age} років`);   // Мені 7 років'),
      },
      entry: 'boast', params: [['hero', 'string'], ['weight', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'boast', [['hero', 'string'], ['weight', 'number']], 'void', pick(c,
        '    print(f"{hero} підняв булаву вагою {weight} пудів")\n',
        '  console.log(`${hero} підняв булаву вагою ${weight} пудів`);\n')),
      tests: [['Котигорошко', 12], ['Вернигора', 5], ['Крутивус', 7]],
      out: (_c, h: string, w: number) => [`${h} підняв булаву вагою ${w} пудів`],
      hints: (c) => [
        ['Де в рядку мають стояти змінні?', c.py ? 'f"{hero} підняв булаву вагою {weight} пудів"' : '`${hero} підняв булаву вагою ${weight} пудів`', c.say(c.py ? 'f"{hero} підняв булаву вагою {weight} пудів"' : '`${hero} підняв булаву вагою ${weight} пудів`')],
        ['Where in the line do the variables go?', c.py ? 'f"{hero} підняв булаву вагою {weight} пудів"' : '`${hero} підняв булаву вагою ${weight} пудів`', c.say(c.py ? 'f"{hero} підняв булаву вагою {weight} пудів"' : '`${hero} підняв булаву вагою ${weight} пудів`')],
      ],
      lesson: (c) => [c.py ? 'f-рядок підставляє значення змінних прямо в текст.' : 'Шаблонний рядок підставляє значення змінних прямо в текст.', c.py ? 'An f-string fills variable values right into the text.' : 'A template string fills variable values right into the text.'],
      quip: () => ['Дванадцять пудів! Вернигора аж почервонів від заздрощів.', 'Twelve pood! Vernyhora went red with envy.'],
    },
  ],
};

/* ============================== Розділ 4. Коза-дереза — умови ============================== */

const koza: Chapter = {
  key: 'koza', name: ['Коза-дереза', 'The Goat Dereza'], topic: ['умови', 'conditions'], fox: '#8a6a3a',
  host: ['Коза-дереза всіх лякає: «Я коза-дереза, пів боку луплена!». Хто злякається, а хто ні, вирішують умови.', 'Dereza the goat scares everyone: “I’m the goat Dereza, half my side is flayed!” Who gets scared and who doesn’t is decided by conditions.'],
  lessons: [
    {
      key: 'if', title: ['Якщо…', 'If…'], topic: ['умова if', 'the if condition'],
      brief: () => ['<b>Якщо…</b> Сміливість звіра приходить у змінній. Якщо вона більша за 5, звір не боїться кози.', '<b>If…</b> An animal’s courage arrives in a variable. If it’s more than 5, the animal isn’t afraid of the goat.'],
      statement: (c) => [[
        'Програма вміє вибирати: робити щось чи ні. Для цього є <b>умова</b>.',
        `Сміливість лежить у змінній <code>brave</code>. Якщо вона <b>більша за 5</b>, виведи <code>Не боюся кози!</code>. ${c.py ? 'У Python це <code>if brave > 5:</code>, а команда під ним зсунута на 4 пробіли.' : 'Це <code>if (brave > 5) { … }</code>: умова в дужках, команди у фігурних дужках.'}`,
        'А після умови, хоч би що, виведи <code>Казка триває</code>. Для <code>8</code> вийде два рядки, для <code>3</code> — лише <code>Казка триває</code>.',
      ], [
        'A program can choose whether to do something or not. That’s what a <b>condition</b> is for.',
        `The courage is in the variable <code>brave</code>. If it’s <b>more than 5</b>, print <code>Не боюся кози!</code>. ${c.py ? 'In Python that’s <code>if brave > 5:</code>, with the command below indented by 4 spaces.' : 'That’s <code>if (brave > 5) { … }</code>: the condition in parentheses, the commands in curly braces.'}`,
        'After the condition, no matter what, print <code>Казка триває</code>. For <code>8</code> that’s two lines, for <code>3</code> just <code>Казка триває</code>.',
      ]],
      tool: {
        name: () => ['if', 'if'],
        text: (c) => [[
          'Порівняння: <code>&gt;</code> більше, <code>&lt;</code> менше, <code>&gt;=</code> більше або дорівнює, <code>&lt;=</code> менше або дорівнює.',
          c.py ? 'Що виконувати за умовою, вирішує відступ: усе, що зсунуте під <code>if</code>, належить йому.' : 'Що виконувати за умовою, пишуть у фігурних дужках <code>{ }</code> після <code>if</code>.',
        ], [
          'Comparisons: <code>&gt;</code> greater, <code>&lt;</code> less, <code>&gt;=</code> greater or equal, <code>&lt;=</code> less or equal.',
          c.py ? 'What runs under the condition is decided by the indent: everything indented under <code>if</code> belongs to it.' : 'What runs under the condition goes in curly braces <code>{ }</code> after <code>if</code>.',
        ]],
        code: (c) => pick(c, 'if apples > 3:\n    print("Багато яблук")\nprint("Кінець")', 'if (apples > 3) {\n  console.log("Багато яблук");\n}\nconsole.log("Кінець");'),
      },
      entry: 'courage', params: [['brave', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'courage', [['brave', 'number']], 'void', pick(c,
        '    if brave > 5:\n        print("Не боюся кози!")\n    print("Казка триває")\n',
        '  if (brave > 5) {\n    console.log("Не боюся кози!");\n  }\n  console.log("Казка триває");\n')),
      tests: [[8], [3], [6], [5]],
      out: (_c, b: number) => [...(b > 5 ? ['Не боюся кози!'] : []), 'Казка триває'],
      hints: (c) => [
        ['Перший рядок виводиться не завжди, а другий завжди.', c.py ? 'if brave > 5: і зсунутий print під ним. Другий print без відступу.' : 'if (brave > 5) { … }, а другий console.log після дужок.', pick(c, 'if brave > 5:\n    print("Не боюся кози!")\nprint("Казка триває")', 'if (brave > 5) {\n  console.log("Не боюся кози!");\n}\nconsole.log("Казка триває");')],
        ['The first line isn’t always printed, the second always is.', c.py ? 'if brave > 5: with an indented print under it. The second print has no indent.' : 'if (brave > 5) { … }, and the second console.log after the braces.', pick(c, 'if brave > 5:\n    print("Не боюся кози!")\nprint("Казка триває")', 'if (brave > 5) {\n  console.log("Не боюся кози!");\n}\nconsole.log("Казка триває");')],
      ],
      lesson: () => ['Умова if виконує команди лише тоді, коли порівняння правдиве.', 'An if runs its commands only when the comparison is true.'],
      talk: () => [
        ['Коза засіла в хатці зайчика й лякає всіх, хто приходить. Хто ж її прожене?', 'The goat has taken over the hare’s hut and scares everyone who comes. Who will chase her out?'],
        ['Найсміливіший!', 'The bravest!'],
        ['Отож. Програма має вміти вирішувати: якщо звір сміливий, він іде, інакше ні.', 'Exactly. The program must be able to decide: if the animal is brave, it goes, otherwise not.'],
      ],
      quip: () => ['Сміливих знайшлося небагато. Коза ще сидить.', 'Not many brave ones. The goat is still sitting there.'],
    },
    {
      key: 'else', title: ['Інакше', 'Otherwise'], topic: ['if і else', 'if and else'],
      brief: () => ['<b>Інакше.</b> До хатки підходить звір. Рак щипає козу, а решта тікає.', '<b>Otherwise.</b> An animal comes to the hut. The crayfish pinches the goat, everyone else runs away.'],
      statement: (c) => [[
        'Зайчик, вовк і ведмідь утекли від кози. А рак не злякався.',
        `Хто прийшов, лежить у <code>animal</code>. Якщо це <code>"рак"</code>, виведи <code>Рак ущипнув козу!</code>. <b>Інакше</b> виведи ім'я звіра й <code> тікає від кози</code>. Порівняння на рівність пишуть двома знаками: ${c.py ? '<code>animal == "рак"</code>' : '<code>animal === "рак"</code> (три знаки рівності)'}.`,
        'Для <code>"вовк"</code> вийде <code>вовк тікає від кози</code>.',
      ], [
        'The hare, the wolf and the bear ran from the goat. But the crayfish wasn’t scared.',
        `Who came is in <code>animal</code>. If it’s <code>"рак"</code>, print <code>Рак ущипнув козу!</code>. <b>Otherwise</b> print the animal’s name and <code> тікає від кози</code>. An equality check uses a double sign: ${c.py ? '<code>animal == "рак"</code>' : '<code>animal === "рак"</code> (three equals signs)'}.`,
        'For <code>"вовк"</code> that’s <code>вовк тікає від кози</code>.',
      ]],
      tool: {
        name: () => ['else', 'else'],
        text: (c) => [[
          '<code>else</code> — що робити, коли умова неправдива. Виконається одна з двох гілок, ніколи обидві.',
          c.py ? 'Один знак <code>=</code> кладе значення в змінну, а <code>==</code> порівнює.' : 'Один знак <code>=</code> кладе значення в змінну, а <code>===</code> порівнює.',
        ], [
          '<code>else</code> is what to do when the condition is false. Exactly one of the two branches runs, never both.',
          c.py ? 'A single <code>=</code> puts a value into a variable, while <code>==</code> compares.' : 'A single <code>=</code> puts a value into a variable, while <code>===</code> compares.',
        ]],
        code: (c) => pick(c, 'if weather == "дощ":\n    print("Беру парасолю")\nelse:\n    print("Іду так")', 'if (weather === "дощ") {\n  console.log("Беру парасолю");\n} else {\n  console.log("Іду так");\n}'),
      },
      entry: 'meet', params: [['animal', 'string']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'meet', [['animal', 'string']], 'void', pick(c,
        '    if animal == "рак":\n        print("Рак ущипнув козу!")\n    else:\n        print(animal + " тікає від кози")\n',
        '  if (animal === "рак") {\n    console.log("Рак ущипнув козу!");\n  } else {\n    console.log(animal + " тікає від кози");\n  }\n')),
      tests: [['зайчик'], ['рак'], ['вовк'], ['ведмідь']],
      out: (_c, a: string) => [a === 'рак' ? 'Рак ущипнув козу!' : `${a} тікає від кози`],
      hints: (c) => [
        ['Дві гілки: рак і всі інші.', c.py ? 'if animal == "рак": … else: …' : 'if (animal === "рак") { … } else { … }', pick(c, 'if animal == "рак":\n    print("Рак ущипнув козу!")\nelse:\n    print(animal + " тікає від кози")', 'if (animal === "рак") {\n  console.log("Рак ущипнув козу!");\n} else {\n  console.log(animal + " тікає від кози");\n}')],
        ['Two branches: the crayfish and everyone else.', c.py ? 'if animal == "рак": … else: …' : 'if (animal === "рак") { … } else { … }', pick(c, 'if animal == "рак":\n    print("Рак ущипнув козу!")\nelse:\n    print(animal + " тікає від кози")', 'if (animal === "рак") {\n  console.log("Рак ущипнув козу!");\n} else {\n  console.log(animal + " тікає від кози");\n}')],
      ],
      lesson: () => ['if і else — дві дороги, і програма йде однією з них.', 'if and else are two roads, and the program takes exactly one of them.'],
      quip: () => ['Ущипнув! Коза вискочила з хатки й більше не повернулася.', 'Pinched! The goat shot out of the hut and never came back.'],
    },
    {
      key: 'elif', title: ['Кілька варіантів', 'Several options'], topic: ['ланцюжок умов', 'a chain of conditions'],
      brief: () => ['<b>Кілька варіантів.</b> Що сильніше коза лякає, то більший звір тікає. Виведи, хто тікає.', '<b>Several options.</b> The scarier the goat, the bigger the animal that runs. Print who runs.'],
      statement: (c) => [[
        'Сила переляку — число в змінній <code>fear</code>.',
        `Перевіряй по черзі: якщо <code>fear</code> не менше 8, виведи <code>Тікає ведмідь</code>. ${c.py ? 'Інакше, якщо не менше 5 (<code>elif</code>)' : 'Інакше, якщо не менше 5 (<code>else if</code>)'}, — <code>Тікає вовк</code>. Інакше, якщо не менше 2, — <code>Тікає зайчик</code>. А інакше — <code>Ніхто не тікає</code>.`,
        'Для <code>9</code> — ведмідь, для <code>5</code> — вовк, для <code>3</code> — зайчик, для <code>1</code> — ніхто.',
      ], [
        'The amount of fear is a number in the variable <code>fear</code>.',
        `Check in turn: if <code>fear</code> is at least 8, print <code>Тікає ведмідь</code>. ${c.py ? 'Otherwise, if it’s at least 5 (<code>elif</code>)' : 'Otherwise, if it’s at least 5 (<code>else if</code>)'}, — <code>Тікає вовк</code>. Otherwise, if at least 2, — <code>Тікає зайчик</code>. And otherwise — <code>Ніхто не тікає</code>.`,
        'For <code>9</code> — the bear, for <code>5</code> — the wolf, for <code>3</code> — the hare, for <code>1</code> — nobody.',
      ]],
      tool: {
        name: (c) => [c.py ? 'elif' : 'else if', c.py ? 'elif' : 'else if'],
        text: (c) => [[
          `Умови перевіряються зверху вниз, і спрацьовує <b>перша</b> правдива. Решту програма вже не дивиться.`,
          `Тому починай з найбільшого порогу: якби першою стояла перевірка «не менше 2», вона б спрацьовувала і для 9. ${c.py ? '<code>elif</code> — скорочення від else if.' : ''}`,
        ], [
          'Conditions are checked top to bottom, and the <b>first</b> true one wins. The program doesn’t look at the rest.',
          `So start with the biggest threshold: if “at least 2” came first, it would fire for 9 too. ${c.py ? '<code>elif</code> is short for else if.' : ''}`,
        ]],
        code: (c) => pick(c, 'if mark >= 10:\n    print("Відмінно")\nelif mark >= 7:\n    print("Добре")\nelse:\n    print("Ще попрацюй")', 'if (mark >= 10) {\n  console.log("Відмінно");\n} else if (mark >= 7) {\n  console.log("Добре");\n} else {\n  console.log("Ще попрацюй");\n}'),
      },
      entry: 'scare', params: [['fear', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'scare', [['fear', 'number']], 'void', pick(c,
        '    if fear >= 8:\n        print("Тікає ведмідь")\n    elif fear >= 5:\n        print("Тікає вовк")\n    elif fear >= 2:\n        print("Тікає зайчик")\n    else:\n        print("Ніхто не тікає")\n',
        '  if (fear >= 8) {\n    console.log("Тікає ведмідь");\n  } else if (fear >= 5) {\n    console.log("Тікає вовк");\n  } else if (fear >= 2) {\n    console.log("Тікає зайчик");\n  } else {\n    console.log("Ніхто не тікає");\n  }\n')),
      tests: [[9], [5], [3], [1], [8], [2]],
      out: (_c, f: number) => [f >= 8 ? 'Тікає ведмідь' : f >= 5 ? 'Тікає вовк' : f >= 2 ? 'Тікає зайчик' : 'Ніхто не тікає'],
      hints: (c) => [
        ['Почни з найбільшого порогу.', c.py ? 'if fear >= 8 … elif fear >= 5 … elif fear >= 2 … else …' : 'if (fear >= 8) … else if (fear >= 5) … else if (fear >= 2) … else …', pick(c, 'if fear >= 8:\n    print("Тікає ведмідь")\nelif fear >= 5:\n    print("Тікає вовк")', 'if (fear >= 8) {\n  console.log("Тікає ведмідь");\n} else if (fear >= 5) {\n  console.log("Тікає вовк");\n}')],
        ['Start with the biggest threshold.', c.py ? 'if fear >= 8 … elif fear >= 5 … elif fear >= 2 … else …' : 'if (fear >= 8) … else if (fear >= 5) … else if (fear >= 2) … else …', pick(c, 'if fear >= 8:\n    print("Тікає ведмідь")\nelif fear >= 5:\n    print("Тікає вовк")', 'if (fear >= 8) {\n  console.log("Тікає ведмідь");\n} else if (fear >= 5) {\n  console.log("Тікає вовк");\n}')],
      ],
      lesson: () => ['У ланцюжку умов спрацьовує перша правдива, тож порядок важливий.', 'In a chain of conditions the first true one wins, so the order matters.'],
      quip: () => ['Ведмідь тікає найшвидше. Хоч і найбільший.', 'The bear runs the fastest. Even though he’s the biggest.'],
    },
    {
      key: 'andor', title: ['І / або', 'And / or'], topic: ['кілька умов разом', 'combining conditions'],
      brief: (c) => [`<b>І / або.</b> Прогнати козу може лише той, хто і сміливий, і маленький. Дві умови приходять як ${c.py ? '<code>True</code> чи <code>False</code>' : '<code>true</code> чи <code>false</code>'}.`, `<b>And / or.</b> Only someone both brave and small can chase the goat out. The two conditions arrive as ${c.py ? '<code>True</code> or <code>False</code>' : '<code>true</code> or <code>false</code>'}.`],
      statement: (c) => [[
        `Змінна <code>brave</code> каже, чи звір сміливий, <code>small</code> — чи маленький. Це <b>логічні</b> значення: ${c.py ? '<code>True</code> (так) або <code>False</code> (ні)' : '<code>true</code> (так) або <code>false</code> (ні)'}.`,
        `Якщо звір <b>і</b> сміливий, <b>і</b> маленький, виведи <code>Ось хто прожене козу!</code>. Інакше, якщо він сміливий <b>або</b> маленький, — <code>Спробує завтра</code>. Інакше — <code>Сидить удома</code>.`,
        c.py ? 'У Python «і» — це <code>and</code>, «або» — <code>or</code>.' : 'У коді «і» — це <code>&amp;&amp;</code>, «або» — <code>||</code>.',
      ], [
        `The variable <code>brave</code> says whether the animal is brave, <code>small</code> whether it’s small. These are <b>boolean</b> values: ${c.py ? '<code>True</code> (yes) or <code>False</code> (no)' : '<code>true</code> (yes) or <code>false</code> (no)'}.`,
        'If the animal is <b>both</b> brave <b>and</b> small, print <code>Ось хто прожене козу!</code>. Otherwise, if it’s brave <b>or</b> small, — <code>Спробує завтра</code>. Otherwise — <code>Сидить удома</code>.',
        c.py ? 'In Python “and” is <code>and</code>, “or” is <code>or</code>.' : 'In code “and” is <code>&amp;&amp;</code>, “or” is <code>||</code>.',
      ]],
      tool: {
        name: (c) => [c.py ? 'and і or' : '&& і ||', c.py ? 'and and or' : '&& and ||'],
        text: (c) => [[
          `<b>І</b> правдиве, лише коли правдиві обидві частини. <b>Або</b> правдиве, коли правдива хоч одна.`,
          `Логічне значення можна писати в умову саме по собі: ${c.py ? '<code>if brave:</code>' : '<code>if (brave)</code>'} означає «якщо сміливий».`,
        ], [
          '<b>And</b> is true only when both parts are true. <b>Or</b> is true when at least one is.',
          `A boolean can go into a condition on its own: ${c.py ? '<code>if brave:</code>' : '<code>if (brave)</code>'} means “if brave”.`,
        ]],
        code: (c) => pick(c, 'if sunny and warm:\n    print("На річку!")\nelif sunny or warm:\n    print("Погуляємо")', 'if (sunny && warm) {\n  console.log("На річку!");\n} else if (sunny || warm) {\n  console.log("Погуляємо");\n}'),
      },
      entry: 'hero', params: [['brave', 'boolean'], ['small', 'boolean']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'hero', [['brave', 'boolean'], ['small', 'boolean']], 'void', pick(c,
        '    if brave and small:\n        print("Ось хто прожене козу!")\n    elif brave or small:\n        print("Спробує завтра")\n    else:\n        print("Сидить удома")\n',
        '  if (brave && small) {\n    console.log("Ось хто прожене козу!");\n  } else if (brave || small) {\n    console.log("Спробує завтра");\n  } else {\n    console.log("Сидить удома");\n  }\n')),
      tests: [[true, true], [true, false], [false, true], [false, false]],
      out: (_c, b: boolean, s: boolean) => [b && s ? 'Ось хто прожене козу!' : b || s ? 'Спробує завтра' : 'Сидить удома'],
      hints: (c) => [
        ['Спершу перевір, чи правдиві обидві умови.', c.py ? 'brave and small, потім brave or small, потім else.' : 'brave && small, потім brave || small, потім else.', pick(c, 'if brave and small:\n    print("Ось хто прожене козу!")\nelif brave or small:\n    print("Спробує завтра")', 'if (brave && small) {\n  console.log("Ось хто прожене козу!");\n} else if (brave || small) {\n  console.log("Спробує завтра");\n}')],
        ['First check whether both are true.', c.py ? 'brave and small, then brave or small, then else.' : 'brave && small, then brave || small, then else.', pick(c, 'if brave and small:\n    print("Ось хто прожене козу!")\nelif brave or small:\n    print("Спробує завтра")', 'if (brave && small) {\n  console.log("Ось хто прожене козу!");\n} else if (brave || small) {\n  console.log("Спробує завтра");\n}')],
      ],
      lesson: (c) => [c.py ? 'and вимагає, щоб правдиві були обидві умови, or — хоч одна.' : '&& вимагає, щоб правдиві були обидві умови, || — хоч одна.', c.py ? 'and needs both conditions to be true, or needs at least one.' : '&& needs both conditions to be true, || needs at least one.'],
      quip: () => ['Маленький і сміливий — це рак. Казка знала відповідь від початку.', 'Small and brave — that’s the crayfish. The tale knew the answer all along.'],
    },
  ],
};

/* ============================== Розділ 5. Солом'яний бичок — цикли ============================== */

const bychok: Chapter = {
  key: 'bychok', name: ['Солом\'яний бичок', 'The Straw Bull'], topic: ['цикли', 'loops'], fox: '#c9a466',
  host: ['Дід зробив бичка із соломи й засмолив йому боки. Звірі лізуть один за одним, день за днем. Щоб не писати те саме сто разів, є цикли.', 'Grandpa made a bull of straw and smeared its sides with tar. Animals come one after another, day after day. So you don’t write the same thing a hundred times, there are loops.'],
  lessons: [
    {
      key: 'count', title: ['Лічба', 'Counting'], topic: ['цикл for', 'the for loop'],
      brief: () => ['<b>Лічба.</b> Баба рахує дні, поки бичок пасеться. Виведи числа від 1 до <code>n</code>, кожне окремим рядком.', '<b>Counting.</b> Grandma counts the days while the bull grazes. Print the numbers from 1 to <code>n</code>, each on its own line.'],
      statement: (c) => [[
        '<b>Цикл</b> повторює команди кілька разів. Пишеш раз, а виконується скільки треба.',
        `Число <code>n</code> приходить у змінній. Виведи <code>1</code>, <code>2</code>, … аж до <code>n</code>. ${c.py ? 'У Python для цього є <code>for i in range(1, n + 1):</code>. <code>range</code> не включає останнє число, тому <code>n + 1</code>.' : 'Для цього є <code>for (let i = 1; i &lt;= n; i++) { … }</code>: почни з 1, повторюй, поки i не більше n, і щоразу додавай 1.'}`,
        'Для <code>3</code> вийде три рядки: <code>1</code>, <code>2</code>, <code>3</code>.',
      ], [
        'A <b>loop</b> repeats commands several times. You write it once, and it runs as many times as needed.',
        `The number <code>n</code> arrives in a variable. Print <code>1</code>, <code>2</code>, … up to <code>n</code>. ${c.py ? 'In Python that’s <code>for i in range(1, n + 1):</code>. <code>range</code> doesn’t include the last number, hence <code>n + 1</code>.' : 'That’s <code>for (let i = 1; i &lt;= n; i++) { … }</code>: start at 1, repeat while i is at most n, and add 1 each time.'}`,
        'For <code>3</code> that’s three lines: <code>1</code>, <code>2</code>, <code>3</code>.',
      ]],
      tool: {
        name: () => ['for', 'for'],
        text: (c) => [[
          'Змінна <code>i</code> щоразу має нове значення: спершу 1, потім 2 і так далі. Усередині циклу її можна виводити й рахувати з нею.',
          c.py ? 'Тіло циклу — команди, зсунуті під <code>for</code> на 4 пробіли.' : 'Тіло циклу — команди у фігурних дужках після <code>for</code>.',
        ], [
          'The variable <code>i</code> gets a new value each time: first 1, then 2 and so on. Inside the loop you can print it and compute with it.',
          c.py ? 'The loop body is the commands indented under <code>for</code> by 4 spaces.' : 'The loop body is the commands in curly braces after <code>for</code>.',
        ]],
        code: (c) => pick(c, 'for i in range(1, 4):\n    print("Крок", i)   # Крок 1, Крок 2, Крок 3', 'for (let i = 1; i <= 3; i++) {\n  console.log("Крок", i);   // Крок 1, Крок 2, Крок 3\n}'),
      },
      entry: 'count', params: [['n', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'count', [['n', 'number']], 'void', pick(c,
        '    for i in range(1, n + 1):\n        print(i)\n',
        '  for (let i = 1; i <= n; i++) {\n    console.log(i);\n  }\n')),
      tests: [[3], [5], [1]],
      out: (_c, n: number) => Array.from({ length: n }, (_, i) => String(i + 1)),
      hints: (c) => [
        ['Одна команда виводу, але всередині циклу.', c.py ? 'for i in range(1, n + 1): і під ним print(i).' : 'for (let i = 1; i <= n; i++) і всередині console.log(i).', pick(c, 'for i in range(1, n + 1):\n    print(i)', 'for (let i = 1; i <= n; i++) {\n  console.log(i);\n}')],
        ['One print command, but inside a loop.', c.py ? 'for i in range(1, n + 1): with print(i) under it.' : 'for (let i = 1; i <= n; i++) with console.log(i) inside.', pick(c, 'for i in range(1, n + 1):\n    print(i)', 'for (let i = 1; i <= n; i++) {\n  console.log(i);\n}')],
      ],
      lesson: () => ['Цикл повторює ті самі команди, а змінна циклу щоразу має нове значення.', 'A loop repeats the same commands, and the loop variable has a new value each time.'],
      talk: () => [
        ['Бичок пасеться день за днем, і щодня хтось лізе: то ведмідь, то вовк, то заєць.', 'The bull grazes day after day, and every day someone comes: the bear, the wolf, the hare.'],
        ['Писати кожен день окремо? Це ж скільки рядків!', 'Write each day separately? That’s so many lines!'],
        ['Тому й є цикли. Описуєш один день, а програма повторює.', 'That’s why there are loops. You describe one day, and the program repeats it.'],
      ],
      quip: () => ['Раз, два, три… Баба рахує, бичок пасеться.', 'One, two, three… Grandma counts, the bull grazes.'],
    },
    {
      key: 'while', title: ['Поки не…', 'Until…'], topic: ['цикл while', 'the while loop'],
      brief: () => ['<b>Поки не…</b> Ведмідь прилип до смоли й смикається. Поки смола тримає, виводь, як міцно.', '<b>Until…</b> The bear is stuck in the tar and tugging. While the tar holds, print how firmly.'],
      statement: (c) => [[
        'Ведмідь хотів відщипнути смоли, а прилип. Щоразу, як смикнеться, смола тримає на одиницю слабше.',
        `Сила смоли лежить у <code>tar</code>. <b>Поки</b> <code>tar</code> більше 0: виведи <code>Тримає: </code> і <code>tar</code>, а потім зменш <code>tar</code> на 1. Коли цикл скінчиться, виведи <code>Ведмідь вирвався!</code>. ${c.py ? 'Цикл «поки» — це <code>while tar > 0:</code>.' : 'Цикл «поки» — це <code>while (tar > 0) { … }</code>.'}`,
        'Для <code>3</code>: <code>Тримає: 3</code>, <code>Тримає: 2</code>, <code>Тримає: 1</code>, <code>Ведмідь вирвався!</code>. Для <code>0</code> — одразу <code>Ведмідь вирвався!</code>.',
      ], [
        'The bear wanted to pinch some tar and got stuck. Every time he tugs, the tar holds one less.',
        `The tar’s strength is in <code>tar</code>. <b>While</b> <code>tar</code> is more than 0: print <code>Тримає: </code> and <code>tar</code>, then decrease <code>tar</code> by 1. When the loop ends, print <code>Ведмідь вирвався!</code>. ${c.py ? 'The “while” loop is <code>while tar > 0:</code>.' : 'The “while” loop is <code>while (tar > 0) { … }</code>.'}`,
        'For <code>3</code>: <code>Тримає: 3</code>, <code>Тримає: 2</code>, <code>Тримає: 1</code>, <code>Ведмідь вирвався!</code>. For <code>0</code> — straight away <code>Ведмідь вирвався!</code>.',
      ]],
      tool: {
        name: () => ['while', 'while'],
        text: () => [[
          '<code>while</code> повторює, поки умова правдива. Перед кожним повтором умову перевіряють знову.',
          'Усередині щось має змінюватися, інакше цикл ніколи не скінчиться. Тут це <code>tar -= 1</code>.',
        ], [
          '<code>while</code> repeats as long as the condition is true. The condition is checked again before each repeat.',
          'Something inside must change, or the loop never ends. Here that’s <code>tar -= 1</code>.',
        ]],
        code: (c) => pick(c, 'water = 3\nwhile water > 0:\n    print("П\'ю")\n    water -= 1', 'let water = 3;\nwhile (water > 0) {\n  console.log("П\'ю");\n  water -= 1;\n}'),
      },
      entry: 'stuck', params: [['tar', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'stuck', [['tar', 'number']], 'void', pick(c,
        '    while tar > 0:\n        print("Тримає:", tar)\n        tar -= 1\n    print("Ведмідь вирвався!")\n',
        '  while (tar > 0) {\n    console.log("Тримає:", tar);\n    tar -= 1;\n  }\n  console.log("Ведмідь вирвався!");\n')),
      tests: [[3], [1], [0], [5]],
      out: (_c, t: number) => [...Array.from({ length: t }, (_, i) => `Тримає: ${t - i}`), 'Ведмідь вирвався!'],
      hints: (c) => [
        ['Вивести, зменшити, і так по колу, поки tar більше 0.', 'Останній рядок виводиться вже після циклу, без відступу.', pick(c, 'while tar > 0:\n    print("Тримає:", tar)\n    tar -= 1\nprint("Ведмідь вирвався!")', 'while (tar > 0) {\n  console.log("Тримає:", tar);\n  tar -= 1;\n}\nconsole.log("Ведмідь вирвався!");')],
        ['Print, decrease, and round again while tar is more than 0.', 'The last line is printed after the loop, without indent.', pick(c, 'while tar > 0:\n    print("Тримає:", tar)\n    tar -= 1\nprint("Ведмідь вирвався!")', 'while (tar > 0) {\n  console.log("Тримає:", tar);\n  tar -= 1;\n}\nconsole.log("Ведмідь вирвався!");')],
      ],
      lesson: () => ['while повторює, поки умова правдива. Щось усередині має наближати кінець.', 'while repeats as long as the condition is true. Something inside has to bring the end closer.'],
      quip: () => ['Вирвався, та без клаптя шерсті. Більше по смолу не піде.', 'Free, but missing a tuft of fur. He won’t come for tar again.'],
    },
    {
      key: 'sum', title: ['Сума в циклі', 'A sum in a loop'], topic: ['накопичувати результат', 'accumulating a result'],
      brief: () => ['<b>Сума в циклі.</b> Щодня бичок приносить на одну в\'язанку соломи більше. Скільки всього за <code>days</code> днів?', '<b>A sum in a loop.</b> Each day the bull brings one more bundle of straw than the day before. How many in total over <code>days</code> days?'],
      statement: (c) => [[
        'Першого дня — 1 в\'язанка, другого — 2, третього — 3 і так далі.',
        `Кількість днів лежить у <code>days</code>. Заведи змінну <code>total = 0</code>${c.py ? '' : ' (через <code>let</code>)'} і в циклі додавай до неї номер кожного дня. Після циклу виведи <code>Разом: </code> і суму.`,
        'Для <code>3</code> днів: 1 + 2 + 3 = 6, тож <code>Разом: 6</code>. Для <code>10</code> — <code>Разом: 55</code>.',
      ], [
        'On the first day — 1 bundle, on the second — 2, on the third — 3 and so on.',
        `The number of days is in <code>days</code>. Make a variable <code>total = 0</code>${c.py ? '' : ' (with <code>let</code>)'} and in a loop add each day’s number to it. After the loop print <code>Разом: </code> and the sum.`,
        'For <code>3</code> days: 1 + 2 + 3 = 6, so <code>Разом: 6</code>. For <code>10</code> — <code>Разом: 55</code>.',
      ]],
      tool: {
        name: () => ['накопичення', 'accumulator'],
        text: () => [[
          'Змінна до циклу — це кошик. Кожен повтор щось у нього докладає: <code>total += i</code>.',
          'Виводь результат <b>після</b> циклу, коли кошик уже повний. Усередині циклу вивід повторився б щоразу.',
        ], [
          'A variable before the loop is a basket. Each repeat adds something to it: <code>total += i</code>.',
          'Print the result <b>after</b> the loop, when the basket is full. Inside the loop it would print every time.',
        ]],
        code: (c) => pick(c, 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)   # 6', 'let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);   // 6'),
      },
      entry: 'bundles', params: [['days', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'bundles', [['days', 'number']], 'void', pick(c,
        '    total = 0\n    for day in range(1, days + 1):\n        total += day\n    print("Разом:", total)\n',
        '  let total = 0;\n  for (let day = 1; day <= days; day++) {\n    total += day;\n  }\n  console.log("Разом:", total);\n',
        '  let total: number = 0;\n  for (let day = 1; day <= days; day++) {\n    total += day;\n  }\n  console.log("Разом:", total);\n')),
      tests: [[3], [10], [1], [7]],
      out: (_c, d: number) => [`Разом: ${(d * (d + 1)) / 2}`],
      hints: (c) => [
        ['Кошик до циклу, докладати в циклі, виводити після.', 'total = 0, у циклі total += day, а print після циклу.', pick(c, 'total = 0\nfor day in range(1, days + 1):\n    total += day\nprint("Разом:", total)', 'let total = 0;\nfor (let day = 1; day <= days; day++) {\n  total += day;\n}\nconsole.log("Разом:", total);')],
        ['Basket before the loop, add inside, print after.', 'total = 0, total += day inside the loop, and the print after it.', pick(c, 'total = 0\nfor day in range(1, days + 1):\n    total += day\nprint("Разом:", total)', 'let total = 0;\nfor (let day = 1; day <= days; day++) {\n  total += day;\n}\nconsole.log("Разом:", total);')],
      ],
      lesson: () => ['Змінна перед циклом накопичує результат, а виводять його після циклу.', 'A variable before the loop accumulates the result, and you print it after the loop.'],
      quip: () => ['П\'ятдесят п\'ять в\'язанок за десять днів. Дід уже кличе сусідів по солому.', 'Fifty-five bundles in ten days. Grandpa is already inviting the neighbours to take straw.'],
    },
    {
      key: 'counter', title: ['Лічильник', 'A counter'], topic: ['цикл з умовою', 'a loop with a condition'],
      brief: () => ['<b>Лічильник.</b> Вовк приходить до бичка кожного третього дня. Скільки разів він прийшов за <code>days</code> днів?', '<b>A counter.</b> The wolf visits the bull every third day. How many times did he come in <code>days</code> days?'],
      statement: () => [[
        'Вовк хитрий: приходить на 3-й, 6-й, 9-й день і так далі.',
        'Пройди циклом усі дні від 1 до <code>days</code>. Якщо номер дня ділиться на 3 без остачі, збільш лічильник на 1. Після циклу виведи <code>Вовк приходив: </code> і лічильник.',
        'Остачу від ділення дає знак <code>%</code>: <code>7 % 3</code> — це 1, а <code>9 % 3</code> — це 0. Для <code>10</code> днів вовк приходив 3 рази: на 3-й, 6-й і 9-й.',
      ], [
        'The wolf is sly: he comes on day 3, 6, 9 and so on.',
        'Loop through all the days from 1 to <code>days</code>. If the day’s number divides by 3 with no remainder, add 1 to the counter. After the loop print <code>Вовк приходив: </code> and the counter.',
        'The <code>%</code> sign gives the remainder of a division: <code>7 % 3</code> is 1, and <code>9 % 3</code> is 0. In <code>10</code> days the wolf came 3 times: on days 3, 6 and 9.',
      ]],
      tool: {
        name: () => ['остача від ділення', 'remainder'],
        text: (c) => [[
          '<code>a % b</code> — що лишається, коли <code>a</code> ділиш на <code>b</code>. Якщо 0, то ділиться націло.',
          `Цикл і умова разом: умова всередині циклу перевіряється для кожного повтору. ${c.py ? 'Тому <code>if</code> зсунутий ще на 4 пробіли.' : 'Тому <code>if</code> стоїть усередині фігурних дужок циклу.'}`,
        ], [
          '<code>a % b</code> is what’s left when you divide <code>a</code> by <code>b</code>. If it’s 0, it divides exactly.',
          `A loop and a condition together: the condition inside the loop is checked on every repeat. ${c.py ? 'That’s why the <code>if</code> is indented another 4 spaces.' : 'That’s why the <code>if</code> sits inside the loop’s curly braces.'}`,
        ]],
        code: (c) => pick(c, 'even = 0\nfor i in range(1, 7):\n    if i % 2 == 0:\n        even += 1\nprint(even)   # 3', 'let even = 0;\nfor (let i = 1; i <= 6; i++) {\n  if (i % 2 === 0) {\n    even += 1;\n  }\n}\nconsole.log(even);   // 3'),
      },
      entry: 'wolf', params: [['days', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'wolf', [['days', 'number']], 'void', pick(c,
        '    visits = 0\n    for day in range(1, days + 1):\n        if day % 3 == 0:\n            visits += 1\n    print("Вовк приходив:", visits)\n',
        '  let visits = 0;\n  for (let day = 1; day <= days; day++) {\n    if (day % 3 === 0) {\n      visits += 1;\n    }\n  }\n  console.log("Вовк приходив:", visits);\n',
        '  let visits: number = 0;\n  for (let day = 1; day <= days; day++) {\n    if (day % 3 === 0) {\n      visits += 1;\n    }\n  }\n  console.log("Вовк приходив:", visits);\n')),
      tests: [[10], [3], [2], [9], [20]],
      out: (_c, d: number) => [`Вовк приходив: ${Math.floor(d / 3)}`],
      hints: (c) => [
        ['Лічильник до циклу, умова всередині.', c.py ? 'if day % 3 == 0: visits += 1' : 'if (day % 3 === 0) visits += 1;', pick(c, 'for day in range(1, days + 1):\n    if day % 3 == 0:\n        visits += 1', 'for (let day = 1; day <= days; day++) {\n  if (day % 3 === 0) {\n    visits += 1;\n  }\n}')],
        ['Counter before the loop, condition inside.', c.py ? 'if day % 3 == 0: visits += 1' : 'if (day % 3 === 0) visits += 1;', pick(c, 'for day in range(1, days + 1):\n    if day % 3 == 0:\n        visits += 1', 'for (let day = 1; day <= days; day++) {\n  if (day % 3 === 0) {\n    visits += 1;\n  }\n}')],
      ],
      lesson: () => ['Лічильник рахує лише ті повтори, де умова правдива.', 'A counter counts only the repeats where the condition is true.'],
      quip: () => ['Три візити, і щоразу вовк лишав на смолі трохи хвоста.', 'Three visits, and each time the wolf left a bit of tail in the tar.'],
    },
  ],
};

/* ============================== Розділ 6. Пан Коцький — списки ============================== */

const kotsky: Chapter = {
  key: 'kotsky', name: ['Пан Коцький', 'Lord Kotsky'], topic: ['списки', 'lists'], fox: '#7a7f8c',
  host: ['Кіт назвався паном Коцьким, і звірі прийшли до нього на гостину. Гостей багато, тож тримаймо їх у списку.', 'The cat called himself Lord Kotsky, and the animals came to visit. There are many guests, so let’s keep them in a list.'],
  lessons: [
    {
      key: 'row', title: ['Звірі в ряд', 'Animals in a row'], topic: ['елемент за номером', 'an item by its number'],
      brief: (c) => [`<b>Звірі в ряд.</b> Гості стоять у ${c.py ? 'списку' : 'масиві'} <code>animals</code>. Виведи першого й другого.`, `<b>Animals in a row.</b> The guests stand in the ${c.py ? 'list' : 'array'} <code>animals</code>. Print the first and the second.`],
      statement: (c) => [[
        `${c.py ? '<b>Список</b>' : '<b>Масив</b> (список)'} — кілька значень під одним іменем, по порядку: <code>["вовк", "ведмідь", "кабан", "заєць"]</code>.`,
        'Як і в рядку, номери починаються з нуля: <code>animals[0]</code> — перший гість, <code>animals[1]</code> — другий.',
        'Виведи:<br><code>Перший: вовк</code><br><code>Другий: ведмідь</code><br>Гості щоразу інші.',
      ], [
        `A ${c.py ? '<b>list</b>' : '<b>array</b> (a list)'} is several values under one name, in order: <code>["вовк", "ведмідь", "кабан", "заєць"]</code>.`,
        'Like in a string, numbers start at zero: <code>animals[0]</code> is the first guest, <code>animals[1]</code> the second.',
        'Print:<br><code>Перший: вовк</code><br><code>Другий: ведмідь</code><br>The guests are different each time.',
      ]],
      tool: {
        name: (c) => [c.py ? 'список' : 'масив', c.py ? 'list' : 'array'],
        text: () => [[
          'Значення пишуть у квадратних дужках через кому. До кожного звертаються за номером у квадратних дужках.',
          'У списку можуть бути рядки, числа, будь-що.',
        ], [
          'Values go in square brackets, separated by commas. You reach each one by its number in square brackets.',
          'A list can hold strings, numbers, anything.',
        ]],
        code: (c) => pick(c, 'days = ["пн", "вт", "ср"]\nprint(days[2])   # ср', 'const days = ["пн", "вт", "ср"];\nconsole.log(days[2]);   // ср'),
      },
      entry: 'row', params: [['animals', 'string[]']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'row', [['animals', 'string[]']], 'void', pick(c,
        '    print("Перший:", animals[0])\n    print("Другий:", animals[1])\n',
        '  console.log("Перший:", animals[0]);\n  console.log("Другий:", animals[1]);\n')),
      tests: [[['вовк', 'ведмідь', 'кабан', 'заєць']], [['заєць', 'лисиця']], [['кабан', 'вовк', 'ведмідь']]],
      out: (_c, a: string[]) => [`Перший: ${a[0]}`, `Другий: ${a[1]}`],
      hints: (c) => [
        ['Перший гість має номер 0.', 'animals[0] і animals[1].', `${c.say('"Перший:", animals[0]')}\n${c.say('"Другий:", animals[1]')}`],
        ['The first guest is number 0.', 'animals[0] and animals[1].', `${c.say('"Перший:", animals[0]')}\n${c.say('"Другий:", animals[1]')}`],
      ],
      lesson: (c) => [c.py ? 'Список зберігає значення по порядку, і кожне можна дістати за номером з нуля.' : 'Масив зберігає значення по порядку, і кожне можна дістати за номером з нуля.', c.py ? 'A list keeps values in order, and you can get each one by its number from zero.' : 'An array keeps values in order, and you can get each one by its number from zero.'],
      talk: () => [
        ['Звірі почули про пана Коцького й ідуть знайомитися. Хто перший, хто другий?', 'The animals heard about Lord Kotsky and are coming to meet him. Who’s first, who’s second?'],
        ['Їх же цілий натовп!', 'There’s a whole crowd of them!'],
        ['Тому поставимо їх у ряд, у список. Кожен матиме свій номер.', 'So we’ll line them up in a list. Each will have its own number.'],
      ],
      quip: () => ['Вовк перший, бо найголодніший.', 'The wolf is first, because he’s the hungriest.'],
    },
    {
      key: 'last', title: ['Скільки й хто останній', 'How many and who’s last'], topic: ['довжина й останній елемент', 'length and the last item'],
      brief: () => ['<b>Скільки й хто останній.</b> Виведи, скільки гостей прийшло і хто стоїть останнім.', '<b>How many and who’s last.</b> Print how many guests came and who stands last.'],
      statement: (c) => [[
        `Кількість елементів дає ${c.py ? '<code>len(animals)</code>' : '<code>animals.length</code>'}, як і довжину рядка.`,
        `Останній гість — ${c.py ? '<code>animals[-1]</code>' : '<code>animals[animals.length - 1]</code>'}.`,
        'Для <code>["вовк", "ведмідь", "кабан", "заєць"]</code> виведи:<br><code>Гостей: 4</code><br><code>Останній: заєць</code>',
      ], [
        `${c.py ? '<code>len(animals)</code>' : '<code>animals.length</code>'} gives the number of items, just like a string’s length.`,
        `The last guest is ${c.py ? '<code>animals[-1]</code>' : '<code>animals[animals.length - 1]</code>'}.`,
        'For <code>["вовк", "ведмідь", "кабан", "заєць"]</code> print:<br><code>Гостей: 4</code><br><code>Останній: заєць</code>',
      ]],
      tool: {
        name: () => ['довжина списку', 'list length'],
        text: (c) => [[
          c.py ? 'Те саме, що з рядками: <code>len</code> рахує, <code>[-1]</code> дістає останній.' : 'Те саме, що з рядками: <code>.length</code> рахує, а номер останнього на 1 менший.',
          'Список може бути з одного гостя. Тоді перший і останній — той самий.',
        ], [
          c.py ? 'Same as strings: <code>len</code> counts, <code>[-1]</code> gets the last one.' : 'Same as strings: <code>.length</code> counts, and the last one’s number is 1 less.',
          'A list can have a single guest. Then the first and the last are the same.',
        ]],
        code: (c) => pick(c, 'nums = [4, 8, 15]\nprint(len(nums), nums[-1])   # 3 15', 'const nums = [4, 8, 15];\nconsole.log(nums.length, nums[nums.length - 1]);   // 3 15'),
      },
      entry: 'guests', params: [['animals', 'string[]']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'guests', [['animals', 'string[]']], 'void', pick(c,
        '    print("Гостей:", len(animals))\n    print("Останній:", animals[-1])\n',
        '  console.log("Гостей:", animals.length);\n  console.log("Останній:", animals[animals.length - 1]);\n')),
      tests: [[['вовк', 'ведмідь', 'кабан', 'заєць']], [['заєць']], [['кабан', 'вовк']]],
      out: (_c, a: string[]) => [`Гостей: ${a.length}`, `Останній: ${a[a.length - 1]}`],
      hints: (c) => [
        ['Довжина й останній елемент.', c.py ? 'len(animals) і animals[-1].' : 'animals.length і animals[animals.length - 1].', `${c.say(c.py ? '"Гостей:", len(animals)' : '"Гостей:", animals.length')}\n${c.say(c.py ? '"Останній:", animals[-1]' : '"Останній:", animals[animals.length - 1]')}`],
        ['The length and the last item.', c.py ? 'len(animals) and animals[-1].' : 'animals.length and animals[animals.length - 1].', `${c.say(c.py ? '"Гостей:", len(animals)' : '"Гостей:", animals.length')}\n${c.say(c.py ? '"Останній:", animals[-1]' : '"Останній:", animals[animals.length - 1]')}`],
      ],
      lesson: () => ['Довжина списку — скільки в ньому елементів. Останній має номер на 1 менший.', 'A list’s length is how many items it has. The last one’s number is 1 less.'],
      quip: () => ['Заєць останній: він підходив обережно, озираючись.', 'The hare is last: he came carefully, looking over his shoulder.'],
    },
    {
      key: 'guest', title: ['Ще один гість', 'One more guest'], topic: ['додати в кінець', 'adding to the end'],
      brief: (c) => [`<b>Ще один гість.</b> До гостей виходить сам пан Коцький. Додай його в кінець ${c.py ? 'списку' : 'масиву'}.`, `<b>One more guest.</b> Lord Kotsky himself comes out to the guests. Add him to the end of the ${c.py ? 'list' : 'array'}.`],
      statement: (c) => [[
        `Спершу виведи <code>Було: </code> і кількість гостей. Потім додай у кінець рядок <code>"пан Коцький"</code>: ${c.py ? '<code>animals.append("пан Коцький")</code>' : '<code>animals.push("пан Коцький")</code>'}.`,
        'Після цього виведи <code>Стало: </code> і нову кількість, а тоді <code>Останній: </code> і того, хто тепер останній.',
        'Для чотирьох гостей:<br><code>Було: 4</code><br><code>Стало: 5</code><br><code>Останній: пан Коцький</code>',
      ], [
        `First print <code>Було: </code> and the number of guests. Then add the string <code>"пан Коцький"</code> to the end: ${c.py ? '<code>animals.append("пан Коцький")</code>' : '<code>animals.push("пан Коцький")</code>'}.`,
        'After that print <code>Стало: </code> and the new count, then <code>Останній: </code> and whoever is last now.',
        'For four guests:<br><code>Було: 4</code><br><code>Стало: 5</code><br><code>Останній: пан Коцький</code>',
      ]],
      tool: {
        name: (c) => [c.py ? 'append' : 'push', c.py ? 'append' : 'push'],
        text: (c) => [[
          `${c.py ? '<code>append</code>' : '<code>push</code>'} додає елемент у кінець, і список стає довшим на 1.`,
          'Довжину можна виводити до і після: побачиш, як вона змінилася.',
        ], [
          `${c.py ? '<code>append</code>' : '<code>push</code>'} adds an item to the end, and the list grows by 1.`,
          'You can print the length before and after to see how it changed.',
        ]],
        code: (c) => pick(c, 'bag = ["хліб"]\nbag.append("сир")\nprint(len(bag))   # 2', 'const bag = ["хліб"];\nbag.push("сир");\nconsole.log(bag.length);   // 2'),
      },
      entry: 'arrive', params: [['animals', 'string[]']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'arrive', [['animals', 'string[]']], 'void', pick(c,
        '    print("Було:", len(animals))\n    animals.append("пан Коцький")\n    print("Стало:", len(animals))\n    print("Останній:", animals[-1])\n',
        '  console.log("Було:", animals.length);\n  animals.push("пан Коцький");\n  console.log("Стало:", animals.length);\n  console.log("Останній:", animals[animals.length - 1]);\n')),
      tests: [[['вовк', 'ведмідь', 'кабан', 'заєць']], [['лисиця']], [['кабан', 'вовк']]],
      out: (_c, a: string[]) => [`Було: ${a.length}`, `Стало: ${a.length + 1}`, 'Останній: пан Коцький'],
      hints: (c) => [
        ['Вивести, додати, вивести.', c.py ? 'animals.append("пан Коцький") між двома виводами довжини.' : 'animals.push("пан Коцький") між двома виводами довжини.', pick(c, 'print("Було:", len(animals))\nanimals.append("пан Коцький")\nprint("Стало:", len(animals))', 'console.log("Було:", animals.length);\nanimals.push("пан Коцький");\nconsole.log("Стало:", animals.length);')],
        ['Print, add, print.', c.py ? 'animals.append("пан Коцький") between the two length prints.' : 'animals.push("пан Коцький") between the two length prints.', pick(c, 'print("Було:", len(animals))\nanimals.append("пан Коцький")\nprint("Стало:", len(animals))', 'console.log("Було:", animals.length);\nanimals.push("пан Коцький");\nconsole.log("Стало:", animals.length);')],
      ],
      lesson: (c) => [c.py ? 'append додає елемент у кінець списку.' : 'push додає елемент у кінець масиву.', c.py ? 'append adds an item to the end of a list.' : 'push adds an item to the end of an array.'],
      quip: () => ['Пан Коцький вийшов, фиркнув, і половина гостей сховалася в кущі.', 'Lord Kotsky came out, snorted, and half the guests hid in the bushes.'],
    },
    {
      key: 'each', title: ['Кожному по черзі', 'Each in turn'], topic: ['цикл по списку', 'looping over a list'],
      brief: () => ['<b>Кожному по черзі.</b> Пан Коцький вітається з кожним гостем окремо.', '<b>Each in turn.</b> Lord Kotsky greets each guest separately.'],
      statement: (c) => [[
        'Гостей може бути скільки завгодно, тож без циклу не обійтися.',
        `Пройди по всьому списку: ${c.py ? '<code>for guest in animals:</code>' : '<code>for (const guest of animals) { … }</code>'}. Змінна <code>guest</code> щоразу буде наступним гостем.`,
        'Для кожного виведи <code>Вітаю, </code>, ім\'я і <code>!</code>. Для <code>["вовк", "ведмідь"]</code>: <code>Вітаю, вовк!</code> і <code>Вітаю, ведмідь!</code>.',
      ], [
        'There can be any number of guests, so you need a loop.',
        `Go through the whole list: ${c.py ? '<code>for guest in animals:</code>' : '<code>for (const guest of animals) { … }</code>'}. The variable <code>guest</code> will be the next guest each time.`,
        'For each one print <code>Вітаю, </code>, the name and <code>!</code>. For <code>["вовк", "ведмідь"]</code>: <code>Вітаю, вовк!</code> and <code>Вітаю, ведмідь!</code>.',
      ]],
      tool: {
        name: (c) => [c.py ? 'for … in' : 'for … of', c.py ? 'for … in' : 'for … of'],
        text: (c) => [[
          `${c.py ? '<code>for x in list:</code>' : '<code>for (const x of list)</code>'} проходить усі елементи по черзі, від першого до останнього. Номери тут не потрібні.`,
          'Ім\'я змінної циклу обирай сам. Головне, щоб було зрозуміло, що в ній.',
        ], [
          `${c.py ? '<code>for x in list:</code>' : '<code>for (const x of list)</code>'} goes through all the items in turn, from first to last. No numbers needed.`,
          'You choose the loop variable’s name. Just make it clear what it holds.',
        ]],
        code: (c) => pick(c, 'for fruit in ["яблуко", "груша"]:\n    print("Їм", fruit)', 'for (const fruit of ["яблуко", "груша"]) {\n  console.log("Їм", fruit);\n}'),
      },
      entry: 'welcome', params: [['animals', 'string[]']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'welcome', [['animals', 'string[]']], 'void', pick(c,
        '    for guest in animals:\n        print("Вітаю, " + guest + "!")\n',
        '  for (const guest of animals) {\n    console.log("Вітаю, " + guest + "!");\n  }\n')),
      tests: [[['вовк', 'ведмідь']], [['заєць']], [['вовк', 'ведмідь', 'кабан', 'заєць']]],
      out: (_c, a: string[]) => a.map((g) => `Вітаю, ${g}!`),
      hints: (c) => [
        ['Цикл по всіх гостях, один вивід усередині.', c.py ? 'for guest in animals: і print("Вітаю, " + guest + "!")' : 'for (const guest of animals) і console.log("Вітаю, " + guest + "!")', pick(c, 'for guest in animals:\n    print("Вітаю, " + guest + "!")', 'for (const guest of animals) {\n  console.log("Вітаю, " + guest + "!");\n}')],
        ['A loop over all the guests, one print inside.', c.py ? 'for guest in animals: and print("Вітаю, " + guest + "!")' : 'for (const guest of animals) and console.log("Вітаю, " + guest + "!")', pick(c, 'for guest in animals:\n    print("Вітаю, " + guest + "!")', 'for (const guest of animals) {\n  console.log("Вітаю, " + guest + "!");\n}')],
      ],
      lesson: () => ['Цикл по списку бере елементи по черзі, скільки б їх не було.', 'A loop over a list takes the items in turn, however many there are.'],
      quip: () => ['Усіх привітав. А обідати, схоже, буде сам.', 'He greeted everyone. But it looks like he’ll be dining alone.'],
    },
  ],
};

/* ============================== Розділ 7. Лисичка-сестричка — словники й об'єкти ============================== */

const lysychka: Chapter = {
  key: 'lysychka', name: ['Лисичка-сестричка', 'Sister Fox'], topic: ['словники й об\'єкти', 'dictionaries and objects'], fox: '#c0623a',
  host: ['Лисичка-сестричка веде господарство хитро: що в коморі й скільки, усе записано. Записи «назва → кількість» зручно тримати разом.', 'Sister Fox keeps house cleverly: what’s in the pantry and how much, it’s all written down. “Name → amount” records are handy to keep together.'],
  lessons: [
    {
      key: 'pantry', title: ['Комора', 'The pantry'], topic: ['значення за ключем', 'a value by its key'],
      brief: (c) => [`<b>Комора.</b> Запаси лежать у ${c.py ? 'словнику' : 'об\'єкті'} <code>pantry</code>. Виведи, скільки там меду.`, `<b>The pantry.</b> The supplies are in the ${c.py ? 'dictionary' : 'object'} <code>pantry</code>. Print how much honey there is.`],
      statement: (c) => [[
        `${c.py ? '<b>Словник</b>' : '<b>Об\'єкт</b>'} зберігає пари «ключ → значення»: <code>{"мед": 3, "сало": 2}</code>. Ключ — назва, значення — кількість.`,
        'Дістати значення можна за ключем у квадратних дужках: <code>pantry["мед"]</code>. Це як знайти слово в словнику й прочитати, що поруч.',
        'Виведи <code>Меду: </code> і кількість меду. У коморі можуть бути й інші запаси, і порядок буває різний.',
      ], [
        `A ${c.py ? '<b>dictionary</b>' : '<b>object</b>'} stores “key → value” pairs: <code>{"мед": 3, "сало": 2}</code>. The key is a name, the value an amount.`,
        'You get a value by its key in square brackets: <code>pantry["мед"]</code>. Like looking up a word in a dictionary and reading what’s next to it.',
        'Print <code>Меду: </code> and the amount of honey. The pantry may hold other supplies too, in any order.',
      ]],
      tool: {
        name: (c) => [c.py ? 'словник' : 'об\'єкт', c.py ? 'dictionary' : 'object'],
        text: (c) => [[
          'На відміну від списку, тут не номери, а назви. Порядок неважливий: шукаєш за ключем.',
          c.py ? 'Ключі зазвичай рядки, значення — будь-що.' : 'Ключі в об\'єкті — рядки, значення — будь-що. Можна писати й <code>pantry.мед</code>, але квадратні дужки працюють завжди.',
        ], [
          'Unlike a list, it uses names, not numbers. The order doesn’t matter: you look things up by key.',
          c.py ? 'Keys are usually strings, values anything.' : 'Keys in an object are strings, values anything. You could write <code>pantry.мед</code>, but square brackets always work.',
        ]],
        code: (c) => pick(c, 'ages = {"кіт": 3, "пес": 5}\nprint(ages["пес"])   # 5', 'const ages = { "кіт": 3, "пес": 5 };\nconsole.log(ages["пес"]);   // 5'),
      },
      entry: 'honey', params: [['pantry', 'Record<string, number>']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'honey', [['pantry', 'Record<string, number>']], 'void', pick(c, '    print("Меду:", pantry["мед"])\n', '  console.log("Меду:", pantry["мед"]);\n')),
      tests: [[{ мед: 3, сало: 2 }], [{ сало: 1, мед: 7 }], [{ горіхи: 4, мед: 1, сир: 2 }]],
      out: (_c, p: Record<string, number>) => [`Меду: ${p['мед']}`],
      hints: (c) => [
        ['Ключ — це слово "мед".', 'pantry["мед"] дає кількість меду.', c.say('"Меду:", pantry["мед"]')],
        ['The key is the word "мед".', 'pantry["мед"] gives the amount of honey.', c.say('"Меду:", pantry["мед"]')],
      ],
      lesson: (c) => [c.py ? 'Словник знаходить значення за ключем, без жодних номерів.' : 'Об\'єкт знаходить значення за ключем, без жодних номерів.', c.py ? 'A dictionary finds a value by its key, no numbers involved.' : 'An object finds a value by its key, no numbers involved.'],
      talk: () => [
        ['Лисичка все рахує: скільки меду, скільки сала, скільки горіхів.', 'The fox counts everything: how much honey, how much lard, how many nuts.'],
        ['У списку? По номерах?', 'In a list? By numbers?'],
        ['Ні, за назвами. «Мед — три», «сало — два». Такі пари тримає словник.', 'No, by names. “Honey — three”, “lard — two”. A dictionary holds pairs like that.'],
      ],
      quip: () => ['Три горщики меду. Звідки — Лисичка не скаже.', 'Three pots of honey. Where from, the fox won’t say.'],
    },
    {
      key: 'shelf', title: ['Нове на полиці', 'New on the shelf'], topic: ['додати запис', 'adding a record'],
      brief: () => ['<b>Нове на полиці.</b> Лисичка принесла щось нове. Додай запис у комору й виведи, скільки тепер записів.', '<b>New on the shelf.</b> The fox brought something new. Add a record to the pantry and print how many records there are now.'],
      statement: (c) => [[
        'Що принесла, лежить у <code>item</code>, скільки — у <code>count</code>.',
        `Новий запис додають так само, як читають: <code>pantry[item] = count</code>. Якщо такого ключа ще не було, він з'явиться. Кількість записів дає ${c.py ? '<code>len(pantry)</code>' : '<code>Object.keys(pantry).length</code>'}.`,
        'Виведи два рядки. Для комори <code>{"мед": 3, "сало": 2}</code>, <code>"пиріжки"</code> і <code>4</code>:<br><code>Записів: 3</code><br><code>пиріжки: 4</code><br>Другий рядок бери з комори, а не зі змінної <code>count</code>.',
      ], [
        'What she brought is in <code>item</code>, how much in <code>count</code>.',
        `You add a record the same way you read one: <code>pantry[item] = count</code>. If the key didn’t exist yet, it appears. ${c.py ? '<code>len(pantry)</code>' : '<code>Object.keys(pantry).length</code>'} gives the number of records.`,
        'Print two lines. For the pantry <code>{"мед": 3, "сало": 2}</code>, <code>"пиріжки"</code> and <code>4</code>:<br><code>Записів: 3</code><br><code>пиріжки: 4</code><br>Take the second line from the pantry, not from the variable <code>count</code>.',
      ]],
      tool: {
        name: () => ['новий ключ', 'a new key'],
        text: (c) => [[
          '<code>pantry["горіхи"] = 10</code> кладе 10 під ключ «горіхи». Якщо ключ уже був, старе значення заміниться.',
          c.py ? 'Кількість пар у словнику — <code>len(pantry)</code>, як у списку.' : '<code>Object.keys(pantry)</code> дає масив ключів, а в масиву є <code>.length</code>.',
        ], [
          '<code>pantry["горіхи"] = 10</code> puts 10 under the key “горіхи”. If the key existed, the old value is replaced.',
          c.py ? 'The number of pairs in a dictionary is <code>len(pantry)</code>, like a list.' : '<code>Object.keys(pantry)</code> gives an array of the keys, and an array has <code>.length</code>.',
        ]],
        code: (c) => pick(c, 'box = {"цукерки": 2}\nbox["печиво"] = 5\nprint(len(box))   # 2', 'const box = { "цукерки": 2 };\nbox["печиво"] = 5;\nconsole.log(Object.keys(box).length);   // 2'),
      },
      entry: 'shelf', params: [['pantry', 'Record<string, number>'], ['item', 'string'], ['count', 'number']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'shelf', [['pantry', 'Record<string, number>'], ['item', 'string'], ['count', 'number']], 'void', pick(c,
        '    pantry[item] = count\n    print("Записів:", len(pantry))\n    print(item + ":", pantry[item])\n',
        '  pantry[item] = count;\n  console.log("Записів:", Object.keys(pantry).length);\n  console.log(item + ":", pantry[item]);\n')),
      tests: [[{ мед: 3, сало: 2 }, 'пиріжки', 4], [{ мед: 1 }, 'горіхи', 10], [{ сир: 2, мед: 5, сало: 1 }, 'гриби', 3]],
      out: (_c, p: Record<string, number>, item: string, n: number) => [`Записів: ${Object.keys(p).length + (item in p ? 0 : 1)}`, `${item}: ${n}`],
      hints: (c) => [
        ['Спершу додай запис, потім рахуй.', c.py ? 'pantry[item] = count, потім len(pantry).' : 'pantry[item] = count, потім Object.keys(pantry).length.', pick(c, 'pantry[item] = count\nprint("Записів:", len(pantry))\nprint(item + ":", pantry[item])', 'pantry[item] = count;\nconsole.log("Записів:", Object.keys(pantry).length);\nconsole.log(item + ":", pantry[item]);')],
        ['Add the record first, then count.', c.py ? 'pantry[item] = count, then len(pantry).' : 'pantry[item] = count, then Object.keys(pantry).length.', pick(c, 'pantry[item] = count\nprint("Записів:", len(pantry))\nprint(item + ":", pantry[item])', 'pantry[item] = count;\nconsole.log("Записів:", Object.keys(pantry).length);\nconsole.log(item + ":", pantry[item]);')],
      ],
      lesson: () => ['Новий ключ додають так само, як читають: записом у квадратних дужках.', 'You add a new key the same way you read one: by writing into square brackets.'],
      quip: () => ['Пиріжки на полиці. Лисичка каже, що спекла сама. Віримо.', 'Pies on the shelf. The fox says she baked them herself. Sure.'],
    },
    {
      key: 'list', title: ['Опис комори', 'The pantry list'], topic: ['цикл по парах', 'looping over pairs'],
      brief: () => ['<b>Опис комори.</b> Виведи все, що є в коморі: кожен запис окремим рядком.', '<b>The pantry list.</b> Print everything in the pantry: each record on its own line.'],
      statement: (c) => [[
        'Перед зимою Лисичка переписує всі запаси.',
        `Пройди по всіх парах: ${c.py ? '<code>for name, amount in pantry.items():</code>' : '<code>for (const [name, amount] of Object.entries(pantry)) { … }</code>'}. Щоразу <code>name</code> — назва, а <code>amount</code> — кількість.`,
        'Для кожної пари виведи назву, тире й кількість. Для <code>{"мед": 3, "сало": 2}</code>:<br><code>мед — 3</code><br><code>сало — 2</code>',
      ], [
        'Before winter the fox writes down all her supplies.',
        `Go through all the pairs: ${c.py ? '<code>for name, amount in pantry.items():</code>' : '<code>for (const [name, amount] of Object.entries(pantry)) { … }</code>'}. Each time <code>name</code> is the name and <code>amount</code> the amount.`,
        'For each pair print the name, a dash and the amount. For <code>{"мед": 3, "сало": 2}</code>:<br><code>мед — 3</code><br><code>сало — 2</code>',
      ]],
      tool: {
        name: (c) => [c.py ? 'items()' : 'Object.entries', c.py ? 'items()' : 'Object.entries'],
        text: (c) => [[
          c.py ? '<code>pantry.items()</code> дає пари (ключ, значення). У циклі їх одразу розкладають на дві змінні.' : '<code>Object.entries(pantry)</code> дає масив пар [ключ, значення]. У циклі їх одразу розкладають на дві змінні.',
          'Пари йдуть у тому порядку, в якому їх додавали.',
        ], [
          c.py ? '<code>pantry.items()</code> gives (key, value) pairs. In the loop you unpack them straight into two variables.' : '<code>Object.entries(pantry)</code> gives an array of [key, value] pairs. In the loop you unpack them straight into two variables.',
          'The pairs come in the order they were added.',
        ]],
        code: (c) => pick(c, 'for pet, age in {"кіт": 3, "пес": 5}.items():\n    print(pet, age)', 'for (const [pet, age] of Object.entries({ "кіт": 3, "пес": 5 })) {\n  console.log(pet, age);\n}'),
      },
      entry: 'stock', params: [['pantry', 'Record<string, number>']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'stock', [['pantry', 'Record<string, number>']], 'void', pick(c,
        '    for name, amount in pantry.items():\n        print(name, "—", amount)\n',
        '  for (const [name, amount] of Object.entries(pantry)) {\n    console.log(name, "—", amount);\n  }\n')),
      tests: [[{ мед: 3, сало: 2 }], [{ горіхи: 10 }], [{ сир: 2, мед: 5, гриби: 1 }]],
      out: (_c, p: Record<string, number>) => Object.entries(p).map(([k, v]) => `${k} — ${v}`),
      hints: (c) => [
        ['Цикл по парах, у кожній дві частини.', c.py ? 'for name, amount in pantry.items():' : 'for (const [name, amount] of Object.entries(pantry))', pick(c, 'for name, amount in pantry.items():\n    print(name, "—", amount)', 'for (const [name, amount] of Object.entries(pantry)) {\n  console.log(name, "—", amount);\n}')],
        ['A loop over pairs, each with two parts.', c.py ? 'for name, amount in pantry.items():' : 'for (const [name, amount] of Object.entries(pantry))', pick(c, 'for name, amount in pantry.items():\n    print(name, "—", amount)', 'for (const [name, amount] of Object.entries(pantry)) {\n  console.log(name, "—", amount);\n}')],
      ],
      lesson: (c) => [c.py ? 'items() дає всі пари словника, і їх можна пройти циклом.' : 'Object.entries дає всі пари об\'єкта, і їх можна пройти циклом.', c.py ? 'items() gives all of a dictionary’s pairs, and you can loop over them.' : 'Object.entries gives all of an object’s pairs, and you can loop over them.'],
      quip: () => ['Опис готовий. Зима не страшна, особливо коли комора не твоя.', 'The list is ready. Winter isn’t scary, especially when the pantry isn’t yours.'],
    },
    {
      key: 'count', title: ['Хто скільки разів', 'Who came how often'], topic: ['рахувати за допомогою словника', 'counting with a dictionary'],
      brief: () => ['<b>Хто скільки разів.</b> Лисичка записувала, хто приходив до її хатки. Порахуй, скільки разів був кожен.', '<b>Who came how often.</b> The fox wrote down who came to her hut. Count how many times each one came.'],
      statement: (c) => [[
        `Відвідувачі лежать у ${c.py ? 'списку' : 'масиві'} <code>visitors</code> по черзі, і хтось може трапитися кілька разів.`,
        `Заведи порожній ${c.py ? 'словник <code>counts = {}</code>' : 'об\'єкт <code>counts = {}</code>'}. Для кожного відвідувача збільш його лічильник на 1. Якщо його ще немає, почни з 0: ${c.py ? '<code>counts.get(name, 0) + 1</code>' : '<code>(counts[name] || 0) + 1</code>'}.`,
        'Потім виведи кожного в порядку першої появи. Для <code>["вовк", "ведмідь", "вовк", "заєць", "вовк"]</code>:<br><code>вовк: 3</code><br><code>ведмідь: 1</code><br><code>заєць: 1</code>',
      ], [
        `The visitors are in the ${c.py ? 'list' : 'array'} <code>visitors</code> in order, and someone may appear several times.`,
        `Make an empty ${c.py ? 'dictionary <code>counts = {}</code>' : 'object <code>counts = {}</code>'}. For each visitor add 1 to their counter. If they aren’t there yet, start from 0: ${c.py ? '<code>counts.get(name, 0) + 1</code>' : '<code>(counts[name] || 0) + 1</code>'}.`,
        'Then print each one in order of first appearance. For <code>["вовк", "ведмідь", "вовк", "заєць", "вовк"]</code>:<br><code>вовк: 3</code><br><code>ведмідь: 1</code><br><code>заєць: 1</code>',
      ]],
      tool: {
        name: () => ['словник-лічильник', 'a counting dictionary'],
        text: (c) => [[
          c.py ? '<code>counts.get(name, 0)</code> дає значення за ключем, а якщо ключа немає, то 0. Так не буде помилки на першій появі.' : '<code>counts[name] || 0</code> дає значення за ключем, а якщо ключа немає, то 0. Так не буде помилки на першій появі.',
          'Два цикли: першим рахуєш, другим виводиш. Це звичний прийом: він трапиться й у справжніх задачах.',
        ], [
          c.py ? '<code>counts.get(name, 0)</code> gives the value for the key, or 0 if the key isn’t there. So the first appearance doesn’t cause an error.' : '<code>counts[name] || 0</code> gives the value for the key, or 0 if the key isn’t there. So the first appearance doesn’t cause an error.',
          'Two loops: the first counts, the second prints. It’s a common trick: you’ll meet it in real problems too.',
        ]],
        code: (c) => pick(c, 'votes = {}\nfor v in ["так", "ні", "так"]:\n    votes[v] = votes.get(v, 0) + 1\nprint(votes["так"])   # 2', 'const votes = {};\nfor (const v of ["так", "ні", "так"]) {\n  votes[v] = (votes[v] || 0) + 1;\n}\nconsole.log(votes["так"]);   // 2', 'const votes: Record<string, number> = {};\nfor (const v of ["так", "ні", "так"]) {\n  votes[v] = (votes[v] || 0) + 1;\n}\nconsole.log(votes["так"]);   // 2'),
      },
      entry: 'visits', params: [['visitors', 'string[]']], ret: 'void',
      body: EMPTY,
      solution: (c) => full(c, 'visits', [['visitors', 'string[]']], 'void', pick(c,
        '    counts = {}\n    for name in visitors:\n        counts[name] = counts.get(name, 0) + 1\n    for name, n in counts.items():\n        print(name + ":", n)\n',
        '  const counts = {};\n  for (const name of visitors) {\n    counts[name] = (counts[name] || 0) + 1;\n  }\n  for (const [name, n] of Object.entries(counts)) {\n    console.log(name + ":", n);\n  }\n',
        '  const counts: Record<string, number> = {};\n  for (const name of visitors) {\n    counts[name] = (counts[name] || 0) + 1;\n  }\n  for (const [name, n] of Object.entries(counts)) {\n    console.log(name + ":", n);\n  }\n')),
      tests: [[['вовк', 'ведмідь', 'вовк', 'заєць', 'вовк']], [['заєць', 'заєць']], [['кабан', 'вовк', 'кабан', 'ведмідь']]],
      out: (_c, v: string[]) => {
        const m = new Map<string, number>();
        for (const x of v) m.set(x, (m.get(x) ?? 0) + 1);
        return [...m].map(([k, n]) => `${k}: ${n}`);
      },
      hints: (c) => [
        ['Спершу порахуй усіх, потім виведи.', c.py ? 'counts[name] = counts.get(name, 0) + 1 у першому циклі, items() у другому.' : 'counts[name] = (counts[name] || 0) + 1 у першому циклі, Object.entries у другому.', pick(c, 'for name in visitors:\n    counts[name] = counts.get(name, 0) + 1', 'for (const name of visitors) {\n  counts[name] = (counts[name] || 0) + 1;\n}')],
        ['Count everyone first, then print.', c.py ? 'counts[name] = counts.get(name, 0) + 1 in the first loop, items() in the second.' : 'counts[name] = (counts[name] || 0) + 1 in the first loop, Object.entries in the second.', pick(c, 'for name in visitors:\n    counts[name] = counts.get(name, 0) + 1', 'for (const name of visitors) {\n  counts[name] = (counts[name] || 0) + 1;\n}')],
      ],
      lesson: () => ['Словник-лічильник рахує, скільки разів трапилося кожне значення.', 'A counting dictionary tallies how many times each value appeared.'],
      quip: () => ['Вовк тричі! Лисичка вирішила, що час переїжджати.', 'The wolf three times! The fox decided it’s time to move.'],
    },
  ],
};

/* ============================== Розділ 8. Івасик-Телесик — функції ============================== */

const telesyk: Chapter = {
  key: 'telesyk', name: ['Івасик-Телесик', 'Ivasyk-Telesyk'], topic: ['функції', 'functions'], fox: '#2f6db5',
  host: ['Івасик-Телесик рибалить на човнику, а мама кличе його пісенькою. Навчимо програму складати власні команди: функції.', 'Ivasyk-Telesyk fishes from his little boat, and his mother calls him with a song. Let’s teach the program to make its own commands: functions.'],
  lessons: [
    {
      key: 'return', title: ['Поверни відповідь', 'Return the answer'], topic: ['return', 'return'],
      brief: () => ['<b>Поверни відповідь.</b> Функція <code>double</code> має повертати подвоєне число. Головну функцію вже написано, вона виводить результат.', '<b>Return the answer.</b> The function <code>double</code> must return the number doubled. The main function is already written, it prints the result.'],
      statement: (c) => [[
        'Досі всі наші функції щось виводили. Але функція може й <b>повертати</b> відповідь, а вже той, хто її викликав, вирішить, що з нею робити.',
        `Угорі стоїть функція <code>double(n)</code>. Зараз вона повертає 0. Зроби так, щоб вона повертала <code>n * 2</code>: ${c.py ? '<code>return n * 2</code>' : '<code>return n * 2;</code>'}.`,
        'Головна функція <code>fish</code> викликає <code>double</code> і виводить <code>Риб: …</code>. Івасик наловив 3 риби, а мама каже «удвічі більше»: <code>Риб: 6</code>.',
      ], [
        'So far all our functions printed something. But a function can also <b>return</b> an answer, and whoever called it decides what to do with it.',
        `At the top is the function <code>double(n)</code>. Right now it returns 0. Make it return <code>n * 2</code>: ${c.py ? '<code>return n * 2</code>' : '<code>return n * 2;</code>'}.`,
        'The main function <code>fish</code> calls <code>double</code> and prints <code>Риб: …</code>. Ivasyk caught 3 fish, and mum says “twice as many”: <code>Риб: 6</code>.',
      ]],
      tool: {
        name: () => ['return', 'return'],
        text: (c) => [[
          '<code>return</code> завершує функцію й віддає значення назад, туди, де її викликали.',
          `Виклик функції стає її відповіддю: якщо <code>double(3)</code> повертає 6, то ${c.say('double(3)')} виведе 6.`,
        ], [
          '<code>return</code> ends the function and hands a value back to where it was called.',
          `A function call becomes its answer: if <code>double(3)</code> returns 6, then ${c.say('double(3)')} prints 6.`,
        ]],
        code: (c) => pick(c, 'def plus_one(x):\n    return x + 1\n\nprint(plus_one(4))   # 5', 'function plusOne(x) {\n  return x + 1;\n}\nconsole.log(plusOne(4));   // 5', 'function plusOne(x: number): number {\n  return x + 1;\n}\nconsole.log(plusOne(4));   // 5'),
      },
      entry: 'fish', params: [['caught', 'number']], ret: 'void',
      pre: (c) => pick(c, 'def double(n):\n    # {{here}}\n    return 0\n\n\n', 'function double(n) {\n  // {{here}}\n  return 0;\n}\n\n', 'function double(n: number): number {\n  // {{here}}\n  return 0;\n}\n\n'),
      body: (c) => pick(c, '    print("Риб:", double(caught))\n', '  console.log("Риб:", double(caught));\n'),
      solution: (c) => full(c, 'fish', [['caught', 'number']], 'void', pick(c, '    print("Риб:", double(caught))\n', '  console.log("Риб:", double(caught));\n'),
        pick(c, 'def double(n):\n    return n * 2\n\n\n', 'function double(n) {\n  return n * 2;\n}\n\n', 'function double(n: number): number {\n  return n * 2;\n}\n\n')),
      tests: [[3], [5], [12]],
      out: (_c, n: number) => [`Риб: ${n * 2}`],
      hints: (c) => [
        ['Змінювати треба лише функцію double.', 'Замість 0 поверни n * 2.', c.py ? 'return n * 2' : 'return n * 2;'],
        ['Only the function double needs changing.', 'Instead of 0 return n * 2.', c.py ? 'return n * 2' : 'return n * 2;'],
      ],
      lesson: () => ['return віддає відповідь функції, і її можна вивести чи використати далі.', 'return hands back the function’s answer, which you can print or use further.'],
      talk: () => [
        ['Івасик-Телесик рибалить, а мама рахує улов. Хай програма рахує разом із нею.', 'Ivasyk-Telesyk is fishing, and mum counts the catch. Let the program count with her.'],
        ['Знову виводити?', 'Printing again?'],
        ['Цього разу повертати. Функція відповідає, а що робити з відповіддю — вирішує інша частина програми.', 'This time returning. The function answers, and another part of the program decides what to do with the answer.'],
      ],
      quip: () => ['Шість рибин. Мама вже чистить на юшку.', 'Six fish. Mum is already cleaning them for soup.'],
    },
    {
      key: 'params', title: ['Кілька параметрів', 'Several parameters'], topic: ['функція з двома параметрами', 'a function with two parameters'],
      brief: () => ['<b>Кілька параметрів.</b> Функція <code>total</code> отримує, скільки риб за день і скільки днів, і повертає весь улов.', '<b>Several parameters.</b> The function <code>total</code> gets how many fish per day and how many days, and returns the whole catch.'],
      statement: () => [[
        'Функція може приймати кілька значень. Їх перелічують через кому в дужках: <code>total(fish, days)</code>.',
        'Допиши <code>total</code>: вона має повертати <code>fish * days</code>. Головна функція викликає її двічі, для тижня й для трьох днів.',
        'Для 2 риб на день:<br><code>За тиждень: 14</code><br><code>За три дні: 6</code>',
      ], [
        'A function can take several values. You list them with commas in the parentheses: <code>total(fish, days)</code>.',
        'Finish <code>total</code>: it must return <code>fish * days</code>. The main function calls it twice, for a week and for three days.',
        'For 2 fish a day:<br><code>За тиждень: 14</code><br><code>За три дні: 6</code>',
      ]],
      tool: {
        name: () => ['параметри', 'parameters'],
        text: () => [[
          'Параметри — це змінні, у які потрапляють значення з виклику. У виклику <code>total(2, 7)</code> маємо <code>fish = 2</code> і <code>days = 7</code>.',
          'Одну функцію можна викликати скільки завгодно разів з різними значеннями. Для цього вона й потрібна.',
        ], [
          'Parameters are variables that receive the values from the call. In the call <code>total(2, 7)</code>, <code>fish = 2</code> and <code>days = 7</code>.',
          'You can call one function as many times as you like with different values. That’s what it’s for.',
        ]],
        code: (c) => pick(c, 'def area(w, h):\n    return w * h\n\nprint(area(3, 4))   # 12', 'function area(w, h) {\n  return w * h;\n}\nconsole.log(area(3, 4));   // 12', 'function area(w: number, h: number): number {\n  return w * h;\n}\nconsole.log(area(3, 4));   // 12'),
      },
      entry: 'week', params: [['fish', 'number']], ret: 'void',
      pre: (c) => pick(c, 'def total(fish, days):\n    # {{here}}\n    return 0\n\n\n', 'function total(fish, days) {\n  // {{here}}\n  return 0;\n}\n\n', 'function total(fish: number, days: number): number {\n  // {{here}}\n  return 0;\n}\n\n'),
      body: (c) => pick(c, '    print("За тиждень:", total(fish, 7))\n    print("За три дні:", total(fish, 3))\n', '  console.log("За тиждень:", total(fish, 7));\n  console.log("За три дні:", total(fish, 3));\n'),
      solution: (c) => full(c, 'week', [['fish', 'number']], 'void',
        pick(c, '    print("За тиждень:", total(fish, 7))\n    print("За три дні:", total(fish, 3))\n', '  console.log("За тиждень:", total(fish, 7));\n  console.log("За три дні:", total(fish, 3));\n'),
        pick(c, 'def total(fish, days):\n    return fish * days\n\n\n', 'function total(fish, days) {\n  return fish * days;\n}\n\n', 'function total(fish: number, days: number): number {\n  return fish * days;\n}\n\n')),
      tests: [[2], [5], [1]],
      out: (_c, f: number) => [`За тиждень: ${f * 7}`, `За три дні: ${f * 3}`],
      hints: (c) => [
        ['Обидва параметри вже є, треба лише їх перемножити.', 'return fish * days', c.py ? 'return fish * days' : 'return fish * days;'],
        ['Both parameters are already there, you just multiply them.', 'return fish * days', c.py ? 'return fish * days' : 'return fish * days;'],
      ],
      lesson: () => ['Функція з параметрами працює для будь-яких значень, які їй передадуть.', 'A function with parameters works for whatever values it’s given.'],
      quip: () => ['Чотирнадцять за тиждень. Сусіди вже ходять до Івасика по рибу.', 'Fourteen a week. The neighbours already come to Ivasyk for fish.'],
    },
    {
      key: 'own', title: ['Своя функція', 'Your own function'], topic: ['функція повертає рядок', 'a function that returns a string'],
      brief: () => ['<b>Своя функція.</b> Функція <code>song</code> складає мамину пісеньку для будь-якого імені. Головна функція виводить її.', '<b>Your own function.</b> The function <code>song</code> makes mum’s song for any name. The main function prints it.'],
      statement: () => [[
        'Мама кличе Івасика з берега: «Івасику-Телесику, приплинь до бережка!».',
        'Допиши функцію <code>song(name)</code>: вона повертає рядок з імені й <code>, приплинь до бережка!</code>. Для <code>"Івасику-Телесику"</code> це <code>Івасику-Телесику, приплинь до бережка!</code>.',
        'Головна функція виведе пісеньку, а за нею рядок <code>Човник пливе до бережка</code>. Його вже написано.',
      ], [
        'Mum calls Ivasyk from the shore: “Ivasyku-Telesyku, swim to the shore!”',
        'Finish the function <code>song(name)</code>: it returns a string made of the name and <code>, приплинь до бережка!</code>. For <code>"Івасику-Телесику"</code> that’s <code>Івасику-Телесику, приплинь до бережка!</code>.',
        'The main function prints the song, followed by the line <code>Човник пливе до бережка</code>. That part is already written.',
      ]],
      tool: {
        name: () => ['повернути рядок', 'returning a string'],
        text: () => [[
          'Функція може повертати не лише числа, а й рядки, списки, будь-що.',
          'Склей рядок так само, як у Колобку: ім\'я + текст. Але не виводь його, а поверни.',
        ], [
          'A function can return not only numbers but also strings, lists, anything.',
          'Join the string just like in the Bun chapter: name + text. But don’t print it, return it.',
        ]],
        code: (c) => pick(c, 'def hello(name):\n    return "Привіт, " + name\n\nprint(hello("Оля"))   # Привіт, Оля', 'function hello(name) {\n  return "Привіт, " + name;\n}\nconsole.log(hello("Оля"));   // Привіт, Оля', 'function hello(name: string): string {\n  return "Привіт, " + name;\n}\nconsole.log(hello("Оля"));   // Привіт, Оля'),
      },
      entry: 'call', params: [['name', 'string']], ret: 'void',
      pre: (c) => pick(c, 'def song(name):\n    # {{here}}\n    return ""\n\n\n', 'function song(name) {\n  // {{here}}\n  return "";\n}\n\n', 'function song(name: string): string {\n  // {{here}}\n  return "";\n}\n\n'),
      body: (c) => pick(c, '    print(song(name))\n    print("Човник пливе до бережка")\n', '  console.log(song(name));\n  console.log("Човник пливе до бережка");\n'),
      solution: (c) => full(c, 'call', [['name', 'string']], 'void',
        pick(c, '    print(song(name))\n    print("Човник пливе до бережка")\n', '  console.log(song(name));\n  console.log("Човник пливе до бережка");\n'),
        pick(c, 'def song(name):\n    return name + ", приплинь до бережка!"\n\n\n', 'function song(name) {\n  return name + ", приплинь до бережка!";\n}\n\n', 'function song(name: string): string {\n  return name + ", приплинь до бережка!";\n}\n\n')),
      tests: [['Івасику-Телесику'], ['Синочку'], ['Івасику']],
      out: (_c, n: string) => [`${n}, приплинь до бережка!`, 'Човник пливе до бережка'],
      hints: (c) => [
        ['Поверни, а не виводь.', 'name + ", приплинь до бережка!"', c.py ? 'return name + ", приплинь до бережка!"' : 'return name + ", приплинь до бережка!";'],
        ['Return it, don’t print it.', 'name + ", приплинь до бережка!"', c.py ? 'return name + ", приплинь до бережка!"' : 'return name + ", приплинь до бережка!";'],
      ],
      lesson: () => ['Функція, що повертає рядок, дає готовий текст, а вивести його вирішує інша частина.', 'A function that returns a string hands over finished text, and another part decides to print it.'],
      quip: () => ['Івасик почув мамин голос і погріб до берега.', 'Ivasyk heard mum’s voice and rowed to the shore.'],
    },
    {
      key: 'all', title: ['Усе разом', 'All together'], topic: ['функція, умова й цикл', 'a function, a condition and a loop'],
      brief: (c) => [`<b>Усе разом.</b> Відьма підробляє мамин голос. Напиши функцію, що впізнає маму, і пройди циклом усі голоси з берега.`, `<b>All together.</b> The witch fakes mum’s voice. Write a function that recognises mum, and loop over all the voices from the shore.`],
      statement: (c) => [[
        'Мама співає тонким голосом, а відьма грубим. Івасик пливе лише на мамин.',
        `Спершу допиши ${c.py ? '<code>is_mother(voice)</code>' : '<code>isMother(voice)</code>'}: вона повертає ${c.py ? '<code>True</code>' : '<code>true</code>'}, якщо голос <code>"тонкий"</code>, інакше ${c.py ? '<code>False</code>' : '<code>false</code>'}. Порівняння саме дає таке значення, тож можна просто ${c.py ? '<code>return voice == "тонкий"</code>' : '<code>return voice === "тонкий";</code>'}.`,
        `Потім у головній функції пройди ${c.py ? 'список' : 'масив'} <code>voices</code>. Для кожного голосу: якщо це мама, виведи <code>Пливу до мами!</code>, інакше — <code>Не попливу!</code>.`,
      ], [
        'Mum sings in a thin voice, the witch in a rough one. Ivasyk only swims to mum’s.',
        `First finish ${c.py ? '<code>is_mother(voice)</code>' : '<code>isMother(voice)</code>'}: it returns ${c.py ? '<code>True</code>' : '<code>true</code>'} if the voice is <code>"тонкий"</code>, otherwise ${c.py ? '<code>False</code>' : '<code>false</code>'}. A comparison already gives such a value, so you can just ${c.py ? '<code>return voice == "тонкий"</code>' : '<code>return voice === "тонкий";</code>'}.`,
        `Then in the main function go through the ${c.py ? 'list' : 'array'} <code>voices</code>. For each voice: if it’s mum, print <code>Пливу до мами!</code>, otherwise <code>Не попливу!</code>.`,
      ]],
      tool: {
        name: () => ['усе разом', 'everything together'],
        text: (c) => [[
          `Функцію, що повертає так чи ні, зручно ставити прямо в умову: ${c.py ? '<code>if is_mother(voice):</code>' : '<code>if (isMother(voice))</code>'}.`,
          'Так програма читається майже як речення: «якщо це мама, пливи».',
        ], [
          `A function that returns yes or no fits right into a condition: ${c.py ? '<code>if is_mother(voice):</code>' : '<code>if (isMother(voice))</code>'}.`,
          'That way the program reads almost like a sentence: “if it’s mum, swim”.',
        ]],
        code: (c) => pick(c, 'def is_even(n):\n    return n % 2 == 0\n\nfor n in [1, 2]:\n    if is_even(n):\n        print(n, "парне")', 'function isEven(n) {\n  return n % 2 === 0;\n}\nfor (const n of [1, 2]) {\n  if (isEven(n)) {\n    console.log(n, "парне");\n  }\n}', 'function isEven(n: number): boolean {\n  return n % 2 === 0;\n}\nfor (const n of [1, 2]) {\n  if (isEven(n)) {\n    console.log(n, "парне");\n  }\n}'),
      },
      entry: 'shore', params: [['voices', 'string[]']], ret: 'void',
      pre: (c) => pick(c, 'def is_mother(voice):\n    # {{here}}\n    return False\n\n\n', 'function isMother(voice) {\n  // {{here}}\n  return false;\n}\n\n', 'function isMother(voice: string): boolean {\n  // {{here}}\n  return false;\n}\n\n'),
      body: EMPTY,
      solution: (c) => full(c, 'shore', [['voices', 'string[]']], 'void',
        pick(c, '    for voice in voices:\n        if is_mother(voice):\n            print("Пливу до мами!")\n        else:\n            print("Не попливу!")\n', '  for (const voice of voices) {\n    if (isMother(voice)) {\n      console.log("Пливу до мами!");\n    } else {\n      console.log("Не попливу!");\n    }\n  }\n'),
        pick(c, 'def is_mother(voice):\n    return voice == "тонкий"\n\n\n', 'function isMother(voice) {\n  return voice === "тонкий";\n}\n\n', 'function isMother(voice: string): boolean {\n  return voice === "тонкий";\n}\n\n')),
      tests: [[['тонкий', 'грубий', 'тонкий']], [['грубий']], [['грубий', 'тонкий']]],
      out: (_c, v: string[]) => v.map((x) => (x === 'тонкий' ? 'Пливу до мами!' : 'Не попливу!')),
      hints: (c) => [
        ['Дві частини: функція, що відповідає так чи ні, і цикл з умовою.', c.py ? 'return voice == "тонкий", а в циклі if is_mother(voice): … else: …' : 'return voice === "тонкий";, а в циклі if (isMother(voice)) { … } else { … }', pick(c, 'for voice in voices:\n    if is_mother(voice):\n        print("Пливу до мами!")\n    else:\n        print("Не попливу!")', 'for (const voice of voices) {\n  if (isMother(voice)) {\n    console.log("Пливу до мами!");\n  } else {\n    console.log("Не попливу!");\n  }\n}')],
        ['Two parts: a function that answers yes or no, and a loop with a condition.', c.py ? 'return voice == "тонкий", and in the loop if is_mother(voice): … else: …' : 'return voice === "тонкий";, and in the loop if (isMother(voice)) { … } else { … }', pick(c, 'for voice in voices:\n    if is_mother(voice):\n        print("Пливу до мами!")\n    else:\n        print("Не попливу!")', 'for (const voice of voices) {\n  if (isMother(voice)) {\n    console.log("Пливу до мами!");\n  } else {\n    console.log("Не попливу!");\n  }\n}')],
      ],
      lesson: () => ['Функції, умови й цикли разом — це вже справжня програма.', 'Functions, conditions and loops together make a real program.'],
      quip: () => ['Відьма лишилася ні з чим, а Абетку пройдено. Тепер — до Трої, до справжніх задач!', 'The witch is left with nothing, and the ABC is done. Now on to Troy and real problems!'],
    },
  ],
};

export const tracks: Record<Lang, World[]> = build([kolobok, ripka, horoshko, koza, bychok, kotsky, lysychka, telesyk]);
export const trackLevels: Level[] = LANGS.flatMap((l) => tracks[l].flatMap((w) => w.levels));

/** Розділи, які ще пишуться: показуємо на мапі «Абетки» як «скоро». Зараз усі вісім готові. */
export const PLANNED: { name: Two; topic: Two }[] = [];
