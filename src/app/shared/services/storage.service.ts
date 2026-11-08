import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, deleteDB, openDB } from 'idb';
import { CharacterSave } from '../models/character-save.model';
import { Character } from '../models/character.model';
import { Settings } from '../models/settings.model';
import { Team } from '../models/team.model';

const DB_NAME = 'wuwa-calculator';
const SETTINGS_KEY = 'app';

interface WuwaDB extends DBSchema {
  settings: { key: string; value: Settings };
  characters: { key: number; value: CharacterSave };
  teams: { key: number; value: Team };
}

@Injectable({ providedIn: 'root' })
export class StorageService {

  private db?: Promise<IDBPDatabase<WuwaDB>>;

  private open(): Promise<IDBPDatabase<WuwaDB>> {
    this.db ??= openDB<WuwaDB>(DB_NAME, 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('settings');
          db.createObjectStore('characters', { keyPath: 'index' });
        }
        if (oldVersion < 2) db.createObjectStore('teams', { keyPath: 'id' });
      }
    });
    return this.db;
  }

  async loadSettings(): Promise<Settings | undefined> {
    return (await this.open()).get('settings', SETTINGS_KEY);
  }

  async saveSettings(settings: Settings): Promise<void> {
    await (await this.open()).put('settings', { ...settings }, SETTINGS_KEY);
  }

  async loadCharacters(): Promise<CharacterSave[]> {
    return (await this.open()).getAll('characters');
  }

  async saveCharacters(characters: Character[]): Promise<void> {
    const tx = (await this.open()).transaction('characters', 'readwrite');
    await tx.store.clear();
    for (const c of characters) {
      await tx.store.put({ ...new CharacterSave(c) });
    }
    await tx.done;
  }

  async loadTeams(): Promise<Team[]> {
    return (await this.open()).getAll('teams');
  }

  async saveTeams(teams: Team[]): Promise<void> {
    const tx = (await this.open()).transaction('teams', 'readwrite');
    await tx.store.clear();
    for (const t of teams) {
      await tx.store.put({ ...t, members: [...t.members] });
    }
    await tx.done;
  }

  async clear(): Promise<void> {
    (await this.open()).close();
    this.db = undefined;
    await deleteDB(DB_NAME);
    window.location.reload();
  }
}
