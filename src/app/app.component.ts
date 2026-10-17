import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { NavbarComponent } from './navbar/navbar.component';
import { Settings } from './shared/models/settings.model';
import { Util } from './shared/utils/util.model';

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

  lang = signal('');
  settings = signal(new Settings());

  constructor() {
    const saved = Util.load();
    if (!saved) {
      this.lang.set(this.translocoService.getActiveLang());
      const settings = new Settings();
      settings.language = this.lang();
      settings.audio = true;
      settings.autosave = true;
      settings.coockie = false;
      this.settings.set(settings);
      Util.save(settings);
    } else {
      this.settings.set(Object.assign(new Settings(), saved));
      this.changeLang(this.settings().language, true);
    }
  }

  changeOptions(option: string) {
    const settings = this.settings();
    switch (option) {
      case 'coockie': settings.coockie = !settings.coockie; break;
      case 'autosave': settings.audio = !settings.autosave; break;
      case 'audio': settings.audio = !settings.audio; break;
    }
    Util.save(settings);
  }

  changeLang(lang: string, skipSave?: boolean) {
    this.translocoService.setActiveLang(lang);
    this.lang.set(lang);

    if (!skipSave) {
      this.settings().language = lang;
      Util.save(this.settings())
    }
  }
}
