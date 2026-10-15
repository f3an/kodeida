import type { Level, World } from '../engine/level.ts';
import { troy } from './troy.ts';
import { sea } from './sea.ts';
import { carthage } from './carthage.ts';

export const worlds: World[] = [troy, sea, carthage];
export const levels: Level[] = worlds.flatMap((w) => w.levels);
export const levelById = (id: string) => levels.find((l) => l.id === id);
export const worldOf = (l: Level) => worlds[l.world];
