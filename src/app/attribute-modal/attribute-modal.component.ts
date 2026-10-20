import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { Stats } from '../core/damage-engine';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

export type StatKey = keyof Stats;

/** Stats compared in the "new" column, in display order */
const STAT_ROWS: Array<{ key: StatKey; prefix?: string; label: string; visible?: (c: Character) => boolean }> = [
  { key: 'hp', label: 'HP', visible: c => c.hpScale },
  { key: 'dmg', label: 'ATK' },
  { key: 'def', label: 'DEF', visible: c => c.defScale },
  { key: 'cChance', label: 'Crit. Rate %' },
  { key: 'cDmg', label: 'Crit. DMG %' },
  { key: 'skillBonus', prefix: 'char.skill', label: 'Bonus %' },
  { key: 'basicBonus', prefix: 'char.basic', label: 'Bonus %' },
  { key: 'heavyBonus', prefix: 'char.heavy', label: 'Bonus %' },
  { key: 'liberationBonus', label: 'Lib. Bonus %' },
  { key: 'elementalBonus', prefix: 'char.elemental', label: 'DMG %' },
  { key: 'healingBonus', label: 'Healing Bonus %', visible: c => c.canHeal || c.healType },
];

const KIND_COLORS: Record<string, string> = {
  basic: 'text-kind-basic', skill: 'text-kind-skill', liberation: 'text-kind-liberation',
  intro: 'text-kind-intro', outro: 'text-kind-outro', heavy: 'text-kind-heavy',
};

@Component({
    selector: 'app-attribute-modal',
    templateUrl: './attribute-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: { class: 'block w-[min(90rem,calc(100vw-2rem))]' },
    imports: [FormsModule, DecimalPipe, NgTemplateOutlet, TranslocoPipe, DialogPanelComponent]
})
export class AttributeModalComponent {

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  /** Values typed in the "new" column (0 means "not filled yet": starts from the current value) */
  draft: Stats = { dmg: 0, hp: 0, def: 0, cChance: 0, cDmg: 0, elementalBonus: 0, basicBonus: 0, heavyBonus: 0, skillBonus: 0, liberationBonus: 0, healingBonus: 0 };
  newQtdCrit: number = 0;

  enhancerBasic: boolean = false;
  enhancerSkill: boolean = true;
  randomCrit: boolean = false;

  critSimFixed: Array<Array<number | boolean>> = [];
  critSimFixedSim: Array<Array<number | boolean>> = [];
  fixedTotal: number = 0;
  fixedSimTotal: number = 0;
  qtdCrit: number = 1;

  constructor() {
    this.recalculateAll();
  }

  protected rows() {
    return STAT_ROWS.filter(r => !r.visible || r.visible(this.character()));
  }

  protected setMode(basic: boolean) {
    this.enhancerBasic = basic;
    this.enhancerSkill = !basic;
    this.recalculateAll();
  }

  /** Unit shown next to the difference between scenarios */
  protected unit(): string {
    return this.character().healType && this.enhancerSkill ? 'char.heal' : 'dmg';
  }

  /** Unit shown next to a scenario total */
  protected totalUnit(): string {
    return this.character().healType && this.character().canHeal && this.enhancerSkill ? 'char.heal' : 'dmg';
  }

  protected kindColor(kind: string): string {
    return KIND_COLORS[kind] ?? '';
  }

  critCalc(simulation: boolean) {
    for (const row of STAT_ROWS) {
      if (this.draft[row.key] == 0) this.draft[row.key] = this.character()[row.key];
    }

    if (this.enhancerBasic) this.simulationBasic(simulation);
    if (this.enhancerSkill) this.simulationRotation(simulation);
  }

  simulationBasic(simulation: boolean) {
    let currentChance = this.character().cChance;
    let critMult = this.character().cDmg;
    let copy: Character;
    if (simulation) {
      currentChance = this.draft.cChance;
      critMult = this.draft.cDmg;
      this.fixedSimTotal = 0;
      this.newQtdCrit = +(this.draft.cChance / 5).toFixed(0);
      copy = this.characterCopy();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character().cChance / 5).toFixed(0);
    }

    let currentAttack = 0;
    const list: Array<Array<number | boolean>> = [];
    if (this.enhancerBasic) {
      for (let i = 0; i < 20; i++) {
        const dmg: number = simulation ? copy.results.basic.sum[currentAttack] : this.character().results.basic.sum[currentAttack];
        if ((!this.randomCrit && currentChance >= 5) || (this.randomCrit && (Math.floor(Math.random() * 100) + 1) < currentChance)) {
          list[i] = [+(dmg * (critMult / 100)).toFixed(0), true, false];
          currentChance -= (this.randomCrit ? 0 : 5);
        } else {
          list[i] = [dmg, false, false];
        }
        this.fixedTotal += simulation ? 0 : +list[i][0];
        this.fixedSimTotal += simulation ? +list[i][0] : 0;
        currentAttack = currentAttack == this.character().data.basic.ends ? 0 : currentAttack + 1;
      }
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }
  }

  simulationRotation(simulation: boolean) {
    let currentChance = this.character().cChance;
    let critMult = this.character().cDmg;
    let copy: Character;
    if (simulation) {
      currentChance = this.draft.cChance;
      critMult = this.draft.cDmg;
      this.fixedSimTotal = 0;
      this.newQtdCrit = +(this.character().data.rotation.length * (this.draft.cChance / 100)).toFixed(0);
      copy = this.characterCopy();
    } else {
      this.fixedTotal = 0;
      this.qtdCrit = +(this.character().data.rotation.length * (currentChance / 100)).toFixed(0);
    }

    const list: Array<Array<number | boolean>> = [];
    const rotation = this.character().data.rotation;
    if (!this.randomCrit) currentChance = (!simulation ? this.qtdCrit : this.newQtdCrit);
    let heal: boolean = false;
    for (let i = 0; i < rotation.length; i++) {
      if (this.character().canHeal) heal = !!rotation[i].healing;

      const dmg = simulation ? copy.rotationValue(rotation[i]) : this.character().rotationValue(rotation[i]);
      if ((!this.randomCrit && currentChance > 0) || (this.randomCrit && (Math.floor(Math.random() * 100) + 1) < currentChance)) {
        list[i] = [+(dmg * ((heal ? 100 : critMult) / 100)).toFixed(0), true, heal];
        currentChance -= (this.randomCrit ? 0 : 1);
      } else {
        list[i] = [dmg, false, heal];
      }

      this.fixedTotal += simulation || (this.character().healType && !heal && this.character().canHeal) || (!this.character().healType && heal) ? 0 : +list[i][0];
      this.fixedSimTotal += !simulation || (this.character().healType && !heal && this.character().canHeal) || (!this.character().healType && heal) ? 0 : +list[i][0]
    }

    if (simulation) {
      this.critSimFixedSim = list;
    } else {
      this.critSimFixed = list;
    }
  }

  characterCopy(): Character {
    const copy = this.character().clone();
    Object.assign(copy, this.draft);
    copy.calculate();
    return copy;
  }

  recalculateAll() {
    this.critCalc(false);
    this.critCalc(true);
  }
}
