import React, { useEffect, useState } from 'react';
import { AwardIcon, LockIcon } from 'lucide-react';
import { getUserBadges } from '../backend/api/users';
import { getAllBadges } from '../backend/api/badges';

const Badges = () => {
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true);
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (!userId) return;
        const allBadges = await getAllBadges();
        const earned = await getUserBadges(userId);
        setMyBadges(earned);
        // Filter out earned badges from all badges to get available
        const earnedIds = new Set(earned.map(b => b.badge_id || b.id));
        setAvailableBadges(allBadges.filter(b => !earnedIds.has(b.id)));
    } catch (err) {
      console.error('Error fetching badges:', err);
    } finally {
      setIsLoading(false);
    }
  };
  fetchBadges();
}, []);

if (isLoading) {
  return <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
  </div>;
}

return (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        My Wildlife Badges
      </h1>
      <p className="text-gray-600">
        Collect badges by completing quizzes and learning about wildlife!
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <AwardIcon size={22} className="mr-2 text-yellow-500" />
              My Badges
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {myBadges.length} Earned
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBadges.length === 0 && <span className="text-gray-500">No badges earned yet.</span>}
            {myBadges.map(badge => (
              <div key={badge.id} className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-yellow-200">
                  <img src={badge.image_url || badge.badges?.image_url} alt={badge.name || badge.badges?.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{badge.name || badge.badges?.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full mb-2 ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {badge.category || badge.badges?.category}
                </span>
                <p className="text-xs text-gray-500 mb-2">
                  {badge.description || badge.badges?.description}
                </p>
                <p className="text-xs text-gray-400">
                  {badge.earned_at || badge.awarded_at ? `Earned on ${new Date(badge.earned_at || badge.awarded_at).toLocaleDateString()}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <LockIcon size={22} className="mr-2 text-gray-500" />
              Badges to Earn
            </h2>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {availableBadges.length} Available
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBadges.length === 0 && <span className="text-gray-500">All badges earned!</span>}
            {availableBadges.map(badge => (
              <div key={badge.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center text-center relative opacity-60">
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <div className="bg-gray-200 rounded-full p-3">
                    <LockIcon size={24} className="text-gray-500" />
                  </div>
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
                  <img src={badge.image_url} alt={badge.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-500 mb-1">{badge.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full mb-2 ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {badge.category}
                </span>
                <p className="text-xs text-gray-400 mb-2">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Badges;