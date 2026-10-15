import type { TestCase } from './types.ts';

export interface Level {
  id: string;
  world: number;
  worldName: string;
  song: string;
  title: string;
  /** Номер і назва задачі на LeetCode, на яку переноситься навичка. */
  leetcode?: { n: number; title: string; slug: string };
  /** Короткий опис над редактором (дозволено <b> і <code>). */
  brief: string;
  /** Умова: абзаци, дозволено <b> і <code>. */
  statement: string[];
  entry: string;
  /** Назви масивів-аргументів, за якими стежить світ (null — не стежити). */
  observe: (string | null)[];
  starter: { ts: string; js: string };
  examples: TestCase[];
  hidden: TestCase[];
  big?: { n: number; make: (n: number) => unknown[]; readBudget: (n: number) => number };
  reference: (...args: never[]) => unknown;
  /** Скільки читань робить Вовк на вході розміру n. */
  wolfReads: (n: number) => number;
  /** Вовче рішення для анімації «Як рахує Вовк». */
  wolfCode: string;
  hints: [string, string, string];
  scene: 'carthage';
}

/** Детермінований генератор для великих тестів. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
