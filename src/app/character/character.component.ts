import { Component, Input } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { Util } from '../shared/utils/util.model';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  @Input() character: Character;

  sum: boolean = false;

  nameEdit: boolean = false;
  currentSelection: string = '';

  critSimFixed: Array<Array<number | boolean>> = [];
  critSimFixedSim: Array<Array<number | boolean>> = [];
  fixedTotal: number = 0;
  fixedSimTotal: number = 0;
  qtdCrit: number = 1;

  newAtk: number = 0;
  newCritChance: number = 5;
  newCritDmg: number = 150;
  newQtdCrit: number = 0;


  constructor() {
  }

  ngOnInit(): void {
    this.currentSelection = this.character.character.icon;
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
    if (Util.load()['autosave']) {
      Util.save(Util.characters, 'wuteringcalculator-chars');
    };
  }

  getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
    return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
  }

  getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
    const bonus = 100 + elementalBonus + damageBonus;
    return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
  }

  critCalc(simulation?: boolean) {
    let currentChance = this.character.cChance;
    let critMult = this.character.cDmg;
    let copy = new Character(0, null);
    if (simulation) {
      currentChance = this.newCritChance;
      critMult = this.newCritDmg;
      this.fixedSimTotal = 0;
      this.newQtdCrit = +(this.newCritChance / 5).toFixed(0);
      copy = Object.assign(copy, this.character);
      if (this.newAtk > 0) copy.dmg = this.newAtk;
      copy.calculate();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character.cChance / 5).toFixed(0);
    }

    let currentAttack = 0;
    const list: Array<Array<number | boolean>> = [];
    for (let i = 0; i < 20; i++) {
      const dmg = simulation ? copy.sumBasicDmg[currentAttack] : this.character.sumBasicDmg[currentAttack];
      if (currentChance >= 5) {
        list[i] = [+(dmg * (critMult / 100)).toFixed(0), true];
        currentChance -= 5;
      } else {
        list[i] = [dmg, false];
      }
      this.fixedTotal += simulation ? 0 : +list[i][0];
      this.fixedSimTotal += simulation ? +list[i][0] : 0;
      currentAttack = currentAttack == this.character.character.basicEnds ? 0 : currentAttack + 1;
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }

  }

}
