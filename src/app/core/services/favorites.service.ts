import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'arch-explorer-favorites';

  readonly favoriteIds = signal<string[]>(this.loadFromStorage());

  private loadFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favoriteIds()));
      } catch {
        // quota exceeded or storage unavailable — proceed without persisting
      }
    });
  }

  isFavorite(id: string): boolean {
    return this.favoriteIds().includes(id);
  }

  toggle(id: string): void {
    this.favoriteIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }
}