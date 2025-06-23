'use client';

import { useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import SearchForm from '@/components/SearchForm';
import DeveloperCard from '@/components/DeveloperCard';
import { Developer, SearchQuery, SearchResult } from '@/types';
import { Search, Users, Sparkles, Github, MessageSquare } from 'lucide-react';

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [savedDevelopers, setSavedDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

  const handleSearch = async (query: SearchQuery) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result: SearchResult = await response.json();
      setSearchResults(result);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDeveloper = (developer: Developer) => {
    if (!savedDevelopers.find(d => d.githubUsername === developer.githubUsername)) {
      setSavedDevelopers(prev => [...prev, developer]);
    }
  };

  const isDeveloperSaved = (developer: Developer) => {
    return savedDevelopers.some(d => d.githubUsername === developer.githubUsername);
  };

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <CopilotSidebar
          instructions="You are a recruiting assistant helping to find and manage GitHub developers. You can search for developers, save them to the database, and generate outreach emails."
          labels={{
            title: "IntelliCrawl Assistant",
            initial: "Hi! I'm your AI recruiting assistant. I can help you search for developers, manage candidates, and create outreach emails. What would you like to do?",
          }}
          defaultOpen={false}
        >
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                  <Search className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IntelliCrawl
                </span>{' '}
                Recruiter
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                AI-powered talent discovery tool that finds GitHub developers using advanced web crawling,
                stores candidates in your database, and provides intelligent recruiting assistance.
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium">Tavily Search</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <Users className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Appwrite Database</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">CopilotKit AI</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'search'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Developers
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'saved'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Saved Candidates ({savedDevelopers.length})
                </button>
              </div>
            </div>

            {/* Content */}
            {activeTab === 'search' && (
              <div className="space-y-8">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />

                {searchResults && (
                  <div className="animate-slide-in">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Search Results
                        </h2>
                        <div className="flex items-center text-gray-600">
                          <Github className="w-5 h-5 mr-2" />
                          <span className="font-medium">
                            {searchResults.totalFound} developers found
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">
                        Query: &ldquo;{searchResults.searchQuery}&rdquo; • {new Date(searchResults.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {searchResults.developers.map((developer) => (
                        <DeveloperCard
                          key={developer.id}
                          developer={developer}
                          onSave={handleSaveDeveloper}
                          isSaved={isDeveloperSaved(developer)}
                        />
                      ))}
                    </div>

                    {searchResults.developers.length === 0 && (
                      <div className="text-center py-12">
                        <Github className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          No developers found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search criteria or using different keywords.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Saved Candidates
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {savedDevelopers.length} candidates saved
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Manage your saved developer candidates and generate outreach emails.
                  </p>
                </div>

                {savedDevelopers.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {savedDevelopers.map((developer) => (
                      <DeveloperCard
                        key={developer.id}
                        developer={developer}
                        isSaved={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No saved candidates yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Search for developers and save the ones you&rsquo;re interested in.
                    </p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Searching
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-16 text-center py-8 border-t border-gray-200">
              <p className="text-gray-500 mb-4">
                Built for the 100 Agents Hackathon with Tavily, Appwrite, and CopilotKit
              </p>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>🏆 Tavily Prize</span>
                <span>🏆 CopilotKit Prize</span>
                <span>🏆 Appwrite Open Source Prize</span>
              </div>
            </div>
          </div>
        </CopilotSidebar>
      </div>
    </CopilotKit>
  );
}