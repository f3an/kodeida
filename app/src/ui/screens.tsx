import { useEffect, useState } from 'react';
import { PixelCanvas } from './PixelCanvas.tsx';
import { worlds } from '../levels/index.ts';
import { BOOK } from '../levels/book.ts';
import { Spr, SW, SH_, OB, SONGS, WORLD_SCENES, WORLD_INFO, MOTIFS, MOTIF_NAMES, drawMotif, drawEgg, makeEnei, makeFox, genericBg } from '../world/sprites.js';
import { levelOpen, nextLevel, shardOf, solved, starsOf, worldOpen, type Progress, type Settings } from './progress.ts';
import { bridge, APP_VERSION, type UpdateState } from './bridge.ts';
import type { Screen } from './App.tsx';
import type { Lang } from '../engine/types.ts';
import { L, siteT, uiLang, type UiLang } from '../i18n.ts';
import { lt, wt } from '../levels/text.ts';
import { OB_EN, BOOK_EN } from '../levels/en.ts';
import { Speech, type Speaker } from './Speech.tsx';

type Go = (s: Screen) => void;
const GINGER = '#e2702b';

/* ============================== Головне меню ============================== */

const HERO_ENEI = makeEnei(0), HERO_ENEI_BLINK = makeEnei(0, { blink: true });
const HERO_FOX = [makeFox(GINGER), makeFox(GINGER, { cursorOff: true })];

export function Menu({ progress, go, ui, setUi }: { progress: Progress; go: Go; ui: UiLang; setUi: (l: UiLang) => void }) {
  const started = Object.keys(progress.levels).length > 0 || progress.onboarded;
  const next = nextLevel(progress);
  const drawHero = (ctx: CanvasRenderingContext2D, f: number) => {
    drawEgg(ctx, 34, 44, 292, 56, 4, false, true, 0, f % 2 ? 0.9 : 0.97);
    (f % 7 === 6 ? HERO_ENEI_BLINK : HERO_ENEI).draw(ctx, 48, 20, 4);
    HERO_FOX[f % 2].draw(ctx, 520, 68, 4);
  };
  return (
    <div className="menu">
      <div className="lang-switch" role="group" aria-label={L('Мова інтерфейсу', 'Interface language')}>
        <button className={ui === 'uk' ? 'on' : ''} aria-pressed={ui === 'uk'} onClick={() => setUi('uk')}>UA</button>
        <button className={ui === 'en' ? 'on' : ''} aria-pressed={ui === 'en'} onClick={() => setUi('en')}>EN</button>
      </div>
      <div className="menu-card">
        <PixelCanvas width={720} height={320} draw={drawHero} interval={420} className="menu-hero" label={L('Еней, Кришталева Писанка і Лис Микита', 'Aeneas, the Crystal Pysanka and Mykyta the Fox')} />
        <h1><span className="brace">{'{'}</span>{L('Кодеїда', 'Kodeida')}</h1>
        <p className="tag">{L('Гра, де код рухає героя. Перехитри задачу.', 'A game where your code moves the hero. Outfox the problem.')}</p>
        <div className="menu-actions">
          {started ? (
            <button className="btn big run" onClick={() => go({ name: 'level', id: next.id })}>{L('Продовжити', 'Continue')}: {lt(next).title}</button>
          ) : (
            <button className="btn big run" onClick={() => go({ name: 'onboarding' })}>{L('Почати мандрівку', 'Start the journey')}</button>
          )}
          <button className="btn big" onClick={() => go({ name: 'map' })}>{L('Мапа світів', 'World map')}</button>
          {started && <button className="btn big" onClick={() => go({ name: 'onboarding' })}>{L('Переглянути вступ', 'Watch the intro')}</button>}
          <button className="btn big" onClick={() => go({ name: 'settings' })}>{L('Налаштування', 'Settings')}</button>
        </div>
        <p className="muted small">{L('Версія', 'Version')} {APP_VERSION} · {L('офлайн, без AI-підказок', 'offline, no AI hints')} · <a href="https://github.com/f3an/kodeida" target="_blank" rel="noreferrer">github.com/f3an/kodeida</a></p>
      </div>
    </div>
  );
}

/* ============================== Онбординг ============================== */

interface ObScene { kind: string; title: string; narr: string; lines: [string, string][]; act: string; bg: (sp: unknown, f: number) => void; fg?: (ctx: CanvasRenderingContext2D, f: number, s: number) => void }
const SCENES = OB as ObScene[];

/** Заставки вступу (сцени 1–10). Сцени 11–12 — справжній редактор і тур Сивілли, 13 — вправи світу 0, 14 — «Відплиття». */
export const INTRO_SCENES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const DEPARTURE_SCENES = [13];

