import { Component } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Encore } from '../shared/models/encore.model';
import { Jinhsi } from '../shared/models/jinhsi.model';
import { Sanhua } from '../shared/models/sanhua.model';

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
    this.characterList = [new Encore(), new Sanhua()];
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
      default: break;
    }
    this.characters.push(char);
  }

  charCreation(char: any) {
    return new Character(this.characters.length, char);
  }

}
