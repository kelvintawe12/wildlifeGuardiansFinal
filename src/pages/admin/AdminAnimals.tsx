import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, PlusIcon, FilterIcon, EditIcon, TrashIcon, EyeIcon, AlertCircleIcon } from 'lucide-react';
import AnimalDetailsModal from '../../components/modals/AnimalDetailsModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { Animal, getAllAnimals, deleteAnimal } from '../../backend/api/animals';
const AdminAnimals = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchAnimals();
  }, []);
  const fetchAnimals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllAnimals();
      setAnimals(data);
    } catch (err) {
      console.error('Error fetching animals:', err);
      setError('Failed to load animals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) || animal.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || animal.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  const handleAnimalClick = (animalId: string) => {
    setSelectedAnimalId(animalId);
    setShowAnimalModal(true);
  };
  const handleEditClick = (e: React.MouseEvent, animalId: string) => {
    e.stopPropagation();
    navigate(`/admin/animals/edit/${animalId}`);
  };
  const handleDeleteClick = (e: React.MouseEvent, animalId: string) => {
    e.stopPropagation();
    setSelectedAnimalId(animalId);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedAnimalId) return;
    try {
      setIsSubmitting(true);
      await deleteAnimal(selectedAnimalId);
      await fetchAnimals();
      setShowDeleteModal(false);
      setSelectedAnimalId(null);
    } catch (err) {
      console.error('Error deleting animal:', err);
      setError('Failed to delete animal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setShowAnimalModal(false);
    setShowDeleteModal(false);
    setSelectedAnimalId(null);
  };
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'endangered':
        return 'bg-orange-100 text-orange-800';
      case 'vulnerable':
        return 'bg-yellow-100 text-yellow-800';
      case 'near_threatened':
        return 'bg-blue-100 text-blue-800';
      case 'least_concern':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Critically Endangered';
      case 'endangered':
        return 'Endangered';
      case 'vulnerable':
        return 'Vulnerable';
      case 'near_threatened':
        return 'Near Threatened';
      case 'least_concern':
        return 'Least Concern';
      default:
        return status;
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Animal Management</h1>
        <Link to="/admin/animals/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <PlusIcon size={16} className="mr-2" />
          Add Animal
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
            <input type="text" placeholder="Search animals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FilterIcon size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600 mr-2">Status:</span>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="all">All Statuses</option>
                <option value="critical">Critically Endangered</option>
                <option value="endangered">Endangered</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="near_threatened">Near Threatened</option>
                <option value="least_concern">Least Concern</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading animals...</p>
        </div>}

      {/* Animals Grid */}
      {!isLoading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.length === 0 ? <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">
                No animals found matching your criteria.
              </p>
            </div> : filteredAnimals.map(animal => <div key={animal.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleAnimalClick(animal.id)}>
                {animal.image_url ? <div className="h-48 overflow-hidden">
                    <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
                  </div> : <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {animal.name}
                      </h3>
                      <p className="text-sm text-gray-500 italic">
                        {animal.scientific_name}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(animal.status)}`}>
                      {getStatusLabel(animal.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {animal.description}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={e => handleEditClick(e, animal.id)} className="p-1 text-indigo-600 hover:text-indigo-900" aria-label="Edit animal">
                      <EditIcon size={16} />
                    </button>
                    <button onClick={e => handleDeleteClick(e, animal.id)} className="p-1 text-red-600 hover:text-red-900" aria-label="Delete animal">
                      <TrashIcon size={16} />
                    </button>
                    <button onClick={e => {
              e.stopPropagation();
              handleAnimalClick(animal.id);
            }} className="p-1 text-blue-600 hover:text-blue-900" aria-label="View animal details">
                      <EyeIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>)}
        </div>}

      {/* Animal Details Modal */}
      {showAnimalModal && selectedAnimalId && <AnimalDetailsModal isOpen={showAnimalModal} onClose={handleCloseModal} animalId={selectedAnimalId} animals={animals} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <ConfirmModal isOpen={showDeleteModal} onClose={handleCloseModal} onConfirm={handleConfirmDelete} title="Delete Animal" message="Are you sure you want to delete this animal? This action cannot be undone and may affect related quizzes and content." confirmText="Delete" confirmColor="red" isSubmitting={isSubmitting} />}
    </div>;
};
export default AdminAnimals;