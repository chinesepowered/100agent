'use client';

import { Developer } from '@/types';
import { Github, MapPin, Users, Star, GitFork, Building, Globe, Mail, MessageSquare, Brain, Search, Sparkles } from 'lucide-react';

interface DeveloperCardProps {
  developer: Developer;
  onSave?: (developer: Developer) => void;
  isSaved?: boolean;
  showAgentActions?: boolean;
  onGenerateEmail?: (developer: Developer) => void;
  onAnalyzeProfile?: (developer: Developer) => void;
  onFindSimilar?: (developer: Developer) => void;
}

export default function DeveloperCard({ 
  developer, 
  onSave, 
  isSaved, 
  showAgentActions = false,
  onGenerateEmail,
  onAnalyzeProfile,
  onFindSimilar
}: DeveloperCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start space-x-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={developer.avatarUrl || `https://github.com/${developer.githubUsername}.png`}
          alt={developer.name}
          className="w-16 h-16 rounded-full border-2 border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=?';
          }}
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">{developer.name}</h3>
            {onSave && (
              <button
                onClick={() => onSave(developer)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isSaved
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <a
              href={developer.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Github className="w-4 h-4 mr-1" />
              @{developer.githubUsername}
            </a>
            
            {developer.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {developer.location}
              </div>
            )}
          </div>

          {developer.bio && (
            <p className="text-gray-700 mt-3 text-sm leading-relaxed">{developer.bio}</p>
          )}

          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
            {developer.followers !== undefined && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {developer.followers} followers
              </div>
            )}
            
            {developer.publicRepos !== undefined && (
              <div className="flex items-center">
                <Github className="w-4 h-4 mr-1" />
                {developer.publicRepos} repos
              </div>
            )}
          </div>

          {developer.company && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Building className="w-4 h-4 mr-1" />
              {developer.company}
            </div>
          )}

          {developer.blog && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-1" />
              <a
                href={developer.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {developer.blog}
              </a>
            </div>
          )}

          {developer.email && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-1" />
              <a
                href={`mailto:${developer.email}`}
                className="hover:text-blue-600 transition-colors"
              >
                {developer.email}
              </a>
            </div>
          )}

          {developer.languages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Languages & Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {developer.languages.map((language) => (
                  <span
                    key={language}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {developer.repositories.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Repositories</h4>
              <div className="space-y-2">
                {developer.repositories.slice(0, 3).map((repo, index) => (
                  <div key={index} className="bg-gray-50 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{repo.name}</h5>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        {repo.stars > 0 && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {repo.stars}
                          </div>
                        )}
                        {repo.forks > 0 && (
                          <div className="flex items-center">
                            <GitFork className="w-3 h-3 mr-1" />
                            {repo.forks}
                          </div>
                        )}
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-gray-600 mt-1">{repo.description}</p>
                    )}
                    {repo.language && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Agent Actions */}
          {showAgentActions && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                AI Agent Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                {onGenerateEmail && (
                  <button
                    onClick={() => onGenerateEmail(developer)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Generate Email
                  </button>
                )}
                
                {onAnalyzeProfile && (
                  <button
                    onClick={() => onAnalyzeProfile(developer)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Brain className="w-3 h-3 mr-1" />
                    Analyze Profile
                  </button>
                )}
                
                {onFindSimilar && (
                  <button
                    onClick={() => onFindSimilar(developer)}
                    className="flex items-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Search className="w-3 h-3 mr-1" />
                    Find Similar
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-2 italic">
                ✨ Powered by AI agents - each button triggers a specialized AI workflow
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}