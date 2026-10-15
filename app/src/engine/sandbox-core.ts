/*
 * Ядро пісочниці: компіляція коду гравця і виклик його функції зі спостереженням за читаннями.
 * Без DOM і без Worker API, тож працює і в Worker'і, і в Node (scripts/selftest.mjs).
 */
import { transform } from 'sucrase';
import type { ActorArg, CallResult, CallSpec, Lang, StreetState, WorldEvent } from './types.ts';

export const SOURCE_URL = 'slovo.js';

/** Мова повідомлень світу й помилок (передається з інтерфейсу разом із запитом). */
let msgEn = false;
export function setMessageLang(l: 'uk' | 'en') { msgEn = l === 'en'; }
const M = (uk: string, en: string) => (msgEn ? en : uk);

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
  return { message: translate(message), line: lineOf(err) };
}

/** Найчастіші помилки рушія JS — українською, оригінал у дужках для пошуку. */
function translate(m: string): string {
  if (msgEn) return m;
  const rules: [RegExp, (x: RegExpMatchArray) => string][] = [
    [/^(\S+) is not defined$/, (x) => `змінну ${x[1]} не оголошено`],
    [/^Cannot read properties of (undefined|null) \(reading '(.+)'\)$/, (x) => `не можна взяти ${x[2]} у ${x[1]}`],
    [/^Cannot set properties of (undefined|null) \(setting '(.+)'\)$/, (x) => `не можна записати ${x[2]} в ${x[1]}`],
    [/^(\S+) is not a function$/, (x) => `${x[1]} — не функція`],
    [/^Assignment to constant variable\.$/, () => 'не можна змінити const — візьми let'],
    [/^Cannot access '(.+)' before initialization$/, (x) => `змінна ${x[1]} використана до оголошення`],
    [/^Maximum call stack size exceeded$/, () => 'рекурсія не зупиняється'],
    [/^Unexpected token/, () => 'зайвий або пропущений символ'],
  ];
  for (const [re, f] of rules) { const x = m.match(re); if (x) return `${f(x)} (${m})`; }
  return m;
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
    return { error: { message: M(`Не знайдено функцію ${entry}. Не перейменовуй її.`, `Function ${entry} not found. Don't rename it.`) } };
  }
  return { fn: fn as PlayerFn };
}

class OverBudget extends Error {}
/** Помилка світу (Еней обпікся, мішка немає…): показується як помилка гравця з рядком. */
class WorldError extends Error {}
const MAX_ACTIONS = 1000;

function isActor(a: unknown): a is ActorArg {
  return !!a && typeof a === 'object' && (a as ActorArg).$actor === 'enei';
}

