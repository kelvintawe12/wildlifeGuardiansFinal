import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import BadgeForm from '../../components/admin/forms/BadgeForm';
import { Badge, BadgeInput, getBadgeById, createBadge, updateBadge } from '../../backend/api/badges';
const AdminBadgeCreate = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [badge, setBadge] = useState<Badge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!id;
  useEffect(() => {
    if (isEditMode) {
      fetchBadge(id);
    }
  }, [id]);
  const fetchBadge = async (badgeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getBadgeById(badgeId);
      setBadge(data);
    } catch (err) {
      console.error('Error fetching badge:', err);
      setError('Failed to load badge data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (badgeData: BadgeInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditMode && id) {
        await updateBadge(id, badgeData);
      } else {
        await createBadge(badgeData);
      }
      navigate('/admin/badges');
    } catch (err) {
      console.error('Error saving badge:', err);
      setError('Failed to save badge. Please try again.');
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    navigate('/admin/badges');
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/badges')} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Badge' : 'Create New Badge'}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
        </div>
      </div>
      {error && <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>}
      {isLoading ? <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading badge data...</p>
        </div> : <div className="bg-white rounded-lg shadow p-6">
          <BadgeForm badge={badge || undefined} onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
        </div>}
    </div>;
};
export default AdminBadgeCreate;