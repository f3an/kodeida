import React from 'react';
import { Video } from '@remotion/media';
import { AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BAR, BEAT } from '../timeline.mjs';
import { beatPulse, clamp, IN, OUT, pop, ramp, shake } from '../lib/anim';
import { COPY, type Lang } from '../lib/copy';
import { S, Sprite, WorldArt } from '../lib/PixelCanvas';
import { BODY, C, HEAD, MONO } from '../lib/theme';
import { Bg, Burst, Chip, Screen, Words } from '../lib/ui';

type Props = { readonly lang: Lang };

const FOX_COLS: string[] = S.ALL_WORLDS.map((w: any) => w.fox).filter((c: string) => c !== 'rainbow');

const HEROES = [
  { spr: () => S.makeEnei(2, { pose: 'sabre' }), bg: ['#3d66b8', '#121f3d'], accent: C.gold, scale: 9 },
  { spr: (beat: number) => S.foxFor(S.ALL_WORLDS[beat % 15]), bg: ['#e2702b', '#4a1c06'], accent: C.ink, scale: 10 },
  { spr: () => S.makeWolf(), bg: ['#5b5468', '#16131c'], accent: '#c9b8ff', scale: 9 },
  { spr: () => S.makeSibyl(), bg: ['#4f8a6a', '#0e2218'], accent: C.gold, scale: 9 },
];

/* Герої: по такту на кожного. Спрайт підскакує на долю, у Микити щодолі нова фарба світу. */
const HeroesInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const i = Math.min(3, Math.floor(frame / BAR));
  const local = frame - i * BAR;
  const h = HEROES[i];
  const beat = Math.floor(frame / BEAT);
  const spr = i === 1 ? h.spr(beat) : h.spr(0);
  const p = pop(local, fps, 0, 12);
  const pulse = beatPulse(frame);
  const [name, role] = t.heroes[i];
  return (
    <>
      <Bg from={h.bg[0]} to={h.bg[1]} grid={0.08} speed={2} />
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(-30deg, rgba(255,255,255,.06) 0 40px, transparent 40px 120px)`,
          backgroundPosition: `${frame * 3}px 0`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 260,
          bottom: 60,
          width: 620,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(0,0,0,.28)',
          scale: `${1 - pulse * 0.08} 1`,
        }}
      />
      <div style={{ position: 'absolute', right: 570, bottom: 110, translate: '50% 0' }}>
        <Sprite
          spr={spr}
          scale={h.scale}
          style={{
            display: 'block',
            translate: `${(1 - p) * 700}px ${-pulse * 26}px`,
            scale: `${1 + pulse * 0.03} ${1 - pulse * 0.03}`,
            transformOrigin: '50% 100%',
          }}
        />
      </div>
      <div style={{ position: 'absolute', left: 110, top: 300, width: 900 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 34,
            color: h.accent,
            opacity: ramp(local, 0, 6),
            marginBottom: 20,
          }}
        >
          {`0${i + 1} / 04`}
        </div>
        <Words key={i} text={name} at={i * BAR} step={3} size={128} />
        <div
          style={{
            marginTop: 34,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.25,
            color: C.linen,
            opacity: ramp(local, 6, 10),
            translate: `${(1 - ramp(local, 6, 12)) * -80}px 0`,
          }}
        >
          {role}
        </div>
      </div>
    </>
  );
};

/* Геймплей: справжній запис гри і чотири плашки, по одній на такт. */
const PlayInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const pulse = beatPulse(frame, BAR);
  return (
    <>
      <Bg from="#25352b" to="#070b09" />
      <Screen
        style={{
          left: 640,
          top: 140,
          width: 1220,
          height: 764,
          scale: `${interpolate(frame, [0, 10], [0.85, 1], { ...clamp, easing: OUT }) + pulse * 0.01}`,
          rotate: `${interpolate(frame, [0, 10], [4, 0], clamp)}deg`,
        }}
      >
        <Video src={staticFile(`rec-play-${lang}.mp4`)} muted objectFit="cover" playbackRate={1.8} trimBefore={15} style={{ width: 1208, height: 752 }} />
      </Screen>
      <div style={{ position: 'absolute', left: 70, top: 170, width: 540, display: 'flex', flexDirection: 'column', gap: 34 }}>
        {t.play.map((s, k) => (
          <Chip
            key={k}
            at={k * BAR}
            size={38}
            bg={k === 3 ? C.red : frame >= (k + 1) * BAR ? '#2a3a30' : C.fox}
            color={k === 3 || frame >= (k + 1) * BAR ? C.linen : C.ink}
            style={{ lineHeight: 1.2, alignItems: 'flex-start' }}
          >
            <span style={{ fontFamily: MONO, opacity: 0.7 }}>{k + 1}</span>
            <span>{s}</span>
          </Chip>
        ))}
      </div>
    </>
  );
};

const fmt = (n: number, lang: Lang) => Math.round(n).toLocaleString(lang === 'uk' ? 'uk-UA' : 'en-US');

/* Вовк проти Микити: лічильники читань і вирок «у 2 500 разів менше». */
const WolfInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wolfN = interpolate(frame, [4, 62], [0, 50_000_000], { ...clamp, easing: IN });
  const foxN = interpolate(frame, [4, 22], [0, 20_000], { ...clamp, easing: OUT });
  const v = pop(frame, fps, 6 * BEAT, 8);
  const side = (n: number, label: string, spr: any, bg: string, color: string, flip: boolean) => (
    <div
      style={{
        flex: 1,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <Sprite spr={spr} scale={6} style={{ scale: flip ? '-1 1' : undefined, translate: `0 ${-beatPulse(frame) * 12}px` }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 56, color }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 92, color: C.linen, fontVariantNumeric: 'tabular-nums' }}>{fmt(n, lang)}</div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, color: C.linen, opacity: 0.7 }}>{t.reads}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ translate: shake(frame, 6 * BEAT, 30) }}>
      <AbsoluteFill style={{ flexDirection: 'row' }}>
        {side(wolfN, t.wolf, S.makeWolf(), 'linear-gradient(160deg,#3b3644,#121016)', '#c9b8ff', false)}
        {side(foxN, t.fox, S.FOX_GINGER ?? S.makeFox(C.fox), 'linear-gradient(200deg,#e2702b,#5a2306)', C.ink, true)}
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: 440,
            height: 440,
            borderRadius: 220,
            background: C.gold,
            border: `10px solid ${C.ink}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            scale: `${v}`,
            rotate: `${interpolate(v, [0, 1], [-40, -8])}deg`,
            boxShadow: '0 20px 0 rgba(0,0,0,.35)',
          }}
        >
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 104, color: C.ink, whiteSpace: 'nowrap' }}>{t.times}</div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 40, color: C.ink }}>{t.fewer}</div>
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', bottom: 60, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Chip at={7 * BEAT} bg={C.ink} color={C.linen} size={46}>
          {t.slogan}
        </Chip>
      </div>
      <Burst at={6 * BEAT} n={50} colors={[C.gold, C.fox, C.linen]} />
    </AbsoluteFill>
  );
};

