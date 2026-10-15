// Генерує src/world/sprites.js з ../site/app.js: піксельний рушій, герої, сцени світів і онбординг.
// Малювання не змінюється — гра й сайт виглядають однаково. Запуск: npm run sync-sprites
import { readFileSync, writeFileSync } from 'node:fs';

const src = readFileSync(new URL('../../site/app.js', import.meta.url), 'utf8');
const cut = (from, to, includeTo = false) => {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error(`Маркер не знайдено: ${a < 0 ? from : to}`);
  return src.slice(a, includeTo ? b + to.length : b);
};

const engine = cut('/* ---------- colour helpers ---------- */', '/* Сцени — функції локального часу');
const onboarding = cut('const OBX=', '\n];', true);
// Англійський словник сайту: назви світів, тем, пісень, описи мешканців.
const dict = cut('const DICT={', '\nconst RULES');

const names = [
  'Spr', 'px', 'shade', 'hash', 'rect', 'poly', 'ell', 'line', 'path', 'BK', 'RD', 'GD', 'WH', 'RAINBOW',
  'makeEnei', 'makeGod', 'makeFox', 'makeFoxWild', 'makeWolf', 'makeWolfWild', 'makeJuno', 'makeEol', 'makeDido', 'makeSibyl',
  'makeTrojan', 'TROJANS', 'makeAnchises', 'makeLion', 'makeMitten', 'artOf', 'drawSack', 'drawEgg', 'eggCells', 'EGG_PAL', 'MOTIFS', 'MOTIF_NAMES', 'drawMotif',
  'SONGS', 'ALL_WORLDS', 'SW', 'SH_', 'WORLD_SCENES', 'WORLD_FX', 'WORLD_INFO', 'fxLayer', 'genericBg', 'EXTRAS',
  'sky', 'sea', 'ruins', 'OB', 'DICT',
  'NODES', 'ISLES', 'MW', 'MH', 'MS', 'paintJourney', 'paintWorldArt', 'routePoint', 'worldCol', 'foxFor',
];

const out = `// @ts-nocheck
/* ЗГЕНЕРОВАНО з site/app.js скриптом scripts/sync-sprites.mjs — не редагуй вручну.
   Піксельний рушій, герої, сцени світів і онбординг без змін у малюванні. */
const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
const REDUCED = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
${dict}
${engine}
${onboarding}

export { ${names.join(', ')} };
`;
writeFileSync(new URL('../src/world/sprites.js', import.meta.url), out);
console.log(`sprites.js: ${out.split('\n').length} рядків`);
