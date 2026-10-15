/** Мова «слова ладу» — коду гравця. */
export type Lang = 'ts' | 'js';

/** Подія, яку світ програє як анімацію. Однакова для будь-якої мови гравця. */
export type WorldEvent =
  | { t: 'read'; arr: string; i: number }
  | { t: 'write'; arr: string; i: number; v: unknown }
  | { t: 'log'; text: string };

/** Один виклик функції гравця всередині пісочниці. */
export interface CallSpec {
  args: unknown[];
  /** Назви для аргументів-масивів, за якими треба стежити (null — не стежити). */
  observe: (string | null)[];
  /** Записувати лог подій для анімації. */
  record: boolean;
  /** Скільки читань дозволено; більше — «Вовче рішення». */
  readBudget?: number;
}

export interface CallResult {
  value?: unknown;
  error?: { message: string; line?: number };
  reads: number;
  overBudget: boolean;
  events: WorldEvent[];
  logs: string[];
  ms: number;
}

export interface SandboxRequest {
  code: string;
  lang: Lang;
  entry: string;
  calls: CallSpec[];
  eventLimit: number;
}

export type SandboxMessage =
  | { type: 'compiled' }
  | { type: 'compileError'; error: { message: string; line?: number } }
  | { type: 'call'; index: number; result: CallResult }
  | { type: 'done' };

export interface TestCase {
  args: unknown[];
  expected: unknown;
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
