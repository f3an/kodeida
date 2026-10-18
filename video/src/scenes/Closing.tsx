import React from 'react';
import { Video } from '@remotion/media';
import { AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BAR, BEAT } from '../timeline.mjs';
import { beatPulse, clamp, OUT, pop, ramp, shake } from '../lib/anim';
import { COPY, type Lang } from '../lib/copy';
import { S, Sprite } from '../lib/PixelCanvas';
import { BODY, C, HEAD, MONO } from '../lib/theme';
import { Bg, Burst, Chip, Logo, Screen, Words } from '../lib/ui';

type Props = { readonly lang: Lang };

/* Плитка ~330 px завширшки: кегль так, щоб найдовше слово влізло в один рядок (Unbounded ≈ 0.72 em на літеру). */
const fitTile = (text: string) => Math.min(58, Math.floor(330 / (Math.max(...text.split(' ').map((w) => w.length)) * 0.72)));

const LANGS: [string, string, string][] = [
  ['Python', '#3776AB', C.linen],
  ['JavaScript', '#F7DF1E', C.ink],
  ['TypeScript', '#3178C6', C.linen],
];

/* Абетка: питання на перший такт, далі запис Абетки і три мови. */
const AbcInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = interpolate(frame, [BAR - 8, BAR], [1, 0], clamp);
  const r = ramp(frame, BAR, 10);
  return (
    <>
      <Bg from="#f3e9d2" to="#d9c69c" grid={0.0} />
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: `radial-gradient(${C.red} 3px, transparent 3px)`,
          backgroundSize: '36px 36px',
        }}
      />
      {frame < BAR ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: q }}>
          <Words text={t.abcQ} step={BEAT / 2} size={128} color={C.ink} style={{ justifyContent: 'center', width: 1600, textAlign: 'center' }} />
        </AbsoluteFill>
      ) : (
        <>
          <Screen
            style={{
              left: 80,
              top: 170,
              width: 1060,
              height: 662,
              opacity: r,
              translate: `${(1 - r) * -200}px 0`,
              rotate: `${(1 - r) * -6}deg`,
              border: `6px solid ${C.ink}`,
            }}
          >
            <Video src={staticFile(`rec-abc-${lang}.mp4`)} muted objectFit="cover" playbackRate={1.85} style={{ width: 1048, height: 650 }} />
          </Screen>
          <div style={{ position: 'absolute', left: 1210, top: 200, width: 640 }}>
            <Words text={t.abcA} at={BAR} step={3} size={88} color={C.red} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 50 }}>
              {LANGS.map(([name, bg, fg], k) => {
                const p = pop(frame, fps, BAR + (k + 1) * BEAT, 9);
                return (
                  <div
                    key={name}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '14px 30px',
                      background: bg,
                      color: fg,
                      fontFamily: MONO,
                      fontSize: 50,
                      borderRadius: 12,
                      border: `4px solid ${C.ink}`,
                      scale: `${p}`,
                      rotate: `${(1 - p) * 20}deg`,
                    }}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 44,
                fontFamily: BODY,
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1.3,
                color: C.ink,
                opacity: ramp(frame, 2 * BAR, 10),
              }}
            >
              {t.abcNote}
            </div>
          </div>
        </>
      )}
    </>
  );
};

