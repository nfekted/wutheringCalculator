import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NavbarComponent } from './navbar/navbar.component';
import { SettingsService } from './shared/services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet, TranslocoPipe, NavbarComponent]
})
export class AppComponent {
  title = 'NfeKteD Tools - Wuthering Waves Calculator';

  protected settings = inject(SettingsService);
  protected showCookieBanner = computed(() => this.settings.settings()?.coockie === false);

  constructor() {
    this.settings.init();
  }
}
