import type { Lang } from '../lib/copy';

// Тексти відео до релізу з редизайном: новий арт героїв і світів, живі фони, заставки з анімаціями.
const uk = {
  builds: ['macOS · Apple Silicon + Intel', 'Windows 10 / 11', 'Linux · AppImage'],
  published: 'Реліз опубліковано',
  out: 'Вийшла',
  name: 'Кодеїда',
  version: '0.5',
  newBadge: 'Нове',
  abcTitle: 'Абетка',
  abcSub: 'У кожної казки свій фон, а герої виходять на сцену разом із виводом програми',
  abcChapter: '8 казок · Python, JavaScript і TypeScript',
  worldsBadge: 'Новий арт',
  worldNames: ['Рукавичка', 'Конотоп', 'Сицилія', 'Чумацький шлях', 'Пекло'],
  topics: ['Stack', 'Binary Search', 'Sliding Window · Heap', 'Linked List', 'Recursion · Backtracking'],
  worldsSum: '33 живі фони',
  moreTitle: 'А ще в 0.5',
  more: ['Заставки з анімаціями', 'Герої казок виходять на сцену', 'Еней у жупані в холодних світах', 'Портрети всіх героїв'],
  dlTitle: 'Безкоштовно для всіх систем',
  platforms: [
    ['macOS', 'підписано й нотаризовано'],
    ['Windows', '10 і 11'],
    ['Linux', 'AppImage'],
  ],
  dlNote: 'Гра оновлюється сама',
  ptTitle: 'Шукаємо плейтестерів',
  ptSub: 'Пройди задачу Дидони й натисни «Залишити відгук»',
  endLine: 'v0.5 · новий вигляд',
};

const en: typeof uk = {
  builds: ['macOS · Apple Silicon + Intel', 'Windows 10 / 11', 'Linux · AppImage'],
  published: 'Release published',
  out: 'Out now',
  name: 'Kodeida',
  version: '0.5',
  newBadge: 'New',
  abcTitle: 'The ABC',
  abcSub: 'Every tale has its own backdrop, and the heroes step on stage as the program prints',
  abcChapter: '8 tales · Python, JavaScript and TypeScript',
  worldsBadge: 'New art',
  worldNames: ['The Mitten', 'Konotop', 'Sicily', 'The Chumak Way', 'Hell'],
  topics: ['Stack', 'Binary Search', 'Sliding Window · Heap', 'Linked List', 'Recursion · Backtracking'],
  worldsSum: '33 living backgrounds',
  moreTitle: 'Also in 0.5',
  more: ['Animated cutscenes', 'Fairy-tale heroes step on stage', 'Aeneas in a zhupan in cold worlds', 'Portraits of every hero'],
  dlTitle: 'Free on every system',
  platforms: [
    ['macOS', 'signed and notarized'],
    ['Windows', '10 and 11'],
    ['Linux', 'AppImage'],
  ],
  dlNote: 'The game updates itself',
  ptTitle: "We're looking for playtesters",
  ptSub: 'Play through Dido’s problem and press “Leave feedback”',
  endLine: 'v0.5 · a new look',
};

export const LCOPY: Record<Lang, typeof uk> = { uk, en };
