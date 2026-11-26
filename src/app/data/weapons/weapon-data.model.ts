import { StatBuff } from '../character-data.model';
import { EchoMainValue, EchoStat, SonataTrigger } from '../echos/echo-data.model';
import { NegativeStatus } from '../../core/negative-status';

export type WeaponType = 'broadblade' | 'sword' | 'pistols' | 'gauntlets' | 'rectifier';

/** An always active attribute of the passive, one value per rank (R1 to R5); HP, ATK and DEF are a percentage */
export interface WeaponStat {
  stat: EchoStat;
  values: number[];
  /** Element of an elemental DMG bonus; without it, every element (e.g. "Attribute DMG Bonus") */
  element?: string;
}

/** A buff of a triggered passive, one value per rank */
export interface WeaponBuff extends Omit<StatBuff, 'value'> {
  values: number[];
}

/** A triggered passive (as a Sonata trigger), with the values of each rank */
export interface WeaponTrigger extends Omit<SonataTrigger, 'buffs' | 'heal' | 'statusAmplification'> {
  buffs: WeaponBuff[];
  /** % of the Max HP it heals, one value per rank */
  heal?: number[];
  /** Amplification of the damage of a Negative Status, one value per rank */
  statusAmplification?: { status: NegativeStatus; values: number[]; duration: number };
}

export interface WeaponData {
  /** Also the image `assets/img/weapons/<id>.webp` */
  id: string;
  name: string;
  type: WeaponType;
  /** Base ATK at level 90: added to the base ATK of the character, before the percentages */
  atk: number;
  /** Second attribute at level 90 */
  main: EchoMainValue;
  /** Passive, in-game text */
  text: string;
  /** Always active part of the passive */
  stats?: WeaponStat[];
  /** Triggered part of the passive (team engine, as the Sonata triggers) */
  triggers?: WeaponTrigger[];
}

/** The weapon a character has equipped and its rank (1 to 5) */
export interface WeaponSlot {
  id: string;
  rank: number;
}
