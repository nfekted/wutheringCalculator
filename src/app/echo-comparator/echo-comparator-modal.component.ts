import { Component, Input, SimpleChanges } from '@angular/core';
import { Character } from '../shared/models/character.model';
import { TranslocoService } from '@ngneat/transloco';
import { Echo } from '../shared/models/echo.model';

@Component({
  selector: 'app-echo-comparator-modal',
  templateUrl: './echo-comparator-modal.component.html',
  styleUrl: './echo-comparator-modal.component.scss'
})
export class EchoComparatorModalComponent {

  @Input() id: string;
  @Input() character: Character;

  currentSelection: string = '';
  echo1: Echo = new Echo();
  echo2: Echo = new Echo();

  text: string = '';

  constructor(private transloco: TranslocoService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentSelection = this.character.character.icon;
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  calculate() {
    this.echo2.type = this.echo1.type;

    let char1 = Object.assign(new Character(0, this.character.character), this.character);
    char1.dmg = 1000;
    char1.cChance = 5;
    char1.cDmg = 150;
    char1.def = 1000;
    char1.hp = 1000;
    char1.basicBonus = 10;
    char1.skillBonus = 10;
    char1.heavyBonus = 10;
    char1.liberationBonus = 10;
    char1.elementalBonus = 10;
    char1.healingBonus = 10;

    let char2 = Object.assign(new Character(1, this.character.character), char1);

    this.echoUpgrade(char1, this.echo1);
    this.echoUpgrade(char2, this.echo2);

    char1.calculate();
    char2.calculate();

    const total1: number = this.simulate(char1);
    const total2: number = this.simulate(char2);

    const diff = Math.abs(+((total2 - total1) / total1).toFixed(4) * 100).toFixed(2);

    this.echoScore(this.echo1);
    this.echoScore(this.echo2);

    if (total1 == total2) {
      this.text = this.transloco.translate('char.echo.same', { type: (this.character.healType && this.character.canHeal) ? this.transloco.translate('char.heal') : 'DMG' });
    } else {
      this.text = this.transloco.translate('char.echo.text', { echo: (total1 > total2 ? 1 : 2), perc: diff, type: (this.character.healType && this.character.canHeal) ? this.transloco.translate('char.heal') : 'DMG', value: total1, value2: total2, char: this.character.character.name });
    }

    if ((total1 > total2 && this.echo1.commonAttr.length < this.echo2.commonAttr.length) ||
      (total2 > total1 && this.echo2.commonAttr.length < this.echo1.commonAttr.length) ||
      (total1 == total2 && this.echo1.commonAttr.length != this.echo2.commonAttr.length)) {
      this.text += this.transloco.translate('char.echo.however', { attr: this.echo1.commonAttr.length, attr2: this.echo2.commonAttr.length, type: (this.character.healType && this.character.canHeal) ? this.transloco.translate('char.heal') : 'DMG' });
    } else {
      this.text += total1 == total2 ? '' : this.transloco.translate('char.echo.because', { attr: this.echo1.commonAttr.length, attr2: this.echo2.commonAttr.length, char: this.character.character.name });
    }
  }

  echoUpgrade(char: Character, echo: Echo): Character {
    //Test echo mains fixed value
    if (echo.main1Index == 0) {
      if (echo.type == 0) char.hp += echo.mainValues[0][0];
      if (echo.type != 0) char.dmg += echo.mainValues[echo.type][0];
    }
    if (echo.main2Index == 0) {
      if (echo.type == 0) char.hp += echo.mainValues[0][0];
      if (echo.type != 0) char.dmg += echo.mainValues[echo.type][0];
    }

    //Test echo substats fixed values
    for (let i = 0; i < 5; i++) {
      if (echo.currentSubs[i] == 'HP') char.hp += echo.currentSubsValue[i];
      if (echo.currentSubs[i] == 'DEF') char.def += echo.currentSubsValue[i];
      if (echo.currentSubs[i] == 'ATK') char.dmg += echo.currentSubsValue[i];
    }

    //Final base status
    const baseHp: number = char.hp;
    const baseAtk: number = char.dmg;
    const baseDef: number = char.def;

    const indexes: [number, number] = [echo.main1Index, echo.main2Index];

    //Test echo main % value primary
    for (const index of indexes) {
      if (index > 0) {
        const value: number = echo.mainValues[echo.type][index];
        const attr: string = echo.mainStats[echo.type][index].replace(' %', '');
        char.hp += index == 1 ? +(baseHp * (value / 100)).toFixed(0) : 0;//HP
        char.dmg += index == 2 ? +(baseAtk * (value / 100)).toFixed(0) : 0;//ATK
        char.def += index == 3 ? +(baseDef * (value / 100)).toFixed(0) : 0;//DEF
        //4 - Energy regen
        if (echo.type == 1) {
          char.elementalBonus += index > 4 && (attr.toLocaleLowerCase().replace(' DMG', '') == char.character.type) ? value : 0;//ELEMENTAL
        } else if (echo.type == 2) {
          char.cChance += index == 5 ? value : 0;//Critical chance
          char.cDmg += index == 6 ? value : 0;//Critical damage
          char.healingBonus += index == 7 ? value : 0;//Healing
        }
      }
    }

    //Test echo substats % values
    for (let i = 0; i < 5; i++) {
      const value: number = echo.currentSubsValue[i];
      const attr: string = (echo.currentSubs[i]);
      char.hp += attr == 'HP %' ? +(baseHp * (value / 100)).toFixed(0) : 0;
      char.dmg += attr == 'ATK %' ? +(baseAtk * (value / 100)).toFixed(0) : 0;
      char.def += attr == 'DEF %' ? +(baseDef * (value / 100)).toFixed(0) : 0;
      char.cChance += attr == 'Crit Rate %' ? value : 0;
      char.cDmg += attr == 'Crit DMG %' ? value : 0;
      char.basicBonus += attr == 'Basic %' ? value : 0;
      char.heavyBonus += attr == 'Heavy %' ? value : 0;
      char.skillBonus += attr == 'Skill %' ? value : 0;
      char.liberationBonus += attr == 'Liberation %' ? value : 0;
    }

    return char;
  }

  echoScore(echo: Echo): Echo {
    echo.commonAttr = [];

    const attr1 = echo.mainStats[echo.type][echo.main1Index];
    const attr2 = echo.mainStats[echo.type][echo.main2Index];
    if (echo.type == 0) {
      if (this.character.character.echo1.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character.character.echo1.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    if (echo.type == 1) {
      if (this.character.character.echo3.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character.character.echo3.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    if (echo.type == 2) {
      if (this.character.character.echo4.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character.character.echo4.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    for (const attr of echo.currentSubs) {
      if (this.character.character.echoSub.indexOf(attr) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.sub')}: ${attr}`);
    }

    return echo;
  }

  simulate(char: Character): number {
    let total: number = 0;
    const list: Array<Array<number | boolean>> = [];
    const rotation = char.character.rotation;
    let heal: boolean = false;
    let currentChance = +(this.character.character.rotation[0].length * (char.cChance / 100)).toFixed(0);
    for (let i = 0; i < rotation[0].length; i++) {
      if (this.character.healType) heal = (this.character.character.rotation[0][i] as string).includes('sumHealing');

      const dmg = char[rotation[0][i]][rotation[1][i]];
      if (currentChance > 0) {
        list[i] = [+(dmg * (char.cDmg / 100)).toFixed(0), true, heal];
        currentChance -= 1;
      } else {
        list[i] = [dmg, false, heal];
      }

      total += (this.character.healType && !heal && this.character.canHeal) ? 0 : +list[i][0];
    }

    return total;
  }


}
