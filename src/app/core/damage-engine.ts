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
  /** Total Energy Regen in % (100 is the base) */
  energyRegen: number;
}

/**
 * DMG Amplification in %: a multiplier of its own, after the DMG Bonus. Every amplification that applies to a hit is added up
 * (all + the element of the hit + its kind). Heal, shield and tune hits get none. No source gives it yet (all 0)
 */
export interface Amplification {
  all: number;
  /** Of the element of the character; for an Echo hit, only when the Echo has that element */
  elemental: number;
  basic: number;
  heavy: number;
  skill: number;
  liberation: number;
  echo: number;
}

export function noAmplification(): Amplification {
  return { all: 0, elemental: 0, basic: 0, heavy: 0, skill: 0, liberation: 0, echo: 0 };
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
export function calculateResults(data: CharacterData, stats: Stats, levels: Levels, mode = 0, amplification = noAmplification()): CharacterResults {
  const results = {} as CharacterResults;
  for (const key of SECTIONS) {
    // The outro skill has no level
    const level = key === 'outro' ? 1 : levels[key];
    results[key] = data[key].hits.map(hit => {
      const kind = mode > 0 && hit.altKind ? hit.altKind : hit.kind;
      const elemental = kind === 'heal' || kind === 'shield' ? 0 : stats.elementalBonus;
      // `hit.bonus`: a passive DMG Bonus of this hit only, added to the bonus of its kind
      return calculateHit(hit, stats, level, 100 + elemental + bonusOf(stats, kind) + (hit.bonus ?? 0), amplificationOf(amplification, kind, true));
    });
  }
  return results;
}

/**
 * Hits of an Echo Skill: the Echo takes the attributes of the character and `echoBonus`;
 * the elemental bonus and amplification only when the Echo hit has the element of the character (a physical one never does)
 */
export function calculateEchoResults(hits: Hit[], stats: Stats, element: string, amplification = noAmplification()): HitResult[] {
  return hits.map(hit => {
    const sameElement = hit.element === element;
    const bonus = 100 + (sameElement ? stats.elementalBonus : 0) + stats.echoBonus;
    return calculateHit(hit, stats, 1, bonus, amplificationOf(amplification, 'echo', sameElement));
  });
}

/** `bonus` is the total damage bonus in % (100 is none); `amplification` the total DMG Amplification in % (0 is none) */
function calculateHit(hit: Hit, stats: Stats, level: number, bonus: number, amplification: number): HitResult {

  const parts = hit.parts.map(part => {
    // A skill without levels has a single value
    const raw = part.values.length === 1 ? part.values[0] : part.values[level - 1];
    const base = part.stat === 'flat' ? raw
      : part.stat === 'er' ? raw * stats.energyRegen
      : statOf(stats, part.stat) * (raw / 100);
    const expected = base * (bonus / 100) * (1 + amplification / 100);
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

function statOf(stats: Stats, stat: Exclude<PartStat, 'flat' | 'er'>): number {
  return stat === 'hp' ? stats.hp : stat === 'def' ? stats.def : stats.dmg;
}

/** DMG Amplification (in %) that applies to a kind of hit; heal, shield and tune get none, outro and intro only the general ones */
function amplificationOf(amplification: Amplification, kind: HitKind, sameElement: boolean): number {
  if (kind === 'heal' || kind === 'shield' || kind === 'tune') return 0;
  const byKind = kind === 'basic' || kind === 'heavy' || kind === 'skill' || kind === 'liberation' || kind === 'echo' ? amplification[kind] : 0;
  return amplification.all + (sameElement ? amplification.elemental : 0) + byKind;
}

/** Damage bonus (in %) that applies to a kind of hit; intro, outro, shield and tune (a fixed multiplier) have none */
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
    // A hit without parts (e.g. casting a Liberation that only enters a state) is worth 0
  }), { min: 0, max: 0, critMin: 0, critMax: 0 });
}
