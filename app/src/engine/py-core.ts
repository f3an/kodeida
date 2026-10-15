/*
 * Python-рушій: загортає Pyodide так, щоб він виглядав як sandbox-core.ts.
 * Без DOM і Worker API: працює і в Worker'і (py.worker.ts), і в Node (scripts/selftest.mjs).
 */
import type { CallResult, CallSpec } from './types.ts';
import { PY_PRELUDE } from './py-prelude.ts';

/** Те, що рушію треба від Pyodide. */
export interface PyodideLike {
  runPython(code: string): unknown;
  globals: { get(name: string): unknown };
}

export interface PyEngine {
  compile(code: string, entry: string, en: boolean): { error: { message: string; line?: number } } | { ok: true };
  runCall(spec: CallSpec, eventLimit: number, en: boolean): CallResult;
}

/** Ім'я функції в Python: camelCase рівня → snake_case. */
export const pyEntry = (entry: string) => entry.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());

/** Заборони рівня (імена JS-методів) → імена Python-методів і функцій. */
const FORBID: Record<string, string[]> = { reverse: ['reverse', 'reversed'], toReversed: ['reversed'], sort: ['sort', 'sorted'], toSorted: ['sorted'] };

export function createPyEngine(py: PyodideLike): PyEngine {
  py.runPython(PY_PRELUDE);
  const compileFn = py.globals.get('_compile') as (code: string, entry: string, en: boolean) => string;
  const callFn = py.globals.get('_call') as (args: string, spec: string) => string;
  return {
    compile(code, entry, en) {
      return JSON.parse(compileFn(code, entry, en));
    },
    runCall(spec, eventLimit, en) {
      const s = JSON.stringify({
        observe: spec.observe,
        record: spec.record,
        readBudget: spec.readBudget !== undefined && Number.isFinite(spec.readBudget) ? spec.readBudget : null,
        forbid: [...new Set((spec.forbid ?? []).flatMap((f) => FORBID[f] ?? [f]))],
        memory: !!spec.memory,
        limit: eventLimit,
        en,
      });
      const r = JSON.parse(callFn(JSON.stringify(spec.args), s));
      return {
        ...r,
        value: r.value === null ? undefined : r.value,
        error: r.error ?? undefined,
        argsAfter: r.argsAfter ?? undefined,
        street: r.street ?? undefined,
      } as CallResult;
    },
  };
}
