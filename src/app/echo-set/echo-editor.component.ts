import { Component, ChangeDetectionStrategy, OnInit, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { EchoAttribute, EchoCost, EchoData, EchoSlot } from '../data/echos/echo-data.model';
import { CharacterRecommendation } from '../data/character-data.model';
import { ECHO_VALUES, getSonata } from '../data/echos';
import { sameAttribute } from '../core/stat-engine';
import { attributeLabel, isRecommended } from './echo-attribute';

const SUB_COUNT = 5;

/** Edits the attributes of one Echo: the chosen main attribute and up to 5 substats with the allowed values */
@Component({
  selector: 'app-echo-editor',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, TranslocoPipe],
  template: `
    <div class="space-y-4">
      <div>
        <p class="font-bold text-ink">{{ echo().name }}</p>
        <p class="flex items-center gap-1 text-xs text-mute">{{ 'char.echoSet.cost' | transloco: { cost: echo().cost } }} · <img [src]="'assets/img/sonatas/' + sonata() + '.webp'" alt="" class="h-4 w-4 shrink-0" (error)="$any($event.target).hidden = true" />{{ sonataName }}</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-xs text-mute">
          <span class="mb-1 block">{{ 'char.echoSet.mainAttr' | transloco }}</span>
          <select class="ui-input text-sm" [(ngModel)]="main">
            @for (option of costValues.options; track $index) {
              <option [ngValue]="$index">{{ mark(option, echo().cost) }}{{ label(option) }} {{ option.value }}</option>
            }
          </select>
        </label>
        <div class="text-xs text-mute">
          <span class="mb-1 block">{{ 'char.echoSet.fixedAttr' | transloco }}</span>
          <p class="py-2 text-sm text-ink">{{ label(costValues.fixed) }} {{ costValues.fixed.value }}</p>
        </div>
      </div>

      <div>
        <p class="mb-1 text-xs text-mute">{{ 'char.echoSet.subs' | transloco }}</p>
        <div class="space-y-2">
          @for (row of subs; track $index; let i = $index) {
            <div class="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
              <select class="ui-input text-sm" [attr.aria-label]="('char.echoSet.subs' | transloco) + ' ' + (i + 1)"
                [(ngModel)]="row.sub" (ngModelChange)="row.value = null">
                <option [ngValue]="null">{{ 'char.echoSet.none' | transloco }}</option>
                @for (sub of subValues; track $index; let s = $index) {
                  <option [ngValue]="s" [disabled]="usedElsewhere(s, i)">{{ mark(sub) }}{{ label(sub) }}</option>
                }
              </select>
              <select class="ui-input text-sm" [attr.aria-label]="('char.echoSet.value' | transloco) + ' ' + (i + 1)"
                [(ngModel)]="row.value" [disabled]="row.sub === null">
                <option [ngValue]="null">–</option>
                @if (row.sub !== null) {
                  @for (value of subValues[row.sub].values; track value) {
                    <option [ngValue]="value">{{ value }}</option>
                  }
                }
              </select>
            </div>
          }
        </div>
      </div>

      @if (recommended()) {
        <p class="text-xs text-mute">{{ 'char.echoSet.recommendedMark' | transloco }}</p>
      }

      <div class="flex justify-end gap-2">
        <button type="button" class="ui-btn ui-btn-secondary" (click)="cancelled.emit()">{{ 'char.echoSet.cancel' | transloco }}</button>
        <button type="button" class="ui-btn ui-btn-primary" (click)="save()">{{ 'char.echoSet.save' | transloco }}</button>
      </div>
    </div>
  `
})
export class EchoEditorComponent implements OnInit {

  echo = input.required<EchoData>();
  sonata = input.required<number>();
  /** The slot being edited; without it, a new Echo */
  slot = input<EchoSlot | null>(null);
  /** What the character recommends; its attributes get a star */
  recommended = input<CharacterRecommendation | null>(null);

  saved = output<EchoSlot>();
  cancelled = output<void>();

  protected readonly subValues = ECHO_VALUES.subs;
  protected readonly label = attributeLabel;
  protected costValues = ECHO_VALUES.main[1];
  protected sonataName = '';
  /** Index of the chosen main attribute in the options of the cost */
  protected main = 0;
  /** Index of each substat in the table, and its value; null when the row is empty */
  protected subs: { sub: number | null; value: number | null }[] = [];

  ngOnInit() {
    this.costValues = ECHO_VALUES.main[this.echo().cost];
    this.sonataName = getSonata(this.sonata())?.name ?? '';
    const slot = this.slot();
    this.main = Math.max(0, slot ? this.costValues.options.findIndex(option => sameAttribute(option, slot.main)) : 0);
    this.subs = Array.from({ length: SUB_COUNT }, (_, i) => {
      const sub = slot?.subs[i];
      const index = sub ? this.subValues.findIndex(s => sameAttribute(s, sub)) : -1;
      return index < 0 ? { sub: null, value: null } : { sub: index, value: sub!.value };
    });
  }

  /** Star before a recommended main attribute (with the cost) or substat */
  protected mark(attribute: EchoAttribute, cost?: EchoCost): string {
    const recommended = this.recommended();
    return recommended && isRecommended(recommended, attribute, cost) ? '★ ' : '';
  }

  /** A substat does not repeat in the same Echo */
  protected usedElsewhere(sub: number, row: number): boolean {
    return this.subs.some((s, i) => i !== row && s.sub === sub);
  }

  protected save() {
    const { stat, flat, element } = this.costValues.options[this.main];
    this.saved.emit({
      echo: this.echo().id,
      sonata: this.sonata(),
      main: { stat, ...(flat && { flat }), ...(element && { element }) },
      subs: this.subs
        .filter(row => row.sub !== null && row.value !== null)
        .map(row => {
          const { stat, flat } = this.subValues[row.sub!];
          return { stat, ...(flat && { flat }), value: row.value! };
        }),
    });
  }
}
