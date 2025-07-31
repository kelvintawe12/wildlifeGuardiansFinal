import { useEffect, useState } from 'react';
import { WifiOffIcon, RefreshCwIcon, ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const Offline = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  useEffect(() => {
    // Check if we're actually online when this component mounts
    if (navigator.onLine) {
      window.location.href = '/dashboard';
    }
    const handleOnline = () => {
      window.location.href = '/dashboard';
    };
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  const checkConnection = () => {
    setIsChecking(true);
    // Update the last checked time
    setLastUpdated(new Date());
    // Simulate checking connection
    setTimeout(() => {
      setIsChecking(false);
      // If we're actually online now, redirect
      if (navigator.onLine) {
        window.location.href = '/dashboard';
      }
    }, 2000);
  };
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-amber-50 p-6 flex flex-col items-center">
          <div className="bg-amber-100 rounded-full p-4 mb-4">
            <WifiOffIcon size={48} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            You're Offline
          </h1>
          <p className="text-center text-gray-600">
            Looks like you've lost your internet connection. Some features might
            be limited until you're back online.
          </p>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <button onClick={checkConnection} disabled={isChecking} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isChecking ? <>
                  <RefreshCwIcon size={16} className="animate-spin mr-2" />
                  Checking connection...
                </> : <>
                  <RefreshCwIcon size={16} className="mr-2" />
                  Check connection
                </>}
            </button>
            <p className="mt-2 text-xs text-center text-gray-500">
              Last checked: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Available Offline:
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  </span>
                  <span className="absolute inset-0 border-2 border-green-500 rounded-full opacity-25"></span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Previously viewed animals
                  </span>{' '}
                  - Information about animals you've already visited is saved
                  for offline viewing.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  </span>
                  <span className="absolute inset-0 border-2 border-green-500 rounded-full opacity-25"></span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Your badges</span>{' '}
                  - All badges you've earned are available to view offline.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  </span>
                  <span className="absolute inset-0 border-2 border-green-500 rounded-full opacity-25"></span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Completed quizzes
                  </span>{' '}
                  - Your quiz history and results are saved locally.
                </p>
              </li>
            </ul>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <Link to="/dashboard" className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeftIcon size={16} className="mr-2" />
              Return to Dashboard
            </Link>
            <p className="mt-2 text-xs text-center text-gray-500">
              You can still access cached content while offline.
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Offline;