/** Хто говорить у заставці: ім'я в сценарії → портрет. */
const OB_SPEAKER: Record<string, Speaker> = {
  'Зевс': 'zeus', 'Вакх': 'bacchus', 'Аполлон': 'apollo', 'Венера': 'venus', 'Нептун': 'neptune', 'Юнона': 'juno',
  'Еол': 'eol', 'Микита': 'fox', 'Вовк': 'wolf', 'Еней': 'enei', 'Сивілла': 'sibyl',
};
/** Колір Микити в заставці: рудий у лісі, попелястий у Трої, морський у відплитті. */
const OB_FOX: Record<number, string> = { 6: '#e2702b', 9: '#8d8780', 13: '#3f7fd0' };

export function Onboarding({ scenes, finishLabel, onDone, onSkip }: { scenes: number[]; finishLabel: string; onDone: () => void; onSkip?: () => void }) {
  const [k, setK] = useState(0);
  const [ln, setLn] = useState(0);
  const [seq, setSeq] = useState(0);
  const i = scenes[k];
  const o = SCENES[i];
  const en = uiLang() === 'en' ? OB_EN[i] : null;
  const text = { title: en?.title ?? o.title, narr: en?.narr ?? o.narr, lines: en?.lines ?? o.lines };
  const lastScene = k === scenes.length - 1;
  const lastLine = ln >= o.lines.length - 1;

  // «Далі» спершу гортає репліки сцени, потім саму сцену
  const next = () => {
    if (!lastLine) { setLn(ln + 1); setSeq((n) => n + 1); return; }
    if (lastScene) return onDone();
    setK(k + 1); setLn(0); setSeq((n) => n + 1);
  };
  const back = () => {
    if (ln > 0) { setLn(ln - 1); setSeq((n) => n + 1); return; }
    if (k === 0) return;
    const prev = SCENES[scenes[k - 1]];
    setK(k - 1); setLn(Math.max(0, prev.lines.length - 1)); setSeq((n) => n + 1);
  };
  const jump = (n: number) => { setK(n); setLn(0); setSeq((x) => x + 1); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') back();
      if (e.key === 'Escape' && onSkip) onSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const draw = (ctx: CanvasRenderingContext2D, f: number) => {
    const sp = new Spr(SW, SH_);
    o.bg(sp, f);
    sp.draw(ctx, 0, 0, 2);
    o.fg?.(ctx, f, 2);
  };
  const line = text.lines[ln];
  const speaker = o.lines[ln] ? OB_SPEAKER[o.lines[ln][0]] ?? 'enei' : null;
  const prevSpeaker = ln > 0 ? OB_SPEAKER[o.lines[ln - 1][0]] : null;
  const isLast = lastScene && lastLine;
  return (
    <div className="onboarding">
      <div className="ob-stage" onClick={next}>
        <PixelCanvas key={i} width={SW * 2} height={SH_ * 2} draw={draw} interval={260} className="ob-canvas" label={`${text.title}. ${text.narr}`} />
      </div>
      <div className="ob-text">
        <div className="eyebrow">{scenes.length > 1 ? `${L('Сцена', 'Scene')} ${k + 1} ${L('з', 'of')} ${scenes.length} · ` : ''}{L('заставка', 'cutscene')}</div>
        <h2 key={`t${i}`} className="ob-title">{text.title}</h2>
        <p key={`n${i}`} className="narr">{text.narr}</p>
        {line && speaker && (
          <Speech who={speaker} name={line[0]} text={line[1]} tone="say" fox={OB_FOX[i] ?? '#e2702b'} seq={seq} enter={prevSpeaker === speaker ? 'nod' : 'in'} />
        )}
        {o.lines.length > 1 && <div className="ob-lines">{o.lines.map((_, n) => <i key={n} className={n === ln ? 'on' : n < ln ? 'done' : ''} />)}</div>}
        {scenes.length > 1 && (
          <div className="ob-dots" role="tablist" aria-label={L('Сцени', 'Scenes')}>
            {scenes.map((si, n) => <button key={si} className={n === k ? 'on' : ''} aria-label={`${L('Сцена', 'Scene')} ${n + 1}: ${L(SCENES[si].title, OB_EN[si].title)}`} aria-selected={n === k} role="tab" onClick={() => jump(n)} />)}
          </div>
        )}
        <div className="ob-actions">
          {onSkip && <button className="btn" onClick={onSkip}>{L('Пропустити', 'Skip')}</button>}
          <span className="grow" />
          {(k > 0 || ln > 0) && <button className="btn" onClick={back}>{L('← Назад', '← Back')}</button>}
          <button className="btn run" onClick={next}>{isLast ? finishLabel : L('Далі →', 'Next →')}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== Книга хитрощів ============================== */

export function BookScreen({ progress }: { progress: Progress }) {
  return (
    <main className="page">
      <header className="page-h">
        <h1>{L('Книга хитрощів', 'Book of Tricks')}</h1>
        <p className="muted">{L('Кожен уламок Писанки — один прийом. Запис з\'являється, коли фінальну задачу світу розв\'язано по-лисячому.', 'Every shard of the Pysanka is one technique. A page appears when the world’s final problem is solved the fox way.')}</p>
      </header>
      <div className="book">
        {BOOK.map((t) => {
          const open = shardOf(progress, worlds[t.world]);
          const rows = (MOTIFS as Record<string, string[]>)[t.motif];
          const en = uiLang() === 'en' ? BOOK_EN[t.world] : null;
          const tx = { title: en?.title ?? t.title, when: en?.when ?? t.when, idea: en?.idea ?? t.idea, complexity: en?.complexity ?? t.complexity };
          const fin = worlds[t.world].levels[worlds[t.world].levels.length - 1];
          return (
            <article key={t.title} className={`trick${open ? '' : ' locked'}`}>
              <PixelCanvas width={54} height={54} draw={(ctx) => drawMotif(ctx, rows, 0, 0, 6, open ? '#b3202a' : '#3a4a40')} className="motif" label={L(`Візерунок «${(MOTIF_NAMES as Record<string, string>)[t.motif]}»`, 'Pattern')} />
              <div>
                <div className="eyebrow">{L('Світ', 'World')} {t.world} · {wt(worlds[t.world]).name}</div>
                <h2>{open ? tx.title : '???'}</h2>
                {open ? (
                  <>
                    <h3>{L('Коли брати', 'When to use')}</h3>
                    <ul>{tx.when.map((w) => <li key={w}>{w}</li>)}</ul>
                    <h3>{L('Ідея', 'Idea')}</h3>
                    <p>{tx.idea}</p>
                    <h3>{L('Шаблон', 'Template')}</h3>
                    <pre>{t.template}</pre>
                    <p className="muted">{tx.complexity} {L('Задачі на LeetCode', 'LeetCode problems')}: {t.problems.join(' · ')}.</p>
                  </>
                ) : <p className="muted">{L(`Розв'яжи «${lt(fin).title}» по-лисячому, щоб відкрити запис.`, `Solve “${lt(fin).title}” the fox way to open this page.`)}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

/* ============================== Вишиванка ============================== */

const MOTIF_ORDER = Object.keys(MOTIFS as Record<string, string[]>);
const MOTIF_EN: Record<string, string> = {
  waves: 'waves', rhombs: 'two meeting rhombs', chest: 'chest with cells', tower: 'tower', halved: 'halved rhomb', frame: 'frame',
  chain: 'chain', spiral: 'spiral', tree: 'tree of life', periwinkle: 'periwinkle', rose: 'rosette', zigzag: 'zigzag', combs: 'honeycomb',
};

export function ShirtScreen({ progress }: { progress: Progress }) {
  const got = new Set(worlds.filter((w) => shardOf(progress, w)).map((w) => w.motif!));
  const enei = makeEnei(got.size === 0 ? 0 : got.size < 6 ? 1 : 2);
  const starsTotal = worlds.flatMap((w) => w.levels).reduce((a, l) => a + starsOf(progress, l), 0);
  const starsMax = worlds.flatMap((w) => w.levels).length * 3;
  return (
    <main className="page">
      <header className="page-h">
        <h1>{L('Вишиванка Енея', 'Aeneas’s embroidered shirt')}</h1>
        <p className="muted">{L('Кожен уламок додає візерунок. Повністю вишита сорочка — візуальне резюме навичок.', 'Every shard adds a pattern. A fully embroidered shirt is a visual résumé of your skills.')}</p>
      </header>
      <div className="shirt-page">
        <PixelCanvas width={46 * 4} height={72 * 4} draw={(ctx) => enei.draw(ctx, 0, 0, 4)} className="shirt-enei" label={L('Еней у вишиванці', 'Aeneas in his embroidered shirt')} />
        <div>
          <div className="motifs">
            {MOTIF_ORDER.map((m) => (
              <figure key={m} className={got.has(m) ? 'on' : ''}>
                <PixelCanvas width={54} height={54} draw={(ctx) => drawMotif(ctx, (MOTIFS as Record<string, string[]>)[m], 0, 0, 6, got.has(m) ? '#b3202a' : '#33413a')} label={L((MOTIF_NAMES as Record<string, string>)[m], MOTIF_EN[m] ?? m)} />
                <figcaption>{got.has(m) ? L((MOTIF_NAMES as Record<string, string>)[m], MOTIF_EN[m] ?? m) : '···'}</figcaption>
              </figure>
            ))}
          </div>
          <p className="muted">{L('Візерунків', 'Patterns')}: {got.size} {L('з', 'of')} {MOTIF_ORDER.length} · {L('зірок', 'stars')}: {starsTotal} {L('з', 'of')} {starsMax}</p>
        </div>
      </div>
    </main>
  );
}

/* ============================== Налаштування ============================== */

export function SettingsScreen({ settings, setSettings, updates, onReset, go }: {
  settings: Settings; setSettings: (f: (s: Settings) => Settings) => void; updates: UpdateState | null; onReset: () => void; go: Go;
}) {
  const [confirm, setConfirm] = useState(false);
  const [checking, setChecking] = useState(false);
  return (
    <main className="page">
      <header className="page-h"><h1>{L('Налаштування', 'Settings')}</h1></header>
      <div className="settings">
        <section>
          <h2>{L('Мова', 'Language')}</h2>
          <label className="row">{L('Мова інтерфейсу', 'Interface language')}
            <select value={settings.ui} onChange={(e) => setSettings((s) => ({ ...s, ui: e.target.value as UiLang }))}>
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="row">{L('Мова слова ладу', 'Code language')}
            <select value={settings.lang} onChange={(e) => setSettings((s) => ({ ...s, lang: e.target.value as Lang }))}>
              <option value="ts">TypeScript</option>
              <option value="js">JavaScript</option>
            </select>
          </label>
          <label className="row">{L('Швидкість анімації', 'Animation speed')}
            <select value={settings.speed} onChange={(e) => setSettings((s) => ({ ...s, speed: Number(e.target.value) }))}>
              <option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option>
            </select>
          </label>
        </section>

        <section>
          <h2>{L('Оновлення', 'Updates')}</h2>
          <p className="muted">{L('Версія', 'Version')} {APP_VERSION}.</p>
          {bridge && updates?.supported ? (
            <>
              <label className="row check">
                <input type="checkbox" checked={updates.auto} onChange={(e) => bridge!.updates.setAuto(e.target.checked)} />
                {L('Завантажувати оновлення автоматично', 'Download updates automatically')}
              </label>
              <p>{updateText(updates)}</p>
              <div className="row-actions">
                <button className="btn" disabled={checking || updates.stage === 'downloading'} onClick={async () => { setChecking(true); await bridge!.updates.check(); setChecking(false); }}>{L('Перевірити зараз', 'Check now')}</button>
                {updates.stage === 'available' && <button className="btn run" onClick={() => bridge!.updates.download()}>{L('Завантажити', 'Download')} {updates.version}</button>}
                {updates.stage === 'downloaded' && <button className="btn run" onClick={() => bridge!.updates.install()}>{L('Перезапустити й оновити', 'Restart and update')}</button>}
              </div>
            </>
          ) : <p className="muted">{L('Оновлення працюють у встановленому застосунку: він сам перевіряє нові версії на GitHub.', 'Updates work in the installed app: it checks GitHub for new versions on its own.')}</p>}
        </section>

        <section>
          <h2>{L('Прогрес', 'Progress')}</h2>
          <div className="row-actions">
            <button className="btn" onClick={() => go({ name: 'onboarding' })}>{L('Переглянути вступ', 'Watch the intro')}</button>
            {!confirm
              ? <button className="btn danger" onClick={() => setConfirm(true)}>{L('Почати спочатку…', 'Start over…')}</button>
              : <><span>{L('Стерти зірки й прогрес? Код вправ лишиться.', 'Erase stars and progress? Your code stays.')}</span><button className="btn danger" onClick={() => { onReset(); setConfirm(false); }}>{L('Так, стерти', 'Yes, erase')}</button><button className="btn" onClick={() => setConfirm(false)}>{L('Ні', 'No')}</button></>}
          </div>
        </section>
      </div>
    </main>
  );
}

export function updateText(u: UpdateState): string {
  switch (u.stage) {
    case 'checking': return L('Перевіряю…', 'Checking…');
    case 'not-available': return L('У тебе найновіша версія.', 'You have the latest version.');
    case 'available': return L(`Доступна версія ${u.version}.`, `Version ${u.version} is available.`);
    case 'downloading': return L(`Завантажую ${u.version}: ${u.percent}%`, `Downloading ${u.version}: ${u.percent}%`);
    case 'downloaded': return L(`Версія ${u.version} готова — перезапусти, щоб оновитися.`, `Version ${u.version} is ready — restart to update.`);
    case 'error': return L(`Не вдалося перевірити оновлення: ${u.error}`, `Could not check for updates: ${u.error}`);
    default: return '';
  }
}
