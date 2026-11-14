import { Component, ChangeDetectionStrategy, computed, input, model } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { HitKind, RotationStep } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { sectionSteps } from '../core/team-engine';
import { PICKABLE, allowed, cleanSteps, contextAfter, isLinkedSecond, linkedWith, middleContext, stepKey } from '../core/rotation-rules';

const KIND_COLORS: Partial<Record<HitKind, string>> = {
  basic: 'text-kind-basic', skill: 'text-kind-skill', liberation: 'text-kind-liberation',
  intro: 'text-kind-intro', outro: 'text-kind-outro', heavy: 'text-kind-heavy',
};

interface Row {
  step: RotationStep;
  /** Index in the editable list; -1 for the intro and outro rows */
  position: number;
  name: string;
  color: string;
  /** Damage hit (false for healing, shield and leaving a state, which are not added to the total) */
  damage: boolean;
  value: number;
}

/** Total damage of a list of steps and how many of them are damage hits */
export function sumSteps(character: Character, steps: RotationStep[]): { total: number; hits: number } {
  let total = 0, hits = 0;
  for (const step of steps) {
    const { value, type } = character.rotationHit(step);
    if (type !== 'damage') continue;
    total += value;
    hits++;
  }
  return { total, hits };
}

/**
 * Editable list of the hits between the intro and the outro, with the damage of each one. Only the hits that can come next are
 * offered (sequence and states of the character); removing or moving a hit also removes the ones that can no longer come
 */
@Component({
  selector: 'app-rotation-editor',
  templateUrl: './rotation-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, DecimalPipe, TranslocoPipe]
})
export class RotationEditorComponent {

  character = input.required<Character>();
  /** Hits between the intro and the outro */
  steps = model.required<RotationStep[]>();
  /** Whether the intro rows are shown (member A of a team starts without it) */
  intro = input(true);
  /** Value of each row, in the order of the rows (e.g. with the buffs); without it, the value of the hit alone */
  values = input<number[] | null>(null);

  picked = '';

  /** Where the rotation is after the last hit */
  private context = computed(() => contextAfter(this.character(), this.steps(), middleContext(this.character(), this.intro())));

  groups = computed(() => {
    const data = this.character().data;
    const context = this.context();
    return PICKABLE
      .map(section => ({
        section, name: data[section].name,
        hits: data[section].hits.flatMap((hit, index) => {
          const step: RotationStep = { section, index };
          return allowed(data, context, step) && !isLinkedSecond(data, step) ? [{ index, name: hit.name }] : [];
        }),
      }))
      .filter(group => group.hits.length);
  });

  /** States the character is in after the last hit; clicking one adds the step that leaves it */
  activeStates = computed(() => this.context().states.map(index => ({ index, name: this.character().data.states![index].name })));

  /** Ways of casting the Echo Skill of the main Echo; empty without one, or when it only buffs */
  mainEcho = computed(() => this.character().mainEcho);
  echoOptions = computed(() => (this.mainEcho()?.skill.hits ?? []).map((hit, index) => ({ index, name: hit.name })));

  rows = computed<Row[]>(() => [
    ...(this.intro() ? sectionSteps(this.character(), 'intro') : []).map(step => this.row(step, -1)),
    ...this.steps().map((step, position) => this.row(step, position)),
    ...sectionSteps(this.character(), 'outro').map(step => this.row(step, -1)),
  ]);

  private row(step: RotationStep, position: number): Row {
    const character = this.character();
    const hit = character.stepHit(step);
    const kind = character.mode > 0 && hit?.altKind ? hit.altKind : hit?.kind;
    const { value, type } = character.rotationHit(step);
    // An Echo Skill step without a main Echo (or with one that only buffs) is kept, worth 0
    const name = step.section === 'end' ? character.data.states?.[step.index]?.name ?? '—' : hit?.name ?? this.mainEcho()?.name ?? '—';
    return { step, position, name, color: kind ? KIND_COLORS[kind] ?? '' : '', damage: type === 'damage', value };
  }

  protected add() {
    if (!this.picked) return;
    const [section, index] = this.picked.split(':');
    const step: RotationStep = { section: section as RotationStep['section'], index: +index };
    const second = linkedWith(this.character().data, step);
    this.steps.set([...this.steps(), step, ...(second ? [second] : [])]);
    this.picked = '';
  }

  protected leave(state: number) {
    this.steps.set([...this.steps(), { section: 'end', index: state }]);
  }

  /** Removes the hit (and the other one of a linked pair) and every hit that can no longer come */
  protected remove(position: number) {
    const data = this.character().data;
    const list = this.steps();
    const step = list[position];
    const partner = linkedWith(data, step) && list[position + 1] && stepKey(list[position + 1]) === stepKey(linkedWith(data, step)!) ? position + 1
      : isLinkedSecond(data, step) ? position - 1 : -1;
    this.update(list.filter((_, i) => i !== position && i !== partner));
  }

  protected move(position: number, delta: number) {
    const list = [...this.steps()];
    const target = position + delta;
    if (target < 0 || target >= list.length) return;
    [list[position], list[target]] = [list[target], list[position]];
    this.update(list);
  }

  private update(list: RotationStep[]) {
    this.steps.set(cleanSteps(this.character(), list, middleContext(this.character(), this.intro())));
  }
}
