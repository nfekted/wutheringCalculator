import { CharacterData, SectionKey, SkillData } from '../data/character-data.model';

export interface Stats {
  dmg: number;
  hp: number;
  def: number;
  cChance: number;
  cDmg: number;
  elementalBonus: number;
  basicBonus: number;
  heavyBonus: number;
  skillBonus: number;
  liberationBonus: number;
  healingBonus: number;
}

export interface Levels {
  basic: number;
  skill: number;
  liberation: number;
  intro: number;
  forte: number;
}

export interface SectionResult {
  /** Expected damage of the first hit */
  dmg: number[];
  second: number[];
  third: number[];
  /** Damage range text (vs. common enemy / vs. resistant enemy) */
  common: string[];
  res: string[];
  /** Total of all hits, multipliers included */
  sum: number[];
  sumCommon: string[];
  sumRes: string[];
  healing: number[];
}

export type CharacterResults = Record<SectionKey, SectionResult>;

interface SectionRules {
  /** Skill level used by the first hit, second and third hits */
  level: (levels: Levels) => number;
  secondLevel: (levels: Levels) => number;
  hasThird: boolean;
  /** Bonus comes from the bonus type (true) or only from healing (false) */
  bonusByType: boolean;
  /** Hits can scale from HP/DEF and be healing */
  scalesByType: boolean;
}

// The outro skill has a single value and no level, so both of its hits use level 1.
const RULES: Record<SectionKey, SectionRules> = {
  basic: { level: l => l.basic, secondLevel: l => l.basic, hasThird: true, bonusByType: true, scalesByType: false },
  skill: { level: l => l.skill, secondLevel: l => l.skill, hasThird: true, bonusByType: true, scalesByType: true },
  liberation: { level: l => l.liberation, secondLevel: l => l.liberation, hasThird: false, bonusByType: true, scalesByType: true },
  intro: { level: l => l.intro, secondLevel: l => l.intro, hasThird: false, bonusByType: false, scalesByType: true },
  outro: { level: () => 1, secondLevel: () => 1, hasThird: false, bonusByType: false, scalesByType: true },
  forte: { level: l => l.forte, secondLevel: l => l.forte, hasThird: true, bonusByType: true, scalesByType: true },
};

const SECTIONS = Object.keys(RULES) as SectionKey[];

function emptySection(): SectionResult {
  return { dmg: [], second: [], third: [], common: [], res: [], sum: [], sumCommon: [], sumRes: [], healing: [] };
}

export function emptyResults(): CharacterResults {
  const results = {} as CharacterResults;
  for (const key of SECTIONS) results[key] = emptySection();
  return results;
}

export function calculateResults(data: CharacterData, stats: Stats, levels: Levels): CharacterResults {
  const results = {} as CharacterResults;
  for (const key of SECTIONS) {
    results[key] = calculateSection(data[key], RULES[key], stats, levels);
  }
  return results;
}

