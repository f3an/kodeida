// Перевірка рушія без браузера: компіляція, рядки помилок, підрахунок читань, вердикти Суду богів.
import assert from 'node:assert/strict';
import { compile, runCall } from '../src/engine/sandbox-core.ts';
import { planJudge, verdictOf } from '../src/engine/judge.ts';
import { levels } from '../src/levels/index.ts';

const FOX = `function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, (r - l) * Math.min(height[l], height[r]));
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`;
const BROKEN = `function maxArea(height: number[]): number {
  let best = 0;
  return best + right;
}`;
const WRONG = `function maxArea(height) { return height.length; }`;

function judge(level, code, lang = 'ts') {
  const { planned, calls } = planJudge(level);
  const c = compile(code, lang, level.entry);
  if ('error' in c) return verdictOf(level, planned, { compileError: c.error, results: [] });
  return verdictOf(level, planned, { results: calls.map((s) => runCall(c.fn, s, 1000)) });
}

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('ok', name); };

for (const level of levels) {
  test(`${level.id}: лисяче рішення`, () => {
    const r = judge(level, FOX);
    assert.equal(r.verdict, 'fox', JSON.stringify(r.cases.filter((c) => c.verdict !== 'ok')));
    assert.ok(r.bigReads <= level.big.readBudget(level.big.n));
  });
  test(`${level.id}: вовче рішення`, () => assert.equal(judge(level, level.wolfCode, 'js').verdict, 'wolf'));
  test(`${level.id}: неправильна відповідь`, () => assert.equal(judge(level, WRONG, 'js').verdict, 'wrong'));
  test(`${level.id}: стартовий код компілюється в TS і JS`, () => {
    assert.ok('fn' in compile(level.starter.ts, 'ts', level.entry));
    assert.ok('fn' in compile(level.starter.js, 'js', level.entry));
  });
}

test('помилка виконання вказує рядок', () => {
  const r = judge(levels[0], BROKEN);
  assert.equal(r.verdict, 'error');
  assert.equal(r.error.line, 3);
  assert.match(r.error.message, /right/);
});
test('синтаксична помилка вказує рядок', () => {
  const c = compile('function maxArea(h: number[]) {\n  let x = ;\n}', 'ts', 'maxArea');
  assert.equal(c.error.line, 2);
});
test('перейменована функція', () => assert.match(compile('function f(){}', 'js', 'maxArea').error.message, /maxArea/));
test('лог подій і console.log', () => {
  const c = compile('function maxArea(h){ console.log("start", h.length); return h[0] + h[1]; }', 'js', 'maxArea');
  const r = runCall(c.fn, { args: [[3, 4]], observe: ['height'], record: true }, 100);
  assert.equal(r.value, 7);
  assert.equal(r.reads, 2);
  assert.deepEqual(r.events, [{ t: 'log', text: 'start 2' }, { t: 'read', arr: 'height', i: 0 }, { t: 'read', arr: 'height', i: 1 }]);
});
test('перехоплений бюджет усе одно Вовчий', () => {
  const c = compile('function maxArea(h){ let s=0; for(let i=0;i<100;i++){ try { s+=h[0]; } catch {} } return s; }', 'js', 'maxArea');
  const r = runCall(c.fn, { args: [[1]], observe: ['height'], record: false, readBudget: 10 }, 0);
  assert.equal(r.overBudget, true);
  assert.equal(r.value, undefined);
});
test('повернутий вхідний масив серіалізується без Proxy', () => {
  const c = compile('function f(a){ return a; }', 'js', 'f');
  assert.deepEqual(runCall(c.fn, { args: [[1, 2]], observe: ['a'], record: false }, 0).value, [1, 2]);
});
console.log(`\n${n} перевірок пройдено`);
