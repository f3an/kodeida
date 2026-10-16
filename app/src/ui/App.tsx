import { useEffect, useState } from 'react';
import { LevelScreen } from './LevelScreen.tsx';
import { MapScreen } from './MapScreen.tsx';
import { VoyageScreen } from './Voyage.tsx';
import { AbetkaScreen } from './Abetka.tsx';
import { ABC_INTRO, ABC_TO_TROY, ALGO_INTRO } from './story.ts';
import type { Lang } from '../engine/types.ts';
import { Menu, StartScreen, Onboarding, BookScreen, ShirtScreen, SettingsScreen, updateText, INTRO_SCENES, DEPARTURE_SCENES } from './screens.tsx';
import { levelById, worlds, worldOf } from '../levels/index.ts';
import { useProgress, useSettings, levelOpen, solved, type Path, type Progress } from './progress.ts';
import { bridge, useUpdates } from './bridge.ts';
import { load, save } from './storage.ts';
import { setUiLang, L } from '../i18n.ts';
import { wt } from '../levels/text.ts';

export type Screen =
  | { name: 'menu' } | { name: 'onboarding'; story?: Story } | { name: 'departure' } | { name: 'voyage'; from: number } | { name: 'map' } | { name: 'level'; id: string }
  | { name: 'book' } | { name: 'shirt' } | { name: 'settings' } | { name: 'abetka'; lang?: Lang } | { name: 'start' };

/** Смуга, за яку тягнуть вікно на екранах без панелі заголовка (меню, заставки). */
/** Вступи для різних шляхів. */
type Story = 'intro' | 'abc' | 'troy' | 'algo';
const STORY_SCENES: Record<Story, number[]> = { intro: INTRO_SCENES, abc: ABC_INTRO, troy: ABC_TO_TROY, algo: ALGO_INTRO };

const DragStrip = () => (bridge ? <div className="drag-strip" aria-hidden="true" /> : null);

