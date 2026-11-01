import { CharacterData } from '../data/character-data.model';
import { EchoAttribute, EchoSlot, EchoStat } from '../data/echos/echo-data.model';
import { ECHO_VALUES, getEcho } from '../data/echos';
import { Stats } from './damage-engine';

/** HP, ATK and DEF of the character alone (level 90) */
export type BaseStats = CharacterData['base'];

type MainStat = 'hp' | 'dmg' | 'def';
type AddStat = Exclude<EchoStat, MainStat>;

/** What a source (an Echo; later Sonatas and weapons) adds to the attributes */
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
