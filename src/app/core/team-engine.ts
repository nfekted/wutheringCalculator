import { Amplification, Stats, noAmplification } from './damage-engine';
import { OutroBuff, RotationStep, StatBuff } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { advance, spendsPoints, startContext } from './rotation-rules';

/** Points a step spends from every active buff: by its section; in the Basic section a Heavy hit is 1; an Echo that transforms is 3 */
export function stepCost(character: Character, step: RotationStep): number {
  if (step.section === 'echo') return character.mainEcho?.transform ? 3 : 0;
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  switch (step.section) {
    case 'basic': return kind === 'heavy' ? 1 : 0.5;
    case 'skill': return 0.5;
    case 'liberation': return 3;
    case 'intro': return 1;
    case 'forte': return 2;
    case 'outro': return 0;
    case 'end': return 0;
  }
}

/** A buff while it lasts: from an Outro (DMG Amplification) or from a hit of the character itself (an attribute) */
interface ActiveBuff {
  /** The same buff given again renews its duration */
  id: string;
  /** Slot of the member that receives it; null for the whole team */
  receiver: number | null;
  points: number;
  endsOnSwitch?: boolean;
  label: string;
  outro?: OutroBuff;
  stat?: StatBuff;
}

export interface TeamHitRow {
  rotation: number;
  slot: number;
  step: RotationStep;
  name: string;
  /** Labels of the buffs that applied to the hit */
  buffs: string[];
  /** Damage hit (healing, shield and leaving a state are listed, not added up) */
  damage: boolean;
  /** Value without and with the buffs */
  base: number;
  buffed: number;
}

export interface TeamSum {
  hits: number;
  base: number;
  buffed: number;
}

export interface TeamResult {
  rows: TeamHitRow[];
  members: TeamSum[];
  total: TeamSum;
}

/** Steps of the intro or the outro of a character */
export function sectionSteps(character: Character, section: 'intro' | 'outro'): RotationStep[] {
  return character.data[section].hits.map((_, index): RotationStep => ({ section, index }));
}

interface Segment {
  character: Character;
  slot: number;
  rotation: number;
  /** Every step of the segment: Intro (when it has one), the hits and the Outro */
  steps: RotationStep[];
}

/**
 * Plays the team rotation hit by hit: A (without Intro in the first rotation) -> B -> C, 1 or 2 times.
 * Each Outro with buffs starts them; every following hit spends its points from every active buff, and a hit still gets
 * a buff that had points left before it. "incoming" buffs go to the next member; those that end on switch end after its Outro.
 * Hits of the character itself can start buffs (after the hit) and states (whose buffs last until the state ends or the Outro)
 */
export function simulateTeam(members: Character[], steps: RotationStep[][], rotations: number): TeamResult {
  const segments: Segment[] = [];
  for (let rotation = 0; rotation < rotations; rotation++) {
    members.forEach((character, slot) => {
      const intro = slot > 0 || rotation > 0 ? sectionSteps(character, 'intro') : [];
      segments.push({ character, slot, rotation, steps: [...intro, ...steps[slot], ...sectionSteps(character, 'outro')] });
    });
  }
  return simulate(segments, members.length);
}

/** Rotation build of one character: Intro, the hits and the Outro, with the buffs it gives itself */
export function simulateRotation(character: Character, steps: RotationStep[]): TeamResult {
  const all = [...sectionSteps(character, 'intro'), ...steps, ...sectionSteps(character, 'outro')];
  return simulate([{ character, slot: 0, rotation: 0, steps: all }], 1);
}

