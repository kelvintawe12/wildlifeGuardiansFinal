
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, FileQuestionIcon, AwardIcon, LeafIcon, TrendingUpIcon, CalendarIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { getAllUsers, getUserStats } from '../../backend/api/users';
import { getQuizStats } from '../../backend/api/quizzes';
import { getAllBadges, getBadgeAwardCount } from '../../backend/api/badges';
import { getAllAnimals } from '../../backend/api/animals';
import { getRecentActivities } from '../../backend/api/activities';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({ total: 0, active: 0, newUsers: 0, growth: 0 });
  const [quizStats, setQuizStats] = useState({ total: 0, completed: 0, avgScore: 0 });
  const [badgeStats, setBadgeStats] = useState({ total: 0, awarded: 0 });
  const [animalStats, setAnimalStats] = useState({ total: 0, views: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        const users = await getAllUsers();
        const userStatsData = await getUserStats();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const newUsersCount = users.filter((user: any) => new Date(user.join_date) >= sevenDaysAgo).length;
        const growthPercent = userStatsData.total > 0 ? ((userStatsData.active / userStatsData.total) * 100).toFixed(1) : '0';
        setUserStats({
          total: userStatsData.total,
          active: userStatsData.active,
          newUsers: newUsersCount,
          growth: parseFloat(growthPercent)
        });
        const quizStatsData = await getQuizStats();
        setQuizStats({
          total: quizStatsData.total,
          completed: quizStatsData.completions,
          avgScore: quizStatsData.avgScore
        });
        const badges = await getAllBadges();
        const badgeAwardCount = await getBadgeAwardCount();
        const totalAwarded = Object.values(badgeAwardCount).reduce((acc: number, val: number) => acc + val, 0);
        setBadgeStats({
          total: badges.length,
          awarded: totalAwarded
        });
        const animals = await getAllAnimals();
        const totalViews = animals.reduce((acc: number, animal: any) => acc + (animal.views || 0), 0);
        setAnimalStats({
          total: animals.length,
          views: totalViews
        });
        // Recent users sorted by join_date descending, take top 5
        const sortedUsers = users
          .map((user: any) => ({
            ...user,
            type: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            date: user.join_date
          }))
          .sort((a: any, b: any) => new Date(b.join_date).getTime() - new Date(a.join_date).getTime());
        setRecentUsers(sortedUsers.slice(0, 5));
        // Fetch real recent activities
        const activities = await getRecentActivities(5);
        setRecentActivities(activities.map(a => ({
          id: a.id,
          user: a.user_name,
          action: a.action,
          target: a.target,
          date: a.date,
          score: a.score
        })));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching admin dashboard data:', error);
      }
    };
    fetchAdminDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <CalendarIcon size={18} className="mr-2 text-gray-500" />
          <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={userStats.total}
          icon={<UsersIcon size={28} className="text-blue-600" />}
          color="blue"
          link="/admin/users"
          linkLabel="View all users"
          subtext={<span className="text-green-600 flex items-center"><TrendingUpIcon size={14} className="mr-1" />{userStats.growth}%</span>}
        />
        <StatCard
          title="Quizzes"
          value={quizStats.total}
          icon={<FileQuestionIcon size={28} className="text-purple-600" />}
          color="purple"
          link="/admin/quizzes"
          linkLabel="Manage quizzes"
          subtext={<span className="text-gray-500">{quizStats.completed} completions</span>}
        />
        <StatCard
          title="Badges"
          value={badgeStats.total}
          icon={<AwardIcon size={28} className="text-yellow-600" />}
          color="yellow"
          link="/admin/badges"
          linkLabel="Manage badges"
          subtext={<span className="text-gray-500">{badgeStats.awarded} awarded</span>}
        />
        <StatCard
          title="Animal Entries"
          value={animalStats.total}
          icon={<LeafIcon size={28} className="text-green-600" />}
          color="green"
          link="/admin/animals"
          linkLabel="Manage animal info"
          subtext={<span className="text-gray-500">{animalStats.views} views</span>}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLinkCard label="Users" icon={<UsersIcon size={22} />} to="/admin/users" color="blue" />
        <QuickLinkCard label="Quizzes" icon={<FileQuestionIcon size={22} />} to="/admin/quizzes" color="purple" />
        <QuickLinkCard label="Badges" icon={<AwardIcon size={22} />} to="/admin/badges" color="yellow" />
        <QuickLinkCard label="Animals" icon={<LeafIcon size={22} />} to="/admin/animals" color="green" />
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard icon={<CheckCircleIcon size={24} className="text-green-600" />} title="All Systems Operational" subtitle="Last checked: 5 minutes ago" color="green" />
          <StatusCard icon={<TrendingUpIcon size={24} className="text-blue-600" />} title="99.9% Uptime" subtitle="Last 30 days" color="blue" />
          <StatusCard icon={<AlertCircleIcon size={24} className="text-yellow-600" />} title="Scheduled Maintenance" subtitle="Aug 10, 2025 at 02:00 UTC" color="yellow" />
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
              {recentActivities.length === 0 ? (
                <div className="text-gray-500 text-sm">No recent activity.</div>
              ) : recentActivities.map(activity => (
                <div key={activity.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                      {activity.user.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                      {activity.score && <span className="ml-1 text-green-600">({activity.score})</span>}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <Link to="/admin/activity" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all activity
              </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-500 py-4">No recent users.</td></tr>
                ) : recentUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.type === 'Student' ? 'bg-green-100 text-green-800' : user.type === 'Teacher' ? 'bg-blue-100 text-blue-800' : user.type === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard component
const StatCard = ({ title, value, icon, color, link, linkLabel, subtext }: any) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 border-t-4 border-${color}-500 border border-gray-100 flex flex-col justify-between`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        <div className="flex items-center mt-2 text-sm">{subtext}</div>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>{icon}</div>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100">
      <Link to={link} className={`text-sm text-${color}-600 hover:text-${color}-800 font-medium`}>{linkLabel}</Link>
    </div>
  </div>
);

// QuickLinkCard component
const QuickLinkCard = ({ label, icon, to, color }: any) => (
  <Link to={to} className={`flex items-center gap-3 bg-${color}-50 hover:bg-${color}-100 transition rounded-lg p-4 shadow-sm border border-gray-100`}>
    <div className={`bg-${color}-200 p-2 rounded-full`}>{icon}</div>
    <span className={`font-semibold text-${color}-700`}>{label}</span>
  </Link>
);

// StatusCard component
const StatusCard = ({ icon, title, subtitle, color }: any) => (
  <div className={`flex items-center p-4 bg-${color}-50 rounded-lg`}>
    <div className={`p-2 bg-${color}-100 rounded-full mr-4`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default AdminDashboard;
