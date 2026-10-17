import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly theme = signal<Theme>('dark');

  apply(theme: Theme) {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
    // Only a cache so index.html can paint the right theme before IndexedDB answers
    try { localStorage.setItem('wuwa-theme', theme); } catch { }
  }
}
