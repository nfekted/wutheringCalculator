import { CharacterData, HitKey, RotationStep, SectionKey } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';

/** Sections the player picks hits from; intro and outro are always part of the rotation */
export const PICKABLE: SectionKey[] = ['basic', 'skill', 'liberation', 'forte'];

export function stepKey(step: RotationStep): HitKey {
  return `${step.section}:${step.index}`;
}

export function keyStep(key: HitKey): RotationStep {
  const [section, index] = key.split(':');
  return { section: section as RotationStep['section'], index: +index };
}

/**
 * Where the rotation is: the last hit that counts for the sequence, the one before a run of hits that keep the sequence (e.g. a Skill
 * that does not break the Basic Attack cycle), the active states (indexes in `data.states`), the value of each counter, the points left
 * of each state that has a duration and of each buff the character gives itself (by name)
 */
export interface RotationContext {
  last: HitKey | null;
  held: HitKey | null;
  states: number[];
  counters: number[];
  statePoints: Record<number, number>;
  buffPoints: Record<string, number>;
}

export function startContext(): RotationContext {
  return { last: null, held: null, states: [], counters: [], statePoints: {}, buffPoints: {} };
}

/**
 * Points a step spends from every active buff (and state): by its section; in the Basic section a Heavy hit is 1; an Echo that
 * transforms is 3; a hit that replaces the Intro (kind `intro` in another section) is 1, like the Intro; a hit of a state (kept in
 * another section) costs by its kind
 */
