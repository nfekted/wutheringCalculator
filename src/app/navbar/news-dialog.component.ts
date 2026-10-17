import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

@Component({
  selector: 'app-news-dialog',
  imports: [TranslocoPipe, DialogPanelComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(40rem,calc(100vw-2rem))]' },
  template: `
    <app-dialog-panel [title]="'versions.versions' | transloco" titleId="news-title">
      <div class="text-sm leading-relaxed" [innerHtml]="'versions.future' | transloco"></div>
      <hr class="my-4 border-hairline" />
      <div class="space-y-4 text-sm leading-relaxed">
        @for (v of versions; track v) {
          <div [innerHtml]="'versions.' + (v + 1) | transloco"></div>
        }
      </div>
    </app-dialog-panel>
  `
})
export class NewsDialogComponent {
  protected versions = [1, 0];
}
