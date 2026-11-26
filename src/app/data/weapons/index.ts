import { SonataTrigger } from '../echos/echo-data.model';
import { WeaponData, WeaponSlot } from './weapon-data.model';

import broadblade from './broadblade.json';
import sword from './sword.json';
import pistols from './pistols.json';
import gauntlets from './gauntlets.json';
import rectifier from './rectifier.json';

export const WEAPONS = [...broadblade, ...sword, ...pistols, ...gauntlets, ...rectifier] as unknown as WeaponData[];

export function getWeapon(id: string): WeaponData | undefined {
  return WEAPONS.find(w => w.id === id);
}

/** Triggers of the equipped weapon with the values of its rank */
export function weaponTriggers(slot: WeaponSlot | null): SonataTrigger[] {
  const weapon = slot && getWeapon(slot.id);
  return (weapon?.triggers ?? []).map(({ buffs, heal, statusAmplification: amplification, ...trigger }) => ({
    ...trigger,
    buffs: buffs.map(({ values, ...buff }) => ({ ...buff, value: values[slot!.rank - 1] })),
    ...(heal && { heal: { name: weapon!.name, value: heal[slot!.rank - 1] } }),
    ...(amplification && { statusAmplification: { name: weapon!.name, status: amplification.status, value: amplification.values[slot!.rank - 1], duration: amplification.duration } }),
  }));
}
