import { rng, type Level, type World } from '../engine/level.ts';
import type { TestCase } from '../engine/types.ts';
import { lc, starter } from './util.ts';

/*
 * Світ 14 — Кузня Вулкана (Енеїда, частина 6): динамічне програмування.
 * Уламок погасив горн, і кожен удар доводиться повторювати з нуля. Хитрість світу — не кувати двічі
 * те саме: записати викуване в таблицю й спиратися на нього. Вовк кує кожну деталь з нуля.
 */

const s = (a: unknown) => JSON.stringify(a).replace(/,/g, ', ');
const one = (a: number[]): TestCase => ({ args: [a], label: s(a) });

/* 1. Min Cost Climbing Stairs */
function stairsRef(cost: number[]) { let a = 0, b = 0; for (let i = 2; i <= cost.length; i++) [a, b] = [b, Math.min(b + cost[i - 1], a + cost[i - 2])]; return b; }
const stairs: Level = {
  id: 'forge.stairs', world: 14, title: 'Сходи до горна', topic: 'DP: відповідь з двох попередніх',
  leetcode: lc(746, 'Min Cost Climbing Stairs'),
  brief: '<b>Сходи до горна.</b> До горна Вулкана ведуть розпечені сходи. Піднімись, обпікшись якнайменше.',
  statement: [
    'Горн стоїть на вершині сходів. <code>cost[i]</code> — скільки жару пече сходинка <code>i</code>, коли на неї ступаєш. Можна ступати на наступну сходинку або перестрибувати через одну. Почати можна з нульової або з першої, а горн — одразу за останньою.',
    'Поверни найменший сумарний жар дороги до горна. Для <code>[10, 15, 20]</code> — <code>15</code>: стати на першу й перестрибнути до горна. Для <code>[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]</code> — <code>6</code>.',
    'Найдешевша дорога до сходинки <code>i</code> — це дешевша з доріг до двох попередніх сходинок плюс сама сходинка. Кожну сходинку рахуй <b>один раз</b> і спирайся на вже пораховане: це і є <b>динамічне програмування</b>.',
  ],
  tool: {
    name: 'динамічне програмування',
    text: [
      'Розбий задачу на менші, що перекриваються, і розв\'язуй їх від найменших. Відповідь кожної запиши — наступні спиратимуться на неї, а не рахуватимуть заново.',
      'Тут <code>best[i]</code> — найменший жар, щоб стати <b>на</b> сходинку <code>i</code>: <code>cost[i] + min(best[i - 1], best[i - 2])</code>. Горн — після останньої: менша з двох останніх <code>best</code>.',
    ],
    code: '// cost = [10, 15, 20]\n// best = [10, 15, 30]\n// до горна: min(15, 30) = 15',
  },
  talk: [
    { who: 'venus', text: 'Вулкане, коханий, викуй моєму синові зброю. Ну будь ласка!' },
    { who: 'vulcan', text: 'Та горн погас! Уламок! Кожен удар — наче вперше. Спершу хоч дійдіть до горна, сходи розпечені.' },
    { who: 'fox', text: 'Рахуймо кожну сходинку раз і записуймо. Наступна дивиться лише на дві попередні.' },
  ],
  quip: { who: 'vulcan', text: 'Дійшли й не обсмалились. Ну, майже: лисові хвіст підпалило.' },
  entry: 'minCostClimbingStairs', observe: ['cost'],
  starter: starter('minCostClimbingStairs', [['cost', 'number[]']], 'number', ['Сходи до горна', 'cost[i] — жар сходинки i. Крок — на 1 або 2 сходинки, старт з 0 або 1.', 'Поверни найменший жар дороги до горна (за останньою сходинкою).'], '  const best = [];\n  // Слово ладу пиши тут\n\n  return 0;\n'),
  examples: [one([10, 15, 20]), one([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])],
  hidden: [one([0, 0]), one([5, 3]), one([1, 2, 3, 4, 5]), one([0, 1, 2, 2]), one([7, 1, 1, 7, 7, 1])],
  reference: stairsRef,
  hints: ['Звідки можна ступити на сходинку i?', 'best[0] = cost[0], best[1] = cost[1]; для i ≥ 2: best[i] = cost[i] + min(best[i - 1], best[i - 2]). Відповідь — min з двох останніх.', 'for (let i = 0; i < cost.length; i++) best[i] = cost[i] + (i < 2 ? 0 : Math.min(best[i - 1], best[i - 2])); return Math.min(best[cost.length - 1], best[cost.length - 2]);'],
  solution: 'function minCostClimbingStairs(cost: number[]): number {\n  const best: number[] = [];\n  for (let i = 0; i < cost.length; i++) best[i] = cost[i] + (i < 2 ? 0 : Math.min(best[i - 1], best[i - 2]));\n  return Math.min(best[cost.length - 1], best[cost.length - 2]);\n}',
  lesson: 'Відповідь для кроку i складається з уже записаних відповідей для кроків i − 1 та i − 2: кожен крок рахується раз.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 2. House Robber */
function robRef(a: number[]) { let p = 0, q = 0; for (const x of a) [p, q] = [q, Math.max(q, p + x)]; return q; }
const iron: Level = {
  id: 'forge.iron', world: 14, title: 'Залізо з возів', topic: 'DP: брати чи пропустити',
  leetcode: lc(198, 'House Robber'),
  brief: '<b>Залізо з возів.</b> Вздовж кузні стоять вози з залізом. Забери найбільше, не беручи з двох сусідніх.',
  statement: [
    'Циклопи привезли залізо: <code>nums[i]</code> — скільки його на возі <code>i</code>. Вози стоять рядком, і візники пильнують: якщо взяти з двох <b>сусідніх</b> возів, здіймуть галас.',
    'Поверни, скільки найбільше заліза можна забрати. Для <code>[2, 7, 9, 3, 1]</code> — <code>12</code> (2 + 9 + 1).',
    'Возів буває до 10 000. Для кожного воза вибір: <b>брати</b> (тоді попередній — ні, тож до нього додається найкраще до воза <code>i − 2</code>) або <b>пропустити</b> (тоді лишається найкраще до <code>i − 1</code>). Тримай ці два числа й рухайся вперед.',
  ],
  tool: {
    name: 'дві змінні замість таблиці',
    text: [
      '<code>best(i) = max(best(i − 1), best(i − 2) + nums[i])</code>. Таблиця не потрібна: досить пам\'ятати дві останні відповіді — <code>prev2</code> і <code>prev1</code>.',
      'На кожному возі: <code>cur = max(prev1, prev2 + nums[i])</code>, а тоді зсунь: <code>prev2 = prev1</code>, <code>prev1 = cur</code>.',
    ],
    code: '// [2, 7, 9, 3, 1]\n// best: 2, 7, 11, 11, 12',
  },
  talk: [
    { who: 'vulcan', text: 'Заліза треба багато, а візники сердиті. Із сусідніх возів не дадуть.' },
    { who: 'wolf', text: 'Я для кожного воза перерахую все з самого початку! Кожну деталь — з нуля, як Вулкан нині кує!' },
    { who: 'fox', text: 'А ми запам\'ятаємо, що вже порахували. Два числа — і вперед.' },
  ],
  quip: { who: 'vulcan', text: 'Оце купа! І жоден візник не писнув.' },
  entry: 'rob', observe: ['nums'],
  starter: starter('rob', [['nums', 'number[]']], 'number', ['Залізо з возів', 'nums[i] — залізо на возі i. Не можна брати з двох сусідніх возів.', 'Поверни найбільше заліза.'], '  let prev2 = 0, prev1 = 0;\n  // Слово ладу пиши тут\n\n  return prev1;\n'),
  examples: [one([1, 2, 3, 1]), one([2, 7, 9, 3, 1])],
  hidden: [one([]), one([5]), one([2, 1, 1, 2]), one([0, 0, 0]), one([10, 1, 1, 10, 1, 1, 10])],
  big: { n: 10000, make: (n) => { const r = rng(198); return [Array.from({ length: n }, () => Math.floor(r() * 400))]; }, readBudget: (n) => 3 * n },
  reference: robRef,
  wolf: { reads: (n) => Math.round((n * n) / 2), code: 'function rob(nums) {\n  let answer = 0;\n  // для кожного воза — усе з нуля, без жодних записів\n  for (let end = 0; end < nums.length; end++) {\n    let prev2 = 0, prev1 = 0;\n    for (let i = 0; i <= end; i++) {\n      const cur = Math.max(prev1, prev2 + nums[i]);\n      prev2 = prev1;\n      prev1 = cur;\n    }\n    answer = prev1;\n  }\n  return answer;\n}' },
  hints: ['Що буде найкращим до воза i, якщо його взяти? А якщо пропустити?', 'Для кожного x: cur = max(prev1, prev2 + x); prev2 = prev1; prev1 = cur.', 'for (const x of nums) { const cur = Math.max(prev1, prev2 + x); prev2 = prev1; prev1 = cur; }'],
  solution: 'function rob(nums: number[]): number {\n  let prev2 = 0, prev1 = 0;\n  for (const x of nums) {\n    const cur = Math.max(prev1, prev2 + x);\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}',
  lesson: 'DP «брати чи пропустити»: найкраще до i — більше з «пропустити» (i − 1) і «взяти» (i − 2 + nums[i]). Два числа, один прохід.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 3. Coin Change */
function coinRef(coins: number[], amount: number) { const dp = new Array(amount + 1).fill(Infinity); dp[0] = 0; for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1); return dp[amount] === Infinity ? -1 : dp[amount]; }
const pay = (coins: number[], amount: number): TestCase => ({ args: [coins, amount], label: `${s(coins)}, ${amount}` });
const metal: Level = {
  id: 'forge.coins', world: 14, title: 'Плата за метал', topic: 'DP: таблиця по сумах',
  leetcode: lc(322, 'Coin Change'),
  brief: '<b>Плата за метал.</b> Вулкан просить за рідкісний метал рівно <code>amount</code> монет. Заплати найменшою кількістю монет.',
  statement: [
    'Для зброї Енея потрібен рідкісний метал. Вулкан бере рівно <code>amount</code>. <code>coins</code> — вартості монет, які є в Енея, кожної скільки завгодно.',
    'Поверни найменшу кількість монет, що разом дають <code>amount</code>, або <code>-1</code>, якщо так не скласти. Для <code>[1, 2, 5]</code> і <code>11</code> — <code>3</code> (5 + 5 + 1); для <code>[2]</code> і <code>3</code> — <code>-1</code>.',
    'Жадібно (спершу найбільші) не вийде: для <code>[1, 3, 4]</code> і <code>6</code> жадібний дасть 4 + 1 + 1, а краще 3 + 3. Рахуй таблицю: <code>dp[a]</code> — найменше монет для суми <code>a</code>, від 0 до <code>amount</code>.',
  ],
  tool: {
    name: 'таблиця по сумах',
    text: [
      '<code>dp[0] = 0</code>, решта поки <code>Infinity</code>. Для кожної суми <code>a</code> спробуй кожну монету <code>c ≤ a</code>: остання монета <code>c</code>, а решта — вже пораховане <code>dp[a − c]</code>.',
      '<code>dp[a] = min(dp[a], dp[a − c] + 1)</code>. Наприкінці <code>dp[amount]</code> — відповідь, якщо вона не <code>Infinity</code>.',
    ],
    code: '// coins = [1, 3, 4], amount = 6\n// dp: 0  1  2  1  1  2  2\n//     0  1  2  3  4  5  6',
  },
  talk: [
    { who: 'vulcan', text: 'Метал рідкісний, ціна чесна. Але я не люблю, коли мені сиплють жменю дрібних. Найменше монет!' },
    { who: 'fox', text: 'Найбільші спершу — не завжди найкраще. Порахуймо для кожної суми від нуля, і більші складемо з менших.' },
  ],
  quip: { who: 'vulcan', text: 'Рівно стільки, і жодної зайвої монети. Харон би заплакав від заздрощів.' },
  entry: 'coinChange', observe: ['coins', null],
  starter: starter('coinChange', [['coins', 'number[]'], ['amount', 'number']], 'number', ['Плата за метал', 'Поверни найменшу кількість монет із coins (кожну скільки завгодно), що дають amount, або -1.'], '  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  // Слово ладу пиши тут\n\n  return dp[amount] === Infinity ? -1 : dp[amount];\n'),
  examples: [pay([1, 2, 5], 11), pay([2], 3)],
  hidden: [pay([1], 0), pay([1, 3, 4], 6), pay([2, 5, 10, 1], 27), pay([186, 419, 83, 408], 6249), pay([3, 7], 5)],
  reference: coinRef,
  hints: ['Якою може бути остання монета в найкращому наборі для суми a?', 'Для a від 1 до amount: для кожної монети c ≤ a — dp[a] = min(dp[a], dp[a - c] + 1).', 'for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);'],
  solution: 'function coinChange(coins: number[], amount: number): number {\n  const dp: number[] = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
  lesson: 'Коли жадібний вибір підводить, рахуй таблицю всіх менших сум: кожна спирається на вже пораховані.',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

/* 4. Longest Common Subsequence */
function lcsRef(a: string, b: string) { const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0)); for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]); return dp[a.length][b.length]; }
const songs = (a: string, b: string): TestCase => ({ args: [a, b], label: `"${a}", "${b}"` });
const lcs: Level = {
  id: 'forge.lcs', world: 14, title: 'Спільна мелодія', topic: 'DP: таблиця на два рядки',
  leetcode: lc(1143, 'Longest Common Subsequence'),
  brief: '<b>Спільна мелодія.</b> Двоє циклопів кують у різному ритмі. Знайди найдовшу спільну мелодію їхніх пісень.',
  statement: [
    'Циклопи співають, щоб бити молотами в лад. Пісні — рядки нот <code>text1</code> і <code>text2</code>. Спільна мелодія — ноти, що трапляються в обох піснях <b>у тому самому порядку</b>, хоч і не обов\'язково підряд.',
    'Поверни довжину найдовшої спільної мелодії. Для <code>"abcde"</code> і <code>"ace"</code> — <code>3</code> («ace»); для <code>"abc"</code> і <code>"def"</code> — <code>0</code>.',
    'Тримай таблицю <code>dp[i][j]</code> — відповідь для перших <code>i</code> нот першої пісні й перших <code>j</code> другої. Якщо останні ноти однакові — це <code>dp[i − 1][j − 1] + 1</code>. Інакше одну з них викидаємо: <code>max(dp[i − 1][j], dp[i][j − 1])</code>.',
  ],
  tool: {
    name: 'таблиця на два рядки',
    text: [
      'Рядок 0 і стовпчик 0 таблиці — нулі: з порожньою піснею спільного немає. Заповнюй рядок за рядком, зліва направо: кожна клітинка дивиться на три сусідні, вже пораховані.',
      'Відповідь — у правому нижньому куті: <code>dp[text1.length][text2.length]</code>.',
    ],
    code: '//       ""  a  c  e\n//  ""    0  0  0  0\n//  a     0  1  1  1\n//  b     0  1  1  1\n//  c     0  1  2  2\n//  d     0  1  2  2\n//  e     0  1  2  3',
  },
  talk: [
    { who: 'vulcan', text: 'Мої циклопи б\'ють не в лад! Один співає одне, другий — інше. Знайдіть спільну мелодію, хай кують під неї.' },
    { who: 'fox', text: 'Кожну пару початків пісень порахуємо раз і запишемо в таблицю. Решта складеться з них.' },
  ],
  quip: { who: 'vulcan', text: 'Чуєш? Б\'ють разом! Оце кузня!' },
  entry: 'longestCommonSubsequence', observe: ['text1', 'text2'],
  starter: starter('longestCommonSubsequence', [['text1', 'string'], ['text2', 'string']], 'number', ['Спільна мелодія', 'Поверни довжину найдовшої спільної підпослідовності text1 і text2.'], '  const dp = Array.from({ length: text1.length + 1 }, () => new Array(text2.length + 1).fill(0));\n  // Слово ладу пиши тут\n\n  return dp[text1.length][text2.length];\n'),
  examples: [songs('abcde', 'ace'), songs('abc', 'def')],
  hidden: [songs('abc', 'abc'), songs('', 'abc'), songs('bsbininm', 'jmjkbkjkv'), songs('oxcpqrsvwf', 'shmtulqrypy'), songs('dumka', 'kolomyika')],
  reference: lcsRef,
  hints: ['Що можна сказати, якщо останні ноти обох початків однакові? А якщо різні?', 'Для i від 1 і j від 1: якщо text1[i - 1] === text2[j - 1] — dp[i][j] = dp[i - 1][j - 1] + 1, інакше max(dp[i - 1][j], dp[i][j - 1]).', 'for (let i = 1; i <= text1.length; i++) for (let j = 1; j <= text2.length; j++) dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);'],
  solution: 'function longestCommonSubsequence(text1: string, text2: string): number {\n  const dp: number[][] = Array.from({ length: text1.length + 1 }, () => new Array(text2.length + 1).fill(0));\n  for (let i = 1; i <= text1.length; i++) {\n    for (let j = 1; j <= text2.length; j++) {\n      dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[text1.length][text2.length];\n}',
  lesson: 'Для двох рядків таблиця dp[i][j] тримає відповідь для всіх пар початків: однакові кінці — по діагоналі +1, різні — більший із сусідів.',
  scene: { type: 'array', skin: 'letter', mode: 'scan' },
};

