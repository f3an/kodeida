// Копіює рантайм Pyodide з node_modules у public/pyodide: звідти його віддає і vite dev, і зібрана гра.
// Запускається автоматично перед dev і build. Файли не комітяться (public/pyodide у .gitignore).
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';

const FILES = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];
const from = new URL('../node_modules/pyodide/', import.meta.url);
const to = new URL('../public/pyodide/', import.meta.url);
mkdirSync(to, { recursive: true });
for (const f of FILES) {
  const src = new URL(f, from), dst = new URL(f, to);
  if (!existsSync(src)) throw new Error(`Немає ${f} у node_modules/pyodide — виконай npm ci`);
  if (!existsSync(dst) || statSync(dst).size !== statSync(src).size) copyFileSync(src, dst);
}
