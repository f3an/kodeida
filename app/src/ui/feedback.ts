/* Відгук після гри: форма issue «Playtest feedback» на GitHub з уже заповненими версією, системою й прогресом. */
import { worlds } from '../levels/index.ts';
import { wt } from '../levels/text.ts';
import { uiLang } from '../i18n.ts';
import { solved, type Progress } from './progress.ts';
import { bridge, APP_VERSION } from './bridge.ts';

const OS: Record<string, string> = { darwin: 'macOS', win32: 'Windows', linux: 'Linux' };

export function feedbackUrl(progress: Progress): string {
  const os = bridge ? OS[bridge.platform] ?? bridge.platform : 'browser';
  const done = worlds.map((w) => `${wt(w).name}: ${w.levels.filter((l) => solved(progress, l)).length}/${w.levels.length}`).join(' · ');
  const q = new URLSearchParams({
    template: 'playtest.yml',
    title: 'Playtest: ',
    version: `Kodeida ${APP_VERSION} · ${os} · ${uiLang() === 'en' ? 'EN' : 'UA'}`,
    progress: done,
  });
  return `https://github.com/f3an/kodeida/issues/new?${q.toString()}`;
}
