import React from 'react';
import { UsersIcon, FileQuestionIcon, AwardIcon, LeafIcon, TrendingUpIcon, CalendarIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  // Mock data for charts and stats
  const userStats = {
    total: 1248,
    active: 987,
    new: 42,
    growth: 12.5
  };
  const quizStats = {
    total: 24,
    completed: 3842,
    avgScore: 76.5
  };
  const badgeStats = {
    total: 18,
    awarded: 2156
  };
  const animalStats = {
    total: 36,
    views: 8945
  };
  const recentUsers = [{
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    type: 'Student',
    date: '2023-10-21'
  }, {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@example.com',
    type: 'Student',
    date: '2023-10-20'
  }, {
    id: 3,
    name: 'Emma Davis',
    email: 'emma@example.com',
    type: 'Teacher',
    date: '2023-10-19'
  }, {
    id: 4,
    name: 'James Wilson',
    email: 'james@example.com',
    type: 'Student',
    date: '2023-10-18'
  }, {
    id: 5,
    name: 'Olivia Smith',
    email: 'olivia@example.com',
    type: 'Student',
    date: '2023-10-17'
  }];
  const recentActivities = [{
    id: 1,
    user: 'Sarah Johnson',
    action: 'completed',
    target: 'Mountain Gorilla Quiz',
    date: '2023-10-21 14:32',
    score: '4/5'
  }, {
    id: 2,
    user: 'Michael Chen',
    action: 'earned',
    target: 'Conservation Champion Badge',
    date: '2023-10-20 09:15'
  }, {
    id: 3,
    user: 'Emma Davis',
    action: 'added',
    target: 'Black Rhino Quiz',
    date: '2023-10-19 16:45'
  }, {
    id: 4,
    user: 'James Wilson',
    action: 'viewed',
    target: 'African Elephant Info',
    date: '2023-10-18 11:20'
  }, {
    id: 5,
    user: 'Admin User',
    action: 'updated',
    target: 'Mountain Gorilla Info',
    date: '2023-10-17 15:10'
  }];
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center text-sm bg-white px-3 py-1 rounded-lg border border-gray-200">
          <CalendarIcon size={16} className="mr-2 text-gray-500" />
          <span>
            {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          </span>
        </div>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {userStats.total.toLocaleString()}
              </h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 flex items-center">
                  <TrendingUpIcon size={14} className="mr-1" />
                  {userStats.growth}%
                </span>
                <span className="text-gray-500 ml-2">vs. last month</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UsersIcon size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all users
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Quizzes</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {quizStats.total}
              </h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">
                  {quizStats.completed.toLocaleString()} completions
                </span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileQuestionIcon size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/quizzes" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
              Manage quizzes
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Badges</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {badgeStats.total}
              </h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">
                  {badgeStats.awarded.toLocaleString()} awarded
                </span>
              </div>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AwardIcon size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/badges" className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">
              Manage badges
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Animal Entries
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {animalStats.total}
              </h3>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">
                  {animalStats.views.toLocaleString()} views
                </span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <LeafIcon size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/admin/animals" className="text-sm text-green-600 hover:text-green-800 font-medium">
              Manage animal info
            </Link>
          </div>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <CheckCircleIcon size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                All Systems Operational
              </p>
              <p className="text-xs text-gray-500">
                Last checked: 5 minutes ago
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full mr-4">
              <TrendingUpIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">99.9% Uptime</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-full mr-4">
              <AlertCircleIcon size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Scheduled Maintenance
              </p>
              <p className="text-xs text-gray-500">Oct 25, 2023 at 02:00 UTC</p>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map(activity => <div key={activity.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                      {activity.user.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      <span className="font-semibold">{activity.target}</span>
                      {activity.score && <span className="ml-1 text-green-600">
                          ({activity.score})
                        </span>}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>)}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all activity
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map(user => <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.type === 'Student' ? 'bg-green-100 text-green-800' : user.type === 'Teacher' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.date}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminDashboard;