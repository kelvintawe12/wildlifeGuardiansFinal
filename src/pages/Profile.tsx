import React, { useEffect, useState } from 'react';
import { UserIcon, AwardIcon, BookOpenIcon, CalendarIcon, TrendingUpIcon, ClockIcon, MailIcon, KeyIcon, LogOutIcon } from 'lucide-react';
import { getUserById, getUserBadges, getUserQuizResults } from '../backend/api/users';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  join_date: string;
  avatar_url?: string;
};
type Badge = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at?: string;
  badges?: any;
};
type QuizResult = {
  id: string;
  score: number;
  max_score: number;
  completed_at: string;
  quizzes?: any;
};
const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('badges');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const currentUser = localStorage.getItem('currentUser');
        const userId = currentUser ? JSON.parse(currentUser).id : null;
        if (!userId) throw new Error('No user logged in');
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
          setFormData(f => ({ ...f, name: userData.name, email: userData.email }));
        }
        // Get badges and quiz results
        const badgesData = await getUserBadges(userId);
        setBadges(badgesData.map(b => {
          const badge = b.badges || b.badge || b;
          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            image_url: badge.image_url,
            awarded_at: b.awarded_at || b.earned_at || badge.awarded_at || badge.earned_at
          };
        }));
        const quizResultsData = await getUserQuizResults(userId);
        setQuizResults(quizResultsData.map(q => ({
          id: q.id,
          quizzes: q.quizzes,
          score: q.score,
          max_score: q.max_score,
          completed_at: q.completed_at
        })));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required');
        return;
      }
    }
    try {
      // In a real app, this would be an API call to update the user
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Update local state to reflect changes
      if (user) {
        setUser({
          ...user,
          name: formData.name,
          email: formData.email
        });
      }
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  return <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
        My Profile
      </h1>
      {/* Profile header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="relative">
              <img src={user?.avatar_url || 'https://via.placeholder.com/150'} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-green-100" />
              <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white">
                <UserIcon size={14} className="text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 flex items-center justify-center md:justify-start mt-1">
              <MailIcon size={14} className="mr-1" />
              {user?.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                {(user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '')}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <CalendarIcon size={14} className="mr-1" />
                Joined {new Date(user?.join_date || '').toLocaleDateString()}
                Joined {new Date(user?.join_date || '').toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            {isEditing ? <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button> : <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>}
          </div>
        </div>
      </div>
      {/* Edit profile form */}
      {isEditing && <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Profile</h2>
          {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>}
          {success && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">
                Change Password (Optional)
              </h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </div>}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <BookOpenIcon size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {quizResults.length}
              </h3>
              <p className="text-sm text-gray-500">Quizzes Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <AwardIcon size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {badges.length}
              </h3>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <TrendingUpIcon size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {quizResults.length > 0 ? Math.round(quizResults.reduce((acc, quiz) => acc + quiz.score / quiz.max_score, 0) / quizResults.length * 100) : 0}
                %
              </h3>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('badges')} className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'badges' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}>
            <div className="flex items-center justify-center">
              <AwardIcon size={16} className="mr-2" />
              My Badges
            </div>
          </button>
          <button onClick={() => setActiveTab('quizzes')} className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'quizzes' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}>
            <div className="flex items-center justify-center">
              <BookOpenIcon size={16} className="mr-2" />
              Quiz History
            </div>
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'badges' && <div>
              {badges.length === 0 ? <div className="text-center py-8">
                  <AwardIcon size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    You haven't earned any badges yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Complete quizzes to earn badges!
                  </p>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map(badge => <div key={badge.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-start">
                        <img src={badge.image_url} alt={badge.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                        <img src={badge.image_url} alt={badge.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {badge.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {badge.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <CalendarIcon size={12} className="mr-1" />
                            Earned on{' '}
                            {badge.awarded_at ? new Date(badge.awarded_at).toLocaleDateString() : ''}
                            {badge.awarded_at ? new Date(badge.awarded_at).toLocaleDateString() : ''}
                {quizResults.length > 0 ? Math.round(quizResults.reduce((acc, quiz) => acc + quiz.score / quiz.max_score, 0) / quizResults.length * 100) : 0}
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>}
            </div>}
          {activeTab === 'quizzes' && <div>
              {quizResults.length === 0 ? <div className="text-center py-8">
                  <BookOpenIcon size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    You haven't completed any quizzes yet.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Take a quiz to see your results here!
                  </p>
                </div> : <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quiz
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quizResults.map(result => <tr key={result.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {result.quizzes?.title || ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${result.score / result.max_score >= 0.7 ? 'text-green-700' : result.score / result.max_score >= 0.4 ? 'text-yellow-700' : 'text-red-700'}`}>
                                {result.score}/{result.max_score}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                (
                                {Math.round(result.score / result.max_score * 100)}
                                %)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon size={14} className="mr-1" />
                              {new Date(result.completed_at).toLocaleDateString()}{' '}
                              at{' '}
                              {new Date(result.completed_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>}
            </div>}
        </div>
      </div>
      {/* Account actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Account Actions
        </h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left">
            <div className="flex items-center">
              <KeyIcon size={18} className="mr-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Change Password
              </span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left">
            <div className="flex items-center">
              <LogOutIcon size={18} className="mr-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Logout</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>;
};
export default Profile;