import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { WEAPONS, getWeapon } from '../data/weapons';
import { WeaponData, WeaponSlot } from '../data/weapons/weapon-data.model';
import { Character } from '../shared/models/character.model';
import { DialogPanelComponent } from '../shared/ui/dialog-panel.component';
import { attributeLabel } from '../echo-set/echo-attribute';

/** Picks the weapon of the character (only of its weapon type) and its rank; every change is applied at once */
@Component({
  selector: 'app-weapon-modal',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block w-[min(48rem,calc(100vw-2rem))]' },
  imports: [TranslocoPipe, DialogPanelComponent],
  template: `
    <app-dialog-panel [title]="'char.weapon.title' | transloco" titleId="weapon-title">
      @if (!character().hasBase) {
        <p class="ui-card mb-4 bg-surface-2 p-3 text-xs text-body">{{ 'char.weapon.noBase' | transloco }}</p>
      }

      @if (selected(); as weapon) {
        <div class="ui-card mb-4 p-4">
          <div class="flex items-start gap-3">
            <img [src]="'assets/img/weapons/' + weapon.id + '.webp'" alt="" class="h-16 w-16 shrink-0 rounded-sm bg-surface-2" (error)="$any($event.target).hidden = true" />
            <div class="min-w-0 flex-1">
              <p class="font-bold text-ink">{{ weapon.name }}</p>
              <p class="text-xs text-mute">ATK {{ weapon.atk }} · {{ label(weapon) }} {{ weapon.main.value }}</p>
              <div role="group" [attr.aria-label]="'char.weapon.rank' | transloco" class="mt-2 flex gap-1">
                @for (rank of ranks; track rank) {
                  <button type="button" class="ui-icon-btn h-8 w-10 text-sm font-bold" [attr.aria-pressed]="slot()!.rank === rank"
                    [class.bg-surface-2]="slot()!.rank === rank" [class.ring-1]="slot()!.rank === rank" (click)="setRank(rank)">R{{ rank }}</button>
                }
              </div>
            </div>
            <button type="button" class="ui-icon-btn" [attr.aria-label]="'char.weapon.remove' | transloco" (click)="update(null)">
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>
          <p class="mt-3 whitespace-pre-line text-sm text-body">@for (part of rankText(weapon.text); track $index) {@if ($index % 2) {<b class="text-ink">{{ part }}</b>} @else {{{ part }}}}</p>
          <p class="mt-2 text-xs text-mute">{{ 'char.weapon.counted' | transloco }}</p>
        </div>
      }

      <div class="grid gap-2 sm:grid-cols-2">
        @for (weapon of weapons; track weapon.id) {
          <button type="button" class="ui-btn ui-btn-secondary justify-start gap-2 text-left" [class.ring-1]="weapon.id === slot()?.id" (click)="pick(weapon)">
            <img [src]="'assets/img/weapons/' + weapon.id + '.webp'" alt="" class="h-8 w-8 shrink-0" (error)="$any($event.target).hidden = true" />
            <span class="min-w-0">
              <span class="block truncate">{{ weapon.name }}</span>
              <span class="block text-xs text-mute">ATK {{ weapon.atk }} · {{ label(weapon) }} {{ weapon.main.value }}</span>
            </span>
          </button>
        } @empty {
          <p class="text-sm text-mute">{{ 'char.weapon.empty' | transloco }}</p>
        }
      </div>
    </app-dialog-panel>
  `
})
export class WeaponModalComponent {

  character = signal(inject<Character>(DIALOG_DATA)).asReadonly();
  private transloco = inject(TranslocoService);

  protected readonly ranks = [1, 2, 3, 4, 5];
  /** Weapons of the type of the character, the strongest first */
  protected readonly weapons = WEAPONS.filter(w => w.type === this.character().data.weapon).reverse();

  slot = signal<WeaponSlot | null>(this.character().weapon);
  selected = computed(() => {
    const slot = this.slot();
    return slot ? getWeapon(slot.id) : undefined;
  });

  protected label(weapon: WeaponData): string {
    return attributeLabel(weapon.main, this.transloco);
  }

  /** The passive text with only the value of the rank in each "R1/R2/R3/R4/R5" group (e.g. "12%/15%/18%/21%/24%" at R3 → "18%"):
   * the parts at odd positions are those values */
  protected rankText(text: string): string[] {
    const rank = this.slot()?.rank ?? 1;
    // A group written with the % only on the last value ("30/37.5/45/52.5/60%") keeps the % on every rank
    return text.split(/([\d.]+%?(?:\/[\d.]+%?){4})/).map((part, i) => {
      if (!(i % 2)) return part;
      const value = part.split('/')[rank - 1];
      return part.endsWith('%') && !value.endsWith('%') ? value + '%' : value;
    });
  }

  protected pick(weapon: WeaponData) {
    this.update({ id: weapon.id, rank: this.slot()?.rank ?? 1 });
  }

  protected setRank(rank: number) {
    this.update({ ...this.slot()!, rank });
  }

  protected update(slot: WeaponSlot | null) {
    this.slot.set(slot);
    const character = this.character();
    character.weapon = slot;
    character.applyEchoSet();
    character.calculate();
  }
}