function calculateSection(skill: SkillData, rules: SectionRules, stats: Stats, levels: Levels): SectionResult {
  const result = emptySection();
  const crit = stats.cDmg;
  const level = rules.level(levels) - 1;
  const secondLevel = rules.secondLevel(levels) - 1;

  for (let i = 0; i < skill.scaling.length; i++) {
    const heal = !!skill.heal?.[i];
    const base = rules.scalesByType ? scalingStat(stats, skill.dmgType?.[i]) : stats.dmg;
    const bonus = rules.bonusByType ? bonusOf(stats, skill.bonusType[i]) : (heal ? stats.healingBonus : 1);
    const elemental = heal ? 0 : stats.elementalBonus;

    const ex = getExpected(base, skill.scaling[i], level, elemental, bonus);
    result.dmg[i] = +ex.toFixed(0);
    let multiplier = skill.multiplier[i];
    result.sum[i] = result.dmg[i] * multiplier;
    if (heal) result.healing[i] = result.sum[i];

    let commonSum = getRangeDamage(ex, false, crit);
    let resSum = getRangeDamage(ex, true, crit);
    result.common[i] = multiplierTag(multiplier) + getRangeString(commonSum);
    result.res[i] = multiplierTag(multiplier) + getRangeString(resSum);
    commonSum = multArray(commonSum, multiplier);
    resSum = multArray(resSum, multiplier);

    const extras = [{ table: skill.second, store: result.second, multipliers: skill.secondMultiplier }];
    if (rules.hasThird) extras.push({ table: skill.third, store: result.third, multipliers: skill.thirdMultiplier });

    for (const { table, store, multipliers } of extras) {
      if (table.length === 0) continue;
      const hit = store[i] = +getExpected(base, table[i], secondLevel, elemental, bonus).toFixed(0);
      if (hit > 0) {
        multiplier = multipliers[i];
        result.sum[i] += hit * multiplier;
        if (heal) result.healing[i] += hit * multiplier;

        let range = getRangeDamage(hit, false, crit);
        result.common[i] += `<br/>+<br/>${multiplierTag(multiplier)}${getRangeString(range)}`;
        commonSum = sumArray(commonSum, multArray(range, multiplier));

        range = getRangeDamage(hit, true, crit);
        result.res[i] += `<br/>+<br/>${multiplierTag(multiplier)}${getRangeString(range)}`;
        resSum = sumArray(resSum, multArray(range, multiplier));
      }
    }

    result.sumCommon[i] = getRangeString(commonSum);
    result.sumRes[i] = getRangeString(resSum);
  }

  return result;
}

function scalingStat(stats: Stats, type?: string): number {
  return type === 'hp' ? stats.hp : type === 'def' ? stats.def : stats.dmg;
}

function bonusOf(stats: Stats, type: string): number {
  switch (type) {
    case 'b': return stats.basicBonus;
    case 'h': return stats.heavyBonus;
    case 's': return stats.skillBonus;
    case 'l': return stats.liberationBonus;
    case 'c': return stats.healingBonus;
    default: return 1;
  }
}

function multiplierTag(multiplier: number): string {
  return multiplier > 1 ? `<small>${multiplier}x </small>` : '';
}

function getExpected(dmg: number, multiplierRange: number[], upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
  const bonus = 100 + elementalBonus + damageBonus;
  const value = multiplierRange[upgradeLevel];
  return (value < 0 ? value * -1 : dmg * (value / 100)) * (bonus / 100);
}

/*
 * Fixed on purpose: the calculator targets a level 90 character against a max-level enemy,
 * so DEF and RES are not inputs. These are the damage spread around the expected value and
 * the damage left after the enemy's DEF and RES (a common enemy vs. a resistant one).
 */
const DAMAGE_SPREAD_MIN = 0.93;
const DAMAGE_SPREAD_MAX = 1.065;
const ENEMY_MITIGATION_COMMON = 0.49;
const ENEMY_MITIGATION_RESISTANT = 0.33;

/** @returns [min, max, min Crit, max Crit] */
function getRangeDamage(ex: number, resistance: boolean, critDmg: number): number[] {
  const res = resistance ? ENEMY_MITIGATION_RESISTANT : ENEMY_MITIGATION_COMMON;
  const minValue = +(ex * DAMAGE_SPREAD_MIN * res).toFixed(0);
  const maxValue = +(ex * DAMAGE_SPREAD_MAX * res).toFixed(0);
  const crit = critDmg / 100;
  return [minValue, maxValue, +(minValue * crit).toFixed(0), +(maxValue * crit).toFixed(0)];
}

function getRangeString(damages: number[]): string {
  return `${damages[0]} ~ ${damages[1]} (<b>${damages[2]} ~ ${damages[3]}</b>)`;
}

function sumArray(a: number[], b: number[]): number[] {
  return a.map((num, index) => num + b[index]);
}

function multArray(a: number[], value: number): number[] {
  return a.map(num => +(num * value).toFixed(0));
}
