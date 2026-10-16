/*
 * «Абетка» — необов'язковий блок для тих, хто вчить мову програмування з нуля.
 * Обираєш мову — і проходиш розділи-казки; кожна вправа написана саме для цієї мови.
 */
import type { Lang } from '../engine/types.ts';
import { tracks } from '../levels/index.ts';
import { PLANNED } from '../levels/abetka.ts';
import { levelOpen, solved, starsOf, worldOpen, type Progress } from './progress.ts';
import type { Screen } from './App.tsx';
import { L, uiLang } from '../i18n.ts';
import { lt, wt } from '../levels/text.ts';

const LANGS: { id: Lang; name: string; about: [string, string] }[] = [
  { id: 'py', name: 'Python', about: ['Найпростіший старт: мало дужок, читається майже як англійська.', 'The easiest start: few brackets, reads almost like English.'] },
  { id: 'js', name: 'JavaScript', about: ['Мова браузера: те, що оживляє сайти.', 'The language of the browser: what brings websites to life.'] },
  { id: 'ts', name: 'TypeScript', about: ['JavaScript із типами: редактор підказує й ловить помилки заздалегідь.', 'JavaScript with types: the editor suggests and catches mistakes early.'] },
];

export function AbetkaScreen({ lang, progress, go }: { lang: Lang; progress: Progress; go: (s: Screen) => void }) {
  const en = uiLang() === 'en' ? 1 : 0;
  const chapters = tracks[lang];
  const all = chapters.flatMap((w) => w.levels);
  const done = all.filter((l) => solved(progress, l)).length;
  const next = all.find((l) => levelOpen(progress, l) && !solved(progress, l)) ?? all[0];
  return (
    <main className="page abetka">
      <header className="page-h">
        <h1>{L('Абетка', 'The ABC')}</h1>
        <p className="muted">{L(
          'Ніч перед падінням Трої. Сивілла вчить Енея абетки слова ладу — на українських казках. Для тих, хто тільки починає: обери мову, і кожна вправа буде написана саме для неї.',
          'The night before Troy falls. The Sibyl teaches Aeneas the ABC of the word of order — on Ukrainian fairy tales. For those just starting out: pick a language, and every exercise is written for it.',
        )}</p>
      </header>
      <div className="abc-langs" role="tablist" aria-label={L('Мова програмування', 'Programming language')}>
        {LANGS.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === lang} className={x.id === lang ? 'on' : ''} onClick={() => go({ name: 'abetka', lang: x.id })}>
            <b>{x.name}</b>
            <small>{x.about[en]}</small>
          </button>
        ))}
      </div>
      <div className="abc-go">
        <button className="btn big run" onClick={() => go({ name: 'level', id: next.id })}>
          {done ? L('Продовжити', 'Continue') : L('Почати', 'Start')}: {lt(next).title} ▸
        </button>
        <span className="muted">{L(`Пройдено ${done} з ${all.length}`, `${done} of ${all.length} done`)}</span>
      </div>
      {!progress.onboarded && (
        <div className={`abc-troy${all.every((l) => solved(progress, l)) ? ' ready' : ''}`}>
          <div>
            <div className="eyebrow">{L('Далі за сюжетом', 'Next in the story')}</div>
            <b>{L('Світанок над Троєю', 'Dawn over Troy')}</b>
            <p className="muted">{all.every((l) => solved(progress, l))
              ? L('Абетку вивчено. Над Троєю здіймається заграва — час братися до справи.', 'The ABC is learned. A glow rises over Troy — time to get to work.')
              : L('Коли пройдеш абетку, почнеться мандрівка. Можна й раніше — абетка нікуди не дінеться.', 'Once you finish the ABC, the journey begins. You can go earlier too — the ABC will wait.')}</p>
          </div>
          <button className={`btn${all.every((l) => solved(progress, l)) ? ' run' : ''}`} onClick={() => go({ name: 'onboarding', story: 'troy' })}>{L('До Трої', 'To Troy')} ▸</button>
        </div>
      )}
      <div className="abc-chapters">
        {chapters.map((w) => {
          const open = worldOpen(progress, w), W = wt(w);
          return (
            <article key={w.n} className={`abc-ch${open ? '' : ' locked'}`} style={{ ['--fox' as string]: w.fox }}>
              <div className="eyebrow">{L('Розділ', 'Chapter')} {w.n + 1}</div>
              <h2>{W.name}</h2>
              <p className="muted">{W.topic}</p>
              <ol>
                {w.levels.map((l) => {
                  const ok = levelOpen(progress, l), s = starsOf(progress, l);
                  return (
                    <li key={l.id}>
                      <button className={`it${s ? ' done' : ''}`} disabled={!ok} onClick={() => go({ name: 'level', id: l.id })}
                        title={ok ? lt(l).topic : L('Спершу розв\'яжи попередню вправу', 'Solve the previous exercise first')}>
                        <span>{s ? '✓' : ok ? '○' : '🔒'} {lt(l).title}</span>
                        <small>{s ? '★'.repeat(s) + '☆'.repeat(3 - s) : lt(l).topic}</small>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
        {PLANNED.map((p, i) => (
          <article key={i} className="abc-ch soon">
            <div className="eyebrow">{L('Розділ', 'Chapter')} {chapters.length + i + 1} · {L('скоро', 'soon')}</div>
            <h2>{p.name[en]}</h2>
            <p className="muted">{p.topic[en]}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
