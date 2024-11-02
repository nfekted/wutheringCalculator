import { Component, Input, SimpleChanges } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-attribute-modal',
  templateUrl: './attribute-modal.component.html',
})
export class AttributeModalComponent {

  @Input() id: string;
  @Input() character: Character;

  currentSelection: string = '';
  newAtk: number = 0;
  newHp: number = 0;
  newDef: number = 0;
  newCritChance: number = 0;
  newCritDmg: number = 0;
  newSkillBonus: number = 0;
  newBasicBonus: number = 0;
  newHeavyBonus: number = 0;
  newQtdCrit: number = 0;
  newElemental: number = 0;
  newLiberationBonus: number = 0;
  newHealingBonus: number = 0;

  enhancerBasic: boolean = false;
  enhancerSkill: boolean = true;
  randomCrit: boolean = false;

  critSimFixed: Array<Array<number | boolean>> = [];
  critSimFixedSim: Array<Array<number | boolean>> = [];
  fixedTotal: number = 0;
  fixedSimTotal: number = 0;
  qtdCrit: number = 1;

  constructor(private transloco: TranslocoService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentSelection = this.character.character.icon;
    this.recalculateAll();
  }

  getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
    return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
  }

  getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
    const bonus = 100 + elementalBonus + damageBonus;
    return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
  }

  critCalc(simulation: boolean) {
    if (this.newAtk == 0) this.newAtk = this.character.dmg;
    if (this.newHp == 0) this.newHp = this.character.hp;
    if (this.newDef == 0) this.newDef = this.character.def;
    if (this.newCritChance == 0) this.newCritChance = this.character.cChance;
    if (this.newCritDmg == 0) this.newCritDmg = this.character.cDmg;
    if (this.newSkillBonus == 0) this.newSkillBonus = this.character.skillBonus;
    if (this.newBasicBonus == 0) this.newBasicBonus = this.character.basicBonus;
    if (this.newHeavyBonus == 0) this.newHeavyBonus = this.character.heavyBonus;
    if (this.newLiberationBonus == 0) this.newLiberationBonus = this.character.liberationBonus;
    if (this.newElemental == 0) this.newElemental = this.character.elementalBonus;
    if (this.newHealingBonus == 0) this.newHealingBonus = this.character.healingBonus;

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
      copy = this.characterCopy();
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
          list[i] = [+(dmg * (critMult / 100)).toFixed(0), true, false];
          currentChance -= (this.randomCrit ? 0 : 5);
        } else {
          list[i] = [dmg, false, false];
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
      copy = this.characterCopy();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character.character.rotation[0].length * (currentChance / 100)).toFixed(0);
    }

    const list: Array<Array<number | boolean>> = [];
    const rotation = this.character.character.rotation;
    if (!this.randomCrit) currentChance = (!simulation ? this.qtdCrit : this.newQtdCrit);
    let heal: boolean = false;
    for (let i = 0; i < rotation[0].length; i++) {
      if (this.character.canHeal) heal = (this.character.character.rotation[0][i] as string).includes('sumHealing');

      const dmg = simulation ? copy[rotation[0][i]][rotation[1][i]] : this.character[rotation[0][i]][rotation[1][i]];
      if ((!this.randomCrit && currentChance > 0) || (this.randomCrit && (Math.floor(Math.random() * 100) + 1) < currentChance)) {
        list[i] = [+(dmg * (critMult / 100)).toFixed(0), true, heal];
        currentChance -= (this.randomCrit ? 0 : 1);
      } else {
        list[i] = [dmg, false, heal];
      }

      this.fixedTotal += simulation || (this.character.healType && !heal && this.character.canHeal) || (!this.character.healType && heal) ? 0 : +list[i][0];
      this.fixedSimTotal += !simulation || (this.character.healType && !heal && this.character.canHeal) || (!this.character.healType && heal) ? 0 : +list[i][0]
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }
  }

  characterCopy(): Character {
    let copy = new Character(0, null);
    copy = Object.assign(copy, this.character);
    copy.dmg = this.newAtk;
    copy.hp = this.newHp;
    copy.def = this.newDef;
    copy.cChance = this.newCritChance;
    copy.cDmg = this.newCritDmg;
    copy.skillBonus = this.newSkillBonus;
    copy.basicBonus = this.newBasicBonus;
    copy.heavyBonus = this.newHeavyBonus;
    copy.liberationBonus = this.newLiberationBonus;
    copy.elementalBonus = this.newElemental;
    copy.healingBonus = this.newHealingBonus;
    copy.calculate();
    return copy;
  }

  recalculateAll() {
    this.critCalc(false);
    this.critCalc(true);
  }
}
