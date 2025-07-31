import React, { useEffect, useState } from 'react';
import { WifiOffIcon, WifiIcon, RefreshCwIcon } from 'lucide-react';

const Status: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate sync
  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync delay
    await new Promise(res => setTimeout(res, 2000));
    setLastSync(new Date());
    setIsSyncing(false);
  };

  return (
    <div className="fixed top-6 right-6 z-[100]">
      <div className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 border border-gray-200">
        {isOnline ? (
          <span className="flex items-center text-green-600"><WifiIcon size={18} className="mr-1" />Online</span>
        ) : (
          <span className="flex items-center text-red-500"><WifiOffIcon size={18} className="mr-1" />Offline</span>
        )}
        <button
          onClick={handleSync}
          disabled={!isOnline || isSyncing}
          className={`ml-2 flex items-center px-2 py-1 rounded text-xs font-medium border ${isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'} disabled:opacity-50`}
        >
          {isSyncing ? <RefreshCwIcon className="animate-spin mr-1" size={16} /> : <RefreshCwIcon className="mr-1" size={16} />}
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
        {lastSync && (
          <span className="ml-2 text-xs text-gray-500">Last sync: {lastSync.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
};

export default Status;
