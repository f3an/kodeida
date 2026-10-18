// Піксельний рушій гри (app/src/world/sprites.js) — нетипізований JS.
declare module '*/world/sprites.js' {
  const anything: any;
  export = anything;
}
declare module '*/timeline.mjs' {
  export const BPM: number;
  export const FPS: number;
  export const BEAT: number;
  export const BAR: number;
  export const BARS: number;
  export const TOTAL_FRAMES: number;
  export type Section = { id: string; start: number; bars: number };
  export const SECTIONS: Section[];
  export const sec: (id: string) => Section;
}
declare module '*/launch-timeline.mjs' {
  export const BPM: number;
  export const FPS: number;
  export const BEAT: number;
  export const BAR: number;
  export const BARS: number;
  export const TOTAL_FRAMES: number;
}
