/* Прогрес гравця: зірки, підказки, онбординг. Зберігається локально (storage.ts). */
import { useCallback, useEffect, useState } from 'react';
import type { Level, World } from '../engine/level.ts';
import type { Lang } from '../engine/types.ts';
import { worlds, tracks, worldOf } from '../levels/index.ts';
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
  /** Заставки переходу між світами, які вже бачили (номер завершеного світу). */
  voyages?: number[];
  /** «Знаю основи JS»: усі вправи світу 0 відкриті одразу. */
  skipBasics?: boolean;
  /** Шлях, обраний на старті: з нуля (Абетка), трохи вмію (світ 0) чи одразу задачі (світ 1). */
  path?: Path;
  /** «З нуля»: пролог «Ніч перед бурею» вже бачили. */
  prologue?: boolean;
}
export type Path = 'abc' | 'basics' | 'algo';
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

/** Dev-режим: «відкрити все» — будь-який світ і вправа доступні без проходження (лише `vite dev`). */
let unlockAll = import.meta.env.DEV && load('dev.unlock', true);
export const devUnlocked = () => unlockAll;
export function setDevUnlock(on: boolean) { unlockAll = import.meta.env.DEV && on; save('dev.unlock', on); }

/** Світ відкрито, якщо розв'язано фінальну задачу попереднього. */
export function worldOpen(p: Progress, w: World): boolean {
  if (w.n === 0 || unlockAll) return true;
  // «Так, хочу задач»: світ 1 відкрито одразу, світ 0 лишається для повторення
  if (w.n === 1 && !w.track && p.path === 'algo') return true;
  const prev = (w.track ? tracks[w.track] : worlds)[w.n - 1];
  return !!prev && solved(p, prev.levels[prev.levels.length - 1]);
}

/** Вправу відкрито, якщо відкрито світ і розв'язано попередню вправу. */
export function levelOpen(p: Progress, l: Level): boolean {
  const w = worldOf(l);
  if (!worldOpen(p, w)) return false;
  if (unlockAll || (w.n === 0 && !w.track && p.skipBasics)) return true;
  const i = w.levels.indexOf(l);
  // пройдене лишається відкритим, навіть якщо перед ним з'явилася нова вправа
  return i === 0 || solved(p, l) || solved(p, w.levels[i - 1]);
}

/** Уламок (візерунок і запис у Книзі) — за лисяче рішення фінальної задачі світу. */
export const shardOf = (p: Progress, w: World) => !!w.motif && starsOf(p, w.levels[w.levels.length - 1]) >= 2;

/** Куди вести гравця: остання відкрита, але не розв'язана вправа. */
export function nextLevel(p: Progress): Level {
  for (const w of worlds) {
    if (w.n === 0 && p.path === 'algo') continue;
    for (const l of w.levels) if (levelOpen(p, l) && !solved(p, l)) return l;
  }
  return worlds[worlds.length - 1].levels[worlds[worlds.length - 1].levels.length - 1];
}

/** Збори ватаги (сцена 12): за кожну розв'язану вправу світу 0 після першого кроку до Енея стає троянець. */
export const CREW_MAX = 4;
export function crewOf(p: Progress): number {
  return Math.min(CREW_MAX, worlds[0].levels.slice(1, 1 + CREW_MAX).filter((l) => solved(p, l)).length);
}
export const TROJAN_NAMES = ['воїн зі списом', 'моряк', 'старий Анхіз', 'жінка з клунком'];
