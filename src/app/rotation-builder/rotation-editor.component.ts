import { Component, ChangeDetectionStrategy, computed, input, model } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { HitKind, RotationStep, SectionKey } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';

/** Sections the player picks hits from; intro and outro are always part of the rotation */
const PICKABLE: SectionKey[] = ['basic', 'skill', 'liberation', 'forte'];

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
  /** Damage hit (false for healing and shield, which are not added to the total) */
  damage: boolean;
  value: number;
}

/** Steps of the intro or the outro of a character */
export function sectionSteps(character: Character, section: 'intro' | 'outro'): RotationStep[] {
  return character.data[section].hits.map((_, index): RotationStep => ({ section, index }));
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

/** Editable list of the hits between the intro and the outro, with the damage of each one */
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

  picked = '';

  groups = computed(() => PICKABLE
    .map(section => ({ section, name: this.character().data[section].name, hits: this.character().data[section].hits.map((hit, index) => ({ index, name: hit.name })) }))
    .filter(group => group.hits.length));

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
    const name = hit?.name ?? this.mainEcho()?.name ?? '—';
    return { step, position, name, color: kind ? KIND_COLORS[kind] ?? '' : '', damage: type === 'damage', value };
  }

  protected add() {
    if (!this.picked) return;
    const [section, index] = this.picked.split(':');
    this.steps.set([...this.steps(), { section: section as RotationStep['section'], index: +index }]);
    this.picked = '';
  }

  protected remove(position: number) {
    this.steps.set(this.steps().filter((_, i) => i !== position));
  }

  protected move(position: number, delta: number) {
    const list = [...this.steps()];
    const target = position + delta;
    if (target < 0 || target >= list.length) return;
    [list[position], list[target]] = [list[target], list[position]];
    this.steps.set(list);
  }
}
