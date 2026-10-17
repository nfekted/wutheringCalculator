import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, deleteDB, openDB } from 'idb';
import { CharacterSave } from '../models/character-save.model';
import { Character } from '../models/character.model';
import { Settings } from '../models/settings.model';

const DB_NAME = 'wuwa-calculator';
const SETTINGS_KEY = 'app';

interface WuwaDB extends DBSchema {
  settings: { key: string; value: Settings };
  characters: { key: number; value: CharacterSave };
}

@Injectable({ providedIn: 'root' })
export class StorageService {

  private db?: Promise<IDBPDatabase<WuwaDB>>;

  private open(): Promise<IDBPDatabase<WuwaDB>> {
    this.db ??= openDB<WuwaDB>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('settings');
        db.createObjectStore('characters', { keyPath: 'index' });
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

  async clear(): Promise<void> {
    (await this.open()).close();
    this.db = undefined;
    await deleteDB(DB_NAME);
    window.location.reload();
  }
}
