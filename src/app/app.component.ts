import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Settings } from './shared/models/settings.model';
import { Util } from './shared/utils/util.model';
import Twitch from '../assets/scripts/twitch.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'PLACEHOLDER';

  lang: string = '';
  settings: Settings;
  embedTwitch: any;

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

  async ngOnInit(): Promise<void> {
    // this.embedTwitch = new Twitch.Embed("twitch-embed", {
    //   width: 854,
    //   height: 480,
    //   channel: "zawthz",
    //   muted: true,
    //   layout: 'video'
    // });
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
