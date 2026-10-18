import type { Lang } from '../lib/copy';

// Тексти відео до релізу v0.3. Що нового — з git log v0.2.0..v0.3.1.
const uk = {
  builds: ['macOS · Apple Silicon + Intel', 'Windows 10 / 11', 'Linux · AppImage'],
  published: 'Реліз опубліковано',
  out: 'Вийшла',
  name: 'Кодеїда',
  version: '0.3',
  newBadge: 'Нове',
  abcTitle: 'Абетка',
  abcSub: 'Для тих, хто ще не написав жодного рядка коду',
  abcChapter: 'Розділ 1 «Колобок» · 4 уроки на кожну мову',
  worldsBadge: '+5 світів',
  worldNames: ['Рукавичка', 'Конотоп', 'Сицилія', 'Чумацький шлях', 'Пекло'],
  topics: ['Stack', 'Binary Search', 'Sliding Window · Heap', 'Linked List', 'Recursion · Backtracking'],
  worldsSum: 'Світи 0–8 · 54 вправи',
  moreTitle: 'А ще в 0.3',
  more: ['Кат-сцени між світами', 'Сивілла показує інтерфейс', 'Задачі аж до Combination Sum', 'Новий пролог з Абеткою'],
  dlTitle: 'Безкоштовно для всіх систем',
  platforms: [
    ['macOS', 'підписано й нотаризовано'],
    ['Windows', '10 і 11'],
    ['Linux', 'AppImage'],
  ],
  dlNote: 'Гра оновлюється сама',
  ptTitle: 'Шукаємо плейтестерів',
  ptSub: 'Пройди задачу Дидони й натисни «Залишити відгук»',
  endLine: 'v0.3 · уже можна грати',
};

const en: typeof uk = {
  builds: ['macOS · Apple Silicon + Intel', 'Windows 10 / 11', 'Linux · AppImage'],
  published: 'Release published',
  out: 'Out now',
  name: 'Kodeida',
  version: '0.3',
  newBadge: 'New',
  abcTitle: 'The ABC',
  abcSub: "For people who haven't written a line of code yet",
  abcChapter: 'Chapter 1 “The Bun” · 4 lessons per language',
  worldsBadge: '+5 worlds',
  worldNames: ['The Mitten', 'Konotop', 'Sicily', 'The Chumak Way', 'Hell'],
  topics: ['Stack', 'Binary Search', 'Sliding Window · Heap', 'Linked List', 'Recursion · Backtracking'],
  worldsSum: 'Worlds 0–8 · 54 exercises',
  moreTitle: 'Also in 0.3',
  more: ['Cutscenes between worlds', 'The Sibyl shows you around', 'Problems up to Combination Sum', 'A new prologue with the ABC'],
  dlTitle: 'Free on every system',
  platforms: [
    ['macOS', 'signed and notarized'],
    ['Windows', '10 and 11'],
    ['Linux', 'AppImage'],
  ],
  dlNote: 'The game updates itself',
  ptTitle: "We're looking for playtesters",
  ptSub: 'Play through Dido’s problem and press “Leave feedback”',
  endLine: 'v0.3 · playable now',
};

export const LCOPY: Record<Lang, typeof uk> = { uk, en };
