import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

/** Common frame of every dialog: title bar with a close button and a scrollable body. */
@Component({
  selector: 'app-dialog-panel',
  imports: [TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex max-h-[calc(100dvh-2rem)] flex-col rounded-sm border border-hairline bg-surface text-body' },
  template: `
    <header class="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
      <h2 [id]="titleId()" class="text-base font-bold text-ink">{{ title() }}</h2>
      <button type="button" class="ui-icon-btn" [attr.aria-label]="'close' | transloco" (click)="ref.close()">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </header>
    <div class="overflow-y-auto p-5">
      <ng-content />
    </div>
  `
})
export class DialogPanelComponent {
  protected ref = inject(DialogRef);

  title = input.required<string>();
  titleId = input('dialog-title');
}
