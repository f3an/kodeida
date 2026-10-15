/*
 * Діалог світу: персонаж виходить на сцену (портрет), а текст друкується по літері.
 * Новий мовець — вихід зі стрибком; той самий — кивок. Помилка — червона рамка і струс,
 * перемога — золоте сяйво. Клік по тексту одразу дописує репліку.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PixelCanvas } from './PixelCanvas.tsx';
import { makeEnei, makeFox, makeJuno, makeSibyl, makeDido, makeEol, makeWolf, makeGod, makeAnchises, makeTrojan, makeLion, makeMitten } from '../world/sprites.js';

export type Speaker = 'enei' | 'fox' | 'juno' | 'sibyl' | 'dido' | 'eol' | 'wolf' | 'zeus' | 'apollo' | 'bacchus' | 'neptune' | 'venus' | 'anchises' | 'warrior' | 'sailor' | 'woman' | 'lion' | 'mitten';
export type Tone = 'say' | 'error' | 'win' | 'taunt';

type Sprite = { w: number; h: number; draw: (...a: unknown[]) => void };
const cache = new Map<string, Sprite[]>();
/** Два кадри на персонажа: звичайний і «кліп» — так портрет живе, поки говорить. */
function frames(who: Speaker, fox: string): Sprite[] {
  const key = who === 'fox' ? `fox:${fox}` : who;
  if (cache.has(key)) return cache.get(key)!;
  const f: Sprite[] = (() => {
    switch (who) {
      case 'enei': return [makeEnei(1), makeEnei(1, { blink: true })];
      case 'fox': return [makeFox(fox), makeFox(fox, { cursorOff: true })];
      case 'juno': return [makeJuno(), makeJuno()];
      case 'sibyl': return [makeSibyl(), makeSibyl()];
      case 'dido': return [makeDido(), makeDido()];
      case 'eol': return [makeEol(), makeEol()];
      case 'wolf': return [makeWolf({ drool: 2 }), makeWolf({ drool: 1 })];
      case 'anchises': return [makeAnchises(), makeAnchises()];
      case 'lion': return [makeLion(), makeLion()];
      case 'mitten': return [makeMitten(), makeMitten()];
      case 'warrior': case 'sailor': case 'woman': return [makeTrojan(who), makeTrojan(who)];
      // боги жестикулюють, поки говорять: кадр з піднятою рукою
      default: return [makeGod(who), makeGod(who, { raise: true })];
    }
  })();
  cache.set(key, f);
  return f;
}

const PW = 96, PH = 104;

interface Props {
  who: Speaker;
  name: string;
  text: string;
  tone: Tone;
  fox: string;
  /** Лічильник реплік: та сама репліка ще раз (напр. повторна помилка) теж анімується. */
  seq: number;
  /** Новий мовець виходить на сцену, той самий — лише киває. */
  enter: 'in' | 'nod';
  action?: ReactNode;
}

export function Speech({ who, name, text, tone, fox, seq, enter, action }: Props) {
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [shown, setShown] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) { setShown(text.length); return; }
    // Друк за часом, а не по літері: коротка репліка — швидко, довга — не довше 0,6 с, щоб не здавалось, що гра гальмує.
    setShown(0);
    const dur = Math.min(600, 120 + text.length * 6);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const n = Math.min(text.length, Math.ceil(((now - t0) / dur) * text.length));
      setShown(n);
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq, text]);

  const talking = shown < text.length;
  const spr = frames(who, fox);
  const draw = (ctx: CanvasRenderingContext2D, f: number) => {
    const s = spr[talking ? f % 2 : f % 23 === 0 ? 1 : 0];
    // погруддя: голова й плечі, по центру рамки
    // широкі спрайти (рукавичка) малюємо вдвічі менше, щоб вмістилися в рамку портрета
    const scale = s.w > 60 ? 1 : 2, w = s.w * scale;
    const y = talking && f % 2 ? 1 : 0;
    s.draw(ctx, Math.round((PW - w) / 2 / 2) * 2, 6 + y * 2, scale);
  };

  return (
    <div className={`speech ${tone} enter-${enter}`} key={`${seq}`} aria-live="polite">
      <div className="portrait">
        <PixelCanvas key={`${who}:${fox}`} width={PW} height={PH} draw={draw} interval={talking ? 280 : 420} label={name} />
      </div>
      <div className="speech-body" onClick={() => setShown(text.length)}>
        <b className="speech-name" aria-hidden="true">{name}</b>
        {/* друк — лише для очей; скринрідер одразу отримує всю репліку */}
        <p aria-hidden="true">{text.slice(0, shown)}<span className="speech-rest">{text.slice(shown)}</span></p>
        <span className="sr">{name}: {text}</span>
        {action && !talking && <div className="speech-action">{action}</div>}
      </div>
    </div>
  );
}
