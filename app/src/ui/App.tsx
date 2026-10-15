import { useEffect, useState } from 'react';
import { LevelScreen } from './LevelScreen.tsx';
import { MapScreen } from './MapScreen.tsx';
import { Menu, Onboarding, BookScreen, ShirtScreen, SettingsScreen, updateText, INTRO_SCENES, DEPARTURE_SCENES } from './screens.tsx';
import { levelById, worlds } from '../levels/index.ts';
import { useProgress, useSettings } from './progress.ts';
import { bridge, useUpdates } from './bridge.ts';
import { load, save } from './storage.ts';
import { setUiLang, L } from '../i18n.ts';
import { wt } from '../levels/text.ts';

export type Screen =
  | { name: 'menu' } | { name: 'onboarding' } | { name: 'departure' } | { name: 'map' } | { name: 'level'; id: string }
  | { name: 'book' } | { name: 'shirt' } | { name: 'settings' };

export function App() {
  const { progress, setProgress, patchLevel, reset } = useProgress();
  const [settings, setSettings] = useSettings();
  const updates = useUpdates();
  setUiLang(settings.ui);
  const [screen, setScreen] = useState<Screen>(() => load<Screen>('screen', { name: 'menu' }));
  useEffect(() => save('screen', screen), [screen]);
  // меню застосунку й діалоги оновлень говорять мовою гри
  useEffect(() => { bridge?.setLang?.(settings.ui); }, [settings.ui]);
  const go = (s: Screen) => setScreen(s);

  const level = screen.name === 'level' ? levelById(screen.id) : undefined;
  if (screen.name === 'level' && !level) setScreen({ name: 'map' });

  if (screen.name === 'menu') return <Menu progress={progress} go={go} updates={updates} ui={settings.ui} setUi={(ui) => setSettings((s) => ({ ...s, ui }))} />;
  if (screen.name === 'onboarding') {
    const finish = () => { setProgress((p) => ({ ...p, onboarded: true })); go({ name: 'level', id: worlds[0].levels[0].id }); };
    return <Onboarding scenes={INTRO_SCENES} finishLabel={L('Перший крок ▸', 'First step ▸')} onDone={finish} onSkip={finish} />;
  }
  if (screen.name === 'departure') {
    const sail = () => { setProgress((p) => ({ ...p, departed: true })); go({ name: 'map' }); };
    return <Onboarding scenes={DEPARTURE_SCENES} finishLabel={L('До мапи світів ▸', 'To the world map ▸')} onDone={sail} />;
  }

  const nav: [Screen['name'], string, string][] = [['level', '☰', L('Вправи', 'Exercises')], ['map', '◈', L('Мапа світів', 'World map')], ['book', '✦', L('Книга хитрощів', 'Book of Tricks')], ['shirt', '✚', L('Вишиванка', 'Embroidered shirt')], ['settings', '⚙', L('Налаштування', 'Settings')]];
  const lastLevel = level?.id ?? progress.last ?? worlds[0].levels[0].id;
  const showUpdate = updates && (updates.stage === 'available' || updates.stage === 'downloading' || updates.stage === 'downloaded');

  return (
    <div className="app">
      <header className="titlebar">
        <button className="logo" onClick={() => go({ name: 'menu' })}><b>{'{'}</b> {L('Кодеїда', 'Kodeida')}</button>
        <span className="crumbs">{level ? `${wt(worlds[level.world]).song} · ${L('Світ', 'World')} ${level.world} · ${wt(worlds[level.world]).name}` : ''}</span>
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
        {screen.name === 'map' && <MapScreen progress={progress} go={go} />}
        {screen.name === 'book' && <BookScreen progress={progress} />}
        {screen.name === 'shirt' && <ShirtScreen progress={progress} />}
        {screen.name === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} updates={updates} onReset={reset} go={go} />}
      </div>
    </div>
  );
}
