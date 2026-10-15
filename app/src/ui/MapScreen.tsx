/*
 * Мапа світів як на сайті: острови-пісні, маршрут, мітки світів і кораблик, а праворуч картка світу
 * з живою сценою. Ігрове: закриті світи сірі із замком, пройдені — у золотій рамці, кнопка «Грати».
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PixelCanvas } from './PixelCanvas.tsx';
import { worlds } from '../levels/index.ts';
import { lt } from '../levels/text.ts';
import { L, siteT } from '../i18n.ts';
import { levelOpen, shardOf, solved, worldOpen, type Progress } from './progress.ts';
import type { Screen } from './App.tsx';
import {
  NODES, ISLES, MW, MH, MS, SW, SH_, SONGS, ALL_WORLDS, WORLD_SCENES, WORLD_INFO,
  paintJourney, paintWorldArt, routePoint, worldCol, foxFor,
} from '../world/sprites.js';

interface SongW { n: number; name: string; topic: string; task: string; fox: string; foxName: string; mvp?: boolean }
interface Song { n: string; title: string; worlds: SongW[] }
const SONG_LIST = SONGS as Song[];
const ALL = ALL_WORLDS as SongW[];
const SCENES = WORLD_SCENES as Record<number, { npc?: string; quote?: string }>;
const INFO = WORLD_INFO as Record<number, { npc?: string; does?: string }>;
type State = 'locked' | 'open' | 'done';

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MapScreen({ progress, go }: { progress: Progress; go: (s: Screen) => void }) {
  const stateOf = (n: number): State => {
    const w = worlds[n];
    if (!w || !worldOpen(progress, w)) return 'locked';
    return w.levels.every((l) => solved(progress, l)) ? 'done' : 'open';
  };
  // найдальший відкритий світ — там зараз Еней
  const here = Math.max(0, ...worlds.filter((w) => worldOpen(progress, w)).map((w) => w.n));
  const [sel, setSel] = useState(here);
  const ship = useRef({ from: here, at: 0 });
  const [pop, setPop] = useState(0);
  const foxFrom = useRef<unknown>(null);
  const artAt = useRef(0);

  const choose = (n: number) => {
    const to = ((n % 16) + 16) % 16;
    if (to === sel) return;
    ship.current = { from: sel, at: performance.now() };
    foxFrom.current = foxFor(ALL[sel]);
    artAt.current = performance.now();
    setSel(to);
    setPop((p) => p + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); choose(sel + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); choose(sel - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const drawMap = (ctx: CanvasRenderingContext2D, f: number) => {
    const p = reducedMotion() ? 1 : ease(Math.min(1, (performance.now() - ship.current.at) / 900));
    paintJourney(ctx, f, { active: sel, reached: here, ship: routePoint(ship.current.from, sel, p), state: stateOf });
  };
  const drawArt = (ctx: CanvasRenderingContext2D, f: number) => {
    const p = reducedMotion() ? 1 : Math.min(1, (performance.now() - artAt.current) / 700);
    paintWorldArt(ctx, sel, Math.floor(f * 70 / 170), foxFrom.current, p);
  };

  // пунктир від мітки до картки
  const wrap = useRef<HTMLDivElement>(null);
  const mapBox = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const [conn, setConn] = useState<{ x1: number; y1: number; x2: number; y2: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const b = wrap.current?.getBoundingClientRect(), m = mapBox.current?.getBoundingClientRect(), c = card.current?.getBoundingClientRect();
      if (!b || !m || !c || c.left < m.right - 4) return setConn(null);
      const [nx, ny] = NODES[sel];
      setConn({ x1: m.left - b.left + (nx / MW) * m.width, y1: m.top - b.top + (ny / MH) * m.height, x2: c.left - b.left, y2: c.top - b.top + Math.min(c.height * 0.3, 140), w: b.width, h: b.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [sel]);

  const w = ALL[sel];
  const game = worlds[sel];
  const st = stateOf(sel);
  const song = SONG_LIST.find((s) => s.worlds.some((x) => x.n === sel))!;
  const col = worldCol(sel, 0) as string;
  const quote = SCENES[sel]?.quote;
  const locals = SCENES[sel]?.npc ?? INFO[sel]?.npc;
  const done = game ? game.levels.filter((l) => solved(progress, l)).length : 0;
  const nextIn = game?.levels.find((l) => levelOpen(progress, l) && !solved(progress, l)) ?? game?.levels[0];

  return (
    <main className="page map-page">
      <header className="page-h">
        <h1>{L('Мапа світів', 'World map')}</h1>
        <p className="muted">{L('Мандрівка світами української літератури: 16 світів, 6 пісень. У цій версії відкриті перші три.', 'A journey through Ukrainian literature: 16 worlds, 6 songs. This version opens the first three.')}</p>
      </header>

      <div className="journey" ref={wrap}>
        <div className="j-map">
          <div className="mapbox" ref={mapBox}>
            <PixelCanvas width={MW * MS} height={MH * MS} draw={drawMap} interval={300} label={L('Мапа мандрівки Енея: шість островів-пісень і шістнадцять світів, з\'єднаних маршрутом', 'Aeneas’s journey map: six song islands and sixteen worlds joined by a route')} />
            <div className="pins">
              {(NODES as [number, number][]).map(([x, y], i) => (
                <button key={i} className={`pin ${stateOf(i)}${i === sel ? ' on' : ''}`} style={{ left: `${(x / MW) * 100}%`, top: `${(y / MH) * 100}%` }}
                  aria-label={`${L('Світ', 'World')} ${i}: ${siteT(ALL[i].name)}${stateOf(i) === 'locked' ? ` (${L('закрито', 'locked')})` : ''}`}
                  aria-pressed={i === sel} onClick={() => choose(i)} onDoubleClick={() => worlds[i] && st !== 'locked' && nextIn && go({ name: 'level', id: nextIn.id })} />
              ))}
              {SONG_LIST.map((s, i) => (
                <span key={s.n} className="isle-label" style={{ left: `${(ISLES[i].c[0] / MW) * 100}%`, top: `${((ISLES[i].c[1] - ISLES[i].r[1] - 6) / MH) * 100}%` }}>
                  {s.n} · {siteT(s.title)}
                </span>
              ))}
            </div>
          </div>
          <div className="j-ctrl">
            <span className="mono">{String(sel).padStart(2, '0')} / 15</span>
            <div className="j-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(sel + 1) / 16})` }} /></div>
            <button className="btn" onClick={() => choose(sel - 1)} aria-label={L('Попередній світ', 'Previous world')}>←</button>
            <button className="btn" onClick={() => choose(sel + 1)} aria-label={L('Наступний світ', 'Next world')}>→</button>
          </div>
          <div className="j-legend">
            <span><i className="lg done" />{L('пройдено', 'completed')}</span>
            <span><i className="lg open" />{L('відкрито', 'open')}</span>
            <span><i className="lg locked" />{L('закрито', 'locked')}</span>
          </div>
        </div>

        {conn && (
          <svg className="j-conn" viewBox={`0 0 ${conn.w} ${conn.h}`} aria-hidden="true">
            <path d={`M${conn.x1},${conn.y1} C${(conn.x1 + conn.x2) / 2},${conn.y1} ${(conn.x1 + conn.x2) / 2},${conn.y2} ${conn.x2},${conn.y2}`} fill="none" stroke={col} strokeWidth="3" strokeDasharray="6 8" strokeLinecap="square" className="j-dash" />
            <rect x={conn.x1 - 9} y={conn.y1 - 9} width="18" height="18" fill="none" stroke={col} strokeWidth="3" />
            <rect x={conn.x2 - 6} y={conn.y2 - 6} width="12" height="12" fill={col} />
          </svg>
        )}

        <article key={pop} className={`j-card ${st}${pop ? ' pop' : ''}`} ref={card} style={{ ['--wc' as string]: col }} aria-live="polite">
          <PixelCanvas key={sel} width={SW * 2} height={SH_ * 2} draw={drawArt} interval={70} label={`${siteT(w.name)}: ${siteT(INFO[sel]?.does ?? '')}`} />
          <div className="j-body">
            <div className="eyebrow">{L('Світ', 'World')} {sel} · {L('Пісня', 'Song')} {song.n} · {siteT(song.title)}</div>
            <h3>{siteT(w.name)}</h3>
            <div className="meta"><span className="topic">{siteT(w.topic)}</span><span className="task">{w.task.split(' · ').map(siteT).join(' · ')}</span></div>
            {INFO[sel]?.does && <p>{siteT(INFO[sel].does!)}</p>}
            {quote && <q>{siteT(quote)}</q>}
            <div className="foot">
              <span className="chip"><i className="dot" style={{ background: col }} />{L('Микита', 'Mykyta')}: {siteT(w.foxName)}</span>
              {locals && <span>{L('Мешканці', 'Locals')}: {siteT(locals)}</span>}
            </div>
            <div className="j-status">
              {game ? (
                st === 'locked'
                  ? <span className="muted">🔒 {L('Спершу пройди фінальну задачу попереднього світу.', 'Finish the previous world’s final problem first.')}</span>
                  : <>
                      <span>{done} / {game.levels.length} {L('вправ', 'exercises')}{shardOf(progress, game) ? L(' · уламок ✦', ' · shard ✦') : ''}</span>
                      <button className="btn run" onClick={() => nextIn && go({ name: 'level', id: nextIn.id })}>
                        {st === 'done' ? L('Переграти', 'Replay') : done ? L('Продовжити', 'Continue') : L('Грати', 'Play')}{nextIn && st !== 'done' ? `: ${lt(nextIn).title}` : ''} ▸
                      </button>
                    </>
              ) : <span className="muted">{L('Цей світ з\'явиться в наступних версіях.', 'This world comes in a future version.')}</span>}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
