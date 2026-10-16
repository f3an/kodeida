// Перевірка рушія й рівнів без браузера: кожне лисяче рішення проходить Суд богів, Вовче — ні,
// стартовий код компілюється, помилки вказують рядок.
import assert from 'node:assert/strict';
import { compile, runCall } from '../src/engine/sandbox-core.ts';
import { planJudge, verdictOf } from '../src/engine/judge.ts';
import { levels } from '../src/levels/index.ts';
import { trackLevels } from '../src/levels/abetka.ts';
import { loadPyodide } from 'pyodide';
import { createPyEngine, pyEntry } from '../src/engine/py-core.ts';
import { PY, pyText } from '../src/levels/python.ts';
import { starterOf, lt } from '../src/levels/text.ts';

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
    const r = runCall(c.fn, { args: structuredClone(level.examples[0].args), observe: level.observe, record: true, forbid: level.forbid, memory: level.memory }, 5000);
    assert.equal(r.error, undefined, JSON.stringify(r.error));
    assert.ok(r.events.length > 0);
    if (level.memory) assert.ok(r.events.some((e) => e.t === 'mem'), `${level.id}: memory operations were not recorded`);
  });
}

test('forest.twosum: великий тест має єдину пару', () => {
  const level = levels.find((l) => l.id === 'forest.twosum');
  const [nums, target] = level.big.make(level.big.n);
  assert.equal(new Set(nums).size, nums.length);
  assert.equal(target % 2, 1);
  const odd = nums.filter((x) => x % 2 !== 0);
  assert.equal(odd.length, 1);
  assert.equal(nums.filter((x) => x === target - odd[0]).length, 1);
});

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

// ---- Python (Pyodide) ----
const pyodide = await loadPyodide();
const py = createPyEngine(pyodide);
function judgePy(level, code) {
  const { planned, calls } = planJudge(level);
  const c = py.compile(code, pyEntry(level.entry), false);
  if ('error' in c) return verdictOf(level, planned, { compileError: c.error, results: [] });
  return verdictOf(level, planned, { results: calls.map((s) => py.runCall(s, 1000, false)) });
}
for (const level of levels) {
  const part = PY[level.id];
  test(`${level.id}: Python є`, () => assert.ok(part));
  test(`${level.id}: Python — лисяче рішення`, () => {
    const r = judgePy(level, part.solution);
    assert.equal(r.verdict, 'fox', why(r));
    if (level.big) assert.ok(r.bigReads <= level.big.readBudget(level.big.n), `reads ${r.bigReads}`);
  });
  if (level.wolf && level.big) test(`${level.id}: Python — вовче рішення`, () => { const r = judgePy(level, part.wolf); assert.equal(r.verdict, 'wolf', why(r)); });
  test(`${level.id}: Python — стартовий код компілюється`, () => {
    const code = starterOf(level, 'py');
    assert.ok('ok' in py.compile(code, pyEntry(level.entry), false), code);
    if (level.id !== 'troy.step') assert.notEqual(judgePy(level, code).verdict, 'fox');
  });
  test(`${level.id}: Python — анімований прогін`, () => {
    py.compile(part.solution, pyEntry(level.entry), false);
    const r = py.runCall({ args: structuredClone(level.examples[0].args), observe: level.observe, record: true, forbid: level.forbid, memory: level.memory }, 5000, false);
    assert.equal(r.error, undefined, JSON.stringify(r.error));
    assert.ok(r.events.length > 0);
    if (level.memory) assert.ok(r.events.some((e) => e.t === 'mem'), 'mem');
  });
  test(`${level.id}: Python — тексти без JS-залишків`, () => {
    const T = lt(level, 'py');
    const all = [T.brief, ...T.statement, T.lesson, ...(T.tool ? [...T.tool.text, T.tool.code] : [])].join('\n').replace(/<[^>]+>/g, '');
    assert.doesNotMatch(all, /===|!==|\.length\b|\bconst\b|\blet\b|=>|;\s*$/m, all);
  });
}
test('Python: помилка виконання вказує рядок', () => {
  py.compile('def f(h):\n    x = 1\n    return x + right\n', 'f', false);
  const r = py.runCall({ args: [[1]], observe: ['h'], record: false }, 0, false);
  assert.equal(r.error.line, 3);
});
test('Python: синтаксична помилка вказує рядок', () => assert.equal(py.compile('def f(h):\n    x = \n', 'f', false).error.line, 2));
test('Python: заборонений sort/sorted/reverse', () => {
  py.compile('def f(a):\n    a.sort()\n', 'f', false);
  assert.match(py.runCall({ args: [[2, 1]], observe: ['a'], record: false, forbid: ['sort'] }, 0, false).error.message, /sort/);
});
test('Python: Еней обпікся', () => {
  py.compile('def f(enei):\n    enei.move()\n', 'f', false);
  const r = py.runCall({ args: [{ $actor: 'enei', setup: { cells: ['empty', 'fire', 'well'] } }], observe: [null], record: true }, 100, false);
  assert.equal(r.error.line, 2);
});

// ---- «Абетка»: вправи однієї мови, перевіряється вивід ----
for (const level of trackLevels) {
  const lang = level.track;
  const run = (code) => (lang === 'py' ? judgePy(level, code) : judge(level, code, lang));
  test(`${level.id}: унікальний id`, () => { assert.ok(!ids.has(level.id)); ids.add(level.id); });
  test(`${level.id}: рішення проходить`, () => { const r = run(level.solution); assert.equal(r.verdict, 'fox', why(r)); });
  test(`${level.id}: стартовий код компілюється й не проходить`, () => {
    const code = starterOf(level, lang);
    assert.ok(code.length > 0);
    assert.equal(starterOf(level, lang === 'py' ? 'js' : 'py'), '');
    const r = run(code);
    assert.notEqual(r.verdict, 'error', why(r));
    assert.notEqual(r.verdict, 'fox');
  });
  test(`${level.id}: зайвий рядок виводу — помилка`, () => {
    const extra = lang === 'py' ? level.solution.replace(/\n$/, '\n    print("ой")\n') : level.solution.replace(/\n}\n$/, '\n  console.log("ой");\n}\n');
    assert.notEqual(extra, level.solution);
    assert.equal(run(extra).verdict, 'wrong');
  });
  if (lang === 'py') test(`${level.id}: тексти без JS-залишків`, () => {
    const T = lt(level, 'py');
    const all = [T.brief, ...T.statement, ...T.hints, ...(T.tool ? [...T.tool.text, T.tool.code] : [])].join('\n').replace(/<[^>]+>/g, '');
    assert.doesNotMatch(all, /console\.log|;\s*$|\bconst\b|\blet\b/m, all);
  });
  else test(`${level.id}: тексти без Python-залишків`, () => {
    const T = lt(level, lang);
    const all = [T.brief, ...T.statement, ...T.hints, ...(T.tool ? [...T.tool.text, T.tool.code] : [])].join('\n');
    assert.doesNotMatch(all, /\bprint\(|\bdef\b/, all);
  });
}

console.log(`\n${n} перевірок пройдено`);
