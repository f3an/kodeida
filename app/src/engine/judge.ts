/* Суд богів: проганяє приклади, приховані тести й великий тест, виносить вердикт. */
import type { Level } from './level.ts';
import type { CallResult, CallSpec, CaseReport, JudgeReport, TestCase } from './types.ts';
import type { RunOutcome } from './runner.ts';
import { L, fmt } from '../i18n.ts';

export function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => equal(x, b[i]));
  return false;
}

export const short = (v: unknown, max = 60) => {
  const s = v === undefined ? L('нічого', 'nothing') : JSON.stringify(v) ?? String(v);
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
};

export function clone<T>(v: T): T {
  if (Array.isArray(v)) return v.map(clone) as T;
  if (v && typeof v === 'object') return JSON.parse(JSON.stringify(v));
  return v;
}

/** Очікувана відповідь тесту: задана вручну або від еталона (для inPlace — змінений масив). */
export function expectedOf(level: Level, tc: TestCase): unknown {
  if (tc.expected !== undefined || !level.reference) return tc.expected;
  const args = tc.args.map(clone);
  const v = (level.reference as (...a: unknown[]) => unknown)(...args);
  return level.inPlace !== undefined ? args[level.inPlace] : v;
}

/** Чи правильний результат виклику; рядок — пояснення, що не так. */
export function judgeCall(level: Level, tc: TestCase, expected: unknown, r: CallResult): true | string {
  if (level.check) return level.check({ ...tc, expected }, r);
  const got = level.inPlace !== undefined ? r.argsAfter?.[level.inPlace] : r.value;
  return equal(got, expected) || L(`очікували ${short(expected)}, отримали ${short(got)}`, `expected ${short(expected)}, got ${short(got)}`);
}

/** Що показати як «отримали». */
export function gotOf(level: Level, r: CallResult): unknown {
  return level.inPlace !== undefined ? r.argsAfter?.[level.inPlace] : r.value;
}

interface Planned { kind: CaseReport['kind']; tc: TestCase; expected: unknown; budget?: number }

export function planJudge(level: Level): { planned: Planned[]; calls: CallSpec[] } {
  const planned: Planned[] = [
    ...level.examples.map((tc) => ({ kind: 'example' as const, tc, expected: expectedOf(level, tc) })),
    ...level.hidden.map((tc) => ({ kind: 'hidden' as const, tc, expected: expectedOf(level, tc) })),
  ];
  if (level.big) {
    const tc = { args: level.big.make(level.big.n), label: `n = ${fmt(level.big.n)}` };
    planned.push({ kind: 'big', tc, expected: expectedOf(level, tc), budget: level.big.readBudget(level.big.n) });
  }
  const calls = planned.map((p) => ({ args: p.tc.args.map(clone), observe: level.observe, record: false, readBudget: p.budget, forbid: level.forbid }));
  return { planned, calls };
}

export function verdictOf(level: Level, planned: Planned[], out: RunOutcome): JudgeReport {
  const logs: string[] = [];
  if (out.compileError) {
    return { verdict: 'error', error: out.compileError, logs, cases: planned.map((p) => report(p, 'skipped')) };
  }
  const cases: CaseReport[] = planned.map((p, i) => {
    if (out.timedOutAt !== undefined && i === out.timedOutAt) return report(p, 'timeout');
    const r = out.results[i];
    if (!r) return report(p, 'skipped');
    logs.push(...r.logs);
    if (r.overBudget) return { ...report(p, 'overBudget'), reads: r.reads };
    if (r.error) return { ...report(p, 'error'), error: r.error, reads: r.reads };
    const ok = judgeCall(level, p.tc, p.expected, r);
    return { ...report(p, ok === true ? 'ok' : 'wrong'), got: gotOf(level, r), why: ok === true ? undefined : ok, reads: r.reads };
  });
  const first = (v: CaseReport['verdict']) => cases.find((c) => c.verdict === v);
  const big = cases.find((c) => c.kind === 'big');
  const base = { cases, logs: logs.slice(0, 200), bigN: level.big?.n };
  if (first('error')) return { ...base, verdict: 'error', error: first('error')!.error };
  if (first('wrong')) return { ...base, verdict: 'wrong' };
  // Великий тест: таймаут або перевищений бюджет читань означає, що рішення правильне, але Вовче.
  if (big && (big.verdict === 'overBudget' || big.verdict === 'timeout')) return { ...base, verdict: 'wolf' };
  if (first('timeout')) return { ...base, verdict: 'timeout' };
  return { ...base, verdict: 'fox', bigReads: big?.reads };
}

function report(p: Planned, verdict: CaseReport['verdict']): CaseReport {
  return { kind: p.kind, label: p.tc.label ?? p.tc.args.map((a) => short(a, 40)).join(', '), verdict, expected: p.expected, budget: p.budget };
}
