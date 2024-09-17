import { Component } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Encore } from '../shared/models/encore.model';
import { Sanhua } from '../shared/models/sanhua.model';
import { Util } from '../shared/utils/util.model';
import { Jinhsi } from '../shared/models/jinhsi.model';
import { Aalto } from '../shared/models/aalto.model';
import { Baizhi } from '../shared/models/baizhi.model';
import { Calcharo } from '../shared/models/calcharo.model';
import { Changli } from '../shared/models/changli.model';
import { Chixia } from '../shared/models/chixia.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  characterList: any[] = [];
  characters: Array<Character> = new Array<Character>();
  currentSelection: string = '';

  constructor() {
    this.characterList = [new Aalto(), new Baizhi(), new Calcharo(), new Changli(), new Chixia(), new Encore(), new Sanhua(), new Jinhsi()];
  }

  ngOnInit(): void {
    this.load();
  }

  createNew() {
    let char: Character;
    switch (this.currentSelection) {
      case 'aalto':
        const aal: Aalto = new Aalto();
        char = this.charCreation(aal);
        char.atk = true;
        break;
      case 'baizhi':
        const bai: Baizhi = new Baizhi();
        char = this.charCreation(bai);
        char.hp = true;
        char.heal = true;
        break;
      case 'calcharo':
        const cal: Calcharo = new Calcharo();
        char = this.charCreation(cal);
        char.atk = true;
        break;
      case 'changli':
        const cha: Changli = new Changli();
        char = this.charCreation(cha);
        char.atk = true;
        break;
      case 'chixia':
        const chi: Chixia = new Chixia();
        char = this.charCreation(chi);
        char.atk = true;
        break;
      case 'encore':
        const enc: Encore = new Encore();
        char = this.charCreation(enc);
        char.atk = true;
        break;
      case 'sanhua':
        const san: Sanhua = new Sanhua();
        char = this.charCreation(san);
        char.atk = true;
        break;
      case 'jinhsi':
        const jin: Jinhsi = new Jinhsi();
        char = this.charCreation(jin);
        char.atk = true;
        break;
      default: break;
    }
    this.characters.push(char);
    Util.characters = this.characters;
    this.currentSelection = '';

    this.save();
  }

  save() {
    if (Util.load()['autosave']) {
      Util.save(Util.characters, 'wuteringcalculator-chars');
    };
  }

  charCreation(char: any) {
    return new Character(this.characters.length, char);
  }

  load() {
    const load = Util.load('wuteringcalculator-chars');
    if (!load) {
      this.characters = new Array<Character>();
    } else {
      for (const c of load) {
        this.characters.push(Object.assign(new Character(0, null), c));
      }
      Util.characters = this.characters;
    }
  }

  audio(type: string) {
    const settings = Util.load();
    if (settings?.audio) {
      new Audio(`assets/sound/${type}.wav`).play();
    }
  }

  delete(index: number) {
    this.characters = this.characters.filter(c => c.index != index);
    for (let i = 0; i < this.characters.length; i++) {
      this.characters[i].index = i;
    }

    Util.characters = this.characters;
    this.save();
  }
}
