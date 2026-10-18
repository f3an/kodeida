// Генерує оригінальний саундтрек трейлера: чіптюн у ре гармонічному мінорі, 150 BPM.
// Такт = 1.6 с = 48 кадрів при 30 fps, тож кожна сцена й склейка падає точно в долю.
// Запуск: node scripts/music.mjs → public/music.wav (трейлер)
//         node scripts/music.mjs launch → public/music-launch.wav (відео до релізу)
import { writeFileSync } from 'node:fs';

const which = process.argv[2] ?? 'trailer';
const { SECTIONS, BARS, BPM } = await import(which === 'launch' ? '../src/launch-timeline.mjs' : '../src/timeline.mjs');
const OUT_FILE = which === 'launch' ? 'music-launch.wav' : 'music.wav';

const SR = 44100;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const S16 = BEAT / 4;
const TOTAL = BARS * BAR + 0.4;
const N = Math.ceil(TOTAL * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

function add(t0, buf, gain = 1, pan = 0) {
  const i0 = Math.round(t0 * SR);
  const gl = gain * Math.min(1, 1 - pan);
  const gr = gain * Math.min(1, 1 + pan);
  for (let i = 0; i < buf.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    L[j] += buf[i] * gl;
    R[j] += buf[i] * gr;
  }
}

function env(i, len, a, d, s, r) {
  const t = i / SR;
  const dur = len / SR;
  let e;
  if (t < a) e = t / a;
  else if (t < a + d) e = 1 - (1 - s) * ((t - a) / d);
  else e = s;
  if (t > dur - r) e *= Math.max(0, (dur - t) / r);
  return e;
}

// --- інструменти ---
function pulse(freq, dur, { duty = 0.5, a = 0.004, d = 0.08, s = 0.6, r = 0.04, vib = 0, slide = 0 } = {}) {
  const len = Math.round(dur * SR);
  const b = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const v = vib && t > 0.12 ? 1 + vib * Math.sin(2 * Math.PI * 5.5 * t) : 1;
    const f = freq * v * (slide ? 2 ** ((slide * Math.max(0, 0.03 - t)) / 0.03 / 12) : 1);
    ph = (ph + f / SR) % 1;
    b[i] = (ph < duty ? 1 : -1) * env(i, len, a, d, s, r);
  }
  // м'який низькочастотний фільтр, щоб квадрат не різав вухо
  let y = 0;
  for (let i = 0; i < len; i++) b[i] = y += (b[i] - y) * 0.35;
  return b;
}

function tri(freq, dur, { a = 0.002, d = 0.1, s = 0.3, r = 0.05 } = {}) {
  const len = Math.round(dur * SR);
  const b = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    ph = (ph + freq / SR) % 1;
    b[i] = (4 * Math.abs(ph - 0.5) - 1) * env(i, len, a, d, s, r);
  }
  return b;
}

function saw(freq, dur, { a = 0.3, r = 0.4, cut = 0.05 } = {}) {
  const len = Math.round(dur * SR);
  const b = new Float32Array(len);
  const det = [0.996, 1, 1.004];
  const ph = [0, 0.33, 0.66];
  let y = 0;
  for (let i = 0; i < len; i++) {
    let v = 0;
    for (let k = 0; k < 3; k++) {
      ph[k] = (ph[k] + (freq * det[k]) / SR) % 1;
      v += ph[k] * 2 - 1;
    }
    y += (v / 3 - y) * cut;
    b[i] = y * env(i, len, a, 0, 1, r);
  }
  return b;
}

function kick(punch = 1) {
  const len = Math.round(0.32 * SR);
  const b = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 45 + 160 * Math.exp(-t * 32);
    ph += f / SR;
    b[i] = Math.tanh(Math.sin(2 * Math.PI * ph) * 1.8 * punch) * Math.exp(-t * 9);
  }
  return b;
}

