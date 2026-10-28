import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { HitKind, RotationStep, SectionKey } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

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

@Component({
  selector: 'app-rotation-builder-modal',
  templateUrl: './rotation-builder-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(60rem,calc(100vw-2rem))]' },
  imports: [FormsModule, DecimalPipe, TranslocoPipe, DialogPanelComponent]
})
export class RotationBuilderModalComponent {

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  /** Hits between the intro and the outro */
  middle = signal<RotationStep[]>(this.character().rotationBuild ?? this.character().data.rotationBuild ?? []);
  picked = '';

  hasDefault = (this.character().data.rotationBuild?.length ?? 0) > 0;

  groups = PICKABLE
    .map(section => ({ section, name: this.character().data[section].name, hits: this.character().data[section].hits.map((hit, index) => ({ index, name: hit.name })) }))
    .filter(group => group.hits.length);

  rows = computed<Row[]>(() => {
    const all = (section: SectionKey) => this.character().data[section].hits.map((_, index): RotationStep => ({ section, index }));
    return [
      ...all('intro').map(step => this.row(step, -1)),
      ...this.middle().map((step, position) => this.row(step, position)),
      ...all('outro').map(step => this.row(step, -1)),
    ];
  });

  total = computed(() => this.rows().reduce((sum, row) => sum + (row.damage ? row.value : 0), 0));
  damageHits = computed(() => this.rows().filter(row => row.damage).length);

  private row(step: RotationStep, position: number): Row {
    const character = this.character();
    const hit = character.data[step.section].hits[step.index];
    const kind = character.mode > 0 && hit.altKind ? hit.altKind : hit.kind;
    const result = character.results[step.section][step.index];
    const damage = kind !== 'heal' && kind !== 'shield';

    let value = 0;
    if (result && !damage) {
      value = result.sum;
    } else if (result) {
      // Average of the damage spread, mixing the hits without and with a crit by the crit rate
      const range = result.commonSum;
      const chance = Math.min(character.cChance, 100) / 100;
      value = (range.min + range.max) / 2 * (1 - chance) + (range.critMin + range.critMax) / 2 * chance;
    }
    return { step, position, name: hit.name, color: KIND_COLORS[kind] ?? '', damage, value: Number.isFinite(value) ? value : 0 };
  }

  protected add() {
    if (!this.picked) return;
    const [section, index] = this.picked.split(':');
    this.update([...this.middle(), { section: section as SectionKey, index: +index }]);
    this.picked = '';
  }

  protected remove(position: number) {
    this.update(this.middle().filter((_, i) => i !== position));
  }

  protected move(position: number, delta: number) {
    const list = [...this.middle()];
    const target = position + delta;
    if (target < 0 || target >= list.length) return;
    [list[position], list[target]] = [list[target], list[position]];
    this.update(list);
  }

  protected importDefault() {
    this.update([...(this.character().data.rotationBuild ?? [])]);
  }

  protected clear() {
    this.update([]);
  }

  private update(list: RotationStep[]) {
    this.middle.set(list);
    this.character().rotationBuild = list;
  }
}
