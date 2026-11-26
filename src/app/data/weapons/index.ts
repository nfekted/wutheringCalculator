import { GearOutro, SonataTrigger } from '../echos/echo-data.model';
import { StatBuff } from '../character-data.model';
import { WeaponBuff, WeaponData, WeaponSlot } from './weapon-data.model';

import broadblade from './broadblade.json';
import sword from './sword.json';
import pistols from './pistols.json';
import gauntlets from './gauntlets.json';
import rectifier from './rectifier.json';

export const WEAPONS = [...broadblade, ...sword, ...pistols, ...gauntlets, ...rectifier] as unknown as WeaponData[];

export function getWeapon(id: string): WeaponData | undefined {
  return WEAPONS.find(w => w.id === id);
}

/** A buff with the value of the rank */
function rankBuff({ values, atMax, ...buff }: WeaponBuff, rank: number): StatBuff {
  return { ...buff, value: values[rank - 1], ...(atMax && { atMax: rankBuff(atMax, rank) }) };
}

/** What the Outro of the wielder gets from the equipped weapon, with the values of its rank */
export function weaponOutro(slot: WeaponSlot | null): GearOutro[] {
  const weapon = slot && getWeapon(slot.id);
  const outro = weapon?.outro;
  if (!outro) return [];
  const amplification = outro.statusAmplification;
  return [{
    ...(outro.status && { status: outro.status }),
    ...(outro.statBuffs && { statBuffs: outro.statBuffs.map(buff => rankBuff(buff, slot!.rank)) }),
    ...(amplification && { statusAmplification: { name: weapon!.name, status: amplification.status, value: amplification.values[slot!.rank - 1], duration: amplification.duration } }),
  }];
}

/** Triggers of the equipped weapon with the values of its rank */
export function weaponTriggers(slot: WeaponSlot | null): SonataTrigger[] {
  const weapon = slot && getWeapon(slot.id);
  return (weapon?.triggers ?? []).map(({ buffs, heal, statusAmplification: amplification, ...trigger }) => ({
    ...trigger,
    buffs: buffs.map(buff => rankBuff(buff, slot!.rank)),
    ...(heal && { heal: { name: weapon!.name, value: heal[slot!.rank - 1] } }),
    ...(amplification && { statusAmplification: { name: weapon!.name, status: amplification.status, value: amplification.values[slot!.rank - 1], duration: amplification.duration } }),
  }));
}
