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
