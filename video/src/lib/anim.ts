import { Easing, interpolate, spring } from 'remotion';
import { BEAT } from '../timeline.mjs';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);

/** 0 → 1 від кадру `at` за `dur` кадрів, з ease-out. */
export const ramp = (frame: number, at: number, dur = 10, easing = OUT) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing });

/** Пружинна поява з легким перельотом. */
export const pop = (frame: number, fps: number, at: number, damping = 11) =>
  spring({ frame: frame - at, fps, config: { damping, stiffness: 180, mass: 0.6 } });

/** Удар на кожну долю: 1 одразу після долі, згасає до 0. */
export const beatPulse = (frame: number, every = BEAT) => Math.exp(-(((frame % every) + every) % every) / 3.5);

/** Тряска камери після удару в кадрі `at`. */
export const shake = (frame: number, at: number, amp = 18) => {
  const t = frame - at;
  if (t < 0 || t > 14) return '0px 0px';
  const k = amp * Math.exp(-t / 4);
  return `${Math.sin(t * 9.1) * k}px ${Math.cos(t * 7.3) * k}px`;
};

export { clamp };
