import React, { useEffect, useState } from 'react';
import { BookOpenIcon, AwardIcon, TrendingUpIcon, CalendarIcon, LeafIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
type Animal = {
  id: string;
  name: string;
  status: string;
  image: string;
};
type UserStats = {
  quizzesCompleted: number;
  badgesEarned: number;
  averageScore: number;
  streak: number;
};
const Dashboard = () => {
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    quizzesCompleted: 0,
    badgesEarned: 0,
    averageScore: 0,
    streak: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls to get user data and recently viewed animals
        // For now, we'll use mock data
        // Get user data from localStorage
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (userId) {
          // Fetch user stats
          // This would be a real API call in a production app
          await new Promise(resolve => setTimeout(resolve, 500));
          // Mock user stats
          setUserStats({
            quizzesCompleted: 5,
            badgesEarned: 3,
            averageScore: 76,
            streak: 7
          });
          // Fetch recently viewed animals
          // This would be a real API call in a production app
          const animalsData = [{
            id: '1',
            name: 'Mountain Gorilla',
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            status: 'Endangered'
          }, {
            id: '2',
            name: 'Black Rhino',
            image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            status: 'Critically Endangered'
          }, {
            id: '3',
            name: 'African Elephant',
            image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
            status: 'Vulnerable'
          }];
          setRecentAnimals(animalsData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (isLoading) {
    return <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome to Wildlife Guardians!
        </h1>
        <div className="flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <CalendarIcon size={16} className="mr-1" />
          <span>Today's Challenge</span>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <BookOpenIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {userStats.quizzesCompleted}
              </h3>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <AwardIcon size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {userStats.badgesEarned}
              </h3>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <TrendingUpIcon size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {userStats.averageScore}%
              </h3>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <CalendarIcon size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {userStats.streak}
              </h3>
              <p className="text-sm text-gray-500">Days Streak</p>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Ready for a new challenge?</h2>
          <p className="mb-4 opacity-90">
            Test your knowledge about wildlife conservation!
          </p>
          <Link to="/quiz" className="inline-block bg-white text-green-600 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
            Take a Quiz
          </Link>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Explore Animal Facts</h2>
          <p className="mb-4 opacity-90">
            Learn about endangered species in Rwanda!
          </p>
          <Link to="/animals" className="inline-block bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Discover Animals
          </Link>
        </div>
      </div>
      {/* Recent Animals */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recently Viewed Animals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentAnimals.map(animal => <Link key={animal.id} to="/animals" className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <img src={animal.image} alt={animal.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">{animal.name}</h3>
                  <span className="inline-block text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    {animal.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <LeafIcon size={14} className="mr-1" />
                  <span>Click to learn more</span>
                </div>
              </div>
            </Link>)}
        </div>
      </div>
    </div>;
};
export default Dashboard;