import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LeafIcon, BookOpenIcon, SearchIcon } from 'lucide-react';
type SearchResult = {
  id: string;
  type: 'animal' | 'quiz';
  title: string;
  description: string;
  image?: string;
};
const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!query) return;
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, this would be an API call to search animals and quizzes
        // For now we'll simulate a search with mock data
        // This would be replaced with a real API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock search results based on query
        const results: SearchResult[] = [{
          id: '1',
          type: 'animal',
          title: 'Mountain Gorilla',
          description: 'The mountain gorilla is one of the two subspecies of the eastern gorilla.',
          image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        }, {
          id: '2',
          type: 'animal',
          title: 'Black Rhino',
          description: 'The black rhinoceros is a species of rhinoceros native to eastern and southern Africa.',
          image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        }, {
          id: '3',
          type: 'quiz',
          title: 'Mountain Gorilla Quiz',
          description: "Test your knowledge about Rwanda's mountain gorillas!"
        }, {
          id: '4',
          type: 'quiz',
          title: 'Black Rhino Quiz',
          description: 'Learn about the endangered black rhino in Africa.'
        }];
        // Filter based on search query
        const filteredResults = results.filter(result => result.title.toLowerCase().includes(query.toLowerCase()) || result.description.toLowerCase().includes(query.toLowerCase()));
        setSearchResults(filteredResults);
      } catch (err) {
        console.error('Error searching:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Search Results
        </h1>
        {query ? <p className="text-gray-600">Showing results for "{query}"</p> : <p className="text-gray-600">
            Enter a search term to find animals and quizzes
          </p>}
      </div>
      {/* Search form for mobile */}
      <div className="md:hidden">
        <form className="flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search animals, quizzes..." defaultValue={query} className="bg-white border border-gray-300 text-gray-900 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
            <SearchIcon size={20} />
          </button>
        </form>
      </div>
      {isLoading ? <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div> : error ? <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div> : searchResults.length === 0 ? <div className="text-center py-10">
          <div className="text-gray-500 mb-2">
            <SearchIcon size={48} className="mx-auto opacity-30" />
          </div>
          <h2 className="text-xl font-medium text-gray-700">
            No results found
          </h2>
          <p className="text-gray-500 mt-1">
            Try different keywords or check your spelling
          </p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(result => <Link key={`${result.type}-${result.id}`} to={result.type === 'animal' ? '/animals' : '/quiz'} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {result.image && <img src={result.image} alt={result.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <span className={`p-1.5 rounded-full mr-2 ${result.type === 'animal' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {result.type === 'animal' ? <LeafIcon size={16} /> : <BookOpenIcon size={16} />}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${result.type === 'animal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {result.type === 'animal' ? 'Animal' : 'Quiz'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800">{result.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {result.description}
                </p>
              </div>
            </Link>)}
        </div>}
    </div>;
};
export default Search;