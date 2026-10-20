/*
 * Перехід між світами: «лад відновлено» (сцена завершеного світу) → «у дорогу» (кораблик пливе мапою)
 * → «новий світ» (сцена нового світу, Микита перефарбовується на очах). Та сама рамка, що й у заставках вступу.
 */
import { useEffect, useRef, useState } from 'react';
import { PixelCanvas } from './PixelCanvas.tsx';
import { Speech, type Speaker } from './Speech.tsx';
import { L, uiLang } from '../i18n.ts';
import { worlds } from '../levels/index.ts';
import { VOYAGES, type Who } from '../levels/voyages.ts';
import { ALL_WORLDS, MW, MH, MS, SW, SH_, paintJourney, paintWorldArt, routePoint, foxFor } from '../world/sprites.js';
import { paintWorldNew } from '../world/cutscenes.ts';

const VOICE: Record<Who, [Speaker, string, string]> = {
  fox: ['fox', 'Микита', 'Mykyta'], enei: ['enei', 'Еней', 'Aeneas'], juno: ['juno', 'Юнона', 'Juno'], wolf: ['wolf', 'Вовк Неситий', 'Greedy Wolf'],
  sibyl: ['sibyl', 'Сивілла', 'Sibyl'], eol: ['eol', 'Еол', 'Aeolus'], dido: ['dido', 'Дидона', 'Dido'], lion: ['lion', 'Цар Лев', 'King Lion'],
  mitten: ['mitten', 'Мишка-шкряботушка', 'Mousie-Scratcher'], sotnyk: ['sotnyk', 'Сотник Забрьоха', 'Captain Zabrokha'],
  acestes: ['acestes', 'Ацест', 'Acestes'], ox: ['ox', 'Віл Половий', 'Pale Ox'], charon: ['charon', 'Харон', 'Charon'],
};

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Чи є заставка переходу після світу from (і чи вже існує наступний світ). */
export const hasVoyage = (from: number) => !!VOYAGES[from] && !!worlds[from + 1];

export function VoyageScreen({ from, onDone }: { from: number; onDone: () => void }) {
  const v = VOYAGES[from];
  const slides = [v.leave, v.sail, v.arrive];
  const [k, setK] = useState(0);
  const [ln, setLn] = useState(0);
  const [seq, setSeq] = useState(0);
  const t0 = useRef(performance.now());
  useEffect(() => { t0.current = performance.now(); }, [k]);
  const en = uiLang() === 'en' ? 1 : 0;
  const s = slides[k];
  const lastLine = ln >= s.lines.length - 1;
  const isLast = k === slides.length - 1 && lastLine;
  const to = from + 1;

  const next = () => {
    if (!lastLine) { setLn(ln + 1); setSeq((n) => n + 1); return; }
    if (k === slides.length - 1) return onDone();
    setK(k + 1); setLn(0); setSeq((n) => n + 1);
  };
  const back = () => {
    if (ln > 0) { setLn(ln - 1); setSeq((n) => n + 1); return; }
    if (k === 0) return;
    setK(k - 1); setLn(slides[k - 1].lines.length - 1); setSeq((n) => n + 1);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') back();
      if (e.key === 'Escape') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const since = () => (reduced() ? 1e9 : performance.now() - t0.current);
  // «лад відновлено» і «новий світ»: сцена світу; у новому Микита перефарбовується з кольору попереднього
  const drawArt = (ctx: CanvasRenderingContext2D, f: number) => {
    const p = Math.min(1, Math.max(0, (since() - 500) / 1200));
    if (k === 0) { if (!paintWorldNew(ctx, from, null, 1)) paintWorldArt(ctx, from, f, null, 1); }
    else if (!paintWorldNew(ctx, to, ALL_WORLDS[from].fox, p)) paintWorldArt(ctx, to, f, foxFor(ALL_WORLDS[from]), p);
  };
  // «у дорогу»: кораблик пливе від світу до світу
  const drawMap = (ctx: CanvasRenderingContext2D, f: number) => {
    const p = ease(Math.min(1, since() / 3200));
    paintJourney(ctx, f, { active: p < 1 ? from : to, reached: to, ship: routePoint(from, to, p), state: (i: number) => (i < to ? 'done' : i === to ? 'open' : 'locked') });
  };

  const line = s.lines[ln];
  const [speaker, uk, enName] = line ? VOICE[line[0]] : ['enei' as Speaker, '', ''];
  const prev = ln > 0 ? VOICE[s.lines[ln - 1][0]][0] : null;
  // у dev можна глянути дорогу й до ще не реалізованого світу — тоді колір з мапи
  const fox = (k === 2 ? worlds[to] ?? ALL_WORLDS[to] : worlds[from]).fox;

  return (
    <div className="onboarding voyage">
      <div className="ob-stage" onClick={next}>
        {k === 1
          ? <PixelCanvas key="map" width={MW * MS} height={MH * MS} draw={drawMap} interval={300} smooth className="ob-canvas" label={`${s.title[en]}. ${s.narr[en]}`} />
          : <PixelCanvas key={`art${k}`} width={SW * 2} height={SH_ * 2} draw={drawArt} interval={170} smooth className="ob-canvas" label={`${s.title[en]}. ${s.narr[en]}`} />}
      </div>
      <div className="ob-text">
        <div className="eyebrow">{L('Сцена', 'Scene')} {k + 1} {L('з', 'of')} 3 · {L('дорога між світами', 'between worlds')}</div>
        <h2 key={`t${k}`} className="ob-title">{s.title[en]}</h2>
        <p key={`n${k}`} className="narr">{s.narr[en]}</p>
        {line && <Speech who={speaker} name={en ? enName : uk} text={line[1 + en]} tone="say" fox={fox} seq={seq} enter={prev === speaker ? 'nod' : 'in'} />}
        {s.lines.length > 1 && <div className="ob-lines">{s.lines.map((_, n) => <i key={n} className={n === ln ? 'on' : n < ln ? 'done' : ''} />)}</div>}
        <div className="ob-dots" role="tablist" aria-label={L('Сцени', 'Scenes')}>
          {slides.map((sl, n) => <button key={n} className={n === k ? 'on' : ''} role="tab" aria-selected={n === k} aria-label={sl.title[en]} onClick={() => { setK(n); setLn(0); setSeq((x) => x + 1); }} />)}
        </div>
        <div className="ob-actions">
          <button className="btn" onClick={onDone}>{L('Пропустити', 'Skip')}</button>
          <span className="grow" />
          {(k > 0 || ln > 0) && <button className="btn" onClick={back}>{L('← Назад', '← Back')}</button>}
          <button className="btn run" onClick={next}>{isLast ? `${L('До світу', 'To world')} ${to} ▸` : L('Далі →', 'Next →')}</button>
        </div>
      </div>
    </div>
  );
}
