import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { CarthageScene, W, H, type Actor, type SceneState } from '../world/carthage.ts';
import type { WorldEvent } from '../engine/types.ts';

export interface WorldHandle {
  load: (heights: number[], events: WorldEvent[], actor: Actor) => void;
  play: () => void;
  step: () => void;
  finish: () => void;
}

interface Props { heights: number[]; speed: number; onState: (s: SceneState) => void }

export const WorldView = forwardRef<WorldHandle, Props>(function WorldView({ heights, speed, onState }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<CarthageScene | null>(null);

  useEffect(() => {
    const s = new CarthageScene(canvas.current!, onState);
    s.load(heights, [], 'heroes');
    scene.current = s;
    return () => s.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => scene.current?.setSpeed(speed), [speed]);

  useImperativeHandle(ref, () => ({
    load: (h, e, a) => scene.current?.load(h, e, a),
    play: () => scene.current?.play(),
    step: () => scene.current?.step(),
    finish: () => scene.current?.finish(),
  }), []);

  return (
    <canvas
      ref={canvas}
      className="world"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Карфаген: ряд стовпів, Еней і Микита обгороджують ділянку з двох кінців, між ними набирається вода"
    />
  );
});