/* Три шляхи: картки падають на долю, наростання перед дропом. */
const WaysInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const build = interpolate(frame, [BAR, 2 * BAR], [1, 1.08], clamp);
  return (
    <>
      <Bg from="#2d4a33" to="#08100a" speed={1.5} />
      <AbsoluteFill style={{ scale: `${build}` }}>
        <div style={{ position: 'absolute', top: 110, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Words text={t.waysQ} size={104} accent={C.fox} accentFrom={1} />
        </div>
        <div style={{ position: 'absolute', top: 380, width: '100%', display: 'flex', justifyContent: 'center', gap: 50 }}>
          {t.ways.map(([icon, label, dest], k) => {
            const p = pop(frame, fps, (k + 1) * BEAT, 10);
            const lit = frame >= BAR && Math.floor((frame - BAR) / BEAT) % 3 === k;
            return (
              <div
                key={k}
                style={{
                  width: 500,
                  height: 470,
                  borderRadius: 28,
                  background: lit ? C.fox : '#f1e7d0',
                  border: `6px solid ${C.ink}`,
                  boxShadow: '0 16px 0 rgba(0,0,0,.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 22,
                  translate: `0 ${(1 - p) * 500}px`,
                  rotate: `${(1 - p) * (k - 1) * 18}deg`,
                }}
              >
                <div style={{ fontSize: 130 }}>{icon}</div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: C.ink, textAlign: 'center', padding: '0 20px' }}>
                  {label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 36, color: lit ? C.ink : C.red }}>→ {dest}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

/* Можливості: вісім плиток, по одній на вісімку. */
const FeaturesInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = [C.fox, C.blue, C.gold, C.red, '#4f9d4a', C.crystal, '#6b3fa0', C.linen];
  const pulse = beatPulse(frame);
  return (
    <AbsoluteFill style={{ translate: shake(frame, 0, 18) }}>
      <Bg from="#2a1f3d" to="#09070d" speed={2.5} />
      <div style={{ position: 'absolute', top: 90, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Words text={t.featuresTitle} size={80} step={2} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 110,
          right: 110,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 34,
        }}
      >
        {t.features.map((f, k) => {
          const p = pop(frame, fps, k * (BEAT / 2), 10);
          const dark = k === 1 || k === 3 || k === 6;
          return (
            <div
              key={k}
              style={{
                height: 300,
                borderRadius: 24,
                background: cols[k],
                border: `6px solid ${C.ink}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 30,
                textAlign: 'center',
                fontFamily: HEAD,
                fontWeight: 800,
                fontSize: fitTile(f),
                lineHeight: 1.2,
                color: dark ? C.linen : C.ink,
                scale: `${p * (1 + (frame >= BAR ? pulse * 0.03 : 0))}`,
                rotate: `${(1 - p) * (k % 2 ? 14 : -14)}deg`,
                boxShadow: '0 14px 0 rgba(0,0,0,.4)',
              }}
            >
              {f}
            </div>
          );
        })}
      </div>
      <Burst at={0} n={40} y={200} />
    </AbsoluteFill>
  );
};

const LINEUP = [
  { spr: () => S.makeSibyl(), s: 6 },
  { spr: () => S.makeEnei(2, { pose: 'akimbo' }), s: 7 },
  { spr: () => S.foxFor(S.ALL_WORLDS[15]), s: 7 },
  { spr: () => S.makeWolf(), s: 6 },
  { spr: () => S.makeDido(), s: 6 },
];

/* Фінал: усі герої в ряд, слоган. */
const OutroInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = beatPulse(frame);
  return (
    <>
      <Bg from="#1c2c66" to="#05070f" />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${-frame * 0.8}deg at 50% 120%, rgba(212,236,243,.07) 0deg 6deg, transparent 6deg 18deg)`,
        }}
      />
      <div style={{ position: 'absolute', top: 120, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Words text={t.outro} size={130} step={4} accent={C.fox} accentFrom={1} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 40,
        }}
      >
        {LINEUP.map((h, k) => {
          const p = pop(frame, fps, BEAT + k * (BEAT / 2), 11);
          const hop = Math.floor(frame / BEAT) % LINEUP.length === k ? pulse * 30 : 0;
          return (
            <Sprite
              key={k}
              spr={h.spr()}
              scale={h.s}
              style={{ translate: `0 ${(1 - p) * 600 - hop}px`, scale: k === 3 || k === 4 ? '-1 1' : undefined }}
            />
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, height: 14, background: C.gold, opacity: 0.8 }} />
    </>
  );
};

/* Кінцевий удар: логотип, заклик і адреса. */
const EndInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [2 * BAR - 26, 2 * BAR - 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Bg from="#2a2f4a" to="#06070c" grid={0.03} speed={0.3} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', translate: shake(frame, 0, 24) }}>
          <div style={{ scale: `${interpolate(frame, [0, 2 * BAR], [1, 1.06], { ...clamp, easing: OUT })}` }}>
            <Logo name={t.name} size={210} />
          </div>
          <div style={{ marginTop: 50, opacity: ramp(frame, BEAT, 10), translate: `0 ${(1 - ramp(frame, BEAT, 12)) * 40}px` }}>
            <Chip at={BEAT} size={54} bg={C.fox}>
              {t.cta} ↓
            </Chip>
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: MONO,
              fontSize: 44,
              color: C.crystal,
              opacity: ramp(frame, 2 * BEAT, 10),
            }}
          >
            f3an.github.io/kodeida
          </div>
        </AbsoluteFill>
        <Burst at={0} n={70} power={1.4} y={460} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Abc = Interactive.create({ Component: AbcInner, layout: 'absolute-fill' });
export const Ways = Interactive.create({ Component: WaysInner, layout: 'absolute-fill' });
export const Features = Interactive.create({ Component: FeaturesInner, layout: 'absolute-fill' });
export const Outro = Interactive.create({ Component: OutroInner, layout: 'absolute-fill' });
export const End = Interactive.create({ Component: EndInner, layout: 'absolute-fill' });
