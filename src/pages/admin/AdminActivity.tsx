import { useEffect, useState } from 'react';
import { getRecentActivities, Activity } from '../../backend/api/activities';
import { UsersIcon } from 'lucide-react';

const AdminActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecentActivities(50);
        setActivities(data);
      } catch (err: any) {
        setError('Failed to fetch activities.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Activity Log</h1>
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-gray-500">No activities found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold">
                      {activity.user_name?.charAt(0) || <UsersIcon size={16} />}
                    </span>
                    <span>{activity.user_name}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{activity.action}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{activity.target}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{activity.score || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminActivity;
