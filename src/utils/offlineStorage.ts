// Handles local storage of data for offline access
type StorageOptions = {
  expiry?: number; // Time in milliseconds until data expires
};
class OfflineStorage {
  private static instance: OfflineStorage;
  private db: IDBDatabase | null = null;
  private dbName = 'wildlifeGuardiansDB';
  private dbVersion = 1;
  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;
  private constructor() {
    // Initialize IndexedDB
    this.initPromise = this.initDB();
  }
  public static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }
  private async initDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!indexedDB) {
        console.error('IndexedDB not supported');
        resolve(false);
        return;
      }
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = event => {
        console.error('Error opening IndexedDB:', event);
        resolve(false);
      };
      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        resolve(true);
      };
      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create object stores
        if (!db.objectStoreNames.contains('animals')) {
          db.createObjectStore('animals', {
            keyPath: 'id'
          });
        }
        if (!db.objectStoreNames.contains('quizzes')) {
          db.createObjectStore('quizzes', {
            keyPath: 'id'
          });
        }
        if (!db.objectStoreNames.contains('badges')) {
          db.createObjectStore('badges', {
            keyPath: 'id'
          });
        }
        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', {
            keyPath: 'id'
          });
        }
        if (!db.objectStoreNames.contains('offlineQuizResults')) {
          db.createObjectStore('offlineQuizResults', {
            keyPath: 'id'
          });
        }
        if (!db.objectStoreNames.contains('offlineActivities')) {
          db.createObjectStore('offlineActivities', {
            keyPath: 'id'
          });
        }
      };
    });
  }
  private async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized) return true;
    return this.initPromise || this.initDB();
  }
  public async storeData<T>(storeName: string, data: T & {
    id: string | number;
  }, options: StorageOptions = {}): Promise<boolean> {
    const isInitialized = await this.ensureInitialized();
    if (!isInitialized || !this.db) return false;
    return new Promise(resolve => {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        // Add expiry if specified
        const dataToStore = {
          ...data
        };
        if (options.expiry) {
          ;
          (dataToStore as any)._expiresAt = Date.now() + options.expiry;
        }
        const request = store.put(dataToStore);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (err) {
        console.error(`Error storing data in ${storeName}:`, err);
        resolve(false);
      }
    });
  }
  public async getData<T>(storeName: string, id: string | number): Promise<T | null> {
    const isInitialized = await this.ensureInitialized();
    if (!isInitialized || !this.db) return null;
    return new Promise(resolve => {
      try {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => {
          const data = request.result;
          // Check if data exists and is not expired
          if (data && data._expiresAt && data._expiresAt < Date.now()) {
            // Data is expired, delete it
            this.removeData(storeName, id);
            resolve(null);
          } else {
            resolve(data);
          }
        };
        request.onerror = () => resolve(null);
      } catch (err) {
        console.error(`Error retrieving data from ${storeName}:`, err);
        resolve(null);
      }
    });
  }
  public async getAllData<T>(storeName: string): Promise<T[]> {
    const isInitialized = await this.ensureInitialized();
    if (!isInitialized || !this.db) return [];
    return new Promise(resolve => {
      try {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          const allData = request.result;
          // Filter out expired items
          const now = Date.now();
          const validData = allData.filter(item => {
            if (item._expiresAt && item._expiresAt < now) {
              // Schedule deletion of expired items
              this.removeData(storeName, item.id);
              return false;
            }
            return true;
          });
          resolve(validData);
        };
        request.onerror = () => resolve([]);
      } catch (err) {
        console.error(`Error retrieving all data from ${storeName}:`, err);
        resolve([]);
      }
    });
  }
  public async removeData(storeName: string, id: string | number): Promise<boolean> {
    const isInitialized = await this.ensureInitialized();
    if (!isInitialized || !this.db) return false;
    return new Promise(resolve => {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (err) {
        console.error(`Error removing data from ${storeName}:`, err);
        resolve(false);
      }
    });
  }
  public async clearStore(storeName: string): Promise<boolean> {
    const isInitialized = await this.ensureInitialized();
    if (!isInitialized || !this.db) return false;
    return new Promise(resolve => {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (err) {
        console.error(`Error clearing store ${storeName}:`, err);
        resolve(false);
      }
    });
  }
}
export default OfflineStorage.getInstance();