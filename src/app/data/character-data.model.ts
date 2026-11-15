import { EchoAttribute, EchoCost } from './echos/echo-data.model';

export type SectionKey = 'basic' | 'skill' | 'liberation' | 'intro' | 'outro' | 'forte';

/** What a hit is; decides which damage bonus applies to it */
export type HitKind = 'basic' | 'heavy' | 'skill' | 'liberation' | 'intro' | 'outro' | 'echo' | 'tune' | 'heal' | 'shield';

/** What a part of a hit is based on: a percentage of the character's ATK, HP or DEF, a flat value, or a value per 1% of Energy Regen */
export type PartStat = 'atk' | 'hp' | 'def' | 'flat' | 'er';

export interface HitPart {
  stat: PartStat;
  /** One value per skill level (percent for atk/hp/def, the value of each 1% for er); a single value when the skill has no levels */
  values: number[];
  /** How many times the part lands (the "x7" of the wiki) */
  times?: number;
}

export interface Hit {
  name: string;
  kind: HitKind;
  /** Kind of the hit in the second mode of the character (see CharacterData.modes); without it, `kind` in both */
  altKind?: HitKind;
  /** The parts are added up, e.g. a heal of "575 + 2.90%" has a flat part and an HP part */
  parts: HitPart[];
  /** Basic attack that belongs to the combo chain (Stage 1, Stage 2...) */
  combo?: boolean;
  /** Element of the damage of an Echo hit (aero, glacio... or physical); the elemental bonus of the character applies only when it is the same */
  element?: string;
  /** Passive DMG Bonus in % of this hit only (e.g. an Inherent Skill "DMG of X is increased by 60%"), added to the other bonuses */
  bonus?: number;
  /** Buffs the character gives itself after this hit (e.g. an Inherent Skill "ATK +15% for 5s upon casting X") */
  buffs?: StatBuff[];
  /** Written by hand (not in the wiki): kept when the character is imported again */
  manual?: boolean;
  /** Extra damage when the hit comes right after one of some hits (e.g. "after a Basic Attack, deals an additional 150%") */
  bonusAfter?: BonusAfter;
  /** Points the hit spends, instead of the one of its section (e.g. a Heavy Attack in the Forte section) */
  cost?: number;
  /** The values of the hit are this many times the ones of the wiki (e.g. an Inherent Skill "the DMG multiplier is increased by 40%") */
  multiplier?: number;
}

export interface BonusAfter {
  /** Where it comes from (e.g. the Inherent Skill), shown on the hit */
  name: string;
  after: HitKey[];
  /** The hit is worth this many times its damage (e.g. 2.5 for an additional 150%) */
  multiplier: number;
}

/**
 * Attribute a buff of the character raises during the rotation: 'atk' is a percentage of the base ATK, the others are added;
 * 'damageBonus' is a DMG Bonus on every damage hit of the character (added to the elemental bonus); 'multiplier' raises the DMG
 * Multiplier of the hits by that %
 */
export type BuffStat = 'atk' | 'elementalBonus' | 'damageBonus' | 'liberationBonus' | 'heavyBonus' | 'skillBonus' | 'basicBonus' | 'critRate' | 'critDamage' | 'multiplier';

/** Hits of a kind that always crit, once every `cooldown` points (e.g. an Inherent Skill "Heavy Attack always crits, once every 30s") */
export interface GuaranteedCrit {
  name: string;
  kind: HitKind;
  /** In seconds, spent as points by the following hits */
  cooldown: number;
}

export interface StatBuff {
  /** Where it comes from (e.g. the Inherent Skill), shown on the hits it applies to */
  name: string;
  stat: BuffStat;
  /** In % */
  value: number;
  /** In seconds, spent as points by the following hits; without it, while the state that gives it lasts */
  duration?: number;
  /** Only these hits get it (e.g. "the DMG of Fury Fugue is increased by 25%"); without it, every hit */
  hits?: HitKey[];
  /** 'team': every member gets it (e.g. "all team members' ATK are increased by 20%"); without it, only the character */
  target?: 'team';
  /** Given again while it lasts, it adds a stack (up to this many) and renews the duration */
  stacks?: number;
}

/**
 * Coordinated Attack: a hit starts it for the whole team; while it lasts, every action of the active character of a kind in `perKind`
 * makes the character fire its hits, as many times as `perKind` says; with `interval`, at most once every that many points.
 * `stacking`: each one fired raises the DMG of the next ones, up to `max` times, until it ends (casting it again starts over)
 */
