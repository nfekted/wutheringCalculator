import { Amplification, Stats, noAmplification } from './damage-engine';
import { CoordinatedAttack, HitKey, OutroBuff, RotationStep, StatBuff, TeamField, CharacterStatus } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { NEGATIVE_STATUS, NegativeStatus, statusTick } from './negative-status';
import { advance, counterBonuses, counterBoosted, isStart, keyStep, spendsPoints, startContext, stepCost, stepKey, units } from './rotation-rules';

export { stepCost };

/** A buff while it lasts: from an Outro (DMG Amplification) or from a hit of the character itself (an attribute) */
interface ActiveBuff {
  /** The same buff given again renews its duration */
  id: string;
  /** Slot of the member that receives it; null for the whole team */
  receiver: number | null;
  points: number;
  endsOnSwitch?: boolean;
  /** Ends when the member that gave it comes back to the field */
  endsOnReturn?: boolean;
  label: string;
  outro?: OutroBuff;
  stat?: StatBuff;
  /** Stacks of a stat buff that stacks */
  count?: number;
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
  return character.sectionSteps(section);
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
  return simulate(segments, members.length, true);
}

/** A Coordinated Attack while it lasts, with how many hits it fired */
interface ActiveCoordinated {
  character: Character;
  slot: number;
  attack: CoordinatedAttack;
  points: number;
  fired: number;
  /** Points since it last fired */
  since: number;
}

/** A Negative Status on the target while it lasts; the member that applied the last stack gets its ticks */
interface ActiveStatus {
  status: NegativeStatus;
  stacks: number;
  points: number;
  /** Points since the last tick (or since it started) */
  since: number;
  character: Character;
  slot: number;
  step: RotationStep;
}