function snare() {
  const len = Math.round(0.22 * SR);
  const b = new Float32Array(len);
  let hp = 0;
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const n = rnd();
    hp = 0.85 * (hp + n - prev);
    prev = n;
    b[i] = hp * 0.8 * Math.exp(-t * 18) + Math.sin(2 * Math.PI * 190 * t) * 0.6 * Math.exp(-t * 30);
  }
  return b;
}

function hat(open = false) {
  const len = Math.round((open ? 0.18 : 0.045) * SR);
  const b = new Float32Array(len);
  let hp = 0;
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const n = rnd();
    hp = 0.6 * (hp + n - prev);
    prev = n;
    b[i] = hp * Math.exp((-i / SR) * (open ? 20 : 70));
  }
  return b;
}

function crash() {
  const len = Math.round(1.8 * SR);
  const b = new Float32Array(len);
  let hp = 0;
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const n = rnd();
    hp = 0.7 * (hp + n - prev);
    prev = n;
    b[i] = hp * Math.exp((-i / SR) * 2.4);
  }
  return b;
}

function riser(dur) {
  const len = Math.round(dur * SR);
  const b = new Float32Array(len);
  let y = 0;
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const p = i / len;
    y += (rnd() - y) * (0.01 + 0.4 * p * p);
    ph += (200 + 1800 * p * p) / SR;
    b[i] = (y * 0.8 + Math.sin(2 * Math.PI * ph) * 0.15) * p * p;
  }
  return b;
}

function sub(dur) {
  const len = Math.round(dur * SR);
  const b = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    ph += (70 * Math.exp(-t * 1.5) + 30) / SR;
    b[i] = Math.sin(2 * Math.PI * ph) * Math.exp(-t * 1.6);
  }
  return b;
}

// --- гармонія: i – VI – VII – V (Dm – B♭ – C – A) ---
const CHORDS = {
  Dm: { root: 38, tones: [62, 65, 69] },
  Bb: { root: 34, tones: [62, 65, 70] },
  C: { root: 36, tones: [64, 67, 72] },
  A: { root: 33, tones: [61, 64, 69] },
};
const PROG = ['Dm', 'Bb', 'C', 'A'];

// Гачок на 4 такти, [midi | null, тривалість у шістнадцятих]
const HOOK = [
  [[69, 2], [69, 1], [74, 1], [null, 1], [73, 1], [74, 2], [76, 2], [77, 4], [76, 2]],
  [[74, 2], [70, 2], [74, 2], [77, 2], [79, 4], [77, 2], [76, 2]],
  [[76, 2], [72, 2], [76, 2], [79, 2], [81, 3], [79, 1], [77, 2], [76, 2]],
  [[73, 2], [76, 2], [81, 4], [79, 2], [77, 2], [76, 2], [73, 2]],
];

const sKick = kick();
const sKickBig = kick(1.6);
const sSnare = snare();
const sHat = hat();
const sHatO = hat(true);
const sCrash = crash();

function playHook(t, phrase, { oct = 0, gain = 0.16, duty = 0.5, inst = 'pulse' } = {}) {
  let p = 0;
  for (const [m, len] of HOOK[phrase]) {
    if (m !== null) {
      const f = mtof(m + oct);
      const d = len * S16;
      const b = inst === 'tri' ? tri(f, d * 1.6, { d: 0.3, s: 0.0, r: 0.2 }) : pulse(f, d * 0.95, { duty, vib: 0.006, slide: -1 });
      add(t + p * S16, b, gain, 0.12);
      if (inst !== 'tri') add(t + p * S16 + S16 * 1.5, b, gain * 0.25, -0.4); // ехо
    }
    p += len;
  }
}

