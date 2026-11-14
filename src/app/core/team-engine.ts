import { Amplification, Stats, noAmplification } from './damage-engine';
import { CoordinatedAttack, HitKey, OutroBuff, RotationStep, StatBuff } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { advance, keyStep, spendsPoints, startContext, stepCost, stepKey, units } from './rotation-rules';

export { stepCost };

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
  /** Added by another hit, not picked (a Coordinated Attack, the hit of a mark) */
  auto?: boolean;
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

/** A Coordinated Attack while it lasts, with how many hits it fired */
interface ActiveCoordinated {
  character: Character;
  slot: number;
  attack: CoordinatedAttack;
  points: number;
  fired: number;
}

/** A buff with the label shown on the hits it applies to */
interface LabeledBuff {
  buff: StatBuff;
  label: string;
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
  /** Hit that replaces the next Intro of each member (a state of it ended) */
  const nextIntro = new Map<number, string>();
  let coordinated: ActiveCoordinated[] = [];

  segments.forEach(({ character, slot, rotation, steps }, i) => {
    const states = character.data.states ?? [];
    const replaced = nextIntro.get(slot);
    if (replaced && steps.some(step => step.section === 'intro')) {
      steps = [keyStep(replaced), ...steps.filter(step => step.section !== 'intro')];
      nextIntro.delete(slot);
    }
    const spends = spendsPoints(character.data, steps);
    // Buffs of a hit start after its whole linked block (e.g. a buff of a burst of bullets starts after the last one)
    const blockOf: RotationStep[] = [];
    const blockEnd: boolean[] = [];
    for (const unit of units(character.data, steps)) unit.forEach((_, j) => { blockOf.push(unit[0]); blockEnd.push(j === unit.length - 1); });
    let context = startContext();
    /** Marks held (indexes in `data.markers`); they go on the Outro */
    const markers = character.data.markers ?? [];
    const held = new Set<number>();

    // A hit added by another one: worth its value with the buffs on its member, in the same action (it spends nothing)
    const autoRow = (who: Character, whoSlot: number, key: HitKey, others: LabeledBuff[]) => {
      const step = keyStep(key);
      const value = valueOf(who, whoSlot, step, active, others);
      rows.push({ rotation, slot: whoSlot, step, name: who.stepHit(step)?.name ?? '—', buffs: value.labels, damage: value.type === 'damage', base: value.base, buffed: value.buffed, auto: true });
    };

    steps.forEach((step, position) => {
      const key = stepKey(step);
      const stateBuffs = context.states.flatMap(s => (states[s].buffs ?? []).map(buff => ({ buff, label: `${states[s].name}: ${statLabel(buff)}` })));
      const hit = character.stepHit(step);
      const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;

      // A hit of the kind that always crits, when its cooldown is over
      const crit = character.data.guaranteedCrit;
      const crits = !!crit && kind === crit.kind && !(critCooldown.get(slot)! > 0);

      // Extra damage of a hit that comes right after some others (not a buff: it counts without the buffs too)
      const bonusAfter = hit?.bonusAfter && context.last && hit.bonusAfter.after.includes(context.last) ? hit.bonusAfter : undefined;
      const value = valueOf(character, slot, step, active, stateBuffs, crits, bonusAfter?.multiplier);
      rows.push({
        rotation, slot, step,
        name: step.section === 'end' ? `Leave ${states[step.index]?.name ?? ''}` : hit?.name ?? character.mainEcho?.name ?? '—',
        buffs: step.section === 'end' ? [] : [...value.labels, ...(crits ? [`${crit!.name} (crit)`] : []), ...(bonusAfter ? [`${bonusAfter.name} (×${bonusAfter.multiplier})`] : [])],
        damage: value.type === 'damage',
        base: value.base,
        buffed: value.buffed,
      });

      // Detonating: the hit of each mark held, then the mark goes; a hit can leave a mark
      markers.forEach((marker, m) => {
        if (marker.detonate === key && held.delete(m)) autoRow(character, slot, marker.hit, stateBuffs);
      });
      markers.forEach((marker, m) => { if (marker.gain.includes(key)) held.add(m); });

      // Coordinated Attacks: each Basic or Heavy action (only the first hit of a linked block) fires them
      const fires = spends[position] ? kind : undefined;
      for (const c of fires ? coordinated : []) {
        for (let n = 0; n < (c.attack.perKind[fires!] ?? 0); n++) {
          const stacking = c.attack.stacking;
          const stacks = Math.min(c.fired, stacking?.max ?? 0);
          const buff: StatBuff | undefined = stacking && stacks ? { name: stacking.name, stat: 'damageBonus', value: +(stacks * stacking.value).toFixed(2) } : undefined;
          autoRow(c.character, c.slot, c.attack.hit, buff ? [{ buff, label: `${c.character.name}: ${statLabel(buff)}` }] : []);
          c.fired++;
        }
      }

      // In a linked block (and in the Intro) only the first hit spends points
      const cost = spends[position] ? stepCost(character, step) : 0;
      active = active.map(a => ({ ...a, points: a.points - cost })).filter(a => a.points > 0);
      coordinated = coordinated.map(c => ({ ...c, points: c.points - cost })).filter(c => c.points > 0);
      for (const [member, left] of critCooldown) critCooldown.set(member, left - cost);
      if (crits) critCooldown.set(slot, crit!.cooldown);

      // A Coordinated Attack starts after its hit; casting it again starts it over
      const attack = character.data.coordinated;
      if (attack?.start === key) {
        coordinated = [...coordinated.filter(c => c.slot !== slot), { character, slot, attack, points: attack.duration, fired: 0 }];
      }

      // Buffs the hit gives the character itself start after it (after its block)
      const giver = blockOf[position];
      if (blockEnd[position]) character.stepHit(giver)?.buffs?.forEach(buff => {
        if (!buff.duration) return;
        // By name: the same buff given by another hit (e.g. two Skills with the same Inherent Skill) renews it
        const id = `self:${slot}:${buff.name}`;
        active = active.filter(a => a.id !== id);
        active.push({ id, receiver: slot, points: buff.duration, label: `${character.name}: ${statLabel(buff)}`, stat: buff });
      });
      // A state that ends gives its hit for the next Intro
      if (step.section === 'end' && states[step.index]?.nextIntro) nextIntro.set(slot, states[step.index].nextIntro!);
      context = advance(character, context, step, spends[position]);
    });

    // States still active end on the Outro
    for (const s of context.states) if (states[s].nextIntro) nextIntro.set(slot, states[s].nextIntro!);

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

  // A step worth nothing on its own (e.g. casting a Liberation that only enters a state) is not counted as a hit
  const sum = (list: TeamHitRow[]): TeamSum => list.filter(r => r.damage && r.base > 0)
    .reduce((s, r) => ({ hits: s.hits + 1, base: s.base + r.base, buffed: s.buffed + r.buffed }), { hits: 0, base: 0, buffed: 0 });
  const members = Array.from({ length: memberCount }, (_, slot) => sum(rows.filter(r => r.slot === slot)));
  return { rows, members, total: sum(rows) };
}

/** Bonuses of one kind of hit */
const KIND_OF: Partial<Record<StatBuff['stat'], string>> = { liberationBonus: 'liberation', heavyBonus: 'heavy', skillBonus: 'skill' };

/**
 * Value of a hit of a member, without and with the buffs on it: the Outro ones and its own, and `others` (its states...). Only the buffs
 * that do something for the hit apply and are listed: not a bonus of another kind, not one for other hits, not another element
 */
function valueOf(character: Character, slot: number, step: RotationStep, active: ActiveBuff[], others: LabeledBuff[], crit = false, times = 1) {
  const key = stepKey(step);
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  const fits = (buff?: StatBuff) => !buff || ((!buff.hits || buff.hits.includes(key)) && (!(buff.stat in KIND_OF) || kind === KIND_OF[buff.stat]));
  const applied = active.filter(a => (a.receiver === null || a.receiver === slot) && fits(a.stat)
    && !(a.outro?.amplification === 'elemental' && a.outro.element !== character.data.type)
    && !(a.outro && a.outro.amplification !== 'all' && a.outro.amplification !== 'elemental' && a.outro.amplification !== kind));
  const own = others.filter(o => fits(o.buff));
  const statBuffs = [...applied.flatMap(a => a.stat ? [a.stat] : []), ...own.map(o => o.buff)];
  const amplification = applied.some(a => a.outro) ? amplificationOf(applied, character) : undefined;
  const extra = statBuffs.length ? extraStats(statBuffs, character) : undefined;
  const critExtra = crit ? { ...extra, cChance: (extra?.cChance ?? 0) + 100 } : extra;
  const alone = character.rotationHit(step);
  const base = alone.value * times;
  const buffed = amplification || critExtra ? character.rotationHit(step, amplification, critExtra).value * times : base;
  return { type: alone.type, base, buffed, labels: [...applied.map(a => a.label), ...own.map(o => o.label)] };
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
  const stat = { atk: 'ATK', damageBonus: 'DMG', elementalBonus: 'Elemental DMG', liberationBonus: 'Liberation DMG', heavyBonus: 'Heavy DMG', skillBonus: 'Skill DMG' }[buff.stat];
  return `${buff.name} (${stat} +${buff.value}%)`;
}
