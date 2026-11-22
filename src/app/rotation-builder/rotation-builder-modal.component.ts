import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { RotationStep } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';
import { simulateRotation } from '../core/team-engine';
import { cleanSteps, middleContext } from '../core/rotation-rules';
import { RotationEditorComponent } from './rotation-editor.component';

@Component({
  selector: 'app-rotation-builder-modal',
  templateUrl: './rotation-builder-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(60rem,calc(100vw-2rem))]' },
  imports: [DecimalPipe, TranslocoPipe, DialogPanelComponent, RotationEditorComponent]
})
export class RotationBuilderModalComponent {

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  /** Hits between the intro and the outro */
  middle = signal<RotationStep[]>(this.character().rotationBuild ?? []);

  hasDefault = (this.character().data.rotationBuild?.length ?? 0) > 0;

  /** The rotation with the buffs the character gives itself (Inherent Skills, states) */
  private result = computed(() => simulateRotation(this.character(), this.middle()));
  /** One per row of the editor: the hits added by a hit (e.g. the bursts of a detonation) go into its value, with a note */
  private merged = computed(() => {
    const list: { value: number; added: Map<string, number> }[] = [];
    for (const row of this.result().rows) {
      if (!row.auto || !list.length) { list.push({ value: row.buffed, added: new Map() }); continue; }
      const last = list[list.length - 1];
      const name = row.name.replace(/\s*(Damage|DMG)$/i, '');
      last.value += row.buffed;
      last.added.set(name, (last.added.get(name) ?? 0) + 1);
    }
    return list;
  });
  values = computed(() => this.merged().map(row => row.value));
  notes = computed(() => this.merged().map(row => [...row.added].map(([name, count]) => `+${count} ${name}`).join(', ')));
  total = computed(() => this.result().total.buffed);
  damageHits = computed(() => this.result().total.hits);

  protected importDefault() {
    this.update(cleanSteps(this.character(), [...(this.character().data.rotationBuild ?? [])], middleContext(this.character(), true)));
  }

  protected clear() {
    this.update([]);
  }

  protected update(list: RotationStep[]) {
    this.middle.set(list);
    this.character().rotationBuild = list;
  }
}
