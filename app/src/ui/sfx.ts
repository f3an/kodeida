/* Короткі сигнали Запуску й Суду, синтезовані на льоту: жодних файлів, звучить як стара приставка. */
export type Chime = 'optimal' | 'correct' | 'wrong';

// [частота, початок у секундах, тривалість]
const NOTES: Record<Chime, { wave: OscillatorType; notes: [number, number, number][] }> = {
  optimal: { wave: 'square', notes: [[523, 0, 0.09], [659, 0.08, 0.09], [784, 0.16, 0.09], [1047, 0.24, 0.22]] },
  correct: { wave: 'square', notes: [[523, 0, 0.1], [784, 0.1, 0.2]] },
  wrong: { wave: 'triangle', notes: [[330, 0, 0.14], [247, 0.13, 0.26]] },
};

let ctx: AudioContext | null = null;
let on = true;

/** Налаштування «Звук» вмикає й вимикає всі сигнали. */
export function setSound(v: boolean) { on = v; }

export function chime(kind: Chime) {
  if (!on) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const { wave, notes } = NOTES[kind], t0 = ctx.currentTime + 0.02;
    for (const [f, at, len] of notes) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = wave; o.frequency.value = f;
      // короткий наступ і спад, щоб не клацало
      g.gain.setValueAtTime(0, t0 + at);
      g.gain.linearRampToValueAtTime(wave === 'square' ? 0.05 : 0.12, t0 + at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
      o.connect(g).connect(ctx.destination);
      o.start(t0 + at); o.stop(t0 + at + len + 0.02);
    }
  } catch { /* без звуку — то й без звуку */ }
}
