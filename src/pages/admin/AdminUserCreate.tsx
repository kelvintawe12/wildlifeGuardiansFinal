import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import UserForm from '../../components/admin/forms/UserForm';
import { User, UserInput, getUserById, createUser, updateUser } from '../../backend/api/users';
const AdminUserCreate = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!id;
  useEffect(() => {
    if (isEditMode) {
      fetchUser(id);
    }
  }, [id]);
  const fetchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserById(userId);
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (userData: UserInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (isEditMode && id) {
        await updateUser(id, userData);
      } else {
        await createUser(userData);
      }
      navigate('/admin/users');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again.');
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    navigate('/admin/users');
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/users')} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit User' : 'Add New User'}
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
          <p className="mt-2 text-gray-600">Loading user data...</p>
        </div> : <div className="bg-white rounded-lg shadow p-6">
          <UserForm user={user || undefined} onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
        </div>}
    </div>;
};
export default AdminUserCreate;