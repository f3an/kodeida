import React from 'react';
import { Video } from '@remotion/media';
import { AbsoluteFill, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BAR, BEAT } from '../launch-timeline.mjs';
import { beatPulse, clamp, IN, OUT, pop, ramp, shake } from '../lib/anim';
import type { Lang } from '../lib/copy';
import { S, Sprite, WorldArt } from '../lib/PixelCanvas';
import { BODY, C, CODE, HEAD, MONO } from '../lib/theme';
import { Bg, Burst, Chip, Logo, Screen, Words } from '../lib/ui';
import { LCOPY } from './copy';

type Props = { readonly lang: Lang };

/* Відправка: термінал тегає реліз, збірки під три системи вмикаються по долях. */
const ShipInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const cmd = '$ git tag v0.3.0 && git push --tags';
  const typed = Math.floor(interpolate(frame, [0, 14], [0, cmd.length], clamp));
  const zoom = interpolate(frame, [2 * BAR - 12, 2 * BAR], [1, 3.5], { ...clamp, easing: IN });
  return (
    <>
      <Bg from="#1c2620" to="#060907" />
      <AbsoluteFill style={{ scale: `${zoom}`, transformOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: 200,
            width: 1400,
            borderRadius: 20,
            background: CODE.bg,
            border: '3px solid #2b3a31',
            boxShadow: '0 30px 80px rgba(0,0,0,.6)',
            padding: '40px 50px',
            fontFamily: MONO,
            fontSize: 42,
            lineHeight: 1.7,
            color: CODE.text,
            opacity: ramp(frame, 0, 6),
          }}
        >
          <div style={{ color: CODE.fn }}>{cmd.slice(0, typed)}</div>
          {t.builds.map((b, k) => {
            const at = (k + 2) * BEAT;
            const done = frame >= at + BEAT;
            const prog = interpolate(frame, [at, at + BEAT], [0, 1], clamp);
            return (
              <div key={b} style={{ display: 'flex', gap: 24, alignItems: 'center', opacity: ramp(frame, at, 4) }}>
                <span style={{ color: done ? '#7fd17a' : CODE.keyword, width: 40 }}>{done ? '✓' : '›'}</span>
                <span style={{ width: 760 }}>{b}</span>
                <span style={{ width: 300, height: 18, background: '#26332b', borderRadius: 9, overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '100%', width: `${prog * 100}%`, background: done ? '#7fd17a' : C.fox }} />
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: 20, color: C.gold, opacity: ramp(frame, BAR + BEAT, 6) }}>
            {frame >= BAR + BEAT ? `★ ${t.published}: v0.3.0` : ''}
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

/* Удар: «Вийшла» і величезне 0.3. */
const ReleaseInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = pop(frame, fps, BEAT, 8);
  const pulse = beatPulse(frame);
  return (
    <AbsoluteFill style={{ translate: shake(frame, 0, 28) }}>
      <Bg from="#e2702b" to="#5a1f05" grid={0.08} speed={3} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 1.2}deg at 50% 55%, rgba(255,240,200,.14) 0deg 7deg, transparent 7deg 20deg)`,
          opacity: 0.6 + pulse * 0.4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 90,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: 18,
          textTransform: 'uppercase',
          color: C.ink,
          scale: `${interpolate(pop(frame, fps, 0, 9), [0, 1], [2.4, 1])}`,
          opacity: ramp(frame, 0, 3),
        }}
      >
        {t.out}
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', top: 120, scale: `${1 + pulse * 0.02}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
          <Logo name={t.name} size={150} at={4} />
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 260,
              color: C.linen,
              background: C.ink,
              padding: '0 40px',
              borderRadius: 30,
              scale: `${v}`,
              rotate: `${interpolate(v, [0, 1], [30, -4])}deg`,
              boxShadow: '0 20px 0 rgba(0,0,0,.3)',
            }}
          >
            {t.version}
          </div>
        </div>
      </AbsoluteFill>
      <Burst at={BEAT} n={60} power={1.4} colors={[C.linen, C.gold, C.ink, C.crystal]} />
    </AbsoluteFill>
  );
};

