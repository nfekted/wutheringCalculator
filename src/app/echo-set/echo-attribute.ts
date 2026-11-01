import { EchoAttribute } from '../data/echos/echo-data.model';

const LABELS: Record<string, string> = {
  hp: 'HP', dmg: 'ATK', def: 'DEF',
  cChance: 'Crit. Rate', cDmg: 'Crit. DMG', energyRegen: 'Energy Regen', healingBonus: 'Healing Bonus',
  basicBonus: 'Basic Attack DMG Bonus', heavyBonus: 'Heavy Attack DMG Bonus',
  skillBonus: 'Resonance Skill DMG Bonus', liberationBonus: 'Resonance Liberation DMG Bonus',
};

/** Name of an Echo attribute as the game shows it, e.g. "ATK %", "ATK" (flat) or "Glacio DMG Bonus %" */
export function attributeLabel(attribute: EchoAttribute): string {
  if (attribute.stat === 'elementalBonus') {
    const element = attribute.element ?? '';
    return `${element.charAt(0).toUpperCase()}${element.slice(1)} DMG Bonus %`;
  }
  return LABELS[attribute.stat] + (attribute.flat ? '' : ' %');
}
