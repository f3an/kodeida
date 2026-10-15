/*
 * Микита-тренер: замість загального «не так» — порада під конкретну помилку новачка.
 * Дивиться на код гравця (без коментарів) і на результат запуску чи Суду богів.
 * Кожна функція повертає пораду або null — тоді гра каже своє звичне.
 */
import type { Level } from '../engine/level.ts';
import type { CallResult, JudgeReport } from '../engine/types.ts';
import { L, uiLang } from '../i18n.ts';

export interface Advice { who: 'fox' | 'sibyl' | 'host'; text: () => string }

const COMMANDS = ['move', 'take', 'jump', 'fireAhead', 'atEnd'];

/** Код без коментарів; другий варіант — ще й без вмісту рядків. */
function clean(code: string) {
  const noComments = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  return { code: noComments, bare: noComments.replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '""') };
}

/** Тіло функції гравця (між першою { і останньою }): чи там щось написано. */
const bodyOf = (bare: string) => { const a = bare.indexOf('{'), b = bare.lastIndexOf('}'); return a < 0 || b <= a ? '' : bare.slice(a + 1, b).trim(); };

function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const closest = (name: string) => {
  const best = COMMANDS.map((c) => [c, c.toLowerCase() === name.toLowerCase() ? 0 : distance(c.toLowerCase(), name.toLowerCase())] as const).sort((x, y) => x[1] - y[1])[0];
  return best[1] <= 2 ? best[0] : null;
};