/* Абетка: бейдж «Нове», запис, три мови. */
const NewAbcInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = ramp(frame, 0, 10);
  return (
    <>
      <Bg from="#f3e9d2" to="#d9c69c" grid={0} />
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: `radial-gradient(${C.red} 3px, transparent 3px)`, backgroundSize: '36px 36px' }} />
      <Screen
        style={{
          right: 80,
          top: 190,
          width: 1060,
          height: 662,
          opacity: r,
          translate: `${(1 - r) * 200}px 0`,
          rotate: `${(1 - r) * 6}deg`,
        }}
      >
        <Video src={staticFile(`rec-abc-${lang}.mp4`)} muted objectFit="cover" playbackRate={1.85} style={{ width: 1048, height: 650 }} />
      </Screen>
      <div style={{ position: 'absolute', left: 90, top: 200, width: 660 }}>
        <Chip at={0} bg={C.red} color={C.linen} size={40}>
          ★ {t.newBadge}
        </Chip>
        <Words text={t.abcTitle} at={4} size={124} color={C.ink} style={{ marginTop: 30 }} />
        <div
          style={{
            marginTop: 26,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1.25,
            color: C.ink,
            opacity: ramp(frame, BEAT * 2, 8),
          }}
        >
          {t.abcSub}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {(
            [
              ['Python', '#3776AB', C.linen],
              ['JS', '#F7DF1E', C.ink],
              ['TS', '#3178C6', C.linen],
            ] as const
          ).map(([name, bg, fg], k) => {
            const p = pop(frame, fps, BAR + k * BEAT, 9);
            return (
              <div
                key={name}
                style={{
                  padding: '12px 26px',
                  background: bg,
                  color: fg,
                  fontFamily: MONO,
                  fontSize: 44,
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
        <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 30, color: C.red, opacity: ramp(frame, 2 * BAR, 8) }}>
          {t.abcChapter}
        </div>
      </div>
    </>
  );
};

/* П'ять нових світів, по одному на долю, потім підсумок. */
const NewWorldsInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = Math.min(4, Math.floor(frame / BEAT));
  const n = 4 + k;
  const local = frame - k * BEAT;
  const sum = frame >= 5 * BEAT;
  const w = S.ALL_WORLDS[n];
  const punch = sum ? interpolate(frame, [5 * BEAT, 2 * BAR], [1, 1.08]) : interpolate(local, [0, 7], [1.14, 1], { ...clamp, easing: OUT });
  const slide = ramp(local, 0, 6);
  const sp = pop(frame, fps, 5 * BEAT, 9);
  return (
    <>
      <AbsoluteFill style={{ background: '#000' }}>
        <WorldArt key={n} n={n} style={{ position: 'absolute', left: 0, top: -84, width: 1920, height: 1248, scale: `${punch}` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: sum ? 'rgba(8,6,10,.6)' : 'linear-gradient(0deg, rgba(8,6,10,.85) 0%, rgba(8,6,10,0) 45%)' }} />
      <div style={{ position: 'absolute', left: 80, top: 60 }}>
        <Chip at={0} bg={C.gold} size={50}>
          {t.worldsBadge}
        </Chip>
      </div>
      {sum ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 120,
              color: C.linen,
              scale: `${sp}`,
              textShadow: '0 8px 0 rgba(0,0,0,.6)',
            }}
          >
            {t.worldsSum}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
            {S.ALL_WORLDS.slice(0, 9).map((ww: any, i: number) => (
              <div
                key={i}
                style={{
                  width: 64,
                  height: 64,
                  background: ww.fox,
                  border: `5px solid ${C.ink}`,
                  scale: `${pop(frame, fps, 5 * BEAT + 4 + i, 10)}`,
                }}
              />
            ))}
          </div>
        </AbsoluteFill>
      ) : (
        <>
          <div style={{ position: 'absolute', left: 80, bottom: 80, translate: `${(1 - slide) * -90}px 0`, opacity: slide }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 190, lineHeight: 0.9, color: w.fox, opacity: 0.88, textShadow: '0 8px 0 rgba(0,0,0,.55), 0 0 40px rgba(0,0,0,.45)' }}>
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 96, color: C.linen, marginTop: 10, textShadow: '0 6px 0 rgba(0,0,0,.6)' }}>
              {t.worldNames[k]}
            </div>
          </div>
          <div style={{ position: 'absolute', right: 80, bottom: 96, opacity: slide, translate: `${(1 - slide) * 90}px 0` }}>
            <div style={{ padding: '18px 34px', background: w.fox, color: C.ink, fontFamily: HEAD, fontWeight: 700, fontSize: 46, borderRadius: 14, border: `4px solid ${C.ink}` }}>
              {t.topics[k]}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 30, color: C.linen, marginTop: 14, textAlign: 'right' }}>{w.task}</div>
          </div>
        </>
      )}
    </>
  );
};

/* А ще: чотири плитки по долях, Сивілла поруч. */
const MoreInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = [C.fox, C.blue, C.gold, '#4f9d4a'];
  const pulse = beatPulse(frame);
  return (
    <AbsoluteFill style={{ translate: shake(frame, 0, 18) }}>
      <Bg from="#2a1f3d" to="#09070d" speed={2.5} />
      <div style={{ position: 'absolute', top: 90, left: 110 }}>
        <Words text={t.moreTitle} size={100} step={3} />
      </div>
      <div style={{ position: 'absolute', top: 290, left: 110, width: 1150, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 34 }}>
        {t.more.map((m, k) => {
          const p = pop(frame, fps, k * BEAT, 10);
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
                padding: 34,
                textAlign: 'center',
                fontFamily: HEAD,
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1.2,
                color: k === 1 ? C.linen : C.ink,
                scale: `${p}`,
                rotate: `${(1 - p) * (k % 2 ? 14 : -14)}deg`,
                boxShadow: '0 14px 0 rgba(0,0,0,.4)',
              }}
            >
              {m}
            </div>
          );
        })}
      </div>
      <Sprite
        spr={S.makeSibyl()}
        scale={10}
        style={{ position: 'absolute', right: 120, bottom: 90, translate: `${(1 - pop(frame, fps, 2, 12)) * 500}px ${-pulse * 20}px` }}
      />
      <Burst at={0} n={40} y={200} />
    </AbsoluteFill>
  );
};

