import { Component, OnInit } from '@angular/core';
import { Partner } from '../shared/models/partner.model.js';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss',
})
export class PartnersComponent implements OnInit {

  embedTwitch: any;

  partners: Array<Partner> = new Array<Partner>();

  // this.embedTwitch = new Twitch.Embed("twitch-embed", {
  //   width: 854,
  //   height: 480,
  //   channel: "zawthz",
  //   muted: true,
  //   layout: 'video'
  // });

  constructor(private transloco: TranslocoService) { }

  ngOnInit(): void {
    this.partners.push(this.zawthz());
  }

  private zawthz(): Partner {
    const name: string = 'Zawthz';
    const image: string = 'https://yt3.googleusercontent.com/QbDllWVKfccQgegERZvZGvcH66HwxOj-9jonYv0Hv6teMHC8vUMK_q5eR7-zwAQHmBgzemMHjw=s160-c-k-c0x00ffffff-no-rj';
    const links: Array<Array<string>> = [
      ['Twitch', 'https://www.twitch.tv/zawthz'],
      ['Youtube', 'https://www.youtube.com/@Zawthz']
    ];
    return new Partner(name, image, links);
  }
}
