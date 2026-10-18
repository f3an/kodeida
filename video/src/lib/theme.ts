import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadFira } from '@remotion/google-fonts/FiraCode';

// Шрифти й палітра з docs/BRAND.md
export const HEAD = loadUnbounded('normal', { weights: ['700', '800'], subsets: ['latin', 'cyrillic'] }).fontFamily;
export const BODY = loadManrope('normal', { weights: ['500', '700', '800'], subsets: ['latin', 'cyrillic'] }).fontFamily;
export const MONO = loadFira('normal', { weights: ['500'], subsets: ['latin'] }).fontFamily;

export const C = {
  red: '#B3202A',
  fox: '#E2702B',
  ink: '#1F1B16',
  linen: '#EFE6D2',
  blue: '#2F55A0',
  gold: '#D9A521',
  night: '#141B17',
  crystal: '#D4ECF3',
  wolf: '#6f747c',
};

// Тема редактора «Mykyta Dark»
export const CODE = {
  keyword: '#F08A45',
  fn: '#E9C46A',
  type: '#7FC4AE',
  number: '#FF8B7E',
  prop: '#B9A7E8',
  comment: '#76857B',
  text: '#E7E0CF',
  bg: '#141B17',
};
