import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Stats } from '../core/damage-engine';
import { Character } from '../shared/models/character.model';
import { Echo } from '../shared/models/echo.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

/** What an Echo adds to the attributes */
interface EchoEffect {
  /** Fixed ATK, HP and DEF */
  flat: { hp: number; dmg: number; def: number };
  /** ATK %, HP % and DEF %, applied over the attribute with the fixed values */
  pct: { hp: number; dmg: number; def: number };
  /** Attributes that just add up */
  add: Partial<Record<keyof Stats, number>>;
}

/** Attributes of the summary, in display order */
const STAT_ROWS: Array<{ key: keyof Stats; prefix?: string; label: string; visible?: (c: Character) => boolean }> = [
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
  { key: 'healingBonus', label: 'Healing Bonus %', visible: c => c.data.hasHealing },
  { key: 'energyRegen', label: 'Energy Regen %', visible: c => c.erScale },
];

/** Sub attributes that add up straight to an attribute of the character */
const SUB_ADDS: Record<string, keyof Stats> = {
  'Crit Rate %': 'cChance', 'Crit DMG %': 'cDmg', 'Basic %': 'basicBonus', 'Heavy %': 'heavyBonus',
  'Skill %': 'skillBonus', 'Liberation %': 'liberationBonus', 'Energy Regen %': 'energyRegen',
};

interface HitLine {
  name: string;
  current: number;
  next: number;
  /** Counts in the totals (damage hits in the damage view, healing hits in the healing view) */
  counted: boolean;
}

@Component({
    selector: 'app-echo-comparator-modal',
    templateUrl: './echo-comparator-modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: { class: 'block w-[min(90rem,calc(100vw-2rem))]' },
    imports: [FormsModule, DecimalPipe, NgTemplateOutlet, TranslocoPipe, DialogPanelComponent]
})
export class EchoComparatorModalComponent {

  private transloco = inject(TranslocoService);

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  /** Echo the character uses now (already counted in the typed attributes) and the one to try instead */
  current: Echo = new Echo();
  next: Echo = new Echo();

  text: string = '';
  /** Heal or damage rotation; local so the real character is not changed */
  showHealing = this.character().showHealing;

  rows = STAT_ROWS.filter(r => !r.visible || r.visible(this.character()));
  before: Character = this.character();
  after: Character = this.character();
  lines: HitLine[] = [];
  totalCurrent = 0;
  totalNext = 0;

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
    // The typed attributes, with 1000 standing in for empty ATK/HP/DEF
    const before = this.character().clone();
    before.dmg ||= 1000;
    before.def ||= 1000;
    before.hp ||= 1000;
    before.calculate();

    // The same character with the current Echo taken out and the new one put in
    const after = before.clone();
    this.applyEffect(after, this.effectOf(this.current, after), -1);
    this.applyEffect(after, this.effectOf(this.next, after), 1);
    after.calculate();

    this.before = before;
    this.after = after;
    this.simulate();

    this.echoScore(this.current);
    this.echoScore(this.next);

    const type = this.showHealing ? this.transloco.translate('char.heal') : 'DMG';
    const char = this.character().name;
    const attr = this.next.commonAttr.length;
    const attr2 = this.current.commonAttr.length;

    if (this.totalNext == this.totalCurrent) {
      this.text = this.transloco.translate('char.echo.same', { type });
    } else {
      const perc = this.totalCurrent > 0 ? (Math.abs(this.totalNext - this.totalCurrent) / this.totalCurrent * 100).toFixed(2) : '–';
      this.text = this.transloco.translate(this.totalNext > this.totalCurrent ? 'char.echo.better' : 'char.echo.worse',
        { perc, type, value: Math.round(this.totalNext), value2: Math.round(this.totalCurrent), char });
    }

