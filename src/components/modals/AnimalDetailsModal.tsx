import React from 'react';
import { XIcon, ExternalLinkIcon } from 'lucide-react';
import { Animal } from '../../backend/api/animals';
interface AnimalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  animalId: string;
  animals: Animal[];
}
const AnimalDetailsModal: React.FC<AnimalDetailsModalProps> = ({
  isOpen,
  onClose,
  animalId,
  animals
}) => {
  if (!isOpen) return null;
  const animal = animals.find(a => a.id === animalId);
  if (!animal) return null;
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
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <XIcon size={20} />
            </button>
          </div>
          <div className="bg-white p-6">
            <div className="sm:flex sm:items-start">
              {animal.image_url && <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                  <img src={animal.image_url} alt={animal.name} className="h-32 w-32 object-cover rounded-lg" />
                </div>}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {animal.name}
                </h3>
                <p className="text-sm italic text-gray-600 mb-2">
                  {animal.scientific_name}
                </p>
                <div className="flex items-center mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(animal.status)}`}>
                    {getStatusLabel(animal.status)}
                  </span>
                  <span className="ml-3 text-xs text-gray-500">
                    {animal.views} views
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Habitat
                    </h4>
                    <p className="text-sm text-gray-900">{animal.habitat}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Population
                    </h4>
                    <p className="text-sm text-gray-900">{animal.population}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">{animal.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Interesting Facts
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {animal.facts.map((fact, index) => <li key={index} className="text-sm text-gray-600">
                      {fact}
                    </li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Threats
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {animal.threats.map((threat, index) => <li key={index} className="text-sm text-gray-600">
                      {threat}
                    </li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default AnimalDetailsModal;