/* 16 світів, по одному на долю: картка світу з гри, номер, назва, прийом. */
const WorldsInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const n = Math.min(15, Math.floor(frame / BEAT));
  const local = frame - n * BEAT;
  const w = S.ALL_WORLDS[n];
  const foxCol = w.fox === 'rainbow' ? C.gold : w.fox;
  const punch = interpolate(local, [0, 7], [1.14, 1], { ...clamp, easing: OUT });
  const slide = ramp(local, 0, 6);
  return (
    <>
      <AbsoluteFill style={{ background: '#000' }}>
        <WorldArt
          key={n}
          n={n}
          style={{ position: 'absolute', left: 0, top: -84, width: 1920, height: 1248, scale: `${punch}` }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(8,6,10,.85) 0%, rgba(8,6,10,.0) 45%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(8,6,10,.7) 0%, rgba(8,6,10,0) 22%)' }} />
      <div style={{ position: 'absolute', left: 80, top: 60, display: 'flex', alignItems: 'center', gap: 30 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: C.linen }}>{t.worldsTitle}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {S.ALL_WORLDS.map((ww: any, k: number) => (
            <div
              key={k}
              style={{
                width: 22,
                height: 22,
                background: k <= n ? (ww.fox === 'rainbow' ? C.gold : ww.fox) : 'rgba(255,255,255,.2)',
                border: '3px solid rgba(0,0,0,.5)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 80, bottom: 80, translate: `${(1 - slide) * -90}px 0`, opacity: slide }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 190,
            lineHeight: 0.9,
            color: foxCol,
            opacity: 0.88,
            textShadow: '0 8px 0 rgba(0,0,0,.55), 0 0 40px rgba(0,0,0,.45)',
          }}
        >
          {String(n).padStart(2, '0')}
        </div>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 92, color: C.linen, marginTop: 10, textShadow: '0 6px 0 rgba(0,0,0,.6)' }}>
          {t.worldNames[n]}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 80, bottom: 96, opacity: slide, translate: `${(1 - slide) * 90}px 0` }}>
        <div
          style={{
            padding: '18px 34px',
            background: foxCol,
            color: C.ink,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 48,
            borderRadius: 14,
            border: `4px solid ${C.ink}`,
          }}
        >
          {t.topics[n]}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.linen, marginTop: 14, textAlign: 'right', opacity: 0.85 }}>
          {w.task}
        </div>
      </div>
    </>
  );
};

/* Мапа: запис мапи світів і цифри, що вистрибують на долю. */
const MapInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Bg from="#1d3f66" to="#060d18" />
      <div style={{ position: 'absolute', left: 360, top: 300, width: 1200, height: 750, perspective: 1600 }}>
        <Screen
          style={{
            inset: 0,
            rotate: `x ${interpolate(frame, [0, 2 * BAR], [26, 14])}deg`,
            scale: `${interpolate(frame, [0, 12], [0.8, 1], { ...clamp, easing: OUT })}`,
          }}
        >
          <Video src={staticFile(`rec-map-${lang}.mp4`)} muted objectFit="cover" playbackRate={2.3} trimBefore={12} style={{ width: 1188, height: 738 }} />
        </Screen>
      </div>
      <div style={{ position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', gap: 90 }}>
        {t.mapStats.map(([num, label], k) => {
          const p = pop(frame, fps, k * BEAT, 9);
          return (
            <div key={k} style={{ textAlign: 'center', scale: `${p}`, opacity: Math.min(1, p * 2) }}>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 140, lineHeight: 1, color: [C.gold, C.fox, C.crystal][k] }}>{num}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 42, color: C.linen }}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 50, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Chip at={BAR} size={44} bg={C.fox}>
          {t.mapNote}
        </Chip>
      </div>
    </>
  );
};

export const Heroes = Interactive.create({ Component: HeroesInner, layout: 'absolute-fill' });
export const Play = Interactive.create({ Component: PlayInner, layout: 'absolute-fill' });
export const Wolf = Interactive.create({ Component: WolfInner, layout: 'absolute-fill' });
export const Worlds = Interactive.create({ Component: WorldsInner, layout: 'absolute-fill' });
export const MapScene = Interactive.create({ Component: MapInner, layout: 'absolute-fill' });
export { FOX_COLS };
