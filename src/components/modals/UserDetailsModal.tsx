import React from 'react';
import { XIcon, MailIcon, UserIcon, ShieldIcon, CalendarIcon } from 'lucide-react';
interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  users: any[];
}
const UserDetailsModal = ({
  isOpen,
  onClose,
  userId,
  users
}: UserDetailsModalProps) => {
  if (!isOpen) return null;
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                User Details
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XIcon size={20} />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold text-gray-800">
                    {user.name}
                  </h4>
                  <div className="flex items-center text-gray-500">
                    <MailIcon size={14} className="mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Role
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mr-2 ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role === 'admin' && <ShieldIcon size={12} className="mr-1" />}
                      {user.role === 'teacher' && <UserIcon size={12} className="mr-1" />}
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Status
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Join Date
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon size={14} className="mr-1 text-gray-500" />
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
                {user.role === 'student' && <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Activity
                    </div>
                    <div className="text-sm">
                      <span className="text-blue-600 font-medium">
                        {user.quizzes}
                      </span>{' '}
                      quizzes,
                      <span className="text-yellow-600 font-medium ml-1">
                        {user.badges}
                      </span>{' '}
                      badges
                    </div>
                  </div>}
              </div>
              {user.role === 'student' && <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Progress
                  </h5>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{
                  width: '65%'
                }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    65% of content completed
                  </p>
                </div>}
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
            // Edit user logic would go here
            onClose();
          }}>
              Edit User
            </button>
            <button type="button" className="inline-flex justify-center px-4 py-2 mt-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default UserDetailsModal;