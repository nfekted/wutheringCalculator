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
    }
    for (const { section, hit } of node.newHits ?? []) {
      copy[section].hits.push(structuredClone(hit));
      if (hit.kind === 'heal') copy.hasHealing = copy.healsAllies = true;
    }
    if (node.passiveBuffs) copy.passiveBuffs = [...copy.passiveBuffs ?? [], ...node.passiveBuffs];
    if (node.outroStatBuffs) copy.outro.statBuffs = [...copy.outro.statBuffs ?? [], ...node.outroStatBuffs];
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
    }
  }
  return copy;
}
