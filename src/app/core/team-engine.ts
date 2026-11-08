import { Amplification, noAmplification } from './damage-engine';
import { OutroBuff, RotationStep } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';

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
  }
}

/** A buff of an Outro while it lasts */
interface ActiveBuff {
  buff: OutroBuff;
  /** Slot of the member that gave it, and the position of the buff in its Outro (the same buff given again renews it) */
  giver: number;
  position: number;
  /** Slot of the member that receives it; null for the whole team */
  receiver: number | null;
  points: number;
  label: string;
}

export interface TeamHitRow {
  rotation: number;
  slot: number;
  step: RotationStep;
  name: string;
  /** Labels of the buffs that applied to the hit */
  buffs: string[];
  /** Damage hit (healing and shield are listed, not added up) */
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

/**
 * Plays the team rotation hit by hit: A (without Intro in the first rotation) -> B -> C, 1 or 2 times.
 * Each Outro with buffs starts them; every following hit spends its points from every active buff, and a hit still gets
 * a buff that had points left before it. "incoming" buffs go to the next member; those that end on switch end after its Outro
 */
export function simulateTeam(members: Character[], steps: RotationStep[][], rotations: number): TeamResult {
  const rows: TeamHitRow[] = [];
  let active: ActiveBuff[] = [];

  for (let rotation = 0; rotation < rotations; rotation++) {
    members.forEach((character, slot) => {
      const intro = slot > 0 || rotation > 0 ? sectionSteps(character, 'intro') : [];
      for (const step of [...intro, ...steps[slot], ...sectionSteps(character, 'outro')]) {
        const applied = active.filter(a => a.receiver === null || a.receiver === slot);
        const base = character.rotationHit(step);
        const buffed = applied.length ? character.rotationHit(step, amplificationOf(applied, character)).value : base.value;
        rows.push({
          rotation, slot, step,
          name: character.stepHit(step)?.name ?? character.mainEcho?.name ?? '—',
          buffs: applied.map(a => a.label),
          damage: base.type === 'damage',
          base: base.value,
          buffed,
        });
        const cost = stepCost(character, step);
        active = active.map(a => ({ ...a, points: a.points - cost })).filter(a => a.points > 0);
      }

      // Buffs received that end when this member leaves the field
      active = active.filter(a => !(a.buff.endsOnSwitch && a.receiver === slot));

      // The Outro starts its buffs; the same one given again renews its duration
      const next = (slot + 1) % members.length;
      const hasNext = slot < members.length - 1 || rotation < rotations - 1;
      (character.data.outro.buffs ?? []).forEach((buff, position) => {
        if (buff.target === 'incoming' && !hasNext) return;
        active = active.filter(a => !(a.giver === slot && a.position === position));
        active.push({
          buff, giver: slot, position,
          receiver: buff.target === 'incoming' ? next : null,
          points: buff.duration,
          label: `${character.name}: ${buffLabel(buff)}`,
        });
      });
    });
  }

  const sum = (list: TeamHitRow[]): TeamSum => list.filter(r => r.damage)
    .reduce((s, r) => ({ hits: s.hits + 1, base: s.base + r.base, buffed: s.buffed + r.buffed }), { hits: 0, base: 0, buffed: 0 });
  return { rows, members: members.map((_, slot) => sum(rows.filter(r => r.slot === slot))), total: sum(rows) };
}

/** Steps of the intro or the outro of a character */
export function sectionSteps(character: Character, section: 'intro' | 'outro'): RotationStep[] {
  return character.data[section].hits.map((_, index): RotationStep => ({ section, index }));
}

/** Amplifications of the active buffs added up; an elemental one counts only for a character of its element */
function amplificationOf(buffs: ActiveBuff[], character: Character): Amplification {
  const amplification = noAmplification();
  for (const { buff } of buffs) {
    if (buff.amplification === 'elemental' && buff.element !== character.data.type) continue;
    amplification[buff.amplification] += buff.value;
  }
  return amplification;
}

function buffLabel(buff: OutroBuff): string {
  const kind = buff.amplification === 'elemental' ? buff.element! : buff.amplification;
  return `${kind[0].toUpperCase() + kind.slice(1)} +${buff.value}%`;
}