    // The Echo with more damage has fewer recommended attributes (or the damage is the same and they differ)
    const winnerAttr = this.totalNext >= this.totalCurrent ? attr : attr2;
    const loserAttr = this.totalNext >= this.totalCurrent ? attr2 : attr;
    if (this.totalNext == this.totalCurrent ? attr != attr2 : winnerAttr < loserAttr) {
      this.text += this.transloco.translate('char.echo.however', { attr, attr2, type });
    } else {
      this.text += this.totalNext == this.totalCurrent ? '' : this.transloco.translate('char.echo.because', { attr, attr2, char });
    }
  }

  /** What an Echo adds. The percentages of the main attributes take the elemental DMG of the character into account */
  private effectOf(echo: Echo, char: Character): EchoEffect {
    const effect: EchoEffect = { flat: { hp: 0, dmg: 0, def: 0 }, pct: { hp: 0, dmg: 0, def: 0 }, add: {} };
    const add = (key: keyof Stats, value: number) => effect.add[key] = (effect.add[key] ?? 0) + value;

    for (const index of [echo.main1Index, echo.main2Index]) {
      const value = echo.mainValues[echo.type][index];
      const attr = echo.mainStats[echo.type][index];
      if (index == 0) {
        if (echo.type == 0) effect.flat.hp += value;
        else effect.flat.dmg += value;
      } else if (index == 1) effect.pct.hp += value;
      else if (index == 2) effect.pct.dmg += value;
      else if (index == 3) effect.pct.def += value;
      else if (index == 4) add('energyRegen', value);
      else if (echo.type == 1) {
        if (attr.replace(' DMG %', '').toLowerCase() == char.data.type) add('elementalBonus', value);
      } else if (echo.type == 2) {
        if (index == 5) add('cChance', value);
        if (index == 6) add('cDmg', value);
        if (index == 7) add('healingBonus', value);
      }
    }

    echo.currentSubs.forEach((attr, i) => {
      const value = +echo.currentSubsValue[i] || 0;
      if (attr == 'HP') effect.flat.hp += value;
      else if (attr == 'DEF') effect.flat.def += value;
      else if (attr == 'ATK') effect.flat.dmg += value;
      else if (attr == 'HP %') effect.pct.hp += value;
      else if (attr == 'DEF %') effect.pct.def += value;
      else if (attr == 'ATK %') effect.pct.dmg += value;
      else if (attr && SUB_ADDS[attr]) add(SUB_ADDS[attr], value);
    });

    return effect;
  }

  /** Puts the effect of an Echo in (1) or takes it out (-1): HP, ATK and DEF are (value + fixed) * (1 + %), so taking out is the inverse of it */
  private applyEffect(char: Character, effect: EchoEffect, sign: 1 | -1) {
    for (const key of ['hp', 'dmg', 'def'] as const) {
      const factor = 1 + effect.pct[key] / 100;
      char[key] = Math.max(0, Math.round(sign == 1 ? (char[key] + effect.flat[key]) * factor : char[key] / factor - effect.flat[key]));
    }
    for (const [key, value] of Object.entries(effect.add) as Array<[keyof Stats, number]>) {
      char[key] = Math.max(0, +(char[key] + sign * value).toFixed(2));
    }
  }

  private echoScore(echo: Echo): Echo {
    echo.commonAttr = [];

    const attr1 = echo.mainStats[echo.type][echo.main1Index];
    const attr2 = echo.mainStats[echo.type][echo.main2Index];
    const recommended = [this.character().data.echo1, this.character().data.echo3, this.character().data.echo4][echo.type];
    if (recommended.indexOf(attr1) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr1}`);
    if (recommended.indexOf(attr2) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.main')}: ${attr2}`);

    for (const attr of echo.currentSubs) {
      if (this.character().data.echoSub.indexOf(attr) > -1) echo.commonAttr.push(`${this.transloco.translate('char.echo.sub')}: ${attr}`);
    }

    return echo;
  }

  /** Value of every step of the Rotation build with the attributes before and after the swap */
  private simulate() {
    const wanted = this.showHealing ? 'heal' : 'damage';
    this.lines = this.before.rotationSteps().map(step => {
      const current = this.before.rotationHit(step);
      return {
        name: this.before.data[step.section].hits[step.index]?.name ?? '',
        current: current.value,
        next: this.after.rotationHit(step).value,
        counted: current.type == wanted,
      };
    });
    this.totalCurrent = this.lines.reduce((sum, line) => sum + (line.counted ? line.current : 0), 0);
    this.totalNext = this.lines.reduce((sum, line) => sum + (line.counted ? line.next : 0), 0);
  }
}