export interface CoordinatedAttack {
  name: string;
  start: HitKey;
  /** Fired together (e.g. the damage and the healing of the same attack) */
  hits: HitKey[];
  duration: number;
  perKind: Partial<Record<HitKind, number>>;
  interval?: number;
  stacking?: { name: string; value: number; max: number };
  /** Hits that detonate it: they add the `detonation` hit, in the same action, and end it */
  detonatedBy?: HitKey[];
  detonation?: HitKey;
  /** It ends after firing this many times */
  max?: number;
}

/** A mark a hit leaves (at most 1); the `detonate` hit adds the `hit` of each mark held, in the same action. They go on the Outro */
export interface CharacterMarker {
  name: string;
  gain: HitKey[];
  hit: HitKey;
  detonate: HitKey;
}

/**
 * A field a hit creates for the whole team (e.g. the Stellarealm): each Intro of a member in it raises its level, and the buffs of the
 * levels reached add up (each one a percentage of the character's Energy Regen, up to `max`). At the top level, the next Intro of the
 * character is `intro` instead, and it ends the field. The `intro` hits are not part of the normal Intro
 */
export interface TeamField {
  name: string;
  start: HitKey;
  duration: number;
  levels: { name: string; stat: BuffStat; perEnergyRegen: number; max: number }[];
  intro: HitKey[];
}

/** Hit of a character as "section:index" (e.g. "forte:0") */
export type HitKey = string;

/** Rules of the hit sequence besides the default one (a numbered hit comes right after the previous number) */
export interface SequenceRules {
  /** A hit that can only come right after one of these (for a numbered hit, besides the previous number) */
  after?: Record<HitKey, HitKey[]>;
  /** Blocks of hits that are one action: picked by the first, added and removed together (a hit can repeat, e.g. 4 coordinated attacks);
   * only the first spends points */
  linked?: HitKey[][];
  /** Hits that do not break the sequence of the others (e.g. a Skill that keeps the Basic Attack cycle): the hit before them still counts */
  keepsChain?: HitKey[];
  /** A hit that is not offered while one of these can come (e.g. the Skill becomes another one after Basic Attack 2) */
  replacedBy?: Record<HitKey, HitKey[]>;
}

/** A counter some hits fill (e.g. "Cruelty"); when full, a hit is unlocked and others are replaced by it */
export interface CharacterCounter {
  name: string;
  max: number;
  /** Hits that add `amount` (1 without it) */
  gain: HitKey[];
  amount?: number;
  /** Hits that add their own amount (they do not need to be in `gain`) */
  amounts?: Record<HitKey, number>;
  /** Hits that fill it */
  fills?: HitKey[];
  /** Hit (or hits) that needs the counter full, and spends it all; with `spend`, it needs that much and spends it */
  unlocks: HitKey | HitKey[];
  spend?: number;
  /** Hits not available while the counter is full (with `spend`, while it has that much) */
  replaces: HitKey[];
  /** Index in `states` of the only state where the counter exists; it goes back to 0 when the state ends */
  state?: number;
  boost?: CounterBoost;
  /** These hits get a DMG Bonus of `value`% for each point it has before them */
  perStack?: { name: string; value: number; hits: HitKey[] };
  /** When the character leaves the field, `hit` once every `per` points, up to `max` (only with `state` active, or not, by `inState`) */
  outro?: { hit: HitKey; per: number; max: number; state?: number; inState?: boolean };
}

/** A hit that, with at least `spend` in the counter, spends it and gets a DMG Bonus of `value`% (not in the state `notIn`) */
export interface CounterBoost {
  name: string;
  hit: HitKey;
  spend: number;
  value: number;
  notIn?: number;
}

/** A state a hit puts the character in (e.g. Dark Surge); it ends on the Outro or when the player leaves it in the rotation */
export interface CharacterState {
  name: string;
  /** Hit (or hits) that starts the state */
  start: HitKey | HitKey[];
  /** Hits only available in the state */
  hits: HitKey[];
  /** Hits not available in the state (replaced by the state hits) */
  replaces: HitKey[];
  /** Buffs active while the state lasts */
  buffs?: StatBuff[];
  /** After the state ends, the next Intro of the character is this hit instead */
  nextIntro?: HitKey;
  /** Hits that end the state (after them); with `endsAfter`, only the n-th of them since it started */
  endsOn?: HitKey[];
  endsAfter?: number;
  /** Other ways in: a state hit that also starts it from outside, right after one of these hits */
  starts?: Record<HitKey, HitKey[]>;
  /** In seconds, spent as points by the hits in it; it ends when they run out */
  duration?: number;
  /** While the character has this buff (by name), the state spends its points at `slowedRate` */
  slowedBy?: string;
  slowedRate?: number;
  /** While the state lasts, each of the `after` hits adds `hit`, in the same action, up to `max` times each time it starts */
  autoHit?: { hit: HitKey; after: HitKey[]; max: number };
}