function simulate(segments: Segment[], memberCount: number): TeamResult {
  const rows: TeamHitRow[] = [];
  let active: ActiveBuff[] = [];
  /** Points left until the guaranteed crit of each member is ready again */
  const critCooldown = new Map<number, number>();

  segments.forEach(({ character, slot, rotation, steps }, i) => {
    const states = character.data.states ?? [];
    const spends = spendsPoints(character.data, steps);
    let context = startContext();

    steps.forEach((step, position) => {
      const applied = active.filter(a => a.receiver === null || a.receiver === slot);
      const stateBuffs = context.states.flatMap(s => (states[s].buffs ?? []).map(buff => ({ buff, label: `${states[s].name}: ${statLabel(buff)}` })));
      const statBuffs = [...applied.flatMap(a => a.stat ? [a.stat] : []), ...stateBuffs.map(s => s.buff)];
      const amplification = applied.some(a => a.outro) ? amplificationOf(applied, character) : undefined;
      const extra = statBuffs.length ? extraStats(statBuffs, character) : undefined;

      // A hit of the kind that always crits, when its cooldown is over
      const crit = character.data.guaranteedCrit;
      const hit = character.stepHit(step);
      const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
      const crits = !!crit && kind === crit.kind && !(critCooldown.get(slot)! > 0);
      const critExtra = crits ? { ...extra, cChance: (extra?.cChance ?? 0) + 100 } : extra;

      const base = character.rotationHit(step);
      const buffed = amplification || critExtra ? character.rotationHit(step, amplification, critExtra).value : base.value;
      rows.push({
        rotation, slot, step,
        name: step.section === 'end' ? `Leave ${states[step.index]?.name ?? ''}` : character.stepHit(step)?.name ?? character.mainEcho?.name ?? '—',
        // An elemental buff of another element is not listed: it does nothing for this character
        buffs: step.section === 'end' ? [] : [...applied.filter(a => !(a.outro?.amplification === 'elemental' && a.outro.element !== character.data.type)).map(a => a.label), ...stateBuffs.map(s => s.label), ...(crits ? [`${crit!.name} (crit)`] : [])],
        damage: base.type === 'damage',
        base: base.value,
        buffed,
      });

      // In a linked block (and in the Intro) only the first hit spends points
      const cost = spends[position] ? stepCost(character, step) : 0;
      active = active.map(a => ({ ...a, points: a.points - cost })).filter(a => a.points > 0);
      for (const [member, left] of critCooldown) critCooldown.set(member, left - cost);
      if (crits) critCooldown.set(slot, crit!.cooldown);

      // Buffs the hit gives the character itself start after it
      character.stepHit(step)?.buffs?.forEach((buff, position) => {
        if (!buff.duration) return;
        const id = `hit:${slot}:${step.section}:${step.index}:${position}`;
        active = active.filter(a => a.id !== id);
        active.push({ id, receiver: slot, points: buff.duration, label: `${character.name}: ${statLabel(buff)}`, stat: buff });
      });
      context = advance(character, context, step);
    });

    // Buffs received that end when this member leaves the field
    active = active.filter(a => !(a.endsOnSwitch && a.receiver === slot));

    // The Outro starts its buffs; the same one given again renews its duration
    const next = segments[i + 1]?.slot;
    (character.data.outro.buffs ?? []).forEach((buff, position) => {
      if (buff.target === 'incoming' && next === undefined) return;
      const id = `outro:${slot}:${position}`;
      active = active.filter(a => a.id !== id);
      active.push({
        id, outro: buff, endsOnSwitch: buff.endsOnSwitch,
        receiver: buff.target === 'incoming' ? next! : null,
        points: buff.duration,
        label: `${character.name}: ${outroLabel(buff)}`,
      });
    });
  });

  const sum = (list: TeamHitRow[]): TeamSum => list.filter(r => r.damage)
    .reduce((s, r) => ({ hits: s.hits + 1, base: s.base + r.base, buffed: s.buffed + r.buffed }), { hits: 0, base: 0, buffed: 0 });
  const members = Array.from({ length: memberCount }, (_, slot) => sum(rows.filter(r => r.slot === slot)));
  return { rows, members, total: sum(rows) };
}

/** Amplifications of the active Outro buffs added up; an elemental one counts only for a character of its element */
function amplificationOf(buffs: ActiveBuff[], character: Character): Amplification {
  const amplification = noAmplification();
  for (const { outro } of buffs) {
    if (!outro) continue;
    if (outro.amplification === 'elemental' && outro.element !== character.data.type) continue;
    amplification[outro.amplification] += outro.value;
  }
  return amplification;
}

/** Attributes the buffs add: ATK as a percentage of the base ATK, the others as they are */
function extraStats(buffs: StatBuff[], character: Character): Partial<Stats> {
  const extra: Partial<Stats> = {};
  for (const buff of buffs) {
    if (buff.stat === 'atk') extra.dmg = (extra.dmg ?? 0) + character.data.base.atk * buff.value / 100;
    // Every damage hit of the character gets the elemental bonus, so a DMG Bonus on all of them is added there
    else if (buff.stat === 'damageBonus') extra.elementalBonus = (extra.elementalBonus ?? 0) + buff.value;
    else extra[buff.stat] = (extra[buff.stat] ?? 0) + buff.value;
  }
  return extra;
}

function outroLabel(buff: OutroBuff): string {
  const kind = buff.amplification === 'elemental' ? buff.element! : buff.amplification;
  return `${kind[0].toUpperCase() + kind.slice(1)} +${buff.value}%`;
}

function statLabel(buff: StatBuff): string {
  const stat = buff.stat === 'atk' ? 'ATK' : buff.stat === 'damageBonus' ? 'DMG' : 'Elemental DMG';
  return `${buff.name} (${stat} +${buff.value}%)`;
}
