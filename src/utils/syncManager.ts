// Handles syncing offline data with the server when connection is restored
type SyncableData = {
  id: string;
  [key: string]: any;
};
type SyncConfig = {
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  transform?: (data: any) => any;
};
class SyncManager {
  private static instance: SyncManager;
  private syncQueue: Map<string, {
    data: SyncableData;
    config: SyncConfig;
  }> = new Map();
  private isSyncing: boolean = false;
  private constructor() {
    // Initialize and set up listeners
    window.addEventListener('online', this.attemptSync.bind(this));
    // Load any existing sync queue from storage
    this.loadQueueFromStorage();
  }
  public static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }
  public addToSyncQueue(data: SyncableData, config: SyncConfig): void {
    // Add to queue with unique ID
    this.syncQueue.set(data.id, {
      data,
      config
    });
    // Save to storage
    this.saveQueueToStorage();
    // Try sync if online
    if (navigator.onLine) {
      this.attemptSync();
    }
  }
  public async attemptSync(): Promise<void> {
    if (this.isSyncing || !navigator.onLine || this.syncQueue.size === 0) {
      return;
    }
    this.isSyncing = true;
    try {
      const entriesArray = Array.from(this.syncQueue.entries());
      for (const [id, {
        data,
        config
      }] of entriesArray) {
        try {
          const payload = config.transform ? config.transform(data) : data;
          const response = await fetch(config.endpoint, {
            method: config.method,
            headers: {
              'Content-Type': 'application/json',
              ...config.headers
            },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            // Remove from queue if successful
            this.syncQueue.delete(id);
            console.log(`Successfully synced item ${id}`);
          } else {
            console.error(`Failed to sync item ${id}: ${response.statusText}`);
          }
        } catch (err) {
          console.error(`Error syncing item ${id}:`, err);
        }
      }
    } finally {
      // Save updated queue
      this.saveQueueToStorage();
      this.isSyncing = false;
    }
  }
  public getPendingSyncCount(): number {
    return this.syncQueue.size;
  }
  public clearSyncQueue(): void {
    this.syncQueue.clear();
    this.saveQueueToStorage();
  }
  private saveQueueToStorage(): void {
    try {
      const queueData = Array.from(this.syncQueue.entries());
      localStorage.setItem('syncQueue', JSON.stringify(queueData));
    } catch (err) {
      console.error('Failed to save sync queue to storage:', err);
    }
  }
  private loadQueueFromStorage(): void {
    try {
      const storedQueue = localStorage.getItem('syncQueue');
      if (storedQueue) {
        const queueData = JSON.parse(storedQueue) as [string, {
          data: SyncableData;
          config: SyncConfig;
        }][];
        this.syncQueue = new Map(queueData);
      }
    } catch (err) {
      console.error('Failed to load sync queue from storage:', err);
    }
  }
}
export default SyncManager.getInstance();