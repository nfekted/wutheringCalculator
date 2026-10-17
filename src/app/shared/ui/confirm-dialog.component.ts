import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-dialog',
  imports: [TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="w-[min(26rem,calc(100vw-2rem))] rounded-sm border border-hairline bg-surface p-6 text-body">
      <p id="confirm-title" class="text-base text-ink">{{ message }}</p>
      <div class="mt-6 flex justify-end gap-2">
        <button type="button" class="ui-btn ui-btn-secondary" (click)="ref.close(false)">{{ 'cancel' | transloco }}</button>
        <button type="button" class="ui-btn ui-btn-primary" cdkFocusInitial (click)="ref.close(true)">{{ 'confirm' | transloco }}</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  protected ref = inject<DialogRef<boolean>>(DialogRef);
  protected message = inject<string>(DIALOG_DATA);
}
