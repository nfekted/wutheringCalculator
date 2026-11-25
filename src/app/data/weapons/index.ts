import { SonataTrigger } from '../echos/echo-data.model';
import { WeaponData, WeaponSlot } from './weapon-data.model';

import broadblade from './broadblade.json';
import sword from './sword.json';
import pistols from './pistols.json';

export const WEAPONS = [...broadblade, ...sword, ...pistols] as unknown as WeaponData[];

export function getWeapon(id: string): WeaponData | undefined {
  return WEAPONS.find(w => w.id === id);
}

/** Triggers of the equipped weapon with the values of its rank */
export function weaponTriggers(slot: WeaponSlot | null): SonataTrigger[] {
  const weapon = slot && getWeapon(slot.id);
  return (weapon?.triggers ?? []).map(({ buffs, ...trigger }) => ({
    ...trigger,
    buffs: buffs.map(({ values, ...buff }) => ({ ...buff, value: values[slot!.rank - 1] })),
  }));
}
