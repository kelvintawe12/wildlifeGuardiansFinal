import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, AwardIcon, LeafIcon, XIcon, SearchIcon, UserIcon, TrendingUpIcon, BookmarkIcon, UsersIcon } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}
const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const location = useLocation();
  const [userProgress, setUserProgress] = useState({
    quizzesCompleted: 0,
    badgesEarned: 0,
    streak: 0
  });
  useEffect(() => {
    // Fetch real user progress data
    const fetchUserProgress = async () => {
      try {
        // This would be replaced with a real API call
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        // For now we'll use mock data, but in a real app this would fetch from API
        setUserProgress({
          quizzesCompleted: 5,
          badgesEarned: 3,
          streak: 7
        });
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };
    fetchUserProgress();
  }, []);
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon size={20} />
  }, {
    name: 'Quizzes',
    path: '/quiz',
    icon: <BookOpenIcon size={20} />
  }, {
    name: 'My Badges',
    path: '/badges',
    icon: <AwardIcon size={20} />
  }, {
    name: 'Animals',
    path: '/animals',
    icon: <LeafIcon size={20} />
  }, {
    name: 'Search',
    path: '/search',
    icon: <SearchIcon size={20} />
  }, {
    name: 'Profile',
    path: '/profile',
    icon: <UserIcon size={20} />
  }, {
    name: 'Authors',
    path: '/authors',
    icon: <UsersIcon size={20} />
  }];
  return <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />}
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg pt-20 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-4 py-2 flex flex-col h-full">
          <div className="md:hidden absolute top-4 right-4">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100" onClick={onClose} aria-label="Close sidebar">
              <XIcon size={20} />
            </button>
          </div>
          {/* User profile section */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80" alt="Profile" className="rounded-full w-20 h-20 border-4 border-green-100" />
            </div>
            <h2 className="text-center text-lg font-bold text-gray-800">
              Welcome, Explorer!
            </h2>
            <p className="text-center text-sm text-gray-500">
              Junior Wildlife Guardian
            </p>
            {/* Progress stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-700">
                  {userProgress.quizzesCompleted}
                </div>
                <div className="text-xs text-green-600">Quizzes</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-700">
                  {userProgress.badgesEarned}
                </div>
                <div className="text-xs text-blue-600">Badges</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-700">
                  {userProgress.streak}
                </div>
                <div className="text-xs text-purple-600">Day Streak</div>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map(item => <NavLink key={item.path} to={item.path} className={({
            isActive
          }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClose}>
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>)}
          </nav>
          {/* Daily challenge */}
          <div className="mt-auto mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-2">
              <TrendingUpIcon size={16} className="text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-blue-700">
                Daily Challenge
              </h3>
            </div>
            <p className="text-xs text-blue-700">
              Learn about wildlife conservation and earn badges!
            </p>
            <button className="mt-2 w-full py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center justify-center">
              <BookmarkIcon size={14} className="mr-1.5" />
              Start Today's Challenge
            </button>
          </div>
        </div>
      </aside>
    </>;
};
export default Sidebar;