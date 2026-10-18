import { Composition, Folder, Still } from 'remotion';
import { BAR, FPS, TOTAL_FRAMES } from './timeline.mjs';
import { Trailer } from './Trailer';
import { Launch } from './Launch';
import { Cover, LaunchVertical } from './launch/Vertical';
import { TOTAL_FRAMES as LAUNCH_FRAMES } from './launch-timeline.mjs';
import { Cold, LogoHit, Story } from './scenes/Opening';
import { Heroes, MapScene, Play, Wolf, Worlds } from './scenes/Middle';
import { Abc, End, Features, Outro, Ways } from './scenes/Closing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Trailer-uk" component={Trailer} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
      <Composition id="Trailer-en" component={Trailer} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'en' as const }} />
      <Composition id="Launch-uk" component={Launch} durationInFrames={LAUNCH_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
      <Composition id="Launch-en" component={Launch} durationInFrames={LAUNCH_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'en' as const }} />
      <Folder name="Reels">
        <Composition id="Reels-uk" component={LaunchVertical} durationInFrames={LAUNCH_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Reels-en" component={LaunchVertical} durationInFrames={LAUNCH_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{ lang: 'en' as const }} />
        <Still id="Reels-cover-uk" component={Cover} width={1080} height={1920} defaultProps={{ lang: 'uk' as const }} />
        <Still id="Reels-cover-en" component={Cover} width={1080} height={1920} defaultProps={{ lang: 'en' as const }} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Cold" component={Cold} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Logo" component={LogoHit} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Story" component={Story} durationInFrames={3 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Heroes" component={Heroes} durationInFrames={4 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Play" component={Play} durationInFrames={4 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Wolf" component={Wolf} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Worlds" component={Worlds} durationInFrames={4 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Map" component={MapScene} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Abc" component={Abc} durationInFrames={3 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Ways" component={Ways} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Features" component={Features} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="Outro" component={Outro} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
        <Composition id="End" component={End} durationInFrames={2 * BAR} fps={FPS} width={1920} height={1080} defaultProps={{ lang: 'uk' as const }} />
      </Folder>
    </>
  );
};
