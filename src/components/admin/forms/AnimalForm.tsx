import React, { useEffect, useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Animal, AnimalInput } from '../../../backend/api/animals';
interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (animal: AnimalInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [status, setStatus] = useState<'critical' | 'endangered' | 'vulnerable' | 'near_threatened' | 'least_concern'>('endangered');
  const [habitat, setHabitat] = useState('');
  const [population, setPopulation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [facts, setFacts] = useState<string[]>(['']);
  const [threats, setThreats] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (animal) {
      setName(animal.name);
      setScientificName(animal.scientific_name);
      setStatus(animal.status);
      setHabitat(animal.habitat);
      setPopulation(animal.population);
      setDescription(animal.description);
      setImageUrl(animal.image_url || '');
      setFacts(animal.facts.length > 0 ? animal.facts : ['']);
      setThreats(animal.threats.length > 0 ? animal.threats : ['']);
    } else {
      // Reset form for new animal
      setName('');
      setScientificName('');
      setStatus('endangered');
      setHabitat('');
      setPopulation('');
      setDescription('');
      setImageUrl('');
      setFacts(['']);
      setThreats(['']);
    }
  }, [animal]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!scientificName.trim()) newErrors.scientificName = 'Scientific name is required';
    if (!habitat.trim()) newErrors.habitat = 'Habitat is required';
    if (!population.trim()) newErrors.population = 'Population information is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    // Validate facts and threats - at least one non-empty item
    const validFacts = facts.filter(fact => fact.trim() !== '');
    if (validFacts.length === 0) {
      newErrors.facts = 'At least one fact is required';
    }
    const validThreats = threats.filter(threat => threat.trim() !== '');
    if (validThreats.length === 0) {
      newErrors.threats = 'At least one threat is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Filter out empty facts and threats
    const validFacts = facts.filter(fact => fact.trim() !== '');
    const validThreats = threats.filter(threat => threat.trim() !== '');
    const animalData: AnimalInput = {
      name,
      scientific_name: scientificName,
      status,
      habitat,
      population,
      description,
      image_url: imageUrl || undefined,
      facts: validFacts,
      threats: validThreats
    };
    onSubmit(animalData);
  };
  const handleAddFact = () => {
    setFacts([...facts, '']);
  };
  const handleRemoveFact = (index: number) => {
    if (facts.length > 1) {
      const newFacts = [...facts];
      newFacts.splice(index, 1);
      setFacts(newFacts);
    }
  };
  const handleFactChange = (index: number, value: string) => {
    const newFacts = [...facts];
    newFacts[index] = value;
    setFacts(newFacts);
  };
  const handleAddThreat = () => {
    setThreats([...threats, '']);
  };
  const handleRemoveThreat = (index: number) => {
    if (threats.length > 1) {
      const newThreats = [...threats];
      newThreats.splice(index, 1);
      setThreats(newThreats);
    }
  };
  const handleThreatChange = (index: number, value: string) => {
    const newThreats = [...threats];
    newThreats[index] = value;
    setThreats(newThreats);
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Animal Name *
          </label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="scientific-name" className="block text-sm font-medium text-gray-700">
            Scientific Name *
          </label>
          <input type="text" id="scientific-name" value={scientificName} onChange={e => setScientificName(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.scientificName ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm italic`} />
          {errors.scientificName && <p className="mt-1 text-sm text-red-600">{errors.scientificName}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Conservation Status
          </label>
          <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="critical">Critically Endangered</option>
            <option value="endangered">Endangered</option>
            <option value="vulnerable">Vulnerable</option>
            <option value="near_threatened">Near Threatened</option>
            <option value="least_concern">Least Concern</option>
          </select>
        </div>
        <div>
          <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input type="url" id="image-url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/animal.jpg" />
        </div>
      </div>
      <div>
        <label htmlFor="habitat" className="block text-sm font-medium text-gray-700">
          Habitat *
        </label>
        <input type="text" id="habitat" value={habitat} onChange={e => setHabitat(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.habitat ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.habitat && <p className="mt-1 text-sm text-red-600">{errors.habitat}</p>}
      </div>
      <div>
        <label htmlFor="population" className="block text-sm font-medium text-gray-700">
          Population *
        </label>
        <input type="text" id="population" value={population} onChange={e => setPopulation(e.target.value)} className={`mt-1 block w-full rounded-md border ${errors.population ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} placeholder="Estimated population size or range" />
        {errors.population && <p className="mt-1 text-sm text-red-600">{errors.population}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Interesting Facts *
          </label>
          <button type="button" onClick={handleAddFact} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon size={14} className="mr-1" />
            Add Fact
          </button>
        </div>
        {errors.facts && <p className="mt-1 text-sm text-red-600 mb-2">{errors.facts}</p>}
        <div className="space-y-2">
          {facts.map((fact, index) => <div key={index} className="flex items-center">
              <input type="text" value={fact} onChange={e => handleFactChange(index, e.target.value)} className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`Fact ${index + 1}`} />
              {facts.length > 1 && <button type="button" onClick={() => handleRemoveFact(index)} className="ml-2 text-red-600 hover:text-red-800">
                  <XIcon size={16} />
                </button>}
            </div>)}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Threats *
          </label>
          <button type="button" onClick={handleAddThreat} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon size={14} className="mr-1" />
            Add Threat
          </button>
        </div>
        {errors.threats && <p className="mt-1 text-sm text-red-600 mb-2">{errors.threats}</p>}
        <div className="space-y-2">
          {threats.map((threat, index) => <div key={index} className="flex items-center">
              <input type="text" value={threat} onChange={e => handleThreatChange(index, e.target.value)} className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`Threat ${index + 1}`} />
              {threats.length > 1 && <button type="button" onClick={() => handleRemoveThreat(index)} className="ml-2 text-red-600 hover:text-red-800">
                  <XIcon size={16} />
                </button>}
            </div>)}
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-5">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Saving...' : animal ? 'Update Animal' : 'Create Animal'}
        </button>
      </div>
    </form>;
};
export default AnimalForm;