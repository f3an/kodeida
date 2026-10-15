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

type Req = { code: string; lang: Lang; entry: string; calls: CallSpec[] };
type Opts = { timeoutMs?: number; eventLimit?: number };

export function runInSandbox(req: Req, opts: Opts = {}): Promise<RunOutcome> {
  return req.lang === 'py' ? runPython(req, opts) : runScript(req, opts);
}

/* Python: один Worker на всю гру. Pyodide вантажиться довго, тож Worker переживає запуски;
 * після таймауту його вбивають, і наступний запуск піднімає новий. */
let pyWorker: Worker | undefined;
let pyReady: Promise<Worker> | undefined;
let pyQueue: Promise<unknown> = Promise.resolve();

const pyIndexURL = () => new URL('pyodide/', document.baseURI).href;

function killPython() {
  pyWorker?.terminate();
  pyWorker = undefined;
  pyReady = undefined;
}

/** Починає вантажити Python наперед, щоб перший запуск не чекав. */
export function preloadPython(): Promise<Worker> {
  if (pyReady) return pyReady;
  const worker = new Worker(new URL('./py.worker.ts', import.meta.url), { type: 'module' });
  pyWorker = worker;
  const ready = new Promise<Worker>((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<SandboxMessage>) => {
      if (e.data.type === 'ready') resolve(worker);
      else if (e.data.type === 'initError') reject(new Error(e.data.message));
    };
    worker.onerror = (e) => { e.preventDefault(); reject(new Error(e.message || 'Python worker crashed')); };
    worker.postMessage({ type: 'init', indexURL: pyIndexURL() });
  });
  pyReady = ready;
  ready.catch(() => { if (pyReady === ready) killPython(); });
  return ready;
}

function runPython(req: Req, opts: Opts): Promise<RunOutcome> {
  const job = pyQueue.then(() => runPythonNow(req, opts));
  pyQueue = job.catch(() => undefined);
  return job;
}

async function runPythonNow(req: Req, opts: Opts): Promise<RunOutcome> {
  // Python повільніший за V8, тож час на виконання вдвічі більший.
  const timeoutMs = (opts.timeoutMs ?? 2000) * 2;
  const results: (CallResult | undefined)[] = [];
  let worker: Worker;
  try {
    worker = await preloadPython();
  } catch (err) {
    killPython();
    return { results, compileError: { message: `Python: ${err instanceof Error ? err.message : String(err)}` } };
  }
  return new Promise((resolve) => {
    let timer = 0;
    const finish = (o: Partial<RunOutcome>) => {
      clearTimeout(timer);
      worker.onmessage = null;
      worker.onerror = null;
      if (o.timedOutAt !== undefined || o.compileError?.message === 'Python worker crashed') killPython();
      resolve({ results, ...o });
    };
    const arm = () => { clearTimeout(timer); timer = window.setTimeout(() => finish({ timedOutAt: results.length }), timeoutMs); };
    worker.onmessage = (e: MessageEvent<SandboxMessage>) => {
      const m = e.data;
      if (m.type === 'compiled') arm();
      else if (m.type === 'compileError') finish({ compileError: m.error });
      else if (m.type === 'call') results[m.index] = m.result;
      else if (m.type === 'done') finish({});
    };
    worker.onerror = (e) => { e.preventDefault(); finish({ compileError: { message: 'Python worker crashed' } }); };
    timer = window.setTimeout(() => finish({ timedOutAt: 0 }), timeoutMs + 3000);
    worker.postMessage({ type: 'run', ...req, eventLimit: opts.eventLimit ?? 20000, ui: uiLang() });
  });
}

function runScript(req: Req, opts: Opts): Promise<RunOutcome> {
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
