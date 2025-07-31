import React, { useEffect, useState } from 'react';
import { WifiOffIcon, WifiIcon, XIcon } from 'lucide-react';
interface OfflineBannerProps {
  className?: string;
}
const OfflineBanner: React.FC<OfflineBannerProps> = ({
  className
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showBanner, setShowBanner] = useState<boolean>(!navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Keep banner visible for a moment to show reconnected message
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const handleReconnect = () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    setReconnectAttempts(prev => prev + 1);
    // Simulate network check
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOnline(true);
        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      } else {
        // Still offline
        setIsReconnecting(false);
      }
    }, 2000);
  };
  const handleDismiss = () => {
    setShowBanner(false);
  };
  if (!showBanner) {
    return null;
  }
  return <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 ${className}`}>
      <div className={`flex items-center justify-between p-3 rounded-lg shadow-lg ${isOnline ? 'bg-green-100 border border-green-200' : 'bg-amber-100 border border-amber-200'}`}>
        <div className="flex items-center">
          {isOnline ? <div className="bg-green-200 rounded-full p-2">
              <WifiIcon size={18} className="text-green-600" />
            </div> : <div className="bg-amber-200 rounded-full p-2">
              <WifiOffIcon size={18} className="text-amber-600" />
            </div>}
          <div className="ml-3">
            <p className="text-sm font-medium">
              {isOnline ? "You're back online!" : "You're offline"}
            </p>
            <p className="text-xs">
              {isOnline ? 'Your changes have been synced' : 'Your progress will be saved locally and synced when you reconnect'}
            </p>
          </div>
        </div>
        <div className="flex items-center ml-4">
          {!isOnline && <button onClick={handleReconnect} disabled={isReconnecting} className={`mr-2 text-xs px-3 py-1 rounded ${isReconnecting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-amber-200 text-amber-700 hover:bg-amber-300'}`}>
              {isReconnecting ? 'Checking...' : 'Reconnect'}
            </button>}
          <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-700" aria-label="Dismiss">
            <XIcon size={16} />
          </button>
        </div>
      </div>
    </div>;
};
export default OfflineBanner;