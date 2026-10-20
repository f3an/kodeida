// Новий арт для роликів: копіює PNG гри (app/src/assets/art) і рендери сайту (site/media/art/new)
// у public/art та пише manifest.json { ключ: [ширина, висота] } — щоб спрайти мали точний розмір.
// Запуск: npm run art
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const OUT = new URL('../public/art/', import.meta.url).pathname;
const SOURCES = [
  [new URL('../../app/src/assets/art/', import.meta.url).pathname, ''],
  [new URL('../../site/media/art/new/', import.meta.url).pathname, 'site/'],
];

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.png') ? [p] : [];
});
/** Розмір PNG з заголовка IHDR (байти 16–23). */
const size = (file) => { const b = readFileSync(file); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

rmSync(OUT, { recursive: true, force: true });
const manifest = {};
for (const [root, prefix] of SOURCES) {
  for (const file of walk(root)) {
    const key = prefix + relative(root, file).replace(/\.png$/, '');
    const dst = join(OUT, key + '.png');
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(file, dst);
    manifest[key] = size(file);
  }
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest));
console.log(`public/art: ${Object.keys(manifest).length} картинок`);
