import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Stats } from '../core/damage-engine';
import { StatModifier, echoModifier } from '../core/stat-engine';
import { EchoData, EchoSlot } from '../data/echos/echo-data.model';
import { ECHOS, getEcho, getSonata } from '../data/echos';
import { EchoEditorComponent } from '../echo-set/echo-editor.component';
import { attributeLabel, isRecommended } from '../echo-set/echo-attribute';
import { COSTS, MAX_COST, costWithout, sonataGroups } from '../echo-set/echo-set-modal.component';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';

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
    imports: [FormsModule, DecimalPipe, TranslocoPipe, DialogPanelComponent, EchoEditorComponent]
})
export class EchoComparatorModalComponent {

  private transloco = inject(TranslocoService);

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();

  protected readonly getEcho = getEcho;
  protected readonly getSonata = getSonata;
  protected readonly label = attributeLabel;
  protected readonly maxCost = MAX_COST;
  sonataGroups = sonataGroups(this.character().data.id);

  /** Slot being swapped (null until one is picked) and the Echo built to go in it */
  slot: number | null = null;
  next: EchoSlot | null = null;
  /** Sonata and Echo picked for the new Echo; the editor then builds `next` */
  nextSonata: number | null = null;
  nextEcho: EchoData | null = null;

  /** Recommended attributes of the current and the new Echo */
  currentAttr: string[] = [];
  nextAttr: string[] = [];
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

  /** Registered Echos, with the position of their slot */
  protected filled() {
    return this.character().echoSet.flatMap((slot, index) => slot ? [{ index, slot }] : []);
  }

  /** Echos of the picked Sonata, by cost */
  protected echoGroups() {
    return COSTS.map(cost => ({
      cost,
      echos: ECHOS.filter(e => e.cost === cost && this.nextSonata !== null && e.sonatas.includes(this.nextSonata))
        .sort((a, b) => a.name.localeCompare(b.name)),
    })).filter(group => group.echos.length);
  }

  /** Whether both Echos are known, so the comparison can run */
  protected get ready(): boolean {
    return this.slot !== null && this.next !== null;
  }

  /** The swap would take the total cost of the set over the limit */
  protected get overCost(): boolean {
    return this.slot !== null && !!this.nextEcho && costWithout(this.character().echoSet, this.slot) + this.nextEcho.cost > MAX_COST;
  }

  protected pickSonata() {
    this.nextEcho = null;
    this.setNext(null);
  }

  protected pickEcho() {
    this.setNext(null);
  }

  protected setNext(slot: EchoSlot | null) {
    this.next = slot;
    this.calculate();
  }

  protected recommended() {
    const { main, subs } = this.character().data.recommended;
    return [
      { title: 'char.echo.echo4', items: main[4] },
      { title: 'char.echo.echo3', items: main[3] },
      { title: 'char.echo.echo1', items: main[1] },
      { title: 'char.echo.sub', items: subs },
    ];
  }

  calculate() {
    const current = this.slot !== null ? this.character().echoSet[this.slot] : null;
    const before = this.character().clone();
    if (!before.hasBase) {
      // The typed attributes, with 1000 standing in for empty ATK/HP/DEF
      before.dmg ||= 1000;
      before.def ||= 1000;
      before.hp ||= 1000;
    }
    before.calculate();

    // The same character with the new Echo in the slot; the Echo Skill steps follow the new main Echo
    const after = before.clone();
    if (this.ready) {
      after.echoSet[this.slot!] = this.next;
      if (after.hasBase) {
        after.applyEchoSet();
      } else {
        this.applyEffect(after, echoModifier(current!, after.data.type), -1);
        this.applyEffect(after, echoModifier(this.next!, after.data.type), 1);
      }
    }
    after.calculate();

    this.before = before;
    this.after = after;
    this.simulate();

    this.currentAttr = this.recommendedOf(current);
    this.nextAttr = this.recommendedOf(this.next);

    const type = this.showHealing ? this.transloco.translate('char.heal') : 'DMG';
    const char = this.character().name;
    const attr = this.nextAttr.length;
    const attr2 = this.currentAttr.length;

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

  /** Puts the new Echo in the slot, as the swap in the game; the character is saved when the window closes */
  protected swap() {
    if (!this.ready || this.overCost) return;
    const character = this.character();
    character.echoSet = character.echoSet.map((slot, i) => i === this.slot ? this.next : slot);
    character.applyEchoSet();
    character.calculate();
    this.nextSonata = null;
    this.nextEcho = null;
    this.setNext(null);
  }

  /** Without the base: puts the effect of an Echo in (1) or takes it out (-1): HP, ATK and DEF are (value + fixed) * (1 + %), so taking out is the inverse of it */
  private applyEffect(char: Character, effect: StatModifier, sign: 1 | -1) {
    for (const key of ['hp', 'dmg', 'def'] as const) {
      const factor = 1 + effect.pct[key] / 100;
      char[key] = Math.max(0, Math.round(sign == 1 ? (char[key] + effect.flat[key]) * factor : char[key] / factor - effect.flat[key]));
    }
    for (const [key, value] of Object.entries(effect.add) as Array<[keyof Stats, number]>) {
      char[key] = Math.max(0, +(char[key] + sign * value).toFixed(2));
    }
  }

  /** Recommended attributes an Echo has: its main attributes against the list of its cost, its substats against the substat list */
  private recommendedOf(slot: EchoSlot | null): string[] {
    const echo = slot && getEcho(slot.echo);
    if (!echo) return [];
    const recommended = this.character().data.recommended;
    const main = this.transloco.translate('char.echo.main');
    const sub = this.transloco.translate('char.echo.sub');
    return [
      ...[slot.main].filter(a => isRecommended(recommended, a, echo.cost)).map(a => `${main}: ${attributeLabel(a)}`),
      ...slot.subs.filter(a => isRecommended(recommended, a)).map(a => `${sub}: ${attributeLabel(a)}`),
    ];
  }

  /** Value of every step of the Rotation build with the attributes before and after the swap */
  private simulate() {
    const wanted = this.showHealing ? 'heal' : 'damage';
    this.lines = this.before.rotationSteps().map(step => {
      const current = this.before.rotationHit(step);
      return {
        name: this.before.stepHit(step)?.name ?? this.after.stepHit(step)?.name ?? '',
        current: current.value,
        next: this.after.rotationHit(step).value,
        counted: current.type == wanted,
      };
    });
    this.totalCurrent = this.lines.reduce((sum, line) => sum + (line.counted ? line.current : 0), 0);
    this.totalNext = this.lines.reduce((sum, line) => sum + (line.counted ? line.next : 0), 0);
  }
}
