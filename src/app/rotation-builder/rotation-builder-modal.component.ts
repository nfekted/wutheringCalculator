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
  middle = signal<RotationStep[]>(this.character().rotationBuild ?? this.character().data.rotationBuild ?? []);

  hasDefault = (this.character().data.rotationBuild?.length ?? 0) > 0;

  /** The rotation with the buffs the character gives itself (Inherent Skills, states) */
  private result = computed(() => simulateRotation(this.character(), this.middle()));
  values = computed(() => this.result().rows.map(row => row.buffed));
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
