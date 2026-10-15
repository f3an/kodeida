/* Прогрес і код зберігаються локально. Сховище може бути недоступне — тоді гра просто нічого не пам'ятає. */
const PREFIX = 'kodeida.';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* немає сховища */ }
}
