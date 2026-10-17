import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Character } from '../shared/models/character.model';
import { Echo } from '../shared/models/echo.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

@Component({
    selector: 'app-echo-comparator-modal',
    templateUrl: './echo-comparator-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: { class: 'block w-[min(90rem,calc(100vw-2rem))]' },
    imports: [FormsModule, TranslocoPipe, DialogPanelComponent]
})
export class EchoComparatorModalComponent {

  private transloco = inject(TranslocoService);

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  echo1: Echo = new Echo();
  echo2: Echo = new Echo();
  echoes = [this.echo1, this.echo2];

  text: string = '';
  /** Heal or damage rotation; local so the real character is not changed */
  healType = this.character().healType;

  constructor() {
    this.calculate();
  }

  protected recommended() {
    const data = this.character().data;
    return [
      { title: 'char.echo.echo4', items: data.echo4 },
      { title: 'char.echo.echo3', items: data.echo3 },
      { title: 'char.echo.echo1', items: data.echo1 },
      { title: 'char.echo.sub', items: data.echoSub },
    ];
  }

  calculate() {
    this.echo2.type = this.echo1.type;

    // Simulation character: the real attributes, with 1000 standing in for empty ATK/HP/DEF
    const char1 = this.character().clone();
    char1.healType = this.healType;
    char1.dmg ||= 1000;
    char1.def ||= 1000;
    char1.hp ||= 1000;

    const char2 = char1.clone();

    this.echoUpgrade(char1, this.echo1);
    this.echoUpgrade(char2, this.echo2);

    char1.calculate();
    char2.calculate();

    const total1: number = this.simulate(char1);
    const total2: number = this.simulate(char2);

    // Difference relative to the weaker echo, so it reads the same whichever echo wins
    const weaker = Math.min(total1, total2);
    const diff = weaker > 0 ? (Math.abs(total2 - total1) / weaker * 100).toFixed(2) : '–';
    const type = (this.healType && this.character().canHeal) ? this.transloco.translate('char.heal') : 'DMG';

    this.echoScore(this.echo1);
    this.echoScore(this.echo2);

    if (total1 == total2) {
      this.text = this.transloco.translate('char.echo.same', { type });
    } else {
      this.text = this.transloco.translate('char.echo.text', { echo: (total1 > total2 ? 1 : 2), perc: diff, type, value: total1, value2: total2, char: this.character().name });
    }

    if ((total1 > total2 && this.echo1.commonAttr.length < this.echo2.commonAttr.length) ||
      (total2 > total1 && this.echo2.commonAttr.length < this.echo1.commonAttr.length) ||
      (total1 == total2 && this.echo1.commonAttr.length != this.echo2.commonAttr.length)) {
      this.text += this.transloco.translate('char.echo.however', { attr: this.echo1.commonAttr.length, attr2: this.echo2.commonAttr.length, type });
    } else {
      this.text += total1 == total2 ? '' : this.transloco.translate('char.echo.because', { attr: this.echo1.commonAttr.length, attr2: this.echo2.commonAttr.length, char: this.character().name });
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
          char.elementalBonus += index > 4 && (attr.toLowerCase().replace(' dmg', '') == char.data.type) ? value : 0;//ELEMENTAL
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
      if (this.character().data.echo1.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character().data.echo1.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    if (echo.type == 1) {
      if (this.character().data.echo3.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character().data.echo3.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    if (echo.type == 2) {
      if (this.character().data.echo4.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
      if (this.character().data.echo4.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);
    }

    for (const attr of echo.currentSubs) {
      if (this.character().data.echoSub.indexOf(attr) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.sub')}: ${attr}`);
    }

    return echo;
  }

  simulate(char: Character): number {
    let total: number = 0;
    const rotation = char.data.rotation;
    let heal: boolean = false;
    // Every step counts at its expected value: dmg * (1 + rate * (critDmg - 1)), rate capped at 100%
    const rate = Math.min(Math.max(char.cChance, 0), 100) / 100;
    const expected = 1 + rate * (char.cDmg / 100 - 1);
    for (let i = 0; i < rotation.length; i++) {
      if (this.healType) heal = !!rotation[i].healing;

      const value = +(char.rotationValue(rotation[i]) * expected).toFixed(0);
      total += (this.healType && !heal && this.character().canHeal) ? 0 : value;
    }

    return total;
  }


}