/** Еней на вулиці світу 0. Кожна команда — подія 'act'; помилки світу зупиняють виконання. */
function makeStreet(setup: ActorArg['setup'], push: (e: WorldEvent) => void) {
  const st: StreetState = { cells: setup.cells.slice(), pos: setup.start ?? 0, bag: 0, crew: 0, burns: 0, actions: 0 };
  const act = (name: string, ok: boolean, note?: string) => {
    if (++st.actions > MAX_ACTIONS) throw new WorldError(M(`Еней зробив понад ${MAX_ACTIONS} дій і сів перепочити. Чи не зациклився код?`, `Aeneas made over ${MAX_ACTIONS} moves and sat down to rest. Is the code stuck in a loop?`));
    push({ t: 'act', name, ok, note });
    if (!ok) throw new WorldError(note ?? name);
  };
  const last = st.cells.length - 1;
  const api = Object.freeze({
    move() {
      if (st.pos >= last) return act('move', false, M('Далі дороги немає: Еней уже в кінці вулиці.', 'No road ahead: Aeneas is already at the end of the street.'));
      if (st.cells[st.pos + 1] === 'fire') { st.burns++; return act('move', false, M('Еней ступив у вогонь! Перевір, чи попереду не горить, і перестрибни.', 'Aeneas stepped into the fire! Check whether it burns ahead, and jump over.')); }
      st.pos++;
      if (st.cells[st.pos] === 'trojan') { st.crew++; st.cells[st.pos] = 'empty'; }
      act('move', true);
    },
    jump() {
      if (st.pos + 2 > last) return act('jump', false, M('Стрибати нікуди: вулиця закінчується.', 'Nowhere to jump: the street ends.'));
      if (st.cells[st.pos + 2] === 'fire') { st.burns++; return act('jump', false, M('Еней перестрибнув — і приземлився у вогонь.', 'Aeneas jumped — and landed in the fire.')); }
      st.pos += 2;
      act('jump', true);
    },
    take() {
      if (st.cells[st.pos] !== 'sack') return act('take', false, M(`Тут немає мішка (клітинка ${st.pos}).`, `There is no sack here (cell ${st.pos}).`));
      st.cells[st.pos] = 'empty'; st.bag++;
      act('take', true);
    },
    fireAhead() { return st.cells[st.pos + 1] === 'fire'; },
    sackHere() { return st.cells[st.pos] === 'sack'; },
    atEnd() { return st.pos >= last; },
    get position() { return st.pos; },
  });
  return { api, st };
}

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

  const forbid = new Set(spec.forbid ?? []);
  const read = (name: string, i: number) => {
    if (overBudget) throw new OverBudget();
    reads++;
    if (reads > budget) { overBudget = true; throw new OverBudget(); }
    push({ t: 'read', arr: name, i });
  };
  const watch = (arr: unknown[], name: string) =>
    new Proxy(arr, {
      get(target, prop, recv) {
        if (counting && typeof prop === 'string') {
          if (isIndex(prop)) read(name, Number(prop));
          else if (forbid.has(prop)) throw new WorldError(M(`У цій вправі метод ${prop}() заборонено — зроби це сам.`, `The ${prop}() method is forbidden in this exercise — do it yourself.`));
        }
        return Reflect.get(target, prop, recv);
      },
      set(target, prop, value, recv) {
        if (counting && typeof prop === 'string' && isIndex(prop)) push({ t: 'write', arr: name, i: Number(prop), v: value });
        return Reflect.set(target, prop, value, recv);
      },
    });

  let street: StreetState | undefined;
  const raw = spec.args.map((a) => (Array.isArray(a) ? a.slice() : a));
  const args = raw.map((a, i) => {
    if (isActor(a)) { const s = makeStreet(a.setup, push); street = s.st; return s.api; }
    if (Array.isArray(a) && spec.observe[i]) return watch(a, spec.observe[i]!);
    if (typeof a === 'string' && spec.observe[i] && spec.record) return watchString(a, spec.observe[i]!, read);
    return a;
  });
  const t0 = performance.now();
  let value: unknown;
  let error: CodeError | undefined;
  try {
    value = fn(...args);
  } catch (err) {
    if (!overBudget && !(err instanceof OverBudget)) error = errorOf(err);
  }
  // Рядок під наглядом поводиться майже як справжній; якщо код на це спіткнувся — повтор без нагляду.
  if (error && spec.record && raw.some((a, i) => typeof a === 'string' && spec.observe[i])) {
    logSink = () => {};
    const again = runCall(fn, { ...spec, record: false }, 0);
    if (!again.error) return { ...again, logs };
  }
  const ms = performance.now() - t0;
  counting = false;
  logSink = () => {};
  const bad = overBudget || !!error;
  return {
    value: bad ? undefined : plain(value), error, reads, overBudget, events, logs, ms,
    argsAfter: bad ? undefined : raw.map((a) => (isActor(a) ? null : plain(a))),
    street: street ? { ...street, cells: street.cells.slice() } : undefined,
  };
}

/** Рядок, що рахує читання s[i] і s.charAt(i). Об'єкт String, тож порівняння s === '…' не спрацює —
 *  тому нагляд вмикається лише для анімованого прогону, а Суд богів отримує звичайний рядок. */
function watchString(s: string, name: string, read: (name: string, i: number) => void) {
  const box = new String(s);
  return new Proxy(box, {
    get(target, prop) {
      if (typeof prop === 'string' && isIndex(prop)) { read(name, Number(prop)); return s[Number(prop)]; }
      if (prop === 'charAt' || prop === 'charCodeAt' || prop === 'codePointAt' || prop === 'at') {
        return (i: number) => { const k = Math.trunc(Number(i) || 0); read(name, k < 0 ? s.length + k : k); return (s as unknown as Record<string, (i: number) => unknown>)[prop](i); };
      }
      if (prop === Symbol.toPrimitive) return () => s;
      if (prop === 'length') return s.length;
      const v = Reflect.get(target, prop, target);
      return typeof v === 'function' ? v.bind(s) : v;
    },
  });
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
