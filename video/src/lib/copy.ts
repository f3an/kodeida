// Тексти трейлера українською та англійською. Терміни — з docs/BRAND.md.
export type Lang = 'uk' | 'en';

const uk = {
  coldQ1: 'Що, як твій код',
  coldQ2: 'рухає героя?',
  name: 'Кодеїда',
  tagline: 'Гра, де код рухає героя.',
  story: ['Юнона розбила Кришталеву Писанку', 'Уламки розлетілися по книгах', 'Збери їх — своїм кодом'],
  heroes: [
    ['Еней', 'Головний герой. Ним керує твій код.'],
    ['Лис Микита', 'Хитрість. Показує, що читає твій код.'],
    ['Вовк Неситий', 'Грубий перебір. O(n²) і гірше.'],
    ['Сивілла', 'Наставниця. Підказки, а не відповіді.'],
  ],
  play: ['Справжня сигнатура LeetCode', 'Світ виконує код крок за кроком', 'Суд богів: 10 000 стовпів', 'Без AI-підказок. Код — твій.'],
  wolf: 'Вовк',
  fox: 'Микита',
  reads: 'читань даних',
  times: '×2\u00a0500',
  fewer: 'менше роботи',
  slogan: 'Brute force — для вовків.',
  worldsTitle: '16 світів · 16 прийомів',
  worldNames: [
    'Попелище Трої', 'Море Еола', 'Карфаген Дидони', 'Ліс Лиса Микити', 'Рукавичка', 'Конотоп',
    'Сицилія', 'Чумацький шлях', 'Пекло', 'Родовід Анхіза', 'Лісова пісня', 'Карпати',
    'Змієві вали', 'Табір Турна', 'Кузня Вулкана', 'Двобій з Турном',
  ],
  topics: [
    'Основи', 'Масиви', 'Two Pointers', 'Hash Map', 'Stack', 'Binary Search', 'Sliding Window', 'Linked List',
    'Backtracking', 'Дерева', 'BST', 'BFS / DFS', 'Greedy', 'Dijkstra', 'Динамічне програмування', 'Співбесіда',
  ],
  mapStats: [['6', 'пісень'], ['16', 'світів'], ['54', 'вправи']],
  mapNote: 'Світи 0–8 уже можна пройти',
  abcQ: 'Ніколи не програмував?',
  abcA: 'Почни з Абетки',
  abcNote: 'Українські казки, сувій і перші рядки коду',
  waysQ: 'Вмієш програмувати?',
  ways: [
    ['🌱', 'Ні, з нуля', 'Абетка'],
    ['🧭', 'Трохи', 'Світ 0'],
    ['⚔️', 'Так, давай задачі', 'Світ 1'],
  ],
  features: [
    'Офлайн', 'TypeScript\u00a0· JavaScript\u00a0· Python', 'Українська\u00a0· English', 'macOS\u00a0· Windows\u00a0· Linux',
    'Автооновлення', 'Без реєстрації', 'Open source', 'Безкоштовно',
  ],
  featuresTitle: 'Усе, що треба, щоб почати',
  outro: 'Перехитри задачу.',
  cta: 'Завантажуй безкоштовно',
};

const en: typeof uk = {
  coldQ1: 'What if your code',
  coldQ2: 'moved the hero?',
  name: 'Kodeida',
  tagline: 'A game where your code moves the hero.',
  story: ['Juno shattered the Crystal Pysanka', 'Its shards fell into books', 'Collect them with your code'],
  heroes: [
    ['Aeneas', 'The hero. Your code moves him.'],
    ['Mykyta the Fox', 'Cunning. Points at what your code reads.'],
    ['The Greedy Wolf', 'Brute force. O(n²) and worse.'],
    ['The Sibyl', 'Mentor. Hints, not answers.'],
  ],
  play: ['A real LeetCode signature', 'The world runs your code step by step', 'Judgement: 10,000 posts', 'No AI hints. The code is yours.'],
  wolf: 'Wolf',
  fox: 'Mykyta',
  reads: 'data reads',
  times: '×2,500',
  fewer: 'less work',
  slogan: 'Brute force is for wolves.',
  worldsTitle: '16 worlds · 16 techniques',
  worldNames: [
    'Ashes of Troy', 'Sea of Aeolus', "Dido's Carthage", "Mykyta's Forest", 'The Mitten', 'Konotop',
    'Sicily', 'The Chumak Way', 'Hell', "Anchises' Lineage", 'The Forest Song', 'The Carpathians',
    "Serpent's Wall", "Turnus' Camp", "Vulcan's Forge", 'Duel with Turnus',
  ],
  topics: [
    'Basics', 'Arrays', 'Two Pointers', 'Hash Map', 'Stack', 'Binary Search', 'Sliding Window', 'Linked List',
    'Backtracking', 'Trees', 'BST', 'BFS / DFS', 'Greedy', 'Dijkstra', 'Dynamic Programming', 'Interview',
  ],
  mapStats: [['6', 'songs'], ['16', 'worlds'], ['54', 'exercises']],
  mapNote: 'Worlds 0–8 are playable now',
  abcQ: 'Never coded before?',
  abcA: 'Start with the ABC',
  abcNote: 'Ukrainian fairy tales, a scroll and your first lines of code',
  waysQ: 'Can you code?',
  ways: [
    ['🌱', 'No, from scratch', 'The ABC'],
    ['🧭', 'A little', 'World 0'],
    ['⚔️', 'Yes, give me problems', 'World 1'],
  ],
  features: [
    'Offline', 'TypeScript\u00a0· JavaScript\u00a0· Python', 'Ukrainian\u00a0· English', 'macOS\u00a0· Windows\u00a0· Linux',
    'Auto-update', 'No sign-up', 'Open source', 'Free',
  ],
  featuresTitle: 'Everything you need to start',
  outro: 'Outfox the problem.',
  cta: 'Download it free',
};

export const COPY = { uk, en };
export type Copy = typeof uk;
