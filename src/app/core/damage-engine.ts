import { CharacterData, Hit, HitKind, PartStat, SectionKey } from '../data/character-data.model';

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
  echoBonus: number;
  healingBonus: number;
}

export interface Levels {
  basic: number;
  skill: number;
  liberation: number;
  intro: number;
  forte: number;
}

/** Damage range of a hit: without and with a crit */
export interface DamageRange {
  min: number;
  max: number;
  critMin: number;
  critMax: number;
}

/** One part of a hit (e.g. the flat part of a "575 + 2.90%" heal) */
export interface PartResult {
  /** Expected value of one landing */
  value: number;
  times: number;
  /** One landing against a common enemy / a resistant one */
  common: DamageRange;
  resistant: DamageRange;
}

export interface HitResult {
  parts: PartResult[];
  /** Total of every part, times included */
  sum: number;
  /** Totals against a common enemy / a resistant one */
  commonSum: DamageRange;
  resistantSum: DamageRange;
}

export type CharacterResults = Record<SectionKey, HitResult[]>;

const SECTIONS: SectionKey[] = ['basic', 'skill', 'liberation', 'intro', 'outro', 'forte'];

export function emptyResults(): CharacterResults {
  const results = {} as CharacterResults;
  for (const key of SECTIONS) results[key] = [];
  return results;
}

/** `mode` is the index in `data.modes`: the second mode uses the `altKind` of the hits that have one */
export function calculateResults(data: CharacterData, stats: Stats, levels: Levels, mode = 0): CharacterResults {
  const results = {} as CharacterResults;
  for (const key of SECTIONS) {
    // The outro skill has no level
    const level = key === 'outro' ? 1 : levels[key];
    results[key] = data[key].hits.map(hit => calculateHit(hit, mode > 0 && hit.altKind ? hit.altKind : hit.kind, stats, level));
  }
  return results;
}

function calculateHit(hit: Hit, kind: HitKind, stats: Stats, level: number): HitResult {
  const elemental = kind === 'heal' || kind === 'shield' ? 0 : stats.elementalBonus;
  const bonus = 100 + elemental + bonusOf(stats, kind);

  const parts = hit.parts.map(part => {
    // A skill without levels has a single value
    const raw = part.values.length === 1 ? part.values[0] : part.values[level - 1];
    const expected = (part.stat === 'flat' ? raw : statOf(stats, part.stat) * (raw / 100)) * (bonus / 100);
    return {
      value: +expected.toFixed(0),
      times: part.times ?? 1,
      common: getRangeDamage(expected, false, stats.cDmg),
      resistant: getRangeDamage(expected, true, stats.cDmg),
    };
  });

  return {
    parts,
    sum: parts.reduce((total, p) => total + p.value * p.times, 0),
    commonSum: sumRanges(parts.map(p => multRange(p.common, p.times))),
    resistantSum: sumRanges(parts.map(p => multRange(p.resistant, p.times))),
  };
}

function statOf(stats: Stats, stat: Exclude<PartStat, 'flat'>): number {
  return stat === 'hp' ? stats.hp : stat === 'def' ? stats.def : stats.dmg;
}

/** Damage bonus (in %) that applies to a kind of hit; intro, outro and shield have none */
function bonusOf(stats: Stats, kind: HitKind): number {
  switch (kind) {
    case 'basic': return stats.basicBonus;
    case 'heavy': return stats.heavyBonus;
    case 'skill': return stats.skillBonus;
    case 'liberation': return stats.liberationBonus;
    case 'echo': return stats.echoBonus;
    case 'heal': return stats.healingBonus;
    default: return 0;
  }
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

function getRangeDamage(expected: number, resistance: boolean, critDmg: number): DamageRange {
  const mitigation = resistance ? ENEMY_MITIGATION_RESISTANT : ENEMY_MITIGATION_COMMON;
  const min = +(expected * DAMAGE_SPREAD_MIN * mitigation).toFixed(0);
  const max = +(expected * DAMAGE_SPREAD_MAX * mitigation).toFixed(0);
  const crit = critDmg / 100;
  return { min, max, critMin: +(min * crit).toFixed(0), critMax: +(max * crit).toFixed(0) };
}

function multRange(range: DamageRange, value: number): DamageRange {
  return {
    min: +(range.min * value).toFixed(0),
    max: +(range.max * value).toFixed(0),
    critMin: +(range.critMin * value).toFixed(0),
    critMax: +(range.critMax * value).toFixed(0),
  };
}

function sumRanges(ranges: DamageRange[]): DamageRange {
  return ranges.reduce((total, r) => ({
    min: total.min + r.min,
    max: total.max + r.max,
    critMin: total.critMin + r.critMin,
    critMax: total.critMax + r.critMax,
  }));
}
