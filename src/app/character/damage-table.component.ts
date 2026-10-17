import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { SectionKey } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';

interface Hit {
  value: number;
  multiplier: number;
}

/** Damage (or healing) of every hit of one skill section. */
@Component({
  selector: 'app-damage-table',
  imports: [DecimalPipe, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block overflow-x-auto' },
  template: `
    <table class="ui-table min-w-[44rem]">
      <thead>
        <tr>
          <th scope="col">{{ 'char.name' | transloco }}</th>
          <th scope="col">{{ 'char.raw' | transloco }}</th>
          <th scope="col">{{ 'char.dmg' | transloco }}</th>
          <th scope="col">{{ 'char.dmgR' | transloco }}</th>
        </tr>
      </thead>
      <tbody>
        @for (i of rows(); track i) {
          <tr>
            <th scope="row" class="font-medium text-ink">{{ skill().names[i] }}</th>
            <td [class.text-ink]="!isHeal(i) && !isShield(i)" [class.text-heal]="isHeal(i)" [class.text-shield]="isShield(i)">
              @for (hit of hits(i); track $index) {
                <div>
                  @if (!$first) { <span class="text-mute">+ </span> }
                  @if (hit.multiplier > 1) { <small class="text-mute">{{ hit.multiplier }}x </small> }
                  {{ isValid(hit.value) ? hit.value : '–' }}
                  @if (!isHeal(i) && isValid(hit.value)) {
                    <span class="text-mute">({{ crit(hit.value) | number: '1.0-0' }})</span>
                  }
                </div>
              }
            </td>
            <td>
              @if (!isHeal(i)) { <div [innerHtml]="range(i, false)"></div> }
            </td>
            <td>
              @if (!isHeal(i)) { <div [innerHtml]="range(i, true)"></div> }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class DamageTableComponent {
  character = input.required<Character>();
  section = input.required<SectionKey>();
  /** Sum every hit of a row instead of listing them one by one */
  total = input(false);

  protected skill = computed(() => this.character().data[this.section()]);
  /** Hits with every level at zero are placeholders (e.g. skills a character does not have) */
  protected rows = computed(() => {
    const scaling = this.skill().scaling;
    return scaling.map((levels, i) => i).filter(i => scaling[i].some(v => v !== 0));
  });

  protected isHeal(i: number): boolean {
    return !!this.skill().heal?.[i];
  }

  protected isShield(i: number): boolean {
    return !this.isHeal(i) && !!this.skill().shield?.[i];
  }

  /** Hits built from incomplete character data come out as NaN or undefined */
  protected isValid(value: number | undefined): boolean {
    return Number.isFinite(value);
  }

  protected crit(value: number): number {
    return value * (this.character().cDmg / 100);
  }

  protected hits(i: number): Hit[] {
    const skill = this.skill();
    const result = this.character().results[this.section()];
    if (this.total()) return [{ value: result.sum[i], multiplier: 1 }];

    const hits: Hit[] = [{ value: result.dmg[i], multiplier: skill.multiplier[i] }];
    if (result.second[i] > 0) hits.push({ value: result.second[i], multiplier: skill.secondMultiplier[i] });
    if (result.third[i] > 0) hits.push({ value: result.third[i], multiplier: skill.thirdMultiplier[i] });
    return hits;
  }

  protected range(i: number, resistant: boolean): string {
    const result = this.character().results[this.section()];
    const text = this.total()
      ? (resistant ? result.sumRes[i] : result.sumCommon[i])
      : (resistant ? result.res[i] : result.common[i]);
    return text && !text.includes('NaN') ? text : '–';
  }
}
