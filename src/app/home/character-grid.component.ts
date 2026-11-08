import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CHARACTERS } from '../data/characters';

const ELEMENTS = ['aero', 'glacio', 'electro', 'fusion', 'havoc', 'spectro'];

/** Element and name filters plus a grid of every character; one click on a card emits its id. */
@Component({
  selector: 'app-character-grid',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
  imports: [TranslocoPipe],
  template: `
    <div class="flex flex-wrap items-center gap-2" role="group">
      @for (e of elements; track e) {
        <button type="button" [attr.aria-pressed]="filter() === e" [attr.aria-label]="e"
          class="flex h-10 w-10 items-center justify-center rounded-sm border bg-surface hover:bg-surface-2"
          [class.border-accent]="filter() === e" [class.border-hairline]="filter() !== e"
          [class.opacity-50]="filter() !== '' && filter() !== e" (click)="toggle(e)">
          <img [src]="'assets/img/icons/' + e + '.webp'" alt="" class="h-8 w-8" />
        </button>
      }
      <input type="search" class="ui-input min-w-0 flex-1 text-sm sm:max-w-xs" [placeholder]="'home.search' | transloco"
        [attr.aria-label]="'home.search' | transloco" [value]="search()" (input)="search.set($any($event.target).value)" />
    </div>

    <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      @for (c of visible(); track c.id) {
        <li>
          <button type="button" class="group block w-full text-left" (click)="picked.emit(c.id)">
            <span class="ui-card block overflow-hidden group-hover:border-accent">
              <img [src]="'assets/img/characters/' + c.icon + '.webp'" alt="" loading="lazy"
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
  protected search = signal('');
  protected visible = computed(() => {
    const name = this.search().trim().toLowerCase();
    return CHARACTERS.filter(c => (!this.filter() || c.type === this.filter()) && (!name || c.name.toLowerCase().includes(name)));
  });

  protected toggle(element: string) {
    this.filter.set(this.filter() === element ? '' : element);
  }
}
