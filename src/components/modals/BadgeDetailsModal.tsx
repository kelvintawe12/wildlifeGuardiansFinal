import React from 'react';
import { XIcon, AwardIcon, UsersIcon } from 'lucide-react';
interface BadgeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badgeId: number;
  badges: any[];
}
const BadgeDetailsModal = ({
  isOpen,
  onClose,
  badgeId,
  badges
}: BadgeDetailsModalProps) => {
  if (!isOpen) return null;
  const badge = badges.find(b => b.id === badgeId);
  if (!badge) return null;
  // Mock users who earned the badge
  const earnedBy = [{
    id: 1,
    name: 'Sarah Johnson',
    date: '2023-10-15'
  }, {
    id: 2,
    name: 'Michael Chen',
    date: '2023-10-12'
  }, {
    id: 3,
    name: 'Emma Davis',
    date: '2023-10-10'
  }, {
    id: 4,
    name: 'James Wilson',
    date: '2023-10-08'
  }, {
    id: 5,
    name: 'Olivia Smith',
    date: '2023-10-05'
  }];
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
                Badge Details
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XIcon size={20} />
              </button>
            </div>
            <div className="mt-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4">
                  <img src={badge.image} alt={badge.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <h4 className="text-xl font-bold text-gray-800">
                  {badge.name}
                </h4>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {badge.category}
                </span>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {badge.description}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-700">
                    Badge Statistics
                  </h5>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Awarded
                    </div>
                    <div className="flex items-center">
                      <AwardIcon size={16} className="text-yellow-500 mr-2" />
                      <span className="text-lg font-medium">
                        {badge.awarded}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Earning Rate
                    </div>
                    <div className="flex items-center">
                      <UsersIcon size={16} className="text-blue-500 mr-2" />
                      <span className="text-lg font-medium">12%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Recently Earned By
                </h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {earnedBy.map(user => <div key={user.id} className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{user.date}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
            // Edit badge logic would go here
            onClose();
          }}>
              Edit Badge
            </button>
            <button type="button" className="inline-flex justify-center px-4 py-2 mt-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default BadgeDetailsModal;