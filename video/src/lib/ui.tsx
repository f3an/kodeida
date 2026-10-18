import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, OUT, pop, ramp } from './anim';
import { C, HEAD } from './theme';

/** Тло: градієнт і піксельна сітка, що повільно їде. */
export const Bg: React.FC<{ readonly from: string; readonly to: string; readonly grid?: number; readonly speed?: number }> = ({
  from,
  to,
  grid = 0.06,
  speed = 0.6,
}) => {
  const frame = useCurrentFrame();
  const off = (frame * speed) % 48;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 40%, ${from}, ${to})` }}>
      <AbsoluteFill
        style={{
          opacity: grid,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.9) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.9) 2px, transparent 2px)',
          backgroundSize: '48px 48px',
          backgroundPosition: `${off}px ${off}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Вибух квадратних «пікселів» із центру в кадрі `at`. */
export const Burst: React.FC<{
  readonly at?: number;
  readonly x?: number;
  readonly y?: number;
  readonly n?: number;
  readonly colors?: string[];
  readonly power?: number;
}> = ({ at = 0, x = 960, y = 540, n = 48, colors = [C.fox, C.gold, C.red, C.crystal, C.linen], power = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 50) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + Math.sin(i * 12.9) * 0.4;
        const v = (14 + 22 * Math.abs(Math.sin(i * 78.2))) * power;
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t + 0.45 * t * t;
        const size = 10 + (i % 4) * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: size,
              height: size,
              background: colors[i % colors.length],
              opacity: interpolate(t, [30, 50], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Заголовок, де кожне слово влітає з пружиною одне за одним. */
export const Words: React.FC<{
  readonly text: string;
  readonly at?: number;
  readonly step?: number;
  readonly size?: number;
  readonly color?: string;
  readonly accent?: string;
  readonly accentFrom?: number;
  readonly style?: React.CSSProperties;
}> = ({ text, at = 0, step = 3, size = 120, color = C.linen, accent, accentFrom = Infinity, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: HEAD,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        color,
        display: 'flex',
        flexWrap: 'wrap',
        gap: `0 ${size * 0.28}px`,
        letterSpacing: -size * 0.02,
        ...style,
      }}
    >
      {text.split(' ').map((w, i) => {
        const p = pop(frame, fps, at + i * step);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: i >= accentFrom ? accent : undefined,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              translate: `0 ${(1 - p) * size * 0.9}px`,
              scale: `${interpolate(p, [0, 1], [0.6, 1])}`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Плашка з текстом, що виїжджає збоку. */
export const Chip: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
  readonly from?: 'left' | 'right';
  readonly style?: React.CSSProperties;
}> = ({ at, children, bg = C.fox, color = C.ink, size = 44, from = 'left', style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, 9, OUT);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 18,
        padding: `${size * 0.36}px ${size * 0.6}px`,
        background: bg,
        color,
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        borderRadius: 14,
        boxShadow: '0 10px 0 rgba(0,0,0,.35)',
        opacity: p,
        translate: `${(1 - p) * (from === 'left' ? -120 : 120)}px 0`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Логотип: золота дужка-оселедець і вордмарк. */
export const Logo: React.FC<{ readonly name: string; readonly size: number; readonly at?: number }> = ({
  name,
  size,
  at = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = pop(frame, fps, at, 9);
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: HEAD, fontWeight: 800, color: C.linen }}>
      <span
        style={{
          fontSize: size * 1.55,
          color: C.gold,
          marginRight: size * 0.18,
          translate: `0 ${-size * 0.08}px`,
          display: 'inline-block',
          scale: `${interpolate(b, [0, 1], [3, 1])}`,
          rotate: `${interpolate(b, [0, 1], [-25, 0])}deg`,
          opacity: interpolate(b, [0, 0.2], [0, 1], clamp),
          textShadow: `0 0 ${size * 0.4}px rgba(217,165,33,.55)`,
        }}
      >
        {'{'}
      </span>
      {name.split('').map((ch, i) => {
        const p = pop(frame, fps, at + 3 + i * 2, 10);
        return (
          <span
            key={i}
            style={{
              fontSize: size,
              display: 'inline-block',
              letterSpacing: -size * 0.03,
              translate: `0 ${(1 - p) * -size * 1.2}px`,
              opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Рамка «екрана» для запису гри. */
export const Screen: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: 22,
      overflow: 'hidden',
      border: `6px solid ${C.ink}`,
      boxShadow: '0 40px 80px rgba(0,0,0,.55), 0 0 0 3px rgba(239,230,210,.18)',
      background: C.night,
      ...style,
    }}
  >
    {children}
  </div>
);