/* 5. Longest Increasing Subsequence */
function lisRef(a: number[]) { const tails: number[] = []; for (const x of a) { let lo = 0, hi = tails.length; while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; } tails[lo] = x; } return tails.length; }
const blade: Level = {
  id: 'forge.lis', world: 14, final: true, title: 'Найдовший клинок', topic: 'DP: найкраще, що закінчується тут',
  leetcode: lc(300, 'Longest Increasing Subsequence'),
  brief: '<b>Найдовший клинок.</b> Клинок кують із пластин, кожна наступна твердіша за попередню. Скільки найбільше пластин піде в клинок?',
  statement: [
    'Вулкан кує Енеєві меч. На ковадлі рядком лежать пластини: <code>nums[i]</code> — твердість пластини <code>i</code>. Клинок складають з пластин <b>у тому порядку</b>, як вони лежать, і кожна наступна має бути <b>строго твердіша</b> за попередню. Пропускати пластини можна.',
    'Поверни, скільки найбільше пластин увійде в клинок. Для <code>[10, 9, 2, 5, 3, 7, 101, 18]</code> — <code>4</code> (наприклад, 2, 3, 7, 18).',
    'Пластин буває до 500. Для кожної пластини <code>i</code> порахуй <code>dp[i]</code> — найдовший клинок, що <b>закінчується</b> на ній: це 1 плюс найкращий <code>dp[j]</code> серед попередніх, м\'якших пластин. Відповідь — найбільше з усіх <code>dp</code>.',
  ],
  tool: {
    name: 'найкраще, що закінчується тут',
    text: [
      'Часто зручно питати не «яка відповідь для перших i?», а «яка найкраща відповідь, що закінчується саме на i?». Тоді останній елемент відомий, і його легко продовжити попередніми.',
      '<code>dp[i] = 1 + max(dp[j])</code> для всіх <code>j &lt; i</code>, де <code>nums[j] &lt; nums[i]</code> (або просто 1, якщо таких немає).',
    ],
    code: '// nums = [2, 5, 3, 7]\n// dp   = [1, 2, 2, 3]   (7 продовжує 2→5 або 2→3)',
  },
  talk: [
    { who: 'vulcan', text: 'Горн знову палає! Тепер — головне: клинок. Пластини тверднуть одна за одною, тільки так і не інакше.' },
    { who: 'wolf', text: '(десь у таборі Турна) Я теж кую! Кожен клинок з нуля, усі можливі набори пластин… Ой, рекурсія вибухнула.' },
    { who: 'fox', text: 'Для кожної пластини — найдовший клинок, що на ній закінчується. Записали — і йдемо далі, нічого не перековуючи.' },
  ],
  quip: { who: 'venus', text: 'Яка зброя! Сину, тепер ти готовий до Турна. А Вулканові я ще подякую… окремо.' },
  entry: 'lengthOfLIS', observe: ['nums'],
  starter: starter('lengthOfLIS', [['nums', 'number[]']], 'number', ['Найдовший клинок', 'Поверни довжину найдовшої строго зростаючої підпослідовності nums.'], '  const dp = new Array(nums.length).fill(1);\n  // Слово ладу пиши тут\n\n  return nums.length ? Math.max(...dp) : 0;\n'),
  examples: [one([10, 9, 2, 5, 3, 7, 101, 18]), one([0, 1, 0, 3, 2, 3])],
  hidden: [one([7, 7, 7, 7]), one([5]), one([]), one([1, 2, 3, 4, 5]), one([5, 4, 3, 2, 1]), one([4, 10, 4, 3, 8, 9])],
  big: { n: 500, make: (n) => { const r = rng(300); return [Array.from({ length: n }, () => Math.floor(r() * 10000))]; }, readBudget: (n) => 2 * n * n },
  reference: lisRef,
  wolf: { reads: (n) => Math.round((n * n * n) / 6), code: 'function lengthOfLIS(nums) {\n  let best = 0;\n  // для кожної пластини — кувати всі клинки з нуля, без записів\n  for (let end = 0; end < nums.length; end++) {\n    const dp = new Array(end + 1).fill(1);\n    for (let i = 0; i <= end; i++)\n      for (let j = 0; j < i; j++)\n        if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n    best = Math.max(best, dp[end]);\n  }\n  return best;\n}' },
  hints: ['Яким може бути найдовший клинок, що закінчується саме на пластині i?', 'dp[i] = 1. Для кожного j < i: якщо nums[j] < nums[i] — dp[i] = max(dp[i], dp[j] + 1). Відповідь — max(dp).', 'for (let i = 0; i < nums.length; i++) for (let j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);'],
  solution: 'function lengthOfLIS(nums: number[]): number {\n  const dp: number[] = new Array(nums.length).fill(1);\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n  }\n  return nums.length ? Math.max(...dp) : 0;\n}',
  lesson: 'dp[i] — найкраще, що закінчується на i: O(n²) замість перебору всіх наборів. А якщо тримати найменші «хвости» клинків і шукати навпіл — вийде навіть O(n log n).',
  scene: { type: 'array', skin: 'stone', mode: 'scan' },
};

export const forge: World = {
  n: 14, name: 'Кузня Вулкана', song: 'Пісня VI · Лаціум', topic: 'Динамічне програмування', fox: '#ff8a1f',
  host: { who: 'Вулкан', line: 'Горн погас, і кожен удар — наче вперше! Навчіться не кувати двічі те саме.' },
  motif: 'combs', trick: 'Соти: динамічне програмування',
  levels: [stairs, iron, metal, lcs, blade],
};
