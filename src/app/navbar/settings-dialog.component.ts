import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Theme } from '../shared/models/settings.model';
import { SettingsService } from '../shared/services/settings.service';
import { StorageService } from '../shared/services/storage.service';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';
import { ConfirmService } from '../shared/ui/confirm.service';

@Component({
  selector: 'app-settings-dialog',
  imports: [TranslocoPipe, DialogPanelComponent],
  host: { class: 'block w-[min(32rem,calc(100vw-2rem))]' },
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-dialog-panel [title]="'settings.settings' | transloco" titleId="settings-title">
      <fieldset>
        <legend class="mb-2 text-sm font-medium text-ink">{{ 'lang' | transloco }}</legend>
        <div class="grid grid-cols-2 gap-2">
          @for (l of languages; track l.code) {
            <label class="ui-option">
              <input type="radio" class="sr-only" name="language" [checked]="settings.lang() === l.code" (change)="settings.setLanguage(l.code)" />
              <img [src]="'assets/img/' + l.flag" height="20" alt="" class="h-5 w-auto" />
              {{ l.label }}
            </label>
          }
        </div>
      </fieldset>

      <fieldset class="mt-6">
        <legend class="mb-2 text-sm font-medium text-ink">{{ 'settings.theme' | transloco }}</legend>
        <div class="grid grid-cols-2 gap-2">
          @for (t of themes; track t) {
            <label class="ui-option">
              <input type="radio" class="sr-only" name="theme" [checked]="settings.theme() === t" (change)="settings.setTheme(t)" />
              <span class="material-symbols-outlined" aria-hidden="true">{{ t === 'light' ? 'light_mode' : 'dark_mode' }}</span>
              {{ 'settings.theme-' + t | transloco }}
            </label>
          }
        </div>
      </fieldset>

      <div class="mt-8 border-t border-hairline pt-6">
        <button type="button" class="ui-btn ui-btn-danger" (click)="delete()">
          <span class="material-symbols-outlined" aria-hidden="true">delete</span>
          {{ 'settings.deleteSettings' | transloco }}
        </button>
      </div>
    </app-dialog-panel>
  `
})
export class SettingsDialogComponent {
  protected settings = inject(SettingsService);
  private storage = inject(StorageService);
  private confirmation = inject(ConfirmService);
  private transloco = inject(TranslocoService);

  protected languages = [
    { code: 'en', label: 'English', flag: 'enflag.png' },
    { code: 'pt', label: 'Português', flag: 'ptflag.png' }
  ];
  protected themes: Theme[] = ['light', 'dark'];

  protected async delete() {
    if (await this.confirmation.confirm(this.transloco.translate('settings.deleteConfirm'))) {
      this.storage.clear();
    }
  }
}