const usesLoop = (bare: string) => /\b(for|while)\s*\(/.test(bare);
const fox = (uk: string, en: string): Advice => ({ who: 'fox', text: () => L(uk, en) });
const at = (line?: number) => (line ? L(`Рядок ${line}: `, `Line ${line}: `) : '');

/** Помилка під час компіляції чи виконання. `raw` — те, що сказав рушій. */
export function adviseError(level: Level, code: string, err: { message: string; line?: number }): Advice | null {
  const { bare } = clean(code);
  const m = err.message;
  // рушій уже переклав помилку й додав оригінал у дужках; для помилок JS порада пояснює сама,
  // а для помилок вулиці лишаємо пояснення рушія — воно каже, що саме сталося
  const plain = (s: string) => s;
  const tail = (s: string) => `${s} (${m})`;
  let x: RegExpMatchArray | null;

  if ((x = m.match(/enei\.(\w+) is not a function/))) {
    const guess = closest(x[1]);
    return guess && guess !== x[1]
      ? fox(plain(`${at(err.line)}у Енея немає команди «${x[1]}». Може, enei.${guess}()? JS розрізняє великі й малі літери.`), plain(`${at(err.line)}Aeneas has no command “${x[1]}”. Did you mean enei.${guess}()? JS cares about upper and lower case.`))
      : fox(plain(`${at(err.line)}у Енея немає команди «${x[1]}». Він уміє: ${COMMANDS.join(', ')}.`), plain(`${at(err.line)}Aeneas has no command “${x[1]}”. He knows: ${COMMANDS.join(', ')}.`));
  }
  if ((x = m.match(/([\w.$]+) is not a function/)))
    return fox(plain(`${at(err.line)}«${x[1]}» — це не команда. Перевір назву й чи є вона взагалі.`), plain(`${at(err.line)}“${x[1]}” is not a command. Check the name and whether it exists at all.`));
  if ((x = m.match(/(\w+) is not defined/))) {
    const name = x[1];
    if (name.toLowerCase() === 'enei') return fox(plain(`${at(err.line)}Еней у коді пишеться з малої літери: enei.`), plain(`${at(err.line)}Aeneas is written in lower case in the code: enei.`));
    if (name === 'i') return fox(plain(`${at(err.line)}лічильник i живе тільки всередині свого циклу for. Поза { } його вже немає.`), plain(`${at(err.line)}the counter i only lives inside its for loop. Outside the { } it no longer exists.`));
    return fox(plain(`${at(err.line)}«${name}» ніхто не створював. Перевір написання (великі й малі літери різні) або створи змінну через let.`), plain(`${at(err.line)}nobody created “${name}”. Check the spelling (upper and lower case differ) or create the variable with let.`));
  }
  if (/Cannot read propert(y|ies) of undefined/.test(m))
    return fox(plain(`${at(err.line)}ти береш щось у того, чого немає (undefined). Часто це вихід за межі масиву: останній елемент — [length - 1].`), plain(`${at(err.line)}you are taking something from a thing that doesn’t exist (undefined). Often that means going past the end of an array: the last element is [length - 1].`));
  if (/Assignment to constant/.test(m))
    return fox(plain(`${at(err.line)}const не можна змінювати. Для того, що росте чи змінюється, бери let.`), plain(`${at(err.line)}a const can’t be changed. For something that grows or changes, use let.`));
  if (/Unexpected token|Unterminated|Missing semicolon|Expected|Unexpected end/i.test(m))
    return fox(plain(`${at(err.line)}тут JS не може прочитати код. Найчастіше бракує дужки ), } або лапки: перевір, чи кожна відкрита дужка закрита.`), plain(`${at(err.line)}JS can’t read the code here. Most often a ), } or a quote is missing: check that every opened bracket is closed.`));

  // помилки вулиці: рушій уже пояснив, що сталося; додаємо — чому
  if (/Далі дороги немає|No road ahead/.test(m)) {
    if (level.id === 'troy.walk' && !/atEnd/.test(bare)) return fox(tail('Вулиці бувають різної довжини, тож кроки наперед не порахуєш. Йди, поки !enei.atEnd().'), tail('Streets have different lengths, so you can’t count the steps in advance. Walk while !enei.atEnd().'));
    if (/<=/.test(bare)) return fox(tail('Еней пройшов далі, ніж треба. З <= цикл робить на один повтор більше: i <= 3 — це 0, 1, 2, 3, чотири рази. Спробуй <.'), tail('Aeneas went further than needed. With <= the loop runs one extra time: i <= 3 is 0, 1, 2, 3 — four times. Try <.'));
    return fox(tail('Еней пройшов далі, ніж треба. Порахуй, скільки разів виконується твій цикл чи скільки кроків написано.'), tail('Aeneas went further than needed. Count how many times your loop runs, or how many steps you wrote.'));
  }
  if (/Тут немає мішка|There is no sack/.test(m)) {
    const take = bare.indexOf('take'), move = bare.indexOf('move');
    if (take >= 0 && move >= 0 && take < move) return fox(tail('Спершу крок, потім take(): Еней стоїть на порожній клітинці, а мішок попереду.'), tail('Step first, then take(): Aeneas stands on an empty cell, and the sack is ahead.'));
    return fox(tail('Мішок треба брати там, де він лежить. Перевір, скільки кроків Еней робить між take().'), tail('A sack has to be taken where it lies. Check how many steps Aeneas takes between take() calls.'));
  }
  if (/ступив у вогонь|stepped into the fire/.test(m) && !/fireAhead/.test(bare))
    return fox(tail('Перед кожним кроком подивись уперед: enei.fireAhead() скаже, чи там горить.'), tail('Look ahead before every step: enei.fireAhead() tells you whether it’s burning there.'));
  if (/сів перепочити|sat down to rest/.test(m)) return adviseTimeout(level, code);
  return null;
}

/** Код працював понад 2 секунди. */
export function adviseTimeout(_level: Level, code: string): Advice {
  const { bare } = clean(code);
  const w = bare.match(/while\s*\(([^)]*\)?)\)\s*\{?([\s\S]*)/);
  if (w && /atEnd/.test(w[1]) && !/move|jump/.test(w[2]))
    return fox('Цикл while крутиться, а Еней стоїть: умова «не в кінці» ніколи не стане хибною, бо всередині циклу немає кроку. Додай enei.move().', 'The while loop spins but Aeneas stands still: “not at the end” never becomes false, because there’s no step inside the loop. Add enei.move().');
  if (/for\s*\([^;]*;[^;]*;\s*\)/.test(bare) || /for\s*\([^;]*;[^;]*;[^)]*--/.test(bare))
    return fox('Схоже, лічильник циклу for не росте (або росте не туди), тож умова завжди правдива. Наприкінці дужок має бути i++.', 'It looks like the for loop counter doesn’t grow (or grows the wrong way), so the condition is always true. The end of the brackets should be i++.');
  return fox('Цикл не закінчується. Перевір, чи змінюється щось, від чого залежить його умова.', 'The loop never ends. Check whether anything that its condition depends on actually changes.');
}

