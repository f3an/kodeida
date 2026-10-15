// Перевірка рушія й рівнів без браузера: кожне лисяче рішення проходить Суд богів, Вовче — ні,
// стартовий код компілюється, помилки вказують рядок.
import assert from 'node:assert/strict';
import { compile, runCall } from '../src/engine/sandbox-core.ts';
import { planJudge, verdictOf } from '../src/engine/judge.ts';
import { levels } from '../src/levels/index.ts';

function judge(level, code, lang = 'ts') {
  const { planned, calls } = planJudge(level);
  const c = compile(code, lang, level.entry);
  if ('error' in c) return verdictOf(level, planned, { compileError: c.error, results: [] });
  return verdictOf(level, planned, { results: calls.map((s) => runCall(c.fn, s, 1000)) });
}
const why = (r) => JSON.stringify(r.error ?? r.cases.filter((c) => c.verdict !== 'ok').slice(0, 2));

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('ok', name); };

const ids = new Set();
for (const level of levels) {
  test(`${level.id}: унікальний id і ${level.examples.length} приклад(и)`, () => {
    assert.ok(!ids.has(level.id)); ids.add(level.id);
    assert.ok(level.examples.length > 0);
  });
  test(`${level.id}: лисяче рішення`, () => {
    const r = judge(level, level.solution);
    assert.equal(r.verdict, 'fox', why(r));
    if (level.big) assert.ok(r.bigReads <= level.big.readBudget(level.big.n));
  });
  if (level.wolf && level.big) test(`${level.id}: вовче рішення`, () => { const r = judge(level, level.wolf.code, 'js'); assert.equal(r.verdict, 'wolf', why(r)); });
  test(`${level.id}: стартовий код компілюється в TS і JS`, () => {
    assert.ok('fn' in compile(level.starter.ts, 'ts', level.entry), level.starter.ts);
    assert.ok('fn' in compile(level.starter.js, 'js', level.entry), level.starter.js);
    if (level.id !== 'troy.step') assert.notEqual(judge(level, level.starter.ts).verdict, 'fox');
  });
  test(`${level.id}: анімований прогін дає події`, () => {
    const c = compile(level.solution, 'ts', level.entry);
    const r = runCall(c.fn, { args: structuredClone(level.examples[0].args), observe: level.observe, record: true, forbid: level.forbid }, 5000);
    assert.equal(r.error, undefined, JSON.stringify(r.error));
    assert.ok(r.events.length > 0);
  });
}

test('помилка виконання вказує рядок і перекладена', () => {
  const c = compile('function maxArea(height: number[]): number {\n  let best = 0;\n  return best + right;\n}', 'ts', 'maxArea');
  const r = runCall(c.fn, { args: [[1, 2]], observe: ['height'], record: false }, 0);
  assert.equal(r.error.line, 3);
  assert.match(r.error.message, /змінну right не оголошено/);
});
test('синтаксична помилка вказує рядок', () => assert.equal(compile('function f(h: number[]) {\n  let x = ;\n}', 'ts', 'f').error.line, 2));
test('перейменована функція', () => assert.match(compile('function f(){}', 'js', 'maxArea').error.message, /maxArea/));
test('лог подій і console.log', () => {
  const c = compile('function f(h){ console.log("start", h.length); return h[0] + h[1]; }', 'js', 'f');
  const r = runCall(c.fn, { args: [[3, 4]], observe: ['h'], record: true }, 100);
  assert.equal(r.value, 7);
  assert.deepEqual(r.events, [{ t: 'log', text: 'start 2' }, { t: 'read', arr: 'h', i: 0 }, { t: 'read', arr: 'h', i: 1 }]);
});
test('перехоплений бюджет усе одно Вовчий', () => {
  const c = compile('function f(h){ let s=0; for(let i=0;i<100;i++){ try { s+=h[0]; } catch {} } return s; }', 'js', 'f');
  assert.equal(runCall(c.fn, { args: [[1]], observe: ['h'], record: false, readBudget: 10 }, 0).overBudget, true);
});
test('заборонений метод', () => {
  const c = compile('function f(a){ a.sort(); }', 'js', 'f');
  assert.match(runCall(c.fn, { args: [[2, 1]], observe: ['a'], record: false, forbid: ['sort'] }, 0).error.message, /sort/);
});
test('рядок під наглядом рахує читання', () => {
  const c = compile('function f(s){ return s[0] + s.charAt(2) + s.length + s.toUpperCase(); }', 'js', 'f');
  const r = runCall(c.fn, { args: ['abc'], observe: ['s'], record: true }, 100);
  assert.equal(r.value, 'ac3ABC');
  assert.equal(r.reads, 2);
});
test('порівняння рядка під наглядом: повтор без нагляду', () => {
  const c = compile('function f(s){ if (s === "abc") return 1; throw new Error("x"); }', 'js', 'f');
  assert.equal(runCall(c.fn, { args: ['abc'], observe: ['s'], record: true }, 100).value, 1);
});
test('Еней обпікся — помилка з рядком', () => {
  const c = compile('function f(enei){\n  enei.move();\n}', 'js', 'f');
  const r = runCall(c.fn, { args: [{ $actor: 'enei', setup: { cells: ['empty', 'fire', 'well'] } }], observe: [null], record: true }, 100);
  assert.equal(r.error.line, 2);
  assert.match(r.error.message, /вогонь/);
});
test('Еней не йде за кінець вулиці', () => {
  const c = compile('function f(enei){ while (true) enei.move(); }', 'js', 'f');
  const r = runCall(c.fn, { args: [{ $actor: 'enei', setup: { cells: ['empty', 'empty'] } }], observe: [null], record: false }, 0);
  assert.ok(r.error);
});
console.log(`\n${n} перевірок пройдено`);
