import { Amplification, Stats, noAmplification } from './damage-engine';
import { CoordinatedAttack, Hit, HitKey, HitKind, OutroBuff, RotationStep, StatBuff, TeamField, CharacterStatus, StatusMax } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { NEGATIVE_STATUS, NegativeStatus, defFactor, statusHit, statusTick } from './negative-status';
import { GearOutro, SonataTrigger } from '../data/echos/echo-data.model';
import { SONATAS } from '../data/echos';
import { weaponOutro, weaponTriggers } from '../data/weapons';
import { sonataPieces } from './stat-engine';
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
  /** Stacks applied over the max (`overflow` of the status) */
  overflow?: number;
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

/**
 * Outro buffs of the Echos, Sonatas and weapon: each Sonata bonus with enough pieces, the main slot Echo when the steps cast its Echo Skill, the weapon;
 * one with a `status` only when the character inflicts it
 */
function gearOutros(character: Character, steps: RotationStep[]): GearOutro[] {
  const pieces = sonataPieces(character.echoSet);
  const sonatas = SONATAS.flatMap(sonata => sonata.bonuses.filter(bonus => bonus.pieces <= (pieces.get(sonata.id) ?? 0)).flatMap(bonus => bonus.outro ?? []));
  const echo = steps.some(step => step.section === 'echo') ? character.mainEcho?.outro : undefined;
  return [...sonatas, ...(echo ? [echo] : []), ...weaponOutro(character.weapon)].filter(gear => !gear.status || rulesOf(character).some(rule => rule.status === gear.status));
}

/** Triggers of the character's Sonata bonuses with enough pieces, of its main slot Echo and of its weapon (the ones limited to others left out) */
function sonataTriggers(character: Character): SonataTrigger[] {
  const pieces = sonataPieces(character.echoSet);
  return [...SONATAS.flatMap(sonata => sonata.bonuses.filter(bonus => bonus.pieces <= (pieces.get(sonata.id) ?? 0)).flatMap(bonus => bonus.triggers ?? [])),
    ...character.mainEcho?.triggers ?? [], ...weaponTriggers(character.weapon)]
    .filter(trigger => (!trigger.characters || trigger.characters.includes(character.data.id))
      && (!trigger.status || rulesOf(character).some(rule => rule.status === trigger.status)));
}

/** What the character does with the Negative Statuses, in its mode */
function rulesOf(character: Character): CharacterStatus[] {
  return (character.data.statuses ?? []).filter(rule => rule.mode === undefined || rule.mode === character.mode);
}

