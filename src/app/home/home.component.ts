import { Component } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Encore } from '../shared/models/encore.model';
import { Sanhua } from '../shared/models/sanhua.model';
import { Util } from '../shared/utils/util.model';
import { Jinhsi } from '../shared/models/jinhsi.model';

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
    this.characterList = [new Encore(), new Sanhua(), new Jinhsi()];
  }

  ngOnInit(): void {
    this.load();
  }

  createNew() {
    let char: Character;
    switch (this.currentSelection) {
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
  }

  charCreation(char: any) {
    console.log('Criando: ')
    console.log(new Character(0, char));
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
}
