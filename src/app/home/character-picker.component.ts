import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';
import { CharacterGridComponent } from './character-grid.component';

/** Pick the character to add: one click on a card closes the dialog with its id. */
@Component({
  selector: 'app-character-picker',
  imports: [TranslocoPipe, DialogPanelComponent, CharacterGridComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(80rem,calc(100vw-2rem))]' },
  template: `
    <app-dialog-panel [title]="'home.char-modal-title' | transloco" titleId="picker-title">
      <app-character-grid (picked)="ref.close($event)" />
    </app-dialog-panel>
  `
})
export class CharacterPickerComponent {
  protected ref = inject<DialogRef<string>>(DialogRef);
}
