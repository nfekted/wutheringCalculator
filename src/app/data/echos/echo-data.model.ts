import { Hit, HitKind, OutroBuff, SectionKey, StatBuff } from '../character-data.model';
import { NegativeStatus } from '../../core/negative-status';

/**
 * Buffs the Outro of the character also gives (as `outro.statBuffs` / `outro.buffs`): from a Sonata bonus with enough pieces, or from
 * the main slot Echo when the rotation of the character casts its Echo Skill; `status`: only when the character inflicts it
 */
/**
 * A Sonata (or main slot Echo) bonus with a trigger (type B): after an action of the character with a hit of one of `kinds` (e.g. "after
 * releasing Intro Skill", "upon healing", "upon gaining a Shield"), with a hit that `inflicts` a Negative Status (by its `hits`; a status
 * applied by a mark counts on every damage action), or while the target has `onTarget` (team only), the character gets `buffs`.
 * `status`: only for a character that inflicts it; `characters`: only for these ids
 */
export interface SonataTrigger {
  kinds?: HitKind[];
  /** "Casting X": an action of these sections, whatever the kind of its hits (e.g. a Liberation that deals Heavy DMG) */
  sections?: (SectionKey | 'echo')[];
  /** 'any': any Negative Status (e.g. "inflicting Negative Statuses") */
  inflicts?: NegativeStatus | 'any';
  /** 'any': while the target has any Negative Status */
  onTarget?: { status: NegativeStatus | 'any'; stacks?: number };
  /** "Dashing or dodging": an action with a Dodge Counter hit (by its name) */
  dodge?: boolean;
  status?: NegativeStatus;
  buffs: StatBuff[];
  /** Also heals this % of the Max HP of the character (a healing row) */
  heal?: { name: string; value: number };
  /** Also amplifies the damage of a Negative Status (its ticks) by `value`% for `duration` seconds (team only) */
  statusAmplification?: { name: string; status: NegativeStatus; value: number; duration: number };
  /** Fires at most once every these seconds (points) */
  cooldown?: number;
  characters?: string[];
}

export interface GearOutro {
  statBuffs?: StatBuff[];
  buffs?: OutroBuff[];
  status?: NegativeStatus;
  /** Extra damage on the Outro (e.g. Midnight Veil "deal additional 480% Havoc DMG"): elemental bonus only, no buffs */
  hits?: Hit[];
}

export type EchoCost = 1 | 3 | 4;

/** Character stat an Echo attribute adds to (the keys of `Character`); 'echoHitBonus' (main slot only): Echo Skill DMG Bonus of the
 * character's own hits of kind echo, never of the Echo Skill of the Echo; 'coordinatedBonus' (main slot only): DMG Bonus of the damage
 * hits of the character's Coordinated Attack */
export type EchoStat = 'hp' | 'dmg' | 'def' | 'cChance' | 'cDmg' | 'elementalBonus' | 'basicBonus' | 'heavyBonus'
  | 'skillBonus' | 'liberationBonus' | 'healingBonus' | 'energyRegen' | 'echoHitBonus' | 'coordinatedBonus' | 'outroBonus';

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

/** An Echo the user registered: the attributes are keys, not positions in the table, so a reordered table keeps working */
export interface EchoSlot {
  echo: number;
  sonata: number;
  /** The chosen main attribute; its value comes from the table of the cost */
  main: EchoAttribute;
  subs: (EchoAttribute & { value: number })[];
}

/** An attribute a Sonata bonus adds, always active (type A); HP, ATK and DEF are a percentage */
export interface SonataStat {
  stat: EchoStat;
  value: number;
  /** Element of an elemental DMG bonus; without it, every element (e.g. "all Attribute DMG") */
  element?: string;
  /** Only counts with this final Energy Regen or more */
  minEnergyRegen?: number;
}

export interface SonataData {
  id: number;
  name: string;
  /** Bonus of each piece count (1, 2, 3 or 5); `stats` only on the ones counted in the attributes, the others are text for now */
  bonuses: { pieces: number; text: string; stats?: SonataStat[]; outro?: GearOutro; triggers?: SonataTrigger[] }[];
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
  /** The character leaves the field and becomes the Echo (e.g. "Transform into..."): its Echo Skill spends 3 points of the buffs, otherwise 0 */
  transform?: boolean;
  /** Bonus when the Echo is in the main slot, only as text for now; `character` when it is for a specific one */
  /** In the main slot; `character`: only for that character; `stats`: the always active attributes it adds (as a Sonata type A) */
  mainSlotBonus: { text: string; character?: string; stats?: SonataStat[] }[];
  /** Buffs of the Echo Skill given on the Outro (e.g. "casting Outro Skill within 15s after summoning X grants...") */
  outro?: GearOutro;
  /** Triggered buffs while this is the main slot Echo (e.g. "DMG dealt to enemies with Spectro Frazzle +100%") */
  triggers?: SonataTrigger[];
}
