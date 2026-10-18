import React, { useLayoutEffect, useRef } from 'react';
import { useCurrentFrame } from 'remotion';
import * as S from '../../../app/src/world/sprites.js';

export { S };

type Props = {
  readonly width: number;
  readonly height: number;
  readonly draw: (ctx: CanvasRenderingContext2D, frame: number) => void;
  readonly style?: React.CSSProperties;
};

/** Полотно, яке перемальовується щокадру. Пікселі без згладжування. */
export const PixelCanvas: React.FC<Props> = ({ width, height, draw, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;
    draw(ctx, frame);
  }, [frame, draw, width, height]);
  return <canvas ref={ref} width={width} height={height} style={{ imageRendering: 'pixelated', ...style }} />;
};

/** Спрайт гри (Spr), збільшений у `scale` разів. */
export const Sprite: React.FC<{ readonly spr: any; readonly scale: number; readonly style?: React.CSSProperties }> = ({
  spr,
  scale,
  style,
}) => (
  <PixelCanvas
    width={spr.w * scale}
    height={spr.h * scale}
    draw={(ctx) => spr.draw(ctx, 0, 0, scale)}
    style={style}
  />
);

/* Картка світу з гри: сцена, Еней, Микита свого кольору, мешканець і частинки.
   Ефекти гри беруть час із performance.now(), тож на час малювання підміняємо його кадром відео. */
const FXW = 400;
const FXH = 260;
export const WorldArt: React.FC<{ readonly n: number; readonly style?: React.CSSProperties }> = ({ n, style }) => (
  <PixelCanvas
    width={FXW}
    height={FXH}
    style={style}
    draw={(ctx, frame) => {
      const real = performance.now;
      performance.now = () => (frame / 30) * 1000 + n * 3700;
      try {
        S.paintWorldArt(ctx, n, Math.floor(frame / 4) + n * 5, null, 1);
      } finally {
        performance.now = real;
      }
    }}
  />
);