export function stepCost(character: Character, step: RotationStep): number {
  if (step.section === 'echo') return character.mainEcho?.transform ? 3 : 0;
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  if (kind === 'intro') return 1;
  if (character.data.states?.some(state => state.hits.includes(stepKey(step)))) {
    switch (kind) {
      case 'basic': return 0.5;
      case 'heavy': return 1;
      case 'skill': return 0.5;
      case 'liberation': return 3;
    }
  }
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

/** Numbered hits ("DMG 2", "Stage 2", "Part 2"): the key of the previous number, when the section has it */
const previousCache = new WeakMap<CharacterData, Map<HitKey, HitKey>>();
function previousNumber(data: CharacterData, key: HitKey): HitKey | undefined {
  let map = previousCache.get(data);
  if (!map) {
    map = new Map();
    for (const section of [...PICKABLE, 'intro', 'outro'] as SectionKey[]) {
      const groups = new Map<string, Map<number, number>>();
      data[section].hits.forEach((hit, index) => {
        const match = hit.name.match(/(DMG|Stage|Part)\s*(\d+)/i);
        if (!match) return;
        const group = hit.name.replace(match[0], match[1] + ' #');
        if (!groups.has(group)) groups.set(group, new Map());
        groups.get(group)!.set(+match[2], index);
      });
      for (const numbers of groups.values()) {
        for (const [n, index] of numbers) {
          const previous = numbers.get(n - 1);
          if (previous !== undefined) map.set(`${section}:${index}`, `${section}:${previous}`);
        }
      }
    }
    previousCache.set(data, map);
  }
  return map.get(key);
}

/**
 * Whether a hit can come now. A numbered hit comes right after the previous number; a hit with an "after" rule right after one of
 * those hits (a numbered one, after either); the hit before a run of hits that keep the sequence also counts. A state hit only in its
 * state; a replaced hit, or the start of an active state, not in it. A counter hit only with the counter full, and the hits it
 * replaces not then. A hit that only comes inside a linked block, or that replaces the next Intro, is never picked alone
 */
export function allowed(data: CharacterData, context: RotationContext, step: RotationStep): boolean {
  if (step.section === 'echo') return true;
  if (step.section === 'end') return context.states.includes(step.index);
  const key = stepKey(step);
  const states = data.states ?? [];
  // A state hit outside its state: only an extra way in, right after the hits it asks for (its start is always offered outside)
  for (const [i, state] of states.entries()) {
    if (!state.hits.includes(key) || key === state.start || context.states.includes(i)) continue;
    const extra = state.starts?.[key];
    if (!extra || !context.last || !extra.includes(context.last)) return false;
  }
  if (context.states.some(i => states[i].replaces.includes(key) || (states[i].start === key && !states[i].hits.includes(key)))) return false;
  if (states.some(state => state.nextIntro === key)) return false;
  for (const [i, counter] of (data.counters ?? []).entries()) {
    const full = (context.counters[i] ?? 0) >= counter.max;
    if (counter.unlocks === key && !full) return false;
    if (full && counter.replaces.includes(key)) return false;
  }
  if (isLinkedRest(data, step)) return false;
  if (data.sequence?.replacedBy?.[key]?.some(other => allowed(data, context, keyStep(other)))) return false;

  const previous = previousNumber(data, key);
  const after = data.sequence?.after?.[key];
  if (!previous && !after) return true;
  const follows = (hit: HitKey | null) => !!hit && (hit === previous || !!after?.includes(hit));
  return follows(context.last) || follows(context.held);
}

/**
 * Context after a step. Healing and shield are part of the action that gives them, and an Echo that does not transform attacks
 * alongside the character: neither changes the sequence. A hit that keeps the sequence leaves the hit before it reachable. A state
 * starts on its hit (or an extra way in) and ends on an 'end' step, on its end hits or when its points run out (its counters go back
 * to 0). A counter hit adds 1; the hit it unlocks spends it all. `spends` is false for a hit of a linked block that is not the first
 */
export function advance(character: Character, context: RotationContext, step: RotationStep, spends = true): RotationContext {
  const data = character.data;
  const counters = data.counters ?? [];
  const cost = spends ? stepCost(character, step) : 0;

  // Points of the buffs the character gives itself (by name) and of the states with a duration
  const buffPoints: Record<string, number> = {};
  for (const [name, left] of Object.entries(context.buffPoints)) if (left - cost > 0) buffPoints[name] = left - cost;
  const statePoints: Record<number, number> = {};
  const runOut: number[] = [];
  for (const i of context.states) {
    const state = data.states![i];
    if (state.duration === undefined) continue;
    const slowed = !!state.slowedBy && (context.buffPoints[state.slowedBy] ?? 0) > 0;
    const left = (context.statePoints[i] ?? state.duration) - cost * (slowed ? state.slowedRate ?? 1 : 1);
    if (left > 0) statePoints[i] = left; else runOut.push(i);
  }
  const resetCounters = (ended: number[], value: (i: number) => number) =>
    counters.map((counter, i) => counter.state !== undefined && ended.includes(counter.state) ? 0 : value(i));

  if (step.section === 'end') {
    const ended = [step.index, ...runOut];
    return {
      last: null, held: null, buffPoints, statePoints,
      states: context.states.filter(i => !ended.includes(i)),
      counters: resetCounters(ended, i => context.counters[i] ?? 0),
    };
  }
  const hit = character.stepHit(step);
  const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
  if (step.section === 'echo' || kind === 'heal' || kind === 'shield') {
    const transforms = step.section === 'echo' && !!character.mainEcho?.transform;
    return {
      ...context, buffPoints, statePoints,
      states: context.states.filter(i => !runOut.includes(i)),
      counters: resetCounters(runOut, i => context.counters[i] ?? 0),
      ...(transforms && { last: 'echo', held: null }),
    };
  }

  const key = stepKey(step);
  for (const buff of hit?.buffs ?? []) if (buff.duration) buffPoints[buff.name] = buff.duration;
  const keeps = (hit: HitKey | null) => !!hit && !!data.sequence?.keepsChain?.includes(hit);
  const held = keeps(key) ? (keeps(context.last) ? context.held : context.last) : null;
  const started = (data.states ?? []).flatMap((state, i) =>
    (state.start === key || !!state.starts?.[key]) && !context.states.includes(i) ? [i] : []);
  const ended = [...runOut, ...(data.states ?? []).flatMap((state, i) => state.endsOn?.includes(key) ? [i] : [])];
  const states = [...context.states, ...started].filter(i => !ended.includes(i));
  return {
    last: key, held, states, buffPoints, statePoints,
    counters: resetCounters(ended, i => {
      const counter = counters[i];
      const value = context.counters[i] ?? 0;
      if (counter.unlocks === key) return 0;
      if (counter.gain.includes(key) && (counter.state === undefined || states.includes(counter.state))) return Math.min(value + 1, counter.max);
      return value;
    }),
  };
}

/** Context after a list of steps */
export function contextAfter(character: Character, steps: RotationStep[], context = startContext()): RotationContext {
  const spends = spendsPoints(character.data, steps);
  return steps.reduce((ctx, step, i) => advance(character, ctx, step, spends[i]), context);
}

/** The linked block that starts with this hit: every hit of it, the first one included (they are added and removed together) */
export function linkedBlock(data: CharacterData, step: RotationStep): RotationStep[] | undefined {
  return data.sequence?.linked?.find(block => block[0] === stepKey(step))?.map(keyStep);
}

/** Whether the hit only comes inside a linked block, after its first hit */
function isLinkedRest(data: CharacterData, step: RotationStep): boolean {
  return !!data.sequence?.linked?.some(block => block.slice(1).includes(stepKey(step)));
}

/**
 * The list split in units: a whole linked block is one unit (its first hit and the rest right after it), any other step is one alone.
 * A hit of a block out of its block is a unit alone (and is not allowed)
 */
export function units(data: CharacterData, steps: RotationStep[]): RotationStep[][] {
  const list: RotationStep[][] = [];
  for (let i = 0; i < steps.length;) {
    const block = linkedBlock(data, steps[i]);
    const whole = block && block.every((step, j) => steps[i + j] && stepKey(steps[i + j]) === stepKey(step));
    const size = whole ? block.length : 1;
    list.push(steps.slice(i, i + size));
    i += size;
  }
  return list;
}

/** Whether each step spends points: in a linked block (and in the Intro) only the first hit does, the others are the same action */
export function spendsPoints(data: CharacterData, steps: RotationStep[]): boolean[] {
  return units(data, steps).flatMap(unit => unit.map((step, j) => j === 0 && !(step.section === 'intro' && step.index > 0)));
}

/** Keeps only the units that can still come where they are; a removed one does not change the context (what followed it may go too) */
export function cleanSteps(character: Character, steps: RotationStep[], context = startContext()): RotationStep[] {
  const kept: RotationStep[] = [];
  for (const unit of units(character.data, steps)) {
    const block = linkedBlock(character.data, unit[0]);
    if (block && block.length !== unit.length) continue;
    if (!allowed(character.data, context, unit[0])) continue;
    kept.push(...unit);
    context = contextAfter(character, unit, context);
  }
  return kept;
}

/** Context where the hits between the Intro and the Outro start: after the Intro, or from nothing (member A of the first team rotation) */
export function middleContext(character: Character, withIntro: boolean): RotationContext {
  const intro = character.data.intro.hits.map((_, index): RotationStep => ({ section: 'intro', index }));
  return withIntro ? contextAfter(character, intro) : startContext();
}
