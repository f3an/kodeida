import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ArrayScene, ScrollScene, StreetScene, W, H, type Actor, type SceneState } from '../world/scenes.ts';
import type { Level } from '../engine/level.ts';
import type { ActorArg, ListArg, TestCase, WorldEvent } from '../engine/types.ts';
import { L } from '../i18n.ts';
import { worldOf } from '../levels/index.ts';

export interface WorldHandle {
  /** Показати приклад: вхід тесту, лог подій і (для масивів) що повернув код. */
  show: (tc: TestCase, events: WorldEvent[], actor?: Actor, result?: string | null) => void;
  play: () => void;
  step: () => void;
  finish: () => void;
  /** Реакція світу на вердикт. */
  flash: (kind: 'fail' | 'win') => void;
}

interface Props { level: Level; fox: string; speed: number; crew?: number; onState: (s: SceneState) => void }

const DESCR = (): Record<string, string> => ({
  street: L('Вулиця згарища: Еней виконує команди, Микита чекає в кінці', 'A street of ashes: Aeneas follows the commands, Mykyta waits at the end'),
  scroll: L('Казковий ліс і сувій: усе, що виводить програма, з\'являється на сувої рядок за рядком', 'A fairy-tale forest and a scroll: everything the program prints appears on it line by line'),
  array: L('Ряд предметів світу: код дивиться на них по черзі, Еней і Микита стають біля тих, що щойно прочитано', 'A row of objects: the code looks at them one by one, Aeneas and Mykyta stand by the ones just read'),
});

export const WorldView = forwardRef<WorldHandle, Props>(function WorldView({ level, fox, speed, crew = 0, onState }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ArrayScene | StreetScene | ScrollScene | null>(null);
  const observed = level.observe.findIndex((x) => !!x);

  const show = (tc: TestCase, events: WorldEvent[], actor: Actor = 'heroes', result: string | null = null) => {
    const s = scene.current;
    if (s instanceof ScrollScene) s.load(events);
    else if (s instanceof StreetScene) s.load((tc.args[0] as ActorArg).setup.cells, events);
    else if (s instanceof ArrayScene) {
      const arg = tc.args[observed] as unknown[] | string | ListArg;
      // зв'язний список: значення возів і зачіпки (останній — на pos, якщо валка замкнена)
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        const n = arg.$list.length, pos = arg.pos ?? -1;
        s.load(arg.$list, level.observe[observed]!, events, actor, result, arg.$list.map((_, i) => (i + 1 < n ? i + 1 : pos)));
      } else s.load(arg, level.observe[observed]!, events, actor, result);
    }
  };

  useEffect(() => {
    const spec = level.scene;
    const s = spec.type === 'street'
      ? new StreetScene(canvas.current!, onState, fox)
      : spec.type === 'scroll' ? new ScrollScene(canvas.current!, onState, fox, level.world, worldOf(level).levels.indexOf(level))
      : new ArrayScene(canvas.current!, onState, fox, level.world, spec.skin, spec.mode);
    scene.current = s;
    show(level.examples[0], []);
    s.setSpeed(speed);
    return () => s.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => scene.current?.setSpeed(speed), [speed]);
  useEffect(() => scene.current?.setCrew(crew), [crew, level]);

  useImperativeHandle(ref, () => ({
    show,
    play: () => scene.current?.play(),
    step: () => scene.current?.step(),
    finish: () => scene.current?.finish(),
    flash: (k) => scene.current?.flash(k),
  }));

  return <canvas ref={canvas} className="world" style={{ aspectRatio: `${W} / ${H}` }} role="img" aria-label={DESCR()[level.scene.type]} />;
});
