import React, { useEffect, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import BadgeDetailsModal from '../../components/modals/BadgeDetailsModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import BadgeForm from '../../components/admin/forms/BadgeForm';
import { Badge, BadgeInput, getAllBadges, createBadge, updateBadge, deleteBadge, getBadgeAwardCount } from '../../backend/api/badges';
const AdminBadges = () => {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [awardCounts, setAwardCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchBadges();
  }, []);
  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllBadges();
      setBadges(data);
      // Get award counts
      const counts = await getBadgeAwardCount();
      setAwardCounts(counts);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError('Failed to load badges. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleBadgeClick = (badgeId: string) => {
    setSelectedBadgeId(badgeId);
    setShowBadgeModal(true);
  };
  const handleEditClick = (e: React.MouseEvent, badgeId: string) => {
    e.stopPropagation();
    setSelectedBadgeId(badgeId);
    setShowFormModal(true);
  };
  const handleDeleteClick = (e: React.MouseEvent, badgeId: string) => {
    e.stopPropagation();
    setSelectedBadgeId(badgeId);
    setShowDeleteModal(true);
  };
  const handleAddBadge = () => {
    setSelectedBadgeId(null);
    setShowFormModal(true);
  };
  const handleFormSubmit = async (badgeData: BadgeInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      if (selectedBadgeId) {
        // Update existing badge
        await updateBadge(selectedBadgeId, badgeData);
      } else {
        // Create new badge
        await createBadge(badgeData);
      }
      // Refresh the badges list
      await fetchBadges();
      setShowFormModal(false);
    } catch (err) {
      console.error('Error saving badge:', err);
      setError('Failed to save badge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleConfirmDelete = async () => {
    if (!selectedBadgeId) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await deleteBadge(selectedBadgeId);
      // Refresh the badges list
      await fetchBadges();
      setShowDeleteModal(false);
      setSelectedBadgeId(null);
    } catch (err) {
      console.error('Error deleting badge:', err);
      setError('Failed to delete badge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setShowBadgeModal(false);
    setShowDeleteModal(false);
    setShowFormModal(false);
    setSelectedBadgeId(null);
    setError(null);
  };
  const selectedBadge = selectedBadgeId ? badges.find(badge => badge.id === selectedBadgeId) : null;
  // Calculate stats
  const badgeStats = {
    total: badges.length,
    awarded: Object.values(awardCounts).reduce((sum, count) => sum + count, 0),
    categories: new Set(badges.map(badge => badge.category)).size
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Badge Management</h1>
        <button onClick={handleAddBadge} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <PlusIcon size={16} className="mr-2" />
          Create Badge
        </button>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Total Badges</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {badgeStats.total}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Total Awarded</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {badgeStats.awarded}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">
            Badge Categories
          </div>
          <div className="text-2xl font-bold text-gray-800 mt-1">
            {badgeStats.categories}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading badges...</p>
        </div>}

      {/* Badge Grid */}
      {!isLoading && badges.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
            <AlertCircleIcon size={24} className="text-gray-500" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No badges found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new badge.
          </p>
          <div className="mt-6">
            <button onClick={handleAddBadge} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              <PlusIcon size={16} className="mr-2" />
              Create Badge
            </button>
          </div>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(badge => <div key={badge.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleBadgeClick(badge.id)}>
              <div className="relative">
                <img src={badge.image_url || 'https://via.placeholder.com/300x150?text=No+Image'} alt={badge.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors" onClick={e => handleEditClick(e, badge.id)}>
                    <EditIcon size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors" onClick={e => handleDeleteClick(e, badge.id)}>
                    <TrashIcon size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold text-gray-800">
                    {badge.name}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.category === 'Quiz' ? 'bg-green-100 text-green-800' : badge.category === 'Achievement' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {badge.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {badge.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Awarded</span>
                  <span className="font-medium text-indigo-600">
                    {awardCounts[badge.id] || 0} times
                  </span>
                </div>
              </div>
            </div>)}
        </div>}

      {/* Badge Details Modal */}
      {showBadgeModal && selectedBadgeId && <BadgeDetailsModal isOpen={showBadgeModal} onClose={handleCloseModal} badgeId={selectedBadgeId} badges={badges} />}

      {/* Badge Form Modal */}
      {showFormModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-6 pt-5 pb-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {selectedBadge ? 'Edit Badge' : 'Create New Badge'}
                  </h3>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Close</span>
                    <XIcon size={20} />
                  </button>
                </div>
                <BadgeForm badge={selectedBadge || undefined} onSubmit={handleFormSubmit} onCancel={handleCloseModal} isSubmitting={isSubmitting} />
              </div>
            </div>
          </div>
        </div>}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <ConfirmModal isOpen={showDeleteModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title="Delete Badge" message="Are you sure you want to delete this badge? This action cannot be undone." confirmText="Delete" confirmColor="red" isSubmitting={isSubmitting} />}
    </div>;
};
export default AdminBadges;