import { useEffect, useRef } from 'react';

interface Props {
  width: number;
  height: number;
  /** Малює кадр f; викликається раз на `interval` мс (або один раз, якщо interval не задано). */
  draw: (ctx: CanvasRenderingContext2D, f: number) => void;
  interval?: number;
  /** Перемальовувати кожен кадр екрана (60 к/с); f і далі рахується як «номер такту interval». */
  smooth?: boolean;
  className?: string;
  label: string;
}

/** Піксельне полотно для сцен із сайту: чіткі пікселі, кадри за таймером, пауза поза екраном і за reduced motion. */
export function PixelCanvas({ width, height, draw, interval, smooth, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(devicePixelRatio || 1, 3);
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
    let raf = 0;
    if (interval && !reduced && smooth) {
      // кожен кадр екрана: рух і переходи плавні, а піксельні анімації йдуть у своєму темпі
      const t0 = performance.now();
      const loop = (now: number) => {
        if (visible && !document.hidden) { f = Math.floor((now - t0) / interval); paint(); }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else if (interval && !reduced) timer = window.setInterval(() => { if (visible && !document.hidden) { f++; paint(); } }, interval);
    return () => { clearInterval(timer); cancelAnimationFrame(raf); io.disconnect(); };
  }, [width, height, interval, smooth]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }} />;
}