/** `statuses`: whether the Negative Statuses on the target count (only for the team) */
function simulate(segments: Segment[], memberCount: number, statuses = false): TeamResult {
  const rows: TeamHitRow[] = [];
  let onTarget: ActiveStatus[] = [];
  /** A row: with damage, raised by the DEF the statuses on the target take away and the DEF the hit ignores, added up */
  const pushRow = (row: TeamHitRow, defIgnore = 0) => {
    let total = defIgnore;
    for (const s of row.damage ? onTarget : []) {
      const down = (NEGATIVE_STATUS[s.status].defDown ?? 0) * s.stacks;
      if (!down) continue;
      total += down;
      row.buffs = [...row.buffs, `${NEGATIVE_STATUS[s.status].name} (-${down}% DEF)`];
    }
    if (row.damage && total) row.buffed *= defFactor(Math.min(100, total) / 100);
    rows.push(row);
  };
  /** Raises of the max stacks of a status while they last */
  let maxRaises: { status: NegativeStatus; extra: number; points: number; slot?: number }[] = [];
  const raiseOf = (status: NegativeStatus) => maxRaises.filter(r => r.status === status).reduce((sum, r) => sum + r.extra, 0);
  const raiseMax = (statusMax: StatusMax, slot: number) => {
    for (const status of statusMax.statuses ?? Object.keys(NEGATIVE_STATUS) as NegativeStatus[]) {
      maxRaises = [...maxRaises.filter(r => !(r.status === status && r.slot === slot)), { status, extra: statusMax.extra, points: statusMax.duration, slot }];
    }
  };
  const maxOf = (status: NegativeStatus) => NEGATIVE_STATUS[status].max + raiseOf(status);
  const overflowMaxOf = (status: NegativeStatus) => (NEGATIVE_STATUS[status].overflow?.max ?? 0) + raiseOf(status);
  /** Points left in which the ticks of a status take no stack */
  const pauses = new Map<NegativeStatus, number>();
  /** DMG Amplification and longer interval of a status while they last */
  let statusBoosts: { status: NegativeStatus; amplification: number; intervalRate: number; points: number; label: string }[] = [];
  /** DMG Amplifications of statuses always active while a member is in the team (`alwaysBoost`) */
  const alwaysBoosts = new Map<string, { statuses?: NegativeStatus[]; amplification: number; intervalRate: number; points: number; label: string }>();
  for (const { character } of segments) for (const rule of rulesOf(character)) {
    const always = rule.alwaysBoost;
    const label = always && `${character.name}: ${always.name} (+${always.amplification}%)`;
    if (always && label) alwaysBoosts.set(label, { statuses: always.statuses, amplification: always.amplification, intervalRate: 1, points: Infinity, label });
  }
  /** A tick of a status, with the boosts on it */
  /** `extra`: a raise of its DMG Multiplier (in %), named in the row */
  const tickRow = (s: ActiveStatus, rotation: number, boosts: typeof statusBoosts, name = NEGATIVE_STATUS[s.status].name, extra?: { label: string; value: number }) => {
    boosts = [...boosts, ...[...alwaysBoosts.values()].filter(b => !b.statuses || b.statuses.includes(s.status)).map(b => ({ ...b, status: s.status }))];
    const base = statusTick(s.status, s.stacks, s.overflow) * (1 + (extra?.value ?? 0) / 100);
    const buffed = base * (1 + boosts.reduce((sum, b) => sum + b.amplification, 0) / 100);
    const overflow = s.overflow ? ` + ${NEGATIVE_STATUS[s.status].overflow!.name} (${s.overflow})` : '';
    pushRow({ rotation, slot: s.slot, step: s.step, name: `${name} (${s.stacks})${overflow}${extra?.label ?? ''}`, buffs: boosts.map(b => b.label), damage: true, base, buffed, auto: true });
    s.overflow = 0;
  };
  /** Trails on the target (by status) and the rules of the members that give them; the members a status bursts early for */
  const trails = new Map<NegativeStatus, { stacks: number; points: number }>();
  const trailRules = new Map<NegativeStatus, NonNullable<CharacterStatus['trail']>>();
  const burstAbove = new Map<NegativeStatus, number>();
  /** Statuses whose ticks take no stacks (by a member of the team) */
  const keepsStacks = new Set<NegativeStatus>();
  for (const { character } of segments) for (const rule of rulesOf(character)) {
    if (rule.trail) trailRules.set(rule.status, rule.trail);
    if (rule.burstAbove !== undefined) burstAbove.set(rule.status, rule.burstAbove);
    if (rule.keepsStacks) keepsStacks.add(rule.status);
  }
  /** Members whose next max burst keeps the trail */
  const keepsTrail = new Set<number>();
  /** Statuses a member of the team converts as soon as they are applied */
  const converts = new Map<NegativeStatus, string>();
  for (const { character } of segments) for (const rule of rulesOf(character)) if (rule.convert) converts.set(rule.status, rule.convert);
  /** Statuses a member of the team applies on the hits of anyone (`mark`), with the points since it last did */
  const marks = new Map<NegativeStatus, { owner: Character; slot: number; rule: CharacterStatus; since: number }>();
  for (const { character, slot } of segments) for (const rule of rulesOf(character)) {
    if (rule.mark && !marks.has(rule.status)) marks.set(rule.status, { owner: character, slot, rule, since: Infinity });
  }
  /** Each hit, for the effects that come once for each hit */
  let hitId = 0;
  const applyHit = new Map<string, number>();
  /** What each member (by slot) holds to react to a status (`reaction`), while it lasts */
  const reactions = new Map<number, { owner: Character; rule: CharacterStatus; count: number; points: number }>();
  /** Statuses a member of the team turns into another one (`bite`), with that member and its level */
  const bites = new Map<NegativeStatus, { bite: NonNullable<CharacterStatus['bite']>; owner: Character; level: number }>();
  for (const { character } of segments) for (const rule of rulesOf(character)) {
    const bite = rule.bite;
    if (!bite || bites.has(rule.status)) continue;
    const members = [...new Map(segments.map(s => [s.slot, s.character])).values()];
    const count = members.filter(m => bite.levels.members.includes(m.data.id) || rulesOf(m).some(r => r.status === rule.status || !!bite.levels.statuses?.includes(r.status))).length;
    bites.set(rule.status, { bite, owner: character, level: Math.min(count, bite.levels.amplification.length) });
  }
  /** The DMG Amplification of the statuses, on the hits of the character considered damage of them */
  const statusAmplification = (character: Character): LabeledBuff[] => rulesOf(character).flatMap(rule => !rule.counts ? []
    : statusBoosts.filter(b => b.status === rule.status).map(b => ({ buff: { name: b.label, stat: 'amplification' as const, value: b.amplification, hits: rule.counts }, label: b.label })));
  /** The DMG Amplification of the hit by the stacks on the target */
  const stacksAmplification = (character: Character, key: HitKey): LabeledBuff[] => rulesOf(character).flatMap(rule => {
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
    for (const s of onTarget.filter(s => NEGATIVE_STATUS[s.status].defDown)) s.points -= points;
    for (const [status, mark] of marks) marks.set(status, { ...mark, since: mark.since + points });
    for (const s of onTarget.filter(s => !NEGATIVE_STATUS[s.status].burstAtMax && !NEGATIVE_STATUS[s.status].defDown)) {
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
        // Or half of them
        if (NEGATIVE_STATUS[s.status].halvesOnTick && !keepsStacks.has(s.status) && (s.stacks = Math.floor(s.stacks / 2)) <= 0) s.points = 0;
      }
    }
    onTarget = onTarget.filter(s => s.points > 0);
    for (const [status, trail] of trails) if ((trail.points -= points) <= 0) trails.delete(status);
    for (const [owner, held] of reactions) if ((held.points -= points) <= 0) reactions.delete(owner);
    for (const [status, left] of pauses) pauses.set(status, left - points);
    statusBoosts = statusBoosts.map(b => ({ ...b, points: b.points - points })).filter(b => b.points > 0);
    maxRaises = maxRaises.map(r => ({ ...r, points: r.points - points })).filter(r => r.points > 0);
    for (const s of onTarget) {
      s.stacks = Math.min(s.stacks, maxOf(s.status));
      if (s.overflow) s.overflow = Math.min(s.overflow, overflowMaxOf(s.status));
    }
  };
  let active: ActiveBuff[] = [];
  /** The members of the team, by slot */
  const team = new Map(segments.map(({ character, slot }) => [slot, character]));
  /** Values of the counters of the members off the field that keep them (Echo of the team), and the Echo names each one counted */
  const keptCounters = new Map<number, number[]>();
  const echoSeen = new Map<string, Set<string>>();
  /** Counters of the member on the field now */
  let live: { slot: number; counters: number[] } | undefined;
  const counterOf = (slot: number, c: number) => (live?.slot === slot ? live.counters : keptCounters.get(slot))?.[c] ?? 0;
  // Buffs always active, for the member or for the team while the member is in it; the ones by a counter follow its value
  const passives = (slot: number) => {
    const character = team.get(slot)!;
    for (const buff of character.data.passiveBuffs ?? []) {
      if ((buff.mode !== undefined && buff.mode !== character.mode) || (buff.solo && team.size > 1)) continue;
      const id = `always:${slot}:${buff.name}:${buff.stat}`;
      const receiver = buff.target === 'team' ? null : slot;
      const byCounter = buff.perCounter !== undefined || !!buff.fromCounter;
      if (!byCounter && active.some(a => a.id === id)) continue;
      active = active.filter(a => a.id !== id);
      const points = buff.perCounter !== undefined ? counterOf(slot, buff.perCounter) : 1;
      if (!points || (buff.fromCounter && counterOf(slot, buff.fromCounter.counter) < buff.fromCounter.value)) continue;
      const stat = buff.perCounter !== undefined ? { ...buff, value: +(buff.value * points).toFixed(2) } : scaled(character, buff);
      if (!stat.value) continue;
      active.push({ id, receiver, points: Infinity, label: `${character.name}: ${statLabel(stat)}`, stat, count: 1 });
    }
  };
  for (const slot of team.keys()) passives(slot);
  /** A member casts its Echo Skill: the counters of the team that count it, once for each Echo name */
  const echoCast = (name: string | undefined) => {
    if (!name) return;
    for (const [slot, member] of team) (member.data.counters ?? []).forEach((counter, c) => {
      if (!counter.teamEcho) return;
      const seen = echoSeen.get(`${slot}:${c}`) ?? new Set<string>();
      if (seen.has(name)) return;
      echoSeen.set(`${slot}:${c}`, seen.add(name));
      const counters = live?.slot === slot ? live.counters : keptCounters.get(slot) ?? [];
      counters[c] = Math.min((counters[c] ?? 0) + (counter.amount ?? 1), counter.max);
      if (live?.slot !== slot) keptCounters.set(slot, counters);
      passives(slot);
    });
  };
  /** Points left until the guaranteed crit of each member is ready again */
  const critCooldown = new Map<number, number>();
  /** Points left until a trigger of a member (`slot:index`) can fire again */
  const triggerCooldown = new Map<string, number>();
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
  /** `to`: the member that gets it instead (the incoming one of an Outro), until it leaves the field */
  const give = (character: Character, slot: number, buff: StatBuff, to?: number) => {
    if ((!buff.duration && !buff.endsOnSwitch && !buff.endsOnReturn) || (buff.mode !== undefined && buff.mode !== character.mode)) return;
    const id = `self:${slot}:${buff.name}:${buff.stat}`;
    // The same buff already always active (e.g. a `solo` passive) is not given again
    if (active.some(a => a.id === `always:${slot}:${buff.name}:${buff.stat}`)) return;
    const before = active.find(a => a.id === id)?.count ?? 0;
    const count = buff.stacks ? Math.min(before + (buff.gain ?? 1), buff.stacks) : 1;
    if (buff.atMax && buff.stacks && count === buff.stacks) give(character, slot, buff.atMax, to);
    const stat = scaled(character, buff, count);
    if (!stat.value) return;
    active = active.filter(a => a.id !== id);
    active.push({
      id, receiver: to ?? (buff.target === 'team' ? null : slot), points: buff.duration ?? Infinity, label: `${character.name}: ${statLabel(stat)}`, stat, count,
      endsOnReturn: buff.endsOnReturn, endsOnSwitch: to !== undefined || buff.endsOnSwitch,
    });
  };

  segments.forEach(({ character, slot, rotation, steps }, i) => {
    const states = character.data.states ?? [];
    // What ends when the member comes back to the field
    active = active.filter(a => !(a.endsOnReturn && a.id.startsWith(`self:${slot}:`)));
    coordinated = coordinated.filter(c => !(c.attack.endsOnReturn && c.slot === slot));
    // Only the Intro the segment starts with is replaced (an Intro in the middle stays)
    const lead = steps.findIndex(step => step.section !== 'intro');
    const introCount = lead < 0 ? steps.length : lead;
    const replaced = nextIntro.get(slot);
    if (replaced && introCount) {
      steps = [keyStep(replaced), ...steps.slice(introCount)];
      nextIntro.delete(slot);
    }
    // A field of the member at its top level: its Intro is the one of the field, and it ends the field (unless `keepsOnIntro`)
    const top = fields.find(f => f.slot === slot && f.level === f.field.levels.length);
    if (top && steps[0]?.section === 'intro') {
      const first = steps.findIndex(step => step.section !== 'intro');
      steps = [...top.field.intro.map(keyStep), ...steps.slice(first < 0 ? steps.length : first)];
      if (!top.field.keepsOnIntro) fields = fields.filter(f => f !== top);
    }
    const spends = spendsPoints(character.data, steps);
    // Buffs of a hit start after its whole linked block (e.g. a buff of a burst of bullets starts after the last one)
    const blockOf: RotationStep[] = [];
    const blockEnd: boolean[] = [];
    for (const unit of units(character.data, steps)) unit.forEach((_, j) => { blockOf.push(unit[0]); blockEnd.push(j === unit.length - 1); });
    let context = startContext(character.mode);
    // The counters of the Echo of the team keep their value
    (character.data.counters ?? []).forEach((counter, c) => { if (counter.teamEcho || counter.keeps) context.counters[c] = keptCounters.get(slot)?.[c] ?? 0; });
    live = { slot, counters: context.counters };
    /** Marks held (indexes in `data.markers`); they go on the Outro */
    const markers = character.data.markers ?? [];
    const held = new Set<number>();
    /** Hits each state added since it started (by index in `data.states`) */
    const autoCount = new Map<number, number>();
    /** The active buffs, without the Outro buffs whose status is not on the target */
    const present = () => active.filter(a => {
      const status = a.outro?.whileStatus ?? a.stat?.whileStatus;
      return !status || onTarget.some(s => s.status === status && s.stacks > 0);
    });

    // A hit added by another one: worth its value with the buffs on its member, in the same action (it spends nothing)
    const autoRow = (who: Character, whoSlot: number, key: HitKey, others: LabeledBuff[]) => {
      const step = keyStep(key);
      const value = valueOf(who, whoSlot, step, present(), [...others, ...fieldBuffs(), ...(statuses ? stacksAmplification(who, key) : [])], false, 1, whoSlot !== slot);
      pushRow({ rotation, slot: whoSlot, step, name: who.stepHit(step)?.name ?? '—', buffs: value.labels, damage: value.type === 'damage', base: value.base, buffed: value.buffed, auto: true }, value.defIgnore);
      hitId++;
      if (value.type === 'damage' && value.base > 0) markHit();
      applyStatuses(who, whoSlot, key, who === character ? context.states : []);
    };
    // The boosts on the hits of a status: its own, the Outro buffs of its member while the target has it, and the levels of its bite
    const boostsOf = (s: ActiveStatus) => {
      const outro = active.filter(a => a.outro?.whileStatus === s.status && (a.receiver === null || a.receiver === s.slot))
        .map(a => ({ status: s.status, amplification: a.outro!.value, intervalRate: 1, points: a.points, label: a.label }));
      const bite = bites.get(s.status);
      const level = bite && bite.owner === character ? bite.bite.levels.amplification[bite.level - 1] ?? 0 : 0;
      const levels = level ? [{ status: s.status, amplification: level, intervalRate: 1, points: Infinity, label: `${bite!.owner.name}: ${bite!.bite.levels.name} (+${level}%)` }] : [];
      return [...statusBoosts.filter(b => b.status === s.status), ...outro, ...levels];
    };
    // Stacks of a Negative Status a member applies: up to the max (the others to its overflow), and the duration starts over
    const addStacks = (who: Character, whoSlot: number, rule: CharacterStatus, stacks: number, key: HitKey) => {
      applied(rule.status);
      const data = NEGATIVE_STATUS[rule.status];
      const old = onTarget.find(s => s.status === rule.status);
      onTarget = onTarget.filter(s => s !== old);
      const total = (old?.stacks ?? 0) + stacks;
      const over = data.overflow ? Math.min((old?.overflow ?? 0) + Math.max(0, total - maxOf(rule.status)), overflowMaxOf(rule.status)) : 0;
      const added: ActiveStatus = {
        status: rule.status, stacks: Math.min(total, maxOf(rule.status)), overflow: over, points: data.duration ?? Infinity,
        since: old?.since ?? 0, character: who, slot: whoSlot, step: keyStep(key),
      };
      const trail = trailRules.get(rule.status);
      if (trail) trails.set(rule.status, { stacks: Math.min((trails.get(rule.status)?.stacks ?? 0) + 1, trail.max), points: trail.duration });
      const convert = converts.get(rule.status);
      const early = burstAbove.get(rule.status);
      const bite = bites.get(rule.status);
      if (bite) {
        // Each stack applied: 1 hit with the max stacks; and the extra hit of its level when its member applies it
        onTarget.push(added);
        for (let n = 0; n < stacks; n++) tickRow({ ...added, stacks: maxOf(rule.status) }, rotation, boostsOf(added), bite.bite.name);
        const extra = bite.bite.levels.extra;
        if (who === bite.owner && bite.level >= extra.level) {
          const base = statusHit(extra.multiplier);
          const boosts = boostsOf(added);
          pushRow({ rotation, slot: whoSlot, step: added.step, name: `${bite.bite.name} (${bite.bite.levels.name})`, buffs: boosts.map(b => b.label), damage: true, base,
            buffed: base * (1 + boosts.reduce((sum, b) => sum + b.amplification, 0) / 100), auto: true });
        }
        // Frostbind: the hit takes stacks when the target has that many
        const frostbind = rule.bite?.frostbind;
        if (frostbind?.hits.includes(key) && added.stacks >= frostbind.stacks) added.stacks -= frostbind.stacks;
        if (added.stacks <= 0) onTarget = onTarget.filter(s => s !== added);
      }
      else if (convert) tickRow(added, rotation, statusBoosts.filter(b => b.status === rule.status), `${data.name} → ${convert}`);
      // At the max (or over the early limit), a status that bursts deals its hit with its max stacks and is gone (or 1 stack stays)
      else if (data.burstAtMax && (added.stacks >= maxOf(rule.status) || (early !== undefined && added.stacks > early))) {
        tickRow({ ...added, stacks: maxOf(rule.status) }, rotation, statusBoosts.filter(b => b.status === rule.status));
        if (early !== undefined) onTarget.push({ ...added, stacks: 1 });
      }
      else {
        // A status that hits when it is applied
        if (data.hitOnApply) tickRow({ ...added }, rotation, statusBoosts.filter(b => b.status === rule.status));
        onTarget.push(added);
      }
    };
    /** A member applied a status: the members that get something for it (once for each hit) */
    const applied = (status: NegativeStatus) => {
      for (const [ownerSlot, owner] of team) for (const rule of rulesOf(owner)) {
        const on = rule.onApply;
        const id = `${ownerSlot}:${status}`;
        if (rule.status !== status || !on || applyHit.get(id) === hitId) continue;
        applyHit.set(id, hitId);
        if (on.buff) give(owner, ownerSlot, on.buff);
        if (on.counter === undefined) continue;
        const counter = owner.data.counters![on.counter];
        const counters = live?.slot === ownerSlot ? live.counters : keptCounters.get(ownerSlot) ?? [];
        counters[on.counter] = Math.min((counters[on.counter] ?? 0) + 1, counter.max);
        if (live?.slot !== ownerSlot) keptCounters.set(ownerSlot, counters);
      }
    };
    /** A hit with damage: the statuses applied on the hits of anyone */
    const markHit = () => {
      for (const [status, mark] of statuses ? marks : []) {
        if (mark.since < mark.rule.mark!.interval) continue;
        marks.set(status, { ...mark, since: 0 });
        addStacks(mark.owner, mark.slot, mark.rule, mark.rule.mark!.stacks, 'intro:0');
      }
    };
    const applyStatuses = (who: Character, whoSlot: number, key: HitKey, whoStates: number[]) => {
      for (const rule of statuses ? rulesOf(who) : []) {
        // Hits that raise the stacks to the max, or take some
        if (rule.fillsMax?.includes(key)) {
          const old = onTarget.find(s => s.status === rule.status);
          const more = maxOf(rule.status) - (old?.stacks ?? 0);
          if (more > 0) addStacks(who, whoSlot, rule, more, key);
        }
        const taken = rule.takes?.[key];
        const on = taken ? onTarget.find(s => s.status === rule.status) : undefined;
        if (on && (on.stacks -= taken!) <= 0) onTarget = onTarget.filter(s => s !== on);
        const gain = rule.reaction?.gain[key];
        if (gain) {
          const held = reactions.get(whoSlot);
          reactions.set(whoSlot, { owner: who, rule, count: Math.min((held?.count ?? 0) + gain, rule.reaction!.max), points: rule.reaction!.duration });
        }
        const stacks = rule.hits?.[key];
        if (!stacks || (rule.state !== undefined && !whoStates.includes(rule.state))) continue;
        addStacks(who, whoSlot, rule, stacks, key);
        // Another member that reacts to it (on the field only): spends 1 and applies its stacks
        for (const [owner, held] of reactions) {
          if (owner === whoSlot || whoSlot !== slot || held.rule.status !== rule.status || held.count <= 0) continue;
          held.count--;
          addStacks(held.owner, owner, held.rule, held.rule.reaction!.stacks, Object.keys(held.rule.reaction!.gain)[0]);
        }
      }
    };

    // The Outro starts its buffs (the same one given again renews its duration); in a team, an Outro in the middle of the turn too
    const gear = gearOutros(character, steps);
    const triggers = sonataTriggers(character);
    const startOutro = () => {
      const incoming = segments[i + 1]?.slot;
      // Extra damage of the Echos and Sonatas on the Outro
      for (const hit of gear.flatMap(g => g.hits ?? [])) {
        const value = character.extraHit(hit);
        pushRow({ rotation, slot, step: { section: 'outro', index: 0 }, name: hit.name, buffs: [], damage: true, base: value, buffed: value, auto: true });
      }
      [...character.data.outro.statBuffs ?? [], ...gear.flatMap(g => g.statBuffs ?? [])].forEach(buff => {
        if (buff.target !== 'incoming') give(character, slot, buff);
        else if (incoming !== undefined) give(character, slot, buff, incoming);
      });
      for (const boost of gear.flatMap(g => g.statusAmplification ?? [])) {
        const label = `${character.name}: ${boost.name} (${NEGATIVE_STATUS[boost.status].name} +${boost.value}%)`;
        statusBoosts = [...statusBoosts.filter(b => b.label !== label), { status: boost.status, amplification: boost.value, intervalRate: 1, points: boost.duration, label }];
      }
      for (const rule of statuses ? rulesOf(character) : []) {
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
      if (statuses && statusMax) raiseMax(statusMax, slot);
      // A Coordinated Attack of the Outro (its hits fire on the actions of the incoming member)
      const attack = character.data.coordinated;
      if (attack?.start.startsWith('outro:')) {
        coordinated = [...coordinated.filter(c => c.slot !== slot), { character, slot, attack, points: attack.duration, fired: 0, since: Infinity }];
      }
      const next = segments[i + 1]?.slot;
      [...character.data.outro.buffs ?? [], ...gear.flatMap(g => g.buffs ?? [])].forEach((buff, position) => {
        if (buff.target === 'incoming' && next === undefined) return;
        if (buff.mode !== undefined && buff.mode !== character.mode) return;
        // 'others': one buff for each other member, raised for the ones that qualify
        const receivers: (number | null)[] = buff.target === 'others' ? [...team.keys()].filter(s => s !== slot) : [buff.target === 'incoming' ? next! : null];
        for (const receiver of receivers) {
          const member = receiver === null ? undefined : team.get(receiver);
          const raised = buff.raised && member && (buff.raised.members?.includes(member.data.id) || (!!buff.raised.status && rulesOf(member).some(r => r.status === buff.raised!.status)));
          const given: OutroBuff = raised ? { ...buff, value: buff.raised!.value } : buff;
          if (!given.value) continue;
          const id = `outro:${slot}:${position}:${receiver}`;
          active = active.filter(a => a.id !== id);
          active.push({
            id, outro: given, endsOnSwitch: buff.endsOnSwitch, receiver,
            points: buff.duration,
            label: `${character.name}: ${outroLabel(given)}`,
          });
        }
      });
    };
    const finalOutro = steps.length - sectionSteps(character, 'outro').length;

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
        const buff: StatBuff = { name: boost.name, stat: boost.stat ?? 'damageBonus', value: boost.value };
        return { buff, label: `${character.name}: ${statLabel(buff)}` };
      });
      const value = valueOf(character, slot, step, present(), [...stateBuffs, ...boosts, ...fieldBuffs(), ...statusAmplification(character), ...(statuses ? stacksAmplification(character, key) : [])], crits, bonusAfter?.multiplier);
      pushRow({
        rotation, slot, step,
        name: step.section === 'end' ? `Leave ${states[step.index]?.name ?? ''}` : hit?.name ?? character.mainEcho?.name ?? '—',
        buffs: step.section === 'end' ? [] : [...value.labels, ...(crits ? [`${crit!.name} (crit)`] : []), ...(bonusAfter ? [`${bonusAfter.name} (×${bonusAfter.multiplier})`] : [])],
        damage: value.type === 'damage',
        base: value.base,
        buffed: value.buffed,
      }, value.defIgnore);
      hitId++;
      if (value.type === 'damage' && value.base > 0) markHit();

      // Detonating: the hit of each mark held, then the mark goes; a hit can leave a mark
      markers.forEach((marker, m) => {
        if (marker.detonate === key && held.delete(m)) autoRow(character, slot, marker.hit, stateBuffs);
      });
      markers.forEach((marker, m) => { if (marker.gain.includes(key)) held.add(m); });

      // Hits added after some hits
      for (const followUp of character.data.followUps ?? []) if (followUp.after.includes(key) && (followUp.mode === undefined || followUp.mode === character.mode)) autoRow(character, slot, followUp.hit, stateBuffs);

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
      for (const [id, left] of triggerCooldown) triggerCooldown.set(id, left - cost);
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
      // Sonata buffs after an action with a hit of a kind (once per block, e.g. a Liberation with its healing), that inflicts a status,
      // or while the target has one
      const block = blockEnd[position] ? steps.filter((_, p) => blockOf[p] === giver) : [];
      const blockSections = block.map(s => s.section);
      const blockKinds = block.flatMap(s => {
        const h = character.stepHit(s);
        return h ? [character.mode > 0 && h.altKind ? h.altKind : h.kind] : [];
      });
      const inflicts = (status: NegativeStatus | 'any') => rulesOf(character).some(rule => (status === 'any' || rule.status === status)
        && (rule.state === undefined || context.states.includes(rule.state))
        && (rule.hits ? block.some(s => !!rule.hits![stepKey(s)]) : !!rule.mark && blockKinds.some(k => k !== 'heal' && k !== 'shield')));
      for (const [t, trigger] of (block.length ? triggers : []).entries()) {
        const fires = trigger.kinds?.some(k => blockKinds.includes(k)) || trigger.sections?.some(s => blockSections.includes(s))
          || (!!trigger.inflicts && inflicts(trigger.inflicts))
          || (!!trigger.dodge && block.some(s => isDodgeCounter(character.stepHit(s))))
          || (!!trigger.hits && block.some(s => trigger.hits!.includes(stepKey(s))))
          || (!!trigger.onTarget && onTarget.some(s => (trigger.onTarget!.status === 'any' || s.status === trigger.onTarget!.status) && s.stacks >= (trigger.onTarget!.stacks ?? 1)));
        const id = `${slot}:${t}`;
        if (!fires || (triggerCooldown.get(id) ?? 0) > 0) continue;
        if (trigger.cooldown) triggerCooldown.set(id, trigger.cooldown);
        trigger.buffs.forEach(buff => give(character, slot, buff));
        if (trigger.heal) {
          const value = character.hp * trigger.heal.value / 100 * (1 + character.healingBonus / 100);
          pushRow({ rotation, slot, step: giver, name: `${trigger.heal.name} (heal)`, buffs: [], damage: false, base: value, buffed: value, auto: true });
        }
        const boost = trigger.statusAmplification;
        if (boost) {
          const label = `${character.name}: ${boost.name} (${NEGATIVE_STATUS[boost.status].name} +${boost.value}%)`;
          statusBoosts = [...statusBoosts.filter(b => b.label !== label), { status: boost.status, amplification: boost.value, intervalRate: 1, points: boost.duration, label }];
        }
      }
      const hitMax = blockEnd[position] ? character.stepHit(giver)?.statusMax : undefined;
      if (statuses && hitMax) raiseMax(hitMax, slot);
      applyStatuses(character, slot, key, context.states);
      // A hit that makes the status burst with its max stacks (they stay), raised by the trail (which it takes) and by a state
      for (const rule of statuses ? rulesOf(character) : []) {
        const burst = rule.maxBurst;
        if (!burst) continue;
        if (burst.keepsTrailAfter === key) keepsTrail.add(slot);
        if (!burst.hits.includes(key)) continue;
        const trail = trails.get(rule.status)?.stacks ?? 0;
        const inState = burst.state && context.states.includes(burst.state.state) ? burst.state.value : 0;
        const name = trailRules.get(rule.status)?.name;
        const s: ActiveStatus = { status: rule.status, stacks: maxOf(rule.status), points: 0, since: 0, character, slot, step };
        tickRow(s, rotation, statusBoosts.filter(b => b.status === rule.status), undefined,
          { label: (trail && name ? ` + ${name} (${trail})` : '') + (inState ? ` +${inState}%` : ''), value: trail * burst.perTrail + inState });
        if (!keepsTrail.delete(slot)) trails.delete(rule.status);
      }
      // A hit that detonates the status: 1 tick at once, and 1 stack less; a hit that consumes it: the status is gone
      for (const rule of statuses ? rulesOf(character) : []) {
        const s = onTarget.find(s => s.status === rule.status);
        if (!s) continue;
        if (rule.detonate?.includes(key)) {
          const boost = stateBoostOf(character, rule, context.states, 0);
          tickRow({ ...s, character, slot, step }, rotation, [...statusBoosts.filter(b => b.status === rule.status && b.label !== boost?.label), ...(boost ? [boost] : [])]);
          s.overflow = 0;
          if (--s.stacks <= 0) onTarget = onTarget.filter(other => other !== s);
        }
        if (rule.consume?.hit === key && !rule.keepsOnConsume) onTarget = onTarget.filter(other => other !== s);
        const burst = rule.burst;
        if (burst?.hits.includes(key)) {
          // The overflow (Electro Rage) is what the stacks of the burst come from
          tickRow({ ...s, overflow: 0, character, slot, step }, rotation, statusBoosts.filter(b => b.status === rule.status), undefined,
            { label: ` × ${burst.name} (${burst.multiplier})`, value: (burst.multiplier - 1) * 100 });
        }
      }
      for (const rule of statuses ? rulesOf(character) : []) {
        const pause = rule.pause;
        if (pause?.hit !== key || (pause.counter !== undefined && !counterBoosted(character.data, context, key, pause.counter))) continue;
        pauses.set(rule.status, Math.max(pauses.get(rule.status) ?? 0, pause.duration));
      }
      // A state that ends gives its hit for the next Intro
      if (step.section === 'end' && states[step.index]?.nextIntro) nextIntro.set(slot, states[step.index].nextIntro!);
      const before = context.counters;
      context = advance(character, context, step, spends[position]);
      live = { slot, counters: context.counters };
      if (step.section === 'echo') echoCast(character.mainEcho?.name);
      (character.data.counters ?? []).forEach((counter, c) => {
        const full = counter.fullHit;
        if (!full?.after.includes(key) || (context.counters[c] ?? 0) < counter.max) return;
        context.counters[c] = 0;
        autoRow(character, slot, full.hit, []);
      });
      const casts = character.data.echoCasts;
      if (casts?.hits.includes(key) && casts.mode === character.mode) echoCast(`${character.name}:${key}:${rotation}:${position}`);
      passives(slot);
      // A counter that gets to a value gives a buff
      (character.data.counters ?? []).forEach((counter, c) => {
        const at = counter.buffAt;
        if (at && (before[c] ?? 0) < at.value && (context.counters[c] ?? 0) >= at.value) give(character, slot, at.buff);
      });
      // An Outro in the middle of the turn (after its last hit) gives its buffs in a team; the character stays on the field
      if (memberCount > 1 && step.section === 'outro' && position < finalOutro && steps[position + 1]?.section !== 'outro') startOutro();
    });

    // The counters of the Echo of the team keep their value off the field (and count the same Echo again after the Outro)
    keptCounters.set(slot, [...context.counters]);
    (character.data.counters ?? []).forEach((counter, c) => { if (counter.teamEcho?.resetOnOutro) echoSeen.delete(`${slot}:${c}`); });
    live = undefined;
    passives(slot);
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

    startOutro();
  });

  // The statuses still on the target tick until they end
  if (statuses) passTime(Infinity, segments.at(-1)?.rotation ?? 0);

  // A step worth nothing on its own (e.g. casting a Liberation that only enters a state) is not counted as a hit
  const sum = (list: TeamHitRow[]): TeamSum => list.filter(r => r.damage && r.base > 0)
    .reduce((s, r) => ({ hits: s.hits + 1, base: s.base + r.base, buffed: s.buffed + r.buffed }), { hits: 0, base: 0, buffed: 0 });
  const members = Array.from({ length: memberCount }, (_, slot) => sum(rows.filter(r => r.slot === slot)));
  return { rows, members, total: sum(rows) };
}

