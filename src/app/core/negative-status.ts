import { statusTickValue } from './damage-engine';

/** A Negative Status on the target: it deals damage on its own, every `interval` points while it lasts */
export type NegativeStatus = 'aeroErosion' | 'spectroFrazzle' | 'electroFlare' | 'fusionBurst';

export interface NegativeStatusData {
  name: string;
  /** Max stacks, before anything raises it */
  max: number;
  /** In points; shared by every stack, a new stack starts it over. Without it, each tick takes 1 stack and it ends at 0 */
  duration?: number;
  /** Points between two ticks */
  interval: number;
  /** Multiplier of 1, 2, 3... stacks; each stack over the list adds `extraPerStack` (with `extraGrowth`, the last step plus that much more each time) */
  stacks: number[];
  extraPerStack: number;
  extraGrowth?: number;
  /** No ticks: the stacks stay until a hit takes them to the max, then 1 hit with the max stacks and they are gone (the others are lost) */
  burstAtMax?: boolean;
  /** Each tick takes half of the stacks (rounded down) */
  halvesOnTick?: boolean;
  /** Stacks applied over the max go to this one, up to `max` (raised as the status): each one adds `perStack`% to the next tick, which takes them all */
  overflow?: { name: string; max: number; perStack: number };
}

export const NEGATIVE_STATUS: Record<NegativeStatus, NegativeStatusData> = {
  aeroErosion: { name: 'Aero Erosion', max: 3, duration: 15, interval: 3, stacks: [0.36, 0.899, 1.799, 2.698, 3.597, 4.497], extraPerStack: 0.8995 },
  spectroFrazzle: {
    name: 'Spectro Frazzle', max: 10, interval: 3,
    stacks: [0.24, 0.4355, 0.6298, 0.8251, 1.02, 1.216, 1.409, 1.605, 1.8, 1.995], extraPerStack: 0.195,
  },
  // Not official yet: 1 stack x1, +0.5 for each other one
  electroFlare: {
    name: 'Electro Flare', max: 10, duration: 10, interval: 3, stacks: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5], extraPerStack: 0.5,
    halvesOnTick: true, overflow: { name: 'Electro Rage', max: 10, perStack: 10 },
  },
  // Not official yet: each step 2.5 more than the one before
  fusionBurst: {
    name: 'Fusion Burst', max: 10, interval: 0, stacks: [2, 5, 10, 17.5, 27.5, 40, 55, 72.5, 92.5, 115, 140, 167.5, 197.5], extraPerStack: 0, extraGrowth: 2.5,
    burstAtMax: true,
  },
};

/** Multiplier of a character level 90 (the level is fixed) */
const LEVEL_MULTIPLIER = 3674;
const STATUS_BASE = 1.25078;

/**
 * Value of one tick with that many stacks. It ignores the attributes of the character (ATK, crit, DMG Bonus);
 * only the enemy mitigation applies (nothing amplifies a status yet)
 */
export function statusTick(status: NegativeStatus, stacks: number, overflow = 0): number {
  const data = NEGATIVE_STATUS[status];
  const listed = Math.min(stacks, data.stacks.length);
  let multiplier = data.stacks[listed - 1] + Math.max(0, stacks - data.stacks.length) * data.extraPerStack;
  if (data.extraGrowth) {
    let step = data.stacks[listed - 1] - data.stacks[listed - 2];
    for (let n = listed; n < stacks; n++) multiplier += (step += data.extraGrowth);
  }
  return statusTickValue(LEVEL_MULTIPLIER * STATUS_BASE * multiplier * (1 + overflow * (data.overflow?.perStack ?? 0) / 100));
}
