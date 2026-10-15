/** Мова «слова ладу» — коду гравця. */
export type Lang = 'ts' | 'js' | 'py';

/** Подія, яку світ програє як анімацію. Однакова для будь-якої мови гравця. */
export type WorldEvent =
  | { t: 'read'; arr: string; i: number }
  | { t: 'write'; arr: string; i: number; v: unknown }
  | { t: 'log'; text: string }
  /** Команда Енея у світах з явними командами (світ 0): move, take, jump… */
  | { t: 'act'; name: string; ok: boolean; note?: string }
  /** Пам'ять гравця (світ 3): операція з Map чи Set; ключ і значення — уже як короткий текст. */
  | { t: 'mem'; op: 'set' | 'get' | 'has' | 'add' | 'delete'; k: string; v?: string; hit?: boolean };

/** Стан вулиці для вправ з командами Енея. */
export type StreetCell = 'empty' | 'sack' | 'fire' | 'well' | 'trojan';
export interface StreetSetup { cells: StreetCell[]; start?: number }
export interface StreetState { cells: StreetCell[]; pos: number; bag: number; crew: number; burns: number; actions: number }

/** Аргумент-заглушка: у пісочниці замінюється на об'єкт Енея на вулиці. */
export interface ActorArg { $actor: 'enei'; setup: StreetSetup }

/** Один виклик функції гравця всередині пісочниці. */
export interface CallSpec {
  args: unknown[];
  /** Назви для аргументів-масивів, за якими треба стежити (null — не стежити). */
  observe: (string | null)[];
  /** Записувати лог подій для анімації. */
  record: boolean;
  /** Скільки читань дозволено; більше — «Вовче рішення». */
  readBudget?: number;
  /** Методи масивів, які в цій вправі заборонено (напр. 'sort'). */
  forbid?: string[];
  /** Показувати «скриню»: записувати операції з Map і Set гравця. */
  memory?: boolean;
}

export interface CallResult {
  value?: unknown;
  error?: { message: string; line?: number };
  reads: number;
  overBudget: boolean;
  events: WorldEvent[];
  logs: string[];
  ms: number;
  /** Аргументи після виклику — для вправ, що змінюють масив на місці. */
  argsAfter?: unknown[];
  /** Стан вулиці після команд Енея. */
  street?: StreetState;
}

export interface SandboxRequest {
  code: string;
  lang: Lang;
  entry: string;
  calls: CallSpec[];
  eventLimit: number;
  /** Мова повідомлень світу. */
  ui?: 'uk' | 'en';
}

export type SandboxMessage =
  | { type: 'ready' }
  | { type: 'initError'; message: string }
  | { type: 'compiled' }
  | { type: 'compileError'; error: { message: string; line?: number } }
  | { type: 'call'; index: number; result: CallResult }
  | { type: 'done' };

export interface TestCase {
  args: unknown[];
  /** Очікувана відповідь (для вправ з командами — не потрібна, перевіряє level.check). */
  expected?: unknown;
  /** Підпис для панелі тестів, напр. «[1,8,6,2,5,4,8,3,7]». */
  label?: string;
}

export type Verdict = 'fox' | 'wolf' | 'wrong' | 'timeout' | 'error';

export interface CaseReport {
  kind: 'example' | 'hidden' | 'big';
  label: string;
  verdict: 'ok' | 'wrong' | 'error' | 'timeout' | 'overBudget' | 'skipped';
  expected?: unknown;
  got?: unknown;
  /** Пояснення для неправильної відповіді. */
  why?: string;
  reads?: number;
  budget?: number;
  error?: { message: string; line?: number };
}

export interface JudgeReport {
  verdict: Verdict;
  cases: CaseReport[];
  logs: string[];
  /** Читання гравця на великому тесті, якщо він пройшов. */
  bigReads?: number;
  bigN?: number;
  error?: { message: string; line?: number };
}
