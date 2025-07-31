import React from 'react';
import { TrophyIcon, AwardIcon, LockIcon, UserIcon } from 'lucide-react';
const Badges = () => {
  const myBadges = [{
    id: 1,
    name: 'Gorilla Expert',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    description: 'Completed the Mountain Gorilla quiz with 80% or higher',
    dateEarned: '2023-09-15',
    category: 'Quiz'
  }, {
    id: 2,
    name: 'Conservation Champion',
    image: 'https://images.unsplash.com/photo-1618477202872-8e3490eb28d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    description: 'Completed 5 different animal quizzes',
    dateEarned: '2023-10-02',
    category: 'Achievement'
  }, {
    id: 3,
    name: '7-Day Streak',
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80',
    description: 'Logged in for 7 consecutive days',
    dateEarned: '2023-10-10',
    category: 'Engagement'
  }];
  const availableBadges = [{
    id: 4,
    name: 'Rhino Researcher',
    image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80&sat=-100&brightness=90',
    description: 'Complete the Black Rhino quiz with 80% or higher',
    category: 'Quiz',
    locked: true
  }, {
    id: 5,
    name: 'Elephant Expert',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80&sat=-100&brightness=90',
    description: 'Complete the African Elephant quiz with 80% or higher',
    category: 'Quiz',
    locked: true
  }, {
    id: 6,
    name: 'Wildlife Guardian',
    image: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80&sat=-100&brightness=90',
    description: 'Complete all animal quizzes with 80% or higher',
    category: 'Achievement',
    locked: true
  }];
  const topStudents = [{
    id: 1,
    name: 'Alex M.',
    badges: 8,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'
  }, {
    id: 2,
    name: 'Sofia K.',
    badges: 7,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'
  }, {
    id: 3,
    name: 'David N.',
    badges: 6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'
  }, {
    id: 4,
    name: 'Emma W.',
    badges: 5,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'
  }, {
    id: 5,
    name: 'You',
    badges: 3,
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80'
  }];
  return <div className="space-y-8">
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
              {myBadges.map(badge => <div key={badge.id} className="bg-gradient-to-b from-white to-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-yellow-200">
                    <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full mb-2 ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {badge.category}
                  </span>
                  <p className="text-xs text-gray-500 mb-2">
                    {badge.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Earned on {new Date(badge.dateEarned).toLocaleDateString()}
                  </p>
                </div>)}
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
              {availableBadges.map(badge => <div key={badge.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center text-center relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="bg-gray-200 rounded-full p-3">
                      <LockIcon size={24} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-200 opacity-50">
                    <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-gray-500 mb-1">{badge.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full mb-2 opacity-60 ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {badge.category}
                  </span>
                  <p className="text-xs text-gray-400 mb-2">
                    {badge.description}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
              <TrophyIcon size={22} className="mr-2 text-yellow-500" />
              Top Wildlife Guardians
            </h2>
            <div className="space-y-4">
              {topStudents.map((student, index) => <div key={student.id} className={`flex items-center p-3 rounded-lg ${student.name === 'You' ? 'bg-blue-50 border border-blue-100' : ''}`}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold mr-3">
                    {index + 1}
                  </div>
                  <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  <div className="flex-1">
                    <h3 className={`font-medium ${student.name === 'You' ? 'text-blue-600' : 'text-gray-800'}`}>
                      {student.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {student.badges} badges
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <AwardIcon size={18} />
                    <span className="ml-1 font-medium">{student.badges}</span>
                  </div>
                </div>)}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-gray-800 mb-3">
                How to earn more badges:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-green-500">•</div>
                  Complete quizzes with 80% score or higher
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-green-500">•</div>
                  Log in daily to maintain your streak
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 text-green-500">•</div>
                  Learn about all endangered animals
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Badges;