export interface SkillData {
  name: string;
  hits: Hit[];
}

/** Which DMG Amplification a buff gives (see Amplification in the damage engine) */
export type AmplificationKind = 'all' | 'elemental' | 'basic' | 'heavy' | 'skill' | 'liberation' | 'echo';

/** A buff the Outro Skill gives */
export interface OutroBuff {
  /** 'incoming': the next character to enter; 'team': every member, the giver too */
  target: 'incoming' | 'team';
  amplification: AmplificationKind;
  /** Element of an elemental amplification; it only counts for a character (and an Echo hit) of that element */
  element?: string;
  /** In % */
  value: number;
  /** In seconds, spent as points by the hits of the rotation */
  duration: number;
  /** Ends when the character that has it leaves the field (its Outro) */
  endsOnSwitch?: boolean;
}

export interface OutroData extends SkillData {
  /** Buffs that enter the calculation; the others stay only as text in plans/outro-skills.md */
  buffs?: OutroBuff[];
  /** Attribute buffs the Outro gives (like the ones of a hit), renewed by name */
  statBuffs?: StatBuff[];
}

export interface RotationStep {
  /** 'echo' is the Echo Skill of the main Echo of the moment, whichever it is; 'end' leaves a state (worth 0, spends no points) */
  section: SectionKey | 'echo' | 'end';
  /** Position of the hit inside the section; for 'echo', the chosen way of casting it; for 'end', the state in `states` */
  index: number;
}

/** What is recommended for a character; every list goes from the best to the worst */
export interface CharacterRecommendation {
  /** Ids of the Echos for the main slot */
  echos: number[];
  /** Ids of the Sonatas; a combination (e.g. 3 + 2 pieces) has two */
  sonatas: number[][];
  /** Weapon names, kept until there is weapon data */
  weapons: string[];
  /** Teams, each member with its role (main: main DPS, sub: sub-DPS, sup: support), kept for later use */
  teams: { character: string; role: 'main' | 'sub' | 'sup' }[][];
  /** Main attributes of each cost; empty when no Echo of that cost is recommended */
  main: Record<EchoCost, EchoAttribute[]>;
  subs: EchoAttribute[];
}

export interface CharacterData {
  id: string;
  name: string;
  icon: string;
  /** Folder of the skill icons, assets/img/icons/<iconSkill>/ */
  iconSkill: string;
  type: string;
  weapon: string;
  /** HP, ATK and DEF at level 90, without weapon and Echos; 0 while unknown (DEF can really be 0) */
  base: { hp: number; atk: number; def: number };
  lastUpdate: string;
  /** Has at least one healing skill */
  hasHealing: boolean;
  /** The healing goes to other characters (false: only to itself) */
  healsAllies: boolean;
  /** The focus is damage; with healing, a secondary role */
  primaryDamage: boolean;
  hpScale: boolean;
  defScale: boolean;
  /** Some part scales with Energy Regen */
  erScale?: boolean;
  /** Two ways of playing the character, e.g. ["chafe", "echo"]; the first uses `kind` of the hits, the second `altKind` */
  modes?: string[];
  /** Rules of the hit sequence besides the numbered one */
  sequence?: SequenceRules;
  /** States some hits put the character in */
  states?: CharacterState[];
  guaranteedCrit?: GuaranteedCrit;
  counters?: CharacterCounter[];
  coordinated?: CoordinatedAttack;
  markers?: CharacterMarker[];
  /** Hits added, in the same action, after some hits (e.g. a butterfly after each Normal Attack) */
  followUps?: { hit: HitKey; after: HitKey[] }[];
  field?: TeamField;
  basic: SkillData;
  skill: SkillData;
  liberation: SkillData;
  intro: SkillData;
  outro: OutroData;
  forte: SkillData;
  /** Default hits of the Rotation build between the intro and the outro; without it, the build starts empty */
  rotationBuild?: RotationStep[];
  recommended: CharacterRecommendation;
}
