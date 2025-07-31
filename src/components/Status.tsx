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
    <div className="fixed top-[72px] right-6 z-[100] flex flex-col items-end">
      <button
        onClick={handleSync}
        disabled={!isOnline || isSyncing}
        className={`min-w-[80px] h-10 flex items-center justify-center gap-2 rounded-full shadow-lg border border-gray-200 bg-white hover:bg-gray-100 hover:scale-110 hover:shadow-xl transition-all duration-200 focus:outline-none px-3 py-2 ${isOnline ? 'text-green-600' : 'text-red-500'} disabled:opacity-50`}
        title={`${isOnline ? 'Online' : 'Offline'}${lastSync ? `\nLast sync: ${lastSync.toLocaleTimeString()}` : ''}${isSyncing ? '\nSyncing...' : ''}`}
        style={{ cursor: isOnline && !isSyncing ? 'pointer' : 'not-allowed' }}
      >
        {isSyncing ? (
          <RefreshCwIcon className="animate-spin" size={20} />
        ) : isOnline ? (
          <WifiIcon size={20} />
        ) : (
          <WifiOffIcon size={20} />
        )}
        <span className="text-xs font-semibold select-none">{isOnline ? 'Online' : 'Offline'}</span>
      </button>
      {!isOnline && (
        <div className="mt-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs rounded px-3 py-2 shadow w-64">
          <strong>Offline:</strong> Your details will be saved locally. Changes will sync automatically when you are back online.
        </div>
      )}
    </div>
  );
};

export default Status;
