import { Component, ChangeDetectionStrategy, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Character } from '../shared/models/character.model';
import Swal from 'sweetalert2';
import { TranslocoPipe, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { AttributeModalComponent } from '../attribute-modal/attribute-modal.component';
import { EchoComparatorModalComponent } from '../echo-comparator/echo-comparator-modal.component';

@Component({
    selector: 'app-character',
    templateUrl: './character.component.html',
    styleUrl: './character.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, DatePipe, DecimalPipe, TranslocoPipe, AttributeModalComponent, EchoComparatorModalComponent],
    providers: [provideTranslocoScope('char')]
})
export class CharacterComponent {

  private transloco = inject(TranslocoService);

  character = input.required<Character>();
  callbackDelete = output<number>();
  changed = output<void>();

  sum = signal(false);

  nameEdit = signal(false);
  currentSelection = computed(() => this.character().data.icon);
  showHelp = signal(false);
  lang: string = this.transloco.getActiveLang();

  upgrade(type: 'basic' | 'skill' | 'forte' | 'liberation' | 'intro') {
    const levels = this.character().levels;
    levels[type] += levels[type] == 10 ? -9 : 1;
    this.calculate();
  }

  calculate() {
    this.character().calculate();
    this.changed.emit();
  }

  getHit(dmg: number, multiplierRange: Array<number>, upgradeLevel: number): number {
    return dmg * ((multiplierRange[upgradeLevel] / 100) * 1)//1 Relative to Ressonance Chain
  }

  getExpected(dmg: number, multiplierRange: Array<number>, upgradeLevel: number, elementalBonus: number, damageBonus: number): number {
    const bonus = 100 + elementalBonus + damageBonus;
    return this.getHit(dmg, multiplierRange, upgradeLevel) * (bonus / 100) * 1 * 1//Outro bonus and critical multiplier
  }

  delete() {
    Swal.fire({
      title: this.transloco.translate('char.delete'),
      showDenyButton: true,
      confirmButtonText: this.transloco.translate('confirm'),
      denyButtonText: this.transloco.translate('cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.callbackDelete.emit(this.character().index);
      }
    });
  }

  download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.character())));
    element.setAttribute('download', 'antigo');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
