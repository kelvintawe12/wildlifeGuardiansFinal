import React, { useState } from 'react';
import { MapIcon, AlertTriangleIcon, HeartIcon, InfoIcon, SearchIcon } from 'lucide-react';
const AnimalInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [{
    id: 'all',
    name: 'All Animals'
  }, {
    id: 'endangered',
    name: 'Endangered'
  }, {
    id: 'critical',
    name: 'Critically Endangered'
  }, {
    id: 'vulnerable',
    name: 'Vulnerable'
  }];
  const animals = [{
    id: 1,
    name: 'Mountain Gorilla',
    scientificName: 'Gorilla beringei beringei',
    status: 'endangered',
    population: 'Around 1,000',
    habitat: 'Mountain forests of Rwanda, Uganda, and DRC',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'Mountain gorillas are one of the most endangered animals in the world. They live in the mountain forests of Rwanda, Uganda, and the Democratic Republic of Congo. Conservation efforts have helped their population grow in recent years.',
    facts: ['Adult males can weigh up to 200 kg', 'They live in groups called troops led by a silverback male', 'They share 98% of their DNA with humans', 'They are herbivores, eating mainly plants and fruits', 'Females give birth to one baby every 4-6 years'],
    threats: ['Habitat loss due to human activities', 'Poaching', 'Disease transmission from humans', 'Civil unrest in their habitat regions']
  }, {
    id: 2,
    name: 'Black Rhino',
    scientificName: 'Diceros bicornis',
    status: 'critical',
    population: 'Around 5,600',
    habitat: 'Grasslands and savannas of eastern and southern Africa',
    image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'The black rhino is critically endangered due to poaching for its horn. Conservation efforts are helping to slowly increase its population in protected areas across Africa.',
    facts: ['Can weigh up to 1,400 kg', 'Has two horns made of keratin', 'Can run at speeds up to 55 km/h', 'Has a prehensile upper lip for grabbing branches and leaves', 'Females give birth every 2-3 years'],
    threats: ['Poaching for rhino horn', 'Habitat loss', 'Small population size leading to genetic issues', 'Human-wildlife conflict']
  }, {
    id: 3,
    name: 'African Elephant',
    scientificName: 'Loxodonta africana',
    status: 'vulnerable',
    population: 'Around 415,000',
    habitat: 'Forests, savannas, and deserts across Africa',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: 'African elephants are the largest land animals on Earth. They play a crucial role in maintaining the biodiversity of their habitats, but face threats from poaching and habitat loss.',
    facts: ['Can weigh up to 6,000 kg', 'Have the largest brain of any land animal', 'Pregnancy lasts about 22 months', 'Can live up to 70 years in the wild', 'Use their trunks to communicate and handle objects'],
    threats: ['Poaching for ivory', 'Habitat loss and fragmentation', 'Human-elephant conflict', 'Climate change affecting water sources']
  }, {
    id: 4,
    name: "Grévy's Zebra",
    scientificName: 'Equus grevyi',
    status: 'endangered',
    population: 'Around 2,000',
    habitat: 'Semi-arid grasslands of Kenya and Ethiopia',
    image: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    description: "Grévy's zebra is the largest wild equid and the most threatened zebra species. It has narrower stripes than other zebras and a white belly.",
    facts: ['Can go without water for up to five days', 'Males can weigh up to 450 kg', 'Has the largest ears of all zebra species', 'Females give birth to a single foal after 13 months', 'Primarily eats grasses'],
    threats: ['Habitat loss due to overgrazing', 'Competition with livestock for water', 'Hunting for meat and medicinal purposes', 'Drought caused by climate change']
  }];
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || animal.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || animal.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const handleAnimalClick = (animalId: number) => {
    setSelectedAnimal(animalId);
    // In a real app, you might want to scroll to top or use a modal
    window.scrollTo(0, 0);
  };
  const handleBackClick = () => {
    setSelectedAnimal(null);
  };
  const renderAnimalsList = () => {
    return <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Animal Encyclopedia
          </h1>
          <p className="text-gray-600">
            Learn about endangered animals in Rwanda and Africa!
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search animals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {category.name}
              </button>)}
          </div>
        </div>
        {filteredAnimals.length === 0 ? <div className="text-center py-10">
            <div className="text-gray-400 mb-4">
              <InfoIcon size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No animals found
            </h3>
            <p className="text-gray-500">Try changing your search or filter</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => <div key={animal.id} onClick={() => handleAnimalClick(animal.id)} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <img src={animal.image} alt={animal.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${animal.status === 'critical' ? 'bg-red-100 text-red-800' : animal.status === 'endangered' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {animal.status === 'critical' ? 'Critically Endangered' : animal.status === 'endangered' ? 'Endangered' : 'Vulnerable'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg text-gray-800 mb-1">
                    {animal.name}
                  </h2>
                  <p className="text-sm text-gray-500 italic mb-3">
                    {animal.scientificName}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {animal.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapIcon size={16} className="mr-1" />
                      <span>{animal.habitat.split(' ')[0]}</span>
                    </div>
                    <div className="text-blue-600 text-sm font-medium">
                      Learn more
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>;
  };
  const renderAnimalDetail = () => {
    const animal = animals.find(a => a.id === selectedAnimal);
    if (!animal) return null;
    const statusColor = {
      critical: 'bg-red-100 text-red-800',
      endangered: 'bg-orange-100 text-orange-800',
      vulnerable: 'bg-yellow-100 text-yellow-800'
    };
    const statusText = {
      critical: 'Critically Endangered',
      endangered: 'Endangered',
      vulnerable: 'Vulnerable'
    };
    return <div className="space-y-6">
        <button onClick={handleBackClick} className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
          ← Back to all animals
        </button>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative">
            <img src={animal.image} alt={animal.name} className="w-full h-64 md:h-80 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2 ${statusColor[animal.status as keyof typeof statusColor]}`}>
                {statusText[animal.status as keyof typeof statusText]}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {animal.name}
              </h1>
              <p className="text-white/80 italic">{animal.scientificName}</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapIcon size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Habitat</h3>
                </div>
                <p className="text-sm text-gray-600">{animal.habitat}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <HeartIcon size={18} className="text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-800">Population</h3>
                </div>
                <p className="text-sm text-gray-600">{animal.population}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangleIcon size={18} className="text-red-600 mr-2" />
                  <h3 className="font-medium text-gray-800">
                    Conservation Status
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {statusText[animal.status as keyof typeof statusText]}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
              <p className="text-gray-600">{animal.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Interesting Facts
                </h2>
                <ul className="space-y-2">
                  {animal.facts.map((fact, index) => <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">•</div>
                      <span className="text-gray-600">{fact}</span>
                    </li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Threats
                </h2>
                <ul className="space-y-2">
                  {animal.threats.map((threat, index) => <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 text-red-500">•</div>
                      <span className="text-gray-600">{threat}</span>
                    </li>)}
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                How You Can Help
              </h2>
              <p className="text-gray-600 mb-4">
                There are many ways you can help protect{' '}
                {animal.name.toLowerCase()}s and their habitats:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Learn More</h3>
                  <p className="text-sm text-gray-600">
                    Take quizzes and share what you learn with friends and
                    family.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Reduce Waste
                  </h3>
                  <p className="text-sm text-gray-600">
                    Recycle and reduce your use of single-use plastics.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Support Conservation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ask your parents to support wildlife conservation
                    organizations.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Visit Responsibly
                  </h3>
                  <p className="text-sm text-gray-600">
                    If you visit natural areas, follow guidelines and respect
                    wildlife.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
  };
  return selectedAnimal ? renderAnimalDetail() : renderAnimalsList();
};
export default AnimalInfo;