import { Hit } from '../character-data.model';

export type EchoCost = 1 | 3 | 4;

/** Character stat an Echo attribute adds to (the keys of `Character`) */
export type EchoStat = 'hp' | 'dmg' | 'def' | 'cChance' | 'cDmg' | 'elementalBonus' | 'basicBonus' | 'heavyBonus'
  | 'skillBonus' | 'liberationBonus' | 'healingBonus' | 'energyRegen';

/** An attribute an Echo can have; HP, ATK and DEF are a percentage unless `flat` */
export interface EchoAttribute {
  stat: EchoStat;
  flat?: boolean;
  /** Element of an elemental DMG bonus; it only counts for a character of the same element */
  element?: string;
}

export interface EchoMainValue extends EchoAttribute {
  value: number;
}

export interface EchoSubValues extends EchoAttribute {
  /** Allowed values, from the lowest to the highest */
  values: number[];
}

export interface EchoValues {
  /** Main attributes of each cost: the fixed one and the options of the chosen one */
  main: Record<EchoCost, { fixed: EchoMainValue; options: EchoMainValue[] }>;
  subs: EchoSubValues[];
}

export interface SonataData {
  id: number;
  name: string;
  /** Bonus of each piece count (1, 2, 3 or 5), only as text for now */
  bonuses: { pieces: number; text: string }[];
  /** Ids of the characters that use this Sonata */
  characters?: string[];
}

export interface EchoData {
  id: number;
  name: string;
  cost: EchoCost;
  /** Ids of the Sonatas the Echo can have */
  sonatas: number[];
  skill: {
    text: string;
    /** Each hit is one way of casting the Echo Skill (e.g. without and with a counterattack); its parts are added up */
    hits: Hit[];
  };
  /** Buffs of the Echo Skill, only as text for now */
  buffs: string[];
  /** Bonus when the Echo is in the main slot, only as text for now; `character` when it is for a specific one */
  mainSlotBonus: { text: string; character?: string }[];
}
