const LOCAL_STORAGE_PREFIX = 'photostudy.h2';

type StorageObject = Record<string, any>;

export class Storage {
  constructor(private storageKey: string) {}

  store(obj: StorageObject): void {
    try {
      const serializedState = JSON.stringify(obj);
      localStorage.setItem(this.storageKey, serializedState);
    } catch {
      // Do nothing
    }
  }

  load(): StorageObject {
    try {
      const serializedState = localStorage.getItem(this.storageKey) || '{}';
      return JSON.parse(serializedState);
    } catch {
      return {};
    }
  }

  clearKey(key: string): void {
    try {
      const existingState = this.load();
      this.store({ ...existingState, [key]: undefined });
    } catch {
      // Do nothing
    }
  }

  storeValue(obj: StorageObject): void {
    try {
      const existingState = this.load();
      this.store({ ...existingState, ...obj });
    } catch {
      // Do nothing
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Do nothing
    }
  }
}

export default new Storage(LOCAL_STORAGE_PREFIX);
