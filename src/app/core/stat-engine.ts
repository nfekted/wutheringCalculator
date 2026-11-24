import { CharacterData } from '../data/character-data.model';
import { EchoAttribute, EchoSlot, EchoStat, SonataStat } from '../data/echos/echo-data.model';
import { ECHO_VALUES, SONATAS, getEcho } from '../data/echos';
import { Stats } from './damage-engine';
import { WeaponSlot } from '../data/weapons/weapon-data.model';
import { getWeapon } from '../data/weapons';

/** HP, ATK and DEF of the character alone (level 90) */
export type BaseStats = CharacterData['base'];

type MainStat = 'hp' | 'dmg' | 'def';
type AddStat = Exclude<EchoStat, MainStat>;

/** What a source (an Echo, a Sonata, a weapon) adds to the attributes */
export interface StatModifier {
  flat: Record<MainStat, number>;
  /** Percentages of the base */
  pct: Record<MainStat, number>;
  add: Partial<Record<AddStat, number>>;
}

const CRIT_RATE = 5;
const CRIT_DMG = 150;
const ENERGY_REGEN = 100;

export function emptyModifier(): StatModifier {
  return { flat: { hp: 0, dmg: 0, def: 0 }, pct: { hp: 0, dmg: 0, def: 0 }, add: {} };
}

/** What a registered Echo adds; an elemental DMG bonus only counts for a character of the same element */
export function echoModifier(slot: EchoSlot, element: string): StatModifier {
  const modifier = emptyModifier();
  const echo = getEcho(slot.echo);
  if (!echo) return modifier;

  const main = ECHO_VALUES.main[echo.cost];
  const chosen = main.options.find(option => sameAttribute(option, slot.main));
  const attributes = [main.fixed, ...(chosen ? [chosen] : []), ...slot.subs];

  for (const attribute of attributes) {
    if (attribute.element && attribute.element !== element) continue;
    addAttribute(modifier, attribute, attribute.value);
  }
  return modifier;
}

/** Pieces of each Sonata in the Echo Set, by Sonata id: the same Echo in more than one slot counts once */
export function sonataPieces(echoSet: (EchoSlot | null)[]): Map<number, number> {
  const echos = new Map<number, Set<number>>();
  for (const slot of echoSet) {
    if (!slot) continue;
    if (!echos.has(slot.sonata)) echos.set(slot.sonata, new Set());
    echos.get(slot.sonata)!.add(slot.echo);
  }
  return new Map([...echos].map(([id, set]) => [id, set.size]));
}

/** Whether an always active Sonata attribute counts: the element of the character (or every element), and the Energy Regen it asks for */
export function sonataStatApplies(stat: SonataStat, element: string, energyRegen: number): boolean {
  return (!stat.element || stat.element === element) && energyRegen >= (stat.minEnergyRegen ?? 0);
}

/** What the Sonata bonuses with enough pieces add; `energyRegen` is the final one (0 leaves out the bonuses that ask for it) */
export function sonataModifier(echoSet: (EchoSlot | null)[], element: string, energyRegen = 0): StatModifier {
  const modifier = emptyModifier();
  for (const [id, pieces] of sonataPieces(echoSet)) {
    const sonata = SONATAS.find(s => s.id === id);
    for (const bonus of sonata?.bonuses ?? []) {
      if (bonus.pieces > pieces) continue;
      for (const stat of bonus.stats ?? []) {
        if (sonataStatApplies(stat, element, energyRegen)) addAttribute(modifier, stat, stat.value);
      }
    }
  }
  return modifier;
}

/** What the bonus of the Echo in the main slot adds: the general ones and the ones of this character, of its element */
export function mainSlotModifier(slot: EchoSlot | null, character: string, element: string): StatModifier {
  const modifier = emptyModifier();
  for (const bonus of (slot && getEcho(slot.echo)?.mainSlotBonus) || []) {
    if (bonus.character && bonus.character !== character) continue;
    for (const stat of bonus.stats ?? []) if (!stat.element || stat.element === element) addAttribute(modifier, stat, stat.value);
  }
  return modifier;
}

/** What the equipped weapon adds: its second attribute and the always active part of the passive, of its rank (its ATK goes in the base) */
export function weaponModifier(slot: WeaponSlot | null, element: string): StatModifier {
  const modifier = emptyModifier();
  const weapon = slot && getWeapon(slot.id);
  if (!weapon) return modifier;
  addAttribute(modifier, weapon.main, weapon.main.value);
  for (const stat of weapon.stats ?? []) if (!stat.element || stat.element === element) addAttribute(modifier, stat, stat.values[slot.rank - 1]);
  return modifier;
}

export function sumModifiers(modifiers: StatModifier[]): StatModifier {
  const total = emptyModifier();
  for (const modifier of modifiers) {
    for (const key of ['hp', 'dmg', 'def'] as const) {
      total.flat[key] += modifier.flat[key];
      total.pct[key] += modifier.pct[key];
    }
    for (const [key, value] of Object.entries(modifier.add) as [AddStat, number][]) {
      total.add[key] = (total.add[key] ?? 0) + value;
    }
  }
  return total;
}

/** Final attributes: HP, ATK and DEF are base × (1 + %) + flat; the attributes no source changes (`echoBonus`) keep the typed value */
export function finalStats(base: BaseStats, modifier: StatModifier, typed: Stats): Stats {
  const main = (key: MainStat, value: number) => Math.round(value * (1 + modifier.pct[key] / 100) + modifier.flat[key]);
  const add = (key: AddStat, start = 0) => +(start + (modifier.add[key] ?? 0)).toFixed(2);

  return {
    hp: main('hp', base.hp),
    dmg: main('dmg', base.atk),
    def: main('def', base.def),
    cChance: add('cChance', CRIT_RATE),
    cDmg: add('cDmg', CRIT_DMG),
    energyRegen: add('energyRegen', ENERGY_REGEN),
    elementalBonus: add('elementalBonus'),
    basicBonus: add('basicBonus'),
    heavyBonus: add('heavyBonus'),
    skillBonus: add('skillBonus'),
    liberationBonus: add('liberationBonus'),
    healingBonus: add('healingBonus'),
    echoBonus: typed.echoBonus,
    echoHitBonus: add('echoHitBonus'),
    coordinatedBonus: add('coordinatedBonus'),
    outroBonus: add('outroBonus'),
  };
}

export function sameAttribute(a: EchoAttribute, b: EchoAttribute): boolean {
  return a.stat === b.stat && !!a.flat === !!b.flat && a.element === b.element;
}

function addAttribute(modifier: StatModifier, attribute: EchoAttribute, value: number) {
  const { stat } = attribute;
  if (stat === 'hp' || stat === 'dmg' || stat === 'def') {
    modifier[attribute.flat ? 'flat' : 'pct'][stat] += value;
  } else {
    modifier.add[stat] = (modifier.add[stat] ?? 0) + value;
  }
}
