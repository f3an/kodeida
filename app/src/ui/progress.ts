/* Прогрес гравця: зірки, підказки, онбординг. Зберігається локально (storage.ts). */
import { useCallback, useEffect, useState } from 'react';
import type { Level, World } from '../engine/level.ts';
import type { Lang } from '../engine/types.ts';
import { worlds } from '../levels/index.ts';
import { load, save } from './storage.ts';
import { detectLang, type UiLang } from '../i18n.ts';

export interface LevelProgress { stars: number; hintsUsed: number }
export interface Progress {
  levels: Record<string, LevelProgress>;
  onboarded: boolean;
  /** Сивілла вже показала інтерфейс (сцена 11). */
  toured?: boolean;
  /** Заставку «Відплиття» вже показано (сцена 13). */
  departed?: boolean;
  last?: string;
}
export interface Settings { lang: Lang; speed: number; /** Мова інтерфейсу. */ ui: UiLang }

const EMPTY: Progress = { levels: {}, onboarded: false };

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => load('progress', EMPTY));
  useEffect(() => save('progress', progress), [progress]);
  const patchLevel = useCallback((id: string, p: Partial<LevelProgress>) => {
    setProgress((s) => {
      const cur = s.levels[id] ?? { stars: 0, hintsUsed: 0 };
      const next = { stars: Math.max(cur.stars, p.stars ?? 0), hintsUsed: Math.max(cur.hintsUsed, p.hintsUsed ?? 0) };
      return { ...s, levels: { ...s.levels, [id]: next } };
    });
  }, []);
  return { progress, setProgress, patchLevel, reset: () => setProgress(EMPTY) };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => ({ lang: 'ts', speed: 1, ui: detectLang(), ...load<Partial<Settings>>('settings', {}) }));
  useEffect(() => save('settings', settings), [settings]);
  return [settings, setSettings] as const;
}

export const starsOf = (p: Progress, l: Level) => p.levels[l.id]?.stars ?? 0;
export const solved = (p: Progress, l: Level) => starsOf(p, l) >= 1;

/** Світ відкрито, якщо розв'язано фінальну задачу попереднього. */
export function worldOpen(p: Progress, w: World): boolean {
  if (w.n === 0) return true;
  const prev = worlds[w.n - 1];
  return !!prev && solved(p, prev.levels[prev.levels.length - 1]);
}

/** Вправу відкрито, якщо відкрито світ і розв'язано попередню вправу. */
export function levelOpen(p: Progress, l: Level): boolean {
  const w = worlds[l.world];
  if (!worldOpen(p, w)) return false;
  const i = w.levels.indexOf(l);
  return i === 0 || solved(p, w.levels[i - 1]);
}

/** Уламок (візерунок і запис у Книзі) — за лисяче рішення фінальної задачі світу. */
export const shardOf = (p: Progress, w: World) => !!w.motif && starsOf(p, w.levels[w.levels.length - 1]) >= 2;

/** Куди вести гравця: остання відкрита, але не розв'язана вправа. */
export function nextLevel(p: Progress): Level {
  for (const w of worlds) for (const l of w.levels) if (levelOpen(p, l) && !solved(p, l)) return l;
  return worlds[worlds.length - 1].levels[worlds[worlds.length - 1].levels.length - 1];
}

/** Збори ватаги (сцена 12): за кожну розв'язану вправу світу 0 після першого кроку до Енея стає троянець. */
export const CREW_MAX = 4;
export function crewOf(p: Progress): number {
  return Math.min(CREW_MAX, worlds[0].levels.slice(1, 1 + CREW_MAX).filter((l) => solved(p, l)).length);
}
export const TROJAN_NAMES = ['воїн зі списом', 'моряк', 'старий Анхіз', 'жінка з клунком'];
