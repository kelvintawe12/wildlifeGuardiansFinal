import React, { useEffect, useState } from 'react';
import { MapIcon, AlertTriangleIcon, HeartIcon, InfoIcon, SearchIcon } from 'lucide-react';
import { getAllAnimals } from '../backend/api/animals';
import { getAllQuizzes } from '../backend/api/quizzes';

const AnimalInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animals, setAnimals] = useState<any[]>([]);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = [
    { id: 'all', name: 'All Animals' },
    { id: 'endangered', name: 'Endangered' },
    { id: 'critical', name: 'Critically Endangered' },
    { id: 'vulnerable', name: 'Vulnerable' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const animalsData = await getAllAnimals();
        setAnimals(animalsData);
        const quizzesData = await getAllQuizzes();
        setAllQuizzes(quizzesData);
      } catch (err) {
        console.error('Error fetching animals or quizzes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || (animal.scientific_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || animal.status === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
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
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        {filteredAnimals.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4">
              <InfoIcon size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No animals found
            </h3>
            <p className="text-gray-500">Try changing your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => {
              const animalQuizzes = allQuizzes.filter(q => q.animal_id === animal.id);
              return (
                <div key={animal.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img src={animal.image_url} alt={animal.name} className="w-full h-48 object-cover" />
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
                      {animal.scientific_name}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {animal.description}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapIcon size={16} className="mr-1" />
                        <span>{(animal.habitat || '').split(' ')[0]}</span>
                      </div>
                      <div className="text-blue-600 text-sm font-medium">
                        Learn more
                      </div>
                    </div>
                    <div className="mt-3">
                      {animalQuizzes.length === 0 ? (
                        <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mb-2">Untracked Quizzes</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {animalQuizzes.map((quiz) => (
                            <a
                              key={quiz.id}
                              href={`/quiz?id=${quiz.id}`}
                              className="inline-block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs font-medium"
                              onClick={e => e.stopPropagation()}
                            >
                              {quiz.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimalInfo;