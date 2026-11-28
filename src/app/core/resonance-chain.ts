import { CharacterData, SectionKey } from '../data/character-data.model';

/** The data of the character with the Resonance Chain nodes S1 to S`chain` applied; S0 (or no node) is the data itself */
export function chainData(data: CharacterData, chain: number): CharacterData {
  const nodes = data.chains?.slice(0, chain) ?? [];
  if (!nodes.length) return data;
  const copy: CharacterData = structuredClone(data);
  for (const node of nodes) {
    for (const [key, change] of Object.entries(node.hits ?? {})) {
      const [section, index] = key.split(':') as [SectionKey, string];
      const hit = copy[section].hits[+index];
      if (change.bonus) hit.bonus = (hit.bonus ?? 0) + change.bonus;
      if (change.buffs) hit.buffs = [...hit.buffs ?? [], ...change.buffs];
      if (change.parts) hit.parts = [...hit.parts, ...change.parts];
      if (change.multiplier) hit.multiplier = +((hit.multiplier ?? 1) * change.multiplier).toFixed(4);
      if (change.statusMax) hit.statusMax = change.statusMax;
    }
    for (const { section, hit } of node.newHits ?? []) {
      copy[section].hits.push(structuredClone(hit));
      if (hit.kind === 'heal') copy.hasHealing = copy.healsAllies = true;
    }
    if (node.passiveBuffs) copy.passiveBuffs = [...copy.passiveBuffs ?? [], ...node.passiveBuffs];
    if (node.outroStatBuffs) copy.outro.statBuffs = [...copy.outro.statBuffs ?? [], ...node.outroStatBuffs];
    if (node.outroBuffs) copy.outro.buffs = [...copy.outro.buffs ?? [], ...node.outroBuffs];
    if (node.followUps) copy.followUps = [...copy.followUps ?? [], ...node.followUps];
    for (const [index, buffs] of Object.entries(node.stateBuffs ?? {})) {
      const state = copy.states![+index];
      state.buffs = [...state.buffs ?? [], ...buffs];
    }
    if (node.states) copy.states = [...copy.states ?? [], ...structuredClone(node.states)];
    if (node.coordinated && copy.coordinated) {
      if (node.coordinated.duration) copy.coordinated.duration = node.coordinated.duration;
      if (node.coordinated.max) copy.coordinated.max = node.coordinated.max;
      copy.coordinated.perKind = { ...copy.coordinated.perKind, ...node.coordinated.perKind };
    }
    if (node.field && copy.field) Object.assign(copy.field, node.field);
    for (const [index, change] of Object.entries(node.statuses ?? {})) {
      const rule = copy.statuses![+index];
      if (change.hits) rule.hits = { ...rule.hits, ...change.hits };
      if (change.outroBoost && rule.outroBoost) rule.outroBoost.amplification += change.outroBoost;
      if (change.fillsMax) rule.fillsMax = [...rule.fillsMax ?? [], ...change.fillsMax];
      if (change.keepsOnConsume) rule.keepsOnConsume = true;
      if (change.burst) rule.burst = change.burst;
      if (change.alwaysBoost) rule.alwaysBoost = change.alwaysBoost;
      if (change.mark && rule.mark) Object.assign(rule.mark, change.mark);
      if (change.bursts) rule.bursts = [...rule.bursts ?? [], ...change.bursts];
      if (change.crit) rule.crit = change.crit;
      if (change.bite && rule.bite) {
        if (change.bite.levelBonus !== undefined) rule.bite.levels.bonus = change.bite.levelBonus;
        if (change.bite.extraMultiplier !== undefined) rule.bite.levels.extra.multiplier = change.bite.extraMultiplier;
      }
      if (change.maxBurst && rule.maxBurst) {
        if (change.maxBurst.perTrail !== undefined) rule.maxBurst.perTrail = change.maxBurst.perTrail;
        if (change.maxBurst.stateValue !== undefined && rule.maxBurst.state) rule.maxBurst.state.value = change.maxBurst.stateValue;
      }
    }
    for (const [index, change] of Object.entries(node.counters ?? {})) {
      const counter = copy.counters![+index];
      if (change.max !== undefined) counter.max = change.max;
      if (change.amounts) counter.amounts = { ...counter.amounts, ...change.amounts };
      if (change.boost !== undefined && counter.boost) counter.boost.value = change.boost;
    }
    if (node.bonusRate) copy.bonusRate = { ...copy.bonusRate, ...node.bonusRate };
  }
  return copy;
}
