/// <reference lib="webworker" />
/*
 * Python-пісочниця: Worker живе між запусками, бо Pyodide вантажиться секунду-дві.
 * Зависання лікує terminate() у runner.ts: наступний запуск підніме новий Worker.
 */
import { createPyEngine, pyEntry, type PyEngine } from './py-core.ts';
import type { SandboxMessage, SandboxRequest } from './types.ts';

const post = (m: SandboxMessage) => (self as unknown as Worker).postMessage(m);

type In = { type: 'init'; indexURL: string } | ({ type: 'run' } & SandboxRequest);

let engine: PyEngine | undefined;

/** Після завантаження мережа гравцеві не потрібна: Pyodide більше нічого не качає. */
function cutNetwork() {
  const scope = self as unknown as Record<string, unknown>;
  for (const k of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel']) {
    try { Object.defineProperty(scope, k, { value: undefined, configurable: false, writable: false }); } catch { /* немає в цьому середовищі */ }
  }
}

self.onmessage = async (e: MessageEvent<In>) => {
  const m = e.data;
  if (m.type === 'init') {
    try {
      const mod = await import(/* @vite-ignore */ `${m.indexURL}pyodide.mjs`);
      const py = await mod.loadPyodide({ indexURL: m.indexURL });
      engine = createPyEngine(py);
      cutNetwork();
      post({ type: 'ready' });
    } catch (err) {
      post({ type: 'initError', message: err instanceof Error ? err.message : String(err) });
    }
    return;
  }
  if (!engine) { post({ type: 'compileError', error: { message: 'Python is not loaded' } }); return; }
  const { code, entry, calls, eventLimit, ui } = m;
  const en = ui === 'en';
  const c = engine.compile(code, pyEntry(entry), en);
  if ('error' in c) { post({ type: 'compileError', error: c.error }); return; }
  post({ type: 'compiled' });
  calls.forEach((spec, index) => post({ type: 'call', index, result: engine!.runCall(spec, eventLimit, en) }));
  post({ type: 'done' });
};
