/*
 * Dev-панель (лише `vite dev`): будь-яка вправа, заставка чи дорога між світами без проходження,
 * і перегляд усіх 16 світів — навіть тих, де вправ ще немає (сцена світу новим артом і стара для порівняння).
 */
import { useState } from 'react';
import type { Lang } from '../engine/types.ts';
import { PixelCanvas } from './PixelCanvas.tsx';
import { sceneAt, INTRO_SCENES, DEPARTURE_SCENES } from './screens.tsx';
import { ABC_INTRO, ABC_TO_TROY, ALGO_INTRO } from './story.ts';
import { devUnlocked, setDevUnlock } from './progress.ts';
import type { Screen } from './App.tsx';
import { worlds, tracks } from '../levels/index.ts';
import { VOYAGES } from '../levels/voyages.ts';
import { lt, wt } from '../levels/text.ts';
import { ALL_WORLDS, SW, SH_, paintWorldArt } from '../world/sprites.js';
import { paintWorldNew, paintArtBg } from '../world/cutscenes.ts';
import { BG_FX_KEYS, drawBgFx } from '../world/bgfx.ts';
import { artImage } from '../world/art.ts';

const STORIES: [string, number[]][] = [
  ['Вступ (трохи вмію)', INTRO_SCENES], ['Пролог «Абетки»', ABC_INTRO], ['Абетка → Троя', ABC_TO_TROY],
  ['Одразу задачі', ALGO_INTRO], ['Відплиття', DEPARTURE_SCENES],
];
const SCENES = [...new Set([...ALGO_INTRO, ...ABC_INTRO, ...ABC_TO_TROY])].sort((a, b) => a - b);
const ALL = ALL_WORLDS as { n: number; name: string; fox: string }[];

export function DevScreen({ go }: { go: (s: Screen) => void }) {
  const [unlock, setUnlock] = useState(devUnlocked());
  const [abc, setAbc] = useState<Lang>('py');
  const level = (id: string) => go({ name: 'level', id });
  return (
    <main className="page dev">
      <header className="page-h">
        <h1>Dev</h1>
        <p className="muted">Лише в dev-режимі. Відкриває будь-яку вправу, заставку чи дорогу між світами — прогрес від цього не змінюється.</p>
        <label className="dev-toggle">
          <input type="checkbox" checked={unlock} onChange={(e) => { setDevUnlock(e.target.checked); setUnlock(e.target.checked); }} />
          {' '}Відкрити всі світи й вправи (мапа, Абетка, список вправ)
        </label>
      </header>

      <h2>Заставки</h2>
      <div className="dev-row">
        {STORIES.map(([title, scenes]) => <button key={title} className="btn" onClick={() => go({ name: 'cutscene', scenes })}>{title} · {scenes.length}</button>)}
      </div>
      <div className="dev-row">
        {SCENES.map((i) => <button key={i} className="btn" onClick={() => go({ name: 'cutscene', scenes: [i] })}>{i}. {sceneAt(i).title}</button>)}
      </div>

      <h2>Дороги між світами</h2>
      <div className="dev-row">
        {Object.keys(VOYAGES).map(Number).map((from) => (
          <button key={from} className="btn" onClick={() => go({ name: 'voyage', from, dev: true })}>{from} → {from + 1}: {ALL[from + 1]?.name ?? '?'}</button>
        ))}
      </div>

      <h2>Вправи</h2>
      {worlds.map((w) => (
        <section key={w.n} className="dev-world">
          <div className="eyebrow">Світ {w.n} · {wt(w).name}</div>
          <div className="dev-row">{w.levels.map((l, i) => <button key={l.id} className="btn" onClick={() => level(l.id)}>{i + 1}. {lt(l).title}</button>)}</div>
        </section>
      ))}
      <section className="dev-world">
        <div className="eyebrow">Абетка · {' '}
          {(['py', 'js', 'ts'] as Lang[]).map((g) => <button key={g} className={`btn${g === abc ? ' run' : ''}`} onClick={() => setAbc(g)}>{g}</button>)}
        </div>
        {tracks[abc].map((ch) => (
          <div key={ch.n} className="dev-row">
            <b>{ch.n + 1}. {wt(ch).name}</b>
            {ch.levels.map((l, i) => <button key={l.id} className="btn" onClick={() => level(l.id)}>{i + 1}. {lt(l).title}</button>)}
          </div>
        ))}
      </section>

      <h2>Живі фони</h2>
      <p className="muted">Кожен новий фон з його анімацією: сяйво, вода, дим, зорі, сніг. Без героїв, щоб було видно сам фон.</p>
      <div className="dev-worlds">
        {BG_FX_KEYS.map((key) => (
          <figure key={key}>
            <figcaption><b>{key}</b></figcaption>
            <PixelCanvas width={SW * 2} height={SH_ * 2} interval={40} smooth label={`Живий фон ${key}`} draw={(ctx) => {
              const img = artImage(`bg/${key}`);
              if (!img) return;
              paintArtBg(ctx, img);
              const t = performance.now() / 1000;
              drawBgFx(ctx, key, t, 'back'); drawBgFx(ctx, key, t, 'front');
            }} />
          </figure>
        ))}
      </div>

      <h2>Усі світи (і ще не реалізовані)</h2>
      <div className="dev-worlds">
        {ALL.map((w) => (
          <figure key={w.n}>
            <figcaption>
              <b>{w.n}. {w.name}</b> · {worlds[w.n] ? `${worlds[w.n].levels.length} вправ` : 'ще не реалізовано'}
              {worlds[w.n] && <button className="btn" onClick={() => level(worlds[w.n].levels[0].id)}>Грати ▸</button>}
            </figcaption>
            <PixelCanvas width={SW * 2} height={SH_ * 2} interval={170} draw={(ctx) => { paintWorldNew(ctx, w.n, null, 1); }} label={`Сцена світу ${w.n}: новий арт`} />
            <PixelCanvas width={SW * 2} height={SH_ * 2} interval={170} draw={(ctx, f) => paintWorldArt(ctx, w.n, f, null, 1)} label={`Сцена світу ${w.n}: стара, для порівняння`} />
          </figure>
        ))}
      </div>
    </main>
  );
}
