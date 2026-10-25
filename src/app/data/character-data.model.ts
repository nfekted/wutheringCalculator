export type SectionKey = 'basic' | 'skill' | 'liberation' | 'intro' | 'outro' | 'forte';

/** What a hit is; decides which damage bonus applies to it */
export type HitKind = 'basic' | 'heavy' | 'skill' | 'liberation' | 'intro' | 'outro' | 'echo' | 'tune' | 'heal' | 'shield';

/** What a part of a hit is based on: a percentage of the character's ATK, HP or DEF, or a flat value */
export type PartStat = 'atk' | 'hp' | 'def' | 'flat';

export interface HitPart {
  stat: PartStat;
  /** One value per skill level (percent for atk/hp/def); a single value when the skill has no levels */
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
}

export interface SkillData {
  name: string;
  hits: Hit[];
}

export interface RotationStep {
  section: SectionKey;
  /** Position of the hit inside the section */
  index: number;
}

export interface CharacterData {
  id: string;
  name: string;
  icon: string;
  type: string;
  weapon: string;
  lastUpdate: string;
  /** Has at least one healing skill */
  hasHealing: boolean;
  /** The healing goes to other characters (false: only to itself) */
  healsAllies: boolean;
  /** The focus is damage; with healing, a secondary role */
  primaryDamage: boolean;
  hpScale: boolean;
  defScale: boolean;
  /** Two ways of playing the character, e.g. ["chafe", "echo"]; the first uses `kind` of the hits, the second `altKind` */
  modes?: string[];
  basic: SkillData;
  skill: SkillData;
  liberation: SkillData;
  intro: SkillData;
  outro: SkillData;
  forte: SkillData;
  rotation: RotationStep[];
  rotationDesc: string[];
  rotationColor: string[];
  rotationCommands: string[];
  echo4: string[];
  echo3: string[];
  echo1: string[];
  echoSub: string[];
}