/** A Dodge Counter hit, by its name (there is no dodge in the rotation) */
function isDodgeCounter(hit?: Hit): boolean {
  return !!hit && /dodge counter/i.test(hit.name);
}

/** Bonuses of one kind of hit */
const KIND_OF: Partial<Record<StatBuff['stat'], string>> = { liberationBonus: 'liberation', heavyBonus: 'heavy', skillBonus: 'skill', basicBonus: 'basic', echoBonus: 'echo' };

/**
 * Value of a hit of a member, without and with the buffs on it: the Outro ones and its own, and `others` (its states...). Only the buffs
 * that do something for the hit apply and are listed: not a bonus of another kind, not one for other hits, not another element
 */
function valueOf(character: Character, slot: number, step: RotationStep, active: ActiveBuff[], others: LabeledBuff[], crit = false, times = 1, offField = false) {
  const key = stepKey(step);
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  // ATK (DEF) only for a hit that scales with it; DMG Bonus and DMG Amplification never for healing or a shield
  const support = kind === 'heal' || kind === 'shield';
  // A hit of another element gets no elemental bonus of the character, and the element buffs of its own element
  const element = hit?.element ?? character.data.type;
  const coordinated = !!character.data.coordinated?.hits.includes(key);
  const fits = (buff?: StatBuff) => !hit?.noBuffs && (!buff || ((!buff.hits || buff.hits.includes(key)) && (!buff.element || buff.element === element) && (!buff.kind || buff.kind === kind) && (!buff.dodge || isDodgeCounter(hit)) && (!buff.characters || buff.characters.includes(character.data.id)) && (!buff.offField || offField)
    && !(buff.stat === 'elementalBonus' && element !== character.data.type) && (!(buff.stat in KIND_OF) || kind === KIND_OF[buff.stat])
    && (buff.stat === 'atk' || buff.stat === 'flatAtk' ? !!hit?.parts.some(part => part.stat === 'atk')
      : buff.stat === 'def' ? !!hit?.parts.some(part => part.stat === 'def') : buff.stat === 'hp' ? !!hit?.parts.some(part => part.stat === 'hp')
      : buff.stat === 'healingBonus' ? kind === 'heal' : !support)));
  const applied = active.filter(a => (a.receiver === null || a.receiver === slot) && fits(a.stat)
    && !(a.outro?.amplification === 'elemental' && a.outro.element !== element)
    && !(a.outro && (support || kind === 'tune'))
    && !(a.outro && a.outro.amplification !== 'all' && a.outro.amplification !== 'elemental' && a.outro.amplification !== kind
      && !(a.outro.amplification === 'coordinated' && coordinated)));
  const own = others.filter(o => fits(o.buff));
  const statBuffs = [...applied.flatMap(a => a.stat ? [a.stat] : []), ...own.map(o => o.buff)];
  const multiplier = 1 + statBuffs.filter(buff => buff.stat === 'multiplier').reduce((sum, buff) => sum + buff.value, 0) / 100;
  const extraAmplification = statBuffs.filter(buff => buff.stat === 'amplification').reduce((sum, buff) => sum + buff.value, 0);
  // Ignoring part of the DEF of the target: added to the DEF the statuses take away (see pushRow)
  const defIgnore = Math.min(100, statBuffs.filter(buff => buff.stat === 'defIgnore').reduce((sum, buff) => sum + buff.value, 0));
  const amplification = applied.some(a => a.outro) || extraAmplification ? amplificationOf(applied, element) : undefined;
  if (amplification) amplification.all += extraAmplification;
  const extra = statBuffs.length ? extraStats(statBuffs, character, element === character.data.type ? undefined : kind) : undefined;
  const critExtra = crit ? { ...extra, cChance: (extra?.cChance ?? 0) + 100 } : extra;
  const alone = character.rotationHit(step);
  const base = alone.value * times;
  const buffed = (amplification || critExtra ? character.rotationHit(step, amplification, critExtra).value * times : base) * multiplier;
  return { type: alone.type, base, buffed, defIgnore, labels: [...applied.map(a => a.label), ...own.map(o => o.label)] };
}

