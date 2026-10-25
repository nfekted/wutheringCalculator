import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { PartResult } from '../core/damage-engine';
import { SectionKey } from '../data/character-data.model';
import { Character } from '../shared/models/character.model';

/** Damage (or healing) of every hit of one skill section. */
@Component({
  selector: 'app-damage-table',
  imports: [DecimalPipe, NgTemplateOutlet, TranslocoPipe],
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
        @for (hit of hits(); track $index; let i = $index) {
          <tr>
            <th scope="row" class="font-medium text-ink">{{ hit.name }}</th>
            <td [class.text-ink]="!isHeal(i) && !isShield(i)" [class.text-heal]="isHeal(i)" [class.text-shield]="isShield(i)">
              @for (line of lines(i); track $index) {
                <div>
                  <ng-container *ngTemplateOutlet="prefix; context: { line: line, first: $first }" />
                  @if (isValid(line.value)) {
                    {{ line.value }}
                    @if (!isHeal(i)) { <span class="text-mute">({{ crit(line.value) | number: '1.0-0' }})</span> }
                  } @else { – }
                </div>
              } @empty { – }
            </td>
            <td>
              @if (!isHeal(i)) {
                @for (line of lines(i); track $index) {
                  <div>
                    <ng-container *ngTemplateOutlet="prefix; context: { line: line, first: $first }" />
                    <ng-container *ngTemplateOutlet="range; context: { range: line.common }" />
                  </div>
                } @empty { – }
              }
            </td>
            <td>
              @if (!isHeal(i)) {
                @for (line of lines(i); track $index) {
                  <div>
                    <ng-container *ngTemplateOutlet="prefix; context: { line: line, first: $first }" />
                    <ng-container *ngTemplateOutlet="range; context: { range: line.resistant }" />
                  </div>
                } @empty { – }
              }
            </td>
          </tr>
        }
      </tbody>
    </table>

    <!-- "+ " between the lines of a hit and the "4x " of a repeated one -->
    <ng-template #prefix let-line="line" let-first="first">
      @if (!first) { <span class="text-mute">+ </span> }
      @if (line.times > 1) { <small class="text-mute">{{ line.times }}x </small> }
    </ng-template>

    <ng-template #range let-range="range">
      @if (isValid(range.min)) {
        {{ range.min }} ~ {{ range.max }} (<b>{{ range.critMin }} ~ {{ range.critMax }}</b>)
      } @else { – }
    </ng-template>
  `
})
export class DamageTableComponent {
  character = input.required<Character>();
  section = input.required<SectionKey>();
  /** Sum every part of a hit instead of listing them one by one */
  total = input(false);

  protected hits = computed(() => this.character().data[this.section()].hits);

  protected isHeal(i: number): boolean {
    return this.hits()[i].kind === 'heal';
  }

  protected isShield(i: number): boolean {
    return this.hits()[i].kind === 'shield';
  }

  /** Hits built from incomplete character data come out as NaN or undefined */
  protected isValid(value: number | undefined): boolean {
    return Number.isFinite(value);
  }

  protected crit(value: number): number {
    return value * (this.character().cDmg / 100);
  }

  /** What is listed for a hit: each part, or only their total. Not computed: the character is mutated in place. */
  protected lines(i: number): PartResult[] {
    const result = this.character().results[this.section()][i];
    if (!result) return [];
    return this.total() ? [{ value: result.sum, times: 1, common: result.commonSum, resistant: result.resistantSum }] : result.parts;
  }
}
