/// <reference lib="webworker" />
/* Пісочниця: новий Worker на кожен запуск, мережу вимкнено, зависання лікує terminate() у runner.ts. */
import { compile, runCall } from './sandbox-core.ts';
import type { SandboxMessage, SandboxRequest } from './types.ts';

const scope = self as unknown as Record<string, unknown>;
for (const k of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel']) {
  try { Object.defineProperty(scope, k, { value: undefined, configurable: false, writable: false }); } catch { /* немає в цьому середовищі */ }
}

const post = (m: SandboxMessage) => (self as unknown as Worker).postMessage(m);

self.onmessage = (e: MessageEvent<SandboxRequest>) => {
  const { code, lang, entry, calls, eventLimit } = e.data;
  const c = compile(code, lang, entry);
  if ('error' in c) { post({ type: 'compileError', error: c.error }); return; }
  post({ type: 'compiled' });
  calls.forEach((spec, index) => post({ type: 'call', index, result: runCall(c.fn, spec, eventLimit) }));
  post({ type: 'done' });
};
