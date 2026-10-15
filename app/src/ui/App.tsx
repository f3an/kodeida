import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from './Editor.tsx';
import { WorldView, type WorldHandle } from './WorldView.tsx';
import { runInSandbox } from '../engine/runner.ts';
import { planJudge, verdictOf, short, equal } from '../engine/judge.ts';
import type { JudgeReport, Lang } from '../engine/types.ts';
import type { SceneState } from '../world/carthage.ts';
import { levels } from '../levels/index.ts';
import { carthagePlanned } from '../levels/carthage.ts';
import { load, save } from './storage.ts';

const level = levels[0];
const fmt = (n: number) => n.toLocaleString('uk-UA');

type Who = 'dido' | 'fox' | 'juno' | 'sibyl' | 'system';
interface Bubble { who: Who; text: string }
const WHO: Record<Who, string> = { dido: 'Дидона', fox: 'Микита', juno: 'Юнона', sibyl: 'Сивілла', system: 'Світ' };
const START: Bubble = { who: 'dido', text: 'Скільки землі обгородиш шкурою, стільки й моя. Стовпи вже стоять, обери два.' };

type Tab = 'code' | 'statement' | 'hints';
type Panel = 'tests' | 'console';

interface Progress { stars: number; hintsUsed: number }

export function App() {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('lang', 'ts'));
  const [code, setCode] = useState<Record<Lang, string>>(() => ({
    ts: load(`code.${level.id}.ts`, level.starter.ts),
    js: load(`code.${level.id}.js`, level.starter.js),
  }));
  const [progress, setProgress] = useState<Progress>(() => load(`progress.${level.id}`, { stars: 0, hintsUsed: 0 }));
  const [tab, setTab] = useState<Tab>('code');
  const [panel, setPanel] = useState<Panel>('tests');
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [busy, setBusy] = useState<'' | 'run' | 'judge' | 'wolf'>('');
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const [report, setReport] = useState<JudgeReport | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [bubble, setBubble] = useState<Bubble>(START);
  const [scene, setScene] = useState<SceneState | null>(null);
  const [speed, setSpeed] = useState(1);
  const [actor, setActor] = useState<'heroes' | 'wolf'>('heroes');
  const pendingRun = useRef<{ value: unknown; expected: unknown; reads: number } | null>(null);
  const world = useRef<WorldHandle>(null);

  useEffect(() => save('lang', lang), [lang]);
  useEffect(() => { save(`code.${level.id}.ts`, code.ts); save(`code.${level.id}.js`, code.js); }, [code]);
  useEffect(() => save(`progress.${level.id}`, progress), [progress]);

  const say = (who: Who, text: string) => setBubble({ who, text });
  const stumble = (e: { message: string; line?: number }) => {
    setError(e);
    say('system', e.line ? `Еней спіткнувся на рядку ${e.line}: ${e.message}` : `Еней спіткнувся: ${e.message}`);
  };

  const run = useCallback(async () => {
    if (busy) return;
    setBusy('run'); setError(null); setTab('code');
    const ex = level.examples[0];
    const out = await runInSandbox(
      { code: code[lang], lang, entry: level.entry, calls: [{ args: ex.args, observe: level.observe, record: true }] },
      { timeoutMs: 2000, eventLimit: 5000 },
    );
    setBusy('');
    const r = out.results[0];
    setLogs(r?.logs ?? []);
    if (out.compileError) return stumble(out.compileError);
    if (out.timedOutAt !== undefined || !r) {
      setPanel('console');
      return say('juno', 'Ха! Мій шторм ще не скінчився, а ти вже видихся. Код працював понад 2 секунди: чи не зациклився він?');
    }
    if (r.error) return stumble(r.error);
    pendingRun.current = { value: r.value, expected: ex.expected, reads: r.reads };
    if (r.reads === 0) {
      world.current?.load(ex.args[0] as number[], [], 'heroes');
      setActor('heroes');
      return finishRun();
    }
    say('fox', 'Дивимося, куди ти поведеш нас із Енеєм…');
    setActor('heroes');
    world.current?.load(ex.args[0] as number[], r.events, 'heroes');
    world.current?.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, code, lang]);

  const finishRun = () => {
    const p = pendingRun.current;
    if (!p) return;
    pendingRun.current = null;
    if (equal(p.value, p.expected)) say('dido', `Повернув ${short(p.value)} — і це правда, більше землі тут не взяти. Тепер на Суд богів!`);
    else if (p.reads === 0) say('fox', `Код повернув ${short(p.value)}, навіть не глянувши на стовпи. Дидона очікувала ${short(p.expected)}.`);
    else say('dido', `Слово ладу повернуло ${short(p.value)}, а я очікувала ${short(p.expected)}. Подивись, яку ділянку ви обгородили.`);
  };

  const onScene = useCallback((s: SceneState) => setScene(s), []);
  useEffect(() => { if (scene?.done && actor === 'heroes') finishRun(); }, [scene?.done, actor]);
  useEffect(() => {
    if (scene?.done && actor === 'wolf') say('fox', `Вовк глянув на стовпи ${fmt(scene.reads)} разів, а їх лише ${(level.examples[0].args[0] as number[]).length}. На ${fmt(level.big!.n)} стовпах буде ${fmt(level.wolfReads(level.big!.n))}: шкура висохне раніше.`);
  }, [scene?.done, actor]);

  const judge = useCallback(async () => {
    if (busy) return;
    setBusy('judge'); setError(null); setPanel('tests'); setTab('code');
    const { planned, calls } = planJudge(level);
    const out = await runInSandbox({ code: code[lang], lang, entry: level.entry, calls }, { timeoutMs: 4000, eventLimit: 0 });
    const rep = verdictOf(level, planned, out);
    setBusy(''); setReport(rep); setLogs(rep.logs);
    if (rep.verdict === 'error') stumble(rep.error!);
    else if (rep.verdict === 'wrong') {
      const bad = rep.cases.find((c) => c.verdict === 'wrong')!;
      say('dido', `Суд богів не згоден: на ${bad.label} очікували ${short(bad.expected)}, а вийшло ${short(bad.got)}.`);
    } else if (rep.verdict === 'timeout') say('juno', 'Ха! Мій шторм ще не скінчився, а ти вже видихся. Котрийсь тест не вклався в час.');
    else if (rep.verdict === 'wolf') say('fox', `Так розв'язав би Вовк Неситий: відповіді правильні, але на ${fmt(level.big!.n)} стовпах код дивиться на них понад ${fmt(level.big!.readBudget(level.big!.n))} разів. Пошукай хитрість.`);
    else say('fox', `Оце по-лисячому! ${fmt(rep.bigReads ?? 0)} поглядів на ${fmt(level.big!.n)} стовпів, а Вовк ще рахує пари. Візерунок «два зустрічні ромби» — твій.`);
    const stars = rep.verdict === 'fox' ? (progress.hintsUsed === 0 ? 3 : 2) : rep.verdict === 'wolf' ? 1 : 0;
    if (stars > progress.stars) setProgress((p) => ({ ...p, stars }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, code, lang, progress]);

  const watchWolf = async () => {
    if (busy) return;
    setBusy('wolf');
    const ex = level.examples[0];
    const out = await runInSandbox({ code: level.wolfCode, lang: 'js', entry: level.entry, calls: [{ args: ex.args, observe: level.observe, record: true }] });
    setBusy('');
    const r = out.results[0];
    if (!r) return;
    pendingRun.current = null;
    setActor('wolf');
    say('fox', 'Дивись, як рахує Вовк Неситий: кожен стовп з кожним.');
    world.current?.load(ex.args[0] as number[], r.events, 'wolf');
    world.current?.play();
  };

  const reset = () => {
    setCode((c) => ({ ...c, [lang]: level.starter[lang] }));
    setError(null); setReport(null); setLogs([]); setBubble(START);
    world.current?.load(level.examples[0].args[0] as number[], [], 'heroes');
    setActor('heroes');
  };

  const openHint = () => {
    const next = Math.min(3, progress.hintsUsed + 1);
    setProgress((p) => ({ ...p, hintsUsed: Math.max(p.hintsUsed, next) }));
    setTab('hints');
    say('sibyl', level.hints[next - 1]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'Enter') { e.preventDefault(); judge(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [judge]);

  const solved = progress.stars >= 2;
  const wolfBig = level.wolfReads(level.big!.n);
  const myBig = report?.verdict === 'fox' ? report.bigReads ?? 0 : report?.verdict === 'wolf' ? wolfBig : null;
  const complexity = report?.verdict === 'fox' ? 'O(n)' : report?.verdict === 'wolf' ? 'O(n²)' : '—';
  const passed = report ? report.cases.filter((c) => c.verdict === 'ok').length : 0;

  return (
    <div className="app">
      <header className="titlebar">
        <span className="logo"><b>{'{'}</b> Кодеїда</span>
        <span className="crumbs">{level.song} · Світ {level.world} · {level.worldName}</span>
        <label className="lang">
          <span className="sr">Мова коду</span>
          <select value={lang} onChange={(e) => { setLang(e.target.value as Lang); setError(null); }}>
            <option value="ts">TypeScript</option>
            <option value="js">JavaScript</option>
          </select>
        </label>
      </header>

      <div className="body">
        <nav className="act" aria-label="Розділи">
          <button className="on" title="Вправи" aria-current="page">☰</button>
          <button title="Книга хитрощів — скоро" disabled>✦</button>
          <button title="Мапа світів — скоро" disabled>◈</button>
          <button title="Вишиванка — скоро" disabled>✚</button>
        </nav>

        <aside className="side">
          <div className="h">Світ {level.world} · Карфаген</div>
          {carthagePlanned.map((t) => <div key={t} className="it soon" title="Вправа в розробці">◌ {t} <small>скоро</small></div>)}
          <div className={`it on${solved ? ' done' : ''}`}>{solved ? '✓' : '★'} {level.title}</div>
          <div className="h">Книга хитрощів</div>
          <div className={`it${solved ? ' done' : ' muted'}`}>◇ Два вказівники {!solved && <small>після задачі</small>}</div>
          <div className="h">Вишиванка</div>
          <div className="shirt" aria-label={`Вишито ${solved ? 1 : 0} з 13 візерунків`}>
            {Array.from({ length: 13 }, (_, i) => <i key={i} className={i === 0 && solved ? 'f' : ''} />)}
          </div>
          {level.leetcode && (
            <a className="lc" href={`https://leetcode.com/problems/${level.leetcode.slug}/`} target="_blank" rel="noreferrer">
              Перевір себе на LeetCode: {level.leetcode.n}. {level.leetcode.title} ↗
            </a>
          )}
        </aside>

        <main className="ed">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'code'} className={tab === 'code' ? 'on' : ''} onClick={() => setTab('code')}>solution.{lang}</button>
            <button role="tab" aria-selected={tab === 'statement'} className={tab === 'statement' ? 'on' : ''} onClick={() => setTab('statement')}>Умова</button>
            <button role="tab" aria-selected={tab === 'hints'} className={tab === 'hints' ? 'on' : ''} onClick={() => setTab('hints')}>Підказки Сивілли</button>
          </div>
          <div className="brief" dangerouslySetInnerHTML={{ __html: level.brief }} />
          <div className="center">
            <div className={`pane${tab === 'code' ? '' : ' hidden'}`}>
              <Editor
                value={code[lang]} lang={lang} error={error}
                onChange={(v) => setCode((c) => (c[lang] === v ? c : { ...c, [lang]: v }))}
                onCursor={(line, col) => setCursor({ line, col })}
                onRun={run}
              />
            </div>
            {tab === 'statement' && (
              <div className="pane doc">
                <h2>{level.title}</h2>
                {level.statement.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
                <h3>Приклади</h3>
                {level.examples.map((e, i) => <pre key={i}>maxArea({e.label}) → {short(e.expected)}</pre>)}
              </div>
            )}
            {tab === 'hints' && (
              <div className="pane doc">
                <h2>Підказки Сивілли</h2>
                <p className="muted">Три рівні: натяк → ідея → псевдокод. Кожна відкрита підказка забирає третю зірку.</p>
                {level.hints.map((h, i) => (
                  <div key={i} className={`hint${i < progress.hintsUsed ? '' : ' locked'}`}>
                    <b>{['Натяк', 'Ідея', 'Псевдокод'][i]}</b>
                    {i < progress.hintsUsed ? <p>{h}</p> : <p className="muted">Ще не відкрито.</p>}
                  </div>
                ))}
                {progress.hintsUsed < 3 && <button className="btn" onClick={openHint}>Попросити Сивіллу</button>}
              </div>
            )}
          </div>
          <div className="panel">
            <div className="ptabs" role="tablist">
              <button role="tab" aria-selected={panel === 'tests'} className={panel === 'tests' ? 'on' : ''} onClick={() => setPanel('tests')}>Суд богів</button>
              <button role="tab" aria-selected={panel === 'console'} className={panel === 'console' ? 'on' : ''} onClick={() => setPanel('console')}>Консоль{logs.length ? ` (${logs.length})` : ''}</button>
              {report && <span className={`v ${report.verdict}`}>{VERDICT[report.verdict]} · {passed}/{report.cases.length}</span>}
            </div>
            {panel === 'tests' ? (
              <div className="tests">
                {!report && <p className="muted">Натисни «Суд богів» (⌘⇧↵), щоб перевірити рішення на всіх тестах, зокрема на 10 000 стовпах.</p>}
                {report?.cases.map((c, i) => (
                  <div key={i} className={`tr ${c.verdict}`}>
                    <span className="ck">{MARK[c.verdict]}</span>
                    <span className="kind">{KIND[c.kind]}</span>
                    <span className="lbl">{c.kind === 'hidden' ? 'прихований' : c.label}</span>
                    <span className="res">{caseText(c)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tests console">
                {logs.length === 0 ? <p className="muted">Тут з'явиться все, що виведе console.log.</p> : logs.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            )}
          </div>
        </main>

        <section className="world-col">
          <div className="wh">
            <span>Світ {level.world} · <b>{scene && scene.total ? `крок ${scene.step} / ${scene.total}` : actor === 'wolf' ? 'Вовк' : 'приклад 1'}</b></span>
            <button className={`btn run${busy === 'run' ? ' busy' : ''}`} onClick={run} title="Запустити на прикладі (⌘↵)">▶ Запустити</button>
            <button className={`btn judge${busy === 'judge' ? ' busy' : ''}`} onClick={judge} title="Усі тести (⌘⇧↵)">⚖ Суд богів</button>
            <button className="btn" onClick={() => world.current?.step()} disabled={!scene?.total} title="Один крок">Крок</button>
            <button className="btn" onClick={reset} title="Скинути код до початкового">↺</button>
          </div>
          <div className="canvas-wrap">
            <WorldView ref={world} heights={level.examples[0].args[0] as number[]} onState={onScene} speed={speed} />
            <div className="best">найкраще<b>{scene?.best ?? 0}</b></div>
            <div className="speed" role="group" aria-label="Швидкість">
              {[1, 2, 4].map((s) => <button key={s} className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)}>{s}×</button>)}
              <button onClick={() => world.current?.finish()} disabled={!scene?.total || scene.done} title="До кінця">⏭</button>
            </div>
          </div>
          <div className={`bubble ${bubble.who}`} aria-live="polite"><b>{WHO[bubble.who]}:</b> {bubble.text}</div>
          <div className="cmp">
            <div className="cmp-h">
              <span>Скільки разів код дивиться на стовпи · n = {fmt(level.big!.n)}</span>
              <button className="link" onClick={watchWolf} disabled={!!busy}>Як рахує Вовк ▸</button>
            </div>
            <Bar who="Вовк Неситий" cls="w" value={wolfBig} max={wolfBig} text={fmt(wolfBig)} />
            <Bar who="Еней і Микита" cls="e" value={myBig ?? 0} max={wolfBig}
              text={myBig === null ? 'після Суду' : report?.verdict === 'wolf' ? `> ${fmt(level.big!.readBudget(level.big!.n))}` : fmt(myBig)} />
            {report?.verdict === 'fox' && <div className="cmp-note">У {fmt(Math.round(wolfBig / Math.max(1, myBig ?? 1)))} разів менше, ніж у Вовка.</div>}
            {report?.verdict === 'wolf' && <div className="cmp-note bad">Шкура висохла раніше, ніж ти дорахував: це O(n²).</div>}
          </div>
        </section>
      </div>

      <footer className="status">
        <span>● Світ {level.world} · {level.title}</span>
        <span>Ln {cursor.line}, Col {cursor.col}</span>
        <span>Складність: <b>{complexity}</b></span>
        <span aria-label={`${progress.stars} з 3 зірок`}>{'★'.repeat(progress.stars)}{'☆'.repeat(3 - progress.stars)}</span>
        <span>{lang === 'ts' ? 'TypeScript' : 'JavaScript'}</span>
      </footer>
    </div>
  );
}

const VERDICT: Record<JudgeReport['verdict'], string> = {
  fox: 'По-лисячому', wolf: 'Працює, але повільно', wrong: 'Неправильна відповідь', timeout: 'Час вийшов', error: 'Помилка',
};
const MARK = { ok: '✓', wrong: '✗', error: '!', timeout: '⛈', overBudget: '🐺', skipped: '·' } as const;
const KIND = { example: 'приклад', hidden: 'тест', big: 'великий' } as const;

function caseText(c: JudgeReport['cases'][number]) {
  switch (c.verdict) {
    case 'ok': return c.kind === 'big' ? `${c.reads?.toLocaleString('uk-UA')} поглядів` : `→ ${short(c.got)}`;
    case 'wrong': return `очікували ${short(c.expected)}, отримали ${short(c.got)}`;
    case 'error': return c.error?.line ? `рядок ${c.error.line}: ${c.error.message}` : c.error?.message;
    case 'timeout': return 'час вийшов';
    case 'overBudget': return `понад ${c.budget?.toLocaleString('uk-UA')} поглядів`;
    default: return 'не запускався';
  }
}

function Bar({ who, cls, value, max, text }: { who: string; cls: string; value: number; max: number; text: string }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="bar">
      <span>{who}</span>
      <div className="tr"><div className={`fl ${cls}`} style={{ width: value ? `max(3px, ${pct}%)` : 0 }} /></div>
      <em>{text}</em>
    </div>
  );
}
