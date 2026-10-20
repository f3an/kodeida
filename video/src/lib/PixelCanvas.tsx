import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { continueRender, delayRender, Img, staticFile, useCurrentFrame } from 'remotion';
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

/* ---------- новий арт (PNG з public/art, див. npm run art) ---------- */
type Loaded = { img: HTMLImageElement; box: [number, number, number, number] };
const loaded = new Map<string, Promise<Loaded>>();
/** Картинка нового арту, обрізана по непрозорих пікселях (як спрайти в грі). */
function loadArt(key: string): Promise<Loaded> {
  if (!loaded.has(key)) loaded.set(key, new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d')!; g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1); }
      res({ img, box: [x0, y0, x1 - x0, y1 - y0] });
    };
    img.onerror = () => rej(new Error(`art: ${key}`));
    img.src = staticFile(`art/${key}.png`);
  }));
  return loaded.get(key)!;
}
/** Посилання на новий арт для <Sprite spr={art('enei/static-SE')} />. */
export const art = (key: string) => ({ art: key });

const ArtSprite: React.FC<{ readonly k: string; readonly scale: number; readonly style?: React.CSSProperties }> = ({ k, scale, style }) => {
  const [a, setA] = useState<Loaded | null>(null);
  const [handle] = useState(() => delayRender(`art ${k}`));
  useEffect(() => { loadArt(k).then((x) => { setA(x); continueRender(handle); }, () => continueRender(handle)); }, [k, handle]);
  if (!a) return null;
  const [x, y, w, h] = a.box;
  return (
    <PixelCanvas width={w * scale} height={h * scale} style={style}
      draw={(ctx) => ctx.drawImage(a.img, x, y, w, h, 0, 0, w * scale, h * scale)} />
  );
};

/** Спрайт: старий Spr з sprites.js або новий арт (art('ключ')), збільшений у `scale` разів. */
export const Sprite: React.FC<{ readonly spr: any; readonly scale: number; readonly style?: React.CSSProperties }> = ({
  spr,
  scale,
  style,
}) =>
  spr?.art ? (
    <ArtSprite k={spr.art} scale={scale} style={style} />
  ) : (
    <PixelCanvas
      width={spr.w * scale}
      height={spr.h * scale}
      draw={(ctx) => spr.draw(ctx, 0, 0, scale)}
      style={style}
    />
  );

/* Картка світу з гри: новий фон, Еней, Микита свого кольору й мешканець — кадр, знятий із гри (site/media/art/new). */
export const WorldArt: React.FC<{ readonly n: number; readonly style?: React.CSSProperties }> = ({ n, style }) => (
  <Img src={staticFile(`art/site/world-${String(n).padStart(2, '0')}.png`)} width={400} height={260} style={{ imageRendering: 'pixelated', ...style }} />
);
