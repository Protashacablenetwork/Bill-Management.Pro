import { BillRecord } from "../types";

const DB_NAME = "BillManagerDB";
const STORE_NAME = "cachedSheets";
const DB_VERSION = 1;

class StorageDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => {
          console.warn("IndexedDB failed to open, fallback to localStorage");
          resolve();
        };
        req.onsuccess = () => {
          this.db = req.result;
          resolve();
        };
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "key" });
          }
        };
      } catch (err) {
        console.warn("IndexedDB error", err);
        resolve();
      }
    });
  }

  async get(key: string): Promise<BillRecord[] | null> {
    await this.init();
    if (!this.db) {
      const raw = localStorage.getItem(`bill_${key}`);
      return raw ? JSON.parse(raw) : null;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_NAME], "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          resolve(req.result ? req.result.data : null);
        };
        req.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  async set(key: string, data: BillRecord[]): Promise<void> {
    await this.init();
    if (!this.db) {
      try {
        localStorage.setItem(`bill_${key}`, JSON.stringify(data));
      } catch (e) {
        console.warn("localStorage quota exceeded", e);
      }
      return;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_NAME], "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ key, data, timestamp: Date.now() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const dbService = new StorageDB();
