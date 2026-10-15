/* Суд богів: проганяє приклади, приховані тести й великий тест, виносить вердикт. */
import type { Level } from './level.ts';
import type { CallSpec, CaseReport, JudgeReport, Lang, TestCase } from './types.ts';
import type { RunOutcome } from './runner.ts';

export function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => equal(x, b[i]));
  return false;
}

export const short = (v: unknown, max = 60) => {
  const s = v === undefined ? 'undefined' : JSON.stringify(v) ?? String(v);
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
};

interface Planned { kind: CaseReport['kind']; tc: TestCase; budget?: number }

export function planJudge(level: Level): { planned: Planned[]; calls: CallSpec[] } {
  const planned: Planned[] = [
    ...level.examples.map((tc) => ({ kind: 'example' as const, tc })),
    ...level.hidden.map((tc) => ({ kind: 'hidden' as const, tc })),
  ];
  if (level.big) {
    const args = level.big.make(level.big.n);
    const expected = (level.reference as (...a: unknown[]) => unknown)(...args.map(clone));
    planned.push({ kind: 'big', tc: { args, expected, label: `n = ${level.big.n.toLocaleString('uk-UA')}` }, budget: level.big.readBudget(level.big.n) });
  }
  const calls = planned.map((p) => ({ args: p.tc.args.map(clone), observe: level.observe, record: false, readBudget: p.budget }));
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
    const ok = equal(r.value, p.tc.expected);
    return { ...report(p, ok ? 'ok' : 'wrong'), got: r.value, reads: r.reads };
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
  return { kind: p.kind, label: p.tc.label ?? p.tc.args.map((a) => short(a, 40)).join(', '), verdict, expected: p.tc.expected, budget: p.budget };
}

export function clone<T>(v: T): T {
  return Array.isArray(v) ? (v.map(clone) as T) : v;
}

export type { Lang };
