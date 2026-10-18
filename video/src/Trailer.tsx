import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, interpolate, Sequence, staticFile, Track, useCurrentFrame } from 'remotion';
import { BAR, BEAT } from './timeline.mjs';
import { clamp } from './lib/anim';
import type { Lang } from './lib/copy';
import { C } from './lib/theme';
import { Cold, LogoHit, Story } from './scenes/Opening';
import { Heroes, MapScene, Play, Wolf, Worlds } from './scenes/Middle';
import { Abc, End, Features, Outro, Ways } from './scenes/Closing';

export type TrailerProps = { readonly lang: Lang };

/** Білий спалах на ударі. */
export const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: '#fff', opacity: interpolate(frame, [0, 7], [0.9, 0], clamp) }} />;
};

/** Косий мазок кольору через склейку: 10 кадрів, склейка посередині. */
export const Wipe: React.FC<{ readonly color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 10], [-140, 140], clamp);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: `${x}%`,
          width: '70%',
          height: '200%',
          rotate: '18deg',
          background: `linear-gradient(90deg, transparent, ${color} 18%, ${color} 82%, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Легка віньєтка й зерно поверх усього. */
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)' }} />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0 2px, transparent 2px 4px)',
          backgroundPosition: `0 ${frame % 4}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Trailer: React.FC<TrailerProps> = ({ lang }) => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Track name="Scenes">
        <Cold name="Cold open" from={0} durationInFrames={2 * BAR} lang={lang} />
        <LogoHit name="Logo" from={2 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <Story name="Story" from={4 * BAR} durationInFrames={3 * BAR} lang={lang} />
        <Heroes name="Heroes" from={7 * BAR} durationInFrames={4 * BAR} lang={lang} />
        <Play name="Gameplay" from={11 * BAR} durationInFrames={4 * BAR} lang={lang} />
        <Wolf name="Wolf vs Fox" from={15 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <Worlds name="16 worlds" from={17 * BAR} durationInFrames={4 * BAR} lang={lang} />
        <MapScene name="Map" from={21 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <Abc name="ABC" from={23 * BAR} durationInFrames={3 * BAR} lang={lang} />
        <Ways name="Three ways" from={26 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <Features name="Features" from={28 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <Outro name="Outro" from={30 * BAR} durationInFrames={2 * BAR} lang={lang} />
        <End name="End" from={32 * BAR} durationInFrames={2 * BAR} lang={lang} />
      </Track>

      <Track name="Transitions">
        <Sequence name="Flash · logo" from={2 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
        <Sequence name="Wipe · story" from={4 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.red} /></Sequence>
        <Sequence name="Wipe · heroes" from={7 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.blue} /></Sequence>
        <Sequence name="Wipe · hero 2" from={8 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.fox} /></Sequence>
        <Sequence name="Wipe · hero 3" from={9 * BAR - 5} durationInFrames={10} layout="none"><Wipe color="#5b5468" /></Sequence>
        <Sequence name="Wipe · hero 4" from={10 * BAR - 5} durationInFrames={10} layout="none"><Wipe color="#4f8a6a" /></Sequence>
        <Sequence name="Wipe · play" from={11 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.fox} /></Sequence>
        <Sequence name="Wipe · wolf" from={15 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.ink} /></Sequence>
        <Sequence name="Flash · worlds" from={17 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
        <Sequence name="Wipe · map" from={21 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.blue} /></Sequence>
        <Sequence name="Wipe · abc" from={23 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.linen} /></Sequence>
        <Sequence name="Wipe · ways" from={26 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.fox} /></Sequence>
        <Sequence name="Flash · features" from={28 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
        <Sequence name="Wipe · outro" from={30 * BAR - 5} durationInFrames={10} layout="none"><Wipe color={C.gold} /></Sequence>
        <Sequence name="Flash · end" from={32 * BAR} durationInFrames={8} layout="none"><Flash /></Sequence>
      </Track>

      <Grade />

      <Audio name="Music" src={staticFile('music.wav')} />
      <Track name="SFX">
        <Audio name="Whoosh · story" src={staticFile('whoosh.wav')} from={4 * BAR - 3} volume={0.6} />
        <Audio name="Whoosh · heroes" src={staticFile('whoosh.wav')} from={7 * BAR - 3} volume={0.6} />
        <Audio name="Whip · play" src={staticFile('whip.wav')} from={11 * BAR - 2} volume={0.5} />
        <Audio name="Ding · 2500" src={staticFile('ding.wav')} from={15 * BAR + 6 * BEAT} volume={0.55} />
        <Audio name="Whoosh · map" src={staticFile('whoosh.wav')} from={21 * BAR - 3} volume={0.6} />
        <Audio name="Page turn · abc" src={staticFile('page-turn.wav')} from={24 * BAR - 2} volume={0.7} />
        <Audio name="Whoosh · ways" src={staticFile('whoosh.wav')} from={26 * BAR - 3} volume={0.6} />
        <Audio name="Whoosh · outro" src={staticFile('whoosh.wav')} from={30 * BAR - 3} volume={0.6} />
      </Track>
      
    </AbsoluteFill>
  );
};
