import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Settings, Theme } from '../models/settings.model';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private storage = inject(StorageService);
  private transloco = inject(TranslocoService);
  private themes = inject(ThemeService);

  readonly settings = signal<Settings | null>(null);
  readonly lang = computed(() => this.settings()?.language ?? '');
  readonly theme = this.themes.theme;

  async init() {
    const saved = await this.storage.loadSettings();
    const settings = Object.assign(new Settings(), saved ?? { language: this.transloco.getActiveLang(), theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' });
    this.settings.set(settings);
    this.transloco.setActiveLang(settings.language);
    this.themes.apply(settings.theme);
    if (!saved) await this.storage.saveSettings(settings);
  }

  setLanguage(language: string) {
    this.transloco.setActiveLang(language);
    this.update({ language });
  }

  setTheme(theme: Theme) {
    this.themes.apply(theme);
    this.update({ theme });
  }

  acceptCookies() {
    this.update({ coockie: true });
  }

  private update(changes: Partial<Settings>) {
    const next = Object.assign(new Settings(), this.settings(), changes);
    this.settings.set(next);
    this.storage.saveSettings(next);
  }
}
