import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { CHARACTERS } from '../data/characters';

const ELEMENTS = ['aero', 'glacio', 'electro', 'fusion', 'havoc', 'spectro'];

/** Element filter plus a grid of every character; one click on a card emits its id. */
@Component({
  selector: 'app-character-grid',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
  template: `
    <div class="flex flex-wrap gap-2" role="group">
      @for (e of elements; track e) {
        <button type="button" [attr.aria-pressed]="filter() === e" [attr.aria-label]="e"
          class="flex h-10 w-10 items-center justify-center rounded-sm border bg-surface hover:bg-surface-2"
          [class.border-accent]="filter() === e" [class.border-hairline]="filter() !== e"
          [class.opacity-50]="filter() !== '' && filter() !== e" (click)="toggle(e)">
          <img [src]="'assets/img/icons/' + e + '.webp'" alt="" class="h-8 w-8" />
        </button>
      }
    </div>

    <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      @for (c of visible(); track c.id) {
        <li>
          <button type="button" class="group block w-full text-left" (click)="picked.emit(c.id)">
            <span class="ui-card block overflow-hidden group-hover:border-accent">
              <img [src]="'assets/img/characters/' + c.icon + '.png'" alt="" loading="lazy"
                class="aspect-square w-full bg-surface-2 object-cover object-top" />
            </span>
            <span class="mt-2 flex items-center gap-1.5 text-sm text-ink">
              <img [src]="'assets/img/icons/' + c.type + '.webp'" alt="" class="h-5 w-5" />
              <span class="truncate">{{ c.name }}</span>
            </span>
          </button>
        </li>
      }
    </ul>
  `
})
export class CharacterGridComponent {
  picked = output<string>();

  protected elements = ELEMENTS;
  protected filter = signal('');
  protected visible = computed(() => this.filter() ? CHARACTERS.filter(c => c.type === this.filter()) : CHARACTERS);

  protected toggle(element: string) {
    this.filter.set(this.filter() === element ? '' : element);
  }
}
