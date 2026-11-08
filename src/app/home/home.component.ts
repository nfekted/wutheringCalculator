import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';
import { TranslocoPipe, provideTranslocoScope } from '@jsverse/transloco';
import { CharacterComponent } from '../character/character.component';
import { Character } from '../shared/models/character.model';
import { CharacterSave } from '../shared/models/character-save.model';
import { StorageService } from '../shared/services/storage.service';
import { getCharacterData } from '../data/characters';
import { CharacterPickerComponent } from './character-picker.component';
import { CharacterGridComponent } from './character-grid.component';
import { Team } from '../shared/models/team.model';
import { TeamsModalComponent, TeamsModalData } from '../teams/teams-modal.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslocoPipe, CharacterComponent, CharacterGridComponent],
    providers: [provideTranslocoScope('home')]
})
export class HomeComponent {

  private storage = inject(StorageService);
  private dialog = inject(Dialog);

  characters = signal<Array<Character>>([]);
  selected = signal<Character | null>(null);
  loaded = signal(false);
  teams = signal<Team[]>([]);

  ngOnInit(): void {
    this.load();
  }

  async openPicker() {
    const ref = this.dialog.open<string>(CharacterPickerComponent, { backdropClass: 'app-backdrop', ariaLabelledBy: 'picker-title' });
    const id = await firstValueFrom(ref.closed);
    if (id) this.createNew(id);
  }

  openTeams() {
    const data: TeamsModalData = { characters: this.characters(), teams: this.teams };
    this.dialog.open(TeamsModalComponent, { data, backdropClass: 'app-backdrop', ariaLabelledBy: 'teams-title' });
  }

  select(character: Character) {
    this.selected.set(character);
  }

  createNew(id: string, load?: CharacterSave) {
    const char = new Character(this.characters().length, getCharacterData(id), load);
    this.characters.update(list => [...list, char]);
    this.selected.set(char);

    if (!load) this.save();
  }

  save() {
    this.storage.saveCharacters(this.characters());
  }

  async load() {
    for (const c of await this.storage.loadCharacters()) {
      // Characters not migrated to the new data yet are skipped
      if (!getCharacterData(c.icon)) continue;
      this.createNew(c.icon, c);
    }
    this.teams.set(await this.storage.loadTeams());
    this.selected.set(this.characters()[0] ?? null);
    this.loaded.set(true);
  }

  delete(index: number) {
    const list = this.characters().filter(c => c.index != index);
    for (let i = 0; i < list.length; i++) {
      list[i].index = i;
    }

    this.characters.set(list);
    this.selected.set(list[Math.min(index, list.length - 1)] ?? null);
    this.save();

    // Teams keep the slot of the removed character empty; the others follow the new indexes
    this.teams.update(teams => teams.map(t => ({
      ...t,
      members: t.members.map(m => m === null || m === index ? null : m > index ? m - 1 : m)
    })));
    this.storage.saveTeams(this.teams());
  }
}