/** Запуск на прикладі пройшов без помилки, але відповідь не та. `why` — пояснення судді. */
export function adviseRun(level: Level, code: string, r: CallResult, why: string): Advice | null {
  const { code: c, bare } = clean(code);
  if (level.scene.type === 'street') {
    const acted = r.events.some((e) => e.t === 'act');
    if (!acted) {
      if (/enei\.(move|take|jump)\b(?!\s*\()/.test(bare)) return fox('Ти назвав команду, але не віддав її: після назви потрібні дужки, наприклад enei.move().', 'You named the command but didn’t give it: it needs brackets after the name, like enei.move().');
      if (!bodyOf(bare)) return fox('Слово ладу порожнє: між { і } ще нічого не написано. Почни з enei.move();', 'The word of order is empty: nothing is written between { and } yet. Start with enei.move();');
      if (usesLoop(bare)) return fox('Еней не зробив жодної дії. Схоже, цикл не виконався жодного разу: перевір його умову.', 'Aeneas didn’t do anything. It looks like the loop never ran even once: check its condition.');
      return fox('Еней не зробив жодної дії. Чи точно команда викликається?', 'Aeneas didn’t do anything. Are you sure the command is called?');
    }
    if (r.street && r.street.pos < r.street.cells.length - 1 && /криниця|well/.test(why))
      return fox(`${why}. ${usesLoop(bare) ? L('Повторів замало: порахуй, скільки разів виконується тіло циклу.', 'Not enough rounds: count how many times the loop body runs.') : L('Кроків замало: порахуй клітинки до криниці.', 'Not enough steps: count the cells to the well.')}`, `${why}. ${usesLoop(bare) ? 'Not enough rounds: count how many times the loop body runs.' : 'Not enough steps: count the cells to the well.'}`);
    return null;
  }

  // для вправ «на місці» відповідь — змінений масив, а не те, що повернула функція
  const got = level.inPlace !== undefined ? (r.argsAfter?.[level.inPlace] ?? r.value) : r.value;
  const lang = uiLang();
  const input = level.examples[0]?.args[level.inPlace ?? 0];
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  if (level.inPlace !== undefined && Array.isArray(got) && Array.isArray(input)) {
    if (/\breturn\s+[\w[]/.test(bare) && same(got, input)) return fox('Масив лишився таким самим. Тут треба змінити сам масив на місці, а не повертати новий.', 'The array stayed the same. Here you have to change the array itself in place, not return a new one.');
    if (level.id === 'sea.swap' && got.length > 1 && got[0] === got[got.length - 1] && input[0] !== input[input.length - 1])
      return fox('Обидва фланги тепер однакові: перший корабель перезаписано, перш ніж його збережено. Спершу відклади його в змінну.', 'Both flanks are now the same: the first ship was overwritten before it was saved. Put it aside in a variable first.');
    if (level.id === 'sea.reverse' && same(got, input) && usesLoop(bare))
      return fox('Колона не змінилась: схоже, ти розвернув її двічі. Обмінюй лише доки i < j — до середини, а не до кінця.', 'The column didn’t change: it looks like you reversed it twice. Swap only while i < j — up to the middle, not to the end.');
    if (level.id === 'sea.zeroes' && got.filter((v) => v === 0).length < input.filter((v) => v === 0).length)
      return fox('Цілі кораблі вже попереду, але хвіст лишився старим. Після проходу заповни решту місць нулями.', 'The whole ships are already in front, but the tail still holds old values. After the pass, fill the remaining places with zeros.');
    if (same(got, input)) { const name = level.observe[level.inPlace] ?? 'arr'; return fox(`Масив не змінився. Чи записуєш ти щось у нього, наприклад ${name}[i] = …?`, `The array didn’t change. Are you writing anything into it, like ${name}[i] = …?`); }
    return null;
  }
  if (level.id === 'sea.max' && got === 0 && Array.isArray(input) && !input.includes(0))
    return fox('Вийшов 0, хоча такого корабля немає. Почни найкраще з ships[0], а не з 0: усі значення можуть бути й від\'ємними.', 'You got 0, though there’s no such ship. Start the best with ships[0], not 0: all the values may be negative.');
  // мова вулиці: в англійській грі вулиця англійська, і навпаки
  if (/"троянець"|'троянець'/.test(c) && lang === 'en') return fox('In the English game the street speaks English: look for "trojan", not "троянець".', 'In the English game the street speaks English: look for "trojan", not "троянець".');
  if (/"trojan"|'trojan'/.test(c) && lang !== 'en') return fox('В українській грі вулиця говорить українською: шукай "троянець", а не "trojan".', 'In the Ukrainian game the street speaks Ukrainian: look for "троянець", not "trojan".');
  if (got === undefined) {
    if (!/\breturn\b/.test(bare)) return fox('Функція нічого не повернула. Відповідь треба віддати через return.', 'The function returned nothing. Hand the answer back with return.');
    if (/\[\s*\w+\.length\s*\]/.test(bare)) return fox('Отримав undefined: клітинки з номером length немає, вона вже за кінцем. Рахуємо з нуля, тож остання — [length - 1].', 'Got undefined: there is no cell number length, it’s already past the end. We count from zero, so the last one is [length - 1].');
    if (/\[\s*\d+\s*\]/.test(bare)) return fox('Отримав undefined: схоже, в коді стоїть конкретний номер клітинки, а в цьому тесті її немає — тести бувають різної довжини.', 'Got undefined: it looks like the code uses a fixed cell number, and this test doesn’t have that cell — tests have different lengths.');
    return fox('Функція повернула undefined. Чи доходить код до return з відповіддю?', 'The function returned undefined. Does the code reach a return with the answer?');
  }
  if (/\bif\s*\((?:[^()]|\([^()]*\))*?[^=!<>]=(?!=)/.test(bare)) return fox('В if стоїть один знак =: він записує значення, а не порівнює. Порівнюють через ===.', 'There is a single = inside the if: it stores a value instead of comparing. Compare with ===.');
  const args = level.examples[0]?.args[0];
  if (level.id === 'troy.total' && Array.isArray(args) && got === args.length) return fox('Ти порахував мішки, а треба зерно: додавай не 1, а nums[i].', 'You counted the sacks, but we need the grain: add nums[i], not 1.');
  if (level.id === 'troy.sum' && Array.isArray(args)) {
    if (typeof got === 'number') return fox('Треба повернути масив, а не одне число: записуй суму в result після кожного мішка через push.', 'You need to return an array, not one number: write the sum into result after every sack with push.');
    if (Array.isArray(got) && got.length === 1 && args.length > 1) return fox('У result лише один елемент. Схоже, push стоїть після циклу, а має бути всередині, після кожного додавання.', 'result has only one element. It looks like push is after the loop, but it should be inside, after every addition.');
    if (Array.isArray(got) && got.length === args.length && got.every((v, i) => v === args[i])) return fox('Ти записуєш самі мішки, а треба суму від першого мішка до поточного включно.', 'You are writing the sacks themselves, but you need the sum from the first sack up to the current one.');
  }
  return null;
}

/** Суд богів: приклад пройшов, а якийсь інший тест — ні. */
export function adviseJudge(level: Level, code: string, rep: JudgeReport): Advice | null {
  const { bare } = clean(code);
  const exampleOk = rep.cases.filter((c) => c.kind === 'example').every((c) => c.verdict === 'ok');
  const bad = rep.cases.find((c) => c.verdict === 'wrong');
  if (!bad || !exampleOk) return null;
  if (level.id === 'troy.gather' && !/[<>]=?\s*n\b|\bn\s*[<>]/.test(bare))
    return fox(`На прикладі 3 мішки, а на інших вулицях — 5, 8 і 12 (${bad.why}). Не вписуй число в цикл: візьми n.`, `The example has 3 sacks, but other streets have 5, 8 and 12 (${bad.why}). Don’t write a number into the loop: use n.`);
  if (level.id === 'troy.walk' && !/atEnd/.test(bare))
    return fox(`На прикладі криниця на 6, а на інших вулицях — деінде (${bad.why}). Не рахуй кроки наперед: йди, поки !enei.atEnd().`, `In the example the well is on 6, on other streets it’s elsewhere (${bad.why}). Don’t count the steps in advance: walk while !enei.atEnd().`);
  if (level.id === 'troy.fire' && !/fireAhead/.test(bare))
    return fox(`На прикладі вогонь на 2, а на інших вулицях — в інших місцях (${bad.why}). Перевіряй enei.fireAhead() перед кожним кроком.`, `In the example the fire is on 2, on other streets it’s elsewhere (${bad.why}). Check enei.fireAhead() before every step.`);
  if (/\[\s*\d+\s*\]/.test(bare) && level.scene.type === 'array')
    return fox(`На прикладі вийшло, а на тесті «${bad.label}» — ні (${bad.why}). Схоже, в коді стоїть конкретний номер клітинки, а тести бувають різної довжини.`, `It worked on the example but not on “${bad.label}” (${bad.why}). It looks like the code uses a fixed cell number, but the tests have different lengths.`);
  return fox(`На прикладі вийшло, а на тесті «${bad.label}» — ні: ${bad.why}. Чим цей тест відрізняється від прикладу?`, `It worked on the example but not on “${bad.label}”: ${bad.why}. How is that test different from the example?`);
}

/** Розв'язано, але є що підказати на майбутнє: наприклад, 15 рядків замість циклу. */
export function adviseSolved(level: Level, code: string): string | null {
  const { bare } = clean(code);
  const moves = (bare.match(/enei\.move\s*\(/g) ?? []).length;
  if ((level.id === 'troy.far' || level.id === 'troy.sacks') && !usesLoop(bare) && moves >= 5)
    return L(`Працює! Але ${moves} однакових рядків… Спробуй цикл for: тоді й сотня кроків — один рядок.`, `It works! But ${moves} identical lines… Try a for loop: then even a hundred steps is one line.`);
  return null;
}
