import { rng, type Level } from '../engine/level.ts';

function maxArea(height: number[]): number {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const hl = height[l], hr = height[r];
    best = Math.max(best, (r - l) * Math.min(hl, hr));
    if (hl < hr) l++; else r--;
  }
  return best;
}

const ex = (height: number[]) => ({ args: [height], expected: maxArea(height.slice()), label: JSON.stringify(height) });

export const dido: Level = {
  id: 'carthage.dido',
  world: 2,
  worldName: 'Карфаген Дидони',
  song: 'Пісня II · Гостини',
  title: 'Задача Дидони',
  leetcode: { n: 11, title: 'Container With Most Water', slug: 'container-with-most-water' },
  brief: '<b>Задача Дидони.</b> Стовпи стоять у ряд, висота кожного в масиві <code>height</code>. Обгороди двома стовпами ділянку, що вміщає найбільше води.',
  statement: [
    'Дидона може взяти стільки землі, скільки обгородить волячою шкурою. Уламок Писанки заплутав мірки, і стіни не сходяться. Стовпи вже стоять — обери два.',
    'Дано масив <code>height</code> довжини <code>n</code>. Стовп <code>i</code> має висоту <code>height[i]</code>. Два стовпи разом із землею утворюють ділянку: вода в ній стоїть до нижчого стовпа.',
    'Поверни найбільшу кількість води: <code>(j − i) · min(height[i], height[j])</code>.',
    'Обмеження: <code>2 ≤ n ≤ 10⁵</code>, <code>0 ≤ height[i] ≤ 10⁴</code>. Світ рахує, скільки разів код дивиться на стовпи: Вовк перебирає всі пари, а шкура тим часом висихає.',
  ],
  entry: 'maxArea',
  observe: ['height'],
  starter: {
    ts: `/**
 * Задача Дидони
 * height[i] — висота i-го стовпа.
 * Поверни, скільки найбільше води вміщає ділянка між двома стовпами.
 */
function maxArea(height: number[]): number {
  let best = 0;
  // Слово ладу пиши тут

  return best;
}
`,
    js: `/**
 * Задача Дидони
 * height[i] — висота i-го стовпа.
 * Поверни, скільки найбільше води вміщає ділянка між двома стовпами.
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {
  let best = 0;
  // Слово ладу пиши тут

  return best;
}
`,
  },
  examples: [ex([1, 8, 6, 2, 5, 4, 8, 3, 7]), ex([1, 1])],
  hidden: [
    ex([4, 3, 2, 1, 4]),
    ex([1, 2, 1]),
    ex([0, 0]),
    ex([2, 3, 4, 5, 18, 17, 6]),
    ex([1, 8, 100, 2, 100, 4, 8, 3, 7]),
    ex([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    ex([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
    ex([5, 5, 5, 5, 5, 5]),
  ],
  big: {
    n: 10000,
    make: (n) => { const r = rng(2026); return [Array.from({ length: n }, () => Math.floor(r() * 10001))]; },
    readBudget: (n) => 10 * n,
  },
  reference: maxArea,
  wolfReads: (n) => n * (n - 1),
  wolfCode: `function maxArea(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++)
    for (let j = i + 1; j < height.length; j++)
      best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
  return best;
}`,
  hints: [
    'А що, як іти з обох кінців одночасно?',
    'Почни з найширшої ділянки: крайні стовпи. Вода стоїть до нижчого з них. Чи є сенс тримати нижчий стовп, якщо ділянка далі тільки звужується?',
    'l = 0, r = n − 1. Поки l < r: порахуй площу, онови найкраще, зсунь той вказівник, де стовп нижчий.',
  ],
  scene: 'carthage',
};

/** Решта вправ світу 2 — у планах ([STORY.md](../../docs/STORY.md)). */
export const carthagePlanned = ['Зустрітися посередині', 'Valid Palindrome', 'Two Sum II', 'Remove Duplicates'];
