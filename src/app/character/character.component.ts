import { Component, Input } from '@angular/core';
import { Character } from '../shared/models/character.model';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {

  @Input() character: Character;
  nameEdit: boolean = false;
  currentSelection: string = '';

  critSimFixed: Array<Array<number | boolean>> = [];
  critSimFixedSim: Array<Array<number | boolean>> = [];
  fixedTotal: number = 0;
  fixedSimTotal: number = 0;

  newCritChance: number = 5;
  newCritDmg: number = 150;
  qtdCrit: number = 1;

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
    const c = this.character.character;
    //Basic attack
    const basic = c.basicCurrent - 1;
    for (let i = 0; i < this.character.character.basic.length; i++) {
      const ex = this.getExpected(this.character.dmg, c.basic[i], basic, this.character.elementalBonus, i == this.character.character.basic.length - 1 ? this.character.heavyBonus : this.character.basicBonus);
      this.character.basicDmg[i] = +ex.toFixed(0);
      this.character.basicCommonDmg[i] = this.getRange(ex, false);
      this.character.basicResDmg[i] = this.getRange(ex, true);
    }
    //End of basic attack
    //Skill DMG
    const skill = c.skillCurrent - 1;
    for (let i = 0; i < this.character.character.skill.length; i++) {
      const ex = this.getExpected(this.character.dmg, c.skill[i], skill, this.character.elementalBonus, this.character.skillBonus);
      this.character.skillDmg[i] = +ex.toFixed(0);
      this.character.skillCommonDmg[i] = this.getRange(ex, false);
      this.character.skillResDmg[i] = this.getRange(ex, true);
    }
    //End Skill DMG
    //Liberation DMG
    const liberation = c.liberationCurrent - 1;
    let limit = (this.character.character.liberation.length + this.character.character.skill.length);
    for (let i = this.character.skillDmg.length; i < limit; i++) {
      const ex = this.getExpected(this.character.dmg, c.liberation[i - this.character.character.skill.length], liberation, this.character.elementalBonus, this.character.liberationBonus);
      this.character.skillDmg[i] = +ex.toFixed(0);
      this.character.skillCommonDmg[i] = this.getRange(ex, false);
      this.character.skillResDmg[i] = this.getRange(ex, true);
    }
    //End Liberation DMG

    //Intro DMG
    const intro = c.introCurrent - 1;
    for (let i = 0; i < this.character.character.intro.length; i++) {
      const ex = this.getExpected(this.character.dmg, c.intro[i], intro, this.character.elementalBonus, 1);
      this.character.introDmg[i] = +ex.toFixed(0);
      this.character.introCommonDmg[i] = this.getRange(ex, false);
      this.character.introResDmg[i] = this.getRange(ex, true);
    }
    //End of Intro DMG

    //Outro DMG
    limit = (this.character.character.outro.length + this.character.character.intro.length);
    for (let i = this.character.introDmg.length; i < limit; i++) {
      const ex = this.getExpected(this.character.dmg, c.outro[i - this.character.character.intro.length], 0, this.character.elementalBonus, 1);
      this.character.introDmg[i] = +ex.toFixed(0);
      this.character.introCommonDmg[i] = this.getRange(ex, false);
      this.character.introResDmg[i] = this.getRange(ex, true);
    }
    //End Outro DMG

    //Forte DMG
    limit = (this.character.character.forte.length + limit);
    const forte = c.forteCurrent - 1;
    for (let i = this.character.introDmg.length; i < limit; i++) {
      const ex = this.getExpected(this.character.dmg, c.forte[(i - this.character.character.intro.length) - this.character.character.outro.length], forte, this.character.elementalBonus, 1);
      this.character.introDmg[i] = +ex.toFixed(0);
      this.character.introCommonDmg[i] = this.getRange(ex, false);
      this.character.introResDmg[i] = this.getRange(ex, true);
    }
    //End Forte DMG

  }

  getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
    return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
  }

  getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
    const bonus = 100 + elementalBonus + damageBonus;
    return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
  }

  getRange(ex: number, resistance: boolean): string {
    const res: number = resistance ? 0.33 : 0.49;

    return `${(ex * 0.93 * res).toFixed(0)} ~ ${(ex * 1.065 * res).toFixed(0)} `
      + `(${((ex * (this.character.cDmg / 100)) * 0.93 * res).toFixed(0)} ~ ${((ex * (this.character.cDmg / 100)) * 1.065 * res).toFixed(0)})`;
  }

  critCalc(simulation?: boolean) {
    let currentChance = this.character.cChance;
    let critMult = this.character.cDmg;
    this.qtdCrit = +(this.character.cChance / 5).toFixed(0);

    if (simulation) {
      currentChance = this.newCritChance;
      critMult = this.newCritDmg;
      this.fixedSimTotal = 0;
    } else {
      this.fixedTotal = 0;
    }

    let currentAttack = 0;
    const list: Array<Array<number | boolean>> = [];
    for (let i = 0; i < 20; i++) {
      const ex = this.getExpected(this.character.dmg, this.character.character.basic[currentAttack], this.character.character.basicCurrent - 1, this.character.elementalBonus, this.character.basicBonus);
      if (currentChance >= 5) {
        list[i] = [+(ex * (critMult / 100)).toFixed(0), true];
        currentChance -= 5;
      } else {
        list[i] = [+ex.toFixed(0), false];
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