for (const sec of SECTIONS) {
  for (let k = 0; k < sec.bars; k++) {
    const b = sec.start + k;
    const t = b * BAR;
    const phrase = k % 4;
    const ch = CHORDS[sec.chord?.[k] ?? PROG[phrase]];
    const e = sec.music;

    if (e.pad) for (const m of ch.tones) add(t, saw(mtof(m - 12), BAR + 0.1, { cut: e.pad }), 0.05, (m % 3) * 0.3 - 0.3);

    if (e.bass) {
      for (let i = 0; i < 8; i++) {
        const m = ch.root + (i % 2 && e.bass === 2 ? 12 : 0);
        add(t + i * 2 * S16, pulse(mtof(m), S16 * 1.8, { duty: 0.25, d: 0.1, s: 0.5 }), 0.22);
      }
    }
    if (e.longBass) add(t, pulse(mtof(ch.root), BAR, { duty: 0.25, a: 0.02, d: 0.6, s: 0.4, r: 0.3 }), 0.2);

    if (e.arp) {
      const seq = [0, 1, 2, 1, 0, 1, 2, 3];
      for (let i = 0; i < 16; i++) {
        const idx = seq[i % 8];
        const m = idx === 3 ? ch.tones[0] + 12 : ch.tones[idx];
        add(t + i * S16, tri(mtof(m + 12), S16 * 0.9), 0.07, i % 2 ? 0.35 : -0.35);
      }
    }

    if (e.lead) playHook(t, phrase, { oct: e.lead === 'up' ? 12 : 0, gain: 0.15, duty: e.lead === 'thin' ? 0.25 : 0.5 });
    if (e.box) playHook(t, phrase, { oct: 12, gain: 0.2, inst: 'tri' });

    if (e.kick === 4) for (let i = 0; i < 4; i++) add(t + i * BEAT, sKick, 0.75);
    if (e.kick === 2) for (const i of [0, 2]) add(t + i * BEAT, sKick, 0.7);
    if (e.kick === 1) add(t, sKick, 0.6);
    if (e.kick === 4 && k % 2 === 1) add(t + 3.5 * BEAT, sKick, 0.5);

    if (e.snare) for (const i of [1, 3]) add(t + i * BEAT, sSnare, 0.45);
    if (e.hats === 16) for (let i = 0; i < 16; i++) add(t + i * S16, i % 4 === 2 ? sHatO : sHat, i % 2 ? 0.1 : 0.16, 0.3);
    if (e.hats === 8) for (let i = 0; i < 8; i++) add(t + i * 2 * S16, sHat, 0.13, 0.3);

    if (k === 0 && e.crash) add(t, sCrash, 0.22);
    if (k === 0 && e.impact) {
      add(t, sKickBig, 0.9);
      add(t, sub(1.4), 0.55);
      add(t, sCrash, 0.3);
    }
    if (k === sec.bars - 1 && e.roll) {
      // дріб наприкінці секції, густішає до наступного такту
      for (let i = 0; i < 16; i++) {
        if (i < 8 && i % 2) continue;
        add(t + i * S16, sSnare, 0.12 + (i / 16) * 0.3);
      }
    }
    if (e.riser && k === sec.bars - (e.riser === 'long' ? 2 : 1)) {
      add(t, riser(e.riser === 'long' ? BAR * 2 : BAR), 0.25);
    }
    if (e.end && k === 0) {
      add(t, sKickBig, 0.9);
      add(t, sub(2.5), 0.6);
      add(t, sCrash, 0.35);
      for (const m of [50, 57, 62, 65, 69, 74]) add(t, saw(mtof(m), BAR * 2, { a: 0.005, r: 2.2, cut: 0.08 }), 0.07);
      add(t, pulse(mtof(74), BAR * 1.5, { s: 0.5, r: 1.2, vib: 0.01 }), 0.13);
    }
  }
}

// майстер: легкий бас-буст через сатурацію, нормалізація, fade-out
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(L[i] * 1.3);
  R[i] = Math.tanh(R[i] * 1.3);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = 0.89 / peak;
const fade = 0.4 * SR;
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write('data', 36);
out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const f = i > N - fade ? (N - i) / fade : 1;
  out.writeInt16LE(Math.round(L[i] * g * f * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(R[i] * g * f * 32767), 46 + i * 4);
}
writeFileSync(new URL(`../public/${OUT_FILE}`, import.meta.url), out);
console.log(`${OUT_FILE}: ${TOTAL.toFixed(1)} s, ${BARS} тактів по ${BAR} с`);
