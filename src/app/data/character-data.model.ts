export type SectionKey = 'basic' | 'skill' | 'liberation' | 'intro' | 'outro' | 'forte';

export interface SkillData {
  name: string;
  names: string[];
  /** b - basic, s - skill, l - liberation, h - heavy, c - heal */
  bonusType: string[];
  heal?: boolean[];
  dmgType?: string[];
  shield?: boolean[];
  /** Multiplier (%) of each hit per skill level */
  scaling: number[][];
  multiplier: number[];
  second: number[][];
  secondMultiplier: number[];
  third: number[][];
  thirdMultiplier: number[];
  /** Index of the last basic attack of the chain */
  ends?: number;
}

export interface RotationStep {
  section: SectionKey;
  index: number;
  /** Uses the healing total of the hit instead of the damage total */
  healing?: boolean;
}

export interface CharacterData {
  id: string;
  name: string;
  icon: string;
  wiki: string;
  type: string;
  weapon: string;
  lastUpdate: string;
  atkType: boolean;
  healType: boolean;
  canHeal: boolean;
  hpType: boolean;
  defType: boolean;
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
