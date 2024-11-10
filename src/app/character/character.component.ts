import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Util } from '../shared/utils/util.model';
import Swal from 'sweetalert2';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  @Input() character: Character;
  @Output() callbackDelete: EventEmitter<number> = new EventEmitter<number>();

  sum: boolean = false;

  nameEdit: boolean = false;
  currentSelection: string = '';
  showHelp: boolean = false;
  lang: string = 'en';

  constructor(private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    this.currentSelection = this.character.character.icon;
    this.lang = this.transloco.getActiveLang();
  }

  upgrade(type: number) {
    switch (type) {
      case 0:
        this.character.character.basicCurrent += this.character.character.basicCurrent == 10 ? -9 : 1;
        break;
      case 1:
        this.character.character.skillCurrent += this.character.character.skillCurrent == 10 ? -9 : 1;
        break;
      case 2:
        this.character.character.forteCurrent += this.character.character.forteCurrent == 10 ? -9 : 1;
        break;
      case 3:
        this.character.character.liberationCurrent += this.character.character.liberationCurrent == 10 ? -9 : 1;
        break;
      case 4:
        this.character.character.introCurrent += this.character.character.introCurrent == 10 ? -9 : 1;
        break;
    }
    this.calculate();
  }

  calculate() {
    this.character.calculate();
    this.save();
  }

  save() {
    if (Util.load()['autosave']) {
      // Util.save(Util.characters, 'wuteringcalculator-chars');
      console.log('chamou character')
      Util.saveCharacters();
    };
  }

  getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
    return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
  }

  getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
    const bonus = 100 + elementalBonus + damageBonus;
    return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
  }

  delete() {
    Swal.fire({
      title: this.transloco.translate('char.delete'),
      showDenyButton: true,
      confirmButtonText: this.transloco.translate('confirm'),
      denyButtonText: this.transloco.translate('cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.callbackDelete.emit(this.character.index);
      }
    });
  }

  download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.character)));
    element.setAttribute('download', 'antigo');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
