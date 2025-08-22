import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Mic, Filter, X, Clock, TrendingUp, Star } from 'lucide-react';

interface SearchSuggestion {
  text: string;
  type: 'movie' | 'suggestion' | 'trending' | 'recent' | 'popular';
  category: string;
}

interface SearchResult {
  _id: string;
  title: string;
  year: number;
  genre: string[];
  category: string[];
  poster: string;
  imdbRating: number;
  featured: boolean;
  relevanceScore: number;
}

interface SmartSearchProps {
  onSearch?: (query: string, results: SearchResult[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  placeholder = "Search movies, actors, directors...",
  showFilters = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    genre: [] as string[],
    category: [] as string[],
    year: null as number | null,
    rating: null as number | null
  });
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        await performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
  }, []);

  // Get auto-complete suggestions
  const getAutoComplete = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Auto-complete error:', error);
    }
  };

  // Perform smart search
  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      
      const params = new URLSearchParams({
        q: searchQuery,
        page: '1',
        limit: '20',
        sortBy: 'relevance'
      });

      // Add filters to search params
      if (filters.genre.length > 0) {
        filters.genre.forEach(g => params.append('genre', g));
      }
      if (filters.category.length > 0) {
        filters.category.forEach(c => params.append('category', c));
      }
      if (filters.year) {
        params.append('year', filters.year.toString());
      }
      if (filters.rating) {
        params.append('rating', filters.rating.toString());
      }

      const response = await fetch(`/api/search/smart?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data.results);
        setShowResults(true);
        setShowSuggestions(false);
        
        if (onSearch) {
          onSearch(searchQuery, data.data.results);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length >= 2) {
      getAutoComplete(value);
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    performSearch(suggestion.text);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as Window & typeof globalThis).webkitSpeechRecognition || (window as Window & typeof globalThis).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        performSearch(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get suggestion icon
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'recent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'popular':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className={`h-5 w-5 ${isSearching ? 'animate-pulse text-blue-500' : 'text-gray-400'}`} />
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
            autoComplete="off"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
              title="Voice Search"
            >
              <Mic className="h-4 w-4" />
            </button>
            
            {showFilters && (
              <button
                type="button"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`p-2 rounded-full transition-colors ${
                  showFiltersPanel 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-400'
                }`}
                title="Search Filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              {getSuggestionIcon(suggestion.type)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{suggestion.text}</div>
                <div className="text-xs text-gray-500">{suggestion.category}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Search Filters Panel */}
      {showFiltersPanel && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                multiple
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, genre: selected }));
                }}
              >
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Horror">Horror</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                multiple
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, category: selected }));
                }}
              >
                <option value="Bollywood">Bollywood</option>
                <option value="Hollywood">Hollywood</option>
                <option value="Dual Audio">Dual Audio</option>
                <option value="South Indian">South Indian</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="e.g. 2024"
                onChange={(e) => {
                  const year = e.target.value ? parseInt(e.target.value) : null;
                  setFilters(prev => ({ ...prev, year }));
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="e.g. 7.0"
                onChange={(e) => {
                  const rating = e.target.value ? parseFloat(e.target.value) : null;
                  setFilters(prev => ({ ...prev, rating }));
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setFilters({ genre: [], category: [], year: null, rating: null });
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFiltersPanel(false);
                if (query.trim()) {
                  performSearch(query.trim());
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.slice(0, 5).map((movie) => (
                <div
                  key={movie._id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <img
                    src={movie.poster || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{movie.title}</h3>
                    <p className="text-sm text-gray-600">
                      {movie.year} • {movie.genre?.join(', ')}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {movie.imdbRating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{movie.imdbRating}</span>
                        </div>
                      )}
                      {movie.featured && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {searchResults.length > 5 && (
                <div className="text-center p-3 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    View all {searchResults.length} results
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No results found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;

