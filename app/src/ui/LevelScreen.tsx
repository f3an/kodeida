import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from './Editor.tsx';
import { WorldView, type WorldHandle } from './WorldView.tsx';
import { runInSandbox } from '../engine/runner.ts';
import { planJudge, verdictOf, short, expectedOf, judgeCall, gotOf, clone } from '../engine/judge.ts';
import type { Level } from '../engine/level.ts';
import type { JudgeReport, Lang } from '../engine/types.ts';
import type { SceneState } from '../world/scenes.ts';
import { worlds } from '../levels/index.ts';
import { load, save } from './storage.ts';
import { levelOpen, solved, starsOf, crewOf, CREW_MAX, TROJAN_NAMES, type Progress, type LevelProgress, type Settings } from './progress.ts';
import { Tour, SIBYL_TOUR } from './Tour.tsx';
import { Speech, type Speaker, type Tone } from './Speech.tsx';
import type { Screen } from './App.tsx';
import { L, fmt } from '../i18n.ts';
import { lt, wt, starterOf } from '../levels/text.ts';
import { TROJANS_EN } from '../levels/en.ts';
import { feedbackUrl } from './feedback.ts';
import { adviseError, adviseJudge, adviseRun, adviseSolved, adviseTimeout } from './coach.ts';
import type { CallResult } from '../engine/types.ts';

type Who = 'host' | 'fox' | 'juno' | 'sibyl' | 'system' | 'enei' | 'anchises' | 'warrior' | 'sailor' | 'woman';
/** Текст — функція, щоб після перемикання мови репліка теж перекладалась. */
interface Bubble { who: Who; text: () => string; tone: Tone; seq: number; enter: 'in' | 'nod' }
/** Хто говорить за «господаря» світу: Микита на попелищі, Еол у морі, Дидона в Карфагені. */
const HOST_SPRITE: Speaker[] = ['fox', 'eol', 'dido'];
type Tab = 'code' | 'statement' | 'hints' | 'sheet';
type Panel = 'tests' | 'console';

interface Props {
  level: Level;
  progress: Progress;
  setProgress: (f: (p: Progress) => Progress) => void;
  patchLevel: (id: string, p: Partial<LevelProgress>) => void;
  settings: Settings;
  setSettings: (f: (s: Settings) => Settings) => void;
  go: (s: Screen) => void;
}

