import type { Level, World } from '../engine/level.ts';
import { troy } from './troy.ts';
import { forest } from './forest.ts';
import { mitten } from './mitten.ts';
import { konotop } from './konotop.ts';
import { sicily } from './sicily.ts';
import { chumak } from './chumak.ts';
import { hell } from './hell.ts';
import { sea } from './sea.ts';
import { carthage } from './carthage.ts';
import { elysium } from './elysium.ts';
import { song } from './song.ts';
import { carpathians } from './carpathians.ts';
import { ramparts } from './ramparts.ts';
import { tracks, trackLevels } from './abetka.ts';

export { tracks };

export const worlds: World[] = [troy, sea, carthage, forest, mitten, konotop, sicily, chumak, hell, elysium, song, carpathians, ramparts];
export const levels: Level[] = worlds.flatMap((w) => w.levels);
export const levelById = (id: string) => levels.find((l) => l.id === id) ?? trackLevels.find((l) => l.id === id);
/** Світ кампанії або розділ «Абетки», до якого належить вправа. */
export const worldOf = (l: Level) => (l.track ? tracks[l.track][l.world] : worlds[l.world]);
