'use client';

import { useState } from 'react';
import { Developer } from '@/types';
import { X, MessageSquare, Brain, Search, Sparkles, Copy, CheckCircle } from 'lucide-react';

interface AgentWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: Developer;
  agentType: 'email' | 'analyze' | 'similar';
}

export default function AgentWorkflowModal({ isOpen, onClose, developer, agentType }: AgentWorkflowModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const agentConfig = {
    email: {
      title: '📧 Email Generation Agent',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      description: 'AI agent specialized in crafting personalized recruitment emails',
    },
    analyze: {
      title: '🧠 Profile Analysis Agent', 
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      description: 'AI agent that analyzes developer profiles and provides insights',
    },
    similar: {
      title: '🔍 Similar Developer Agent',
      icon: Search, 
      color: 'from-green-500 to-green-600',
      description: 'AI agent that finds developers with similar skills and experience',
    },
  };

  const config = agentConfig[agentType];
  const Icon = config.icon;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult('');

    try {
      const response = await fetch('/api/agent-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: agentType,
          developer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      } else {
        setResult('Error: Failed to generate result. Please check your API configuration.');
      }
    } catch (error) {
      setResult('Error: Network error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">{config.title}</h2>
                <p className="text-blue-100 text-sm">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Developer Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={developer.avatarUrl || `https://github.com/${developer.githubUsername}.png`}
                alt={developer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                <p className="text-gray-600 text-sm">@{developer.githubUsername}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {developer.languages.slice(0, 3).map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!result && (
            <div className="text-center mb-6">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${config.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    AI Agent Working...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start AI Agent
                  </>
                )}
              </button>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                <span className="text-gray-700">AI agent is analyzing and generating...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Agent Result
                </h3>
                <button
                  onClick={handleCopy}
                  className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    copied
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {result}
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}