import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { NavbarComponent } from './navbar/navbar.component';
import { Settings } from './shared/models/settings.model';
import { StorageService } from './shared/services/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet, TranslocoPipe, NavbarComponent]
})

export class AppComponent {
  title = 'NfeKteD Tools - Wuthering Waves Calculator';

  private translocoService = inject(TranslocoService);
  private storage = inject(StorageService);

  lang = signal('');
  settings = signal<Settings | null>(null);

  constructor() {
    this.init();
  }

  private async init() {
    const saved = await this.storage.loadSettings();
    if (!saved) {
      const settings = new Settings();
      settings.language = this.translocoService.getActiveLang();
      this.lang.set(settings.language);
      this.settings.set(settings);
      await this.storage.saveSettings(settings);
    } else {
      this.settings.set(Object.assign(new Settings(), saved));
      this.changeLang(saved.language, true);
    }
  }

  acceptCookies() {
    const settings = this.settings()!;
    settings.coockie = true;
    this.storage.saveSettings(settings);
  }

  changeLang(lang: string, skipSave?: boolean) {
    this.translocoService.setActiveLang(lang);
    this.lang.set(lang);

    const settings = this.settings();
    if (!skipSave && settings) {
      settings.language = lang;
      this.storage.saveSettings(settings);
    }
  }
}
