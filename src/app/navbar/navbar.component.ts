import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NewsDialogComponent } from './news-dialog.component';
import { SettingsDialogComponent } from './settings-dialog.component';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, RouterLinkActive, TranslocoPipe]
})
export class NavbarComponent {

  private dialog = inject(Dialog);

  openSettings() {
    this.dialog.open(SettingsDialogComponent, { backdropClass: 'app-backdrop', ariaLabelledBy: 'settings-title' });
  }
}
