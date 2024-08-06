import { Component } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Encore } from '../shared/models/encore.model';
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
    this.characterList = [new Encore(), new Jinhsi()];
  }

  createNew() {
    switch (this.currentSelection) {
      case 'encore':
        const enc: Encore = new Encore();
        const char: Character = new Character(this.characters.length, enc);
        char.atk = true;
        this.characters.push(char);
        break;
      default: break;
    }
  }

}
