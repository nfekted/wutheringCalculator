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

  critSimFixed: Array<Array<number | boolean>> = [];
  critSimFixedSim: Array<Array<number | boolean>> = [];
  fixedTotal: number = 0;
  fixedSimTotal: number = 0;
  qtdCrit: number = 1;

  newAtk: number = 0;
  newCritChance: number = 0;
  newCritDmg: number = 0;
  newQtdCrit: number = 0;
  newBasicBonus: number = 0;
  newElemental: number = 0;
  newSkillBonus: number = 0;
  newLiberationBonus: number = 0;

  enhancerBasic: boolean = true;
  enhancerSkill: boolean = false;
  randomCrit: boolean = false;


  constructor(private transloco: TranslocoService) {
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
    this.save();
  }

  save() {
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

  critCalc(simulation: boolean) {
    if (this.newCritChance == 0) this.newCritChance = this.character.cChance;
    if (this.newAtk == 0) this.newAtk = this.character.dmg;
    if (this.newCritDmg == 0) this.newCritDmg = this.character.cDmg;
    if (this.newBasicBonus == 0) this.newBasicBonus = this.character.basicBonus;
    if (this.newElemental == 0) this.newElemental = this.character.elementalBonus;
    if (this.newSkillBonus == 0) this.newSkillBonus = this.character.skillBonus;
    if (this.newLiberationBonus == 0) this.newLiberationBonus = this.character.liberationBonus;

    if (this.enhancerBasic) this.simulationBasic(simulation);
    if (this.enhancerSkill) this.simulationRotation(simulation);
  }

  simulationBasic(simulation: boolean) {
    let currentChance = this.character.cChance;
    let critMult = this.character.cDmg;
    let copy = new Character(0, null);
    if (simulation) {
      currentChance = this.newCritChance;
      critMult = this.newCritDmg;
      this.fixedSimTotal = 0;
      this.newQtdCrit = +(this.newCritChance / 5).toFixed(0);
      copy = Object.assign(copy, this.character);
      copy.dmg = this.newAtk;
      copy.cChance = this.newCritChance;
      copy.cDmg = this.newCritDmg;
      copy.elementalBonus = this.newElemental;
      copy.basicBonus = this.newBasicBonus;
      copy.skillBonus = this.newSkillBonus;
      copy.liberationBonus = this.newLiberationBonus;
      copy.calculate();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character.cChance / 5).toFixed(0);
    }

    let currentAttack = 0;
    const list: Array<Array<number | boolean>> = [];
    if (this.enhancerBasic) {
      for (let i = 0; i < 20; i++) {
        const dmg: number = simulation ? copy.sumBasicDmg[currentAttack] : this.character.sumBasicDmg[currentAttack];
        if ((!this.randomCrit && currentChance >= 5) || (this.randomCrit && (Math.floor(Math.random() * 100) + 1) < currentChance)) {
          list[i] = [+(dmg * (critMult / 100)).toFixed(0), true];
          currentChance -= (this.randomCrit ? 0 : 5);
        } else {
          list[i] = [dmg, false];
        }
        this.fixedTotal += simulation ? 0 : +list[i][0];
        this.fixedSimTotal += simulation ? +list[i][0] : 0;
        currentAttack = currentAttack == this.character.character.basicEnds ? 0 : currentAttack + 1;
      }
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }
  }

  simulationRotation(simulation: boolean) {
    let currentChance = this.character.cChance;
    let critMult = this.character.cDmg;
    let copy = new Character(0, null);
    if (simulation) {
      currentChance = this.newCritChance;
      critMult = this.newCritDmg;
      this.fixedSimTotal = 0;
      this.newQtdCrit = +(this.character.character.rotation[0].length * (this.newCritChance / 100)).toFixed(0);
      copy = Object.assign(copy, this.character);
      copy.dmg = this.newAtk;
      copy.cChance = this.newCritChance;
      copy.cDmg = this.newCritDmg;
      copy.elementalBonus = this.newElemental;
      copy.basicBonus = this.newBasicBonus;
      copy.skillBonus = this.newSkillBonus;
      copy.liberationBonus = this.newLiberationBonus;
      copy.calculate();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character.character.rotation[0].length * (currentChance / 100)).toFixed(0);
    }

    const list: Array<Array<number | boolean>> = [];
    const rotation = this.character.character.rotation;
    if (!this.randomCrit) currentChance = this.newQtdCrit;
    for (let i = 0; i < rotation[0].length; i++) {
      const dmg = simulation ? copy[rotation[0][i]][rotation[1][i]] : this.character[rotation[0][i]][rotation[1][i]];
      if ((!this.randomCrit && currentChance > 0) || (this.randomCrit && (Math.floor(Math.random() * 100) + 1) < currentChance)) {
        list[i] = [+(dmg * (critMult / 100)).toFixed(0), true];
        currentChance -= (this.randomCrit ? 0 : 1);
      } else {
        list[i] = [dmg, false];
      }

      this.fixedTotal += simulation ? 0 : +list[i][0];
      this.fixedSimTotal += simulation ? +list[i][0] : 0;
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }
  }

  recalculateAll() {
    this.critCalc(false);
    this.critCalc(true);
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

}
