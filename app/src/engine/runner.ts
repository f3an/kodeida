/* Запускає код гравця в окремому Worker'і з таймаутом. */
import type { CallResult, CallSpec, Lang, SandboxMessage } from './types.ts';
import { uiLang } from '../i18n.ts';

export interface RunOutcome {
  compileError?: { message: string; line?: number };
  /** results[i] відсутній, якщо виклик i не встиг виконатися. */
  results: (CallResult | undefined)[];
  /** Індекс виклику, на якому скінчився час. */
  timedOutAt?: number;
}

export function runInSandbox(
  req: { code: string; lang: Lang; entry: string; calls: CallSpec[] },
  opts: { timeoutMs?: number; eventLimit?: number } = {},
): Promise<RunOutcome> {
  const timeoutMs = opts.timeoutMs ?? 2000;
  const worker = new Worker(new URL('./sandbox.worker.ts', import.meta.url), { type: 'module' });
  const results: (CallResult | undefined)[] = [];
  return new Promise((resolve) => {
    let timer = 0;
    const finish = (o: Partial<RunOutcome>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ results, ...o });
    };
    // Таймаут рахуємо від успішної компіляції: перший запуск Worker'а теж займає час.
    const arm = () => { clearTimeout(timer); timer = window.setTimeout(() => finish({ timedOutAt: results.length }), timeoutMs); };
    timer = window.setTimeout(() => finish({ timedOutAt: 0 }), timeoutMs + 3000);
    worker.onmessage = (e: MessageEvent<SandboxMessage>) => {
      const m = e.data;
      if (m.type === 'compiled') arm();
      else if (m.type === 'compileError') finish({ compileError: m.error });
      else if (m.type === 'call') results[m.index] = m.result;
      else if (m.type === 'done') finish({});
    };
    worker.onerror = (e) => { e.preventDefault(); finish({ compileError: { message: e.message || 'Sandbox crashed' } }); };
    worker.postMessage({ ...req, eventLimit: opts.eventLimit ?? 20000, ui: uiLang() });
  });
}
