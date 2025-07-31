import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, AwardIcon, LeafIcon, XIcon, SearchIcon, UserIcon, TrendingUpIcon, BookmarkIcon, UsersIcon } from 'lucide-react';
import { getUserQuizResults, getUserBadges, getUserById } from '../backend/api/users';
interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}
const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  // Removed unused location
  const [userProgress, setUserProgress] = useState({
    quizzesCompleted: 0,
    badgesEarned: 0,
    streak: 0
  });
  const [userDetails, setUserDetails] = useState<any>({
    name: '',
    role: '',
    avatar: ''
  });
  useEffect(() => {
    // Fetch real user progress and details
    const fetchUserProgress = async () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (!userId) return;
        // Fetch user details
        const user = await getUserById(userId);
        setUserDetails({
          name: user?.name || 'Explorer',
          role: user?.role || 'Junior Wildlife Guardian',
          avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&h=80&q=80'
        });
        // Fetch quiz results
        const quizResults = await getUserQuizResults(userId);
        // Fetch badges
        const badges = await getUserBadges(userId);
        // Calculate streak (placeholder: number of days with at least one quiz result)
        let streak = 0;
        if (quizResults.length > 0) {
          const dates = quizResults.map(q => q.completed_at && q.completed_at.split('T')[0]);
          const uniqueDates = Array.from(new Set(dates));
          streak = uniqueDates.length;
        }
        setUserProgress({
          quizzesCompleted: quizResults.length,
          badgesEarned: badges.length,
          streak
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
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} aria-hidden="true" />}
      {/* Sidebar */}
      <aside className={`fixed top-[64px] left-0 z-50 h-[calc(100vh-64px)] w-60 bg-white/95 shadow-xl border-r border-gray-100 pt-6 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`} style={{ backdropFilter: 'blur(8px)' }}>
        <div className="px-3 py-2 flex flex-col h-full">
          <div className="absolute top-3 right-3 z-10">
            <button
              className="text-gray-400 hover:text-red-500 p-2 rounded-full bg-white/80 hover:bg-red-50 shadow focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-150"
              onClick={onClose}
              aria-label="Close sidebar"
              tabIndex={0}
            >
              <XIcon size={22} />
            </button>
          </div>
          {/* User profile section */}
          <div className="mb-5 flex flex-col items-center">
            <img src={userDetails.avatar} alt="Profile" className="rounded-full w-14 h-14 border-2 border-green-200 object-cover shadow" />
            <h2 className="mt-2 text-sm font-bold text-gray-800 text-center">
              {userDetails.name ? `Welcome, ${userDetails.name}!` : 'Welcome, Explorer!'}
            </h2>
            <p className="text-xs text-gray-400 text-center">
              {userDetails.role || 'Junior Wildlife Guardian'}
            </p>
            {/* Progress stats */}
            <div className="mt-2 flex gap-2 w-full justify-center">
              <div className="flex flex-col items-center bg-green-50 rounded-lg px-2 py-1">
                <span className="text-sm font-bold text-green-700">{userProgress.quizzesCompleted}</span>
                <span className="text-[10px] text-green-600">Quizzes</span>
              </div>
              <div className="flex flex-col items-center bg-blue-50 rounded-lg px-2 py-1">
                <span className="text-sm font-bold text-blue-700">{userProgress.badgesEarned}</span>
                <span className="text-[10px] text-blue-600">Badges</span>
              </div>
              <div className="flex flex-col items-center bg-purple-50 rounded-lg px-2 py-1">
                <span className="text-sm font-bold text-purple-700">{userProgress.streak}</span>
                <span className="text-[10px] text-purple-600">Streak</span>
              </div>
            </div>
          </div>
          {/* Navigation */}
          <nav className="space-y-1 flex-1 mt-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-[15px] font-medium rounded-lg transition-all duration-150 ${isActive ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow' : 'text-gray-700 hover:bg-gray-100 hover:pl-4'}`
                }
                onClick={onClose}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
          {/* Daily challenge */}
          <div className="mt-auto mb-2 p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 shadow flex flex-col items-center">
            <div className="flex items-center mb-1">
              <TrendingUpIcon size={15} className="text-blue-600 mr-2" />
              <h3 className="text-xs font-semibold text-blue-700">Daily Challenge</h3>
            </div>
            <p className="text-[11px] text-blue-700 text-center">
              Learn about wildlife conservation and earn badges!
            </p>
            <button className="mt-2 w-full py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center justify-center">
              <BookmarkIcon size={12} className="mr-1.5" />
              Start Today's Challenge
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;