/** Amplifications of the active Outro buffs added up; an elemental one counts only for a hit of its element */
function amplificationOf(buffs: ActiveBuff[], element: string): Amplification {
  const amplification = noAmplification();
  for (const { outro } of buffs) {
    if (!outro) continue;
    if (outro.amplification === 'elemental' && outro.element !== element) continue;
    // Only on a Coordinated Attack hit (see valueOf), added to all
    if (outro.amplification === 'coordinated') amplification.all += outro.value;
    else amplification[outro.amplification] += outro.value;
  }
  return amplification;
}

/** Attributes the buffs add: ATK (DEF) as a percentage of the base ATK (DEF), the others as they are; `otherElement`: the kind of a hit
 * of another element, which gets the DMG Bonus on all hits in the bonus of its kind (it gets no elemental bonus) */
function extraStats(buffs: StatBuff[], character: Character, otherElement?: HitKind): Partial<Stats> {
  const KIND_BONUS: Partial<Record<HitKind, keyof Stats>> = { basic: 'basicBonus', heavy: 'heavyBonus', skill: 'skillBonus', liberation: 'liberationBonus', echo: 'echoBonus' };
  const extra: Partial<Stats> = {};
  for (const buff of buffs) {
    if (buff.stat === 'multiplier' || buff.stat === 'amplification' || buff.stat === 'defIgnore') continue;
    if (buff.stat === 'atk') extra.dmg = (extra.dmg ?? 0) + character.baseStats.atk * buff.value / 100;
    else if (buff.stat === 'flatAtk') extra.dmg = (extra.dmg ?? 0) + buff.value;
    else if (buff.stat === 'def') extra.def = (extra.def ?? 0) + character.baseStats.def * buff.value / 100;
    else if (buff.stat === 'hp') extra.hp = (extra.hp ?? 0) + character.baseStats.hp * buff.value / 100;
    // Every damage hit of the character gets the elemental bonus, so a DMG Bonus on all of them is added there
    else if (buff.stat === 'damageBonus') {
      const field = otherElement ? KIND_BONUS[otherElement] : 'elementalBonus';
      if (field) extra[field] = (extra[field] ?? 0) + buff.value;
    }
    else if (buff.stat === 'critRate') extra.cChance = (extra.cChance ?? 0) + buff.value;
    else if (buff.stat === 'critDamage') extra.cDmg = (extra.cDmg ?? 0) + buff.value;
    else extra[buff.stat] = (extra[buff.stat] ?? 0) + buff.value;
  }
  return extra;
}

