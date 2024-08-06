import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Settings } from './shared/models/settings.model';
import { Util } from './shared/utils/util.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'PLACEHOLDER';

  lang: string = '';
  settings: Settings;

  constructor(private translocoService: TranslocoService) {
    this.settings = Util.load();
    if (!this.settings) {
      this.lang = translocoService.getActiveLang();
      this.settings = new Settings();
      this.settings.language = this.lang;
      Util.save(this.settings);
    } else {
      this.changeLang(this.settings.language, true);
    }
  }

  changeLang(lang: string, skipSave?: boolean) {
    this.translocoService.setActiveLang(lang);
    this.lang = lang;

    if (!skipSave) {
      this.settings.language = lang;
      Util.save(this.settings)
    }
  }
}
