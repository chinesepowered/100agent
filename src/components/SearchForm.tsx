'use client';

import { useState } from 'react';
import { Search, MapPin, Code, Users } from 'lucide-react';
import { SearchQuery } from '@/types';

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState<number | undefined>();

  const popularLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'React', 'Vue', 'Angular', 'Node.js', 'C++', 'C#', 'PHP', 'Ruby'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({
        query: query.trim(),
        location: location.trim() || undefined,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
        minFollowers,
        maxResults: 10,
      });
    }
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find GitHub Developers</h2>
        <p className="text-gray-600">Search for talented developers using AI-powered discovery</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="inline w-4 h-4 mr-1" />
            Search Query
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Python developers, Machine learning engineers, Full stack developers"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, New York, Remote"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="minFollowers" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Min Followers (Optional)
            </label>
            <input
              type="number"
              id="minFollowers"
              value={minFollowers || ''}
              onChange={(e) => setMinFollowers(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g., 100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Code className="inline w-4 h-4 mr-1" />
            Programming Languages (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {popularLanguages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => toggleLanguage(language)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguages.includes(language)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            'Search Developers'
          )}
        </button>
      </form>
    </div>
  );
}