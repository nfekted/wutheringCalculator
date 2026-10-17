import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { TranslocoPipe, provideTranslocoScope } from '@jsverse/transloco';
import { CharacterComponent } from '../character/character.component';
import { Character } from '../shared/models/character.model';
import { CharacterSave } from '../shared/models/character-save.model';
import { StorageService } from '../shared/services/storage.service';
import { CHARACTERS, getCharacterData } from '../data/characters';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslocoPipe, CharacterComponent],
    providers: [provideTranslocoScope('home')]
})
export class HomeComponent {

  private storage = inject(StorageService);

  characterList = CHARACTERS;
  filterBy = signal('');
  characters = signal<Array<Character>>([]);
  currentSelection = signal('');

  ngOnInit(): void {
    this.load();
  }

  createNew(load?: CharacterSave) {
    const char = new Character(this.characters().length, getCharacterData(load?.icon ?? this.currentSelection()), load);
    this.characters.update(list => [...list, char]);
    this.currentSelection.set('');

    if (!load) this.save();
  }

  save() {
    this.storage.saveCharacters(this.characters());
  }

  async load() {
    for (const c of await this.storage.loadCharacters()) {
      this.createNew(c);
    }
  }

  delete(index: number) {
    const list = this.characters().filter(c => c.index != index);
    for (let i = 0; i < list.length; i++) {
      list[i].index = i;
    }

    this.characters.set(list);
    this.save();
  }

  setFilter(type: string) {
    this.filterBy.set(this.filterBy() == type ? '' : type);
  }
}
