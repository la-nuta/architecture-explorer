import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { FavoritesService } from './favorites.service';

const STORAGE_KEY = 'arch-explorer-favorites';

// Minimal in-memory localStorage stand-in
function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get length() { return store.size; },
    key: vi.fn((i: number) => Array.from(store.keys())[i] ?? null),
    _store: store,
  };
}

describe('FavoritesService', () => {
  let service: FavoritesService;
  let storageMock: ReturnType<typeof createStorageMock>;

  beforeEach(() => {
    storageMock = createStorageMock();
    vi.stubGlobal('localStorage', storageMock);

    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise with an empty list when localStorage is empty', () => {
    expect(service.favoriteIds()).toEqual([]);
  });

  it('should load existing favorites from localStorage on construction', () => {
    vi.unstubAllGlobals();
    const fresh = createStorageMock();
    fresh._store.set(STORAGE_KEY, JSON.stringify(['monolith', 'microservices']));
    vi.stubGlobal('localStorage', fresh);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(FavoritesService);

    expect(freshService.favoriteIds()).toEqual(['monolith', 'microservices']);
  });

  it('should handle malformed localStorage data gracefully', () => {
    vi.unstubAllGlobals();
    const fresh = createStorageMock();
    fresh._store.set(STORAGE_KEY, 'not-json');
    vi.stubGlobal('localStorage', fresh);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(FavoritesService);

    expect(freshService.favoriteIds()).toEqual([]);
  });

  it('should handle non-array JSON in localStorage gracefully', () => {
    vi.unstubAllGlobals();
    const fresh = createStorageMock();
    fresh._store.set(STORAGE_KEY, JSON.stringify({ id: 'monolith' }));
    vi.stubGlobal('localStorage', fresh);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(FavoritesService);

    expect(freshService.favoriteIds()).toEqual([]);
  });

  describe('toggle', () => {
    it('should add an id that is not already favorited', () => {
      service.toggle('monolith');
      expect(service.favoriteIds()).toContain('monolith');
    });

    it('should remove an id that is already favorited', () => {
      service.toggle('monolith');
      service.toggle('monolith');
      expect(service.favoriteIds()).not.toContain('monolith');
    });

    it('should not affect other favorites when removing one', () => {
      service.toggle('monolith');
      service.toggle('microservices');
      service.toggle('monolith');
      expect(service.favoriteIds()).not.toContain('monolith');
      expect(service.favoriteIds()).toContain('microservices');
    });
  });

  describe('isFavorite', () => {
    it('should return true for a favorited id', () => {
      service.toggle('monolith');
      expect(service.isFavorite('monolith')).toBe(true);
    });

    it('should return false for a non-favorited id', () => {
      expect(service.isFavorite('unknown')).toBe(false);
    });
  });

  describe('localStorage sync', () => {
    it('should persist favorites to localStorage via effect', async () => {
      service.toggle('layered');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(storageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(['layered'])
      );
    });

    it('should write an empty array when last favorite is removed', async () => {
      service.toggle('layered');
      service.toggle('layered');
      await new Promise(resolve => setTimeout(resolve, 0));
      const lastCall = storageMock.setItem.mock.calls.at(-1);
      expect(JSON.parse(lastCall![1])).toEqual([]);
    });
  });
});