/* Завантаження: три системи, по картці на долю. */
const DownloadInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = beatPulse(frame);
  const icons = ['🍏', '🪟', '🐧'];
  return (
    <>
      <Bg from="#1d3f66" to="#060d18" speed={1.2} />
      <div style={{ position: 'absolute', top: 100, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Words text={t.dlTitle} size={92} step={3} />
      </div>
      <div style={{ position: 'absolute', top: 320, width: '100%', display: 'flex', justifyContent: 'center', gap: 50 }}>
        {t.platforms.map(([os, note], k) => {
          const p = pop(frame, fps, (k + 1) * BEAT, 10);
          const lit = frame >= BAR && Math.floor((frame - BAR) / BEAT) % 3 === k;
          return (
            <div
              key={os}
              style={{
                width: 500,
                height: 440,
                borderRadius: 28,
                background: lit ? C.fox : '#f1e7d0',
                border: `6px solid ${C.ink}`,
                boxShadow: '0 16px 0 rgba(0,0,0,.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                translate: `0 ${(1 - p) * 500 - (lit ? pulse * 16 : 0)}px`,
                rotate: `${(1 - p) * (k - 1) * 18}deg`,
              }}
            >
              <div style={{ fontSize: 120, lineHeight: 1, color: C.ink, fontFamily: 'system-ui' }}>{icons[k]}</div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: C.ink }}>{os}</div>
              <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 32, lineHeight: 1.2, padding: '0 30px', textAlign: 'center', color: lit ? C.ink : C.red }}>{note}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 80, width: '100%', display: 'flex', justifyContent: 'center', gap: 30 }}>
        <Chip at={2 * BAR} bg={C.gold} size={42}>
          ↻ {t.dlNote}
        </Chip>
        <Chip at={2 * BAR + BEAT} bg={C.ink} color={C.crystal} size={42} from="right">
          <span style={{ fontFamily: MONO, fontWeight: 500 }}>github.com/f3an/kodeida/releases</span>
        </Chip>
      </div>
    </>
  );
};

/* Плейтест: брейкдаун, Микита показує пальцем. */
const PlaytestInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const build = interpolate(frame, [BAR, 2 * BAR], [1, 1.1], { ...clamp, easing: IN });
  return (
    <>
      <Bg from="#2d4a33" to="#07100a" />
      <AbsoluteFill style={{ scale: `${build}` }}>
        <Sprite
          spr={S.makeFox(C.fox)}
          scale={11}
          style={{ position: 'absolute', left: 140, bottom: 110, translate: `${(1 - pop(frame, fps, 0, 12)) * -500}px ${-beatPulse(frame, BEAT * 2) * 16}px` }}
        />
        <div style={{ position: 'absolute', left: 760, top: 260, width: 1060 }}>
          <Words text={t.ptTitle} size={104} step={3} accent={C.fox} accentFrom={1} />
          <div
            style={{
              marginTop: 40,
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 50,
              lineHeight: 1.3,
              color: C.linen,
              opacity: ramp(frame, BAR, 10),
              translate: `0 ${(1 - ramp(frame, BAR, 12)) * 40}px`,
            }}
          >
            {t.ptSub}
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

/* Кінець: логотип, версія, адреса, затемнення. */
const LaunchEndInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [2 * BAR - 26, 2 * BAR - 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <Bg from="#2a2f4a" to="#06070c" grid={0.03} speed={0.3} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', translate: shake(frame, 0, 24) }}>
          <Logo name={t.name} size={200} />
          <div style={{ marginTop: 40 }}>
            <Chip at={BEAT} size={54} bg={C.fox}>
              {t.endLine}
            </Chip>
          </div>
          <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 44, color: C.crystal, opacity: ramp(frame, 2 * BEAT, 10) }}>
            f3an.github.io/kodeida
          </div>
        </AbsoluteFill>
        <Burst at={0} n={70} power={1.4} y={460} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ship = Interactive.create({ Component: ShipInner, layout: 'absolute-fill' });
export const Release = Interactive.create({ Component: ReleaseInner, layout: 'absolute-fill' });
export const NewAbc = Interactive.create({ Component: NewAbcInner, layout: 'absolute-fill' });
export const NewWorlds = Interactive.create({ Component: NewWorldsInner, layout: 'absolute-fill' });
export const More = Interactive.create({ Component: MoreInner, layout: 'absolute-fill' });
export const Download = Interactive.create({ Component: DownloadInner, layout: 'absolute-fill' });
export const Playtest = Interactive.create({ Component: PlaytestInner, layout: 'absolute-fill' });
export const LaunchEnd = Interactive.create({ Component: LaunchEndInner, layout: 'absolute-fill' });
