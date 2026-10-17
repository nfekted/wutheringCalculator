import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { SectionKey } from '../data/character-data.model';
import { Levels, Stats } from '../core/damage-engine';
import { AttributeModalComponent } from '../attribute-modal/attribute-modal.component';
import { EchoComparatorModalComponent } from '../echo-comparator/echo-comparator-modal.component';
import { Character } from '../shared/models/character.model';
import { ConfirmService } from '../shared/ui/confirm.service';
import { DamageTableComponent } from './damage-table.component';

interface StatField {
  key: keyof Stats;
  /** Translation key prepended to the label (e.g. the skill name in "Skill Bonus %") */
  prefix?: string;
  label: string;
  visible?: (character: Character) => boolean;
}

const STAT_FIELDS: StatField[] = [
  { key: 'hp', label: 'HP', visible: c => c.hpType },
  { key: 'dmg', label: 'ATK' },
  { key: 'def', label: 'DEF', visible: c => c.defType },
  { key: 'cChance', label: 'Crit. Rate %' },
  { key: 'cDmg', label: 'Crit. DMG %' },
  { key: 'skillBonus', prefix: 'char.skill', label: 'Bonus %' },
  { key: 'basicBonus', prefix: 'char.basic', label: 'Bonus %' },
  { key: 'heavyBonus', prefix: 'char.heavy', label: 'Bonus %' },
  { key: 'liberationBonus', label: 'Lib. Bonus %' },
  { key: 'elementalBonus', prefix: 'char.elemental', label: 'DMG %' },
  { key: 'healingBonus', label: 'Healing Bonus %', visible: c => c.canHeal || c.healType },
];

@Component({
    selector: 'app-character',
    templateUrl: './character.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, DatePipe, DecimalPipe, TranslocoPipe, DamageTableComponent],
    providers: [provideTranslocoScope('char')]
})
export class CharacterComponent {

  private transloco = inject(TranslocoService);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmService);

  character = input.required<Character>();
  callbackDelete = output<number>();
  changed = output<void>();

  total = signal(false);
  nameEdit = signal(false);
  showHelp = signal(false);
  lang: string = this.transloco.getActiveLang();

  /** Skill levels in the order they are shown, with the icon of each */
  protected levelRows: Array<{ key: keyof Levels; icon: (c: Character) => string }> = [
    { key: 'basic', icon: c => c.data.weapon },
    { key: 'skill', icon: c => c.data.icon + '-skill' },
    { key: 'forte', icon: c => c.data.icon + '-forte' },
    { key: 'liberation', icon: c => c.data.icon + '-liberation' },
    { key: 'intro', icon: c => c.data.icon + '-intro' },
  ];

  /** Tables, in display order */
  protected sections: Array<{ key: SectionKey; open: boolean; dot: string }> = [
    { key: 'basic', open: true, dot: 'bg-kind-basic' },
    { key: 'skill', open: true, dot: 'bg-kind-skill' },
    { key: 'liberation', open: true, dot: 'bg-kind-liberation' },
    { key: 'forte', open: false, dot: 'bg-kind-heavy' },
    { key: 'intro', open: false, dot: 'bg-kind-intro' },
    { key: 'outro', open: false, dot: 'bg-kind-outro' },
  ];

  /** Highest damage total of a section, shown on its closed header (healing rows are skipped) */
  protected peak(key: SectionKey): number {
    const heal = this.character().data[key].heal;
    return this.character().results[key].sum
      .filter((v, i) => Number.isFinite(v) && !heal?.[i])
      .reduce((max, v) => Math.max(max, v), 0);
  }

  protected fields(): StatField[] {
    return STAT_FIELDS.filter(f => !f.visible || f.visible(this.character()));
  }

  protected changeLevel(type: keyof Levels, delta: number) {
    const levels = this.character().levels;
    levels[type] = Math.min(10, Math.max(1, levels[type] + delta));
    this.calculate();
  }

  calculate() {
    this.character().calculate();
    this.changed.emit();
  }

  protected finishNameEdit() {
    this.nameEdit.set(false);
    this.changed.emit();
  }

  protected openEnhancer() {
    this.dialog.open(AttributeModalComponent, { data: this.character(), backdropClass: 'app-backdrop', ariaLabelledBy: 'enhancer-title' });
  }

  protected openEchoComparator() {
    this.dialog.open(EchoComparatorModalComponent, { data: this.character(), backdropClass: 'app-backdrop', ariaLabelledBy: 'echo-title' });
  }

  protected async delete() {
    if (await this.confirmation.confirm(this.transloco.translate('char.delete'))) {
      this.callbackDelete.emit(this.character().index);
    }
  }
}
