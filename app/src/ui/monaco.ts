/* Monaco офлайн: власні Worker'и замість CDN і тема «Mykyta Dark» з BRAND.md. */
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import TsWorker from 'monaco-editor/languages/features/typescript/ts.worker.js?worker';

(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker: (_id, label) => (label === 'typescript' || label === 'javascript' ? new TsWorker() : new EditorWorker()),
};

const ts = monaco.typescript;
const compilerOptions = {
  target: ts.ScriptTarget.ES2020,
  lib: ["es2022"],
  strict: true,
  noImplicitAny: false,
  allowNonTsExtensions: true,
};
ts.typescriptDefaults.setCompilerOptions(compilerOptions);
ts.javascriptDefaults.setCompilerOptions({ ...compilerOptions, allowJs: true, checkJs: true, strict: false });
// У пісочниці є лише console.log; DOM гравцю недоступний.
const consoleLib = 'declare const console: { log(...a: unknown[]): void; info(...a: unknown[]): void; warn(...a: unknown[]): void; error(...a: unknown[]): void };';
ts.typescriptDefaults.addExtraLib(consoleLib, 'ts:kodeida/console.d.ts');
// Черги з пріоритетом, як на LeetCode (світ 6: купа).
const pqLib = `declare class PriorityQueueBase<T> { enqueue(x: T): this; dequeue(): T | undefined; front(): T | undefined; size(): number; isEmpty(): boolean; toArray(): T[]; }
/** Купа: dequeue() повертає найменший елемент. */
declare class MinPriorityQueue<T = number> extends PriorityQueueBase<T> { constructor(priority?: (x: T) => number); }
/** Купа: dequeue() повертає найбільший елемент. */
declare class MaxPriorityQueue<T = number> extends PriorityQueueBase<T> { constructor(priority?: (x: T) => number); }`;
ts.typescriptDefaults.addExtraLib(pqLib, 'ts:kodeida/pq.d.ts');
ts.javascriptDefaults.addExtraLib(pqLib, 'ts:kodeida/pq.d.ts');
// Еней у світі 0: команди, які дає вулиця (sandbox-core.ts → makeStreet). Опис — мовою інтерфейсу.
const eneiLib = (en: boolean) => `/** ${en ? 'Aeneas on the street of ashes.' : 'Еней на вулиці згарища.'} */
interface Enei {
  /** ${en ? 'One step forward.' : 'Крок уперед на одну клітинку.'} */
  move(): void;
  /** ${en ? 'Jump over one cell (over the fire).' : 'Стрибок через одну клітинку (над вогнем).'} */
  jump(): void;
  /** ${en ? 'Pick up the sack where you stand.' : 'Підняти мішок там, де стоїш.'} */
  take(): void;
  /** ${en ? 'Is the next cell on fire.' : 'Чи горить на наступній клітинці.'} */
  fireAhead(): boolean;
  /** ${en ? 'Is there a sack here.' : 'Чи лежить мішок тут.'} */
  sackHere(): boolean;
  /** ${en ? 'Is Aeneas at the end of the street.' : 'Чи Еней уже в кінці вулиці.'} */
  atEnd(): boolean;
  /** ${en ? 'The cell Aeneas stands on.' : 'Номер клітинки, де стоїть Еней.'} */
  readonly position: number;
}`;
let eneiDisposables: { dispose(): void }[] = [];
/** Перереєструвати опис API Енея мовою інтерфейсу. */
export function setEditorLang(lang: 'uk' | 'en') {
  eneiDisposables.forEach((d) => d.dispose());
  eneiDisposables = [ts.typescriptDefaults.addExtraLib(eneiLib(lang === 'en'), 'ts:kodeida/enei.d.ts'), ts.javascriptDefaults.addExtraLib(eneiLib(lang === 'en'), 'ts:kodeida/enei.d.ts')];
}
setEditorLang('uk');
ts.javascriptDefaults.addExtraLib(consoleLib, 'ts:kodeida/console.d.ts');

monaco.editor.defineTheme('mykyta-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'E7E0CF' },
    { token: 'keyword', foreground: 'F08A45' },
    { token: 'identifier.function', foreground: 'E9C46A' },
    { token: 'type', foreground: '7FC4AE' },
    { token: 'type.identifier', foreground: '7FC4AE' },
    { token: 'number', foreground: 'FF8B7E' },
    { token: 'string', foreground: 'B5D99C' },
    { token: 'comment', foreground: '76857B', fontStyle: 'italic' },
    { token: 'delimiter', foreground: 'B8B09E' },
  ],
  colors: {
    'editor.background': '#141B17',
    'editor.foreground': '#E7E0CF',
    'editorLineNumber.foreground': '#4A5A50',
    'editorLineNumber.activeForeground': '#E2702B',
    'editor.lineHighlightBackground': '#1B241F',
    'editor.selectionBackground': '#3A4A40',
    'editorCursor.foreground': '#F08A45',
    'editorIndentGuide.background1': '#222D27',
    'editorWidget.background': '#0F1512',
    'editorSuggestWidget.background': '#0F1512',
    'editorSuggestWidget.selectedBackground': '#1F2A23',
    'scrollbarSlider.background': '#26332C99',
  },
});

export { monaco };
