import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, PlusIcon, FilterIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon, EditIcon, TrashIcon, UserIcon, MailIcon, ShieldIcon, AlertCircleIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react';
import UserDetailsModal from '../../components/modals/UserDetailsModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { User, getAllUsers, deleteUser, updateUser } from '../../backend/api/users';
const AdminUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusToggles, setStatusToggles] = useState<Record<string, boolean>>({});
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
      // Initialize status toggles
      const toggles: Record<string, boolean> = {};
      data.forEach(user => {
        toggles[user.id] = user.status === 'active';
      });
      setStatusToggles(toggles);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserModal(true);
  };
  const handleEditClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    navigate(`/admin/users/edit/${userId}`);
  };
  const handleDeleteClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;
    try {
      setIsSubmitting(true);
      await deleteUser(selectedUserId);
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };
  const handleToggleStatus = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      // Update status toggle state immediately for better UX
      setStatusToggles(prev => ({
        ...prev,
        [userId]: newStatus === 'active'
      }));
      // Update user status in database
      await updateUser(userId, {
        status: newStatus
      });
      // Update local users state
      setUsers(prev => prev.map(u => u.id === userId ? {
        ...u,
        status: newStatus
      } : u));
    } catch (err) {
      console.error('Error updating user status:', err);
      // Revert toggle state on error
      setStatusToggles(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
      setError('Failed to update user status. Please try again.');
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Link to="/admin/users/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <PlusIcon size={16} className="mr-2" />
          Add User
        </Link>
      </div>

      {/* Error message */}
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FilterIcon size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Role:</span>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              More Filters
              <ChevronDownIcon size={16} className="ml-1 inline-block" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>}

      {/* User Table */}
      {!isLoading && <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No users found matching your criteria.
                    </td>
                  </tr> : filteredUsers.map(user => <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.avatar_url ? <img src={user.avatar_url} alt={user.name} className="h-10 w-10 rounded-full object-cover" /> : <span className="font-medium text-gray-600">
                                {user.name.charAt(0)}
                              </span>}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={e => handleToggleStatus(e, user.id)} className="flex items-center group">
                          {statusToggles[user.id] ? <>
                              <ToggleRightIcon size={20} className="text-green-600 mr-1 group-hover:text-green-700" />
                              <span className="text-xs font-medium text-green-700">
                                Active
                              </span>
                            </> : <>
                              <ToggleLeftIcon size={20} className="text-gray-400 mr-1 group-hover:text-gray-600" />
                              <span className="text-xs font-medium text-gray-500">
                                Inactive
                              </span>
                            </>}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.join_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 p-1" onClick={e => handleEditClick(e, user.id)} aria-label="Edit user">
                            <EditIcon size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1" onClick={e => handleDeleteClick(e, user.id)} aria-label="Delete user">
                            <TrashIcon size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1" onClick={e => {
                    e.stopPropagation();
                    // More options
                  }} aria-label="More options">
                            <MoreHorizontalIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {filteredUsers.length > 0 && <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">{filteredUsers.length}</span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredUsers.length}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon size={16} />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      10
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>}
        </div>}

      {/* User Details Modal */}
      {showUserModal && selectedUserId && <UserDetailsModal isOpen={showUserModal} onClose={handleCloseModal} userId={selectedUserId} users={users} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <ConfirmModal isOpen={showDeleteModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title="Delete User" message="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data." confirmText="Delete" confirmColor="red" isSubmitting={isSubmitting} />}
    </div>;
};
export default AdminUsers;