import React from 'react';
import { Video } from '@remotion/media';
import { AbsoluteFill, Interactive, staticFile, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BAR, BEAT } from '../timeline.mjs';
import { beatPulse, clamp, IN, OUT, pop, ramp, shake } from '../lib/anim';
import { COPY, type Lang } from '../lib/copy';
import { S, Sprite } from '../lib/PixelCanvas';
import { C, CODE, HEAD, MONO } from '../lib/theme';
import { Bg, Burst, Logo, Words } from '../lib/ui';

type Props = { readonly lang: Lang };

const LINES: [string, string][][] = [
  [['function ', CODE.keyword], ['maxArea', CODE.fn], ['(', CODE.text], ['height', CODE.prop], [': ', CODE.text], ['number', CODE.type], ['[]): ', CODE.text], ['number', CODE.type], [' {', CODE.text]],
  [['  let ', CODE.keyword], ['l = ', CODE.text], ['0', CODE.number], [', r = ', CODE.text], ['height', CODE.prop], ['.length - ', CODE.text], ['1', CODE.number], [';', CODE.text]],
  [['  while ', CODE.keyword], ['(l < r) {', CODE.text]],
  [['    enei', CODE.prop], ['.', CODE.text], ['move', CODE.fn], ['();', CODE.text]],
];

/* Холодний старт: редактор, у якому друкується справжній розв'язок, і питання. */
const ColdInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  let left = Math.floor(frame * 1.45);
  const zoom = interpolate(frame, [2 * BAR - 14, 2 * BAR], [1, 4], { ...clamp, easing: IN });
  return (
    <>
      <Bg from="#1c2620" to="#070a08" />
      <AbsoluteFill style={{ scale: `${zoom}`, transformOrigin: '50% 62%' }}>
        <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center' }}>
          <Words text={t.coldQ1} at={BEAT} size={96} style={{ justifyContent: 'center' }} />
          <Words text={t.coldQ2} at={5 * BEAT} size={96} color={C.fox} style={{ justifyContent: 'center', marginTop: 8 }} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 260,
            top: 420,
            width: 1400,
            borderRadius: 20,
            background: CODE.bg,
            border: '3px solid #2b3a31',
            boxShadow: '0 30px 80px rgba(0,0,0,.6)',
            overflow: 'hidden',
            opacity: ramp(frame, 0, 8),
            translate: `0 ${(1 - ramp(frame, 0, 14)) * 60}px`,
          }}
        >
          <div style={{ height: 56, background: '#0e1411', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 24 }}>
            {[C.red, C.gold, '#4f9d4a'].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
            <div style={{ marginLeft: 20, fontFamily: MONO, fontSize: 24, color: CODE.comment }}>dido.ts</div>
          </div>
          <div style={{ padding: '30px 40px 40px', fontFamily: MONO, fontSize: 40, lineHeight: 1.6, minHeight: 330 }}>
            {LINES.map((line, li) => (
              <div key={li} style={{ whiteSpace: 'pre', display: 'flex' }}>
                <span style={{ color: '#3d4c43', width: 60 }}>{li + 1}</span>
                {line.map(([s, col], k) => {
                  const shown = s.slice(0, Math.max(0, left));
                  left -= s.length;
                  return (
                    <span key={k} style={{ color: col }}>
                      {shown}
                    </span>
                  );
                })}
                {left <= 0 && left > -40 ? (
                  <span style={{ background: C.fox, width: 4, marginLeft: 2, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

/* Удар: розлітаються уламки, падає логотип. Далі з боків вибігають Еней і Микита. */
const LogoInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = Math.floor(interpolate(frame, [2 * BEAT, 4 * BEAT], [0, t.tagline.length], clamp));
  const e = pop(frame, fps, BAR, 12);
  const f = pop(frame, fps, BAR + 3, 12);
  const pulse = beatPulse(frame);
  return (
    <>
      <Bg from="#2a2f4a" to="#08090f" grid={0.04} />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${frame * 0.6}deg at 50% 46%, rgba(217,165,33,.10) 0deg 8deg, transparent 8deg 22deg)`,
          opacity: 0.6 + pulse * 0.4,
        }}
      />
      <AbsoluteFill style={{ translate: shake(frame, 0, 26) }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', scale: `${1 + pulse * 0.025}` }}>
          <Logo name={t.name} size={200} />
          <div
            style={{
              marginTop: 40,
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 58,
              color: C.crystal,
              minHeight: 70,
            }}
          >
            {t.tagline.slice(0, typed)}
          </div>
        </AbsoluteFill>
        <Sprite
          spr={S.makeEnei(2, { pose: 'sabre' })}
          scale={5}
          style={{ position: 'absolute', left: 70, bottom: 40, translate: `${(1 - e) * -500}px ${-pulse * 10}px` }}
        />
        <Sprite
          spr={S.FOX_GINGER ?? S.makeFox(C.fox)}
          scale={5}
          style={{ position: 'absolute', right: 80, bottom: 60, translate: `${(1 - f) * 500}px ${-pulse * 10}px`, scale: '-1 1' }}
        />
      </AbsoluteFill>
      <Burst at={0} y={500} n={60} power={1.3} />
    </>
  );
};

/* Сюжет: кадри інтро гри і три удари тексту, по одному на такт. */
const StoryInner: React.FC<Props> = ({ lang }) => {
  const t = COPY[lang];
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 3 * BAR], [1, 1.07]);
  return (
    <>
      <Bg from="#3a1e2a" to="#0b0709" />
      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 170,
          width: 1080,
          height: 675,
          perspective: 1400,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            rotate: `y ${interpolate(frame, [0, 3 * BAR], [-14, -6])}deg`,
            scale: `${push}`,
            opacity: ramp(frame, 0, 8),
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden', border: `6px solid ${C.ink}`, boxShadow: '0 40px 90px rgba(0,0,0,.6)' }}>
            <Video src={staticFile(`rec-intro-${lang}.mp4`)} muted objectFit="cover" playbackRate={2} style={{ width: 1068, height: 663 }} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 90, top: 190, width: 700, display: 'flex', flexDirection: 'column', gap: 46 }}>
        {t.story.map((line, i) => (
          <div key={i} style={{ opacity: frame >= (i + 1) * BAR ? 0.35 : 1 }}>
            <Words text={line} at={i * BAR} step={2} size={66} color={i === 2 ? C.fox : C.linen} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 90,
          bottom: 110,
          height: 8,
          width: 700 * ramp(frame, 0, 3 * BAR, OUT),
          background: C.red,
        }}
      />
    </>
  );
};

export const Cold = Interactive.create({ Component: ColdInner, layout: 'absolute-fill' });
export const LogoHit = Interactive.create({ Component: LogoInner, layout: 'absolute-fill' });
export const Story = Interactive.create({ Component: StoryInner, layout: 'absolute-fill' });