/** A field of a member while it lasts, with the level it reached */
interface ActiveField {
  character: Character;
  slot: number;
  field: TeamField;
  points: number;
  level: number;
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

/** `statuses`: whether the Negative Statuses on the target count (only for the team) */
function simulate(segments: Segment[], memberCount: number, statuses = false): TeamResult {
  const rows: TeamHitRow[] = [];
  let onTarget: ActiveStatus[] = [];
  /** Raises of the max stacks of a status while they last */
  let maxRaises: { status: NegativeStatus; extra: number; points: number; slot?: number }[] = [];
  const maxOf = (status: NegativeStatus) => NEGATIVE_STATUS[status].max
    + maxRaises.filter(r => r.status === status).reduce((sum, r) => sum + r.extra, 0);
  /** Points left in which the ticks of a status take no stack */
  const pauses = new Map<NegativeStatus, number>();
  /** DMG Amplification and longer interval of a status while they last */
  let statusBoosts: { status: NegativeStatus; amplification: number; intervalRate: number; points: number; label: string }[] = [];
  /** A tick of a status, with the boosts on it */
  const tickRow = (s: ActiveStatus, rotation: number, boosts: typeof statusBoosts, name = NEGATIVE_STATUS[s.status].name) => {
    const base = statusTick(s.status, s.stacks);
    const buffed = base * (1 + boosts.reduce((sum, b) => sum + b.amplification, 0) / 100);
    rows.push({ rotation, slot: s.slot, step: s.step, name: `${name} (${s.stacks})`, buffs: boosts.map(b => b.label), damage: true, base, buffed, auto: true });
  };
  /** Statuses a member of the team converts as soon as they are applied */
  const converts = new Map<NegativeStatus, string>();
  for (const { character } of segments) for (const rule of character.data.statuses ?? []) if (rule.convert) converts.set(rule.status, rule.convert);
  /** The DMG Amplification of the statuses, on the hits of the character considered damage of them */
  const statusAmplification = (character: Character): LabeledBuff[] => (character.data.statuses ?? []).flatMap(rule => !rule.counts ? []
    : statusBoosts.filter(b => b.status === rule.status).map(b => ({ buff: { name: b.label, stat: 'amplification' as const, value: b.amplification, hits: rule.counts }, label: b.label })));
  /** The DMG Amplification of the hit by the stacks on the target */
  const stacksAmplification = (character: Character, key: HitKey): LabeledBuff[] => (character.data.statuses ?? []).flatMap(rule => {
    const stacks = onTarget.find(s => s.status === rule.status)?.stacks ?? 0;
    const values: { name: string; value: number }[] = [];
    if (rule.amplifiedBy) values.push({ name: rule.amplifiedBy.name, value: rule.amplifiedBy.values[Math.min(stacks, rule.amplifiedBy.values.length - 1)] });
    if (rule.consume?.hit === key) values.push({ name: rule.consume.name, value: Math.min(stacks, rule.consume.max) * rule.consume.perStack });
    return values.filter(v => v.value).map(v => {
      const buff: StatBuff = { name: v.name, stat: 'amplification', value: v.value };
      return { buff, label: `${character.name}: ${statLabel(buff)}` };
    });
  });
  /** The boost a state of the character gives the status, while the character is in it */
  const stateBoostOf = (character: Character, rule: CharacterStatus, states: number[], points: number) => {
    const boost = rule.stateBoost;
    if (!boost || !boost.states.every(s => states.includes(s))) return undefined;
    return { status: rule.status, amplification: boost.amplification, intervalRate: boost.intervalRate, points, label: `${character.name}: ${boost.name} (+${boost.amplification}%)` };
  };

  /** Time passes for the statuses on the target: a tick every interval while they last */
  const passTime = (points: number, rotation: number) => {
    for (const s of onTarget) {
      let left = points;
      let elapsed = 0;
      while (s.points > 0) {
        const boosts = statusBoosts.filter(b => b.status === s.status && b.points > elapsed);
        const interval = boosts.reduce((value, b) => value * b.intervalRate, NEGATIVE_STATUS[s.status].interval);
        const next = interval - s.since;
        if (next > left || next > s.points) {
          const spent = Math.min(left, s.points);
          s.points -= spent;
          s.since += spent;
          break;
        }
        left -= next;
        s.points -= next;
        s.since = 0;
        elapsed += next;
        tickRow(s, rotation, boosts);
        // A status without duration loses 1 stack each tick
        const paused = (pauses.get(s.status) ?? 0) > elapsed;
        if (NEGATIVE_STATUS[s.status].duration === undefined && !paused && --s.stacks <= 0) s.points = 0;
      }
    }
    onTarget = onTarget.filter(s => s.points > 0);
    for (const [status, left] of pauses) pauses.set(status, left - points);
    statusBoosts = statusBoosts.map(b => ({ ...b, points: b.points - points })).filter(b => b.points > 0);
    maxRaises = maxRaises.map(r => ({ ...r, points: r.points - points })).filter(r => r.points > 0);
    for (const s of onTarget) s.stacks = Math.min(s.stacks, maxOf(s.status));
  };
  let active: ActiveBuff[] = [];
  // Buffs always active, for the member or for the team while the member is in it
  for (const { character, slot } of segments) for (const buff of character.data.passiveBuffs ?? []) {
    const id = `always:${slot}:${buff.name}`;
    const receiver = buff.target === 'team' ? null : slot;
    if (!active.some(a => a.id === id)) active.push({ id, receiver, points: Infinity, label: `${character.name}: ${statLabel(buff)}`, stat: buff, count: 1 });
  }
  /** Points left until the guaranteed crit of each member is ready again */
  const critCooldown = new Map<number, number>();
  /** Hit that replaces the next Intro of each member (a state of it ended) */
  const nextIntro = new Map<number, string>();
  let coordinated: ActiveCoordinated[] = [];
  let fields: ActiveField[] = [];
  /** Buffs of the levels the active fields reached, for every member */
  const fieldBuffs = (): LabeledBuff[] => fields.flatMap(f => f.field.levels.slice(0, f.level).map(level => {
    const buff: StatBuff = { name: level.name, stat: level.stat, value: +Math.min(level.max, f.character.energyRegen * level.perEnergyRegen).toFixed(2) };
    return { buff, label: `${f.character.name}: ${statLabel(buff)}` };
  }));

  /** An attribute buff of a member, to itself or to the whole team; by name, the same buff given again (by any hit) renews it */
  const give = (character: Character, slot: number, buff: StatBuff) => {
    if (!buff.duration) return;
    const id = `self:${slot}:${buff.name}`;
    const count = buff.stacks ? Math.min((active.find(a => a.id === id)?.count ?? 0) + 1, buff.stacks) : 1;
    const stat = scaled(character, buff, count);
    if (!stat.value) return;
    active = active.filter(a => a.id !== id);
    active.push({ id, receiver: buff.target === 'team' ? null : slot, points: buff.duration, label: `${character.name}: ${statLabel(stat)}`, stat, count, endsOnReturn: buff.endsOnReturn });
  };

  segments.forEach(({ character, slot, rotation, steps }, i) => {
    const states = character.data.states ?? [];
    // What ends when the member comes back to the field
    active = active.filter(a => !(a.endsOnReturn && a.id.startsWith(`self:${slot}:`)));
    coordinated = coordinated.filter(c => !(c.attack.endsOnReturn && c.slot === slot));
    const replaced = nextIntro.get(slot);
    if (replaced && steps.some(step => step.section === 'intro')) {
      steps = [keyStep(replaced), ...steps.filter(step => step.section !== 'intro')];
      nextIntro.delete(slot);
    }
    // A field of the member at its top level: its Intro is the one of the field, and it ends the field
    const top = fields.find(f => f.slot === slot && f.level === f.field.levels.length);
    if (top && steps.some(step => step.section === 'intro')) {
      steps = [...top.field.intro.map(keyStep), ...steps.filter(step => step.section !== 'intro')];
      fields = fields.filter(f => f !== top);
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
    /** Hits each state added since it started (by index in `data.states`) */
    const autoCount = new Map<number, number>();

    // A hit added by another one: worth its value with the buffs on its member, in the same action (it spends nothing)
    const autoRow = (who: Character, whoSlot: number, key: HitKey, others: LabeledBuff[]) => {
      const step = keyStep(key);
      const value = valueOf(who, whoSlot, step, active, [...others, ...fieldBuffs()]);
      rows.push({ rotation, slot: whoSlot, step, name: who.stepHit(step)?.name ?? '—', buffs: value.labels, damage: value.type === 'damage', base: value.base, buffed: value.buffed, auto: true });
    };

    steps.forEach((step, position) => {
      const key = stepKey(step);
      const stateBuffs = context.states.flatMap(s => (states[s].buffs ?? []).map(buff => scaled(character, buff))
        .filter(buff => buff.value).map(buff => ({ buff, label: `${states[s].name}: ${statLabel(buff)}` })));
      const hit = character.stepHit(step);
      const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;

      // A hit of the kind that always crits, when its cooldown is over
      const crit = character.data.guaranteedCrit;
      const crits = !!crit && kind === crit.kind && !(critCooldown.get(slot)! > 0);

      // Extra damage of a hit that comes right after some others (not a buff: it counts without the buffs too)
      const bonusAfter = hit?.bonusAfter && context.last && hit.bonusAfter.after.includes(context.last) ? hit.bonusAfter : undefined;
      // A counter boost: spent by the hit, a DMG Bonus on it
      const boosts = counterBonuses(character.data, context, key).map(boost => {
        const buff: StatBuff = { name: boost.name, stat: 'damageBonus', value: boost.value };
        return { buff, label: `${character.name}: ${statLabel(buff)}` };
      });
      const value = valueOf(character, slot, step, active, [...stateBuffs, ...boosts, ...fieldBuffs(), ...statusAmplification(character), ...(statuses ? stacksAmplification(character, key) : [])], crits, bonusAfter?.multiplier);
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

      // Hits added after some hits
      for (const followUp of character.data.followUps ?? []) if (followUp.after.includes(key)) autoRow(character, slot, followUp.hit, stateBuffs);

      // Hits a state adds after some of its hits, up to its max each time it starts
      for (const s of context.states) {
        const auto = states[s].autoHit;
        if (!auto?.after.includes(key) || (autoCount.get(s) ?? 0) >= auto.max) continue;
        autoRow(character, slot, auto.hit, stateBuffs);
        autoCount.set(s, (autoCount.get(s) ?? 0) + 1);
      }
      states.forEach((state, s) => { if (isStart(state, key) && !context.states.includes(s)) autoCount.set(s, 0); });

      // Detonating a Coordinated Attack: its detonation hit, in the same action, and it ends
      for (const c of coordinated.filter(c => c.attack.detonatedBy?.includes(key) && c.slot === slot)) {
        if (c.attack.detonation) autoRow(c.character, c.slot, c.attack.detonation, []);
        coordinated = coordinated.filter(other => other !== c);
      }

      // Coordinated Attacks: each Basic or Heavy action (only the first hit of a linked block) fires them
      const fires = spends[position] ? kind : undefined;
      for (const c of fires ? coordinated : []) {
        const times = c.attack.perKind[fires!] ?? 0;
        if (!times || c.since < (c.attack.interval ?? 0) || (c.attack.othersOnly && c.slot === slot)) continue;
        c.since = 0;
        for (let n = 0; n < times && !(c.attack.max && c.fired >= c.attack.max); n++) {
          const stacking = c.attack.stacking;
          const stacks = Math.min(c.fired, stacking?.max ?? 0);
          const buff: StatBuff | undefined = stacking && stacks ? { name: stacking.name, stat: 'damageBonus', value: +(stacks * stacking.value).toFixed(2) } : undefined;
          for (const key of c.attack.hits) autoRow(c.character, c.slot, key, buff ? [{ buff, label: `${c.character.name}: ${statLabel(buff)}` }] : []);
          c.fired++;
        }
      }

      // In a linked block (and in the Intro) only the first hit spends points
      const cost = spends[position] ? stepCost(character, step) : 0;
      active = active.map(a => ({ ...a, points: a.points - cost })).filter(a => a.points > 0);
      fields = fields.map(f => ({ ...f, points: f.points - cost })).filter(f => f.points > 0);
      coordinated = coordinated.map(c => ({ ...c, points: c.points - cost, since: c.since + cost })).filter(c => c.points > 0 && !(c.attack.max && c.fired >= c.attack.max));
      // A state boost lasts while the character is in the state: given again for each hit
      for (const rule of statuses ? character.data.statuses ?? [] : []) {
        const boost = stateBoostOf(character, rule, context.states, cost);
        if (boost) statusBoosts = [...statusBoosts.filter(b => b.label !== boost.label), boost];
      }
      if (statuses) passTime(cost, rotation);
      for (const [member, left] of critCooldown) critCooldown.set(member, left - cost);
      if (crits) critCooldown.set(slot, crit!.cooldown);

      // A Coordinated Attack starts after its hit; casting it again starts it over
      // An Intro (after its last hit) raises every field; a field starts after its hit, and casting it again starts it over
      if (step.section === 'intro' && steps[position + 1]?.section !== 'intro') {
        fields = fields.map(f => ({ ...f, level: Math.min(f.level + 1, f.field.levels.length) }));
      }
      const field = character.data.field;
      if (field?.start === key) fields = [...fields.filter(f => f.slot !== slot), { character, slot, field, points: field.duration, level: 0 }];

      const attack = character.data.coordinated;
      if (attack?.start === key) {
        coordinated = [...coordinated.filter(c => c.slot !== slot), { character, slot, attack, points: attack.duration, fired: 0, since: Infinity }];
      }

      // Buffs the hit gives the character itself start after it (after its block)
      const giver = blockOf[position];
      if (blockEnd[position]) character.stepHit(giver)?.buffs?.forEach(buff => give(character, slot, buff));
      // Stacks of a Negative Status the hit applies: up to the max, and the duration starts over
      for (const rule of statuses ? character.data.statuses ?? [] : []) {
        const stacks = rule.hits?.[key];
        if (!stacks || (rule.state !== undefined && !context.states.includes(rule.state))) continue;
        const data = NEGATIVE_STATUS[rule.status];
        const old = onTarget.find(s => s.status === rule.status);
        onTarget = onTarget.filter(s => s !== old);
        const applied: ActiveStatus = {
          status: rule.status, stacks: Math.min((old?.stacks ?? 0) + stacks, maxOf(rule.status)), points: data.duration ?? Infinity,
          since: old?.since ?? 0, character, slot, step,
        };
        const convert = converts.get(rule.status);
        if (convert) tickRow(applied, rotation, statusBoosts.filter(b => b.status === rule.status), `${data.name} → ${convert}`);
        else onTarget.push(applied);
      }
      // A hit that detonates the status: 1 tick at once, and 1 stack less; a hit that consumes it: the status is gone
      for (const rule of statuses ? character.data.statuses ?? [] : []) {
        const s = onTarget.find(s => s.status === rule.status);
        if (!s) continue;
        if (rule.detonate?.includes(key)) {
          const boost = stateBoostOf(character, rule, context.states, 0);
          tickRow({ ...s, character, slot, step }, rotation, [...statusBoosts.filter(b => b.status === rule.status && b.label !== boost?.label), ...(boost ? [boost] : [])]);
          if (--s.stacks <= 0) onTarget = onTarget.filter(other => other !== s);
        }
        if (rule.consume?.hit === key) onTarget = onTarget.filter(other => other !== s);
      }
      for (const rule of statuses ? character.data.statuses ?? [] : []) {
        const pause = rule.pause;
        if (pause?.hit !== key || (pause.counter !== undefined && !counterBoosted(character.data, context, key, pause.counter))) continue;
        pauses.set(rule.status, Math.max(pauses.get(rule.status) ?? 0, pause.duration));
      }
      // A state that ends gives its hit for the next Intro
      if (step.section === 'end' && states[step.index]?.nextIntro) nextIntro.set(slot, states[step.index].nextIntro!);
      const before = context.counters;
      context = advance(character, context, step, spends[position]);
      // A counter that gets to a value gives a buff
      (character.data.counters ?? []).forEach((counter, c) => {
        const at = counter.buffAt;
        if (at && (before[c] ?? 0) < at.value && (context.counters[c] ?? 0) >= at.value) give(character, slot, at.buff);
      });
    });

    // Hits a counter gives when the character leaves the field
    (character.data.counters ?? []).forEach((counter, c) => {
      const rule = counter.outro;
      if (!rule || (rule.state !== undefined && context.states.includes(rule.state) !== (rule.inState ?? true))) return;
      const times = Math.min(rule.max, Math.floor((context.counters[c] ?? 0) / rule.per));
      const stateBuffs = context.states.flatMap(s => (states[s].buffs ?? []).map(buff => scaled(character, buff))
        .filter(buff => buff.value).map(buff => ({ buff, label: `${states[s].name}: ${statLabel(buff)}` })));
      for (let n = 0; n < times; n++) autoRow(character, slot, rule.hit, stateBuffs);
    });

    // Hits a state still active gives on the Outro
    for (const s of context.states) {
      const rule = states[s].outroHits;
      for (let n = 0; n < (rule?.times ?? 0); n++) autoRow(character, slot, rule!.hit, []);
    }

    // States still active end on the Outro
    for (const s of context.states) if (states[s].nextIntro) nextIntro.set(slot, states[s].nextIntro!);

    // Buffs received that end when this member leaves the field
    active = active.filter(a => !(a.endsOnSwitch && a.receiver === slot));

    // The Outro starts its buffs; the same one given again renews its duration
    character.data.outro.statBuffs?.forEach(buff => give(character, slot, buff));
    for (const rule of statuses ? character.data.statuses ?? [] : []) {
      if (rule.state !== undefined && !context.states.includes(rule.state)) continue;
      if (rule.outroMax) {
        maxRaises = [...maxRaises.filter(r => r.status !== rule.status), { status: rule.status, extra: rule.outroMax.extra, points: rule.outroMax.duration }];
      }
      const boost = rule.outroBoost;
      if (boost) {
        const label = `${character.name}: ${boost.name} (+${boost.amplification}%)`;
        statusBoosts = [...statusBoosts.filter(b => b.label !== label), { status: rule.status, amplification: boost.amplification, intervalRate: boost.intervalRate, points: boost.duration, label }];
      }
    }
    // An Outro that raises the max stacks of every Negative Status
    const statusMax = character.data.outro.statusMax;
    if (statuses && statusMax) for (const status of Object.keys(NEGATIVE_STATUS) as NegativeStatus[]) {
      maxRaises = [...maxRaises.filter(r => !(r.status === status && r.slot === slot)), { status, extra: statusMax.extra, points: statusMax.duration, slot }];
    }
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

  // The statuses still on the target tick until they end
  if (statuses) passTime(Infinity, segments.at(-1)?.rotation ?? 0);

  // A step worth nothing on its own (e.g. casting a Liberation that only enters a state) is not counted as a hit
  const sum = (list: TeamHitRow[]): TeamSum => list.filter(r => r.damage && r.base > 0)
    .reduce((s, r) => ({ hits: s.hits + 1, base: s.base + r.base, buffed: s.buffed + r.buffed }), { hits: 0, base: 0, buffed: 0 });
  const members = Array.from({ length: memberCount }, (_, slot) => sum(rows.filter(r => r.slot === slot)));
  return { rows, members, total: sum(rows) };
}

/** Bonuses of one kind of hit */
const KIND_OF: Partial<Record<StatBuff['stat'], string>> = { liberationBonus: 'liberation', heavyBonus: 'heavy', skillBonus: 'skill', basicBonus: 'basic', echoBonus: 'echo' };

/**
 * Value of a hit of a member, without and with the buffs on it: the Outro ones and its own, and `others` (its states...). Only the buffs
 * that do something for the hit apply and are listed: not a bonus of another kind, not one for other hits, not another element
 */
function valueOf(character: Character, slot: number, step: RotationStep, active: ActiveBuff[], others: LabeledBuff[], crit = false, times = 1) {
  const key = stepKey(step);
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  // ATK only for a hit that scales with it; DMG Bonus and DMG Amplification never for healing or a shield
  const support = kind === 'heal' || kind === 'shield';
  const fits = (buff?: StatBuff) => !hit?.noBuffs && (!buff || ((!buff.hits || buff.hits.includes(key)) && (!buff.element || buff.element === character.data.type) && (!(buff.stat in KIND_OF) || kind === KIND_OF[buff.stat])
    && (buff.stat === 'atk' || buff.stat === 'flatAtk' ? !!hit?.parts.some(part => part.stat === 'atk') : !support)));
  const applied = active.filter(a => (a.receiver === null || a.receiver === slot) && fits(a.stat)
    && !(a.outro?.amplification === 'elemental' && a.outro.element !== character.data.type)
    && !(a.outro && (support || kind === 'tune'))
    && !(a.outro && a.outro.amplification !== 'all' && a.outro.amplification !== 'elemental' && a.outro.amplification !== kind));
  const own = others.filter(o => fits(o.buff));
  const statBuffs = [...applied.flatMap(a => a.stat ? [a.stat] : []), ...own.map(o => o.buff)];
  const multiplier = 1 + statBuffs.filter(buff => buff.stat === 'multiplier').reduce((sum, buff) => sum + buff.value, 0) / 100;
  const extraAmplification = statBuffs.filter(buff => buff.stat === 'amplification').reduce((sum, buff) => sum + buff.value, 0);
  const amplification = applied.some(a => a.outro) || extraAmplification ? amplificationOf(applied, character) : undefined;
  if (amplification) amplification.all += extraAmplification;
  const extra = statBuffs.length ? extraStats(statBuffs, character) : undefined;
  const critExtra = crit ? { ...extra, cChance: (extra?.cChance ?? 0) + 100 } : extra;
  const alone = character.rotationHit(step);
  const base = alone.value * times;
  const buffed = (amplification || critExtra ? character.rotationHit(step, amplification, critExtra).value * times : base) * multiplier;
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
    if (buff.stat === 'multiplier' || buff.stat === 'amplification') continue;
    if (buff.stat === 'atk') extra.dmg = (extra.dmg ?? 0) + character.data.base.atk * buff.value / 100;
    else if (buff.stat === 'flatAtk') extra.dmg = (extra.dmg ?? 0) + buff.value;
    // Every damage hit of the character gets the elemental bonus, so a DMG Bonus on all of them is added there
    else if (buff.stat === 'damageBonus') extra.elementalBonus = (extra.elementalBonus ?? 0) + buff.value;
    else if (buff.stat === 'critRate') extra.cChance = (extra.cChance ?? 0) + buff.value;
    else if (buff.stat === 'critDamage') extra.cDmg = (extra.cDmg ?? 0) + buff.value;
    else extra[buff.stat] = (extra[buff.stat] ?? 0) + buff.value;
  }
  return extra;
}

/** The buff with its value: by the Crit. Rate or the Energy Regen of the character, or times its stacks */
function scaled(character: Character, buff: StatBuff, count = 1): StatBuff {
  const by = buff.perCritRate ? { rule: buff.perCritRate, stat: character.cChance } : buff.perEnergyRegen ? { rule: buff.perEnergyRegen, stat: character.energyRegen } : undefined;
  const value = by ? Math.min(by.rule.max, Math.max(0, by.stat - by.rule.over) * buff.value) : buff.value * count;
  return value !== buff.value ? { ...buff, value: +value.toFixed(2) } : buff;
}

function outroLabel(buff: OutroBuff): string {
  const kind = buff.amplification === 'elemental' ? buff.element! : buff.amplification;
  return `${kind[0].toUpperCase() + kind.slice(1)} +${buff.value}%`;
}

function statLabel(buff: StatBuff): string {
  if (buff.stat === 'flatAtk') return `${buff.name} (ATK +${buff.value})`;
  const stat = { atk: 'ATK', damageBonus: 'DMG', elementalBonus: 'Elemental DMG', liberationBonus: 'Liberation DMG', heavyBonus: 'Heavy DMG', skillBonus: 'Skill DMG', basicBonus: 'Basic DMG', echoBonus: 'Echo DMG', critRate: 'Crit. Rate', critDamage: 'Crit. DMG', multiplier: 'DMG Multiplier', amplification: 'DMG Amplification' }[buff.stat];
  return `${buff.name} (${stat} +${buff.value}%)`;
}
