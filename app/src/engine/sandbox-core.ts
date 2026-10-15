/*
 * Ядро пісочниці: компіляція коду гравця і виклик його функції зі спостереженням за читаннями.
 * Без DOM і без Worker API, тож працює і в Worker'і, і в Node (scripts/selftest.mjs).
 */
import { transform } from 'sucrase';
import type { CallResult, CallSpec, Lang, WorldEvent } from './types.ts';

export const SOURCE_URL = 'slovo.js';

export interface CodeError { message: string; line?: number }

type PlayerFn = (...args: unknown[]) => unknown;

/** Хто зараз слухає console.log гравця: кожен виклик підставляє свій збирач. */
let logSink: (text: string) => void = () => {};

const playerConsole = Object.freeze({
  log: (...a: unknown[]) => logSink(a.map(show).join(' ')),
  info: (...a: unknown[]) => logSink(a.map(show).join(' ')),
  warn: (...a: unknown[]) => logSink(a.map(show).join(' ')),
  error: (...a: unknown[]) => logSink(a.map(show).join(' ')),
});

/** Рядок помилки з позиції sucrase «(3:11)» або зі стеку «slovo.js:3:11». */
export function lineOf(err: unknown): number | undefined {
  const e = err as { loc?: { line: number }; stack?: string };
  if (e && e.loc && typeof e.loc.line === 'number') return e.loc.line;
  const m = e && typeof e.stack === 'string' ? e.stack.match(/slovo\.js:(\d+):\d+/) : null;
  return m ? Number(m[1]) : undefined;
}

function errorOf(err: unknown): CodeError {
  const message = err instanceof Error ? err.message.replace(/\s*\(\d+:\d+\)$/, '') : String(err);
  return { message, line: lineOf(err) };
}

/** TS → JS без зсуву рядків (sucrase лише знімає типи), далі eval у власній області видимості. */
export function compile(code: string, lang: Lang, entry: string): { fn: PlayerFn } | { error: CodeError } {
  let js: string;
  try {
    js = transform(code, { transforms: lang === 'ts' ? ['typescript'] : [], disableESTransforms: true }).code;
  } catch (err) {
    return { error: errorOf(err) };
  }
  // Обгортка стоїть на першому рядку коду, тож номери рядків у стеку збігаються з редактором.
  const src = `(function(console){"use strict";${js}\n;return typeof ${entry}==="function"?${entry}:undefined;})\n//# sourceURL=${SOURCE_URL}`;
  let fn: unknown;
  try {
    fn = (0, eval)(src)(playerConsole);
  } catch (err) {
    return { error: errorOf(err) };
  }
  if (typeof fn !== 'function') {
    return { error: { message: `Не знайдено функцію ${entry}. Не перейменовуй її.` } };
  }
  return { fn: fn as PlayerFn };
}

class OverBudget extends Error {}

/** Викликає функцію гравця один раз. Масиви з `observe` загортаються в Proxy, що рахує читання. */
export function runCall(fn: PlayerFn, spec: CallSpec, eventLimit: number): CallResult {
  const events: WorldEvent[] = [];
  const logs: string[] = [];
  let reads = 0;
  let counting = true;
  let overBudget = false;
  const budget = spec.readBudget ?? Infinity;

  const push = (e: WorldEvent) => { if (spec.record && events.length < eventLimit) events.push(e); };
  logSink = (text) => {
    if (logs.length < 200) logs.push(text.length > 500 ? text.slice(0, 500) + '…' : text);
    push({ t: 'log', text });
  };

  const watch = (arr: unknown[], name: string) =>
    new Proxy(arr, {
      get(target, prop, recv) {
        if (counting && typeof prop === 'string' && isIndex(prop)) {
          if (overBudget) throw new OverBudget();
          reads++;
          if (reads > budget) { overBudget = true; throw new OverBudget(); }
          push({ t: 'read', arr: name, i: Number(prop) });
        }
        return Reflect.get(target, prop, recv);
      },
      set(target, prop, value, recv) {
        if (counting && typeof prop === 'string' && isIndex(prop)) push({ t: 'write', arr: name, i: Number(prop), v: value });
        return Reflect.set(target, prop, value, recv);
      },
    });

  const args = spec.args.map((a, i) => (Array.isArray(a) && spec.observe[i] ? watch(a, spec.observe[i]!) : a));
  const t0 = performance.now();
  let value: unknown;
  let error: CodeError | undefined;
  try {
    value = fn(...args);
  } catch (err) {
    if (!overBudget && !(err instanceof OverBudget)) error = errorOf(err);
  }
  const ms = performance.now() - t0;
  counting = false;
  logSink = () => {};
  return { value: overBudget || error ? undefined : plain(value), error, reads, overBudget, events, logs, ms };
}

function isIndex(p: string): boolean {
  if (p.length === 0 || p.length > 10) return false;
  for (let k = 0; k < p.length; k++) { const c = p.charCodeAt(k); if (c < 48 || c > 57) return false; }
  return p === '0' || p[0] !== '0';
}

/** Значення, яке можна передати з Worker'а: без Proxy, функцій і циклів. */
function plain(v: unknown, depth = 0): unknown {
  if (v === null || typeof v !== 'object') return typeof v === 'function' ? '[function]' : v;
  if (depth > 6) return '…';
  if (Array.isArray(v)) return Array.from(v, (x) => plain(x, depth + 1));
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(v)) out[k] = plain((v as Record<string, unknown>)[k], depth + 1);
  return out;
}

export function show(v: unknown): string {
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(plain(v)) ?? String(v);
  } catch {
    return String(v);
  }
}
