/*
 * Мова інтерфейсу: українська або англійська. Код рівнів і світів кличе L(uk, en) під час рендеру,
 * тож зміна мови в налаштуваннях одразу перемальовує все. Назви світів і тем беруться зі словника сайту.
 */
import { DICT } from './world/sprites.js';

export type UiLang = 'uk' | 'en';

export function detectLang(): UiLang {
  const l = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'uk';
  return l.startsWith('uk') || l.startsWith('ru') || l.startsWith('be') ? 'uk' : 'en';
}

let current: UiLang = 'uk';
export const uiLang = () => current;
export function setUiLang(l: UiLang) {
  current = l;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l === 'en' ? 'en' : 'uk';
    document.title = l === 'en' ? 'Kodeida' : 'Кодеїда';
  }
}

// Написи на полотні заставок (дзень!, гик!…) перекладаються зі словника сайту.
(globalThis as unknown as { __kodeidaT: (s: string) => string }).__kodeidaT = (s: string) => (current === 'en' ? ((DICT as Record<string, string>)[s] ?? s) : s);

/** Рядок поточною мовою. */
export const L = (uk: string, en: string) => (current === 'en' ? en : uk);

/** Переклад зі словника сайту (назви світів, тем, пісень); якщо немає — як є. */
export const siteT = (s: string) => (current === 'en' ? ((DICT as Record<string, string>)[s] ?? s) : s);

/** Число з розділювачами розрядів поточною мовою. */
export const fmt = (n: number) => n.toLocaleString(current === 'en' ? 'en-US' : 'uk-UA');
