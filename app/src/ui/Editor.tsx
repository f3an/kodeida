import { useEffect, useRef } from 'react';
import { monaco } from './monaco.ts';
import type { Lang } from '../engine/types.ts';

interface Props {
  value: string;
  lang: Lang;
  /** Помилка з рядком: підкреслюється в редакторі. */
  error?: { message: string; line?: number } | null;
  onChange: (v: string) => void;
  onCursor: (line: number, col: number) => void;
  onRun: () => void;
}

export function Editor({ value, lang, error, onChange, onCursor, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const ed = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const cb = useRef({ onChange, onCursor, onRun });
  cb.current = { onChange, onCursor, onRun };

  useEffect(() => {
    const editor = monaco.editor.create(host.current!, {
      theme: 'mykyta-dark',
      fontFamily: '"Fira Code", ui-monospace, Menlo, monospace',
      fontLigatures: true,
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      tabSize: 2,
      padding: { top: 10 },
      renderLineHighlight: 'all',
      // Без AI-підказок: лише звичайне автодоповнення мови.
      inlineSuggest: { enabled: false },
    });
    ed.current = editor;
    editor.onDidChangeModelContent(() => cb.current.onChange(editor.getValue()));
    editor.onDidChangeCursorPosition((e) => cb.current.onCursor(e.position.lineNumber, e.position.column));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => cb.current.onRun());
    return () => { editor.getModel()?.dispose(); editor.dispose(); };
  }, []);

  // Нова модель для кожної мови: TS і JS мають різні перевірки типів.
  useEffect(() => {
    const editor = ed.current!;
    const uri = monaco.Uri.parse(`file:///solution.${lang}`);
    let model = monaco.editor.getModel(uri);
    if (!model) model = monaco.editor.createModel(value, lang === 'ts' ? 'typescript' : 'javascript', uri);
    else if (model.getValue() !== value) model.setValue(value);
    const old = editor.getModel();
    editor.setModel(model);
    if (old && old !== model) old.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const model = ed.current?.getModel();
    if (model && model.getValue() !== value) model.setValue(value);
  }, [value]);

  useEffect(() => {
    const model = ed.current?.getModel();
    if (!model) return;
    const line = error?.line;
    monaco.editor.setModelMarkers(model, 'kodeida', line ? [{
      severity: monaco.MarkerSeverity.Error,
      message: error!.message,
      startLineNumber: line, endLineNumber: line,
      startColumn: model.getLineFirstNonWhitespaceColumn(line) || 1, endColumn: model.getLineMaxColumn(line),
    }] : []);
    if (line) ed.current!.revealLineInCenterIfOutsideViewport(line);
  }, [error]);

  return <div className="editor" ref={host} />;
}
