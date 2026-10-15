import { useEffect, useRef } from 'react';

interface Props {
  width: number;
  height: number;
  /** Малює кадр f; викликається раз на `interval` мс (або один раз, якщо interval не задано). */
  draw: (ctx: CanvasRenderingContext2D, f: number) => void;
  interval?: number;
  className?: string;
  label: string;
}

/** Піксельне полотно для сцен із сайту: чіткі пікселі, кадри за таймером, пауза поза екраном і за reduced motion. */
export function PixelCanvas({ width, height, draw, interval, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = width * dpr; c.height = height * dpr;
    const ctx = c.getContext('2d')!;
    let f = 0, timer = 0, visible = true;
    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, width, height);
      // помилка в одній сцені не має валити весь екран
      try { drawRef.current(ctx, f); } catch (err) { console.error(err); }
    };
    paint();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    if (interval && !reduced) timer = window.setInterval(() => { if (visible && !document.hidden) { f++; paint(); } }, interval);
    return () => { clearInterval(timer); io.disconnect(); };
  }, [width, height, interval]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }} />;
}
