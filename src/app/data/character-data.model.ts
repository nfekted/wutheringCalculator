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
  /** Element of the damage of an Echo hit (aero, glacio... or physical), only as information: no elemental bonus applies to it */
  element?: string;
}

export interface SkillData {
  name: string;
  hits: Hit[];
}

export interface RotationStep {
  /** 'echo' is the Echo Skill of the main Echo of the moment, whichever it is */
  section: SectionKey | 'echo';
  /** Position of the hit inside the section; for 'echo', the chosen way of casting it */
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
  basic: SkillData;
  skill: SkillData;
  liberation: SkillData;
  intro: SkillData;
  outro: SkillData;
  forte: SkillData;
  /** Default hits of the Rotation build between the intro and the outro; without it, the build starts empty */
  rotationBuild?: RotationStep[];
  recommended: CharacterRecommendation;
}
