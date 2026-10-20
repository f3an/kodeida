import React from 'react';
import { Audio, Video } from '@remotion/media';
import { AbsoluteFill, Interactive, interpolate, Sequence, staticFile, Track, useCurrentFrame, useVideoConfig } from 'remotion';
import { BAR, BEAT } from '../launch-timeline.mjs';
import { beatPulse, clamp, IN, OUT, pop, ramp, shake } from '../lib/anim';
import { COPY, type Lang } from '../lib/copy';
import { art, S, Sprite, WorldArt } from '../lib/PixelCanvas';
import { BODY, C, CODE, HEAD, MONO } from '../lib/theme';
import { Bg, Burst, Chip, Logo, Screen, Words } from '../lib/ui';
import { Flash, Grade, Wipe } from '../Trailer';
import { LCOPY } from './copy';

/* Вертикальна версія відео до релізу (1080×1920) для Reels, TikTok і Shorts.
   Безпечна зона: зверху 250 px, знизу 400 px (підпис і кнопки), праворуч кнопки — тримаємо текст у x 60…960.
   Обкладинку Instagram у сітці обрізає до центрального 3:4 (y 240…1680), тож головне — там. */

type Props = { readonly lang: Lang };

const W = 1080;
const PAD = 60;
const CW = W - PAD * 2 - 60; // ширина контенту з запасом під праві кнопки

const Center: React.FC<{ readonly top: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  top,
  children,
  style,
}) => (
  <div style={{ position: 'absolute', top, left: PAD, width: W - PAD * 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', ...style }}>
    {children}
  </div>
);

/* Обкладинка: статична, без анімацій — це перший кадр відео і окремий PNG. */
export const CoverInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  return (
    <AbsoluteFill>
      <Bg from="#e2702b" to="#4a1804" grid={0.08} speed={0} />
      <AbsoluteFill
        style={{ background: 'repeating-conic-gradient(from 0deg at 50% 52%, rgba(255,240,200,.16) 0deg 7deg, transparent 7deg 20deg)' }}
      />
      <Center top={290}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 110, letterSpacing: 14, textTransform: 'uppercase', color: C.ink }}>{t.out}</div>
      </Center>
      <Center top={450}>
        <Logo name={t.name} size={120} at={-200} />
      </Center>
      <Center top={690}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 330,
            lineHeight: 1.1,
            color: C.linen,
            background: C.ink,
            padding: '0 50px',
            borderRadius: 36,
            rotate: '-4deg',
            boxShadow: '0 22px 0 rgba(0,0,0,.3)',
          }}
        >
          {t.version}
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 1110, left: 0, width: W, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 30 }}>
        <Sprite spr={art('enei/static-SE')} scale={4} />
        <Sprite spr={art('fox/static-SW')} scale={4} style={{ scale: '-1 1' }} />
      </div>
      <Center top={1420} style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
        <div style={{ padding: '14px 28px', background: C.ink, color: C.linen, fontFamily: HEAD, fontWeight: 700, fontSize: 40, borderRadius: 14 }}>
          ★ {t.abcTitle}
        </div>
        <div style={{ padding: '14px 28px', background: C.gold, color: C.ink, fontFamily: HEAD, fontWeight: 700, fontSize: 40, borderRadius: 14, border: `4px solid ${C.ink}` }}>
          {t.worldsBadge}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

const VShipInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const cmd = `$ git tag v${t.version}.0`;
  const cmd2 = '$ git push --tags';
  const typed = Math.floor(interpolate(frame, [0, 16], [0, cmd.length + cmd2.length], clamp));
  const zoom = interpolate(frame, [2 * BAR - 12, 2 * BAR], [1, 3.5], { ...clamp, easing: IN });
  return (
    <>
      <Bg from="#1c2620" to="#060907" />
      <AbsoluteFill style={{ scale: `${zoom}` }}>
        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: 560,
            width: W - PAD * 2,
            borderRadius: 24,
            background: CODE.bg,
            border: '3px solid #2b3a31',
            boxShadow: '0 30px 80px rgba(0,0,0,.6)',
            padding: '44px 44px',
            fontFamily: MONO,
            fontSize: 40,
            lineHeight: 1.8,
            color: CODE.text,
          }}
        >
          <div style={{ color: CODE.fn }}>{cmd.slice(0, typed)}</div>
          <div style={{ color: CODE.fn, minHeight: 72 }}>{cmd2.slice(0, Math.max(0, typed - cmd.length))}</div>
          {t.builds.map((b, k) => {
            const at = (k + 2) * BEAT;
            const done = frame >= at + BEAT;
            const prog = interpolate(frame, [at, at + BEAT], [0, 1], clamp);
            return (
              <div key={b} style={{ opacity: ramp(frame, at, 4), marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ color: done ? '#7fd17a' : CODE.keyword }}>{done ? '✓' : '›'}</span>
                  <span style={{ fontSize: 34 }}>{b}</span>
                </div>
                <div style={{ height: 14, background: '#26332b', borderRadius: 7, overflow: 'hidden', marginLeft: 48 }}>
                  <div style={{ height: '100%', width: `${prog * 100}%`, background: done ? '#7fd17a' : C.fox }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 26, color: C.gold, fontSize: 38, minHeight: 68 }}>{frame >= BAR + BEAT ? `★ ${t.published}` : ''}</div>
        </div>
      </AbsoluteFill>
    </>
  );
};

const VReleaseInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = pop(frame, fps, BEAT, 8);
  const pulse = beatPulse(frame);
  return (
    <AbsoluteFill style={{ translate: shake(frame, 0, 28) }}>
      <Bg from="#e2702b" to="#4a1804" grid={0.08} speed={3} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 1.2}deg at 50% 52%, rgba(255,240,200,.16) 0deg 7deg, transparent 7deg 20deg)`,
          opacity: 0.6 + pulse * 0.4,
        }}
      />
      <Center top={290}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 110,
            letterSpacing: 14,
            textTransform: 'uppercase',
            color: C.ink,
            scale: `${interpolate(pop(frame, fps, 0, 9), [0, 1], [2.4, 1])}`,
            opacity: ramp(frame, 0, 3),
          }}
        >
          {t.out}
        </div>
      </Center>
      <Center top={450}>
        <Logo name={t.name} size={120} at={4} />
      </Center>
      <Center top={690} style={{ scale: `${1 + pulse * 0.02}` }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 330,
            lineHeight: 1.1,
            color: C.linen,
            background: C.ink,
            padding: '0 50px',
            borderRadius: 36,
            scale: `${v}`,
            rotate: `${interpolate(v, [0, 1], [30, -4])}deg`,
            boxShadow: '0 22px 0 rgba(0,0,0,.3)',
          }}
        >
          {t.version}
        </div>
      </Center>
      <div style={{ position: 'absolute', top: 1200, left: 0, width: W, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 30 }}>
        <Sprite spr={art('enei/static-SE')} scale={5} style={{ translate: `0 ${(1 - pop(frame, fps, BAR, 12)) * 700 - pulse * 14}px` }} />
        <Sprite spr={art('fox/static-SW')} scale={5} style={{ scale: '-1 1', translate: `0 ${(1 - pop(frame, fps, BAR + 3, 12)) * 700 - pulse * 14}px` }} />
      </div>
      <Burst at={BEAT} x={540} y={900} n={60} power={1.3} colors={[C.linen, C.gold, C.ink, C.crystal]} />
    </AbsoluteFill>
  );
};

const VAbcInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = ramp(frame, 0, 10);
  return (
    <>
      <Bg from="#f3e9d2" to="#d9c69c" grid={0} />
      <AbsoluteFill style={{ opacity: 0.12, backgroundImage: `radial-gradient(${C.red} 3px, transparent 3px)`, backgroundSize: '36px 36px' }} />
      <Center top={260}>
        <Chip at={0} bg={C.red} color={C.linen} size={40}>
          ★ {t.newBadge}
        </Chip>
        <Words text={t.abcTitle} at={4} size={150} color={C.ink} style={{ marginTop: 24, justifyContent: 'center' }} />
        <div style={{ marginTop: 16, fontFamily: BODY, fontWeight: 800, fontSize: 44, lineHeight: 1.25, color: C.ink, opacity: ramp(frame, BEAT * 2, 8), width: CW }}>
          {t.abcSub}
        </div>
      </Center>
      <Screen
        style={{
          left: PAD,
          top: 780,
          width: W - PAD * 2,
          height: 600,
          opacity: r,
          translate: `0 ${(1 - r) * 200}px`,
          rotate: `${(1 - r) * 5}deg`,
        }}
      >
        <Video src={staticFile(`rec-abc-${lang}.mp4`)} muted objectFit="cover" playbackRate={1.85} style={{ width: 948, height: 588 }} />
      </Screen>
      <Center top={1410} style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
        {(
          [
            ['Python', '#3776AB', C.linen],
            ['JavaScript', '#F7DF1E', C.ink],
            ['TypeScript', '#3178C6', C.linen],
          ] as const
        ).map(([name, bg, fg], k) => {
          const p = pop(frame, fps, BAR + k * BEAT, 9);
          return (
            <div
              key={name}
              style={{ padding: '10px 20px', background: bg, color: fg, fontFamily: MONO, fontSize: 36, borderRadius: 12, border: `4px solid ${C.ink}`, scale: `${p}`, rotate: `${(1 - p) * 20}deg` }}
            >
              {name}
            </div>
          );
        })}
      </Center>
    </>
  );
};

const VWorldsInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = Math.min(4, Math.floor(frame / BEAT));
  const n = 4 + k;
  const local = frame - k * BEAT;
  const sum = frame >= 5 * BEAT;
  const w = S.ALL_WORLDS[n];
  const punch = sum ? 1 : interpolate(local, [0, 7], [1.12, 1], { ...clamp, easing: OUT });
  const slide = ramp(local, 0, 6);
  const sp = pop(frame, fps, 5 * BEAT, 9);
  return (
    <>
      <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
        <WorldArt key={`bg${n}`} n={n} style={{ position: 'absolute', left: -1000, top: 0, width: 3080, height: 2002, filter: 'blur(14px) brightness(.45)' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, top: 640, width: W, height: 702, overflow: 'hidden', borderTop: `6px solid ${C.ink}`, borderBottom: `6px solid ${C.ink}` }}>
        <WorldArt key={n} n={n} style={{ width: W, height: 702, scale: `${punch}` }} />
      </div>
      <Center top={280}>
        <Chip at={0} bg={C.gold} size={54}>
          {t.worldsBadge}
        </Chip>
      </Center>
      {sum ? (
        <Center top={400}>
          <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 76, lineHeight: 1.15, color: C.linen, scale: `${sp}`, width: CW }}>{t.worldsSum}</div>
        </Center>
      ) : (
        <>
          <Center top={420} style={{ opacity: slide, translate: `${(1 - slide) * -90}px 0` }}>
            <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 84, color: C.linen, textShadow: '0 6px 0 rgba(0,0,0,.6)', lineHeight: 1.1 }}>
              <span style={{ color: w.fox, marginRight: 24 }}>{String(n).padStart(2, '0')}</span>
              {t.worldNames[k]}
            </div>
          </Center>
          <Center top={1390} style={{ opacity: slide, translate: `${(1 - slide) * 90}px 0` }}>
            <div style={{ padding: '16px 30px', background: w.fox, color: C.ink, fontFamily: HEAD, fontWeight: 700, fontSize: 48, borderRadius: 14, border: `4px solid ${C.ink}` }}>
              {t.topics[k]}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 32, color: C.linen, marginTop: 16 }}>{w.task}</div>
          </Center>
        </>
      )}
    </>
  );
};

const VWaysInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const build = interpolate(frame, [BAR, 2 * BAR], [1, 1.06], clamp);
  return (
    <>
      <Bg from="#2d4a33" to="#08100a" speed={1.5} />
      <AbsoluteFill style={{ scale: `${build}` }}>
        <Center top={280}>
          <Words text={t.waysQ} size={86} accent={C.fox} accentFrom={1} style={{ justifyContent: 'center', width: CW }} />
        </Center>
        <div style={{ position: 'absolute', top: 600, left: PAD, width: W - PAD * 2, display: 'flex', flexDirection: 'column', gap: 36 }}>
          {t.ways.map(([icon, label, dest], k) => {
            const p = pop(frame, fps, (k + 1) * BEAT, 10);
            const lit = frame >= BAR && Math.floor((frame - BAR) / BEAT) % 3 === k;
            return (
              <div
                key={k}
                style={{
                  height: 250,
                  borderRadius: 28,
                  background: lit ? C.fox : '#f1e7d0',
                  border: `6px solid ${C.ink}`,
                  boxShadow: '0 14px 0 rgba(0,0,0,.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 36,
                  padding: '0 44px',
                  translate: `${(1 - p) * (k % 2 ? 1100 : -1100)}px 0`,
                }}
              >
                <div style={{ fontSize: 120 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 52, color: C.ink, lineHeight: 1.1 }}>{label}</div>
                  <div style={{ fontFamily: MONO, fontSize: 40, color: lit ? C.ink : C.red, marginTop: 10 }}>→ {dest}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

const VMoreInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = [C.fox, C.blue, C.gold, '#4f9d4a'];
  return (
    <AbsoluteFill style={{ translate: shake(frame, 0, 18) }}>
      <Bg from="#2a1f3d" to="#09070d" speed={2.5} />
      <Center top={280}>
        <Words text={t.moreTitle} size={110} step={3} style={{ justifyContent: 'center' }} />
      </Center>
      <div style={{ position: 'absolute', top: 560, left: PAD, width: W - PAD * 2, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 30 }}>
        {t.more.map((m, k) => {
          const p = pop(frame, fps, k * BEAT, 10);
          return (
            <div
              key={k}
              style={{
                height: 400,
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
                fontSize: 46,
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
      <Burst at={0} x={540} y={500} n={40} />
    </AbsoluteFill>
  );
};

const VDownloadInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = beatPulse(frame);
  const icons = ['🍏', '🪟', '🐧'];
  return (
    <>
      <Bg from="#1d3f66" to="#060d18" speed={1.2} />
      <Center top={270}>
        <Words text={t.dlTitle} size={92} step={3} style={{ justifyContent: 'center', width: CW }} />
      </Center>
      <div style={{ position: 'absolute', top: 600, left: PAD, width: W - PAD * 2, display: 'flex', flexDirection: 'column', gap: 30 }}>
        {t.platforms.map(([os, note], k) => {
          const p = pop(frame, fps, (k + 1) * BEAT, 10);
          const lit = frame >= BAR && Math.floor((frame - BAR) / BEAT) % 3 === k;
          return (
            <div
              key={os}
              style={{
                height: 210,
                borderRadius: 28,
                background: lit ? C.fox : '#f1e7d0',
                border: `6px solid ${C.ink}`,
                boxShadow: '0 14px 0 rgba(0,0,0,.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 36,
                padding: '0 44px',
                translate: `${(1 - p) * (k % 2 ? 1100 : -1100)}px ${lit ? -pulse * 12 : 0}px`,
              }}
            >
              <div style={{ fontSize: 100 }}>{icons[k]}</div>
              <div>
                <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 64, color: C.ink, lineHeight: 1.1 }}>{os}</div>
                <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 36, color: lit ? C.ink : C.red }}>{note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Center top={1330} style={{ gap: 20 }}>
        <Chip at={2 * BAR} bg={C.gold} size={42}>
          ↻ {t.dlNote}
        </Chip>
        <Chip at={2 * BAR + BEAT} bg={C.ink} color={C.crystal} size={34} from="right">
          <span style={{ fontFamily: MONO, fontWeight: 500 }}>github.com/f3an/kodeida</span>
        </Chip>
      </Center>
    </>
  );
};

const VPlaytestInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const build = interpolate(frame, [BAR, 2 * BAR], [1, 1.1], { ...clamp, easing: IN });
  return (
    <>
      <Bg from="#2d4a33" to="#07100a" />
      <AbsoluteFill style={{ scale: `${build}` }}>
        <Center top={280}>
          <Words text={t.ptTitle} size={100} step={3} accent={C.fox} accentFrom={1} style={{ justifyContent: 'center', width: CW }} />
        </Center>
        <div style={{ position: 'absolute', top: 640, width: W, display: 'flex', justifyContent: 'center' }}>
          <Sprite spr={art('fox/static-SW')} scale={10} style={{ translate: `0 ${(1 - pop(frame, fps, 0, 12)) * 900 - beatPulse(frame, BEAT * 2) * 16}px` }} />
        </div>
        <Center top={1290}>
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.3,
              color: C.linen,
              width: CW,
              opacity: ramp(frame, BAR, 10),
              translate: `0 ${(1 - ramp(frame, BAR, 12)) * 40}px`,
            }}
          >
            {t.ptSub}
          </div>
        </Center>
      </AbsoluteFill>
    </>
  );
};

const VEndInner: React.FC<Props> = ({ lang }) => {
  const t = LCOPY[lang];
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [2 * BAR - 26, 2 * BAR - 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: fade, translate: shake(frame, 0, 24) }}>
        <Bg from="#2a2f4a" to="#06070c" grid={0.03} speed={0.3} />
        <Center top={700}>
          <Logo name={t.name} size={130} />
          <div style={{ marginTop: 50 }}>
            <Chip at={BEAT} size={50} bg={C.fox}>
              {t.endLine}
            </Chip>
          </div>
          <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 40, color: C.crystal, opacity: ramp(frame, 2 * BEAT, 10) }}>f3an.github.io/kodeida</div>
        </Center>
        <Burst at={0} x={540} y={800} n={70} power={1.3} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Cover = Interactive.create({ Component: CoverInner, layout: 'absolute-fill' });
const VShip = Interactive.create({ Component: VShipInner, layout: 'absolute-fill' });
const VRelease = Interactive.create({ Component: VReleaseInner, layout: 'absolute-fill' });
const VAbc = Interactive.create({ Component: VAbcInner, layout: 'absolute-fill' });
const VWorlds = Interactive.create({ Component: VWorldsInner, layout: 'absolute-fill' });
const VWays = Interactive.create({ Component: VWaysInner, layout: 'absolute-fill' });
const VMore = Interactive.create({ Component: VMoreInner, layout: 'absolute-fill' });
const VDownload = Interactive.create({ Component: VDownloadInner, layout: 'absolute-fill' });
const VPlaytest = Interactive.create({ Component: VPlaytestInner, layout: 'absolute-fill' });
const VEnd = Interactive.create({ Component: VEndInner, layout: 'absolute-fill' });

export const LaunchVertical: React.FC<Props> = ({ lang }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Track name="Scenes">
      <VShip name="Ship" from={0} durationInFrames={2 * BAR} lang={lang} />
      <VRelease name="Out now" from={2 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <VAbc name="New: ABC" from={4 * BAR} durationInFrames={3 * BAR} lang={lang} />
      <VWorlds name="+5 worlds" from={7 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <VWays name="Three ways" from={9 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <VMore name="Also new" from={11 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <VDownload name="Download" from={13 * BAR} durationInFrames={3 * BAR} lang={lang} />
      <VPlaytest name="Playtest" from={16 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <VEnd name="End" from={18 * BAR} durationInFrames={2 * BAR} lang={lang} />
    </Track>

    <Track name="Transitions">
      <Sequence name="Flash · out now" from={2 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
      <Sequence name="Wipe · abc" from={4 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.linen} /></Sequence>
      <Sequence name="Flash · worlds" from={7 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
      <Sequence name="Wipe · ways" from={9 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.fox} /></Sequence>
      <Sequence name="Flash · more" from={11 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
      <Sequence name="Wipe · download" from={13 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.blue} /></Sequence>
      <Sequence name="Wipe · playtest" from={16 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.ink} /></Sequence>
      <Sequence name="Flash · end" from={18 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
    </Track>

    <Grade />

    {/* Перший кадр — обкладинка: її беруть превʼю Reels, TikTok і Shorts, коли обкладинку не задано вручну. */}
    <Sequence name="Cover frame" from={0} durationInFrames={1} layout="none">
      <Cover lang={lang} />
    </Sequence>

    <Audio name="Music" src={staticFile('music-launch.wav')} />
    <Track name="SFX">
      <Audio name="Click · enter" src={staticFile('mouse-click.wav')} from={15} volume={0.6} />
      <Audio name="Ding · published" src={staticFile('ding.wav')} from={BAR + BEAT} volume={0.45} />
      <Audio name="Whoosh · abc" src={staticFile('whoosh.wav')} from={4 * BAR - 3} volume={0.6} />
      <Audio name="Whoosh · ways" src={staticFile('whoosh.wav')} from={9 * BAR - 3} volume={0.6} />
      <Audio name="Whoosh · download" src={staticFile('whoosh.wav')} from={13 * BAR - 3} volume={0.6} />
      <Audio name="Whoosh · playtest" src={staticFile('whoosh.wav')} from={16 * BAR - 3} volume={0.6} />
    </Track>
  </AbsoluteFill>
);