export function LevelScreen({ level, progress, setProgress, patchLevel, settings, setSettings, go }: Props) {
  const world = worlds[level.world];
  const T = lt(level), WT = wt(world);
  const lang = settings.lang;
  const codeKey = (l: Lang) => `code.${level.id}.${l}`;
  const [code, setCode] = useState<Record<Lang, string>>(() => ({ ts: load(codeKey('ts'), starterOf(level, 'ts')), js: load(codeKey('js'), starterOf(level, 'js')) }));
  const mine = progress.levels[level.id] ?? { stars: 0, hintsUsed: 0 };
  const [tab, setTab] = useState<Tab>('code');
  const [panel, setPanel] = useState<Panel>('tests');
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [busy, setBusy] = useState<'' | 'run' | 'judge' | 'wolf'>('');
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const [report, setReport] = useState<JudgeReport | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  // Сцени 10–11 онбордингу: перший запуск у справжньому редакторі, потім тур Сивілли.
  const tutorial = level.id === 'troy.step' && !progress.toured;
  const [ranOnce, setRanOnce] = useState(false);
  const [touring, setTouring] = useState(false);
  // розмова на вході: поки вправу не пройдено, герої перемовляються; потім — звична репліка господаря
  const talk = !tutorial && !solved(progress, level) ? level.talk ?? [] : [];
  const talkLine = (k: number): Bubble => ({ who: talk[k].who, text: () => lt(level).talk![k].text, tone: 'say', seq: k, enter: k && talk[k - 1].who === talk[k].who ? 'nod' : 'in' });
  const start: Bubble = tutorial
    ? { who: 'sibyl', text: () => L('Скажи слово, і світ послухає. Слово вже написано — натисни «Запустити».', 'Say the word and the world will obey. The word is already written — press “Run”.'), tone: 'say', seq: 0, enter: 'in' }
    : talk.length ? talkLine(0)
    : { who: 'host', text: () => wt(world).host.line, tone: 'say', seq: 0, enter: 'in' };
  const crew = level.world === 0 ? crewOf(progress) : 0;
  const [bubble, setBubble] = useState<Bubble>(start);
  const [scene, setScene] = useState<SceneState | null>(null);
  const [actor, setActor] = useState<'heroes' | 'wolf'>('heroes');
  const [justSolved, setJustSolved] = useState(false);
  const pendingRun = useRef<{ ok: true | string; got: unknown; r: CallResult } | null>(null);
  const view = useRef<WorldHandle>(null);

  useEffect(() => { save(codeKey('ts'), code.ts); save(codeKey('js'), code.js); }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  const WHO: Record<Who, string> = {
    host: WT.host.who, fox: L('Микита', 'Mykyta'), juno: L('Юнона', 'Juno'), sibyl: L('Сивілла', 'Sibyl'), system: L('Еней', 'Aeneas'),
    enei: L('Еней', 'Aeneas'), anchises: L('Анхіз', 'Anchises'), warrior: L('Воїн', 'Warrior'), sailor: L('Моряк', 'Sailor'), woman: L('Троянка', 'Trojan woman'),
  };
  const SPRITE: Record<Who, Speaker> = {
    host: HOST_SPRITE[world.n] ?? 'fox', fox: 'fox', juno: 'juno', sibyl: 'sibyl', system: 'enei',
    enei: 'enei', anchises: 'anchises', warrior: 'warrior', sailor: 'sailor', woman: 'woman',
  };
  const say = (who: Who, text: () => string, tone: Tone = 'say') =>
    setBubble((b) => ({ who, text, tone, seq: b.seq + 1, enter: SPRITE[b.who] === SPRITE[who] ? 'nod' : 'in' }));
  // наступна репліка розмови — коли попередню дочитано; будь-яка дія гравця розмову перериває
  useEffect(() => {
    const k = bubble.seq;
    if (!talk.length || bubble.who !== talk[Math.min(k, talk.length - 1)].who || k >= talk.length - 1 || bubble.tone !== 'say') return;
    const t = setTimeout(() => setBubble((b) => (b.seq === k && b.who === talk[k].who ? talkLine(k + 1) : b)), 1600 + talk[k].text.length * 40);
    return () => clearTimeout(t);
  }, [bubble]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Помилка має бути видно одразу: Еней каже про неї сам, сцена здригається, рядок у редакторі блимає. */
  const [shake, setShake] = useState(0);
  useEffect(() => { if (!shake) return; const t = setTimeout(() => setShake(0), 520); return () => clearTimeout(t); }, [shake]);
  const oops = () => { view.current?.flash('fail'); setShake((n) => n + 1); };
  const stumble = (e: { message: string; line?: number }) => {
    setError(e);
    oops();
    // Микита пояснює типову помилку новачка; якщо не впізнав — Еней каже, що сталося
    const tip = adviseError(level, code[lang], e);
    if (tip) return say(tip.who, tip.text, 'error');
    say('system', () => (e.line ? L(`Ой! Я спіткнувся на рядку ${e.line}: ${e.message}`, `Oops! I stumbled on line ${e.line}: ${e.message}`) : L(`Ой! Я спіткнувся: ${e.message}`, `Oops! I stumbled: ${e.message}`)), 'error');
  };

  const finishRun = () => {
    const p = pendingRun.current;
    if (!p) return;
    pendingRun.current = null;
    if (p.ok === true && tutorial) {
      say('fox', () => L('Ой! Ти хто? Тобто… дякую за руку. Слухай, а що це за дивне вікно в тебе?', 'Oh! Who are you? I mean… thanks for the hand. Say, what is that strange window you have?'));
      setTimeout(() => setTouring(true), 1400);
      return;
    }
    const ok = p.ok;
    if (ok === true) say('host', () => (level.scene.type === 'street'
      ? L('Вийшло! Тепер на Суд богів (⌘⇧↵): там інші тести.', 'It worked! Now to the Judgement of the Gods (⌘⇧↵): it has other tests.')
      : L(`Повернуто ${short(p.got)} — правильно! Тепер на Суд богів (⌘⇧↵): там інші тести.`, `Returned ${short(p.got)} — correct! Now to the Judgement of the Gods (⌘⇧↵): it has other tests.`)));
    else {
      oops();
      const tip = adviseRun(level, code[lang], p.r, ok);
      if (tip) say(tip.who, tip.text, 'error');
      else say('host', () => L(`Не так: ${ok}.`, `Not quite: ${ok}.`), 'error');
    }
  };

  const run = useCallback(async () => {
    if (busy) return;
    setBusy('run'); setError(null); setTab('code'); setJustSolved(false); setRanOnce(true);
    const tc = level.examples[0];
    const out = await runInSandbox(
      { code: code[lang], lang, entry: level.entry, calls: [{ args: clone(tc.args), observe: level.observe, record: true, forbid: level.forbid }] },
      { timeoutMs: 2000, eventLimit: 5000 },
    );
    setBusy('');
    const r = out.results[0];
    setLogs(r?.logs ?? []);
    if (out.compileError) return stumble(out.compileError);
    if (out.timedOutAt !== undefined || !r) {
      setPanel('console');
      oops();
      const tip = adviseTimeout(level, code[lang]);
      if (/while|for/.test(code[lang])) return say(tip.who, () => `${L('Юнона сміється: шторм ще не скінчився. ', 'Juno laughs: the storm isn’t over. ')}${tip.text()}`, 'taunt');
      return say('juno', () => L('Ха! Мій шторм ще не скінчився, а ти вже видихся. Код працював понад 2 секунди: чи не зациклився він?', 'Ha! My storm isn’t over and you’re already worn out. The code ran for over 2 seconds: is it stuck in a loop?'), 'taunt');
    }
    setActor('heroes');
    const got = gotOf(level, r);
    if (r.error) {
      view.current?.show(tc, r.events, 'heroes', null);
      view.current?.play();
      return stumble(r.error);
    }
    pendingRun.current = { ok: judgeCall(level, tc, expectedOf(level, tc), r), got, r };
    const shown = level.scene.type === 'array' && r.value !== undefined ? short(r.value, 40) : null;
    view.current?.show(tc, r.events, 'heroes', shown);
    if (r.events.some((e) => e.t !== 'log')) { say('fox', () => L('Дивимося, куди поведе нас твоє слово…', 'Let’s see where your word takes us…')); view.current?.play(); }
    else finishRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, code, lang, level]);

  const onScene = useCallback((s: SceneState) => setScene(s), []);
  useEffect(() => { if (scene?.done && actor === 'heroes') finishRun(); }, [scene?.done, actor]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!(scene?.done && actor === 'wolf' && level.wolf && level.big)) return;
    const seen = scene.badge.value, n = level.big.n, w = level.wolf.reads(n);
    say('fox', () => L(`Вовк глянув ${seen} разів на прикладі. На ${fmt(n)} елементах буде близько ${fmt(w)}.`, `The Wolf looked ${seen} times on the example. On ${fmt(n)} elements it will be about ${fmt(w)}.`));
  }, [scene?.done, actor]); // eslint-disable-line react-hooks/exhaustive-deps

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
      oops();
      const tip = adviseJudge(level, code[lang], rep) ?? (level.scene.type === 'array' ? adviseRun(level, code[lang], { value: bad.got, events: [] } as unknown as CallResult, bad.why ?? '') : null);
      if (tip) say(tip.who, tip.text, 'error');
      else say('host', () => L(`Суд богів не згоден (${bad.kind === 'hidden' ? 'прихований тест' : bad.label}): ${bad.why}.`, `The gods disagree (${bad.kind === 'hidden' ? 'hidden test' : bad.label}): ${bad.why}.`), 'error');
    } else if (rep.verdict === 'timeout') { oops(); if (/while|for/.test(code[lang])) { const tip = adviseTimeout(level, code[lang]); say(tip.who, () => `${L('Юнона сміється: шторм ще не скінчився. ', 'Juno laughs: the storm isn’t over. ')}${tip.text()}`, 'taunt'); } else say('juno', () => L('Ха! Мій шторм ще не скінчився, а ти вже видихся. Котрийсь тест не вклався в час.', 'Ha! My storm isn’t over and you’re already worn out. One of the tests ran out of time.'), 'taunt'); }
    else if (rep.verdict === 'wolf') say('fox', () => L(`Так розв'язав би Вовк Неситий: відповіді правильні, але на ${fmt(level.big!.n)} елементах код дивиться на них понад ${fmt(level.big!.readBudget(level.big!.n))} разів. Пошукай хитрість.`, `That’s how the Greedy Wolf would solve it: the answers are right, but on ${fmt(level.big!.n)} elements the code looks at them over ${fmt(level.big!.readBudget(level.big!.n))} times. Look for a trick.`), 'taunt');
    else {
      view.current?.flash('win');
      const firstFox = starsOf(progress, level) < 2;
      const shard = level.final && world.motif && firstFox;
      const joinIdx = level.world === 0 ? world.levels.indexOf(level) - 1 : -1;
      const joins = joinIdx >= 0 && joinIdx < CREW_MAX && !solved(progress, level);
      const nudge = adviseSolved(level, code[lang]);
      say('fox', () => L(
        `Оце по-лисячому! ${lt(level).lesson}${shard ? ` Уламок знайдено: на вишиванці з'явився новий візерунок, а в Книзі хитрощів — «${wt(world).trick}».` : ''}${joins ? ` До ватаги приєднався ${TROJAN_NAMES[joinIdx]}: ватага = ${joinIdx + 1} / ${CREW_MAX}.` : ''}`,
        `That’s the fox way! ${lt(level).lesson}${shard ? ` Shard found: a new pattern appeared on the shirt, and the Book of Tricks has a new page — “${wt(world).trick}”.` : ''}${joins ? ` ${TROJANS_EN[joinIdx][0].toUpperCase() + TROJANS_EN[joinIdx].slice(1)} joined the crew: crew = ${joinIdx + 1} / ${CREW_MAX}.` : ''}`,
      ) + (nudge ? ` ${nudge}` : ''), 'win');
    }
    const quip = rep.verdict === 'fox' && !solved(progress, level) ? lt(level).quip : undefined;
    if (quip) setTimeout(() => setBubble((b) => (b.tone === 'win' ? { who: quip.who, text: () => lt(level).quip!.text, tone: 'say', seq: b.seq + 1, enter: 'in' } : b)), 7000);
    const stars = rep.verdict === 'fox' ? (mine.hintsUsed === 0 ? 3 : 2) : rep.verdict === 'wolf' ? 1 : 0;
    if (stars > 0) { patchLevel(level.id, { stars }); setJustSolved(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, code, lang, level, progress, mine.hintsUsed]);

  const watchWolf = async () => {
    if (busy || !level.wolf) return;
    setBusy('wolf');
    const tc = level.examples[0];
    const out = await runInSandbox({ code: level.wolf.code, lang: 'js', entry: level.entry, calls: [{ args: clone(tc.args), observe: level.observe, record: true }] });
    setBusy('');
    const r = out.results[0];
    if (!r) return;
    pendingRun.current = null;
    setActor('wolf');
    say('fox', () => L('Дивись, як рахує Вовк Неситий: кожен з кожним.', 'Watch how the Greedy Wolf counts: every one against every other.'));
    view.current?.show(tc, r.events, 'wolf');
    view.current?.play();
  };

  const reset = () => {
    setCode((c) => ({ ...c, [lang]: starterOf(level, lang) }));
    setError(null); setReport(null); setLogs([]); setBubble(start); setJustSolved(false);
    view.current?.show(level.examples[0], []);
    setActor('heroes');
  };

  const openHint = () => {
    const next = Math.min(3, mine.hintsUsed + 1);
    patchLevel(level.id, { hintsUsed: next });
    setTab('hints');
    say('sibyl', () => lt(level).hints[next - 1]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'Enter') { e.preventDefault(); judge(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [judge]);

  const idx = world.levels.indexOf(level);
  const next = world.levels[idx + 1] ?? worlds[level.world + 1]?.levels[0];
  const canNext = !!next && levelOpen(progress, next);
  const passed = report ? report.cases.filter((c) => c.verdict === 'ok').length : 0;
  const hasWolf = !!(level.wolf && level.big);
  const wolfBig = hasWolf ? level.wolf!.reads(level.big!.n) : 0;
  const myBig = report?.verdict === 'fox' ? report.bigReads ?? 0 : report?.verdict === 'wolf' ? wolfBig : null;
  const complexity = !hasWolf ? '—' : report?.verdict === 'fox' ? 'O(n)' : report?.verdict === 'wolf' ? 'O(n²)' : '—';
  const stars = starsOf(progress, level);

  return (
    <>
      <aside className="side">
        <div className="h">{L('Світ', 'World')} {world.n} · {WT.name}</div>
        {world.levels.map((l, i) => {
          const open = levelOpen(progress, l), done = solved(progress, l);
          return (
            <button key={l.id} className={`it${l === level ? ' on' : ''}${done ? ' done' : ''}`} disabled={!open} onClick={() => go({ name: 'level', id: l.id })}
              title={open ? lt(l).topic : L('Спершу розв\'яжи попередню вправу', 'Solve the previous exercise first')}>
              {done ? '✓' : open ? (l.final ? '★' : '○') : '🔒'} {i + 1}. {lt(l).title}
              <small>{lt(l).topic}</small>
            </button>
          );
        })}
        {world.n === 0 && !progress.skipBasics && !solved(progress, world.levels[world.levels.length - 1]) && (
          <button className="skip-basics" onClick={() => { const fin = world.levels[world.levels.length - 1]; setProgress((p) => ({ ...p, skipBasics: true })); go({ name: 'level', id: fin.id }); }}
            title={L('Відкрити всі вправи світу 0 і перейти до фінальної задачі', 'Open every world 0 exercise and go to the final problem')}>
            {L('Знаю основи JS — до «Припасів» ▸', 'I know JS basics — skip to “Supplies” ▸')}
          </button>
        )}
        {level.leetcode && (
          <a className="lc" href={`https://leetcode.com/problems/${level.leetcode.slug}/`} target="_blank" rel="noreferrer">
            {L('Перевір себе на LeetCode', 'Try it on LeetCode')}: {level.leetcode.n}. {level.leetcode.title} ↗
          </a>
        )}
      </aside>

      <main className="ed">
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'code'} className={tab === 'code' ? 'on' : ''} onClick={() => setTab('code')}>solution.{lang}</button>
          <button role="tab" aria-selected={tab === 'statement'} className={tab === 'statement' ? 'on' : ''} onClick={() => setTab('statement')}>{L('Умова', 'Problem')}</button>
          <button role="tab" data-tab="hints" aria-selected={tab === 'hints'} className={tab === 'hints' ? 'on' : ''} onClick={() => setTab('hints')} title={L('Підказки Сивілли', 'Sibyl’s hints')}>{L('Підказки', 'Hints')}</button>
          <button role="tab" aria-selected={tab === 'sheet'} className={tab === 'sheet' ? 'on' : ''} onClick={() => setTab('sheet')}>{L('Шпаргалка', 'Cheat sheet')}</button>
          <label className="lang">
            <span className="sr">{L('Мова коду', 'Code language')}</span>
            <select value={lang} onChange={(e) => { setSettings((s) => ({ ...s, lang: e.target.value as Lang })); setError(null); }}>
              <option value="ts">TypeScript</option>
              <option value="js">JavaScript</option>
            </select>
          </label>
        </div>
        <div className="brief">
          <span dangerouslySetInnerHTML={{ __html: T.brief }} />
          {T.tool && tab !== 'statement' && <button className="tool-chip" onClick={() => setTab('statement')}>🔧 {L('Новий інструмент', 'New tool')}: {T.tool.name} ▸</button>}
        </div>
        <div className="center">
          <div className={`pane${tab === 'code' ? '' : ' hidden'}`}>
            <Editor value={code[lang]} lang={lang} error={error}
              onChange={(v) => setCode((c) => (c[lang] === v ? c : { ...c, [lang]: v }))}
              onCursor={(line, col) => setCursor({ line, col })} onRun={run} />
          </div>
          {tab === 'statement' && (
            <div className="pane doc">
              <h2>{T.title}</h2>
              {T.statement.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
              {T.tool && (
                <section className="tool-card" aria-label={L('Новий інструмент', 'New tool')}>
                  <h3>🔧 {L('Новий інструмент', 'New tool')}: {T.tool.name}</h3>
                  {T.tool.text.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
                  <pre>{T.tool.code}</pre>
                  <button className="btn" onClick={() => setTab('code')}>{L('До коду', 'Back to the code')} ▸</button>
                </section>
              )}
              <h3>{L('Приклад', 'Example')}</h3>
              {level.examples.map((e, i) => <pre key={i}>{level.entry}({e.label}){expectedOf(level, e) !== undefined ? ` → ${short(expectedOf(level, e))}` : ''}</pre>)}
            </div>
          )}
          {tab === 'sheet' && (
            <div className="pane doc sheet">
              <h2>{L('Шпаргалка', 'Cheat sheet')}</h2>
              <p className="muted">{L('Усе, що ти вже бачив у світі 0: коротко й з прикладом.', 'Everything you have met in world 0, briefly and with an example.')}</p>
              {worlds[0].levels.filter((l, i) => l.tool && (level.world > 0 || i <= worlds[0].levels.indexOf(level))).map((l) => {
                const tool = lt(l).tool!;
                return (
                  <section key={l.id} className="tool-card">
                    <h3>{tool.name}</h3>
                    <p dangerouslySetInnerHTML={{ __html: tool.text[0] }} />
                    <pre>{tool.code}</pre>
                  </section>
                );
              })}
            </div>
          )}
          {tab === 'hints' && (
            <div className="pane doc">
              <h2>{L('Підказки Сивілли', 'Sibyl’s hints')}</h2>
              <p className="muted">{L('Три рівні: натяк → ідея → псевдокод. Відкрита підказка забирає третю зірку.', 'Three levels: nudge → idea → pseudocode. Opening a hint costs the third star.')}</p>
              {T.hints.map((h, i) => (
                <div key={i} className={`hint${i < mine.hintsUsed ? '' : ' locked'}`}>
                  <b>{[L('Натяк', 'Nudge'), L('Ідея', 'Idea'), L('Псевдокод', 'Pseudocode')][i]}</b>
                  {i < mine.hintsUsed ? <p>{h}</p> : <p className="muted">{L('Ще не відкрито.', 'Not opened yet.')}</p>}
                </div>
              ))}
              {mine.hintsUsed < 3 && <button className="btn" onClick={openHint}>{L('Попросити Сивіллу', 'Ask the Sibyl')}</button>}
            </div>
          )}
        </div>
        <div className="panel">
          <div className="ptabs" role="tablist">
            <button role="tab" aria-selected={panel === 'tests'} className={panel === 'tests' ? 'on' : ''} onClick={() => setPanel('tests')}>{L('Суд богів', 'Judgement')}</button>
            <button role="tab" aria-selected={panel === 'console'} className={panel === 'console' ? 'on' : ''} onClick={() => setPanel('console')}>{L('Консоль', 'Console')}{logs.length ? ` (${logs.length})` : ''}</button>
            {report && <span className={`v ${report.verdict}`}>{VERDICT()[report.verdict]} · {passed}/{report.cases.length}</span>}
          </div>
          {panel === 'tests' ? (
            <div className="tests">
              {!report && <p className="muted">{L(`Натисни «Суд богів» (⌘⇧↵), щоб перевірити рішення на всіх тестах${level.big ? `, зокрема на ${fmt(level.big.n)} елементах` : ''}.`, `Press “Judgement” (⌘⇧↵) to check the solution on all tests${level.big ? `, including ${fmt(level.big.n)} elements` : ''}.`)}</p>}
              {report?.cases.map((c, i) => (
                <div key={i} className={`tr ${c.verdict}`}>
                  <span className="ck">{MARK[c.verdict]}</span>
                  <span className="kind">{KIND()[c.kind]}</span>
                  <span className="lbl">{c.kind === 'hidden' ? L('прихований', 'hidden') : c.label}</span>
                  <span className="res" title={caseText(c)}>{caseText(c)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tests console">
              {logs.length === 0 ? <p className="muted">{L('Тут з\'явиться все, що виведе console.log.', 'Everything console.log prints shows up here.')}</p> : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
        </div>
      </main>

      <section className={`world-col w${world.n}`}>
        <div className="wh">
          <span>{L('Світ', 'World')} {world.n} · <b>{scene && scene.total ? `${L('крок', 'step')} ${scene.step} / ${scene.total}` : actor === 'wolf' ? L('Вовк', 'Wolf') : L('приклад', 'example')}</b></span>
          <button className={`btn run${busy === 'run' ? ' busy' : ''}${tutorial && !ranOnce ? ' pulse' : ''}`} onClick={run} title={L('Запустити на прикладі (⌘↵)', 'Run on the example (⌘↵)')}>▶ {L('Запустити', 'Run')}</button>
          <button className={`btn judge${busy === 'judge' ? ' busy' : ''}`} onClick={judge} title={L('Усі тести (⌘⇧↵)', 'All tests (⌘⇧↵)')}>⚖ {L('Суд богів', 'Judgement')}</button>
          <button className="btn step" onClick={() => view.current?.step()} disabled={!scene?.total || scene.done} title={L('Один крок', 'One step')}>{L('Крок', 'Step')}</button>
          <button className="btn" onClick={reset} title={L('Скинути код до початкового', 'Reset the code')}>↺</button>
        </div>
        <div className={`canvas-wrap${shake ? ' shake' : ''}`}>
          <WorldView key={level.id} ref={view} level={level} fox={world.fox} speed={settings.speed} crew={crew} onState={onScene} />
          <div className="best">{scene?.badge.label ?? ''}<b>{scene?.badge.value ?? ''}</b></div>
          <div className="speed" role="group" aria-label={L('Швидкість', 'Speed')}>
            {[1, 2, 4].map((s) => <button key={s} className={settings.speed === s ? 'on' : ''} onClick={() => setSettings((x) => ({ ...x, speed: s }))}>{s}×</button>)}
            <button onClick={() => view.current?.finish()} disabled={!scene?.total || scene.done} title={L('До кінця', 'Skip to the end')}>⏭</button>
          </div>
        </div>
        <Speech who={SPRITE[bubble.who]} name={WHO[bubble.who]} text={bubble.text()} tone={bubble.tone} fox={world.fox} seq={bubble.seq} enter={bubble.enter}
          action={justSolved && level.id === 'troy.sum' && !progress.departed
            ? <button className="btn next" onClick={() => go({ name: 'departure' })}>{L('Відплиття', 'Set sail')} ▸</button>
            : justSolved && (canNext
            ? <button className="btn next" onClick={() => go({ name: 'level', id: next!.id })}>{L('Далі', 'Next')}: {lt(next!).title} ▸</button>
            : <span className="row-actions">
                {level.id === 'carthage.dido' && <a className="btn" href={feedbackUrl(progress)} target="_blank" rel="noreferrer">💬 {L('Розкажи, як пройшло', 'Tell us how it went')}</a>}
                <button className="btn next" onClick={() => go({ name: 'map' })}>{L('До мапи', 'To the map')} ▸</button>
              </span>)} />
        {hasWolf ? (
          <div className="cmp">
            <div className="cmp-h">
              <span>{L('Скільки разів код дивиться на дані', 'How often the code looks at the data')} · n = {fmt(level.big!.n)}</span>
              <button className="link" onClick={watchWolf} disabled={!!busy}>{L('Як рахує Вовк', 'How the Wolf counts')} ▸</button>
            </div>
            <Bar who={L('Вовк Неситий', 'Greedy Wolf')} cls="w" value={wolfBig} max={wolfBig} text={`≈ ${fmt(wolfBig)}`} />
            <Bar who={L('Еней і Микита', 'Aeneas & Mykyta')} cls="e" value={myBig ?? 0} max={wolfBig}
              text={myBig === null ? L('після Суду', 'after Judgement') : report?.verdict === 'wolf' ? `> ${fmt(level.big!.readBudget(level.big!.n))}` : fmt(myBig)} />
            {report?.verdict === 'fox' && <div className="cmp-note">{L(`У ${fmt(Math.round(wolfBig / Math.max(1, myBig ?? 1)))} разів менше, ніж у Вовка.`, `${fmt(Math.round(wolfBig / Math.max(1, myBig ?? 1)))} times fewer than the Wolf.`)}</div>}
            {report?.verdict === 'wolf' && <div className="cmp-note bad">{L('Вовк так само: це O(n²). Пошукай хитрість.', 'Same as the Wolf: this is O(n²). Look for a trick.')}</div>}
          </div>
        ) : (
          <div className="cmp lesson">
            <div className="cmp-h"><span>{L('Хитрість цієї вправи', 'The trick of this exercise')}</span></div>
            <p><b>{T.topic[0].toUpperCase() + T.topic.slice(1)}.</b> {stars > 0 ? T.lesson : L('Розв\'яжи вправу — і Микита пояснить, у чому хитрість.', 'Solve the exercise and Mykyta will explain the trick.')}</p>
          </div>
        )}
      </section>

      {touring && <Tour steps={SIBYL_TOUR()} onDone={() => {
        setTouring(false);
        setProgress((p) => ({ ...p, toured: true }));
        say('sibyl', () => L('Тепер на Суд богів (⌘⇧↵): він перевірить слово на всіх тестах.', 'Now to the Judgement of the Gods (⌘⇧↵): it checks the word on all tests.'));
      }} />}
      <StatusBar level={level} cursor={cursor} complexity={complexity} stars={stars} lang={lang} />
    </>
  );
}

function StatusBar({ level, cursor, complexity, stars, lang }: { level: Level; cursor: { line: number; col: number }; complexity: string; stars: number; lang: Lang }) {
  return (
    <footer className="status">
      <span>● {L('Світ', 'World')} {level.world} · {lt(level).title}</span>
      <span>Ln {cursor.line}, Col {cursor.col}</span>
      <span>{L('Складність', 'Complexity')}: <b>{complexity}</b></span>
      <span aria-label={L(`${stars} з 3 зірок`, `${stars} of 3 stars`)}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
      <span>{lang === 'ts' ? 'TypeScript' : 'JavaScript'}</span>
    </footer>
  );
}

const VERDICT = (): Record<JudgeReport['verdict'], string> => ({
  fox: L('По-лисячому', 'The fox way'), wolf: L('Працює, але повільно', 'Works, but slowly'), wrong: L('Неправильна відповідь', 'Wrong answer'), timeout: L('Час вийшов', 'Time is up'), error: L('Помилка', 'Error'),
});
const MARK = { ok: '✓', wrong: '✗', error: '!', timeout: '⛈', overBudget: '🐺', skipped: '·' } as const;
const KIND = () => ({ example: L('приклад', 'example'), hidden: L('тест', 'test'), big: L('великий', 'big') });

function caseText(c: JudgeReport['cases'][number]) {
  switch (c.verdict) {
    case 'ok': return c.kind === 'big' ? `${fmt(c.reads ?? 0)} ${L('поглядів', 'looks')}` : c.got !== undefined ? `→ ${short(c.got)}` : L('виконано', 'done');
    case 'wrong': return c.why ?? '';
    case 'error': return c.error?.line ? `${L('рядок', 'line')} ${c.error.line}: ${c.error.message}` : c.error?.message ?? '';
    case 'timeout': return L('час вийшов', 'time is up');
    case 'overBudget': return L(`понад ${fmt(c.budget ?? 0)} поглядів`, `over ${fmt(c.budget ?? 0)} looks`);
    default: return L('не запускався', 'not run');
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
