'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDevelopers, deleteDeveloper } from '@/lib/appwrite';
import DeveloperCard from '@/components/DeveloperCard';
import { Developer } from '@/types';
import { Users, Trash2, Download } from 'lucide-react';

export default function CandidatesPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    try {
      const data = await getDevelopers();
      setDevelopers(data);
    } catch (error) {
      console.error('Error loading developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (developerId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteDeveloper(developerId);
        setDevelopers(prev => prev.filter(d => d.id !== developerId));
      } catch (error) {
        console.error('Error deleting developer:', error);
        alert('Failed to delete candidate');
      }
    }
  };

  const exportToCsv = () => {
    const csvHeaders = ['Name', 'GitHub Username', 'Location', 'Languages', 'Email', 'Company', 'Profile URL'];
    const csvData = filteredDevelopers.map(dev => [
      dev.name,
      dev.githubUsername,
      dev.location || '',
      dev.languages.join('; '),
      dev.email || '',
      dev.company || '',
      dev.profileUrl
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDevelopers = developers.filter(dev => {
    const matchesFilter = !filter || 
      dev.name.toLowerCase().includes(filter.toLowerCase()) ||
      dev.githubUsername.toLowerCase().includes(filter.toLowerCase()) ||
      dev.location?.toLowerCase().includes(filter.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || 
      dev.languages.some(lang => lang.toLowerCase().includes(selectedLanguage.toLowerCase()));

    return matchesFilter && matchesLanguage;
  });

  const allLanguages = Array.from(
    new Set(developers.flatMap(dev => dev.languages))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Candidate Database
              </h1>
              <p className="text-gray-600">
                Manage your saved developer candidates
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToCsv}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {filteredDevelopers.length} candidates
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by name, username, or location..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="min-w-48">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {allLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredDevelopers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredDevelopers.map((developer) => (
              <div key={developer.id} className="relative">
                <DeveloperCard developer={developer} isSaved={true} />
                <button
                  onClick={() => handleDelete(developer.id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  title="Delete candidate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {developers.length === 0 ? 'No candidates saved yet' : 'No candidates match your filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {developers.length === 0 
                ? 'Start searching for developers to build your candidate database.'
                : 'Try adjusting your search filters to see more candidates.'}
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              {developers.length === 0 ? 'Start Searching' : 'Clear Filters'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}