export function App() {
  const { progress, setProgress, patchLevel, reset } = useProgress();
  const [settings, setSettings] = useSettings();
  const updates = useUpdates();
  setUiLang(settings.ui);
  const [screen, setScreen] = useState<Screen>(() => load<Screen>('screen', { name: 'menu' }));
  useEffect(() => save('screen', screen), [screen]);
  // меню застосунку й діалоги оновлень говорять мовою гри
  useEffect(() => { bridge?.setLang?.(settings.ui); }, [settings.ui]);
  // платформа для стилів вікна: місце під «світлофор» macOS і кнопки Windows
  useEffect(() => { document.body.dataset.platform = bridge?.platform ?? 'web'; }, []);
  const go = (s: Screen) => setScreen(s);
  // «Абетка» пам'ятає обрану мову
  const [abcLang, setAbcLang] = useState<Lang>(() => load<Lang>('abetka.lang', 'py'));
  useEffect(() => save('abetka.lang', abcLang), [abcLang]);
  useEffect(() => {
    if (screen.name === 'abetka' && screen.lang) setAbcLang(screen.lang);
    // відкрив вправу «Абетки» — повернешся до її мови
    const l = screen.name === 'level' ? levelById(screen.id) : undefined;
    if (l?.track) setAbcLang(l.track);
  }, [screen]);

  const level = screen.name === 'level' ? levelById(screen.id) : undefined;
  if (screen.name === 'level' && !level) setScreen({ name: 'map' });

  // вибір рівня: з нуля → Абетка; трохи → світ 0; задачі → світ 1 (світ 0 відкритий для повторення)
  const choose = (path: Path) => {
    const next: Progress = { ...progress, path, ...(path === 'algo' ? { skipBasics: true } : {}) };
    setProgress(() => next);
    if (path === 'abc') return go(progress.prologue || progress.onboarded ? { name: 'abetka' } : { name: 'onboarding', story: 'abc' });
    if (!progress.onboarded) return go({ name: 'onboarding', story: path === 'algo' ? 'algo' : 'intro' });
    // вступ уже бачили — одразу до першої нерозв'язаної вправи свого світу
    const w = worlds[path === 'algo' ? 1 : 0];
    go({ name: 'level', id: (w.levels.find((l) => levelOpen(next, l) && !solved(next, l)) ?? w.levels[0]).id });
  };
  if (screen.name === 'menu') return <><DragStrip /><Menu progress={progress} go={go} choose={choose} updates={updates} ui={settings.ui} setUi={(ui) => setSettings((s) => ({ ...s, ui }))} /></>;
  if (screen.name === 'start') return <><DragStrip /><StartScreen go={go} choose={choose} /></>;
  if (screen.name === 'onboarding') {
    // який вступ: «з нуля» до Трої ще не дійшов — його пролог веде в Абетку
    const story: Story = screen.story ?? (progress.path === 'abc' && !progress.onboarded ? 'abc' : 'intro');
    const finish = () => {
      if (story === 'abc') { setProgress((p) => ({ ...p, prologue: true })); return go({ name: 'abetka' }); }
      setProgress((p) => ({ ...p, onboarded: true, ...(story === 'algo' ? { departed: true } : {}) }));
      go({ name: 'level', id: (story === 'algo' ? worlds[1] : worlds[0]).levels[0].id });
    };
    const label = { abc: L('До Абетки ▸', 'To the ABC ▸'), algo: L('До моря Еола ▸', 'To the sea of Aeolus ▸'), intro: L('Перший крок ▸', 'First step ▸'), troy: L('Перший крок ▸', 'First step ▸') }[story];
    return <><DragStrip /><Onboarding key={story} scenes={STORY_SCENES[story]} finishLabel={label} onDone={finish} onSkip={finish} /></>;
  }
  if (screen.name === 'departure') {
    const sail = () => { setProgress((p) => ({ ...p, departed: true })); go({ name: 'map' }); };
    return <><DragStrip /><Onboarding scenes={DEPARTURE_SCENES} finishLabel={L('До мапи світів ▸', 'To the world map ▸')} onDone={sail} /></>;
  }

  if (screen.name === 'voyage') {
    // після заставки — перша вправа нового світу; позначаємо, що дорогу вже бачили
    const arrive = () => { setProgress((p) => ({ ...p, voyages: [...new Set([...(p.voyages ?? []), screen.from])] })); go({ name: 'level', id: worlds[screen.from + 1].levels[0].id }); };
    return <><DragStrip /><VoyageScreen from={screen.from} onDone={arrive} /></>;
  }

  const nav: [Screen['name'], string, string][] = [['level', '☰', L('Вправи', 'Exercises')], ['map', '◈', L('Мапа світів', 'World map')], ['abetka', L('А', 'A'), L('Абетка: мова з нуля', 'The ABC: a language from scratch')], ['book', '✦', L('Книга хитрощів', 'Book of Tricks')], ['shirt', '✚', L('Вишиванка', 'Embroidered shirt')], ['settings', '⚙', L('Налаштування', 'Settings')]];
  const lastLevel = level?.id ?? progress.last ?? worlds[0].levels[0].id;
  const showUpdate = updates && (updates.stage === 'available' || updates.stage === 'downloading' || updates.stage === 'downloaded');

  return (
    <div className="app">
      <header className="titlebar">
        <button className="logo" onClick={() => go({ name: 'menu' })}><b>{'{'}</b> {L('Кодеїда', 'Kodeida')}</button>
        <span className="crumbs">{level ? (level.track ? `${wt(worldOf(level)).song} · ${L('Розділ', 'Chapter')} ${level.world + 1} · ${wt(worldOf(level)).name}` : `${wt(worlds[level.world]).song} · ${L('Світ', 'World')} ${level.world} · ${wt(worlds[level.world]).name}`) : ''}</span>
        {showUpdate && (
          <span className="update-pill">
            {updateText(updates!)}
            {updates!.stage === 'available' && <button onClick={() => bridge?.updates.download()}>{L('Завантажити', 'Download')}</button>}
            {updates!.stage === 'downloaded' && <button onClick={() => bridge?.updates.install()}>{L('Перезапустити', 'Restart')}</button>}
          </span>
        )}
      </header>
      <div className={`body${level ? '' : ' page-body'}`}>
        <nav className="act" aria-label={L('Розділи', 'Sections')}>
          {nav.map(([name, icon, title]) => (
            <button key={name} title={title} aria-label={title} className={screen.name === name ? 'on' : ''} aria-current={screen.name === name ? 'page' : undefined}
              onClick={() => go(name === 'level' ? { name: 'level', id: lastLevel } : ({ name } as Screen))}>{icon}</button>
          ))}
        </nav>
        {level && (
          <LevelScreen key={level.id} level={level} progress={progress} setProgress={setProgress} patchLevel={patchLevel} settings={settings} setSettings={setSettings}
            go={(s) => { if (s.name === 'level') setProgress((p) => ({ ...p, last: s.id })); go(s); }} />
        )}
        {screen.name === 'abetka' && <AbetkaScreen lang={screen.lang ?? abcLang} progress={progress} go={go} />}
        {screen.name === 'map' && <MapScreen progress={progress} go={go} />}
        {screen.name === 'book' && <BookScreen progress={progress} />}
        {screen.name === 'shirt' && <ShirtScreen progress={progress} />}
        {screen.name === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} updates={updates} onReset={reset} go={go} progress={progress} />}
      </div>
    </div>
  );
}