/** The buff with its value: by the Crit. Rate or the Energy Regen of the character, or times its stacks */
function scaled(character: Character, buff: StatBuff, count = 1): StatBuff {
  const by = buff.perCritRate ? { rule: buff.perCritRate, stat: character.cChance } : buff.perEnergyRegen ? { rule: buff.perEnergyRegen, stat: character.energyRegen }
    : buff.perHp ? { rule: buff.perHp, stat: Math.floor(character.hp / 1000) } : undefined;
  const value = by ? Math.min(by.rule.max, Math.max(0, by.stat - by.rule.over) * buff.value) : buff.value * count;
  return value !== buff.value ? { ...buff, value: +value.toFixed(2) } : buff;
}

function outroLabel(buff: OutroBuff): string {
  const kind = buff.amplification === 'elemental' ? buff.element! : buff.amplification;
  return `${kind[0].toUpperCase() + kind.slice(1)} +${buff.value}%`;
}

function statLabel(buff: StatBuff): string {
  if (buff.stat === 'flatAtk') return `${buff.name} (ATK +${buff.value})`;
  const stat = { atk: 'ATK', def: 'DEF', damageBonus: 'DMG', elementalBonus: 'Elemental DMG', liberationBonus: 'Liberation DMG', heavyBonus: 'Heavy DMG', skillBonus: 'Skill DMG', basicBonus: 'Basic DMG', echoBonus: 'Echo DMG', critRate: 'Crit. Rate', critDamage: 'Crit. DMG', multiplier: 'DMG Multiplier', amplification: 'DMG Amplification', defIgnore: 'DEF Ignored', hp: 'HP', healingBonus: 'Healing Bonus' }[buff.stat];
  return `${buff.name} (${stat} +${buff.value}%)`;
}
