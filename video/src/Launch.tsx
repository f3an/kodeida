import React from 'react';
import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, Track } from 'remotion';
import { BAR, BEAT } from './launch-timeline.mjs';
import type { Lang } from './lib/copy';
import { C } from './lib/theme';
import { Flash, Grade, Wipe } from './Trailer';
import { Ways } from './scenes/Closing';
import { Download, LaunchEnd, More, NewAbc, NewWorlds, Playtest, Release, Ship } from './launch/Scenes';

export type LaunchProps = { readonly lang: Lang };

/* Відео до релізу: відправка → «Вийшла» → що нового → завантаження → плейтест. */
export const Launch: React.FC<LaunchProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Track name="Scenes">
      <Ship name="Ship" from={0} durationInFrames={2 * BAR} lang={lang} />
      <Release name="Out now" from={2 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <NewAbc name="New: ABC" from={4 * BAR} durationInFrames={3 * BAR} lang={lang} />
      <NewWorlds name="+5 worlds" from={7 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <Ways name="Three ways" from={9 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <More name="Also new" from={11 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <Download name="Download" from={13 * BAR} durationInFrames={3 * BAR} lang={lang} />
      <Playtest name="Playtest" from={16 * BAR} durationInFrames={2 * BAR} lang={lang} />
      <LaunchEnd name="End" from={18 * BAR} durationInFrames={2 * BAR} lang={lang} />
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
